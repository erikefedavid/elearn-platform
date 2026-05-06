import mongoose, { Schema, Document } from 'mongoose';
import { ILesson } from '@/types';

export interface LessonDocument extends Omit<ILesson, '_id'>, Document {}

const LessonSchema = new Schema<LessonDocument>({
  courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['video', 'pdf', 'text'], required: true },
  contentUrl: { type: String, required: true },
  order: { type: Number, required: true },
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz' },
  duration: { type: Number },
});

LessonSchema.index({ courseId: 1, order: 1 });

export default mongoose.models.Lesson || mongoose.model<LessonDocument>('Lesson', LessonSchema);
