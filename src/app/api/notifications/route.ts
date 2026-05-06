// GET /api/notifications — Get user notifications
// PUT /api/notifications — Mark notifications as read
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';
import { verifyAuthFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const notifications = await Notification.find({ user: payload.userId })
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: payload.userId,
      read: false,
    });

    return NextResponse.json({
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    });
  } catch (error) {
    console.error('GET notifications error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const payload = verifyAuthFromRequest(request);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { notificationIds } = body;

    if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      await Notification.updateMany(
        { _id: { $in: notificationIds }, user: payload.userId },
        { read: true }
      );
    } else {
      // Mark all as read
      await Notification.updateMany(
        { user: payload.userId, read: false },
        { read: true }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Notifications marked as read',
    });
  } catch (error) {
    console.error('PUT notifications error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
