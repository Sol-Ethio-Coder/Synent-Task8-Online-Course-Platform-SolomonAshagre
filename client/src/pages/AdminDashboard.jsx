import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../api/axios.js';

const BASE_TABS = ['Analytics', 'Courses', 'Users', 'Enrollments', 'Exam Results', 'Tutoring Photos'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Analytics');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [images, setImages] = useState([]);
  const [pendingPayments, setPendingPayments] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [imageForm, setImageForm] = useState({ url: '', caption: '' });
  const [addingImage, setAddingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [reviewingId, setReviewingId] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [c, u, e, img, pending, results, stats] = await Promise.all([
      api.get('/admin/courses'),
      api.get('/admin/users'),
      api.get('/admin/enrollments'),
      api.get('/tutoring/images'),
      api.get('/admin/pending-enrollments'),
      api.get('/admin/exam-results'),
      api.get('/admin/analytics')
    ]);
    setCourses(c.data);
    setUsers(u.data);
    setEnrollments(e.data);
    setImages(img.data);
    setPendingPayments(pending.data);
    setExamResults(results.data);
    setAnalytics(stats.data);
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

  const handleAddImage = async (e) => {
    e.preventDefault();
    setImageError('');
    if (!imageForm.url.trim()) {
      setImageError('Image URL is required');
      return;
    }
    setAddingImage(true);
    try {
      const { data } = await api.post('/admin/tutoring-images', imageForm);
      setImages((prev) => [data, ...prev]);
      setImageForm({ url: '', caption: '' });
    } catch (err) {
      setImageError(err.response?.data?.message || 'Could not add image');
    } finally {
      setAddingImage(false);
    }
  };

  const handleDeleteImage = async (id) => {
    if (!confirm('Remove this photo from the tutoring page?')) return;
    await api.delete(`/admin/tutoring-images/${id}`);
    setImages((prev) => prev.filter((img) => img._id !== id));
  };

  const handleApprove = async (id) => {
    setReviewingId(id);
    try {
      await api.post(`/admin/enrollments/${id}/approve`);
      setPendingPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not approve this enrollment.');
    } finally {
      setReviewingId(null);
    }
  };

  const handleReject = async (id) => {
    const reason = prompt('Reason for rejecting this receipt (shown to the student):', 'Receipt could not be verified.');
    if (reason === null) return; // cancelled
    setReviewingId(id);
    try {
      await api.post(`/admin/enrollments/${id}/reject`, { reason });
      setPendingPayments((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || 'Could not reject this enrollment.');
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-5 py-14">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-3xl font-display font-semibold text-ink">Admin panel</h1>
        <Link to="/admin/courses/new" className="bg-forest-700 text-white px-5 py-2.5 rounded-full text-sm font-medium">
          + New course
        </Link>
      </div>

      <div className="flex gap-2 mt-8 border-b border-forest-100 overflow-x-auto">
        {[...BASE_TABS, 'Pending Payments'].map((t) => (
          <motion.button
            key={t}
            onClick={() => setTab(t)}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              tab === t ? 'border-forest-700 text-forest-700' : 'border-transparent text-ink/50 hover:text-ink/80'
            }`}
          >
            {t}
            {t === 'Pending Payments' && pendingPayments.length > 0 && (
              <span className="ml-1.5 bg-amber-400 text-forest-900 text-xs px-1.5 py-0.5 rounded-full">
                {pendingPayments.length}
              </span>
            )}
          </motion.button>
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
          {tab === 'Analytics' && analytics && (
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Total revenue', value: `${analytics.totalRevenue.toLocaleString()} ETB`, color: 'text-forest-700' },
                  { label: 'Students', value: analytics.totalStudents, color: 'text-ink' },
                  { label: 'Certificates issued', value: analytics.certificatesIssued, color: 'text-sun-500' },
                  { label: 'Exam pass rate', value: `${analytics.examPassRate}%`, color: 'text-ink' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="bg-white border border-forest-100 rounded-2xl p-5"
                  >
                    <p className="text-xs text-ink/50">{stat.label}</p>
                    <p className={`text-2xl font-display font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="bg-white border border-forest-100 rounded-2xl p-5 mb-8">
                <h3 className="font-display font-semibold text-ink mb-4">Revenue — last 6 months</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={analytics.monthly}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#dcebe1" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(value, name) => [name === 'revenue' ? `${value.toLocaleString()} ETB` : value, name === 'revenue' ? 'Revenue' : 'Enrollments']}
                    />
                    <Bar dataKey="revenue" fill="#1F4B3F" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-forest-100 rounded-2xl p-5">
                <h3 className="font-display font-semibold text-ink mb-4">Top courses by enrollment</h3>
                {analytics.topCourses.length === 0 ? (
                  <p className="text-sm text-ink/40">No paid enrollments yet.</p>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-ink/50 border-b border-forest-100">
                        <th className="py-2 pr-4">Course</th>
                        <th className="py-2 pr-4">Enrollments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.topCourses.map((c) => (
                        <tr key={c.title} className="border-b border-forest-50">
                          <td className="py-2 pr-4 font-medium text-ink">{c.title}</td>
                          <td className="py-2 pr-4 text-ink/60">{c.enrollments}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

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
                        <motion.button
                          whileHover={{ scale: 1.08 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleDelete(c._id)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </motion.button>
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
                    <th className="py-3 pr-4">Method</th>
                    <th className="py-3 pr-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {enrollments.map((e) => (
                    <tr key={e._id} className="border-b border-forest-50">
                      <td className="py-3 pr-4 font-medium text-ink">{e.user?.name}</td>
                      <td className="py-3 pr-4 text-ink/60">{e.course?.title}</td>
                      <td className="py-3 pr-4 text-ink/60">{e.amountPaid} ETB</td>
                      <td className="py-3 pr-4 text-ink/60 capitalize">{e.paymentMethod || 'chapa'}</td>
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

          {tab === 'Exam Results' && (
            <div className="overflow-x-auto">
              {examResults.length === 0 ? (
                <p className="text-ink/40 text-sm">No exam attempts yet.</p>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink/50 border-b border-forest-100">
                      <th className="py-3 pr-4">Student</th>
                      <th className="py-3 pr-4">Course</th>
                      <th className="py-3 pr-4">Score</th>
                      <th className="py-3 pr-4">Attempts</th>
                      <th className="py-3 pr-4">Result</th>
                      <th className="py-3 pr-4">Certificate ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examResults.map((r, i) => (
                      <tr key={i} className="border-b border-forest-50">
                        <td className="py-3 pr-4 font-medium text-ink">{r.studentName}<br /><span className="text-xs text-ink/40 font-normal">{r.studentEmail}</span></td>
                        <td className="py-3 pr-4 text-ink/60">{r.courseTitle}</td>
                        <td className="py-3 pr-4 text-ink/60">{r.examScore}%</td>
                        <td className="py-3 pr-4 text-ink/60">{r.examAttempts}</td>
                        <td className="py-3 pr-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            r.examPassed ? 'bg-forest-50 text-forest-700' : 'bg-red-50 text-red-600'
                          }`}>
                            {r.examPassed ? 'Passed' : 'Not passed'}
                          </span>
                        </td>
                        <td className="py-3 pr-4 text-ink/40 text-xs">{r.certificateId || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {tab === 'Pending Payments' && (
            <div>
              <p className="text-sm text-ink/50 mb-5">
                Manual bank/mobile transfer submissions awaiting receipt review.
              </p>
              {pendingPayments.length === 0 ? (
                <p className="text-ink/40 text-sm">No pending payments right now.</p>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((p) => (
                    <div key={p._id} className="bg-white border border-forest-100 rounded-2xl p-5 flex flex-col sm:flex-row gap-4">
                      <a href={p.receiptImage} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                        <img
                          src={p.receiptImage}
                          alt="Payment receipt"
                          className="w-full sm:w-32 h-32 object-cover rounded-lg border border-forest-100"
                        />
                      </a>
                      <div className="flex-1">
                        <p className="font-medium text-ink">{p.course?.title}</p>
                        <p className="text-sm text-ink/60 mt-0.5">{p.user?.name} · {p.user?.email}</p>
                        <p className="text-sm text-forest-700 font-medium mt-1">{p.amountPaid} ETB</p>
                        <p className="text-xs text-ink/40 mt-1">
                          Submitted {new Date(p.createdAt).toLocaleString()}
                        </p>
                        <div className="flex gap-3 mt-3">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleApprove(p._id)}
                            disabled={reviewingId === p._id}
                            className="bg-forest-700 text-white px-4 py-2 rounded-full text-sm font-medium disabled:opacity-60"
                          >
                            {reviewingId === p._id ? 'Working...' : 'Approve'}
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => handleReject(p._id)}
                            disabled={reviewingId === p._id}
                            className="border border-red-300 text-red-600 px-4 py-2 rounded-full text-sm font-medium disabled:opacity-60"
                          >
                            Reject
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {tab === 'Tutoring Photos' && (
            <div>
              <form onSubmit={handleAddImage} className="bg-white border border-forest-100 rounded-2xl p-5 mb-6">
                <h3 className="font-display font-semibold text-ink mb-3">Add a photo</h3>
                <div className="grid sm:grid-cols-[2fr_2fr_auto] gap-3 items-start">
                  <div>
                    <input
                      type="url"
                      required
                      placeholder="Image URL (e.g. from Imgur, Google Drive share link, etc.)"
                      value={imageForm.url}
                      onChange={(e) => setImageForm({ ...imageForm, url: e.target.value })}
                      className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Caption (optional)"
                      value={imageForm.caption}
                      onChange={(e) => setImageForm({ ...imageForm, caption: e.target.value })}
                      className="w-full border border-forest-100 rounded-lg px-3 py-2 text-sm"
                    />
                  </div>
                  <motion.button
                    type="submit"
                    disabled={addingImage}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-forest-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60 whitespace-nowrap"
                  >
                    {addingImage ? 'Adding...' : 'Add photo'}
                  </motion.button>
                </div>
                {imageError && <p className="text-sm text-red-600 mt-2">{imageError}</p>}
                <p className="text-xs text-ink/40 mt-2">
                  Paste a direct image link. This platform doesn't host file uploads yet — use an image hosting service and paste its link here.
                </p>
              </form>

              {images.length === 0 ? (
                <p className="text-ink/40 text-sm">No photos added yet.</p>
              ) : (
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img) => (
                    <div key={img._id} className="bg-white border border-forest-100 rounded-xl overflow-hidden">
                      <img src={img.url} alt={img.caption || 'Tutoring'} className="w-full h-32 object-cover" />
                      <div className="p-2.5">
                        <p className="text-xs text-ink/60 truncate">{img.caption || '—'}</p>
                        <motion.button
                          onClick={() => handleDeleteImage(img._id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="text-xs text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
