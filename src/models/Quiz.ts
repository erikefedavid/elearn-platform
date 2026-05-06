import mongoose, { Schema, Document } from 'mongoose';
import { IQuiz } from '@/types';

export interface QuizDocument extends Omit<IQuiz, '_id'>, Document {}

const QuestionSchema = new Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct: { type: Number, required: true, min: 0, max: 3 },
}, { _id: false });

const QuizSchema = new Schema<QuizDocument>({
  lessonId: { type: Schema.Types.ObjectId, ref: 'Lesson', required: true },
  questions: [QuestionSchema],
});

QuizSchema.index({ lessonId: 1 });

export default mongoose.models.Quiz || mongoose.model<QuizDocument>('Quiz', QuizSchema);
