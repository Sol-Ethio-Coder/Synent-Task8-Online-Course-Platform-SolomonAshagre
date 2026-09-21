import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProgressBar from '../components/ProgressBar.jsx';
import PathwayJourney from '../components/PathwayJourney.jsx';

const BADGE_INFO = {
  first_lesson: { icon: '🎯', label: 'First lesson complete' },
  streak_3: { icon: '🔥', label: '3-day streak' },
  streak_7: { icon: '🔥', label: '7-day streak' },
  streak_30: { icon: '🔥', label: '30-day streak' },
  first_certificate: { icon: '🏅', label: 'First certificate' },
  course_complete: { icon: '🎓', label: 'Course completed' },
  five_courses: { icon: '⭐', label: '5+ courses enrolled' }
};

const XP_PER_LEVEL = 100;
// Ranks stages so a student with multiple courses in the same curriculum
// shows their BEST status there, not whichever enrollment happened to be
// checked last.
const STATUS_RANK = { 'not-started': 0, 'in-progress': 1, completed: 2 };

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [pending, setPending] = useState([]);
  const [streak, setStreak] = useState({ currentStreak: 0, longestStreak: 0, badges: [], xp: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/enrollments/my-courses'), api.get('/enrollments/my-pending'), api.get('/auth/me')])
      .then(([enrRes, pendingRes, meRes]) => {
        setEnrollments(enrRes.data);
        setPending(pendingRes.data);
        setStreak({
          currentStreak: meRes.data.currentStreak || 0,
          longestStreak: meRes.data.longestStreak || 0,
          badges: meRes.data.badges || [],
          xp: meRes.data.xp || 0
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const level = Math.floor(streak.xp / XP_PER_LEVEL) + 1;
  const xpIntoLevel = streak.xp % XP_PER_LEVEL;

  // Build { curriculumKey: 'not-started' | 'in-progress' | 'completed' }
  // from the student's real enrollments, for the personalized PathwayJourney.
  const progressByStage = {};
  enrollments.forEach((enr) => {
    const curriculum = enr.course?.curriculum;
    if (!curriculum || curriculum === 'General') return;
    const status = enr.examPassed ? 'completed' : enr.progressPercent > 0 ? 'in-progress' : 'not-started';
    if (!progressByStage[curriculum] || STATUS_RANK[status] > STATUS_RANK[progressByStage[curriculum]]) {
      progressByStage[curriculum] = status;
    }
  });
  const hasCurriculumProgress = Object.keys(progressByStage).length > 0;

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-display font-semibold text-ink"
      >
        Welcome back, {user?.name?.split(' ')[0]}
      </motion.h1>
      <p className="text-ink/60 mt-2">Pick up where you left off.</p>

      {!loading && (streak.currentStreak > 0 || streak.badges.length > 0 || streak.xp > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-6 bg-forest-700 text-white rounded-2xl p-5 flex flex-wrap items-center gap-6"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔥</span>
            <div>
              <p className="font-display font-semibold text-lg leading-none">{streak.currentStreak} day{streak.currentStreak !== 1 ? 's' : ''}</p>
              <p className="text-xs text-white/60">Current streak · best: {streak.longestStreak}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 min-w-[140px]">
            <span className="text-2xl">✨</span>
            <div className="flex-1">
              <p className="font-display font-semibold text-lg leading-none">Level {level}</p>
              <div className="w-28 h-1.5 bg-white/15 rounded-full mt-1.5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${xpIntoLevel}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="h-full bg-sun-400 rounded-full"
                />
              </div>
              <p className="text-[11px] text-white/60 mt-1">{xpIntoLevel} / {XP_PER_LEVEL} XP · {streak.xp} total</p>
            </div>
          </div>

          {streak.badges.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              {streak.badges.map((key) => {
                const b = BADGE_INFO[key];
                if (!b) return null;
                return (
                  <motion.span
                    key={key}
                    whileHover={{ scale: 1.1, y: -2 }}
                    title={b.label}
                    className="bg-white/10 text-sm px-2.5 py-1 rounded-full flex items-center gap-1 cursor-default"
                  >
                    {b.icon} <span className="hidden sm:inline">{b.label}</span>
                  </motion.span>
                );
              })}
            </div>
          )}
        </motion.div>
      )}

      {!loading && hasCurriculumProgress && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-6 bg-white border border-forest-100 rounded-2xl p-6"
        >
          <h2 className="font-display font-semibold text-lg text-ink mb-1">Your learning journey</h2>
          <p className="text-xs text-ink/50 mb-2">How far you've come across each curriculum track.</p>
          <PathwayJourney progressByStage={progressByStage} />
        </motion.div>
      )}

      {loading ? (
        <p className="text-ink/50 mt-10">Loading your courses...</p>
      ) : (
        <>
          {pending.length > 0 && (
            <div className="mt-8 space-y-3">
              {pending.map((p) => (
                <div
                  key={p._id}
                  className={`rounded-xl p-4 border flex items-center justify-between ${
                    p.status === 'rejected'
                      ? 'bg-red-50 border-red-200'
                      : 'bg-amber-50 border-amber-200'
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-ink">{p.course?.title}</p>
                    <p className={`text-xs mt-0.5 ${p.status === 'rejected' ? 'text-red-600' : 'text-amber-700'}`}>
                      {p.status === 'rejected'
                        ? `Payment not approved${p.rejectionReason ? `: ${p.rejectionReason}` : ''}`
                        : 'Payment under review — usually reviewed within a few hours'}
                    </p>
                  </div>
                  {p.status === 'rejected' && (
                    <Link to={`/courses`} className="text-xs font-medium text-forest-700 hover:underline whitespace-nowrap">
                      Try again
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}

          {enrollments.length === 0 && pending.length === 0 ? (
            <div className="mt-12 bg-forest-50 border border-forest-100 rounded-2xl p-10 text-center">
              <p className="text-ink/70">You haven't enrolled in any courses yet.</p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="inline-block mt-4">
                <Link to="/courses" className="inline-block bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
                  Browse courses
                </Link>
              </motion.div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
              {enrollments.map((enr, i) => (
                <motion.div
                  key={enr.course?._id || i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -3 }}
                  className="bg-white border border-forest-100 rounded-2xl p-6"
                >
                  <h3 className="font-display font-semibold text-lg text-ink">{enr.course?.title}</h3>
                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-ink/50 mb-1.5">
                      <span>Progress</span>
                      <span>{enr.progressPercent || 0}%</span>
                    </div>
                    <ProgressBar percent={enr.progressPercent || 0} />
                  </div>
                  <Link
                    to={`/learn/${enr.course?._id}`}
                    className="inline-block mt-5 text-sm font-medium text-forest-700 hover:underline"
                  >
                    {enr.progressPercent > 0 ? 'Continue learning →' : 'Start learning →'}
                  </Link>
                  {enr.examPassed && (
                    <Link
                      to={`/certificate/${enr.course?._id}`}
                      className="block mt-1.5 text-sm font-medium text-sun-500 hover:underline"
                    >
                      🎓 View certificate
                    </Link>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
