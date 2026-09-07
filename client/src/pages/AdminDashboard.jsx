import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../api/axios.js';

const TABS = ['Courses', 'Users', 'Enrollments', 'Tutoring Photos'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('Courses');
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [images, setImages] = useState([]);
  const [imageForm, setImageForm] = useState({ url: '', caption: '' });
  const [addingImage, setAddingImage] = useState(false);
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(true);

  const loadAll = async () => {
    setLoading(true);
    const [c, u, e, img] = await Promise.all([
      api.get('/admin/courses'),
      api.get('/admin/users'),
      api.get('/admin/enrollments'),
      api.get('/tutoring/images')
    ]);
    setCourses(c.data);
    setUsers(u.data);
    setEnrollments(e.data);
    setImages(img.data);
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
                  <button
                    type="submit"
                    disabled={addingImage}
                    className="bg-forest-700 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-60 whitespace-nowrap"
                  >
                    {addingImage ? 'Adding...' : 'Add photo'}
                  </button>
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
                        <button
                          onClick={() => handleDeleteImage(img._id)}
                          className="text-xs text-red-600 hover:underline mt-1"
                        >
                          Remove
                        </button>
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
