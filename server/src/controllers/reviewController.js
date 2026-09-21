const asyncHandler = require('express-async-handler');
const Review = require('../models/Review');
const Course = require('../models/Course');

async function recomputeCourseRating(courseId) {
  const reviews = await Review.find({ course: courseId }).select('rating');
  const reviewCount = reviews.length;
  const avgRating = reviewCount ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount : 0;
  await Course.findByIdAndUpdate(courseId, {
    avgRating: Math.round(avgRating * 10) / 10,
    reviewCount
  });
}

// @route GET /api/courses/:courseId/reviews
// Public — shown on the course details page.
const getReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ course: req.params.courseId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  res.json(reviews);
});

// @route POST /api/courses/:courseId/reviews
// Body: { rating, comment }. Enrolled students only — one review per user
// per course; submitting again updates the existing one.
const submitReview = asyncHandler(async (req, res) => {
  const { courseId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    res.status(400);
    throw new Error('Rating must be between 1 and 5');
  }

  const isEnrolled = req.user.enrolledCourses.some((e) => e.course.toString() === courseId);
  if (!isEnrolled) {
    res.status(403);
    throw new Error('You must be enrolled in this course to leave a review');
  }

  const review = await Review.findOneAndUpdate(
    { user: req.user._id, course: courseId },
    { rating, comment: comment || '' },
    { upsert: true, new: true }
  );

  await recomputeCourseRating(courseId);

  res.status(201).json(review);
});

module.exports = { getReviews, submitReview };
