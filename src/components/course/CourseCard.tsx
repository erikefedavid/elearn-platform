'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Users, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CourseCardProps {
  _id: string;
  title: string;
  description: string;
  category: string;
  skillLevel: string;
  thumbnail?: string;
  instructor?: { name: string; avatar?: string };
  enrolledCount?: number;
  lessonsCount?: number;
  progress?: number;
}

export default function CourseCard({
  _id,
  title,
  description,
  category,
  skillLevel,
  thumbnail,
  instructor,
  enrolledCount = 0,
  lessonsCount,
  progress,
}: CourseCardProps) {
  const getLevelVariant = (level?: string) => {
    if (!level) return 'outline';
    switch (level.toLowerCase()) {
      case 'beginner': return 'default';
      case 'intermediate': return 'secondary';
      case 'advanced': return 'destructive';
      default: return 'outline';
    }
  };

  const href = progress !== undefined ? `/student/learning-path/${_id}` : `/courses/${_id}`;

  return (
    <Link href={href} className="block group h-full">
      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden h-full flex flex-col hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative h-48 bg-muted overflow-hidden">
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-muted">
              <BookOpen className="w-16 h-16 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-2">
            <Badge variant={getLevelVariant(skillLevel) as "default" | "secondary" | "destructive" | "outline"} className="capitalize">
              {skillLevel || 'All Levels'}
            </Badge>
            <Badge variant="outline" className="bg-background/80 backdrop-blur-sm">
              {category}
            </Badge>
          </div>
          {progress !== undefined && (
            <div className="absolute bottom-0 left-0 right-0">
              <Progress value={progress} className="h-1.5 rounded-none bg-background/50" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">
            {description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            {instructor && (
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                  {instructor.name.charAt(0)}
                </div>
                <span className="text-xs text-muted-foreground font-medium">{instructor.name}</span>
              </div>
            )}
            <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
              {lessonsCount !== undefined && (
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> {lessonsCount}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {enrolledCount}
              </span>
            </div>
          </div>

          {progress !== undefined && (
            <div className="mt-4 flex items-center gap-3">
              <Progress value={progress} className="h-2 flex-1" />
              <span className="text-xs font-bold text-primary">{progress}%</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
