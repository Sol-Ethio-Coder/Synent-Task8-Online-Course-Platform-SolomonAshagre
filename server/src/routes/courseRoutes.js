const express = require('express');
const { getCourses, getCourseBySlug } = require('../controllers/courseController');

const router = express.Router();

router.get('/', getCourses);
router.get('/:slug', getCourseBySlug);

module.exports = router;
