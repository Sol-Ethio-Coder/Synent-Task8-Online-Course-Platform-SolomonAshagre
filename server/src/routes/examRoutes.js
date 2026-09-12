const express = require('express');
const { getExam, submitExam, getCertificate } = require('../controllers/examController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:courseId', protect, getExam);
router.post('/:courseId/submit', protect, submitExam);
router.get('/:courseId/certificate', protect, getCertificate);

module.exports = router;
