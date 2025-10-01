// models/order.js
import { Schema, model, models } from 'mongoose';

// 👇 تعریف درست OrderItemSchema قبل از استفاده در OrderSchema
const OrderItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtPurchase: {
    type: Number,
    required: true
  },
  image: {
    type: String,
    required: true
  }
}, { _id: false });

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  orderNumber: {
    type: String,
    unique: true,
    default: function () {
      return `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  },
  items: {
    type: [OrderItemSchema],
    required: true,
    validate: [arr => arr.length > 0, 'Order must have at least one item']
  },
  subtotal: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    default: 0
  },
  taxAmount: {
    type: Number,
    default: 0
  },
  totalAmount: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
    required: true
  },
  shippingAddress: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    postalCode: { type: String },
    country: { type: String, required: true }
  },
  trackingNumber: {
    type: String
  },
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  }
}, { timestamps: true });

const Order = models.Order || model('Order', OrderSchema);
export default Order;
