// PUT /api/lessons/[id] — Update lesson (instructor)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lesson from '@/models/Lesson';
import Course from '@/models/Course';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'instructor') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const course = await Course.findById(lesson.courseId);
    if (!course || course.instructor.toString() !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await Lesson.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Lesson updated',
    });
  } catch (error) {
    console.error('PUT lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
