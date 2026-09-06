import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatWidget from '../components/ChatWidget.jsx';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: 'easeOut' }
  })
};

export default function Home() {
  return (
    <div>
      <section className="max-w-6xl mx-auto px-5 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={0}
            className="text-forest-600 font-medium text-sm tracking-wide mb-4"
          >
            Sol Tutoring And Coding Academy ·{' '}
            <a
              href="https://stca-academy.netlify.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-forest-300 hover:decoration-forest-700"
            >
              our main site ↗
            </a>
          </motion.p>
          <motion.h1
            variants={fadeUp} initial="hidden" animate="show" custom={1}
            className="text-4xl md:text-5xl font-display font-semibold leading-tight text-ink"
          >
            Learn to code. Get tutored. <span className="text-forest-700">Online or in person.</span>
          </motion.h1>
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={2}
            className="mt-5 text-ink/70 text-lg leading-relaxed max-w-lg"
          >
            STCA teaches students to build real software through structured, module-based courses —
            and offers one-on-one academic tutoring, whether you learn best on a screen or in the room.
          </motion.p>
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="mt-8 flex flex-wrap gap-4"
          >
            <Link to="/courses" className="bg-forest-700 text-white px-6 py-3 rounded-full font-medium hover:bg-forest-600 transition-colors">
              Browse courses
            </Link>
            <Link to="/tutoring" className="border border-forest-700 text-forest-700 px-6 py-3 rounded-full font-medium hover:bg-forest-50 transition-colors">
              Explore tutoring
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
          className="relative"
        >
          <div className="bg-forest-700 rounded-3xl p-8 text-white shadow-xl">
            <div className="font-mono text-sm space-y-2 opacity-90">
              <p><span className="text-sun-400">function</span> <span className="text-white">learn</span>() {'{'}</p>
              <p className="pl-4">enroll(<span className="text-sun-400">"coding-101"</span>);</p>
              <p className="pl-4">track(progress);</p>
              <p className="pl-4"><span className="text-sun-400">return</span> mastery;</p>
              <p>{'}'}</p>
            </div>
            <div className="mt-6 pt-6 border-t border-white/15 grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-2xl font-display font-semibold text-sun-400">1:1</p>
                <p className="text-white/70">Live tutoring</p>
              </div>
              <div>
                <p className="text-2xl font-display font-semibold text-sun-400">Self-paced</p>
                <p className="text-white/70">Coding modules</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="bg-forest-50 py-20">
        <div className="max-w-6xl mx-auto px-5">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-display font-semibold text-ink mb-10"
          >
            How STCA works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: 'Pick a course or tutor', text: 'Browse coding tracks or request 1:1 tutoring, online or offline, in your subject and level.' },
              { step: 'Enroll and pay securely', text: 'Enroll instantly with Chapa — via Telebirr, CBE Birr, or card. Free courses unlock immediately.' },
              { step: 'Learn and track progress', text: 'Work through modules and lessons, mark them complete, and watch your progress bar fill up.' }
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white rounded-2xl p-6 border border-forest-100"
              >
                <div className="w-9 h-9 rounded-full bg-forest-700 text-sun-400 flex items-center justify-center font-display font-semibold mb-4">
                  {i + 1}
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{item.step}</h3>
                <p className="text-sm text-ink/65 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ChatWidget />
    </div>
  );
}
