// GET /api/auth/me — Return current user from token
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await dbConnect();

    const user = await User.findById(payload.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Auth/me error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
