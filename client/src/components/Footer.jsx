import React from 'react';
import { Link } from 'react-router-dom';

const MARKETING_SITE = 'https://stca-academy.netlify.app/';

export default function Footer() {
  return (
    <footer className="bg-forest-700 text-white/80 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-14 grid gap-10 md:grid-cols-4">
        <div>
          <a href={MARKETING_SITE} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 mb-3 w-fit">
            <span className="w-8 h-8 rounded-lg bg-sun-400 text-forest-700 flex items-center justify-center font-display font-bold">S</span>
            <span className="font-display font-semibold text-lg text-white">STCA</span>
          </a>
          <p className="text-sm leading-relaxed">
            Sol Tutoring And Coding Academy — coding classes and academic tutoring, online and offline, for learners of every level.
          </p>
          <a
            href={MARKETING_SITE}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-sun-400 hover:underline mt-4"
          >
            Visit our main site ↗
          </a>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm">Learn</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-sun-400">All courses</Link></li>
            <li><Link to="/tutoring" className="hover:text-sun-400">Tutoring services</Link></li>
            <li><Link to="/dashboard" className="hover:text-sun-400">My dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/policy" className="hover:text-sun-400">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-sun-400">Terms of Service</Link></li>
            <li><a href="https://t.me/Sol_Ethio_Coder" target="_blank" rel="noopener noreferrer" className="hover:text-sun-400">Telegram</a></li>
            <li><a href="https://www.youtube.com/@stcaAcademy" target="_blank" rel="noopener noreferrer" className="hover:text-sun-400">YouTube</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-medium mb-3 text-sm">Contact</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="mailto:solash5156@gmail.com" className="hover:text-sun-400">solash5156@gmail.com</a></li>
            <li><a href="tel:+251901436358" className="hover:text-sun-400">(+251) 901 436 358</a></li>
            <li>Addis Ababa, Ethiopia</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <div className="max-w-6xl mx-auto px-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/60">
          <span>© {new Date().getFullYear()} Sol Tutoring And Coding Academy (STCA). All rights reserved.</span>
          <span>
            Built by{' '}
            <a href="https://sol-ethio-coder.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-sun-400 hover:underline">
              Sol Ethio Coder
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
