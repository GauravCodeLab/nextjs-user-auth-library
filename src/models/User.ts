import mongoose, { Document, Schema, model } from 'mongoose';

// Interface to represent the User document
export interface IUser extends Document {
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
}, { timestamps: true });

// Check if the model is already compiled to avoid recompilation issues
const UserModel = mongoose.models.User || model<IUser>('User', userSchema);

export default UserModel;
