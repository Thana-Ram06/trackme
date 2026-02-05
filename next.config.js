/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js 13+ has App Router enabled by default
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  // Optimize build for Vercel
  swcMinify: true,
  // Reduce build time and bundle size
  reactStrictMode: true,
  // Handle images properly
  images: {
    domains: ['lh3.googleusercontent.com'],
    formats: ['image/webp', 'image/avif']
  }
}

module.exports = nextConfig