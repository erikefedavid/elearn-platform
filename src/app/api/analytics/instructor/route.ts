// GET /api/analytics/instructor — Instructor analytics data
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import QuizAttempt from '@/models/QuizAttempt';
import UserProgress from '@/models/UserProgress';
import { verifyAuthFromRequest } from '@/lib/auth';
import { calcEngagementRate, calcCompletionRate, calcAvgQuizScore } from '@/lib/analytics';

export async function GET(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'instructor') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();

    // Get all courses by this instructor
    const courses = await Course.find({ instructor: payload.userId });
    const courseIds = courses.map((c) => c._id);

    // Total students across all courses
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });
    const uniqueStudentIds = Array.from(new Set(enrollments.map((e) => e.student.toString())));
    const totalStudents = uniqueStudentIds.length;

    // Completed students
    const completedEnrollments = enrollments.filter((e) => e.completed);

    // Active students (accessed in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeProgress = await UserProgress.find({
      course: { $in: courseIds },
      lastActiveDate: { $gte: sevenDaysAgo },
    });
    const activeStudentIds = Array.from(new Set(activeProgress.map((p) => p.student.toString())));

    // Calculate rates
    const engagementRate = calcEngagementRate(activeStudentIds.length, totalStudents);
    const completionRate = calcCompletionRate(completedEnrollments.length, enrollments.length);

    // Average quiz score
    const quizAttempts = await QuizAttempt.find({ course: { $in: courseIds } });
    const avgQuizScore = calcAvgQuizScore(quizAttempts.map((a) => a.score));

    // At-risk students
    const atRiskAttempts = await QuizAttempt.find({
      course: { $in: courseIds },
      isAtRisk: true,
    }).populate('student', 'name email');

    const atRiskStudents = atRiskAttempts.map((a) => {
      const student = a.student as unknown as { name: string; email: string };
      const course = courses.find((c) => c._id.toString() === a.course.toString());
      return {
        name: student?.name || 'Unknown',
        email: student?.email || '',
        course: course?.title || 'Unknown',
        score: a.score,
      };
    });

    // Per-course metrics
    const courseMetrics = await Promise.all(
      courses.map(async (course) => {
        const courseEnrollments = enrollments.filter(
          (e) => e.course.toString() === course._id.toString()
        );
        const courseCompleted = courseEnrollments.filter((e) => e.completed);
        const courseAttempts = quizAttempts.filter(
          (a) => a.course.toString() === course._id.toString()
        );
        return {
          courseTitle: course.title,
          enrolled: courseEnrollments.length,
          completed: courseCompleted.length,
          avgScore: calcAvgQuizScore(courseAttempts.map((a) => a.score)),
        };
      })
    );

    // Inactive students (7+ days)
    const inactiveProgress = await UserProgress.find({
      course: { $in: courseIds },
      lastActiveDate: { $lt: sevenDaysAgo },
    }).populate('student', 'name email');

    const inactiveStudents = inactiveProgress.map((p) => {
      const student = p.student as unknown as { name: string; email: string };
      return {
        name: student?.name || 'Unknown',
        email: student?.email || '',
        lastActive: p.lastActiveDate,
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        totalCourses: courses.length,
        totalStudents,
        engagementRate,
        completionRate,
        avgQuizScore,
        atRiskStudents,
        courseMetrics,
        inactiveStudents,
      },
    });
  } catch (error) {
    console.error('Instructor analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
