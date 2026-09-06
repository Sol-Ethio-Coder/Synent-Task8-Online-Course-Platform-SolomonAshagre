import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const offerings = [
  {
    title: 'Online tutoring',
    text: 'Live 1-on-1 or small-group sessions over video call, scheduled around your timetable — coding, math, or exam prep.'
  },
  {
    title: 'Offline tutoring',
    text: 'In-person sessions at your home or a nearby study space, for learners who focus best face-to-face.'
  },
  {
    title: 'Coding mentorship',
    text: 'Pair-programming and code review support alongside our structured coding courses, for learners who want extra guidance.'
  }
];

export default function Tutoring() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-display font-semibold text-ink"
      >
        Tutoring services
      </motion.h1>
      <p className="text-ink/65 mt-3 max-w-xl">
        Beyond our coding courses, STCA offers personal tutoring — online or offline — matched to how you learn best.
      </p>

      <div className="grid md:grid-cols-3 gap-6 mt-12">
        {offerings.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="bg-white border border-forest-100 rounded-2xl p-6"
          >
            <h3 className="font-display font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-ink/65 leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-14 bg-forest-700 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <h2 className="font-display font-semibold text-xl">Want a tutoring plan built for you?</h2>
          <p className="text-white/70 text-sm mt-1">Reach out and we'll match you with the right tutor and schedule.</p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <a
            href="https://t.me/Sol_Ethio_Coder"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-sun-400 text-forest-700 px-6 py-3 rounded-full font-medium whitespace-nowrap hover:bg-sun-500 transition-colors"
          >
            Chat on Telegram
          </a>
          <a
            href="mailto:solash5156@gmail.com"
            className="border border-white/40 text-white px-6 py-3 rounded-full font-medium whitespace-nowrap hover:bg-white/10 transition-colors"
          >
            Email us
          </a>
        </div>
      </div>

      <p className="text-sm text-ink/50 mt-8">
        Looking for structured, self-paced learning instead? <Link to="/courses" className="text-forest-700 underline">Browse our coding courses</Link>.{' '}
        Or see our full course catalog on{' '}
        <a href="https://stca-academy.netlify.app/html/courses" target="_blank" rel="noopener noreferrer" className="text-forest-700 underline">
          our main site ↗
        </a>.
      </p>
    </div>
  );
}
