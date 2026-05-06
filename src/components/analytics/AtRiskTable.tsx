'use client';

import { AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AtRiskStudent {
  name: string;
  email: string;
  course: string;
  score: number;
}

interface AtRiskTableProps {
  students: AtRiskStudent[];
}

export default function AtRiskTable({ students }: AtRiskTableProps) {
  return (
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="w-6 h-6 text-destructive" />
        <h3 className="text-xl font-bold text-foreground tracking-tight">At-Risk Students</h3>
        {students.length > 0 && (
          <Badge variant="destructive" className="ml-2 font-bold px-2 py-0.5">{students.length}</Badge>
        )}
      </div>
      {students.length === 0 ? (
        <div className="p-8 text-center bg-muted/50 rounded-xl border border-border/50">
          <p className="text-muted-foreground text-lg">No at-risk students detected. Great job! 🎉</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Student</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Course</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Score</th>
                <th className="text-left py-4 px-4 text-muted-foreground font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-4 px-4">
                    <div>
                      <p className="text-foreground font-bold">{student.name}</p>
                      <p className="text-muted-foreground text-xs mt-1">{student.email}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-muted-foreground font-medium">{student.course}</td>
                  <td className="py-4 px-4">
                    <span className="text-destructive font-bold text-base">{student.score}%</span>
                  </td>
                  <td className="py-4 px-4">
                    <Badge variant="destructive" className="bg-destructive/10 text-destructive hover:bg-destructive/20 shadow-none border-0">
                      At Risk
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
