// GET /api/courses/[id] — Get single course + lessons
// PUT /api/courses/[id] — Update course (instructor)
// DELETE /api/courses/[id] — Delete course (instructor)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import Lesson from '@/models/Lesson';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const course = await Course.findById(id)
      .populate('instructor', 'name avatar email')
      .populate('lessons');

    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Also get lessons sorted by order
    const lessons = await Lesson.find({ courseId: id }).sort({ order: 1 });

    return NextResponse.json({
      success: true,
      data: { ...course.toObject(), lessons },
    });
  } catch (error) {
    console.error('GET course error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

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

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Only the course owner can update
    if (course.instructor.toString() !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own courses' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const updated = await Course.findByIdAndUpdate(id, body, { new: true });

    return NextResponse.json({
      success: true,
      data: updated,
      message: 'Course updated',
    });
  } catch (error) {
    console.error('PUT course error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || (payload.role !== 'instructor' && payload.role !== 'admin')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await dbConnect();
    const { id } = await params;

    const course = await Course.findById(id);
    if (!course) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      );
    }

    // Only course owner or admin can delete
    if (payload.role === 'instructor' && course.instructor.toString() !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own courses' },
        { status: 403 }
      );
    }

    await Course.findByIdAndDelete(id);
    // Also delete associated lessons
    await Lesson.deleteMany({ courseId: id });

    return NextResponse.json({
      success: true,
      message: 'Course deleted',
    });
  } catch (error) {
    console.error('DELETE course error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
