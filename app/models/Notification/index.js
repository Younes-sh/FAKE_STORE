import { model, models, Schema } from 'mongoose';

const NotificationSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot be longer than 500 characters'],
    },
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error', 'promotion'],
      default: 'info',
    },
    targetUsers: {
      type: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
      }],
      default: [], // اگر خالی باشد برای همه کاربران است
    },
    isForAllUsers: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    relatedProduct: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ایندکس برای جستجوی بهتر
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ isActive: 1 });
NotificationSchema.index({ expiresAt: 1 });
NotificationSchema.index({ targetUsers: 1 });

const Notification = models.Notification || model('Notification', NotificationSchema);
export default Notification;