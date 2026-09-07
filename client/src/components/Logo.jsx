import React from 'react';
import { motion } from 'framer-motion';

/**
 * STCA shield logo — vector reconstruction of the brand mark (gradient
 * green→amber→rose shield, circuit-trace accents, split book/code icon).
 * `animated` adds a slow glow pulse + hover pop, used for in-app placements
 * (Navbar/Footer). The static favicon.svg mirrors this markup without motion,
 * since browsers don't reliably animate favicons.
 */
export default function Logo({ size = 40, animated = true, className = '' }) {
  const shieldContent = (
    <>
      <defs>
        <linearGradient id="stcaGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#22C55E" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#F43F5E" />
        </linearGradient>
        <filter id="stcaGlow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* circuit traces */}
      <g stroke="url(#stcaGradient)" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.85">
        <path d="M22 28 L12 28 L12 18" />
        <circle cx="12" cy="18" r="2.2" fill="url(#stcaGradient)" />
        <circle cx="8" cy="28" r="1.6" fill="url(#stcaGradient)" />
        <path d="M8 28 L4 28" />
        <path d="M78 28 L88 28 L88 18" />
        <circle cx="88" cy="18" r="2.2" fill="url(#stcaGradient)" />
        <circle cx="92" cy="28" r="1.6" fill="url(#stcaGradient)" />
        <path d="M92 28 L96 28" />
      </g>

      {/* shield */}
      <g filter="url(#stcaGlow)">
        <path
          d="M50 12 L80 22 L80 46 C80 66 68 80 50 90 C32 80 20 66 20 46 L20 22 Z"
          fill="#05070D"
          stroke="url(#stcaGradient)"
          strokeWidth="3.2"
          strokeLinejoin="round"
        />
      </g>

      {/* S monogram */}
      <text
        x="50"
        y="38"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="20"
        fill="#FFFFFF"
      >
        S
      </text>

      {/* split icon: book (left) + code (right) */}
      <g stroke="#FFFFFF" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M36 50 C33 48.5 30 48 27.5 48.5 L27.5 65 C30 64.5 33 65 36 66.5 Z" />
        <path d="M36 50 L36 66.5" />
      </g>
      <text
        x="63"
        y="63"
        textAnchor="middle"
        fontFamily="'Courier New', monospace"
        fontWeight="700"
        fontSize="13"
        fill="#FFFFFF"
      >
        {'</>'}
      </text>
    </>
  );

  if (!animated) {
    return (
      <svg viewBox="0 0 100 100" width={size} height={size} className={className} xmlns="http://www.w3.org/2000/svg">
        {shieldContent}
      </svg>
    );
  }

  return (
    <motion.svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
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
    >
      {shieldContent}
    </motion.svg>
  );
}
