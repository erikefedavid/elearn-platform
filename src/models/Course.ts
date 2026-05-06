import mongoose, { Schema, Document } from 'mongoose';
import { ICourse } from '@/types';

export interface CourseDocument extends Omit<ICourse, '_id'>, Document {}

const CourseSchema = new Schema<CourseDocument>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], required: true },
    thumbnail: { type: String, default: '' },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    lessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft' },
    enrolledCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CourseSchema.index({ status: 1 });
CourseSchema.index({ instructor: 1 });
CourseSchema.index({ category: 1 });

export default mongoose.models.Course || mongoose.model<CourseDocument>('Course', CourseSchema);
