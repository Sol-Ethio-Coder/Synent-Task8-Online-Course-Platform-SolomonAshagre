import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext.jsx';
import Logo from './Logo.jsx';

const navLinkClass = ({ isActive }) =>
  `text-sm font-medium transition-colors ${isActive ? 'text-forest-700' : 'text-ink/70 hover:text-forest-700'}`;

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FBF9F4]/90 backdrop-blur border-b border-forest-100">
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo size={36} />
          <span className="leading-none">
            <span className="block font-display font-semibold text-lg text-forest-700">STCA</span>
            <span className="hidden sm:block text-[9px] tracking-widest text-ink/40 uppercase mt-0.5">Practice makes you perfect</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
          <NavLink to="/tutoring" className={navLinkClass}>Tutoring</NavLink>
          <NavLink to="/about" className={navLinkClass}>About</NavLink>
          {user && <NavLink to="/dashboard" className={navLinkClass}>Dashboard</NavLink>}
          {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <Link to="/account" className="text-sm font-medium text-ink/70 hover:text-forest-700">Account</Link>
              <button onClick={handleLogout} className="text-sm font-medium text-ink/70 hover:text-forest-700">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-ink/70 hover:text-forest-700">Log in</Link>
              <Link
                to="/register"
                className="text-sm font-semibold bg-forest-700 text-white px-4 py-2 rounded-full hover:bg-forest-600 transition-colors"
              >
                Get started
              </Link>
            </>
          )}
        </div>

        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-ink transition-transform ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-ink transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-ink transition-transform ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="md:hidden overflow-hidden border-t border-forest-100"
          >
            <div className="flex flex-col gap-4 px-5 py-5">
              <NavLink to="/courses" className={navLinkClass} onClick={() => setOpen(false)}>Courses</NavLink>
              <NavLink to="/tutoring" className={navLinkClass} onClick={() => setOpen(false)}>Tutoring</NavLink>
              <NavLink to="/about" className={navLinkClass} onClick={() => setOpen(false)}>About</NavLink>
              {user && <NavLink to="/dashboard" className={navLinkClass} onClick={() => setOpen(false)}>Dashboard</NavLink>}
              {user?.role === 'admin' && <NavLink to="/admin" className={navLinkClass} onClick={() => setOpen(false)}>Admin</NavLink>}
              {user ? (
                <>
                  <Link to="/account" onClick={() => setOpen(false)} className="text-sm font-medium text-ink/70">Account</Link>
                  <button onClick={handleLogout} className="text-left text-sm font-medium text-ink/70">Log out</button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-ink/70">Log in</Link>
                  <Link to="/register" onClick={() => setOpen(false)} className="text-sm font-semibold bg-forest-700 text-white px-4 py-2 rounded-full text-center">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
