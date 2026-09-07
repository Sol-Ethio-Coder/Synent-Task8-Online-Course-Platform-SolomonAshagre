const express = require('express');
const { getPublicStats } = require('../controllers/statsController');

const router = express.Router();

router.get('/', getPublicStats);

module.exports = router;
