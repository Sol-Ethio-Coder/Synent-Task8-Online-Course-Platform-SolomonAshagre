import React from 'react';
import { motion } from 'framer-motion';

// `curriculumKey` matches the Course model's curriculum enum exactly (note
// "Web Development" vs the shorter display "label") so a student's real
// enrollment data can be matched up to a stage correctly.
const stages = [
  { label: 'Primary', curriculumKey: 'Primary', icon: '🌱', color: '#22C55E' },
  { label: 'IGCSE', curriculumKey: 'IGCSE', icon: '📘', color: '#84CC16' },
  { label: 'A-Level', curriculumKey: 'A-Level', icon: '🧠', color: '#F59E0B' },
  { label: 'Web Dev', curriculumKey: 'Web Development', icon: '💻', color: '#F43F5E' }
];

/**
 * Decorative on the homepage (no props — every stage renders the same
 * neutral outline style). On a student's dashboard, pass `progressByStage`
 * — an object keyed by curriculumKey with a status of 'not-started',
 * 'in-progress', or 'completed' — and each stage lights up to reflect that
 * student's real progress instead.
 */
export default function PathwayJourney({ progressByStage = null }) {
  return (
    <div className="relative py-4">
      {/* connecting line */}
      <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-forest-400 via-sun-400 to-rose-400" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 relative">
        {stages.map((s, i) => {
          const status = progressByStage?.[s.curriculumKey] || 'not-started';
          const isCompleted = status === 'completed';
          const isInProgress = status === 'in-progress';

          return (
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
                className="w-16 h-16 rounded-full flex items-center justify-center text-2xl relative z-10 border-2"
                style={{
                  borderColor: s.color,
                  backgroundColor: isCompleted ? s.color : isInProgress ? `${s.color}22` : '#FFFFFF',
                  boxShadow: isCompleted ? `0 0 0 4px ${s.color}33` : 'none'
                }}
              >
                {isCompleted ? '✓' : s.icon}
                {isInProgress && (
                  <motion.span
                    className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                    style={{ backgroundColor: s.color }}
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </motion.div>
              <p className={`mt-3 text-sm font-semibold ${isCompleted ? 'text-ink' : 'text-ink/80'}`}>{s.label}</p>
              {progressByStage && (
                <p className="text-[11px] mt-0.5" style={{ color: isCompleted || isInProgress ? s.color : '#9CA3AF' }}>
                  {isCompleted ? 'Completed' : isInProgress ? 'In progress' : 'Not started'}
                </p>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
