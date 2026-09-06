import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios.js';
import CourseCard from '../components/CourseCard.jsx';

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (category) params.category = category;
      if (level) params.level = level;
      const { data } = await api.get('/courses', { params });
      setCourses(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(fetchCourses, 300); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, level]);

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-display font-semibold text-ink mb-2"
      >
        All courses
      </motion.h1>
      <p className="text-ink/60 mb-8">Structured coding tracks and tutoring programs, online and offline.</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-10">
        <input
          type="text"
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-forest-100 rounded-full px-5 py-2.5 text-sm focus:outline-none focus:border-forest-400"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border border-forest-100 rounded-full px-4 py-2.5 text-sm bg-white"
        >
          <option value="">All categories</option>
          <option value="coding-online">Coding · Online</option>
          <option value="coding-offline">Coding · Offline</option>
          <option value="tutoring-online">Tutoring · Online</option>
          <option value="tutoring-offline">Tutoring · Offline</option>
        </select>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="border border-forest-100 rounded-full px-4 py-2.5 text-sm bg-white"
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {loading ? (
        <p className="text-ink/50">Loading courses...</p>
      ) : courses.length === 0 ? (
        <p className="text-ink/50">No courses match your search yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
