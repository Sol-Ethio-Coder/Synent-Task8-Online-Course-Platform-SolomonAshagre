import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '../api/axios.js';

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
  const [images, setImages] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/tutoring/images').then((res) => setImages(res.data)).catch(() => setImages([]));
  }, []);

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

      {images.length > 0 && (
        <div className="mt-14">
          <h2 className="font-display font-semibold text-xl text-ink mb-5">Moments from our sessions</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {images.map((img, i) => (
              <motion.figure
                key={img._id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                onClick={() => setSelected(img)}
                className="group relative rounded-2xl overflow-hidden border border-forest-100 bg-white cursor-pointer"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={img.url}
                    alt={img.caption || 'STCA tutoring'}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                      🔍 View
                    </span>
                  </div>
                </div>
                {img.caption && <figcaption className="text-xs text-ink/60 px-3 py-2">{img.caption}</figcaption>}
              </motion.figure>
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full"
            >
              <img
                src={selected.url}
                alt={selected.caption || 'STCA tutoring'}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              {selected.caption && (
                <p className="text-white/80 text-sm text-center mt-3">{selected.caption}</p>
              )}
            </motion.div>
            <button
              onClick={() => setSelected(null)}
              className="absolute top-5 right-5 text-white/80 hover:text-white text-2xl leading-none"
              aria-label="Close"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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
