// models/Cart.js
import mongoose, { Schema, model, models } from 'mongoose';

const cartItemSchema = new Schema({
  _id: { 
    type: Schema.Types.ObjectId, 
    ref: "Product", // ref به مدل Product (حالا ثبت شده)
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  count: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  totalPrice: { 
    type: Number, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  description: { 
    type: String, 
    required: true // اضافه شده
  },
  section: { 
    type: String, 
    required: true // اضافه شده
  },
  model: { 
    type: String, 
    required: true // اضافه شده
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true // برای جستجوی سریع بر اساس user
  },
  products: [cartItemSchema], // آرایه از cartItemSchema
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true // Mongoose createdAt و updatedAt را مدیریت می‌کند
});

CartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ثبت مدل با جلوگیری از OverwriteModelError
const Cart = models.Cart || model("Cart", CartSchema);
export default Cart;