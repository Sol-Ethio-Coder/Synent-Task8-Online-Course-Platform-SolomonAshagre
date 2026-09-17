const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const { generateExamQuestions } = require('../utils/groqClient');

// @route GET /api/courses?search=&category=&level=&curriculum=
const getCourses = asyncHandler(async (req, res) => {
  const { search, category, level, curriculum } = req.query;
  const filter = { published: true };

  if (category) filter.category = category;
  if (level) filter.level = level;
  if (curriculum) filter.curriculum = curriculum;
  if (search) filter.$text = { $search: search };

  const courses = await Course.find(filter)
    .select('title slug shortDescription thumbnail category curriculum level price isFree')
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
// If the admin didn't write final exam questions themselves, generate them
// automatically via AI before saving — so every new course gets a real exam
// without requiring a separate manual step. Falls back gracefully (course
// still gets created) if AI generation fails for any reason.
const createCourse = asyncHandler(async (req, res) => {
  const courseData = { ...req.body };
  const hasExam = courseData.finalExam?.questions?.length > 0;

  if (!hasExam && courseData.title) {
    try {
      const questions = await generateExamQuestions({
        courseTitle: courseData.title,
        description: courseData.description,
        moduleTitles: (courseData.modules || []).map((m) => m.title).filter(Boolean),
        count: 8
      });
      courseData.finalExam = {
        questions,
        passingScorePercent: courseData.finalExam?.passingScorePercent || 70
      };
    } catch (err) {
      console.error('Auto exam generation on course create failed (course will be created without one):', err.response?.data || err.message);
      // Don't block course creation just because AI generation failed —
      // the admin can still generate/write one later from the editor.
    }
  }

  const course = await Course.create({ ...courseData, createdBy: req.user._id });
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

// @route POST /api/admin/generate-exam
// Body: { title, description, moduleTitles, count }. Stateless — works for a
// brand-new course still being drafted in the admin editor (no saved ID yet)
// as well as an existing one. Returns questions for the admin to review; does
// NOT save anything itself — the admin still has to click Save on the course.
const generateExam = asyncHandler(async (req, res) => {
  const { title, description, moduleTitles, count } = req.body;
  if (!title) {
    res.status(400);
    throw new Error('A course title is required to generate exam questions');
  }

  let questions;
  try {
    questions = await generateExamQuestions({
      courseTitle: title,
      description,
      moduleTitles,
      count: count || 8
    });
  } catch (err) {
    console.error('Exam generation failed:', err.response?.data || err.message);
    res.status(502);
    throw new Error('Could not generate exam questions right now. Please try again.');
  }

  res.json({ questions });
});

module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin,
  generateExam
};
