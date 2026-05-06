'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { FiUsers, FiAlertTriangle } from 'react-icons/fi';

interface StudentData {
  name: string; email: string; score: number; course: string;
}

export default function CourseStudentsPage() {
  const params = useParams();
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/analytics/instructor');
        const data = await res.json();
        if (data.success) {
          setStudents(data.data.atRiskStudents || []);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [params.id]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Student Performance</h1>
        <p className="text-muted-foreground mt-1">Monitor student progress and identify those who need help</p>
      </div>

      <div className="glass-card p-6">
        {loading ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-16 shimmer rounded-xl" />)}</div>
        ) : students.length === 0 ? (
          <div className="text-center py-12">
            <FiUsers className="w-12 h-12 text-muted-foreground/60 mx-auto mb-3" />
            <p className="text-muted-foreground">No student data available yet.</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Student</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Course</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Score</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-2"><p className="text-foreground font-medium">{s.name}</p><p className="text-muted-foreground/80 text-xs">{s.email}</p></td>
                  <td className="py-3 px-2 text-muted-foreground">{s.course}</td>
                  <td className="py-3 px-2"><span className="text-danger font-semibold">{s.score}%</span></td>
                  <td className="py-3 px-2"><span className="badge badge-danger flex items-center gap-1 w-fit"><FiAlertTriangle className="w-3 h-3" /> At Risk</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
