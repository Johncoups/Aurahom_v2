/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Use Next.js Image Optimization in production
    unoptimized: false,
  },
  async headers() {
    if (!isProd) {
      return []
    }
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // CSP: default dev-friendly; set CSP_PROD=1 to use stricter production CSP
          { key: 'Content-Security-Policy', value: process.env.CSP_PROD === '1'
            ? "default-src 'self'; img-src 'self' data: blob:; script-src 'self'; style-src 'self'; connect-src 'self' https:; font-src 'self' data:; frame-ancestors 'none';"
            : "default-src 'self'; img-src 'self' data: blob; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; connect-src 'self' https:; font-src 'self' data:; frame-ancestors 'none';"
          },
        ],
      },
    ]
  },
}

export default nextConfig
