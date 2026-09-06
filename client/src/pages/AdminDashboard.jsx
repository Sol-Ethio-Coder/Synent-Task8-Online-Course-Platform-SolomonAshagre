import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';

const TABS = ['Courses', 'Users', 'Enrollments'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Courses');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [c, u, e] = await Promise.all([
      api.get('/admin/courses'),
      api.get('/admin/users'),
      api.get('/admin/enrollments')
    ]);
    setCourses(c.data);
    setUsers(u.data);
    setEnrollments(e.data);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    await api.delete(`/admin/courses/${id}`);
    setCourses((prev) => prev.filter((c) => c._id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-display font-semibold text-ink">Admin panel</h1>
        <Link to="/admin/courses/new" className="bg-forest-700 text-white px-5 py-2.5 rounded-full text-sm font-medium">
          + New course
        </Link>
      </div>

      <div className="flex gap-2 mt-8 border-b border-forest-100">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t ? 'border-forest-700 text-forest-700' : 'border-transparent text-ink/50 hover:text-ink/80'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-ink/50 mt-10">Loading admin data...</p>
      ) : (
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-8"
        >
          {tab === 'Courses' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink/50 border-b border-forest-100">
                    <th className="py-3 pr-4">Title</th>
                    <th className="py-3 pr-4">Category</th>
                    <th className="py-3 pr-4">Price</th>
                    <th className="py-3 pr-4">Published</th>
                    <th className="py-3 pr-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((c) => (
                    <tr key={c._id} className="border-b border-forest-50">
                      <td className="py-3 pr-4 font-medium text-ink">{c.title}</td>
                      <td className="py-3 pr-4 text-ink/60 capitalize">{c.category?.replace('-', ' · ')}</td>
                      <td className="py-3 pr-4 text-ink/60">{c.isFree ? 'Free' : `${c.price} ETB`}</td>
                      <td className="py-3 pr-4 text-ink/60">{c.published ? 'Yes' : 'Draft'}</td>
                      <td className="py-3 pr-4 flex gap-3">
                        <Link to={`/admin/courses/${c._id}`} className="text-forest-700 hover:underline">Edit</Link>
                        <button onClick={() => handleDelete(c._id)} className="text-red-600 hover:underline">Delete</button>
                      </td>
                    </tr>
                  ))}
                  {courses.length === 0 && (
                    <tr><td colSpan={5} className="py-8 text-center text-ink/40">No courses yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'Users' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink/50 border-b border-forest-100">
                    <th className="py-3 pr-4">Name</th>
                    <th className="py-3 pr-4">Email</th>
                    <th className="py-3 pr-4">Role</th>
                    <th className="py-3 pr-4">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-b border-forest-50">
                      <td className="py-3 pr-4 font-medium text-ink">{u.name}</td>
                      <td className="py-3 pr-4 text-ink/60">{u.email}</td>
                      <td className="py-3 pr-4 text-ink/60 capitalize">{u.role}</td>
                      <td className="py-3 pr-4 text-ink/60">{u.isEmailVerified ? 'Yes' : 'No'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === 'Enrollments' && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-ink/50 border-b border-forest-100">
                    <th className="py-3 pr-4">User</th>
                    <th className="py-3 pr-4">Course</th>
                    <th className="py-3 pr-4">Amount</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e._id} className="border-b border-forest-50">
                      <td className="py-3 pr-4 font-medium text-ink">{e.user?.name}</td>
                      <td className="py-3 pr-4 text-ink/60">{e.course?.title}</td>
                      <td className="py-3 pr-4 text-ink/60">{e.amountPaid} ETB</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          e.status === 'paid' ? 'bg-forest-50 text-forest-700' : 'bg-ink/5 text-ink/50'
                        }`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
