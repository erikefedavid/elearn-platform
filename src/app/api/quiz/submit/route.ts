// POST /api/quiz/submit — Submit quiz answers + run adaptive logic
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Quiz from '@/models/Quiz';
import QuizAttempt from '@/models/QuizAttempt';
import Lesson from '@/models/Lesson';
import UserProgress from '@/models/UserProgress';
import Notification from '@/models/Notification';
import { verifyAuthFromRequest } from '@/lib/auth';
import { runAdaptiveEngine } from '@/lib/adaptive';

export async function POST(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — students only' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { quizId, lessonId, courseId, answers } = body;

    if (!quizId || !lessonId || !courseId || !answers) {
      return NextResponse.json(
        { success: false, error: 'quizId, lessonId, courseId, and answers are required' },
        { status: 400 }
      );
    }

    // Get quiz with correct answers
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return NextResponse.json(
        { success: false, error: 'Quiz not found' },
        { status: 404 }
      );
    }

    // Calculate score
    let correctCount = 0;
    quiz.questions.forEach((q: { question: string; options: string[]; correct: number }, i: number) => {
      if (answers[i] === q.correct) {
        correctCount++;
      }
    });
    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Get attempt number
    const previousAttempts = await QuizAttempt.countDocuments({
      student: payload.userId,
      quiz: quizId,
    });
    const attemptNo = previousAttempts + 1;

    // Run adaptive engine
    const adaptiveResult = runAdaptiveEngine(score, attemptNo);

    // Save quiz attempt
    const quizAttempt = await QuizAttempt.create({
      student: payload.userId,
      quiz: quizId,
      lesson: lessonId,
      course: courseId,
      score,
      answers,
      attemptNo,
      isAtRisk: adaptiveResult.status === 'at-risk',
    });

    // Update progress
    const lesson = await Lesson.findById(lessonId);
    const totalLessons = await Lesson.countDocuments({ courseId });

    const updateQuery: any = {
      $set: { lastActiveDate: new Date() }
    };

    if (score >= 50) {
      updateQuery.$addToSet = { completedLessons: lessonId };
      updateQuery.$pull = { remedialLessons: lessonId };
    } else {
      updateQuery.$addToSet = { remedialLessons: lessonId };
    }

    const progress = await UserProgress.findOneAndUpdate(
      { student: payload.userId, course: courseId },
      updateQuery,
      { new: true, upsert: true }
    );

    if (score >= 50) {
      // Recalculate completion percent
      const completionPercent = Math.round(
        (progress.completedLessons.length / totalLessons) * 100
      );
      progress.completionPercent = completionPercent;
      await progress.save();

      // Check if course completed
      if (completionPercent >= 100) {
        const { default: Enrollment } = await import('@/models/Enrollment');
        await Enrollment.findOneAndUpdate(
          { student: payload.userId, course: courseId },
          { completed: true, completedAt: new Date() }
        );

        await Notification.create({
          user: payload.userId,
          message: `Congratulations! You've completed the course "${lesson?.title || 'course'}". 🎉`,
          type: 'course',
        });
      }
    }

    // Create notification for at-risk students
    if (adaptiveResult.status === 'at-risk') {
      // Notify the instructor
      const { default: Course } = await import('@/models/Course');
      const course = await Course.findById(courseId);
      if (course) {
        await Notification.create({
          user: course.instructor,
          message: `Student ${payload.name} is at-risk in lesson "${(await Lesson.findById(lessonId))?.title || 'Unknown'}". They've failed the quiz ${attemptNo} times.`,
          type: 'system',
        });
      }
    }

    // Create quiz result notification
    await Notification.create({
      user: payload.userId,
      message: `Quiz result: ${score}% — ${adaptiveResult.message}`,
      type: 'quiz',
    });

    return NextResponse.json({
      success: true,
      data: {
        attempt: quizAttempt,
        score,
        correctCount,
        totalQuestions: quiz.questions.length,
        adaptive: adaptiveResult,
      },
    });
  } catch (error) {
    console.error('Quiz submit error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
