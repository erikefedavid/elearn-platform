'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layouts/Navbar';
import { FiBookOpen, FiUsers, FiClock, FiPlay, FiFileText, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';

interface Lesson { _id: string; title: string; type: string; order: number; duration?: number; quiz?: string; }
interface CourseDetail {
  _id: string; title: string; description: string; category: string; skillLevel: string;
  thumbnail?: string; instructor: { _id: string; name: string; email: string };
  enrolledCount: number; lessons: Lesson[]; status: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (params.id) {
      fetchCourse();
      fetchEnrollmentStatus();
    }
  }, [params.id]);

  async function fetchCourse() {
    try {
      const res = await fetch(`/api/courses/${params.id}`);
      const data = await res.json();
      if (data.success) setCourse(data.data);
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function fetchEnrollmentStatus() {
    try {
      const res = await fetch('/api/progress');
      const data = await res.json();
      if (data.success) {
        const isAlreadyEnrolled = data.data.progress?.some((p: { course: { _id: string } }) => p.course._id === params.id);
        if (isAlreadyEnrolled) setEnrolled(true);
      }
    } catch { /* ignore */ }
  }

  function handleEnroll() {
    // Show mock checkout instead of enrolling immediately
    setShowCheckout(true);
  }

  async function processPayment(e: React.FormEvent) {
    e.preventDefault();
    setEnrolling(true);
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id }),
      });
      const data = await res.json();
      if (data.success || data.error?.includes('Already enrolled')) {
        setEnrolled(true);
        setShowCheckout(false);
        router.push(`/student/learn/${params.id}/${course?.lessons[0]?._id}`);
      }
    } catch { /* ignore */ }
    setEnrolling(false);
  }

  const levelColors: Record<string, string> = { beginner: 'badge-success', intermediate: 'badge-warning', advanced: 'badge-danger' };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 page-container">
          <div className="h-64 shimmer rounded-2xl mb-6" />
          <div className="h-8 w-1/2 shimmer rounded mb-4" />
          <div className="h-4 w-3/4 shimmer rounded" />
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 page-container text-center">
          <p className="text-muted-foreground text-lg">Course not found.</p>
          <Link href="/courses" className="btn-primary mt-4 inline-block">Back to Courses</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-12 page-container">
        <Link href="/courses" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <FiArrowLeft className="w-4 h-4" /> Back to Courses
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="relative h-64 rounded-2xl overflow-hidden bg-gradient-to-br from-primary-600/30 to-accent-500/30">
              {course.thumbnail ? (
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiBookOpen className="w-20 h-20 text-primary-400/30" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className={levelColors[course.skillLevel] || 'badge-info'}>{course.skillLevel}</span>
                <span className="badge bg-muted/80 text-foreground/90">{course.category}</span>
              </div>
            </div>

            <div>
              <h1 className="text-3xl font-bold text-foreground mb-3">{course.title}</h1>
              <p className="text-muted-foreground leading-relaxed">{course.description}</p>
            </div>

            {/* Lessons List */}
            <div className="glass-card p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                Course Content ({course.lessons.length} lessons)
              </h2>
              <div className="space-y-2">
                {course.lessons.map((lesson, i) => (
                  <div key={lesson._id} className="flex items-center gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted/50 transition-colors">
                    <div className="w-8 h-8 rounded-lg bg-primary-500/20 flex items-center justify-center text-primary-400 text-sm font-bold">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-foreground font-medium">{lesson.title}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground/80 mt-1">
                        {lesson.type === 'video' && <span className="flex items-center gap-1"><FiPlay className="w-3 h-3" /> Video</span>}
                        {lesson.type === 'pdf' && <span className="flex items-center gap-1"><FiFileText className="w-3 h-3" /> PDF</span>}
                        {lesson.type === 'text' && <span className="flex items-center gap-1"><FiFileText className="w-3 h-3" /> Text</span>}
                        {lesson.duration && <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {lesson.duration} min</span>}
                      </div>
                    </div>
                    {lesson.quiz && <span className="badge badge-info text-xs">Quiz</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="glass-card p-6 sticky top-24">
              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Instructor</span>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center text-white text-xs font-bold">
                      {course.instructor.name.charAt(0)}
                    </div>
                    <span className="text-foreground text-sm font-medium">{course.instructor.name}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Students</span>
                  <span className="text-foreground text-sm flex items-center gap-1"><FiUsers className="w-4 h-4" /> {course.enrolledCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Lessons</span>
                  <span className="text-foreground text-sm">{course.lessons.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-sm">Level</span>
                  <span className={levelColors[course.skillLevel] || 'badge-info'}>{course.skillLevel}</span>
                </div>
              </div>

              <button onClick={handleEnroll} disabled={enrolling || enrolled} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
                {enrolled ? <><FiCheckCircle className="w-5 h-5" /> Enrolled</> : <>Enroll Now</>}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mock Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card border border-border/50 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border">
              <h3 className="text-xl font-bold text-foreground flex justify-between items-center">
                Checkout (Simulated)
                <button onClick={() => setShowCheckout(false)} className="text-muted-foreground hover:text-foreground">&times;</button>
              </h3>
            </div>
            <form onSubmit={processPayment} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-1">Card Number</label>
                <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500 transition-colors" required defaultValue="4242 4242 4242 4242" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">Expiry</label>
                  <input type="text" placeholder="MM/YY" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500 transition-colors" required defaultValue="12/26" />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-1">CVC</label>
                  <input type="text" placeholder="123" className="w-full bg-muted/50 border border-border rounded-lg px-4 py-2 text-white outline-none focus:border-primary-500 transition-colors" required defaultValue="123" />
                </div>
              </div>
              <button type="submit" disabled={enrolling} className="w-full btn-primary mt-6 flex justify-center items-center gap-2">
                {enrolling ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : `Pay & Enroll`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
