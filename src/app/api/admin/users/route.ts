import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized — admin only' },
        { status: 403 }
      );
    }

    await dbConnect();
    
    // Get all users, excluding passwords
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('GET admin users error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
