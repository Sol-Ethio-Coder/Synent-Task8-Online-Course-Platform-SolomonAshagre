const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Course = require('../models/Course');

// @route POST /api/progress/:courseId/lessons/:lessonId/complete
const markLessonComplete = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const user = await User.findById(req.user._id);
  const enrollment = user.enrolledCourses.find((e) => e.course.toString() === courseId);

  if (!enrollment) {
    res.status(403);
    throw new Error('You are not enrolled in this course');
  }

  const alreadyDone = enrollment.completedLessons.some((id) => id.toString() === lessonId);
  if (!alreadyDone) {
    enrollment.completedLessons.push(lessonId);
  }

  const course = await Course.findById(courseId);
  const totalLessons = course.getTotalLessons();
  enrollment.progressPercent = totalLessons
    ? Math.round((enrollment.completedLessons.length / totalLessons) * 100)
    : 0;

  await user.save();

  res.json({
    completedLessons: enrollment.completedLessons,
    progressPercent: enrollment.progressPercent
  });
});

module.exports = { markLessonComplete };
