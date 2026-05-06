'use client';

import { useState, useEffect } from 'react';
import { FiBook, FiSearch, FiShield } from 'react-icons/fi';

interface Course {
  _id: string; title: string; description: string; category: string;
  skillLevel: string; status: string; enrolledCount: number;
  instructor?: { name: string };
}

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/courses');
        const data = await res.json();
        if (data.success) setCourses(data.data.courses || []);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  const filtered = courses.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <FiShield className="text-danger" /> Manage Courses
        </h1>
        <p className="text-muted-foreground mt-1">Approve, reject, and manage all platform courses</p>
      </div>

      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/80" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-12" placeholder="Search courses..." />
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 shimmer rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <FiBook className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-muted-foreground">No courses found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <div key={c._id} className="flex items-center justify-between p-4 rounded-xl bg-muted/50 hover:bg-muted/30 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-foreground font-medium">{c.title}</h3>
                    <span className={c.status === 'published' ? 'badge badge-success' : 'badge badge-warning'}>{c.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground/80">
                    <span>{c.category}</span>
                    <span>{c.enrolledCount} enrolled</span>
                    {c.instructor && <span>by {c.instructor.name}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
