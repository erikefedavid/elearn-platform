import mongoose, { Schema, Document } from 'mongoose';
import { INotification } from '@/types';

export interface NotificationDocument extends Omit<INotification, '_id'>, Document {}

const NotificationSchema = new Schema<NotificationDocument>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  message: { type: String, required: true },
  type: { type: String, enum: ['quiz', 'course', 'system', 'reminder'], required: true },
  read: { type: Boolean, default: false },
}, { timestamps: true });

NotificationSchema.index({ user: 1, read: 1 });

export default mongoose.models.Notification || mongoose.model<NotificationDocument>('Notification', NotificationSchema);
