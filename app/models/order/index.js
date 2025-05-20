import { Schema, model, models } from 'mongoose';

const OrderItemSchema = new Schema({
  product: { 
    type: Schema.Types.ObjectId, 
    ref: 'Product',
    required: true 
  },
  name: { // اضافه کردن نام محصول برای نمایش راحت‌تر
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
  image: { // اضافه کردن تصویر محصول
    type: String,
    required: true
  }
}, { _id: false }); // غیرفعال کردن _id برای آیتم‌ها

const OrderSchema = new Schema({
  user: { 
    type: Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  orderNumber: { // شماره سفارش منحصر به فرد
    type: String,
    unique: true,
    required: true
  },
  items: [OrderItemSchema],
  subtotal: Number,
  shippingFee: Number,
  taxAmount: Number,
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
    type: {
      street: String,
      city: String,
      state: String,
      postalCode: String,
      country: String
    },
    required: true
  },
  trackingNumber: String,
  status: {
    type: String,
    enum: ['processing', 'shipped', 'delivered', 'cancelled'],
    default: 'processing'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: Date
}, { timestamps: true });

// تولید خودکار شماره سفارش قبل از ذخیره
OrderSchema.pre('save', function(next) {
  if (!this.orderNumber) {
    this.orderNumber = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }
  this.updatedAt = Date.now();
  next();
});

const Order = models.Order || model('Order', OrderSchema);
export default Order;