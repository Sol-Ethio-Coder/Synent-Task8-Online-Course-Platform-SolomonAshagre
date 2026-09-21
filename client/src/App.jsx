import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import { ProtectedRoute, AdminRoute } from './components/RouteGuards.jsx';

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

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/courses/:slug" element={<CourseDetails />} />
          <Route path="/tutoring" element={<Tutoring />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/policy" element={<Policy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/verify-certificate" element={<VerifyCertificate />} />
          <Route path="/verify-certificate/:certificateId" element={<VerifyCertificate />} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
          <Route path="/payment/callback" element={<ProtectedRoute><PaymentCallback /></ProtectedRoute>} />
          <Route path="/learn/:courseId" element={<ProtectedRoute><Learn /></ProtectedRoute>} />
          <Route path="/exam/:courseId" element={<ProtectedRoute><Exam /></ProtectedRoute>} />
          <Route path="/certificate/:courseId" element={<ProtectedRoute><Certificate /></ProtectedRoute>} />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <Suspense fallback={<AdminPageFallback />}>
                  <AdminDashboard />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/courses/:id"
            element={
              <AdminRoute>
                <Suspense fallback={<AdminPageFallback />}>
                  <AdminCourseEditor />
                </Suspense>
              </AdminRoute>
            }
          />
          <Route
            path="/admin/courses/new"
            element={
              <AdminRoute>
                <Suspense fallback={<AdminPageFallback />}>
                  <AdminCourseEditor />
                </Suspense>
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
