const asyncHandler = require('express-async-handler');
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');
const User = require('../models/User');

// @route GET /api/admin/analytics
const getAnalytics = asyncHandler(async (req, res) => {
  const paidEnrollments = await Enrollment.find({ status: 'paid' }).select('amountPaid course createdAt');

  const totalRevenue = paidEnrollments.reduce((sum, e) => sum + (e.amountPaid || 0), 0);
  const totalStudents = await User.countDocuments({ role: 'student' });
  const totalCourses = await Course.countDocuments({ published: true });

  // Revenue and enrollment count by month, last 6 months
  const monthly = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    monthly[key] = { label: key, revenue: 0, enrollments: 0 };
  }
  paidEnrollments.forEach((e) => {
    const key = new Date(e.createdAt).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    if (monthly[key]) {
      monthly[key].revenue += e.amountPaid || 0;
      monthly[key].enrollments += 1;
    }
  });

  // Top courses by paid-enrollment count
  const countByCourse = {};
  paidEnrollments.forEach((e) => {
    const key = e.course.toString();
    countByCourse[key] = (countByCourse[key] || 0) + 1;
  });
  const topCourseIds = Object.entries(countByCourse)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => id);
  const topCoursesData = await Course.find({ _id: { $in: topCourseIds } }).select('title');
  const topCourses = topCourseIds.map((id) => ({
    title: topCoursesData.find((c) => c._id.toString() === id)?.title || '(deleted course)',
    enrollments: countByCourse[id]
  }));

  // Exam pass rate across all students' attempts
  const usersWithAttempts = await User.find({ 'enrolledCourses.examAttempts': { $gt: 0 } }).select('enrolledCourses');
  let totalAttempted = 0;
  let totalPassed = 0;
  let certificatesIssued = 0;
  usersWithAttempts.forEach((u) => {
    u.enrolledCourses.forEach((e) => {
      if (e.examAttempts > 0) {
        totalAttempted += 1;
        if (e.examPassed) {
          totalPassed += 1;
          certificatesIssued += 1;
        }
      }
    });
  });
  const examPassRate = totalAttempted ? Math.round((totalPassed / totalAttempted) * 100) : 0;

  res.json({
    totalRevenue,
    totalStudents,
    totalCourses,
    certificatesIssued,
    examPassRate,
    monthly: Object.values(monthly),
    topCourses
  });
});

module.exports = { getAnalytics };
