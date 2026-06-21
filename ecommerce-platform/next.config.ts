import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',  // optimized for production deployment
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com'       },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com'},
    ],
  },
  // Allow backend URL in production
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ]
  },
}

export default nextConfig