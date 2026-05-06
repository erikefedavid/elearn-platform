'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import LessonSidebar from '@/components/course/LessonSidebar';
import VideoPlayer from '@/components/course/VideoPlayer';
import PDFViewer from '@/components/course/PDFViewer';
import Link from 'next/link';
import { FiCheckCircle, FiArrowRight } from 'react-icons/fi';

interface Lesson { _id: string; title: string; type: string; contentUrl: string; order: number; duration?: number; quiz?: string; }

export default function CoursePlayerPage() {
  const params = useParams();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [courseId, lessonId]);

  async function loadData() {
    setLoading(true);
    try {
      const [lessonsRes, progressRes] = await Promise.all([
        fetch(`/api/lessons?courseId=${courseId}`),
        fetch(`/api/progress?courseId=${courseId}`),
      ]);
      const lessonsData = await lessonsRes.json();
      const progressData = await progressRes.json();

      if (lessonsData.success) {
        setLessons(lessonsData.data);
        const lesson = lessonsData.data.find((l: Lesson) => l._id === lessonId);
        setCurrentLesson(lesson || lessonsData.data[0]);
      }
      if (progressData.success && progressData.data) {
        setCompletedLessons(progressData.data.completedLessons?.map((l: { _id: string }) => l._id || l) || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }

  async function markComplete() {
    // Progress is updated when quiz is submitted. This is a manual completion for lessons without quizzes.
    if (!currentLesson?.quiz) {
      setCompletedLessons((prev) => [...prev, currentLesson!._id]);
    }
  }

  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'content' | 'discussion'>('content');

  async function handleDownload() {
    setIsDownloading(true);
    // Simulate network download
    setTimeout(() => {
      setIsDownloading(false);
      setDownloaded(true);
    }, 2000);
  }

  // Adaptive Tag Logic (Simulated)
  const isStruggling = currentLesson && currentLesson.order > 1 && !completedLessons.includes(currentLesson._id);

  if (loading) {
    return <div className="flex gap-6"><div className="flex-1 h-96 shimmer rounded-2xl" /><div className="w-72 h-96 shimmer rounded-2xl hidden lg:block" /></div>;
  }

  return (
    <div className="flex gap-6 -mx-4 sm:-mx-6 lg:-mx-8 -my-8">
      {/* Main Content */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        {currentLesson && (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-foreground">{currentLesson.title}</h1>
                  {isStruggling && <span className="badge badge-warning text-xs">Review Recommended</span>}
                  {!isStruggling && <span className="badge badge-success text-xs bg-success-500/10 text-success-400">On Track</span>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge badge-info">{currentLesson.type}</span>
                  {currentLesson.type === 'video' && (
                    <button 
                      onClick={handleDownload} 
                      disabled={isDownloading || downloaded}
                      className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {downloaded ? <span className="text-success-400 flex items-center gap-1"><FiCheckCircle /> Downloaded</span> : isDownloading ? 'Downloading...' : '⬇ Download for Offline'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border">
              <button 
                onClick={() => setActiveTab('content')} 
                className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'content' ? 'border-primary-500 text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
              >
                Lesson Content
              </button>
              <button 
                onClick={() => setActiveTab('discussion')} 
                className={`pb-3 px-4 text-sm font-medium transition-colors border-b-2 ${activeTab === 'discussion' ? 'border-primary-500 text-white' : 'border-transparent text-muted-foreground hover:text-white'}`}
              >
                Q&A Discussion
              </button>
            </div>

            {activeTab === 'content' ? (
              <>
                {/* Content */}
                {currentLesson.type === 'video' && <VideoPlayer url={currentLesson.contentUrl} title={currentLesson.title} />}
                {currentLesson.type === 'pdf' && <PDFViewer url={currentLesson.contentUrl} title={currentLesson.title} />}
                {currentLesson.type === 'text' && (
                  <div className="glass-card p-8 prose prose-invert max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: currentLesson.contentUrl }} />
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-4 pt-4">
                  {!completedLessons.includes(currentLesson._id) && !currentLesson.quiz && (
                    <button onClick={markComplete} className="btn-accent flex items-center gap-2">
                      <FiCheckCircle className="w-5 h-5" /> Mark Complete
                    </button>
                  )}
                  {currentLesson.quiz && (
                    <Link href={`/student/quiz/${currentLesson._id}`} className="btn-primary flex items-center gap-2">
                      Take Quiz <FiArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                  {completedLessons.includes(currentLesson._id) && (
                    <span className="badge badge-success text-sm py-2 px-4">✓ Completed</span>
                  )}
                </div>
              </>
            ) : (
              <div className="glass-card p-6 space-y-6">
                <h3 className="text-lg font-bold text-foreground">Course Discussion</h3>
                
                {/* Mock Thread */}
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center font-bold text-xs">JD</div>
                        <span className="text-sm font-medium text-foreground">John Doe</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 days ago</span>
                    </div>
                    <p className="text-muted-foreground text-sm">I am having a bit of trouble understanding this concept. Can someone explain it differently?</p>
                    
                    {/* Mock Reply */}
                    <div className="mt-4 ml-6 pl-4 border-l-2 border-border space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-400 flex items-center justify-center font-bold text-[10px]">DS</div>
                        <span className="text-xs font-medium text-foreground">Dr. Jane Smith <span className="badge badge-info text-[10px] ml-1 px-1 py-0">Instructor</span></span>
                      </div>
                      <p className="text-muted-foreground text-sm">Hi John, think of it like building a house. You need the foundation first. I have added a supplementary PDF to the next lesson that should help clarify!</p>
                    </div>
                  </div>
                </div>

                {/* Input */}
                <div className="mt-6">
                  <textarea placeholder="Ask a question..." className="w-full bg-card border border-border rounded-xl p-4 text-white text-sm outline-none focus:border-primary-500 resize-none h-24" />
                  <div className="flex justify-end mt-2">
                    <button className="btn-primary py-2 px-4 text-sm">Post Question</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block w-80 border-l border-border/50 min-h-screen">
        <LessonSidebar lessons={lessons} courseId={courseId} currentLessonId={lessonId} completedLessons={completedLessons} />
      </div>
    </div>
  );
}
