import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
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

  return (
    <div className="max-w-md mx-auto px-5 py-24 text-center">
      <div className="bg-white border border-forest-100 rounded-2xl p-8">
        {status === 'checking' && (
          <>
            <h1 className="text-xl font-display font-semibold text-ink">Confirming your payment...</h1>
            <p className="text-ink/60 mt-3 text-sm">This only takes a moment.</p>
          </>
        )}
        {status === 'paid' && (
          <>
            <h1 className="text-2xl font-display font-semibold text-forest-700">Payment successful 🎉</h1>
            <p className="text-ink/65 mt-3">
              You're enrolled{courseName ? ` in ${courseName}` : ''}. It's now available on your dashboard.
            </p>
            <Link to="/dashboard" className="inline-block mt-6 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
              Go to dashboard
            </Link>
          </>
        )}
        {status === 'failed' && (
          <>
            <h1 className="text-2xl font-display font-semibold text-red-600">Payment not completed</h1>
            <p className="text-ink/65 mt-3">Your payment wasn't successful. No charge should have been made — you can try again.</p>
            <Link to="/courses" className="inline-block mt-6 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
              Back to courses
            </Link>
          </>
        )}
        {status === 'error' && (
          <>
            <h1 className="text-xl font-display font-semibold text-ink">Couldn't confirm this transaction</h1>
            <p className="text-ink/65 mt-3 text-sm">
              If an amount was deducted, check your dashboard — it may have gone through. Otherwise, contact support.
            </p>
            <Link to="/dashboard" className="inline-block mt-6 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
              Go to dashboard
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
