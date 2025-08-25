/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/elizaos/:path*',
        destination: '/api/elizaos',
      },
    ];
  },
  env: {
    ELIZAOS_API_URL: process.env.ELIZAOS_API_URL || 'http://localhost:3001',
  },
  // For Vercel deployment
  output: 'standalone',
};

module.exports = nextConfig; 