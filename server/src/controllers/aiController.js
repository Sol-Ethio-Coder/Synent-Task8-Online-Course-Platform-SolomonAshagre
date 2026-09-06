const asyncHandler = require('express-async-handler');
const Course = require('../models/Course');
const { generateLessonContent, chatReply } = require('../utils/groqClient');

// @route POST /api/ai/lesson/:courseId/:lessonId
// Enrolled students only. Returns cached AI content if it already exists for
// this lesson; otherwise generates it once via Groq and saves it on the
// lesson so every future student gets it instantly with no extra API call.
const getOrGenerateLessonAssist = asyncHandler(async (req, res) => {
  const { courseId, lessonId } = req.params;

  const isEnrolled = req.user.enrolledCourses.some((e) => e.course.toString() === courseId);
  if (!isEnrolled && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You must be enrolled in this course to access AI study aids');
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(404);
    throw new Error('Course not found');
  }

  let targetLesson = null;
  let targetModule = null;
  for (const mod of course.modules) {
    const found = mod.lessons.id(lessonId);
    if (found) {
      targetLesson = found;
      targetModule = mod;
      break;
    }
  }
  if (!targetLesson) {
    res.status(404);
    throw new Error('Lesson not found');
  }

  // Already generated — serve the cached version, no API call needed.
  if (targetLesson.aiExplanation && targetLesson.aiExercises?.length) {
    return res.json({
      explanation: targetLesson.aiExplanation,
      exercises: targetLesson.aiExercises,
      cached: true
    });
  }

  let generated;
  try {
    generated = await generateLessonContent({
      courseTitle: course.title,
      moduleTitle: targetModule.title,
      lessonTitle: targetLesson.title,
      level: course.level
    });
  } catch (err) {
    console.error('Groq generation failed:', err.response?.data || err.message);
    res.status(502);
    throw new Error('Could not generate AI content right now. Please try again shortly.');
  }

  targetLesson.aiExplanation = generated.explanation;
  targetLesson.aiExercises = generated.exercises;
  targetLesson.aiGeneratedAt = new Date();
  await course.save();

  res.json({
    explanation: targetLesson.aiExplanation,
    exercises: targetLesson.aiExercises,
    cached: false
  });
});

// @route POST /api/ai/chat
// Public — powers the homepage visitor chatbot. No auth required since
// visitors ask questions before registering. Stateless: the frontend sends
// the full conversation each time, nothing is stored server-side.
const chatWithVisitor = asyncHandler(async (req, res) => {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400);
    throw new Error('messages array is required');
  }

  // Basic abuse guardrails: cap how much conversation and text a single
  // request can carry, since this endpoint has no auth in front of it.
  const trimmedHistory = messages.slice(-12).map((m) => ({
    role: m.role === 'assistant' ? 'assistant' : 'user',
    content: String(m.content || '').slice(0, 800)
  }));

  let reply;
  try {
    reply = await chatReply(trimmedHistory);
  } catch (err) {
    console.error('Groq chat failed:', err.response?.data || err.message);
    res.status(502);
    throw new Error('The assistant is unavailable right now. Please try again shortly, or reach us on Telegram.');
  }

  res.json({ reply });
});

module.exports = { getOrGenerateLessonAssist, chatWithVisitor };
