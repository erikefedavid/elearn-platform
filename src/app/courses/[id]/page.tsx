'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/layouts/Navbar';
import { FiBookOpen, FiUsers, FiClock, FiPlay, FiFileText, FiCheckCircle, FiArrowLeft } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { usePaystackPayment } from 'react-paystack';

interface Lesson { _id: string; title: string; type: string; order: number; duration?: number; quiz?: string; }
interface CourseDetail {
  _id: string; title: string; description: string; category: string; skillLevel: string;
  thumbnail?: string; instructor: { _id: string; name: string; email: string };
  enrolledCount: number; lessons: Lesson[]; status: string; price?: number;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    if (params.id) {
      fetchCourse();
      fetchEnrollmentStatus();
      fetchUser();
    }
  }, [params.id]);

  async function fetchUser() {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.success) setUserEmail(data.data.email);
    } catch { /* ignore */ }
  }

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
      const res = await fetch(`/api/progress?courseId=${params.id}`);
      const data = await res.json();
      if (data.success && data.data) {
        setEnrolled(true);
        setCompletedLessons(data.data.completedLessons?.map((l: any) => l._id || l) || []);
      }
    } catch { /* ignore */ }
  }

  const config = {
    reference: (new Date()).getTime().toString(),
    email: userEmail || 'student@eduadapt.com',
    amount: (course?.price || 15000) * 100, // Amount is in kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_placeholder',
  };

  const initializePayment = usePaystackPayment(config);

  function handleEnroll() {
    if (!userEmail) {
      router.push('/login');
      return;
    }
    setEnrolling(true);

    // If the key is a placeholder or mock key, bypass Paystack for smooth development/demo
    const isMockKey = 
      !process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.includes('placeholder') || 
      process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY.includes('1234567890abcdef');

    if (isMockKey) {
      processPayment();
      return;
    }

    initializePayment({
      onSuccess: () => {
        processPayment();
      },
      onClose: () => {
        setEnrolling(false);
      }
    });
  }

  async function processPayment() {
    try {
      const res = await fetch('/api/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId: params.id }),
      });
      const data = await res.json();
      if (data.success || data.error?.includes('Already enrolled')) {
        setEnrolled(true);
        router.push(`/student/my-courses`);
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
                <Image src={course.thumbnail} alt={course.title} fill sizes="(max-width: 1024px) 100vw, 66vw" className="object-cover" />
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
                {course.lessons.map((lesson, i) => {
                  const isCompleted = completedLessons.includes(lesson._id);
                  const nextUncompleted = course.lessons.find(l => !completedLessons.includes(l._id));
                  const isNextUp = enrolled && nextUncompleted && lesson._id === nextUncompleted._id;

                  const cardContent = (
                    <div 
                      onClick={(e) => {
                        if (!enrolled) {
                          e.preventDefault();
                          const enrollCard = document.getElementById('enroll-card');
                          if (enrollCard) {
                            enrollCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            enrollCard.classList.add('ring-4', 'ring-primary-500/50', 'scale-[1.02]');
                            setTimeout(() => {
                              enrollCard.classList.remove('ring-4', 'ring-primary-500/50', 'scale-[1.02]');
                            }, 1500);
                          }
                        }
                      }}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${
                        enrolled
                          ? 'bg-muted/30 hover:bg-primary-500/5 border border-transparent cursor-pointer hover:translate-x-1 hover:shadow-sm'
                          : 'bg-muted/50 hover:bg-muted/70 cursor-pointer'
                      } ${isNextUp ? 'border-primary-500/40 bg-primary-500/5 shadow-sm' : ''} ${
                        isCompleted ? 'border-emerald-500/20 bg-emerald-500/5' : ''
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        isCompleted
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : isNextUp
                          ? 'bg-primary-500 text-white animate-pulse'
                          : 'bg-primary-500/20 text-primary-400'
                      }`}>
                        {isCompleted ? <FiCheckCircle className="w-5 h-5" /> : i + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`font-medium transition-colors ${
                            isCompleted ? 'text-muted-foreground line-through' : 'text-foreground'
                          } ${isNextUp ? 'text-primary-400 font-semibold' : ''}`}>
                            {lesson.title}
                          </p>
                          {isNextUp && (
                            <span className="badge bg-primary-500 text-white text-[10px] uppercase font-extrabold py-0.5 px-2 rounded animate-pulse">
                              Next Up
                            </span>
                          )}
                          {isCompleted && (
                            <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-500/10 py-0.5 px-2 rounded">
                              Completed
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground/80 mt-1">
                          {lesson.type === 'video' && <span className="flex items-center gap-1"><FiPlay className="w-3 h-3" /> Video</span>}
                          {lesson.type === 'pdf' && <span className="flex items-center gap-1"><FiFileText className="w-3 h-3" /> PDF</span>}
                          {lesson.type === 'text' && <span className="flex items-center gap-1"><FiFileText className="w-3 h-3" /> Text</span>}
                          {lesson.duration && <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> {lesson.duration} min</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {lesson.quiz && <span className="badge badge-info text-xs">Quiz</span>}
                        {enrolled && (
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center bg-primary-500/10 text-primary transition-all ${
                            isNextUp ? 'opacity-100 scale-110' : 'opacity-0 hover:opacity-100'
                          }`}>
                            <FiPlay className="w-3 h-3 fill-current" />
                          </div>
                        )}
                      </div>
                    </div>
                  );

                  return enrolled ? (
                    <Link key={lesson._id} href={`/student/learn/${course._id}/${lesson._id}`} className="block group/lesson">
                      {cardContent}
                    </Link>
                  ) : (
                    <div key={lesson._id}>
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div id="enroll-card" className="glass-card p-6 sticky top-24 transition-all duration-300">
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

              {enrolled ? (
                <Link href={`/student/learn/${course._id}/${course.lessons.find(l => !completedLessons.includes(l._id))?._id || course.lessons[0]?._id || ''}`} className="w-full block">
                  <button className="btn-primary w-full flex items-center justify-center gap-2">
                    <FiPlay className="w-5 h-5 fill-current" /> {completedLessons.length === 0 ? 'Start Course' : 'Resume Where You Left Off'}
                  </button>
                </Link>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling} className="btn-primary w-full flex items-center justify-center gap-2 animate-pulse-glow">
                  Enroll Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
