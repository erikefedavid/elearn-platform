'use client';

import Link from 'next/link';
import { FiCheckCircle, FiAlertTriangle, FiRefreshCw, FiArrowRight, FiBookOpen } from 'react-icons/fi';
import type { AdaptiveResult } from '@/types';

interface QuizResultProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  adaptive: AdaptiveResult;
  courseId: string;
  lessonId: string;
}

export default function QuizResult({
  score,
  correctCount,
  totalQuestions,
  adaptive,
  courseId,
  lessonId,
}: QuizResultProps) {
  const getStatusConfig = () => {
    switch (adaptive.status) {
      case 'advance':
        return {
          icon: FiCheckCircle,
          color: 'text-accent-400',
          bg: 'from-accent-500/20 to-accent-600/10',
          border: 'border-accent-500/30',
          ringColor: 'text-accent-500',
        };
      case 'reinforce':
        return {
          icon: FiBookOpen,
          color: 'text-info',
          bg: 'from-info/20 to-info/10',
          border: 'border-info/30',
          ringColor: 'text-info',
        };
      case 'needs-review':
        return {
          icon: FiRefreshCw,
          color: 'text-warning',
          bg: 'from-warning/20 to-warning/10',
          border: 'border-warning/30',
          ringColor: 'text-warning',
        };
      case 'at-risk':
        return {
          icon: FiAlertTriangle,
          color: 'text-danger',
          bg: 'from-danger/20 to-danger/10',
          border: 'border-danger/30',
          ringColor: 'text-danger',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Score Circle */}
      <div className={`glass-card p-8 bg-gradient-to-br ${config.bg} border ${config.border} text-center`}>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" fill="none" stroke="#334155" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="50" fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 314} 314`}
              className={config.ringColor}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${config.color}`}>{score}%</span>
          </div>
        </div>
        <p className="text-foreground font-semibold text-lg">{correctCount} / {totalQuestions} correct</p>
      </div>

      {/* Adaptive Message */}
      <div className={`glass-card p-6 border ${config.border}`}>
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${config.bg}`}>
            <Icon className={`w-6 h-6 ${config.color}`} />
          </div>
          <div>
            <h3 className={`font-semibold ${config.color} mb-1`}>
              {adaptive.status === 'advance' ? 'Excellent Work!' :
               adaptive.status === 'reinforce' ? 'Good Progress' :
               adaptive.status === 'needs-review' ? 'Keep Trying' : 'Needs Attention'}
            </h3>
            <p className="text-muted-foreground text-sm">{adaptive.message}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        {adaptive.nextAction === 'retry' && (
          <Link
            href={`/student/quiz/${lessonId}`}
            className="btn-primary flex items-center gap-2 flex-1 justify-center"
          >
            <FiRefreshCw className="w-4 h-4" /> Retry Quiz
          </Link>
        )}
        {adaptive.nextAction === 'review-material' && (
          <Link
            href={`/student/learn/${courseId}/${lessonId}`}
            className="btn-secondary flex items-center gap-2 flex-1 justify-center"
          >
            <FiBookOpen className="w-4 h-4" /> Review Material
          </Link>
        )}
        {adaptive.nextAction === 'next-lesson' && (
          <Link
            href={`/student/my-courses`}
            className="btn-accent flex items-center gap-2 flex-1 justify-center"
          >
            <FiArrowRight className="w-4 h-4" /> Continue Learning
          </Link>
        )}
        <Link
          href="/student/dashboard"
          className="btn-secondary flex items-center justify-center"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
