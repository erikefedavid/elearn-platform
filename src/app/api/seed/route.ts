export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';

import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';

import User from '@/models/User';
import Course from '@/models/Course';
import Lesson from '@/models/Lesson';
import Quiz from '@/models/Quiz';
import Enrollment from '@/models/Enrollment';
import UserProgress from '@/models/UserProgress';

export async function GET() {
  try {
    await dbConnect();

    // 1. Wipe database
    console.log('Wiping database...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Enrollment.deleteMany({});
    await UserProgress.deleteMany({});
    
    // 2. Create Users
    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    await User.create({
      name: 'Admin User', email: 'admin@eduadapt.com', password, role: 'admin'
    });

    const instructor = await User.create({
      name: 'Dr. Jane Smith', email: 'instructor@eduadapt.com', password, role: 'instructor'
    });

    const student = await User.create({
      name: 'John Doe', email: 'student@eduadapt.com', password, role: 'student', 
      skillLevel: 'intermediate', interests: ['Web Development', 'Design']
    });

    // 3. Create Courses
    console.log('Creating courses...');
    const coursesData = [
      {
        title: 'Fullstack Next.js Mastery',
        description: 'Learn to build complete production applications from scratch using Next.js 14, React, and MongoDB.',
        instructor: instructor._id,
        category: 'Web Development',
        skillLevel: 'intermediate',
        price: 49.99,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        status: 'published',
        enrolledCount: 154,
        requirements: ['Basic HTML/CSS', 'Javascript Fundamentals'],
        tags: ['React', 'Next.js', 'Web']
      },
      {
        title: 'UI/UX ProMax Design',
        description: 'Design beautiful, responsive, and highly animated interfaces that wow users.',
        instructor: instructor._id,
        category: 'Design',
        skillLevel: 'beginner',
        price: 29.99,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
        status: 'published',
        enrolledCount: 320,
        requirements: ['No prior experience needed'],
        tags: ['Figma', 'UI', 'UX']
      },
      {
        title: 'Python for Data Science',
        description: 'Master Python fundamentals and dive deep into pandas, numpy, and machine learning.',
        instructor: instructor._id,
        category: 'Data Science',
        skillLevel: 'advanced',
        price: 59.99,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
        status: 'published',
        enrolledCount: 89,
        requirements: ['Basic Python'],
        tags: ['Python', 'Data', 'AI']
      }
    ];

    const createdCourses = await Course.insertMany(coursesData);

    // 4. Create Lessons & Quizzes
    console.log('Creating lessons and quizzes...');
    const nextjsCourse = createdCourses[0];
    
    const lessons = await Lesson.insertMany([
      { courseId: nextjsCourse._id, title: 'Introduction to Next.js', type: 'video', contentUrl: 'https://www.youtube.com/watch?v=wm5gMKuwSYk', order: 1, duration: 15 },
      { courseId: nextjsCourse._id, title: 'Routing and Pages', type: 'video', contentUrl: 'https://www.youtube.com/watch?v=Zv1v1y-yvL8', order: 2, duration: 25 },
      { courseId: nextjsCourse._id, title: 'Server vs Client Components', type: 'video', contentUrl: 'https://www.youtube.com/watch?v=p1kR-rXy1pE', order: 3, duration: 20 },
      { courseId: nextjsCourse._id, title: 'Next.js Cheatsheet', type: 'pdf', contentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', order: 4, duration: 10 },
    ]);

    const quiz = await Quiz.create({
      lessonId: lessons[0]._id,
      questions: [
        { question: 'What is Next.js?', options: ['A React Framework', 'A Database', 'A CSS Library', 'An OS'], correct: 0 },
        { question: 'Which folder contains pages by default in App Router?', options: ['pages', 'app', 'src', 'public'], correct: 1 }
      ]
    });

    await Lesson.findByIdAndUpdate(lessons[0]._id, { quiz: quiz._id });

    // 5. Create Enrollments and Progress for Student
    console.log('Creating enrollments...');
    await Enrollment.create({ student: student._id, course: nextjsCourse._id });
    await Enrollment.create({ student: student._id, course: createdCourses[1]._id });

    await UserProgress.create({
      student: student._id,
      course: nextjsCourse._id,
      completedLessons: [lessons[0]._id],
      streak: 5,
      completionPercent: 33
    });

    await UserProgress.create({
      student: student._id,
      course: createdCourses[1]._id,
      completedLessons: [],
      streak: 5,
      completionPercent: 0
    });

    console.log('Seed complete!');
    return NextResponse.json({ success: true, message: 'Database seeded successfully' });

  } catch (error: unknown) {
    console.error('Seed error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ success: false, error: errorMessage }, { status: 500 });
  }
}
