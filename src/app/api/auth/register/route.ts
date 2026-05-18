// POST /api/auth/register — Create new user
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { setAuthCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await dbConnect();

    const body = await request.json();
    const { name, email, password, role, interests, skillLevel } = body;

    // Validate required fields
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name must be at least 2 characters long' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Validate role — admin cannot self-register
    if (!['student', 'instructor'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Invalid role. Must be student or instructor.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      if (existingUser.status === 'restricted') {
        return NextResponse.json(
          { success: false, error: 'This email is associated with a restricted account.' },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password with bcrypt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
      interests: interests || [],
      skillLevel: skillLevel || 'beginner',
    });

    // Set JWT cookie
    await setAuthCookie({
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        message: 'Registration successful',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
