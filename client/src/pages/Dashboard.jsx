import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import { useAuth } from '../context/AuthContext.jsx';
import ProgressBar from '../components/ProgressBar.jsx';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/enrollments/my-courses')
      .then((res) => setEnrollments(res.data))
      .finally(() => setLoading(false));
  }, []);

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

      {loading ? (
        <p className="text-ink/50 mt-10">Loading your courses...</p>
      ) : enrollments.length === 0 ? (
        <div className="mt-12 bg-forest-50 border border-forest-100 rounded-2xl p-10 text-center">
          <p className="text-ink/70">You haven't enrolled in any courses yet.</p>
          <Link to="/courses" className="inline-block mt-4 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {enrollments.map((enr, i) => (
            <motion.div
              key={enr.course?._id || i}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
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
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
