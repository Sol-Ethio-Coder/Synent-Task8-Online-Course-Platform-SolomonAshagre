const express = require('express');
const { getOrGenerateLessonAssist, chatWithVisitor } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/lesson/:courseId/:lessonId', protect, getOrGenerateLessonAssist);

// Public — homepage visitor chatbot, no login required.
router.post('/chat', chatWithVisitor);

module.exports = router;
