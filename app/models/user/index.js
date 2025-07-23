import { model, models, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

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
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      number: { type: String, default: '' },
      floor: { type: String, default: '' },
      country: { type: String, default: '' }
    },

    role: {
      type: String,
      default: 'user',
      enum: {
        values: ['user', 'admin'],
        message: 'User role is not valid',
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// 🔐 هش کردن رمز عبور قبل از ذخیره در DB
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // اگر پسورد تغییر نکرد، هش نکن

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
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const User = models.User || model('User', UserSchema);
export default User;
