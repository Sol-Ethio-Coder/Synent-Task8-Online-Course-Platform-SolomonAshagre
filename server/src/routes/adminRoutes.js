const express = require('express');
const { protect, adminOnly } = require('../middleware/auth');
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCoursesAdmin
} = require('../controllers/courseController');
const {
  getAllUsers,
  getAllEnrollments,
  getPendingEnrollments,
  approveEnrollment,
  rejectEnrollment
} = require('../controllers/adminController');
const { addTutoringImage, deleteTutoringImage } = require('../controllers/tutoringController');

const router = express.Router();

router.use(protect, adminOnly);

router.get('/courses', getAllCoursesAdmin);
router.post('/courses', createCourse);
router.put('/courses/:id', updateCourse);
router.delete('/courses/:id', deleteCourse);

router.get('/users', getAllUsers);
router.get('/enrollments', getAllEnrollments);

router.get('/pending-enrollments', getPendingEnrollments);
router.post('/enrollments/:id/approve', approveEnrollment);
router.post('/enrollments/:id/reject', rejectEnrollment);

router.post('/tutoring-images', addTutoringImage);
router.delete('/tutoring-images/:id', deleteTutoringImage);

module.exports = router;
