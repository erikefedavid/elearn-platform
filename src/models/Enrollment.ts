import mongoose, { Schema, Document } from 'mongoose';
import { IEnrollment } from '@/types';

export interface EnrollmentDocument extends Omit<IEnrollment, '_id'>, Document {}

const EnrollmentSchema = new Schema<EnrollmentDocument>({
  student: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: Schema.Types.ObjectId, ref: 'Course', required: true },
  enrolledAt: { type: Date, default: Date.now },
  completed: { type: Boolean, default: false },
  completedAt: { type: Date },
});

// Prevent duplicate enrollments
EnrollmentSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.models.Enrollment || mongoose.model<EnrollmentDocument>('Enrollment', EnrollmentSchema);
