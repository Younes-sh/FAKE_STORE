/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'younessheikhlar.com',
        // اگر نیاز به محدود کردن پورت یا مسیر خاصی دارید، می‌توانید از port و pathname استفاده کنید.
        // port: '',
        // pathname: '/images/**',
      },
    ],
  },
};

export default nextConfig;
// https://younessheikhlar.com/
