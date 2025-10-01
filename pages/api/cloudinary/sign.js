// /pages/api/cloudinary/sign.js
import cloudinary from '@/lib/cloudinary';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  // پارامترهایی که کلاینت هنگام آپلود استفاده می‌کند
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'fake_store/uploads'; // دلخواه

  const paramsToSign = { timestamp, folder };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET
  );

  return res.status(200).json({
    timestamp,
    folder,
    signature,
    apiKey: process.env.CLOUDINARY_API_KEY,         // مشکلی نیست سمت کلاینت باشد
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,   // برای endpoint
  });
}
