'use client';

import { useState, useEffect } from 'react';
import { Users, Book, TrendingUp, Activity } from 'lucide-react';
import ProgressCard from '@/components/dashboard/ProgressCard';
import EngagementChart from '@/components/analytics/EngagementChart';
import { Badge } from '@/components/ui/badge';

interface AdminData {
  totalUsers: number; totalStudents: number; totalInstructors: number;
  totalCourses: number; publishedCourses: number; retentionRate: number;
  totalEnrollments: number; completedEnrollments: number;
  popularCourses: { title: string; enrolled: number }[];
  userGrowth: { date: string; count: number }[];
}

export default function AdminDashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analytics/admin');
        const json = await res.json();
        if (json.success) setData(json.data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
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
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2 text-lg">Platform-wide statistics and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ProgressCard title="Total Users" value={data?.totalUsers || 0} icon={Users} color="purple" subtitle={`${data?.totalStudents || 0} students, ${data?.totalInstructors || 0} instructors`} />
        <ProgressCard title="Total Courses" value={data?.totalCourses || 0} icon={Book} color="green" subtitle={`${data?.publishedCourses || 0} published`} />
        <ProgressCard title="Retention Rate" value={`${data?.retentionRate || 0}%`} icon={TrendingUp} color="blue" />
        <ProgressCard title="Total Enrollments" value={data?.totalEnrollments || 0} icon={Activity} color="amber" subtitle={`${data?.completedEnrollments || 0} completed`} />
      </div>

      {data?.userGrowth && (
        <div className="space-y-4">
          <EngagementChart data={data.userGrowth} title="User Growth (30 days)" />
        </div>
      )}

      {/* Popular Courses */}
      {data?.popularCourses && data.popularCourses.length > 0 && (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
          <h3 className="text-xl font-bold text-foreground tracking-tight mb-6">Popular Courses</h3>
          <div className="space-y-4">
            {data.popularCourses.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-foreground font-bold">{c.title}</span>
                </div>
                <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 shadow-none border-0 shrink-0">
                  {c.enrolled} enrolled
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
