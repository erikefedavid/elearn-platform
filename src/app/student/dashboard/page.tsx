'use client';

import { useState, useEffect } from 'react';
import { Book, Award, TrendingUp } from 'lucide-react';
import ProgressCard from '@/components/dashboard/ProgressCard';
import StreakBadge from '@/components/dashboard/StreakBadge';
import ScoreHistoryChart from '@/components/analytics/ScoreHistoryChart';
import CourseCard from '@/components/course/CourseCard';

interface Analytics {
  totalCourses: number; completedCourses: number; averageScore: number; streak: number;
  quizHistory: { date: string; score: number; lessonTitle: string }[];
  courseProgress: { courseTitle: string; progress: number }[];
}

interface EnrolledCourse {
  _id: string; title: string; description: string; category: string; skillLevel: string;
  thumbnail?: string; instructor?: { name: string };
}

interface ProgressData {
  course: EnrolledCourse; completionPercent: number;
}

export default function StudentDashboard() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [progressList, setProgressList] = useState<ProgressData[]>([]);
  const [recommended, setRecommended] = useState<EnrolledCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([fetchAnalytics(), fetchProgress(), fetchRecommended()]).finally(() => setLoading(false));
  }, []);

  async function fetchAnalytics() {
    try {
      const res = await fetch('/api/analytics/student');
      const data = await res.json();
      if (data.success) setAnalytics(data.data);
    } catch { /* ignore */ }
  }

  async function fetchProgress() {
    try {
      const res = await fetch('/api/progress');
      const data = await res.json();
      if (data.success) setProgressList(data.data.progress || []);
    } catch { /* ignore */ }
  }

  async function fetchRecommended() {
    try {
      const res = await fetch('/api/courses?limit=3');
      const data = await res.json();
      if (data.success) setRecommended(data.data.courses || []);
    } catch { /* ignore */ }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted animate-pulse rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-32 bg-muted animate-pulse rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Student Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">Track your learning progress and stay on course</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard title="Enrolled Courses" value={analytics?.totalCourses || 0} icon={Book} color="purple" />
        <ProgressCard title="Completed" value={analytics?.completedCourses || 0} icon={Award} color="green" />
        <ProgressCard title="Avg Score" value={`${analytics?.averageScore || 0}%`} icon={TrendingUp} color="blue" />
        <StreakBadge streak={analytics?.streak || 0} />
      </div>

      {/* Course Progress */}
      {progressList.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Continue Learning</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {progressList.map((p) => (
              <CourseCard key={p.course._id} {...p.course} progress={p.completionPercent} />
            ))}
          </div>
        </div>
      )}

      {/* Quiz History */}
      {analytics?.quizHistory && analytics.quizHistory.length > 0 && (
        <div className="space-y-4">
          <ScoreHistoryChart data={analytics.quizHistory} />
        </div>
      )}

      {/* Recommended */}
      {recommended.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Recommended For You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((c) => <CourseCard key={c._id} {...c} />)}
          </div>
        </div>
      )}
    </div>
  );
}
