// GET /api/analytics/admin — Platform-wide analytics
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Course from '@/models/Course';
import Enrollment from '@/models/Enrollment';
import UserProgress from '@/models/UserProgress';
import { verifyAuthFromRequest } from '@/lib/auth';
import { calcRetentionRate } from '@/lib/analytics';

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

    // User counts
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstructors = await User.countDocuments({ role: 'instructor' });

    // Course counts
    const totalCourses = await Course.countDocuments();
    const publishedCourses = await Course.countDocuments({ status: 'published' });

    // Retention rate: users active in last 7 days / total users
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const activeProgressCount = await UserProgress.distinct('student', {
      lastActiveDate: { $gte: sevenDaysAgo },
    });
    const retentionRate = calcRetentionRate(activeProgressCount.length, totalStudents);

    // Popular courses (by enrollment count)
    const popularCourses = await Course.find({ status: 'published' })
      .sort({ enrolledCount: -1 })
      .limit(10)
      .select('title enrolledCount');

    // User growth (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const recentUsers = await User.find({
      createdAt: { $gte: thirtyDaysAgo },
    }).select('createdAt');

    // Group by day
    const growthMap: Record<string, number> = {};
    for (let i = 0; i < 30; i++) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      growthMap[date.toISOString().split('T')[0]] = 0;
    }
    recentUsers.forEach((u) => {
      const day = u.createdAt.toISOString().split('T')[0];
      if (growthMap[day] !== undefined) growthMap[day]++;
    });
    const userGrowth = Object.entries(growthMap)
      .map(([date, count]) => ({ date, count }))
      .reverse();

    // Total enrollments
    const totalEnrollments = await Enrollment.countDocuments();
    const completedEnrollments = await Enrollment.countDocuments({ completed: true });

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalInstructors,
        totalCourses,
        publishedCourses,
        retentionRate,
        totalEnrollments,
        completedEnrollments,
        popularCourses: popularCourses.map((c) => ({
          title: c.title,
          enrolled: c.enrolledCount,
        })),
        userGrowth,
      },
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
