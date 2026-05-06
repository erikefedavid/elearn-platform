// GET /api/quiz — Get quiz for a lesson
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Quiz from '@/models/Quiz';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { success: false, error: 'lessonId is required' },
        { status: 400 }
      );
    }

    const quiz = await Quiz.findOne({ lessonId });
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'No quiz found for this lesson' },
        { status: 404 }
      );
    }

    // Return quiz without correct answers for students
    const safeQuiz = {
      _id: quiz._id,
      lessonId: quiz.lessonId,
      questions: quiz.questions.map((q: { question: string; options: string[]; correct: number }) => ({
        question: q.question,
        options: q.options,
        // Don't send correct answer to client if student role
        ...(payload.role !== 'student' ? { correct: q.correct } : {}),
      })),
    };

    return NextResponse.json({
      success: true,
      data: safeQuiz,
    });
  } catch (error) {
    console.error('GET quiz error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
