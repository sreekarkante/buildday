/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/webp'],
  },
};

module.exports = nextConfig;
