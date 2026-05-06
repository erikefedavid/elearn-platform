'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/layouts/Navbar';
import CourseCard from '@/components/course/CourseCard';
import { FiSearch } from 'react-icons/fi';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Mobile Development', 'Machine Learning', 'Cybersecurity', 'UI/UX Design', 'Cloud Computing'];
const LEVELS = ['All', 'beginner', 'intermediate', 'advanced'];

interface CourseData {
  _id: string; title: string; description: string; category: string; skillLevel: string;
  thumbnail?: string; instructor?: { name: string }; enrolledCount?: number;
}

export default function CourseCataloguePage() {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [level, setLevel] = useState('All');

  useEffect(() => {
    fetchCourses();
  }, [category, level, search]);

  async function fetchCourses() {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'All') params.set('category', category);
    if (level !== 'All') params.set('skillLevel', level);
    if (search) params.set('search', search);

    try {
      const res = await fetch(`/api/courses?${params}`);
      const data = await res.json();
      if (data.success) setCourses(data.data.courses);
    } catch { /* ignore */ }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Course Catalogue</h1>
          <p className="text-muted-foreground mt-2">Explore our collection of courses and start learning today</p>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/80" />
            <input
              type="text" value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="input-field pl-12"
            />
          </div>
          <div className="flex gap-3 flex-wrap">
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field w-auto">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <select value={level} onChange={(e) => setLevel(e.target.value)} className="input-field w-auto capitalize">
              {LEVELS.map((l) => <option key={l} value={l} className="capitalize">{l === 'All' ? 'All Levels' : l}</option>)}
            </select>
          </div>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="glass-card overflow-hidden">
                <div className="h-48 shimmer" />
                <div className="p-5 space-y-3">
                  <div className="h-5 w-3/4 shimmer rounded" />
                  <div className="h-4 w-full shimmer rounded" />
                  <div className="h-4 w-1/2 shimmer rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No courses found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => <CourseCard key={course._id} {...course} />)}
          </div>
        )}
      </div>
    </div>
  );
}
