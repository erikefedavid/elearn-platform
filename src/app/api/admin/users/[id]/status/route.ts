import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = verifyAuthFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();
    const { status } = body;

    if (!['active', 'restricted'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Invalid status' }, { status: 400 });
    }

    // Don't let an admin restrict themselves
    if (params.id === user.userId) {
      return NextResponse.json({ success: false, error: 'Cannot restrict yourself' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: { status: updatedUser.status } });
  } catch (error) {
    console.error('Update user status error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
