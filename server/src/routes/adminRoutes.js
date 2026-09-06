const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin
} = require('../controllers/courseController');
const { getAllUsers, getAllEnrollments } = require('../controllers/adminController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/courses', getAllCoursesAdmin);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/users', getAllUsers);
router.get('/enrollments', getAllEnrollments);

module.exports = router;
