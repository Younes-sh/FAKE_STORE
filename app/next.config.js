/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // هر چی لازم داری اینجا بگذار
  env: {
    NEXTAUTH_DEBUG: "true",
    // این‌ها رو هم در .env.local بذار، ولی چون NEXT_PUBLIC هست،
    // اگر بخوای اینجا mirror کنی هم ایراد نداره:
    // NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    // NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
  },

  images: {
    // می‌تونی فرمت‌های بهینه هم فعال کنی (اختیاری)
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      // دامنه‌ی Cloudinary برای نمایش تصاویر آپلود شده
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        // اگر خواستی محدودترش کنی، می‌تونی pathname رو هم ست کنی:
        // pathname: '/YOUR_CLOUD_NAME/**'
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ]
      }
    ]
  },
};

export default nextConfig;
