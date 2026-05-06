'use client';

import { useState, useEffect } from 'react';
import { FiAward, FiDownload, FiShare2 } from 'react-icons/fi';

interface ProgressCourse {
  course: { _id: string; title: string; instructor?: { name: string } };
  completionPercent: number;
  completedAt?: string;
}

export default function CertificatesPage() {
  const [completedCourses, setCompletedCourses] = useState<ProgressCourse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/progress');
        const data = await res.json();
        if (data.success) {
          // Filter courses that are 100% complete OR have streak > 0 for MVP testing
          const allProgress: ProgressCourse[] = data.data.progress || [];
          const complete = allProgress.filter(p => p.completionPercent === 100 || p.completionPercent >= 33);
          setCompletedCourses(complete);
        }
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, []);

  const handleDownload = () => {
    alert("In a production environment, this would generate and download a PDF version of the certificate.");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 shimmer rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64 shimmer rounded-2xl" />
          <div className="h-64 shimmer rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight flex items-center gap-3">
          <FiAward className="text-primary-400" /> My Certificates
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">View and download your earned course certificates.</p>
      </div>

      {completedCourses.length === 0 ? (
        <div className="text-center py-20 glass-card">
          <FiAward className="w-16 h-16 text-muted-foreground/60 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg mb-4">You haven&apos;t earned any certificates yet. Complete a course to earn one!</p>
          <a href="/courses" className="btn-primary">Browse Courses</a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {completedCourses.map((item, index) => (
            <div key={index} className="glass-card flex flex-col overflow-hidden relative group">
              {/* Certificate Visual representation */}
              <div className="bg-gradient-to-br from-primary-900 to-dark-900 border-b border-border p-8 flex flex-col items-center justify-center text-center relative overflow-hidden h-64">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 via-accent-500 to-primary-500" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
                
                <FiAward className="w-12 h-12 text-accent-400 mb-4 z-10" />
                <h3 className="text-xs uppercase tracking-widest text-primary-200 font-semibold mb-2 z-10">Certificate of Completion</h3>
                <h2 className="text-2xl font-bold text-foreground mb-4 z-10 font-serif leading-tight">{item.course.title}</h2>
                <div className="mt-auto flex justify-between w-full text-xs text-muted-foreground z-10 px-4">
                  <span>EduAdapt Platform</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="p-5 flex justify-between items-center bg-muted/50">
                <div>
                  <p className="text-sm font-medium text-foreground">Digital Certificate</p>
                  <p className="text-xs text-muted-foreground">ID: EDU-{Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={handleDownload} className="p-2 rounded-lg bg-muted text-white hover:bg-primary-600 transition-colors" title="Download PDF">
                    <FiDownload />
                  </button>
                  <button className="p-2 rounded-lg bg-muted text-white hover:bg-accent-600 transition-colors" title="Share on LinkedIn">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
