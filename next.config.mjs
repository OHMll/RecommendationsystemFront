/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true, // ปิด image optimization เพื่อให้โหลดภาพตรงจาก public/
  },
};

export default nextConfig;
