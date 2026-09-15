import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';

export default function VerifyCertificate() {
  const { certificateId: paramId } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(paramId || '');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const runVerify = async (id) => {
    if (!id.trim()) return;
    setLoading(true);
    setChecked(false);
    try {
      const { data } = await api.get(`/exam/verify/${encodeURIComponent(id.trim())}`);
      setResult(data);
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
      setChecked(true);
    }
  };

  useEffect(() => {
    if (paramId) runVerify(paramId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/verify-certificate/${encodeURIComponent(input.trim())}`);
  };

  return (
    <div className="max-w-md mx-auto px-5 py-20">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-display font-semibold text-ink text-center">Verify a certificate</h1>
        <p className="text-sm text-ink/60 text-center mt-2">
          Paste a certificate ID to confirm it was issued by Sol Tutoring And Coding Academy.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. STCA-A1B2C3-D4E5F6-7A8B9C"
            className="flex-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-forest-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-forest-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium disabled:opacity-60 whitespace-nowrap"
          >
            {loading ? 'Checking...' : 'Verify'}
          </button>
        </form>

        {checked && result && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-6 rounded-xl p-5 border ${
              result.valid ? 'bg-forest-50 border-forest-100' : 'bg-red-50 border-red-200'
            }`}
          >
            {result.valid ? (
              <>
                <p className="text-forest-700 font-medium text-sm flex items-center gap-1.5">
                  <span>✓</span> Valid certificate
                </p>
                <div className="mt-3 space-y-1.5 text-sm text-ink/75">
                  <p><strong className="text-ink">Student:</strong> {result.studentName}</p>
                  <p><strong className="text-ink">Course:</strong> {result.courseTitle}</p>
                  {result.curriculum && result.curriculum !== 'General' && (
                    <p><strong className="text-ink">Track:</strong> {result.curriculum} · {result.level}</p>
                  )}
                  <p><strong className="text-ink">Score:</strong> {result.score}%</p>
                  <p><strong className="text-ink">Issued:</strong> {new Date(result.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </>
            ) : (
              <p className="text-red-600 font-medium text-sm">
                ✕ No matching certificate found. Double-check the ID and try again.
              </p>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
