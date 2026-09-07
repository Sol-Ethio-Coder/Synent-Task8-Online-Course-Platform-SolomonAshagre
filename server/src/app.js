require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');
const progressRoutes = require('./routes/progressRoutes');
const adminRoutes = require('./routes/adminRoutes');
const aiRoutes = require('./routes/aiRoutes');
const tutoringRoutes = require('./routes/tutoringRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Serverless functions can be invoked many times per second across separate
// instances. Without caching, each invocation would open a fresh MongoDB
// connection and never close it, quickly exhausting Atlas's connection limit.
// This caches the connection promise across invocations within the same
// warm instance. Local dev (server.js) also calls this once at boot.
let cachedConnection = null;
async function connectDB() {
  if (cachedConnection) return cachedConnection;
  cachedConnection = mongoose.connect(process.env.MONGO_URI).then((conn) => {
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  });
  return cachedConnection;
}

const app = express();

// Render (and most PaaS hosts) sit in front of the app as a reverse proxy.
// Without this, express-rate-limit can't safely trust X-Forwarded-For to
// identify individual clients, which throws the ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
// warning and can misidentify everyone as the same client.
app.set('trust proxy', 1);

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Ensure a DB connection exists before handling any request (no-op once cached)
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ message: 'Database connection failed' });
  }
});

// Basic rate limiting on auth routes to slow down brute-force attempts
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 50 });
app.use('/api/auth', authLimiter);

// The chatbot has no auth in front of it, so it needs its own tighter limit
// to stop it from being used to burn through the Groq free-tier quota.
const chatLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 30 });
app.use('/api/ai/chat', chatLimiter);

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'STCA API' }));

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tutoring', tutoringRoutes);
app.use('/api/stats', statsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
});

// Central error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

module.exports = app;
