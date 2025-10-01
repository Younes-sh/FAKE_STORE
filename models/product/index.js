 // ✅ /models/Product.js
 import { models, model, Schema } from 'mongoose';
 
 const ProductSchema = new Schema(
   {
     productName: {
       type: String,
       required: [true, 'Product name is required.'],
       trim: true,
     },
     description: {
       type: String,
       default: '',
       trim: true,
     },
     price: {
       type: Number,
       required: [true, 'Product price is required.'],
       min: [0, 'Product price cannot be negative.'],
     },
     model: {
       type: String,
       required: [true, 'Product model is required.'],
       trim: true,
     },
     section: {
       type: String,
       required: [true, 'Product section is required.'],
       trim: true,
     },
     image: {
       type: String,
       required: [true, 'Product image URL is required.'],
     },
   },
   {
     timestamps: true, // ایجاد خودکار createdAt و updatedAt
   }
 );
 
 const Product = models.Product || model('Product', ProductSchema);
 export default Product;
 