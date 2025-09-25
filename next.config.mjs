/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static exports for Cloudflare Pages
  output: process.env.CLOUDFLARE_PAGES ? 'export' : undefined,

  // Image optimization settings
  images: {
    unoptimized: process.env.CLOUDFLARE_PAGES ? true : false,
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