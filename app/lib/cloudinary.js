// /lib/cloudinary.js
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  // detaf722p
  api_key:    process.env.CLOUDINARY_API_KEY,     // 6163...
  api_secret: process.env.CLOUDINARY_API_SECRET,  // *** (فقط سرور)
  secure: true
});

export default cloudinary;
