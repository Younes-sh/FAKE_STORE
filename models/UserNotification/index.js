import { model, models, Schema } from 'mongoose';

const UserNotificationSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    notification: {
      type: Schema.Types.ObjectId,
      ref: 'Notification',
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ایندکس برای جلوگیری از duplicate
UserNotificationSchema.index({ user: 1, notification: 1 }, { unique: true });

UserNotificationSchema.virtual('notificationDetails', {
  ref: 'Notification',
  localField: 'notification',
  foreignField: '_id',
  justOne: true,
});

const UserNotification = models.UserNotification || model('UserNotification', UserNotificationSchema);
export default UserNotification;