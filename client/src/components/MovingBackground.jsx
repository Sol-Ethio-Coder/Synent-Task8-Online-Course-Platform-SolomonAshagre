import React from 'react';
import { motion } from 'framer-motion';

/**
 * A slow-drifting "mesh gradient" background — several large, heavily
 * blurred color blobs that continuously move in independent loops. Reads as
 * a living, moving background without needing a video file or stock photo
 * (which would carry licensing/hotlinking risk on a real business site).
 * Sits behind hero content at a low z-index with pointer-events disabled.
 */
export default function MovingBackground() {
  const blobs = [
    { color: '#22C55E', size: 420, top: '-10%', left: '-8%', duration: 22 },
    { color: '#F59E0B', size: 380, top: '5%', left: '55%', duration: 26 },
    { color: '#F43F5E', size: 340, top: '55%', left: '5%', duration: 20 },
    { color: '#0EA5E9', size: 300, top: '45%', left: '70%', duration: 24 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.16] blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`
          }}
          animate={{
            x: [0, 40, -20, 0],
            y: [0, -30, 20, 0],
            scale: [1, 1.1, 0.95, 1]
          }}
          transition={{
            duration: b.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 1.5
          }}
        />
      ))}
    </div>
  );
}
