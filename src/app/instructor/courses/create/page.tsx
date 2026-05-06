'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiBookOpen, FiSave } from 'react-icons/fi';

const CATEGORIES = ['Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'Cybersecurity', 'UI/UX Design', 'Cloud Computing', 'DevOps', 'Artificial Intelligence'];

export default function CreateCoursePage() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', category: '', skillLevel: 'beginner', thumbnail: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        router.push(`/instructor/courses/${data.data._id}/lessons/upload`);
      } else {
        setError(data.error || 'Failed to create course');
      }
    } catch { setError('Something went wrong'); }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center">
          <FiBookOpen className="w-5 h-5 text-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Course</h1>
          <p className="text-muted-foreground text-sm">Fill in the details to create your course</p>
        </div>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <div className="p-3 rounded-xl bg-danger/10 border border-danger/20 text-danger text-sm">{error}</div>}

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Course Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="e.g. Introduction to Web Development" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[120px] resize-y" placeholder="Describe what students will learn..." required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field" required>
                <option value="">Select category</option>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">Skill Level</label>
              <select value={form.skillLevel} onChange={(e) => setForm({ ...form, skillLevel: e.target.value })} className="input-field">
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Thumbnail URL (optional)</label>
            <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="input-field" placeholder="https://..." />
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><FiSave className="w-4 h-4" /> Create Course</>}
          </button>
        </form>
      </div>
    </div>
  );
}
