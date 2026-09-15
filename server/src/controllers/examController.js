const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const User = require('../models/User');

function findEnrollment(user, courseId) {
  return user.enrolledCourses.find((e) => e.course.toString() === courseId);
}

// @route GET /api/exam/:courseId
// Returns exam questions WITHOUT correctIndex/explanation, so students can't
// peek at answers via the network tab before submitting.
const getExam = asyncHandler(async (req, res) => {
  const { courseId } = req.params;

  const isEnrolled = req.user.enrolledCourses.some((e) => e.course.toString() === courseId);
  if (!isEnrolled) {
    res.status(403);
    throw new Error('You must be enrolled in this course to take the exam');
  }

  const course = await Course.findById(courseId).select('title finalExam');
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  if (!course.finalExam?.questions?.length) {
    res.status(404);
    throw new Error('This course does not have a final exam yet');
  }

  const enrollment = findEnrollment(req.user, courseId);

  res.json({
    courseTitle: course.title,
    passingScorePercent: course.finalExam.passingScorePercent,
    totalQuestions: course.finalExam.questions.length,
    questions: course.finalExam.questions.map((q) => ({
      question: q.question,
      options: q.options
    })),
    previousResult: enrollment
      ? {
          examPassed: enrollment.examPassed,
          examScore: enrollment.examScore,
          examAttempts: enrollment.examAttempts,
          certificateId: enrollment.certificateId
        }
      : null
  });
});

// @route POST /api/exam/:courseId/submit
// Body: { answers: [optionIndex, ...] } — same order as the questions returned above.
const submitExam = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { answers } = req.body;

  const course = await Course.findById(courseId).select('finalExam');
  if (!course || !course.finalExam?.questions?.length) {
    res.status(404);
    throw new Error('Exam not found for this course');
  }
  if (!Array.isArray(answers) || answers.length !== course.finalExam.questions.length) {
    res.status(400);
    throw new Error('Answers must match the number of exam questions');
  }

  const user = await User.findById(req.user._id);
  const enrollment = findEnrollment(user, courseId);
  if (!enrollment) {
    res.status(403);
    throw new Error('You must be enrolled in this course to take the exam');
  }

  const total = course.finalExam.questions.length;
  const correctCount = course.finalExam.questions.reduce(
    (count, q, i) => (answers[i] === q.correctIndex ? count + 1 : count),
    0
  );
  const score = Math.round((correctCount / total) * 100);
  const passed = score >= (course.finalExam.passingScorePercent || 70);

  enrollment.examScore = score;
  enrollment.examAttempts = (enrollment.examAttempts || 0) + 1;

  if (passed && !enrollment.examPassed) {
    enrollment.examPassed = true;
    enrollment.certificateId = `STCA-${courseId.slice(-6)}-${req.user._id.toString().slice(-6)}-${crypto
      .randomBytes(3)
      .toString('hex')}`.toUpperCase();
    enrollment.certificateIssuedAt = new Date();
  } else if (passed) {
    enrollment.examPassed = true; // already had a certificate, just re-confirm status
  }

  await user.save();

  res.json({
    score,
    correctCount,
    totalQuestions: total,
    passed,
    certificateId: enrollment.examPassed ? enrollment.certificateId : null
  });
});

// @route GET /api/exam/:courseId/certificate
const getCertificate = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const user = await User.findById(req.user._id).populate('enrolledCourses.course', 'title curriculum level category');
  const enrollment = findEnrollment(user, courseId);

  if (!enrollment || !enrollment.examPassed) {
    res.status(403);
    throw new Error('You need to pass the final exam before you can access this certificate');
  }

  res.json({
    studentName: user.name,
    courseTitle: enrollment.course.title,
    curriculum: enrollment.course.curriculum,
    level: enrollment.course.level,
    score: enrollment.examScore,
    certificateId: enrollment.certificateId,
    issuedAt: enrollment.certificateIssuedAt
  });
});

// @route GET /api/exam/verify/:certificateId
// Public — no login required. Anyone (e.g. an employer) can paste a
// certificate ID here to confirm it's real, without exposing anything about
// the student beyond what the certificate itself already shows.
const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  const user = await User.findOne({ 'enrolledCourses.certificateId': certificateId }).populate(
    'enrolledCourses.course',
    'title curriculum level'
  );

  if (!user) {
    return res.json({ valid: false });
  }

  const enrollment = user.enrolledCourses.find((e) => e.certificateId === certificateId);
  if (!enrollment || !enrollment.examPassed) {
    return res.json({ valid: false });
  }

  res.json({
    valid: true,
    studentName: user.name,
    courseTitle: enrollment.course.title,
    curriculum: enrollment.course.curriculum,
    level: enrollment.course.level,
    score: enrollment.examScore,
    issuedAt: enrollment.certificateIssuedAt,
    certificateId: enrollment.certificateId
  });
});

module.exports = { getExam, submitExam, getCertificate, verifyCertificate };
