// GET /api/analytics/student — Student analytics dashboard data
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserProgress from '@/models/UserProgress';
import QuizAttempt from '@/models/QuizAttempt';
import Enrollment from '@/models/Enrollment';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get enrollments
    const enrollments = await Enrollment.find({ student: payload.userId })
      .populate('course', 'title thumbnail category');
    const totalCourses = enrollments.length;
    const completedCourses = enrollments.filter((e) => e.completed).length;

    // Get progress data
    const progressData = await UserProgress.find({ student: payload.userId })
      .populate('course', 'title thumbnail');

    // Get quiz history
    const quizAttempts = await QuizAttempt.find({ student: payload.userId })
      .populate('lesson', 'title')
      .sort({ createdAt: -1 })
      .limit(20);

    const avgScore = quizAttempts.length > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / quizAttempts.length)
      : 0;

    // Calculate streak (max from all courses)
    const streak = progressData.reduce((max, p) => Math.max(max, p.streak || 0), 0);

    const quizHistory = quizAttempts.map((a) => ({
      date: a.createdAt.toISOString().split('T')[0],
      score: a.score,
      lessonTitle: (a.lesson as unknown as { title: string })?.title || 'Unknown',
    }));

    const courseProgress = progressData.map((p) => ({
      courseTitle: (p.course as unknown as { title: string })?.title || 'Unknown',
      progress: p.completionPercent,
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalCourses,
        completedCourses,
        averageScore: avgScore,
        streak,
        quizHistory,
        courseProgress,
      },
    });
  } catch (error) {
    console.error('Student analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
