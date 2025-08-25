/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
    ];
  },
  env: {
    ELIZAOS_API_URL: process.env.ELIZAOS_API_URL || 'http://localhost:3001',
  },
};

module.exports = nextConfig; 