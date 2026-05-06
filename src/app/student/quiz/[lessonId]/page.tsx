'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import QuizBlock from '@/components/quiz/QuizBlock';

interface Question { question: string; options: string[]; }

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const lessonId = params.lessonId as string;
  const [quiz, setQuiz] = useState<{ _id: string; questions: Question[]; lessonId: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/quiz?lessonId=${lessonId}`);
        const data = await res.json();
        if (data.success) setQuiz(data.data);
      } catch { /* ignore */ }
      setLoading(false);
    }
    load();
  }, [lessonId]);

  async function handleSubmit(answers: number[]) {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: quiz._id, lessonId, courseId: '', answers }),
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('quizResult', JSON.stringify(data.data));
        router.push(`/student/quiz/${lessonId}/result`);
      }
    } catch { /* ignore */ }
    setSubmitting(false);
  }

  if (loading) return <div className="max-w-2xl mx-auto"><div className="h-64 shimmer rounded-2xl" /></div>;

  if (!quiz) return <div className="text-center py-20"><p className="text-muted-foreground">No quiz found for this lesson.</p></div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quiz</h1>
        <p className="text-muted-foreground mt-1">Answer all questions and submit when ready</p>
      </div>
      <QuizBlock questions={quiz.questions} onSubmit={handleSubmit} loading={submitting} />
    </div>
  );
}
