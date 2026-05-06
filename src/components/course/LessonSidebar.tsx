'use client';

import Link from 'next/link';
import { FiPlay, FiCheckCircle, FiFileText, FiVideo } from 'react-icons/fi';

interface Lesson {
  _id: string;
  title: string;
  type: string;
  order: number;
  duration?: number;
  quiz?: string;
}

interface LessonSidebarProps {
  lessons: Lesson[];
  courseId: string;
  currentLessonId?: string;
  completedLessons?: string[];
}

export default function LessonSidebar({
  lessons,
  courseId,
  currentLessonId,
  completedLessons = [],
}: LessonSidebarProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'video': return FiVideo;
      case 'pdf': return FiFileText;
      default: return FiFileText;
    }
  };

  return (
    <div className="glass-card p-4 h-full overflow-y-auto">
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
        Lessons ({lessons.length})
      </h3>
      <nav className="space-y-1">
        {lessons.map((lesson) => {
          const isActive = lesson._id === currentLessonId;
          const isCompleted = completedLessons.includes(lesson._id);
          const Icon = getIcon(lesson.type);

          return (
            <Link
              key={lesson._id}
              href={`/student/learn/${courseId}/${lesson._id}`}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-primary-500/15 text-primary-400 border border-primary-500/30'
                  : isCompleted
                  ? 'text-accent-400 hover:bg-muted/50'
                  : 'text-muted-foreground hover:bg-muted/50 hover:text-white'
              }`}
            >
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <FiCheckCircle className="w-5 h-5 text-accent-400" />
                ) : isActive ? (
                  <FiPlay className="w-5 h-5 text-primary-400" />
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="truncate font-medium">{lesson.title}</p>
                {lesson.duration && (
                  <p className="text-xs text-muted-foreground/80">{lesson.duration} min</p>
                )}
              </div>
              {lesson.quiz && (
                <span className="text-xs bg-primary-500/20 text-primary-300 px-2 py-0.5 rounded">Quiz</span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
