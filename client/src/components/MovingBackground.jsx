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
    { color: '#22C55E', size: 480, top: '-15%', left: '-10%', duration: 18 },
    { color: '#F59E0B', size: 440, top: '0%', left: '55%', duration: 22 },
    { color: '#F43F5E', size: 400, top: '50%', left: '2%', duration: 16 },
    { color: '#0EA5E9', size: 360, top: '40%', left: '68%', duration: 20 }
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {blobs.map((b, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full opacity-[0.28] blur-3xl"
          style={{
            width: b.size,
            height: b.size,
            top: b.top,
            left: b.left,
            background: `radial-gradient(circle, ${b.color}, transparent 70%)`
          }}
          animate={{
            x: [0, 70, -40, 0],
            y: [0, -50, 35, 0],
            scale: [1, 1.15, 0.9, 1]
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
