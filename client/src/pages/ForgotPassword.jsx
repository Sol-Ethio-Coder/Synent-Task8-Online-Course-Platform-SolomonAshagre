import React, { useState } from 'react';
import api from '../api/axios.js';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-5 py-24">
      <div className="bg-white border border-forest-100 rounded-2xl p-8">
        <h1 className="text-2xl font-display font-semibold text-ink">Reset your password</h1>
        <p className="text-sm text-ink/60 mt-1">Enter your email and we'll send a reset link.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email" required value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
          />
          <button
            type="submit" disabled={loading}
            className="w-full bg-forest-700 text-white py-2.5 rounded-full font-medium disabled:opacity-60"
          >
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        {message && <p className="text-sm text-forest-700 mt-4">{message}</p>}
      </div>
    </div>
  );
}
