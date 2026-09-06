const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Enrollment = require('../models/Enrollment');

// @route GET /api/admin/users
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @route GET /api/admin/enrollments
const getAllEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find({})
    .populate('user', 'name email')
    .populate('course', 'title price')
    .sort({ createdAt: -1 });
  res.json(enrollments);
});

module.exports = { getAllUsers, getAllEnrollments };
