'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Target, CheckCircle, Lock, Play, FileText, ArrowRight, Award, Download } from 'lucide-react';
import Link from 'next/link';

interface Lesson { _id: string; title: string; type: string; order: number; }
interface CourseDetail {
  _id: string; title: string; category: string;
  lessons: Lesson[];
}

export default function CourseLearningPathPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const router = useRouter();
  
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [courseRes, progressRes] = await Promise.all([
          fetch(`/api/courses/${courseId}`),
          fetch(`/api/progress?courseId=${courseId}`)
        ]);
        
        const courseData = await courseRes.json();
        const progressData = await progressRes.json();

        if (courseData.success) {
          setCourse(courseData.data);
        }
        if (progressData.success && progressData.data) {
          setCompletedLessons(progressData.data.completedLessons?.map((l: any) => l._id || l) || []);
        }
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    load();
  }, [courseId]);

  if (loading) {
    return (
      <div className="space-y-10">
        <div className="h-10 w-64 bg-muted animate-pulse rounded" />
        <div className="h-96 bg-muted animate-pulse rounded-3xl" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-4">Course not found</h2>
        <button onClick={() => router.push('/courses')} className="btn-primary">Browse Courses</button>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Your Learning Path</h1>
        <p className="text-muted-foreground mt-2 text-lg">Your personalized journey through <span className="text-primary font-bold">{course.title}</span></p>
        
        {course.lessons.length > 0 && completedLessons.length < course.lessons.length && (
          <Link href={`/student/learn/${courseId}/${course.lessons.find(l => !completedLessons.includes(l._id))?._id || course.lessons[0]._id}`}>
            <button className="mt-6 btn-primary flex items-center gap-2 shadow-lg shadow-primary/30">
              <Play className="w-4 h-4 fill-current" />
              {completedLessons.length === 0 ? 'Start Learning' : 'Resume Where You Left Off'}
            </button>
          </Link>
        )}
      </div>

      <div className="bg-card p-8 rounded-3xl border border-border shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none" />
        
        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-primary/20 text-primary">
              <Target className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">{course.category} Roadmap</h2>
          </div>
          <div className="flex items-center gap-4">
            {completedLessons.length > 0 && completedLessons.length === course.lessons.length && (
              <button 
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-2 btn-primary py-2 px-4 text-sm shadow-lg shadow-primary/30 animate-pulse-glow"
              >
                <Award className="w-4 h-4" /> Get Certificate
              </button>
            )}
            <div className="text-sm font-bold text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
              {completedLessons.length} / {course.lessons.length} Completed
            </div>
          </div>
        </div>
        
        <div className="relative z-10 pl-2">
          {/* Timeline line */}
          <div className="absolute left-[1.6rem] top-2 bottom-6 w-0.5 bg-border/50" />
          
          <div className="space-y-6">
            {course.lessons.map((lesson, i) => {
              const isCompleted = completedLessons.includes(lesson._id);
              const isNextOrFirst = !isCompleted && (i === 0 || completedLessons.includes(course.lessons[i - 1]?._id));
              const isLocked = !isCompleted && !isNextOrFirst;

              return (
                <div key={lesson._id} className="flex items-center gap-6 relative group">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 flex-shrink-0 transition-all duration-300 ${
                    isCompleted ? 'bg-success-500 text-white shadow-lg shadow-success-500/30' : 
                    isNextOrFirst ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30 scale-110' : 
                    'bg-muted border border-border text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : 
                     isLocked ? <Lock className="w-4 h-4" /> : 
                     <Target className="w-5 h-5" />}
                  </div>
                  
                  <div className={`flex-1 p-4 rounded-xl transition-all duration-300 ${
                    isNextOrFirst ? 'bg-primary/10 border border-primary/30 shadow-sm shadow-primary/5 scale-[1.02]' : 
                    isCompleted ? 'bg-success-500/5 border border-success-500/20' :
                    'bg-muted/30 border border-transparent hover:border-border'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`text-lg font-bold ${isNextOrFirst ? 'text-primary' : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                          Step {i + 1}: {lesson.title}
                        </span>
                        <span className="badge badge-info text-xs capitalize">{lesson.type}</span>
                      </div>
                      
                      {isLocked ? (
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Locked</span>
                      ) : (
                        <Link href={`/student/learn/${courseId}/${lesson._id}`}>
                          <button className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all ${
                            isNextOrFirst ? 'bg-primary text-primary-foreground hover:scale-105 shadow-md shadow-primary/20' : 
                            'bg-muted text-foreground hover:bg-muted-foreground/20'
                          }`}>
                            {isCompleted ? 'Review Lesson' : 'Start Lesson'} <ArrowRight className="w-4 h-4" />
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-card border border-border/50 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex justify-between items-center">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Award className="text-primary-500 w-6 h-6" /> Course Certificate
              </h3>
              <button onClick={() => setShowCertificate(false)} className="text-muted-foreground hover:text-foreground text-2xl">&times;</button>
            </div>
            <div className="p-10 bg-gradient-to-br from-primary-900/40 via-background to-accent-900/40 relative flex flex-col items-center justify-center min-h-[400px] border-[10px] border-double border-primary-500/30 m-6 rounded-xl text-center">
              <Award className="w-20 h-20 text-primary-400 mb-6 opacity-80" />
              <h2 className="text-4xl font-serif font-bold text-foreground mb-2">Certificate of Completion</h2>
              <p className="text-muted-foreground text-lg mb-6">This certifies that you have successfully completed the course</p>
              <h3 className="text-3xl font-bold text-primary-400 mb-8 max-w-xl">{course.title}</h3>
              <div className="flex justify-between w-full max-w-md mt-8 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-foreground font-bold font-signature text-xl">EduEarn</div>
                  <div className="text-xs text-muted-foreground mt-1">Platform</div>
                </div>
                <div className="text-center">
                  <div className="text-foreground font-bold">{new Date().toLocaleDateString()}</div>
                  <div className="text-xs text-muted-foreground mt-1">Date</div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-border bg-muted/20 flex justify-end">
              <button onClick={() => { alert('Certificate download started! (Simulated)'); setShowCertificate(false); }} className="btn-primary flex items-center gap-2">
                <Download className="w-4 h-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
