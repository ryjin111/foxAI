/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  // For Vercel deployment
  output: 'standalone',
};

module.exports = nextConfig; 