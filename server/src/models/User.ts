import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  fullName: string;
  email: string;
  studentId?: string;
  password: string;
  faculty?: string;
  homeArea?: string;
  preferredRouteId?: 'route_6' | 'route_13' | 'both';
  avatarColor: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: [true, 'Họ tên là bắt buộc'],
      trim: true,
      minlength: [2, 'Họ tên phải có ít nhất 2 ký tự'],
      maxlength: [80, 'Họ tên không được vượt quá 80 ký tự'],
    },
    email: {
      type: String,
      required: [true, 'Email là bắt buộc'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    studentId: {
      type: String,
      trim: true,
      sparse: true,
      match: [/^[0-9]{2}(IT|DM|SE|AI|IS|KT|KH|MT|TN|XD)[0-9]{3}$/i, 'Mã sinh viên không đúng định dạng VKU'],
    },
    password: {
      type: String,
      required: [true, 'Mật khẩu là bắt buộc'],
      minlength: [6, 'Mật khẩu phải có ít nhất 6 ký tự'],
      select: false, // Never return password by default
    },
    faculty: {
      type: String,
      enum: ['IT', 'SE', 'AI', 'DM', 'IS', 'KT', 'KH', 'MT', 'TN', 'XD', 'OTHER'],
      default: 'IT',
    },
    homeArea: {
      type: String,
      trim: true,
    },
    preferredRouteId: {
      type: String,
      enum: ['route_6', 'route_13', 'both'],
      default: 'route_13',
    },
    avatarColor: {
      type: String,
      default: 'emerald',
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before save
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
