import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from '@/types';

export interface UserDocument extends Omit<IUser, '_id'>, Document {}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['student', 'instructor', 'admin'], required: true },
    avatar: { type: String, default: '' },
    interests: [{ type: String }],
    skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  },
  { timestamps: true }
);

// Index for faster lookups
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

export default mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
