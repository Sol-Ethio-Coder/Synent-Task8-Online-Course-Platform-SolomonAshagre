import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import ManualPaymentModal from '../components/ManualPaymentModal.jsx';

export default function CourseDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [submittedForReview, setSubmittedForReview] = useState(false);

  useEffect(() => {
    api.get(`/courses/${slug}`).then((res) => setCourse(res.data)).catch(() => setError('Course not found'));
  }, [slug]);

  const handleChapaEnroll = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setError('');
    setEnrolling(true);
    try {
      const { data } = await api.post('/enrollments/order', { courseId: course._id });

      if (data.free) {
        navigate('/dashboard');
        return;
      }

      // Chapa checkout happens on Chapa's own hosted page — redirect the whole tab there.
      // The user picks Telebirr, CBE Birr, HelloCash, or card once they land on it.
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err.response?.data?.message || 'Could not start enrollment. Please try again.');
      setEnrolling(false);
    }
  };

  const handleManualClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    setShowManualModal(true);
  };

  if (error && !course) {
    return <div className="max-w-3xl mx-auto px-5 py-20 text-center text-ink/60">{error}</div>;
  }
  if (!course) {
    return <div className="max-w-3xl mx-auto px-5 py-20 text-center text-ink/40">Loading course...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-5 py-14 grid md:grid-cols-3 gap-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:col-span-2"
      >
        <span className="text-xs font-medium text-forest-600 bg-forest-50 px-2 py-1 rounded-full capitalize">
          {course.category.replace('-', ' · ')}
        </span>
        <h1 className="text-3xl font-display font-semibold text-ink mt-4">{course.title}</h1>
        <p className="text-ink/70 mt-4 leading-relaxed">{course.description}</p>

        <h2 className="font-display font-semibold text-xl mt-10 mb-4">Course content</h2>
        <div className="space-y-3">
          {course.modules?.map((mod, i) => (
            <div key={mod._id || i} className="border border-forest-100 rounded-xl p-4">
              <p className="font-medium text-ink">{i + 1}. {mod.title}</p>
              <ul className="mt-2 space-y-1">
                {mod.lessons?.map((lesson, j) => (
                  <li key={lesson._id || j} className="text-sm text-ink/60 flex justify-between">
                    <span>▸ {lesson.title}</span>
                    {lesson.duration && <span>{lesson.duration}</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white border border-forest-100 rounded-2xl p-6 h-fit sticky top-24"
      >
        <p className="text-3xl font-display font-semibold text-forest-700">
          {course.isFree || course.price === 0 ? 'Free' : `${course.price} ETB`}
        </p>
        <p className="text-sm text-ink/50 capitalize mt-1">{course.level} level</p>

        {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

        {submittedForReview ? (
          <div className="mt-6 bg-forest-50 border border-forest-100 rounded-xl p-4 text-center">
            <p className="text-sm text-forest-700 font-medium">Receipt submitted ✓</p>
            <p className="text-xs text-ink/50 mt-1">We'll review it and activate your course shortly.</p>
          </div>
        ) : course.isFree || course.price === 0 ? (
          <button
            onClick={handleChapaEnroll}
            disabled={enrolling}
            className="w-full mt-6 bg-forest-700 text-white py-3 rounded-full font-medium hover:bg-forest-600 transition-colors disabled:opacity-60"
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </button>
        ) : (
          <div className="mt-6 space-y-2.5">
            <button
              onClick={handleChapaEnroll}
              disabled={enrolling}
              className="w-full bg-forest-700 text-white py-3 rounded-full font-medium hover:bg-forest-600 transition-colors disabled:opacity-60"
            >
              {enrolling ? 'Redirecting to checkout...' : 'Pay with Chapa'}
            </button>
            <button
              onClick={handleManualClick}
              className="w-full border border-forest-700 text-forest-700 py-3 rounded-full font-medium hover:bg-forest-50 transition-colors"
            >
              Pay via bank / mobile transfer
            </button>
          </div>
        )}

        <p className="text-xs text-ink/40 mt-3 text-center">
          Chapa: Telebirr, CBE Birr, HelloCash, or card. Or transfer directly and upload your receipt.
        </p>
      </motion.div>

      {showManualModal && (
        <ManualPaymentModal
          course={course}
          onClose={() => setShowManualModal(false)}
          onSubmitted={() => {
            setShowManualModal(false);
            setSubmittedForReview(true);
          }}
        />
      )}
    </div>
  );
}
