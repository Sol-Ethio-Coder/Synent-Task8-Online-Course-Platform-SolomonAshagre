import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import Logo from '../components/Logo.jsx';

export default function Certificate() {
  const { courseId } = useParams();
  const [cert, setCert] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/exam/${courseId}/certificate`)
      .then((res) => setCert(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load certificate'))
      .finally(() => setLoading(false));
  }, [courseId]);

  if (loading) return <div className="max-w-2xl mx-auto px-5 py-20 text-center text-ink/40">Loading certificate...</div>;

  if (error) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <p className="text-ink/60">{error}</p>
        <Link to={`/exam/${courseId}`} className="text-forest-700 underline mt-3 inline-block">Take the final exam</Link>
      </div>
    );
  }

  const issuedDate = new Date(cert.issuedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-3xl mx-auto px-5 py-14">
      <div className="flex justify-end mb-4 print:hidden">
        <motion.button
          onClick={() => window.print()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
          className="bg-forest-700 text-white px-5 py-2.5 rounded-full text-sm font-medium"
        >
          Print / Save as PDF
        </motion.button>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="bg-white border-[3px] rounded-2xl p-10 sm:p-14 text-center relative overflow-hidden print:border-2 print:shadow-none"
        style={{ borderImage: 'linear-gradient(135deg, #22C55E, #F59E0B, #F43F5E) 1' }}
      >
        <div className="flex justify-center mb-6">
          <Logo size={56} animated={false} />
        </div>

        <p className="text-xs tracking-[0.2em] text-ink/40 uppercase">Certificate of Completion</p>
        <h1 className="font-display text-2xl sm:text-3xl font-semibold text-ink mt-3">
          Sol Tutoring And Coding Academy
        </h1>

        <p className="text-sm text-ink/50 mt-8">This certifies that</p>
        <p className="font-display text-3xl sm:text-4xl font-semibold text-forest-700 mt-2">{cert.studentName}</p>
        <p className="text-sm text-ink/50 mt-6">has successfully completed</p>
        <p className="font-display text-xl sm:text-2xl font-semibold text-ink mt-2">{cert.courseTitle}</p>
        {cert.curriculum && cert.curriculum !== 'General' && (
          <p className="text-xs text-forest-600 bg-forest-50 inline-block px-3 py-1 rounded-full mt-3">
            {cert.curriculum} · {cert.level}
          </p>
        )}
        <p className="text-sm text-ink/50 mt-4">with a final exam score of <strong className="text-ink">{cert.score}%</strong></p>

        <div className="grid sm:grid-cols-2 gap-8 mt-12 pt-8 border-t border-forest-100 text-left">
          <div>
            <p className="font-display italic text-lg text-ink">Solomon Ashagre</p>
            <div className="w-32 border-t border-ink/30 mt-1 pt-1">
              <p className="text-xs text-ink/50">Founder & CEO, STCA</p>
            </div>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-ink">{issuedDate}</p>
            <p className="text-xs text-ink/40 mt-1">Certificate ID: {cert.certificateId}</p>
          </div>
        </div>
      </motion.div>

      <p className="text-xs text-ink/40 text-center mt-6 print:hidden">
        This certificate can be{' '}
        <Link to={`/verify-certificate/${cert.certificateId}`} className="underline text-forest-700">
          verified online
        </Link>{' '}
        using its Certificate ID. Use the button above to save it as a PDF.
      </p>
    </div>
  );
}
