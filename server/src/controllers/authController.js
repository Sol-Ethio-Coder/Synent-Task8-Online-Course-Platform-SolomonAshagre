const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { sendEmail, emailTemplates } = require('../utils/sendEmail');

// @route POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password });

  const rawToken = user.generateEmailVerifyToken();
  await user.save();

  const verifyLink = `${process.env.CLIENT_URL}/verify-email/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Verify your STCA account',
    html: emailTemplates.verifyEmail(user.name, verifyLink)
  });
  await sendEmail({
    to: user.email,
    subject: 'Welcome to Sol Tutoring And Coding Academy',
    html: emailTemplates.registrationWelcome(user.name)
  });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    token: generateToken(user._id, user.role)
  });
});

// @route POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isEmailVerified: user.isEmailVerified,
    token: generateToken(user._id, user.role)
  });
});

// @route GET /api/auth/verify-email/:token
const verifyEmail = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    emailVerifyToken: hashed,
    emailVerifyExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Verification link is invalid or has expired');
  }

  user.isEmailVerified = true;
  user.emailVerifyToken = undefined;
  user.emailVerifyExpires = undefined;
  await user.save();

  res.json({ message: 'Email verified successfully' });
});

// @route POST /api/auth/forgot-password
const forgotPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  // Always respond the same way, whether or not the account exists (avoid email enumeration)
  if (!user) {
    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  }

  const rawToken = user.generatePasswordResetToken();
  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
  await sendEmail({
    to: user.email,
    subject: 'Reset your STCA password',
    html: emailTemplates.resetPassword(user.name, resetLink)
  });

  res.json({ message: 'If that email exists, a reset link has been sent.' });
});

// @route POST /api/auth/reset-password/:token
const resetPassword = asyncHandler(async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');

  const user = await User.findOne({
    resetPasswordToken: hashed,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Reset link is invalid or has expired');
  }

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful. You can now log in.' });
});

// @route GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @route PUT /api/auth/change-password
// Requires the current password to prevent someone with a hijacked session
// from locking the real owner out.
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error('Current password and new password are required');
  }
  if (newPassword.length < 6) {
    res.status(400);
    throw new Error('New password must be at least 6 characters');
  }

  const user = await User.findById(req.user._id).select('+password');
  const matches = await user.matchPassword(currentPassword);
  if (!matches) {
    res.status(401);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password updated successfully' });
});

module.exports = { register, login, verifyEmail, forgotPassword, resetPassword, getMe, changePassword };
