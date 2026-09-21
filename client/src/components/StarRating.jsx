import React from 'react';
import { motion } from 'framer-motion';

/**
 * `value` renders filled stars up to that number (rounded to nearest whole
 * star for the read-only display). Pass `onChange` to make it an
 * interactive 1-5 picker instead.
 */
export default function StarRating({ value = 0, onChange, size = 'text-base' }) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = typeof onChange === 'function';

  return (
    <div className={`flex gap-0.5 ${size}`}>
      {stars.map((n) =>
        interactive ? (
          <motion.button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            className="leading-none"
            aria-label={`Rate ${n} star${n > 1 ? 's' : ''}`}
          >
            <span className={n <= value ? 'text-sun-500' : 'text-ink/20'}>★</span>
          </motion.button>
        ) : (
          <span key={n} className={n <= Math.round(value) ? 'text-sun-500' : 'text-ink/20'}>
            ★
          </span>
        )
      )}
    </div>
  );
}
