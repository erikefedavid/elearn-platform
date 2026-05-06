const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Load MONGODB_URI from .env.local
const envContent = fs.readFileSync('.env.local', 'utf-8');
const mongoUriLine = envContent.split('\n').find(line => line.startsWith('MONGODB_URI='));
const MONGODB_URI = mongoUriLine.substring(12).trim();

// Very simple schemas just for seeding
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
  avatar: { type: String, default: '' },
  interests: [{ type: String }],
  skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
}, { timestamps: true });

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  thumbnail: { type: String },
  category: { type: String, required: true },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
  price: { type: Number, required: true },
  tags: [{ type: String }],
  requirements: [{ type: String }],
  status: { type: String, enum: ['draft', 'published'], default: 'draft' },
  enrolledCount: { type: Number, default: 0 },
}, { timestamps: true });

const lessonSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf', 'text'], required: true },
  contentUrl: { type: String, required: true },
  order: { type: Number, required: true },
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' },
  duration: { type: Number },
});

const quizSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct: { type: Number, required: true }
  }],
});

const enrollmentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
});

const progressSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
  streak: { type: Number, default: 0 },
  completionPercent: { type: Number, default: 0 },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Course = mongoose.models.Course || mongoose.model('Course', courseSchema);
const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema);
const Quiz = mongoose.models.Quiz || mongoose.model('Quiz', quizSchema);
const Enrollment = mongoose.models.Enrollment || mongoose.model('Enrollment', enrollmentSchema);
const UserProgress = mongoose.models.UserProgress || mongoose.model('UserProgress', progressSchema);

async function seed() {
  try {
    console.log('Connecting to DB...');
    await mongoose.connect(MONGODB_URI);

    console.log('Wiping database...');
    await User.deleteMany({});
    await Course.deleteMany({});
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Enrollment.deleteMany({});
    await UserProgress.deleteMany({});
    
    console.log('Creating users...');
    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash('password123', salt);

    const admin = await User.create({ name: 'Admin User', email: 'admin@eduadapt.com', password, role: 'admin' });
    const instructor = await User.create({ name: 'Dr. Jane Smith', email: 'instructor@eduadapt.com', password, role: 'instructor' });
    const student = await User.create({ name: 'John Doe', email: 'student@eduadapt.com', password, role: 'student', skillLevel: 'intermediate', interests: ['Web Development', 'Design'] });

    console.log('Creating courses...');
    const coursesData = [
      {
        title: 'Fullstack Next.js Mastery',
        description: 'Learn to build complete production applications from scratch using Next.js 14, React, and MongoDB.',
        instructor: instructor._id, category: 'Web Development', level: 'intermediate', price: 49.99,
        thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800',
        status: 'published', enrolledCount: 154, requirements: ['Basic HTML/CSS', 'Javascript Fundamentals'], tags: ['React', 'Next.js', 'Web']
      },
      {
        title: 'UI/UX ProMax Design',
        description: 'Design beautiful, responsive, and highly animated interfaces that wow users.',
        instructor: instructor._id, category: 'Design', level: 'beginner', price: 29.99,
        thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=800',
        status: 'published', enrolledCount: 320, requirements: ['No prior experience needed'], tags: ['Figma', 'UI', 'UX']
      },
      {
        title: 'Python for Data Science',
        description: 'Master Python fundamentals and dive deep into pandas, numpy, and machine learning.',
        instructor: instructor._id, category: 'Data Science', level: 'advanced', price: 59.99,
        thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
        status: 'published', enrolledCount: 89, requirements: ['Basic Python'], tags: ['Python', 'Data', 'AI']
      }
    ];

    const createdCourses = await Course.insertMany(coursesData);

    console.log('Creating lessons and quizzes...');
    const nextjsCourse = createdCourses[0];
    
    const lessons = await Lesson.insertMany([
      { courseId: nextjsCourse._id, title: 'Introduction to Next.js', type: 'video', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', order: 1, duration: 15 },
      { courseId: nextjsCourse._id, title: 'Routing and Pages', type: 'video', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', order: 2, duration: 25 },
      { courseId: nextjsCourse._id, title: 'Server vs Client Components', type: 'video', contentUrl: 'https://www.w3schools.com/html/mov_bbb.mp4', order: 3, duration: 20 },
    ]);

    const quiz = await Quiz.create({
      lessonId: lessons[0]._id,
      questions: [
        { question: 'What is Next.js?', options: ['A React Framework', 'A Database', 'A CSS Library', 'An OS'], correct: 0 },
        { question: 'Which folder contains pages by default in App Router?', options: ['pages', 'app', 'src', 'public'], correct: 1 }
      ]
    });

    await Lesson.findByIdAndUpdate(lessons[0]._id, { quiz: quiz._id });

    console.log('Creating enrollments...');
    await Enrollment.create({ student: student._id, course: nextjsCourse._id });
    await Enrollment.create({ student: student._id, course: createdCourses[1]._id });

    await UserProgress.create({
      student: student._id, course: nextjsCourse._id, completedLessons: [lessons[0]._id],
      streak: 5, completionPercent: 33
    });

    await UserProgress.create({
      student: student._id, course: createdCourses[1]._id, completedLessons: [],
      streak: 5, completionPercent: 0
    });

    console.log('Seed complete! You can now log in using student@eduadapt.com / password123');
    process.exit(0);

  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
