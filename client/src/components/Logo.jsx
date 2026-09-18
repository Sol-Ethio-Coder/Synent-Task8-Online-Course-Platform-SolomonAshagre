import React from 'react';
import { motion } from 'framer-motion';

/**
 * STCA's real logo image (uploaded by the founder), rendered with the same
 * hover-pop + slow glow-pulse effect the earlier hand-drawn SVG version had.
 * CSS drop-shadow filters and framer-motion animations work identically on
 * an <img> as they did on inline SVG, so the "awesome effects" carry over.
 */
export default function Logo({ size = 40, animated = true, className = '' }) {
  if (!animated) {
    return (
      <img
        src="/logo.png"
        alt="Sol Tutoring And Coding Academy"
        width={size}
        height={size}
        className={`object-contain ${className}`}
      />
    );
  }

  return (
    <motion.img
      src="/logo.png"
      alt="Sol Tutoring And Coding Academy"
      width={size}
      height={size}
      className={`object-contain ${className}`}
      whileHover={{ scale: 1.08 }}
      animate={{
        filter: [
          'drop-shadow(0 0 1px rgba(245,158,11,0.3))',
          'drop-shadow(0 0 6px rgba(245,158,11,0.55))',
          'drop-shadow(0 0 1px rgba(245,158,11,0.3))'
        ]
      }}
      transition={{
        scale: { type: 'spring', stiffness: 300, damping: 15 },
        filter: { duration: 3, repeat: Infinity, ease: 'easeInOut' }
      }}
      style={{ willChange: 'filter, transform' }}
    />
  );
}
