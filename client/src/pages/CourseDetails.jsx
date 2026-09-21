import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import ManualPaymentModal from '../components/ManualPaymentModal.jsx';
import CourseThumbnail from '../components/CourseThumbnail.jsx';
import StarRating from '../components/StarRating.jsx';

export default function CourseDetails() {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState('');
  const [showManualModal, setShowManualModal] = useState(false);
  const [submittedForReview, setSubmittedForReview] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSaved, setReviewSaved] = useState(false);

  useEffect(() => {
    api.get(`/courses/${slug}`).then((res) => setCourse(res.data)).catch(() => setError('Course not found'));
  }, [slug]);

  useEffect(() => {
    if (!course?._id) return;
    api.get(`/courses/${course._id}/reviews`).then((res) => {
      setReviews(res.data);
      const mine = user && res.data.find((r) => r.user?._id === user._id);
      if (mine) {
        setMyRating(mine.rating);
        setMyComment(mine.comment || '');
      }
    });
  }, [course?._id, user]);

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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (myRating === 0) {
      setReviewError('Pick a star rating first.');
      return;
    }
    setReviewError('');
    setSubmittingReview(true);
    try {
      await api.post(`/courses/${course._id}/reviews`, { rating: myRating, comment: myComment });
      setReviewSaved(true);
      const { data } = await api.get(`/courses/${course._id}/reviews`);
      setReviews(data);
      setTimeout(() => setReviewSaved(false), 2500);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Could not save your review.');
    } finally {
      setSubmittingReview(false);
    }
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
        <div className="h-56 rounded-2xl overflow-hidden mb-6">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <CourseThumbnail title={course.title} category={course.category} curriculum={course.curriculum} />
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-medium text-forest-600 bg-forest-50 px-2 py-1 rounded-full capitalize">
            {course.category.replace('-', ' · ')}
          </span>
          {course.reviewCount > 0 && (
            <span className="flex items-center gap-1.5 text-sm text-ink/60">
              <StarRating value={course.avgRating} />
              <span>{course.avgRating.toFixed(1)} ({course.reviewCount} review{course.reviewCount !== 1 ? 's' : ''})</span>
            </span>
          )}
        </div>
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

        <h2 className="font-display font-semibold text-xl mt-10 mb-4">Reviews</h2>

        {user && (
          <form onSubmit={handleSubmitReview} className="bg-white border border-forest-100 rounded-2xl p-5 mb-6">
            <p className="text-sm font-medium text-ink mb-2">
              {myRating > 0 ? 'Update your review' : 'Leave a review'}
            </p>
            <StarRating value={myRating} onChange={setMyRating} size="text-2xl" />
            <textarea
              value={myComment}
              onChange={(e) => setMyComment(e.target.value)}
              placeholder="What did you think of this course? (optional)"
              rows={2}
              maxLength={1000}
              className="w-full mt-3 border border-forest-100 rounded-lg px-3 py-2 text-sm"
            />
            {reviewError && <p className="text-sm text-red-600 mt-2">{reviewError}</p>}
            <motion.button
              type="submit"
              disabled={submittingReview}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-3 bg-forest-700 text-white px-5 py-2 rounded-full text-sm font-medium disabled:opacity-60"
            >
              {submittingReview ? 'Saving...' : reviewSaved ? 'Saved ✓' : 'Submit review'}
            </motion.button>
            <p className="text-xs text-ink/40 mt-2">You must be enrolled in this course to leave a review.</p>
          </form>
        )}

        {reviews.length === 0 ? (
          <p className="text-sm text-ink/40">No reviews yet — be the first!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <motion.div
                key={r._id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="border border-forest-100 rounded-xl p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-ink">{r.user?.name || 'Anonymous'}</p>
                  <StarRating value={r.rating} />
                </div>
                {r.comment && <p className="text-sm text-ink/65 mt-2">{r.comment}</p>}
              </motion.div>
            ))}
          </div>
        )}
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
          <motion.button
            onClick={handleChapaEnroll}
            disabled={enrolling}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full mt-6 bg-forest-700 text-white py-3 rounded-full font-medium disabled:opacity-60"
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now'}
          </motion.button>
        ) : (
          <div className="mt-6 space-y-2.5">
            <motion.button
              onClick={handleChapaEnroll}
              disabled={enrolling}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-forest-700 text-white py-3 rounded-full font-medium disabled:opacity-60"
            >
              {enrolling ? 'Redirecting to checkout...' : 'Pay with Chapa'}
            </motion.button>
            <motion.button
              onClick={handleManualClick}
              whileHover={{ scale: 1.03, backgroundColor: 'rgba(31,75,63,0.04)' }}
              whileTap={{ scale: 0.97 }}
              className="w-full border border-forest-700 text-forest-700 py-3 rounded-full font-medium"
            >
              Pay via bank / mobile transfer
            </motion.button>
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
