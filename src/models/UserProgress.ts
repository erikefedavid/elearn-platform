import mongoose, { Schema, Document } from 'mongoose';
import { IUserProgress } from '@/types';

export interface UserProgressDocument extends Omit<IUserProgress, '_id'>, Document {}

const UserProgressSchema = new Schema<UserProgressDocument>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  completedLessons: [{ type: Schema.Types.ObjectId, ref: 'Lesson' }],
  lastActiveDate: { type: Date, default: Date.now },
  streak: { type: Number, default: 0 },
  completionPercent: { type: Number, default: 0, min: 0, max: 100 },
});

UserProgressSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.UserProgress || mongoose.model<UserProgressDocument>('UserProgress', UserProgressSchema);
