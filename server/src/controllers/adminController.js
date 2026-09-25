const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Review = require('../models/Review');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');
const { recomputeCourseRating } = require('./reviewController');

// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @route GET /api/admin/enrollments
const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({})
    .populate('user', 'name email')
    .populate('course', 'title price')
    .sort({ createdAt: -1 });
  res.json(enrollments);
});

// @route GET /api/admin/pending-enrollments
// Manual (bank/mobile transfer) submissions awaiting receipt review.
const getPendingEnrollments = asyncHandler(async (req, res) => {
  const pending = await Enrollment.find({ status: 'pending_review', paymentMethod: 'manual' })
    .populate('user', 'name email')
    .populate('course', 'title price')
    .sort({ createdAt: 1 }); // oldest first — first submitted, first reviewed
  res.json(pending);
});

// @route POST /api/admin/enrollments/:id/approve
const approveEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id).populate('user').populate('course');
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  enrollment.status = 'paid';
  enrollment.reviewedBy = req.user._id;
  enrollment.reviewedAt = new Date();
  await enrollment.save();

  const user = await User.findById(enrollment.user._id);
  const already = user.enrolledCourses.some((e) => e.course.toString() === enrollment.course._id.toString());
  if (!already) {
    user.enrolledCourses.push({ course: enrollment.course._id });
    await user.save();
  }

  sendEmail({
    to: enrollment.user.email,
    subject: `You're enrolled in ${enrollment.course.title}`,
    html: emailTemplates.enrollmentConfirmation(enrollment.user.name, enrollment.course.title)
  });

  res.json({ message: 'Enrollment approved', enrollment });
});

// @route POST /api/admin/enrollments/:id/reject
// Body: { reason }
const rejectEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id).populate('user').populate('course');
  if (!enrollment) {
    res.status(404);
    throw new Error('Enrollment not found');
  }

  enrollment.status = 'rejected';
  enrollment.reviewedBy = req.user._id;
  enrollment.reviewedAt = new Date();
  enrollment.rejectionReason = req.body.reason || 'Receipt could not be verified.';
  await enrollment.save();

  res.json({ message: 'Enrollment rejected', enrollment });
});

// @route GET /api/admin/exam-results
// Flattened view across all students of who has attempted/passed which
// course's final exam, for admin visibility (separate from payment records).
const getExamResults = asyncHandler(async (req, res) => {
  const users = await User.find({ 'enrolledCourses.examAttempts': { $gt: 0 } })
    .select('name email enrolledCourses')
    .populate('enrolledCourses.course', 'title');

  const results = [];
  for (const user of users) {
    for (const enr of user.enrolledCourses) {
      if (!enr.examAttempts) continue;
      results.push({
        studentName: user.name,
        studentEmail: user.email,
        // enr.course may be null if that course was later deleted
        courseTitle: enr.course?.title || '(deleted course)',
        examScore: enr.examScore,
        examAttempts: enr.examAttempts,
        examPassed: enr.examPassed,
        certificateId: enr.certificateId,
        certificateIssuedAt: enr.certificateIssuedAt
      });
    }
  }

  // Most recently attempted first
  results.sort((a, b) => new Date(b.certificateIssuedAt || 0) - new Date(a.certificateIssuedAt || 0));

  res.json(results);
});

// @route DELETE /api/admin/users/:id
// Cascade-deletes the user's enrollments and reviews (recomputing affected
// courses' cached ratings), then the user itself. Admins can't delete their
// own account this way — that would risk locking themselves out.
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (id === req.user._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account while logged in as it');
  }

  const user = await User.findById(id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    const adminCount = await User.countDocuments({ role: 'admin' });
    if (adminCount <= 1) {
      res.status(400);
      throw new Error('Cannot delete the last remaining admin account');
    }
  }

  const reviews = await Review.find({ user: id }).select('course');
  const affectedCourseIds = [...new Set(reviews.map((r) => r.course.toString()))];

  await Enrollment.deleteMany({ user: id });
  await Review.deleteMany({ user: id });
  await user.deleteOne();

  // Ratings are cached on Course for fast display — recompute the ones this
  // user's now-deleted reviews contributed to, so the average stays accurate.
  await Promise.all(affectedCourseIds.map((courseId) => recomputeCourseRating(courseId)));

  res.json({ message: 'User deleted' });
});

module.exports = {
  getAllUsers,
  getAllEnrollments,
  getPendingEnrollments,
  approveEnrollment,
  rejectEnrollment,
  getExamResults,
  deleteUser
};
