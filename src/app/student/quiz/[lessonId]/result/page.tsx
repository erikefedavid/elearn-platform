'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import QuizResultComponent from '@/components/quiz/QuizResult';

export default function QuizResultPage() {
  const params = useParams();
  const lessonId = params.lessonId as string;
  const [result, setResult] = useState<{
    score: number; correctCount: number; totalQuestions: number;
    adaptive: { status: string; message: string; nextAction: string };
  } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('quizResult');
    if (stored) {
      setResult(JSON.parse(stored));
      sessionStorage.removeItem('quizResult');
    }
  }, []);

  if (!result) return <div className="text-center py-20"><p className="text-muted-foreground">No quiz result found. Please take a quiz first.</p></div>;

  return (
    <div className="py-8 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground">Quiz Results</h1>
      </div>
      <QuizResultComponent
        score={result.score}
        correctCount={result.correctCount}
        totalQuestions={result.totalQuestions}
        adaptive={result.adaptive as { status: 'at-risk' | 'needs-review' | 'reinforce' | 'advance'; message: string; nextAction: 'retry' | 'review-material' | 'next-lesson' }}
        courseId=""
        lessonId={lessonId}
      />
    </div>
  );
}
