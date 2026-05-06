'use client';

import { useState, useEffect } from 'react';
import CourseCard from '@/components/course/CourseCard';

interface ProgressCourse {
  course: { _id: string; title: string; description: string; category: string; skillLevel: string; thumbnail?: string; instructor?: { name: string } };
  completionPercent: number;
}

export default function StudentMyCoursesPage() {
  const [courses, setCourses] = useState<ProgressCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        if (data.success) setCourses(data.data.progress || []);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
        <p className="text-muted-foreground mt-1">All courses you&apos;re enrolled in</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="glass-card overflow-hidden">
              <div className="h-48 shimmer" />
              <div className="p-5 space-y-3"><div className="h-5 w-3/4 shimmer rounded" /><div className="h-4 w-full shimmer rounded" /></div>
            </div>
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-muted-foreground text-lg mb-4">You haven&apos;t enrolled in any courses yet.</p>
          <a href="/courses" className="btn-primary">Browse Courses</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((p) => (
            <CourseCard key={p.course._id} {...p.course} progress={p.completionPercent} />
          ))}
        </div>
      )}
    </div>
  );
}
