'use client';

import { Target, CheckCircle, Lock } from 'lucide-react';

const PATHS = [
  { title: 'Frontend Development', steps: ['HTML & CSS Basics', 'JavaScript Fundamentals', 'React.js', 'Next.js', 'TypeScript', 'Testing'], color: 'bg-primary/20 text-primary', gradient: 'from-primary/20 to-primary/5' },
  { title: 'Data Science', steps: ['Python Basics', 'Statistics', 'Pandas & NumPy', 'Machine Learning', 'Data Visualization', 'Deep Learning'], color: 'bg-emerald-500/20 text-emerald-500', gradient: 'from-emerald-500/20 to-emerald-500/5' },
  { title: 'Mobile Development', steps: ['JavaScript/TypeScript', 'React Native', 'State Management', 'Native APIs', 'Testing', 'Deployment'], color: 'bg-blue-500/20 text-blue-500', gradient: 'from-blue-500/20 to-blue-500/5' },
];

export default function LearningPathPage() {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Learning Paths</h1>
        <p className="text-muted-foreground mt-2 text-lg">Structured roadmaps to guide your learning journey</p>
      </div>

      <div className="space-y-8">
        {PATHS.map((path) => (
          <div key={path.title} className="bg-card p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${path.gradient} rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none`} />
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${path.color}`}>
                <Target className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-foreground">{path.title}</h2>
            </div>
            
            <div className="relative z-10 pl-2">
              {/* Timeline line */}
              <div className="absolute left-[1.6rem] top-2 bottom-6 w-0.5 bg-border" />
              <div className="space-y-6">
                {path.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-6 relative">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 ${
                      i === 0 ? path.color.replace('/20', '') : 'bg-muted border border-border'
                    }`}>
                      {i === 0 ? <CheckCircle className="w-5 h-5 text-primary-foreground" /> : <Lock className="w-4 h-4 text-muted-foreground" />}
                    </div>
                    <div className={`flex-1 p-4 rounded-xl transition-colors ${i === 0 ? 'bg-primary/5 border border-primary/20' : 'bg-muted/30 border border-transparent hover:border-border'}`}>
                      <span className={`text-base font-semibold ${i === 0 ? 'text-foreground' : 'text-muted-foreground'}`}>
                        Step {i + 1}: {step}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
