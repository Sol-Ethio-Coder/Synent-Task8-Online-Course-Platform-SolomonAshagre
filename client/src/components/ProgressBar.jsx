import React from 'react';
import { motion } from 'framer-motion';

export default function ProgressBar({ percent = 0 }) {
  return (
    <div className="w-full h-2 bg-forest-100 rounded-full overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="h-full bg-sun-400 rounded-full"
      />
    </div>
  );
}
