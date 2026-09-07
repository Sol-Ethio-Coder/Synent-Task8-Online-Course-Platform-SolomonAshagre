const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  // Nodemailer's defaults can hang for minutes if the SMTP port is silently
  // dropped by a host firewall (e.g. Render's free-tier SMTP block). These
  // callers no longer block the response either way, but a fast failure
  // still means less time wasted per attempt and cleaner logs.
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000
});

/**
 * Send an email. Fails silently (logs only) so a broken email config
 * never blocks registration/enrollment flows during development.
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'Sol Tutoring And Coding Academy <no-reply@stca.com>',
      to,
      subject,
      html
    });
  } catch (err) {
    console.error(`Email send failed to ${to}:`, err.message);
  }
};

const emailTemplates = {
  verifyEmail: (name, link) => `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Welcome to STCA, ${name} 👋</h2>
      <p>Please verify your email to activate your account.</p>
      <a href="${link}" style="background:#1F4B3F;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">Verify Email</a>
      <p style="color:#888;font-size:13px">This link expires in 24 hours.</p>
    </div>`,
  resetPassword: (name, link) => `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Password reset requested</h2>
      <p>Hi ${name}, click below to set a new password. If you didn't request this, ignore this email.</p>
      <a href="${link}" style="background:#1F4B3F;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;display:inline-block">Reset Password</a>
      <p style="color:#888;font-size:13px">This link expires in 1 hour.</p>
    </div>`,
  enrollmentConfirmation: (name, courseTitle) => `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>You're enrolled! 🎉</h2>
      <p>Hi ${name}, your enrollment in <strong>${courseTitle}</strong> is confirmed. It's now available on your dashboard.</p>
    </div>`,
  registrationWelcome: (name) => `
    <div style="font-family:sans-serif;max-width:480px;margin:auto">
      <h2>Welcome aboard, ${name} 🎓</h2>
      <p>Thanks for registering with Sol Tutoring And Coding Academy. Browse our courses and start learning today.</p>
    </div>`
};

module.exports = { sendEmail, emailTemplates };