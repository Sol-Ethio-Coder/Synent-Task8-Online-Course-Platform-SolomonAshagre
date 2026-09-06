import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios.js';

const emptyLesson = () => ({ title: '', videoUrl: '', duration: '', order: 0 });
const emptyModule = () => ({ title: '', order: 0, lessons: [emptyLesson()] });

const emptyCourse = {
  title: '',
  slug: '',
  description: '',
  shortDescription: '',
  thumbnail: '',
  category: 'coding-online',
  level: 'beginner',
  price: 0,
  isFree: false,
  published: true,
  modules: [emptyModule()]
};

function slugify(str) {
  return str.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// Converts common YouTube link formats (watch?v=, youtu.be/, shorts/) into the
// /embed/ format required for iframe playback. Leaves non-YouTube URLs (Vimeo,
// already-correct embed links, etc.) untouched.
function toEmbedUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  try {
    const url = new URL(rawUrl.trim());
    const host = url.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      const id = url.pathname.slice(1);
      return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (url.pathname === '/watch') {
        const id = url.searchParams.get('v');
        return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
      }
      if (url.pathname.startsWith('/shorts/')) {
        const id = url.pathname.split('/')[2];
        return id ? `https://www.youtube.com/embed/${id}` : rawUrl;
      }
      // Already /embed/... — leave as-is
      return rawUrl;
    }

    return rawUrl; // not YouTube — leave untouched (e.g. Vimeo, hosted MP4, etc.)
  } catch {
    return rawUrl; // not a valid URL yet (still typing) — leave untouched
  }
}

