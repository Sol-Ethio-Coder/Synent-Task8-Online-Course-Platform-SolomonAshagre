import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/axios.js';

export default function Account() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (form.newPassword !== form.confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 6) {
      setError('New password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      });
      setSuccess(data.message || 'Password updated');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-16">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-display font-semibold text-ink">Account</h1>
        <p className="text-ink/60 mt-2 text-sm">
          Signed in as <strong>{user?.name}</strong> ({user?.email})
          {user?.role === 'admin' && <span className="ml-2 text-xs bg-forest-50 text-forest-700 px-2 py-0.5 rounded-full">Admin</span>}
        </p>

        <div className="bg-white border border-forest-100 rounded-2xl p-6 mt-8">
          <h2 className="font-display font-semibold text-lg text-ink mb-4">Change password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-ink/70">Current password</label>
              <input
                type="password" required value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">New password</label>
              <input
                type="password" required minLength={6} value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Confirm new password</label>
              <input
                type="password" required minLength={6} value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}
            {success && <p className="text-sm text-forest-700">{success}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full bg-forest-700 text-white py-2.5 rounded-full font-medium hover:bg-forest-600 transition-colors disabled:opacity-60"
            >
              {loading ? 'Updating...' : 'Update password'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
