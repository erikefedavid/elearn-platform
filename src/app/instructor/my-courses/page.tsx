'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiPlus, FiEdit, FiUsers } from 'react-icons/fi';

interface Course {
  _id: string; title: string; description: string; category: string; skillLevel: string;
  status: string; enrolledCount: number; lessons: string[];
}

export default function InstructorMyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/courses?instructor=true');
        const data = await res.json();
        if (data.success) setCourses(data.data.courses || []);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Courses</h1>
          <p className="text-muted-foreground mt-1">Manage your created courses</p>
        </div>
        <Link href="/instructor/courses/create" className="btn-primary flex items-center gap-2">
          <FiPlus className="w-5 h-5" /> New Course
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 shimmer rounded-2xl" />)}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <p className="text-muted-foreground text-lg mb-4">You haven&apos;t created any courses yet.</p>
          <Link href="/instructor/courses/create" className="btn-primary">Create Your First Course</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {courses.map((course) => (
            <div key={course._id} className="glass-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground">{course.title}</h3>
                  <span className={course.status === 'published' ? 'badge badge-success' : 'badge badge-warning'}>{course.status}</span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{course.description}</p>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground/80">
                  <span>{course.category}</span>
                  <span className="flex items-center gap-1"><FiUsers className="w-3 h-3" /> {course.enrolledCount} students</span>
                  <span>{course.lessons?.length || 0} lessons</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/instructor/courses/${course._id}/edit`} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1">
                  <FiEdit className="w-4 h-4" /> Edit
                </Link>
                <Link href={`/instructor/courses/${course._id}/lessons/upload`} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1">
                  <FiPlus className="w-4 h-4" /> Lesson
                </Link>
                <Link href={`/instructor/courses/${course._id}/students`} className="btn-secondary text-sm py-2 px-3 flex items-center gap-1">
                  <FiUsers className="w-4 h-4" /> Students
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
