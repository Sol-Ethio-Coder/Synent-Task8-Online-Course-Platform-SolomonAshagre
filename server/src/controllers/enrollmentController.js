const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const axios = require('axios');
const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const User = require('../models/User');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

const CHAPA_BASE_URL = 'https://api.chapa.co/v1';

function chapaHeaders() {
  if (!process.env.CHAPA_SECRET_KEY) {
    const err = new Error('Chapa is not configured. Set CHAPA_SECRET_KEY in .env');
    err.statusCode = 500;
    throw err;
  }
  return {
    Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
    'Content-Type': 'application/json'
  };
}

function generateTxRef(courseId) {
  return `stca-${courseId}-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
}

// @route POST /api/enrollments/order
// Body: { courseId }
// Creates a Chapa transaction and returns a checkout_url the frontend redirects to.
// The user picks Telebirr, CBE Birr, HelloCash, or card on Chapa's own hosted page.
const createOrder = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  const existing = await Enrollment.findOne({ user: req.user._id, course: courseId, status: 'paid' });
  if (existing) {
    res.status(400);
    throw new Error('You are already enrolled in this course');
  }

  // Free courses skip Chapa entirely
  if (course.isFree || course.price === 0) {
    await Enrollment.findOneAndUpdate(
      { user: req.user._id, course: courseId },
      { amountPaid: 0, status: 'paid' },
      { upsert: true, new: true }
    );
    await addCourseToUser(req.user._id, courseId);
    await notifyEnrollment(req.user, course);
    return res.json({ free: true });
  }

  const txRef = generateTxRef(courseId);
  const [firstName, ...rest] = req.user.name.split(' ');

  const payload = {
    amount: String(course.price),
    currency: 'ETB',
    email: req.user.email,
    first_name: firstName || req.user.name,
    last_name: rest.join(' ') || firstName || 'Student',
    tx_ref: txRef,
    callback_url: `${process.env.SERVER_URL}/api/enrollments/webhook`,
    return_url: `${process.env.CLIENT_URL}/payment/callback?tx_ref=${txRef}`,
    customization: {
      title: 'STCA Enrollment',
      description: `Enrollment: ${course.title}`.slice(0, 60) // Chapa caps this field's length
    }
  };

  let checkoutUrl;
  try {
    const { data } = await axios.post(`${CHAPA_BASE_URL}/transaction/initialize`, payload, {
      headers: chapaHeaders()
    });
    checkoutUrl = data.data.checkout_url;
  } catch (err) {
    console.error('Chapa initialize failed:', err.response?.data || err.message);
    res.status(502);
    throw new Error('Could not start payment with Chapa. Please try again.');
  }

  await Enrollment.findOneAndUpdate(
    { user: req.user._id, course: courseId },
    {
      amountPaid: course.price,
      currency: 'ETB',
      chapaTxRef: txRef,
      chapaCheckoutUrl: checkoutUrl,
      status: 'created'
    },
    { upsert: true, new: true }
  );

  res.json({ free: false, checkoutUrl, txRef });
});

// Shared logic: verify a tx_ref with Chapa and finalize the enrollment if paid.
// Safe to call more than once (from both the webhook and the return_url page) —
// only acts the first time a given transaction is confirmed paid.
async function finalizeIfPaid(txRef) {
  const enrollment = await Enrollment.findOne({ chapaTxRef: txRef }).populate('course').populate('user');
  if (!enrollment) return { found: false };
  if (enrollment.status === 'paid') return { found: true, alreadyPaid: true, enrollment };

  const { data } = await axios.get(`${CHAPA_BASE_URL}/transaction/verify/${txRef}`, {
    headers: chapaHeaders()
  });

  if (data.status === 'success' && data.data.status === 'success') {
    enrollment.status = 'paid';
    await enrollment.save();
    await addCourseToUser(enrollment.user._id, enrollment.course._id);
    await notifyEnrollment(enrollment.user, enrollment.course);
    return { found: true, alreadyPaid: false, enrollment };
  }

  enrollment.status = 'failed';
  await enrollment.save();
  return { found: true, failed: true, enrollment };
}

// @route POST /api/enrollments/webhook
// Chapa calls this server-to-server once a transaction completes.
// Not behind `protect` — Chapa isn't sending your users' JWTs.
const chapaWebhook = asyncHandler(async (req, res) => {
  const txRef = req.body?.tx_ref;
  if (!txRef) return res.status(400).json({ message: 'Missing tx_ref' });

  try {
    await finalizeIfPaid(txRef);
    res.status(200).json({ received: true });
  } catch (err) {
    console.error('Chapa webhook processing failed:', err.message);
    res.status(200).json({ received: true }); // ack anyway so Chapa doesn't retry-storm
  }
});

// @route GET /api/enrollments/verify/:txRef
// Called by the frontend's return_url page as a fallback in case the webhook
// hasn't landed yet (e.g. testing locally without a public callback URL).
const verifyByTxRef = asyncHandler(async (req, res) => {
  const result = await finalizeIfPaid(req.params.txRef);
  if (!result.found) {
    res.status(404);
    throw new Error('No matching transaction found');
  }
  res.json({
    status: result.enrollment.status,
    course: result.enrollment.course?.title
  });
});

// @route GET /api/enrollments/my-courses
const getMyCourses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('enrolledCourses.course');
  res.json(user.enrolledCourses);
});

// ---- helpers ----

async function addCourseToUser(userId, courseId) {
  const user = await User.findById(userId);
  const already = user.enrolledCourses.some((e) => e.course.toString() === courseId.toString());
  if (!already) {
    user.enrolledCourses.push({ course: courseId });
    await user.save();
  }
}

function notifyEnrollment(user, course) {
  // Fire-and-forget: this is awaited from the Chapa webhook and the
  // return_url verify endpoint — both should respond quickly regardless of
  // SMTP being slow or unreachable (e.g. Render's free-tier SMTP port block).
  sendEmail({
    to: user.email,
    subject: `You're enrolled in ${course.title}`,
    html: emailTemplates.enrollmentConfirmation(user.name, course.title)
  });
}

module.exports = { createOrder, chapaWebhook, verifyByTxRef, getMyCourses };