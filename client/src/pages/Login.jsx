import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white border border-forest-100 rounded-2xl p-8"
      >
        <h1 className="text-2xl font-display font-semibold text-ink">Welcome back</h1>
        <p className="text-sm text-ink/60 mt-1">Log in to continue learning.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-forest-700 text-white py-2.5 rounded-full font-medium hover:bg-forest-600 transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm">
          <Link to="/forgot-password" className="text-forest-700 hover:underline">Forgot password?</Link>
          <Link to="/register" className="text-forest-700 hover:underline">Create account</Link>
        </div>
      </motion.div>
    </div>
  );
}
