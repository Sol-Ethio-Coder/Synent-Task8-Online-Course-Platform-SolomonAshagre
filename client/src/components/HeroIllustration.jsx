import React from 'react';
import { motion } from 'framer-motion';

export default function HeroIllustration() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* soft gradient orbs drifting slowly behind the main card */}
      <motion.div
        className="absolute -top-10 -right-6 w-40 h-40 rounded-full blur-2xl opacity-40"
        style={{ background: 'radial-gradient(circle, #F59E0B, transparent 70%)' }}
        animate={{ y: [0, -14, 0], x: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-0 -left-8 w-32 h-32 rounded-full blur-2xl opacity-30"
        style={{ background: 'radial-gradient(circle, #22C55E, transparent 70%)' }}
        animate={{ y: [0, 12, 0], x: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />

      {/* mini floating "progress" card */}
      <motion.div
        className="absolute -right-4 top-8 bg-white rounded-xl shadow-lg px-3 py-2 border border-forest-100"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-forest-700 flex items-center justify-center text-sun-400 text-xs">✓</span>
          <div>
            <p className="text-[10px] text-ink/40 leading-none">Lesson complete</p>
            <p className="text-xs font-semibold text-ink leading-none mt-0.5">Python basics</p>
          </div>
        </div>
      </motion.div>

      {/* mini floating "certificate" card */}
      <motion.div
        className="absolute -left-6 bottom-6 bg-white rounded-xl shadow-lg px-3 py-2 border border-forest-100"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">🎓</span>
          <div>
            <p className="text-[10px] text-ink/40 leading-none">Certificate earned</p>
            <p className="text-xs font-semibold text-ink leading-none mt-0.5">IGCSE Computer Science</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
