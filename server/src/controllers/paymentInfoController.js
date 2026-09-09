const asyncHandler = require('express-async-handler');

// @route GET /api/payment-info
// Public — powers the "pay via bank/mobile transfer" instructions shown to
// students. Deliberately read from env vars, not hardcoded, since these are
// real financial account details that shouldn't live in source code/git.
const getPaymentInfo = asyncHandler(async (req, res) => {
  res.json({
    telebirrNumber: process.env.PAYMENT_TELEBIRR_NUMBER || null,
    cbeAccountNumber: process.env.PAYMENT_CBE_ACCOUNT_NUMBER || null,
    cbeAccountName: process.env.PAYMENT_CBE_ACCOUNT_NAME || null,
    accountHolderName: process.env.PAYMENT_ACCOUNT_HOLDER_NAME || null
  });
});

module.exports = { getPaymentInfo };
