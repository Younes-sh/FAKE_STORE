import { models, model, Schema } from 'mongoose';

const CartItemSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1,
    min: 1
  },
  selected: { 
    type: Boolean, 
    default: true 
  },
  addedAt: { 
    type: Date, 
    default: Date.now 
  }
});

const CartSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true,
    unique: true
  },
  items: [CartItemSchema],
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Middleware برای به روزرسانی تاریخ ویرایش
CartSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = models.Cart || model('Cart', CartSchema);
export default Cart;