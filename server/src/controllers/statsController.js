const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @route GET /api/stats
// Public — powers the homepage stats row with real numbers instead of
// hardcoded marketing copy.
const getPublicStats = asyncHandler(async (req, res) => {
  const courses = await Course.find({ published: true }).select('modules');

  const courseTracks = courses.length;
  const totalLessons = courses.reduce(
    (sum, c) => sum + c.modules.reduce((mSum, m) => mSum + m.lessons.length, 0),
    0
  );

  res.json({
    courseTracks,
    totalLessons
  });
});

module.exports = { getPublicStats };
