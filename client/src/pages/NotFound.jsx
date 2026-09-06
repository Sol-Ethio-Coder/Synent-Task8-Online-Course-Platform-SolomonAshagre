import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-5 py-28 text-center">
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-6xl font-display font-semibold text-forest-700"
      >
        404
      </motion.p>
      <p className="text-ink/60 mt-3">This page doesn't exist — let's get you back on track.</p>
      <Link to="/" className="inline-block mt-6 bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium">
        Back to home
      </Link>
    </div>
  );
}
