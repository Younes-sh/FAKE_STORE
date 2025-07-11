 // ✅ /models/Product.js
 import { models, model, Schema } from 'mongoose';
 
 const ProductSchema = new Schema(
   {
     productName: {
       type: String,
       required: [true, 'نام محصول الزامی است'],
       trim: true,
     },
     description: {
       type: String,
       default: '',
       trim: true,
     },
     price: {
       type: Number,
       required: [true, 'قیمت محصول الزامی است'],
       min: [0, 'قیمت نمی‌تواند منفی باشد'],
     },
     model: {
       type: String,
       required: [true, 'مدل محصول الزامی است'],
       trim: true,
     },
     section: {
       type: String,
       required: [true, 'بخش محصول الزامی است'],
       trim: true,
     },
     image: {
       type: String,
       required: [true, 'آدرس تصویر الزامی است'],
     },
   },
   {
     timestamps: true, // ایجاد خودکار createdAt و updatedAt
   }
 );
 
 const Product = models.Product || model('Product', ProductSchema);
 export default Product;
 