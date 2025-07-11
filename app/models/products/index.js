import mongoose, { Schema, model, models } from 'mongoose';

const CartSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true
  },
  products: [
    {
      _id: { type: Schema.Types.ObjectId, ref: "Product" },
      productName: { type: String, required: true },
      price: { type: Number, required: true },
      count: { type: Number, required: true, min: 1 },
      totalPrice: { type: Number, required: true },
      image: { type: String, required: true }
    }
  ],
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

CartSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const Cart = models.Cart || model("Cart", CartSchema);
export default Cart;
