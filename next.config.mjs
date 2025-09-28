/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudflare Pages Functions requires server-side rendering
  // Remove 'export' output for Cloudflare to support API routes

  // Image optimization settings
  images: {
    // Cloudflare doesn't support Next.js image optimization
    unoptimized: true,
    domains: ['github.com', 'raw.githubusercontent.com'],
  },

  // Support for both Vercel and Cloudflare
  experimental: {
    // Additional experimental features can be added here
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  },
};

export default nextConfig;