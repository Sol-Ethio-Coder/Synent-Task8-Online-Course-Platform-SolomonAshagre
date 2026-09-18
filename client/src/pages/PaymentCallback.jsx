import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const txRef = searchParams.get('tx_ref');
  const [status, setStatus] = useState('checking'); // checking | paid | failed | error
  const [courseName, setCourseName] = useState('');

  useEffect(() => {
    if (!txRef) {
      setStatus('error');
      return;
    }
    // The webhook usually finalizes this already — this call is a fallback
    // (and confirms status immediately for the user waiting on this page).
    api
      .get(`/enrollments/verify/${txRef}`)
      .then((res) => {
        setStatus(res.data.status === 'paid' ? 'paid' : 'failed');
        setCourseName(res.data.course || '');
      })
      .catch(() => setStatus('error'));
  }, [txRef]);

  const HoverLink = ({ to, children }) => (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block mt-6">
      <Link to={to} className="inline-block bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
        {children}
      </Link>
    </motion.div>
  );

  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-forest-100 rounded-2xl p-8"
      >
        <AnimatePresence mode="wait">
          {status === 'checking' && (
            <motion.div key="checking" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h1 className="text-xl font-display font-semibold text-ink">Confirming your payment...</h1>
              <p className="text-ink/60 mt-3 text-sm">This only takes a moment.</p>
            </motion.div>
          )}
          {status === 'paid' && (
            <motion.div key="paid" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <h1 className="text-2xl font-display font-semibold text-forest-700">Payment successful 🎉</h1>
              <p className="text-ink/65 mt-3">
                You're enrolled{courseName ? ` in ${courseName}` : ''}. It's now available on your dashboard.
              </p>
              <HoverLink to="/dashboard">Go to dashboard</HoverLink>
            </motion.div>
          )}
          {status === 'failed' && (
            <motion.div key="failed" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <h1 className="text-2xl font-display font-semibold text-red-600">Payment not completed</h1>
              <p className="text-ink/65 mt-3">Your payment wasn't successful. No charge should have been made — you can try again.</p>
              <HoverLink to="/courses">Back to courses</HoverLink>
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <h1 className="text-xl font-display font-semibold text-ink">Couldn't confirm this transaction</h1>
              <p className="text-ink/65 mt-3 text-sm">
                If an amount was deducted, check your dashboard — it may have gone through. Otherwise, contact support.
              </p>
              <HoverLink to="/dashboard">Go to dashboard</HoverLink>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
