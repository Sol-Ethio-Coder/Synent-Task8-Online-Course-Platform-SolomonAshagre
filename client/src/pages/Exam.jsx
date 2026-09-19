import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';

export default function Exam() {
  const { courseId } = useParams();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get(`/exam/${courseId}`)
      .then((res) => setExam(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Could not load the exam'))
      .finally(() => setLoading(false));
  }, [courseId]);

  const handleSubmit = async () => {
    if (Object.keys(answers).length !== exam.questions.length) {
      setError('Please answer every question before submitting.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const orderedAnswers = exam.questions.map((_, i) => answers[i]);
      const { data } = await api.post(`/exam/${courseId}/submit`, { answers: orderedAnswers });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not submit your answers. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const retake = () => {
    setResult(null);
    setAnswers({});
  };

  if (loading) return <div className="max-w-2xl mx-auto px-5 py-20 text-center text-ink/40">Loading exam...</div>;
  if (error && !exam) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <p className="text-ink/60">{error}</p>
        <Link to="/dashboard" className="text-forest-700 underline mt-3 inline-block">Back to dashboard</Link>
      </div>
    );
  }

  if (result) {
    return (
      <div className="max-w-md mx-auto px-5 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-forest-100 rounded-2xl p-8"
        >
          <p className={`text-4xl font-display font-semibold ${result.passed ? 'text-forest-700' : 'text-red-600'}`}>
            {result.score}%
          </p>
          <p className="text-sm text-ink/60 mt-1">
            {result.correctCount} of {result.totalQuestions} correct
          </p>

          {result.passed ? (
            <>
              <p className="text-forest-700 font-medium mt-4">🎉 You passed!</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block mt-5">
                <Link
                  to={`/certificate/${courseId}`}
                  className="inline-block bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium"
                >
                  View your certificate
                </Link>
              </motion.div>
            </>
          ) : (
            <>
              <p className="text-red-600 font-medium mt-4">Not quite — you can try again.</p>
              <motion.button
                onClick={retake}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="inline-block mt-5 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium"
              >
                Retake exam
              </motion.button>
            </>
          )}

          <div className="mt-4">
            <Link to="/dashboard" className="text-sm text-ink/50 hover:underline">Back to dashboard</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-14">
      <h1 className="text-2xl font-display font-semibold text-ink">Final exam: {exam.courseTitle}</h1>
      <p className="text-sm text-ink/60 mt-2">
        {exam.totalQuestions} questions · pass with {exam.passingScorePercent}% or higher
      </p>

      {exam.previousResult?.examPassed && (
        <div className="mt-4 bg-forest-50 border border-forest-100 rounded-xl p-4 text-sm text-forest-700">
          You already passed this exam with {exam.previousResult.examScore}%.{' '}
          <Link to={`/certificate/${courseId}`} className="underline font-medium">View certificate</Link> or retake below.
        </div>
      )}

      <div className="mt-8 space-y-6">
        {exam.questions.map((q, qi) => (
          <motion.div
            key={qi}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: qi * 0.05, duration: 0.3 }}
            className="bg-white border border-forest-100 rounded-2xl p-5"
          >
            <p className="font-medium text-ink mb-3">{qi + 1}. {q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, oi) => (
                <label
                  key={oi}
                  className={`flex items-center gap-2.5 border rounded-lg px-3 py-2 text-sm cursor-pointer transition-colors ${
                    answers[qi] === oi ? 'border-forest-400 bg-forest-50' : 'border-forest-100 hover:bg-forest-50/50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`q-${qi}`}
                    checked={answers[qi] === oi}
                    onChange={() => setAnswers((prev) => ({ ...prev, [qi]: oi }))}
                  />
                  {opt}
                </label>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {error && <p className="text-sm text-red-600 mt-4">{error}</p>}

      <motion.button
        onClick={handleSubmit}
        disabled={submitting}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-8 bg-forest-700 text-white py-3 rounded-full font-medium disabled:opacity-60"
      >
        {submitting ? 'Submitting...' : 'Submit exam'}
      </motion.button>
    </div>
  );
}
