// POST /api/enroll — Enroll student in a course
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Enrollment from '@/models/Enrollment';
import Course from '@/models/Course';
import UserProgress from '@/models/UserProgress';
import Notification from '@/models/Notification';
import { verifyAuthFromRequest } from '@/lib/auth';

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
    const { courseId } = body;

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'courseId is required' },
        { status: 400 }
      );
    }

    // Check course exists and is published
    const course = await Course.findById(courseId);
    if (!course || course.status !== 'published') {
      return NextResponse.json(
        { success: false, error: 'Course not found or not available' },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existing = await Enrollment.findOne({
      student: payload.userId,
      course: courseId,
    });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Already enrolled in this course' },
        { status: 409 }
      );
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: payload.userId,
      course: courseId,
    });

    // Create initial progress record
    await UserProgress.create({
      student: payload.userId,
      course: courseId,
      completedLessons: [],
      lastActiveDate: new Date(),
      streak: 1,
      completionPercent: 0,
    });

    // Increment enrolled count
    await Course.findByIdAndUpdate(courseId, { $inc: { enrolledCount: 1 } });

    // Create notification
    await Notification.create({
      user: payload.userId,
      message: `You have enrolled in "${course.title}". Start learning now!`,
      type: 'course',
    });

    return NextResponse.json(
      { success: true, data: enrollment, message: 'Enrolled successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enroll error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
