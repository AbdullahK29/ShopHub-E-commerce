import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',  // we'll use this later for product images
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',  // for Google OAuth profile pictures
      },
    ],
  },
}

export default nextConfig