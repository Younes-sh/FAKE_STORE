import { model, models, Schema } from "mongoose";
import bcrypt from 'bcryptjs';


const UserSchema = new Schema({
  firstname: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Name cannot be longer than 50 characters']
  },
  lastname: { 
    type: String, 
    trim: true,
    maxlength: [50, 'Last name cannot be longer than 50 characters']
  },
  username: { 
    type: String, 
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    select: false,
    minlength: [8, 'Password must be at least 8 characters']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: [20, 'Phone number too long']
  },
  address: {
    type: String,
    trim: true,
    maxlength: [300, 'Address is too long']
  },

  role: {
    type: String,
    default: "user",
    enum: {
      values: ["user", "admin"],
      message: 'User role is not valid'
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Remove pre('save') because it gets hashed in its own register ❗

// Password comparison function
UserSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

const User = models.User || model('User', UserSchema);
export default User;
