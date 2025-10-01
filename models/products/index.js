// models/Product.js
import mongoose, { Schema, model, models } from 'mongoose';

const productSchema = new Schema({
  // فیلدهای اصلی (بر اساس sub-schema products در Cart)
  productName: { 
    type: String, 
    required: true, 
    trim: true // حذف فضاهای خالی
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 // قیمت منفی مجاز نیست
  },
  image: { 
    type: String, 
    required: true // URL یا مسیر تصویر
  },
  description: { 
    type: String, 
    required: true, 
    trim: true 
  },
  section: { 
    type: String, 
    required: true, 
    trim: true // دسته‌بندی یا بخش
  },
  model: { 
    type: String, 
    required: true, 
    trim: true // مدل محصول
  },

  // فیلدهای اضافی (اختیاری، بر اساس نیاز پروژه)
  stock: { 
    type: Number, 
    default: 0, 
    min: 0 // موجودی انبار
  },
  category: { 
    type: Schema.Types.ObjectId, 
    ref: 'Category' // اگر دسته‌بندی جداگانه دارید
  },
  tags: [{ 
    type: String 
  }], // تگ‌های محصول

  // timestamps خودکار
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true // Mongoose createdAt و updatedAt را مدیریت می‌کند
});

// پیش‌پردازش قبل از save (اختیاری)
productSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

// ثبت مدل با جلوگیری از OverwriteModelError
const Product = models.Product || model("Product", productSchema);

export default Product;