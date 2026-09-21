const express = require('express');
const { getReviews, submitReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:courseId/reviews', getReviews);
router.post('/:courseId/reviews', protect, submitReview);

module.exports = router;
