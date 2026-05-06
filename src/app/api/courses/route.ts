// GET /api/courses — Get all published courses (public)
// POST /api/courses — Create new course (instructor only)
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Course from '@/models/Course';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const skillLevel = searchParams.get('skillLevel');
    const search = searchParams.get('search');
    const instructorMode = searchParams.get('instructor');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const filter: any = {};

    if (instructorMode === 'true') {
      const payload = verifyAuthFromRequest(request);
      if (!payload || payload.role !== 'instructor') {
        return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
      }
      filter.instructor = payload.userId;
      // No status filter because instructors should see their drafts
    } else {
      filter.status = 'published';
    }

    if (category) filter.category = category;
    if (skillLevel) filter.skillLevel = skillLevel;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const courses = await Course.find(filter)
      .populate('instructor', 'name avatar')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Course.countDocuments(filter);

    return NextResponse.json({
      success: true,
      data: {
        courses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('GET courses error:', error);
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
    const { title, description, category, skillLevel, thumbnail } = body;

    if (!title || !description || !category || !skillLevel) {
      return NextResponse.json(
        { success: false, error: 'Title, description, category, and skill level are required' },
        { status: 400 }
      );
    }

    const course = await Course.create({
      title,
      description,
      category,
      skillLevel,
      thumbnail: thumbnail || '',
      instructor: payload.userId,
      status: 'draft',
    });

    return NextResponse.json(
      { success: true, data: course, message: 'Course created' },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST course error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
