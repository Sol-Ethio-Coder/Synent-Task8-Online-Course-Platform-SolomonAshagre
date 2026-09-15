import React from 'react';
import { motion } from 'framer-motion';

const stages = [
  { label: 'Primary', icon: '🌱', color: '#22C55E' },
  { label: 'IGCSE', icon: '📘', color: '#84CC16' },
  { label: 'A-Level', icon: '🧠', color: '#F59E0B' },
  { label: 'Web Dev', icon: '💻', color: '#F43F5E' }
];

export default function PathwayJourney() {
  return (
    <div className="relative py-4">
      {/* connecting line */}
      <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-forest-400 via-sun-400 to-rose-400" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
        {stages.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5, type: 'spring', stiffness: 200 }}
            className="flex flex-col items-center text-center"
          >
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className="w-16 h-16 rounded-full bg-white border-2 flex items-center justify-center text-2xl shadow-sm relative z-10"
              style={{ borderColor: s.color }}
            >
              {s.icon}
            </motion.div>
            <p className="mt-3 text-sm font-semibold text-ink">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
