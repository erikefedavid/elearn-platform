'use client';

import { useState, useEffect } from 'react';
import { Book, Users, TrendingUp, Target } from 'lucide-react';
import ProgressCard from '@/components/dashboard/ProgressCard';
import CompletionChart from '@/components/analytics/CompletionChart';
import AtRiskTable from '@/components/analytics/AtRiskTable';

interface InstructorData {
  totalCourses: number; totalStudents: number; engagementRate: number;
  completionRate: number; avgQuizScore: number;
  avgTimeOnTaskMins: number; dropoutRiskScore: number;
  atRiskStudents: { name: string; email: string; course: string; score: number }[];
  courseMetrics: { courseTitle: string; enrolled: number; completed: number; avgScore: number }[];
}

export default function InstructorDashboard() {
  const [data, setData] = useState<InstructorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analytics/instructor');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();

    // SSE connection for real-time updates
    const eventSource = new EventSource('/api/analytics/stream');
    eventSource.addEventListener('update', () => {
      // Re-fetch analytics silently when an update is pushed
      fetch('/api/analytics/instructor')
        .then(res => res.json())
        .then(json => {
          if (json.success) setData(json.data);
        })
        .catch(console.error);
    });

    return () => {
      eventSource.close();
    };
  }, []);

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
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Instructor Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">Monitor your courses and student performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <ProgressCard title="Total Courses" value={data?.totalCourses || 0} icon={Book} color="purple" />
        <ProgressCard title="Total Students" value={data?.totalStudents || 0} icon={Users} color="green" />
        <ProgressCard title="Engagement Rate" value={`${data?.engagementRate || 0}%`} icon={TrendingUp} color="blue" />
        <ProgressCard title="Avg Quiz Score" value={`${data?.avgQuizScore || 0}%`} icon={Target} color="amber" />
        <ProgressCard title="Dropout Risk" value={`${data?.dropoutRiskScore || 0}%`} icon={Target} color="red" />
        <ProgressCard title="Avg Time/Task" value={`${data?.avgTimeOnTaskMins || 0}m`} icon={Target} color="rose" />
      </div>

      {data?.courseMetrics && data.courseMetrics.length > 0 && (
        <div className="space-y-4">
          <CompletionChart data={data.courseMetrics} />
        </div>
      )}

      <div className="space-y-4">
        <AtRiskTable students={data?.atRiskStudents || []} />
      </div>
    </div>
  );
}
