// GET /api/progress — Get student's progress data
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserProgress from '@/models/UserProgress';
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

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (courseId) {
      // Get progress for specific course
      const progress = await UserProgress.findOne({
        student: payload.userId,
        course: courseId,
      }).populate('completedLessons');

      return NextResponse.json({
        success: true,
        data: progress,
      });
    }

    // Get all progress
    const allProgress = await UserProgress.find({ student: payload.userId })
      .populate('course', 'title thumbnail category')
      .sort({ lastActiveDate: -1 });

    const enrollments = await Enrollment.find({ student: payload.userId })
      .populate('course', 'title thumbnail category skillLevel');

    return NextResponse.json({
      success: true,
      data: {
        progress: allProgress,
        enrollments,
      },
    });
  } catch (error) {
    console.error('GET progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
