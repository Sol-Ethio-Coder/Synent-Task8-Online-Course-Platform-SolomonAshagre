import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CourseThumbnail from './CourseThumbnail.jsx';
import StarRating from './StarRating.jsx';

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
        <div className="h-40 overflow-hidden">
          {course.thumbnail ? (
            <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
          ) : (
            <CourseThumbnail title={course.title} category={course.category} curriculum={course.curriculum} />
          )}
        </div>
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5">
            <span className="text-xs font-medium text-forest-600 bg-forest-50 px-2 py-1 rounded-full">
              {categoryLabels[course.category] || course.category}
            </span>
            {course.curriculum && course.curriculum !== 'General' && (
              <span className="text-xs font-medium text-sun-500 bg-sun-400/10 px-2 py-1 rounded-full">
                {course.curriculum}
              </span>
            )}
          </div>
          <h3 className="font-display font-semibold text-lg mt-3 text-ink">{course.title}</h3>
          {course.reviewCount > 0 && (
            <div className="flex items-center gap-1.5 mt-1">
              <StarRating value={course.avgRating} size="text-xs" />
              <span className="text-xs text-ink/50">({course.reviewCount})</span>
            </div>
          )}
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
