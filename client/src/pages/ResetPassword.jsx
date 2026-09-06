import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setDone(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset link is invalid or expired');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-24">
      <div className="bg-white border border-forest-100 rounded-2xl p-8">
        <h1 className="text-2xl font-display font-semibold text-ink">Set a new password</h1>

        {done ? (
          <p className="text-sm text-forest-700 mt-4">Password updated. Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input
              type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New password"
              className="w-full border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button
              type="submit" disabled={loading}
              className="w-full bg-forest-700 text-white py-2.5 rounded-full font-medium disabled:opacity-60"
            >
              {loading ? 'Saving...' : 'Save new password'}
            </button>
          </form>
        )}

        <p className="text-sm mt-4 text-center">
          <Link to="/login" className="text-forest-700 hover:underline">Back to login</Link>
        </p>
      </div>
    </div>
  );
}
