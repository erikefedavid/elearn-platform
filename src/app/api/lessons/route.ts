// POST /api/lessons — Create lesson for a course (instructor)
// GET /api/lessons — Get lessons for a course
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lesson from '@/models/Lesson';
import Course from '@/models/Course';
import Quiz from '@/models/Quiz';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const courseId = searchParams.get('courseId');

    if (!courseId) {
      return NextResponse.json(
        { success: false, error: 'courseId is required' },
        { status: 400 }
      );
    }

    const lessons = await Lesson.find({ courseId }).sort({ order: 1 }).populate('quiz');

    return NextResponse.json({
      success: true,
      data: lessons,
    });
  } catch (error) {
    console.error('GET lessons error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'instructor') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — instructor only' },
        { status: 403 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { courseId, title, type, contentUrl, order, duration, quizQuestions } = body;

    if (!courseId || !title || !type || !contentUrl) {
      return NextResponse.json(
        { success: false, error: 'courseId, title, type, and contentUrl are required' },
        { status: 400 }
      );
    }

    // Verify course belongs to this instructor
    const course = await Course.findById(courseId);
    if (!course || course.instructor.toString() !== payload.userId) {
      return NextResponse.json(
        { success: false, error: 'Course not found or unauthorized' },
        { status: 403 }
      );
    }

    // Auto-calculate order if not provided
    const lessonOrder = order || (await Lesson.countDocuments({ courseId })) + 1;

    // Create lesson
    const lesson = await Lesson.create({
      courseId,
      title,
      type,
      contentUrl,
      order: lessonOrder,
      duration: duration || 0,
    });

    // Create quiz if quiz questions provided
    if (quizQuestions && quizQuestions.length > 0) {
      const quiz = await Quiz.create({
        lessonId: lesson._id,
        questions: quizQuestions,
      });
      lesson.quiz = quiz._id;
      await lesson.save();
    }

    // Add lesson to course
    await Course.findByIdAndUpdate(courseId, {
      $push: { lessons: lesson._id },
    });

    return NextResponse.json(
      { success: true, data: lesson, message: 'Lesson created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST lesson error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
