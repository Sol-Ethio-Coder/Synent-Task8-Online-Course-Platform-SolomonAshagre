import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-forest-100 rounded-2xl p-8"
      >
        <AnimatePresence mode="wait">
          {status === 'loading' && (
            <motion.p key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-ink/60">
              Verifying your email...
            </motion.p>
          )}
          {status === 'success' && (
            <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <h1 className="text-2xl font-display font-semibold text-forest-700">Email verified 🎉</h1>
              <p className="text-ink/65 mt-3">{message}</p>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <h1 className="text-2xl font-display font-semibold text-red-600">Verification failed</h1>
              <p className="text-ink/65 mt-3">{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block mt-6">
          <Link to="/dashboard" className="inline-block bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
            Go to dashboard
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
