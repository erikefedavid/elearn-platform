'use client';

import CourseCard from '@/components/course/CourseCard';

interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  skillLevel: string;
  thumbnail?: string;
  instructor?: { name: string };
  enrolledCount?: number;
}

interface RecommendedCoursesProps {
  courses: Course[];
}

export default function RecommendedCourses({ courses }: RecommendedCoursesProps) {
  if (courses.length === 0) return null;

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Recommended For You</h3>
          <p className="text-sm text-muted-foreground mt-1">Based on your interests and skill level</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.slice(0, 3).map((course) => (
          <CourseCard key={course._id} {...course} />
        ))}
      </div>
    </div>
  );
}
