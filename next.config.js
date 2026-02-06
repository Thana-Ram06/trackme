/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production-ready configuration
  swcMinify: true,
  reactStrictMode: true,
  // Handle images properly
  images: {
    domains: ['images.unsplash.com'],
    formats: ['image/webp', 'image/avif']
  },
  // Ignore ESLint during build for frontend-only demo
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig