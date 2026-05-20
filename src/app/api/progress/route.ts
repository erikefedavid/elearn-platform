// GET /api/progress — Get student's progress data
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import UserProgress from '@/models/UserProgress';
import Enrollment from '@/models/Enrollment';
import Lesson from '@/models/Lesson';
import Notification from '@/models/Notification';
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

export async function POST(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'student') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { courseId, lessonId } = body;

    if (!courseId || !lessonId) {
      return NextResponse.json(
        { success: false, error: 'courseId and lessonId are required' },
        { status: 400 }
      );
    }

    // Get total lessons for progress percentage calculation
    const totalLessons = await Lesson.countDocuments({ courseId });

    // Find and update progress
    const progress = await UserProgress.findOneAndUpdate(
      { student: payload.userId, course: courseId },
      { 
        $addToSet: { completedLessons: lessonId },
        $set: { lastActiveDate: new Date() }
      },
      { new: true, upsert: true }
    );

    // Recalculate completion percentage
    const completionPercent = Math.round(
      (progress.completedLessons.length / totalLessons) * 100
    );
    progress.completionPercent = completionPercent;
    await progress.save();

    // Check if course is fully completed
    if (completionPercent >= 100) {
      await Enrollment.findOneAndUpdate(
        { student: payload.userId, course: courseId },
        { completed: true, completedAt: new Date() }
      );

      const lesson = await Lesson.findById(lessonId);

      await Notification.create({
        user: payload.userId,
        message: `Congratulations! You've completed the course "${lesson?.title || 'course'}". 🎉`,
        type: 'course',
      });
    }

    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    console.error('POST progress error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
