import { model, models, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const AddressSchema = new Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  postalCode: { type: String, default: '' },
  number: { type: String, default: '' },
  floor: { type: String, default: '' },
  country: { type: String, default: '' },
}, { _id: false });

const UserSchema = new Schema(
  {
    firstname: {
      type: String,
      trim: true,
      maxlength: [50, 'Name cannot be longer than 50 characters'],
    },
    lastname: {
      type: String,
      trim: true,
      maxlength: [50, 'Last name cannot be longer than 50 characters'],
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false,
      minlength: [8, 'Password must be at least 8 characters'],
    },
    phone: {
      type: String,
      trim: true,
      maxlength: [20, 'Phone number too long'],
    },
    address: {
      type: AddressSchema,
      default: () => ({}),
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // اطلاعات سرویس ایمیل
    emailVerified: { type: Date, default: null },
    verificationCodeHash: { type: String, select: false },
    verificationExpires: { type: Date, select: false },
    verificationAttempts: { type: Number, default: 0, select: false },
    
    // 🔑 فیلدهای جدید برای بازیابی رمز عبور
    resetPasswordToken: { 
      type: String, 
      select: false 
    },
    resetPasswordExpires: { 
      type: Date, 
      select: false 
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔐 هش کردن رمز
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔁 تابع مقایسه رمز
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// 👤 Virtual fullName
UserSchema.virtual('fullName').get(function () {
  return `${this.firstname || ''} ${this.lastname || ''}`.trim();
});

// 🔍 ایندکس‌ها
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ username: 1 }, { unique: true });
UserSchema.index({ resetPasswordExpires: 1 }); // ایندکس جدید برای پاکسازی خودکار

const User = models.User || model('User', UserSchema);
export default User;