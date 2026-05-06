// ==========================================
// EduAdapt — Shared TypeScript Types
// ==========================================

import { Types } from 'mongoose';

// ---------- User ----------
export type UserRole = 'student' | 'instructor' | 'admin';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  interests: string[];
  skillLevel: SkillLevel;
  createdAt: Date;
  updatedAt: Date;
}

// ---------- Course ----------
export type CourseStatus = 'draft' | 'published';

export interface ICourse {
  _id: Types.ObjectId;
  title: string;
  description: string;
  category: string;
  skillLevel: SkillLevel;
  thumbnail: string;
  instructor: Types.ObjectId | IUser;
  lessons: Types.ObjectId[];
  status: CourseStatus;
  enrolledCount: number;
  createdAt: Date;
}

// ---------- Lesson ----------
export type LessonType = 'video' | 'pdf' | 'text';

export interface ILesson {
  _id: Types.ObjectId;
  courseId: Types.ObjectId;
  title: string;
  type: LessonType;
  contentUrl: string;
  order: number;
  quiz?: Types.ObjectId;
  duration?: number;
}

// ---------- Quiz ----------
export interface IQuizQuestion {
  question: string;
  options: string[];
  correct: number; // index 0-3
}

export interface IQuiz {
  _id: Types.ObjectId;
  lessonId: Types.ObjectId;
  questions: IQuizQuestion[];
}

// ---------- Enrollment ----------
export interface IEnrollment {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  course: Types.ObjectId;
  enrolledAt: Date;
  completed: boolean;
  completedAt?: Date;
}

// ---------- UserProgress ----------
export interface IUserProgress {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  course: Types.ObjectId;
  completedLessons: Types.ObjectId[];
  lastActiveDate: Date;
  streak: number;
  completionPercent: number;
}

// ---------- QuizAttempt ----------
export interface IQuizAttempt {
  _id: Types.ObjectId;
  student: Types.ObjectId;
  quiz: Types.ObjectId;
  lesson: Types.ObjectId;
  course: Types.ObjectId;
  score: number;
  answers: number[];
  attemptNo: number;
  isAtRisk: boolean;
  createdAt: Date;
}

// ---------- Notification ----------
export type NotificationType = 'quiz' | 'course' | 'system' | 'reminder';

export interface INotification {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
}

// ---------- Auth / JWT ----------
export interface JWTPayload {
  userId: string;
  role: UserRole;
  name: string;
}

// ---------- Adaptive Engine ----------
export type AdaptiveStatus = 'at-risk' | 'needs-review' | 'reinforce' | 'advance';
export type AdaptiveAction = 'retry' | 'review-material' | 'next-lesson';

export interface AdaptiveResult {
  status: AdaptiveStatus;
  message: string;
  nextAction: AdaptiveAction;
}

// ---------- API Responses ----------
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ---------- Analytics ----------
export interface StudentAnalytics {
  totalCourses: number;
  completedCourses: number;
  averageScore: number;
  streak: number;
  quizHistory: { date: string; score: number; lessonTitle: string }[];
  courseProgress: { courseTitle: string; progress: number }[];
}

export interface InstructorAnalytics {
  totalCourses: number;
  totalStudents: number;
  engagementRate: number;
  completionRate: number;
  avgQuizScore: number;
  atRiskStudents: { name: string; email: string; course: string; score: number }[];
  courseMetrics: {
    courseTitle: string;
    enrolled: number;
    completed: number;
    avgScore: number;
  }[];
}

export interface AdminAnalytics {
  totalUsers: number;
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  publishedCourses: number;
  retentionRate: number;
  popularCourses: { title: string; enrolled: number }[];
  userGrowth: { date: string; count: number }[];
}
