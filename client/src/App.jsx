import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { ProtectedRoute, AdminRoute } from './components/RouteGuards.jsx';
import PageTransition from './components/PageTransition.jsx';

import Home from './pages/Home.jsx';
import Courses from './pages/Courses.jsx';
import CourseDetails from './pages/CourseDetails.jsx';
import Tutoring from './pages/Tutoring.jsx';
import About from './pages/About.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Account from './pages/Account.jsx';
import PaymentCallback from './pages/PaymentCallback.jsx';
import Learn from './pages/Learn.jsx';
import Exam from './pages/Exam.jsx';
import Certificate from './pages/Certificate.jsx';
import VerifyCertificate from './pages/VerifyCertificate.jsx';
import Policy from './pages/Policy.jsx';
import Terms from './pages/Terms.jsx';
import NotFound from './pages/NotFound.jsx';

// Admin-only pages are code-split — recharts (used for analytics) and this
// entire surface only needs to load for the one admin, not every visitor.
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));
const AdminCourseEditor = lazy(() => import('./pages/AdminCourseEditor.jsx'));

const AdminPageFallback = () => (
  <div className="max-w-6xl mx-auto px-5 py-20 text-center text-ink/40">Loading admin panel...</div>
);

// Small helper so every route below stays one line instead of needing a
// manual <PageTransition> wrap repeated 26 times.
const T = (el) => <PageTransition>{el}</PageTransition>;

export default function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={T(<Home />)} />
            <Route path="/courses" element={T(<Courses />)} />
            <Route path="/courses/:slug" element={T(<CourseDetails />)} />
            <Route path="/tutoring" element={T(<Tutoring />)} />
            <Route path="/about" element={T(<About />)} />
            <Route path="/login" element={T(<Login />)} />
            <Route path="/register" element={T(<Register />)} />
            <Route path="/forgot-password" element={T(<ForgotPassword />)} />
            <Route path="/reset-password/:token" element={T(<ResetPassword />)} />
            <Route path="/verify-email/:token" element={T(<VerifyEmail />)} />
            <Route path="/policy" element={T(<Policy />)} />
            <Route path="/terms" element={T(<Terms />)} />
            <Route path="/verify-certificate" element={T(<VerifyCertificate />)} />
            <Route path="/verify-certificate/:certificateId" element={T(<VerifyCertificate />)} />

            <Route path="/dashboard" element={T(<ProtectedRoute><Dashboard /></ProtectedRoute>)} />
            <Route path="/account" element={T(<ProtectedRoute><Account /></ProtectedRoute>)} />
            <Route path="/payment/callback" element={T(<ProtectedRoute><PaymentCallback /></ProtectedRoute>)} />
            <Route path="/learn/:courseId" element={T(<ProtectedRoute><Learn /></ProtectedRoute>)} />
            <Route path="/exam/:courseId" element={T(<ProtectedRoute><Exam /></ProtectedRoute>)} />
            <Route path="/certificate/:courseId" element={T(<ProtectedRoute><Certificate /></ProtectedRoute>)} />

            <Route
              path="/admin"
              element={T(
                <AdminRoute>
                  <Suspense fallback={<AdminPageFallback />}>
                    <AdminDashboard />
                  </Suspense>
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/courses/:id"
              element={T(
                <AdminRoute>
                  <Suspense fallback={<AdminPageFallback />}>
                    <AdminCourseEditor />
                  </Suspense>
                </AdminRoute>
              )}
            />
            <Route
              path="/admin/courses/new"
              element={T(
                <AdminRoute>
                  <Suspense fallback={<AdminPageFallback />}>
                    <AdminCourseEditor />
                  </Suspense>
                </AdminRoute>
              )}
            />

            <Route path="*" element={T(<NotFound />)} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}
