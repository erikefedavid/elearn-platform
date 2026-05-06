import mongoose, { Schema, Document } from 'mongoose';
import { IQuizAttempt } from '@/types';

export interface QuizAttemptDocument extends Omit<IQuizAttempt, '_id'>, Document {}

const QuizAttemptSchema = new Schema<QuizAttemptDocument>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  quiz: { type: Schema.Types.ObjectId, ref: 'Quiz', required: true },
  lesson: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  answers: [{ type: Number }],
  attemptNo: { type: Number, required: true, default: 1 },
  isAtRisk: { type: Boolean, default: false },
}, { timestamps: true });

QuizAttemptSchema.index({ student: 1, quiz: 1 });
QuizAttemptSchema.index({ course: 1 });

export default mongoose.models.QuizAttempt || mongoose.model<QuizAttemptDocument>('QuizAttempt', QuizAttemptSchema);
