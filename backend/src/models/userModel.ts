import mongoose, { Schema, Document } from 'mongoose';

interface User extends Document {
  name: string;
  dob: Date;
  email: string;
}

const userSchema = new Schema<User>({
  name: { type: String, required: true },
  dob: { type: Date, required: true },
  email: { type: String, required: true, unique: true }
});

export const UserModel = mongoose.model<User>('User', userSchema);