export default function AdminCourseEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const [course, setCourse] = useState(emptyCourse);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isNew) return;
    api.get('/admin/courses').then((res) => {
      const found = res.data.find((c) => c._id === id);
      if (found) setCourse(found);
      setLoading(false);
    });
  }, [id, isNew]);

  const updateField = (field, value) => setCourse((prev) => ({ ...prev, [field]: value }));

  const updateModule = (mi, field, value) => {
    const modules = [...course.modules];
    modules[mi] = { ...modules[mi], [field]: value };
    setCourse((prev) => ({ ...prev, modules }));
  };

  const updateLesson = (mi, li, field, value) => {
    const modules = [...course.modules];
    const lessons = [...modules[mi].lessons];
    lessons[li] = { ...lessons[li], [field]: value };
    modules[mi] = { ...modules[mi], lessons };
    setCourse((prev) => ({ ...prev, modules }));
  };

  const addModule = () => setCourse((prev) => ({ ...prev, modules: [...prev.modules, emptyModule()] }));
  const removeModule = (mi) =>
    setCourse((prev) => ({ ...prev, modules: prev.modules.filter((_, i) => i !== mi) }));

  const addLesson = (mi) => {
    const modules = [...course.modules];
    modules[mi] = { ...modules[mi], lessons: [...modules[mi].lessons, emptyLesson()] };
    setCourse((prev) => ({ ...prev, modules }));
  };
  const removeLesson = (mi, li) => {
    const modules = [...course.modules];
    modules[mi] = { ...modules[mi], lessons: modules[mi].lessons.filter((_, i) => i !== li) };
    setCourse((prev) => ({ ...prev, modules }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const payload = { ...course, slug: course.slug || slugify(course.title) };
      if (isNew) {
        await api.post('/admin/courses', payload);
      } else {
        await api.put(`/admin/courses/${id}`, payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save course');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-5 py-20 text-ink/40">Loading course...</div>;

  return (
    <div className="max-w-4xl mx-auto px-5 py-14">
      <h1 className="text-3xl font-display font-semibold text-ink mb-8">
        {isNew ? 'New course' : `Edit: ${course.title}`}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-forest-100 rounded-2xl p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-ink/70">Title</label>
              <input
                required value={course.title}
                onChange={(e) => updateField('title', e.target.value)}
                className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Slug (URL)</label>
              <input
                value={course.slug}
                onChange={(e) => updateField('slug', slugify(e.target.value))}
                placeholder="auto-generated from title if left blank"
                className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Short description</label>
            <input
              value={course.shortDescription}
              onChange={(e) => updateField('shortDescription', e.target.value)}
              className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-ink/70">Full description</label>
            <textarea
              required rows={4} value={course.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full mt-1 border border-forest-100 rounded-lg px-4 py-2.5 text-sm"
            />
          </div>

          <div className="grid sm:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-ink/70">Category</label>
              <select
                value={course.category}
                onChange={(e) => updateField('category', e.target.value)}
                className="w-full mt-1 border border-forest-100 rounded-lg px-3 py-2.5 text-sm bg-white"
              >
                <option value="coding-online">Coding · Online</option>
                <option value="coding-offline">Coding · Offline</option>
                <option value="tutoring-online">Tutoring · Online</option>
                <option value="tutoring-offline">Tutoring · Offline</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Level</label>
              <select
                value={course.level}
                onChange={(e) => updateField('level', e.target.value)}
                className="w-full mt-1 border border-forest-100 rounded-lg px-3 py-2.5 text-sm bg-white"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink/70">Price (ETB)</label>
              <input
                type="number" min={0} value={course.price}
                onChange={(e) => updateField('price', Number(e.target.value))}
                className="w-full mt-1 border border-forest-100 rounded-lg px-3 py-2.5 text-sm"
              />
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={course.isFree} onChange={(e) => updateField('isFree', e.target.checked)} />
                Free course
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={course.published} onChange={(e) => updateField('published', e.target.checked)} />
                Published
              </label>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-lg">Modules & lessons</h2>
            <button type="button" onClick={addModule} className="text-sm text-forest-700 font-medium hover:underline">
              + Add module
            </button>
          </div>

          <div className="space-y-5">
            {course.modules.map((mod, mi) => (
              <div key={mi} className="bg-white border border-forest-100 rounded-2xl p-5">
                <div className="flex gap-3 items-center">
                  <input
                    placeholder={`Module ${mi + 1} title`}
                    value={mod.title}
                    onChange={(e) => updateModule(mi, 'title', e.target.value)}
                    className="flex-1 border border-forest-100 rounded-lg px-3 py-2 text-sm font-medium"
                  />
                  <button type="button" onClick={() => removeModule(mi)} className="text-red-600 text-sm">
                    Remove
                  </button>
                </div>

                <div className="mt-4 space-y-3 pl-4 border-l-2 border-forest-50">
                  {mod.lessons.map((lesson, li) => (
                    <div key={li} className="grid sm:grid-cols-[2fr_2fr_1fr_auto] gap-2 items-center">
                      <input
                        placeholder="Lesson title"
                        value={lesson.title}
                        onChange={(e) => updateLesson(mi, li, 'title', e.target.value)}
                        className="border border-forest-100 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="Paste any YouTube link — auto-converted"
                        value={lesson.videoUrl}
                        onChange={(e) => updateLesson(mi, li, 'videoUrl', e.target.value)}
                        onBlur={(e) => updateLesson(mi, li, 'videoUrl', toEmbedUrl(e.target.value))}
                        className="border border-forest-100 rounded-lg px-3 py-2 text-sm"
                      />
                      <input
                        placeholder="12:30"
                        value={lesson.duration}
                        onChange={(e) => updateLesson(mi, li, 'duration', e.target.value)}
                        className="border border-forest-100 rounded-lg px-3 py-2 text-sm"
                      />
                      <button type="button" onClick={() => removeLesson(mi, li)} className="text-red-600 text-xs">
                        ✕
                      </button>
                    </div>
                  ))}
                  <button type="button" onClick={() => addLesson(mi)} className="text-xs text-forest-700 font-medium hover:underline">
                    + Add lesson
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-3">
          <button
            type="submit" disabled={saving}
            className="bg-forest-700 text-white px-6 py-2.5 rounded-full font-medium disabled:opacity-60"
          >
            {saving ? 'Saving...' : isNew ? 'Create course' : 'Save changes'}
          </button>
          <button type="button" onClick={() => navigate('/admin')} className="px-6 py-2.5 rounded-full font-medium border border-forest-100">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
