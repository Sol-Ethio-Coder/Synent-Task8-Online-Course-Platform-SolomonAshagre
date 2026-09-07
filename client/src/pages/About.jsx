import React from 'react';
import { motion } from 'framer-motion';
import Logo from '../components/Logo.jsx';

const pillars = [
  {
    icon: '🎯',
    title: 'Our Mission',
    text: 'Make high-quality computing education accessible, practical, and genuinely enjoyable for every learner.'
  },
  {
    icon: '🛠️',
    title: 'Our Method',
    text: 'Learn → see a real example → practice with exercises → track your progress. Repeat until it\'s second nature.'
  },
  {
    icon: '🤝',
    title: 'Our Promise',
    text: 'Affordable, high-quality learning guided by experienced and passionate instructors.'
  }
];

const pathways = [
  { title: 'Primary Computing', text: 'First steps with algorithms & Scratch' },
  { title: 'IGCSE Computer Science (0478)', text: 'Full syllabus & Python' },
  { title: 'A-Level', text: 'Data structures, OOP & computational thinking' },
  { title: 'Modern Web Development', text: 'HTML, CSS, JavaScript & React' }
];

export default function About() {
  return (
    <div className="max-w-5xl mx-auto px-5 py-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="flex justify-center mb-6">
          <Logo size={56} />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-semibold text-ink">About STCA Academy</h1>
        <p className="text-ink/65 mt-4 leading-relaxed">
          Sol Tutoring &amp; Coding Academy (STCA) helps students master both academics and coding
          from scratch. Our learning platform turns theory into practice with worked examples and
          exercises in every single lesson.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mt-14 bg-forest-700 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8"
      >
        <div
          className="w-28 h-28 md:w-32 md:h-32 rounded-full flex-shrink-0 p-1"
          style={{ background: 'linear-gradient(135deg, #22C55E, #F59E0B, #F43F5E)' }}
        >
          <img
            src="/founder.jpg"
            alt="Solomon Ashagre, Founder of STCA"
            className="w-full h-full rounded-full object-cover border-4 border-forest-700"
          />
        </div>
        <div>
          <p className="text-xs font-semibold tracking-widest text-forest-300 uppercase">Founder &amp; CEO</p>
          <h2 className="font-display font-semibold text-2xl mt-1">Mr. Solomon Ashagre</h2>
          <p className="text-sun-400 font-medium text-sm mt-0.5">aka Sol Ethio Coder</p>
          <p className="text-white/75 text-sm mt-3 leading-relaxed max-w-xl">
            Visionary educator and passionate coder dedicated to making computing education
            accessible to all. Through STCA Academy, Solomon empowers students from Primary level
            through advanced programming, believing that "Practice makes you perfect!"
          </p>
          <a
            href="https://sol-ethio-coder.netlify.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-5 bg-sun-400 text-forest-700 px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-sun-500 transition-colors"
          >
            Portfolio Website
          </a>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mt-14">
        {pillars.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-white border border-forest-100 rounded-2xl p-6"
          >
            <span className="text-2xl">{p.icon}</span>
            <h3 className="font-display font-semibold text-lg mt-3 mb-2">{p.title}</h3>
            <p className="text-sm text-ink/65 leading-relaxed">{p.text}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white border border-forest-100 rounded-2xl p-8"
        >
          <h2 className="font-display font-semibold text-xl text-ink mb-5">Pathways we cover</h2>
          <ul className="space-y-4">
            {pathways.map((p) => (
              <li key={p.title} className="flex gap-2.5">
                <span className="text-forest-600 mt-0.5">▷</span>
                <span className="text-sm text-ink/75">
                  <strong className="text-ink">{p.title}</strong> — {p.text}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-forest-700 text-white rounded-2xl p-8 flex flex-col justify-center"
        >
          <p className="font-display font-semibold text-2xl">"Practice makes you perfect!"</p>
          <p className="text-white/70 text-sm mt-3 leading-relaxed">
            Join a community of curious learners and start building real skills today.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
