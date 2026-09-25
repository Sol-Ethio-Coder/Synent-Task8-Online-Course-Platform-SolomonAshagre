import React from 'react';
import { motion } from 'framer-motion';

/**
 * Wraps a page's content so navigating between routes animates as a
 * coordinated fade + slide, instead of every page just abruptly swapping in.
 * Used by App.jsx together with AnimatePresence, keyed on the route path.
 */
export default function PageTransition({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: 'easeInOut' }}
    >
      {children}
    </motion.div>
  );
}
