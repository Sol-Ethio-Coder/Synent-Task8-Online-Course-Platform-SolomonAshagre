import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api/axios.js';

export default function AiLessonAssist({ courseId, lesson, content, onGenerated }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState({}); // { [exerciseIndex]: optionIndex }

  const handleGenerate = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.post(`/ai/lesson/${courseId}/${lesson._id}`);
      onGenerated(lesson._id, { explanation: data.explanation, exercises: data.exercises });
      setSelected({});
    } catch (err) {
      setError(err.response?.data?.message || 'Could not generate AI content right now.');
    } finally {
      setLoading(false);
    }
  };

  if (!content) {
    return (
      <div className="mt-6 bg-forest-50 border border-forest-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-ink/70">
          Video not loading, or want a written explanation and practice questions instead?
        </p>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="mt-4 bg-forest-700 text-white px-5 py-2.5 rounded-full text-sm font-medium disabled:opacity-60"
        >
          {loading ? 'Generating...' : '✨ Generate AI explanation & practice'}
        </button>
        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-6 bg-white border border-forest-100 rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-forest-700 bg-forest-50 px-2 py-1 rounded-full">✨ AI Explanation</span>
      </div>
      <p className="text-sm text-ink/75 leading-relaxed whitespace-pre-line">{content.explanation}</p>

      {content.exercises?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-forest-50">
          <h3 className="font-display font-semibold text-ink mb-4">Practice questions</h3>
          <div className="space-y-5">
            {content.exercises.map((ex, qi) => {
              const pickedIndex = selected[qi];
              const hasAnswered = pickedIndex !== undefined;
              return (
                <div key={qi}>
                  <p className="text-sm font-medium text-ink mb-2">{qi + 1}. {ex.question}</p>
                  <div className="space-y-1.5">
                    {ex.options.map((opt, oi) => {
                      const isCorrect = oi === ex.correctIndex;
                      const isPicked = oi === pickedIndex;
                      let style = 'border-forest-100 hover:bg-forest-50/60';
                      if (hasAnswered && isCorrect) style = 'border-forest-400 bg-forest-50 text-forest-700';
                      else if (hasAnswered && isPicked && !isCorrect) style = 'border-red-300 bg-red-50 text-red-700';

                      return (
                        <button
                          key={oi}
                          disabled={hasAnswered}
                          onClick={() => setSelected((prev) => ({ ...prev, [qi]: oi }))}
                          className={`w-full text-left text-sm px-3 py-2 rounded-lg border transition-colors ${style} disabled:cursor-default`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {hasAnswered && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="text-xs text-ink/60 mt-2 pl-1"
                      >
                        {pickedIndex === ex.correctIndex ? '✓ Correct — ' : '✗ Not quite — '}
                        {ex.explanation}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </motion.div>
  );
}
