import { model, models, Schema } from 'mongoose';

const ContactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot be longer than 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        'Please enter a valid email',
      ],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      maxlength: [2000, 'Message cannot be longer than 2000 characters'],
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['new', 'in-progress', 'resolved', 'archived'],
      default: 'new',
    },
  },
  {
    timestamps: true,
  }
);

const Contact = models.Contact || model('Contact', ContactSchema);
export default Contact;