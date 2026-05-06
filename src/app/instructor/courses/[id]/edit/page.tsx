'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiSave, FiEye, FiEyeOff } from 'react-icons/fi';

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', category: '', skillLevel: 'beginner', thumbnail: '', status: 'draft' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/courses/${params.id}`);
        const data = await res.json();
        if (data.success) setForm(data.data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch(`/api/courses/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      router.push('/instructor/my-courses');
    } catch { /* ignore */ }
    setSaving(false);
  }

  async function togglePublish() {
    const newStatus = form.status === 'published' ? 'draft' : 'published';
    setForm({ ...form, status: newStatus });
    await fetch(`/api/courses/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  if (loading) return <div className="max-w-2xl mx-auto"><div className="h-64 shimmer rounded-2xl" /></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Edit Course</h1>
        <button onClick={togglePublish} className={form.status === 'published' ? 'btn-secondary flex items-center gap-2' : 'btn-accent flex items-center gap-2'}>
          {form.status === 'published' ? <><FiEyeOff className="w-4 h-4" /> Unpublish</> : <><FiEye className="w-4 h-4" /> Publish</>}
        </button>
      </div>

      <div className="glass-card p-8">
        <form onSubmit={handleSave} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Title</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[120px] resize-y" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Thumbnail URL</label>
            <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} className="input-field" />
          </div>
          <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
            <FiSave className="w-4 h-4" /> Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
