// Run with: npm run seed:admin
// Set ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME env vars before running,
// or edit the defaults below.
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.env.ADMIN_EMAIL || 'admin@stca.com';
  const password = process.env.ADMIN_PASSWORD || 'ChangeMe123!';
  const name = process.env.ADMIN_NAME || 'STCA Admin';

  const existing = await User.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const admin = await User.create({ name, email, password, role: 'admin', isEmailVerified: true });
  console.log(`Admin created: ${admin.email} (password: ${password}) — change this password after first login.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
