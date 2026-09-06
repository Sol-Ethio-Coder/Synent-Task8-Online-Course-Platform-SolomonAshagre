import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="max-w-md mx-auto px-5 py-24 text-center">
        <h1 className="text-2xl font-display font-semibold text-ink">Check your inbox</h1>
        <p className="text-ink/65 mt-3">
          We've sent a verification link to <strong>{form.email}</strong>. Verify your email, then head to your dashboard.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium"
        >
          Go to dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-forest-100 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-display font-semibold text-ink">Create your account</h1>
        <p className="text-sm text-ink/60 mt-1">Start learning with STCA today.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Full name</label>
            <input
              type="text" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input
              type="email" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <input
              type="password" required minLength={6} value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-forest-700 text-white py-2.5 rounded-full font-medium hover:bg-forest-600 transition-colors disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="text-sm mt-4 text-center">
          Already have an account? <Link to="/login" className="text-forest-700 hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
