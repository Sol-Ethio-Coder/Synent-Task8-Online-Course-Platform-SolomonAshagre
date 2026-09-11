const express = require('express');
const {
  createOrder,
  chapaWebhook,
  verifyByTxRef,
  getMyCourses,
  submitManualPayment,
  getMyPendingEnrollments
} = require('../controllers/enrollmentController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/order', protect, createOrder);
router.get('/my-courses', protect, getMyCourses);
router.get('/my-pending', protect, getMyPendingEnrollments);
router.get('/verify/:txRef', protect, verifyByTxRef);
router.post('/manual', protect, submitManualPayment);

// Public: Chapa calls this server-to-server, no user JWT attached
router.post('/webhook', chapaWebhook);

module.exports = router;
