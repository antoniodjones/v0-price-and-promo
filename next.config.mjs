/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Only ignore during builds if explicitly set via env var
    ignoreDuringBuilds: process.env.SKIP_LINT === 'true',
  },
  typescript: {
    // Only ignore during builds if explicitly set via env var
    ignoreBuildErrors: process.env.SKIP_TYPE_CHECK === 'true',
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: ['localhost'],
  },
  serverExternalPackages: ['winston'],
  experimental: {
    nodeMiddleware: true,
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
  // Enable compression in production
  compress: process.env.NODE_ENV === 'production',
}

export default nextConfig
