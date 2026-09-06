const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');

// @route GET /api/courses?search=&category=&level=
const getCourses = asyncHandler(async (req, res) => {
  const { search, category, level } = req.query;
  const filter = { published: true };

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (search) filter.$text = { $search: search };

  const courses = await Course.find(filter)
    .select('title slug shortDescription thumbnail category level price isFree')
    .sort({ createdAt: -1 });

  res.json(courses);
});

// @route GET /api/courses/:slug
const getCourseBySlug = asyncHandler(async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug, published: true });
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json(course);
});

// ---- Admin ----

// @route POST /api/admin/courses
const createCourse = asyncHandler(async (req, res) => {
  const course = await Course.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(course);
});

// @route PUT /api/admin/courses/:id
const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json(course);
});

// @route DELETE /api/admin/courses/:id
const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findByIdAndDelete(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }
  res.json({ message: 'Course deleted' });
});

// @route GET /api/admin/courses  (includes unpublished, for admin listing)
const getAllCoursesAdmin = asyncHandler(async (req, res) => {
  const courses = await Course.find({}).sort({ createdAt: -1 });
  res.json(courses);
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin
};
