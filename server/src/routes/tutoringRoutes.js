const express = require('express');
const { getTutoringImages } = require('../controllers/tutoringController');

const router = express.Router();

router.get('/images', getTutoringImages);

module.exports = router;
