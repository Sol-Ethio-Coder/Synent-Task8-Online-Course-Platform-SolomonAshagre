const express = require('express');
const { getPaymentInfo } = require('../controllers/paymentInfoController');

const router = express.Router();

router.get('/', getPaymentInfo);

module.exports = router;
