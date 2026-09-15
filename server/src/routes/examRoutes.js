const express = require('express');
const { getExam, submitExam, getCertificate, verifyCertificate } = require('../controllers/examController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public — no auth. Registered before the /:courseId pattern for clarity,
// though Express already disambiguates by segment count either way.
router.get('/verify/:certificateId', verifyCertificate);

router.get('/:courseId', protect, getExam);
router.post('/:courseId/submit', protect, submitExam);
router.get('/:courseId/certificate', protect, getCertificate);

module.exports = router;
