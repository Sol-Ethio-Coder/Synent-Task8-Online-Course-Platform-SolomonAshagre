import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios.js';

export default function VerifyEmail() {
  const { token } = useParams();
  const [status, setStatus] = useState('loading'); // loading | success | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    api
      .get(`/auth/verify-email/${token}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data.message);
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed');
      });
  }, [token]);

  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <div className="bg-white border border-forest-100 rounded-2xl p-8">
        {status === 'loading' && <p className="text-ink/60">Verifying your email...</p>}
        {status === 'success' && (
          <>
            <h1 className="text-2xl font-display font-semibold text-forest-700">Email verified 🎉</h1>
            <p className="text-ink/65 mt-3">{message}</p>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-2xl font-display font-semibold text-red-600">Verification failed</h1>
            <p className="text-ink/65 mt-3">{message}</p>
          </>
        )}
        <Link to="/dashboard" className="inline-block mt-6 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}
