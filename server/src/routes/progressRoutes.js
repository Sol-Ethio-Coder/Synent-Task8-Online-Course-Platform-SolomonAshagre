const express = require('express');
const { markLessonComplete } = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/:courseId/lessons/:lessonId/complete', protect, markLessonComplete);

module.exports = router;
