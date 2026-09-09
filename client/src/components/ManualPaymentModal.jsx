import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ManualPaymentModal({ course, onClose, onSubmitted }) {
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/payment-info').then((res) => setPaymentInfo(res.data)).catch(() => setPaymentInfo({}));
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;
    if (selected.size > 5 * 1024 * 1024) {
      setError('Image is too large — please use a screenshot under 5MB.');
      return;
    }
    setError('');
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleSubmit = async () => {
    if (!file) {
      setError('Please attach a screenshot of your payment receipt.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const base64 = await fileToBase64(file);
      await api.post('/enrollments/manual', { courseId: course._id, receiptImage: base64 });
      onSubmitted();
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your receipt. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-lg text-ink">Pay via bank / mobile transfer</h2>
          <button onClick={onClose} className="text-ink/40 hover:text-ink text-xl leading-none">✕</button>
        </div>

        <p className="text-sm text-ink/60 mb-4">
          Send <strong>{course.price} ETB</strong> using one of the accounts below, then upload a screenshot
          of the confirmation. We'll review it and activate <strong>{course.title}</strong> on your dashboard —
          usually within a few hours.
        </p>

        {!paymentInfo ? (
          <p className="text-sm text-ink/40">Loading payment details...</p>
        ) : (
          <div className="bg-forest-50 border border-forest-100 rounded-xl p-4 space-y-2.5 mb-5 text-sm">
            {paymentInfo.telebirrNumber && (
              <div className="flex justify-between">
                <span className="text-ink/60">Telebirr</span>
                <span className="font-medium text-ink">{paymentInfo.telebirrNumber}</span>
              </div>
            )}
            {paymentInfo.cbeAccountNumber && (
              <div className="flex justify-between">
                <span className="text-ink/60">CBE account</span>
                <span className="font-medium text-ink">{paymentInfo.cbeAccountNumber}</span>
              </div>
            )}
            {paymentInfo.cbeAccountName && (
              <div className="flex justify-between">
                <span className="text-ink/60">Account name</span>
                <span className="font-medium text-ink">{paymentInfo.cbeAccountName}</span>
              </div>
            )}
            {!paymentInfo.telebirrNumber && !paymentInfo.cbeAccountNumber && (
              <p className="text-ink/50">Payment details aren't set up yet — please contact us directly.</p>
            )}
          </div>
        )}

        <label className="block text-sm font-medium text-ink/70 mb-2">Upload receipt screenshot</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm border border-forest-100 rounded-lg px-3 py-2 mb-3"
        />

        <AnimatePresence>
          {preview && (
            <motion.img
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              src={preview}
              alt="Receipt preview"
              className="w-full rounded-lg border border-forest-100 mb-3 max-h-48 object-contain bg-forest-50"
            />
          )}
        </AnimatePresence>

        {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-forest-700 text-white py-2.5 rounded-full font-medium disabled:opacity-60"
        >
          {submitting ? 'Submitting...' : 'Submit for review'}
        </button>
      </motion.div>
    </motion.div>
  );
}
