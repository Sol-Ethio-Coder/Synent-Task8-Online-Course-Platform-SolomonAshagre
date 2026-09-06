import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const categoryLabels = {
  'coding-online': 'Coding · Online',
  'coding-offline': 'Coding · Offline',
  'tutoring-online': 'Tutoring · Online',
  'tutoring-offline': 'Tutoring · Offline'
};

export default function CourseCard({ course }) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link
        to={`/courses/${course.slug}`}
        className="block bg-white rounded-2xl overflow-hidden border border-forest-100 shadow-sm hover:shadow-lg transition-shadow h-full"
      >
        <div className="h-40 bg-forest-100 flex items-center justify-center overflow-hidden">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <span className="font-display text-3xl text-forest-400">{course.title?.[0]}</span>
          )}
        </div>
        <div className="p-5">
          <span className="text-xs font-medium text-forest-600 bg-forest-50 px-2 py-1 rounded-full">
            {categoryLabels[course.category] || course.category}
          </span>
          <h3 className="font-display font-semibold text-lg mt-3 text-ink">{course.title}</h3>
          <p className="text-sm text-ink/60 mt-1 line-clamp-2">{course.shortDescription}</p>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-semibold text-forest-700">
              {course.isFree || course.price === 0 ? 'Free' : `${course.price} ETB`}
            </span>
            <span className="text-xs text-ink/50 capitalize">{course.level}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
