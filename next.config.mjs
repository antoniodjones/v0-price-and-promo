/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    unoptimized: process.env.NODE_ENV === 'development',
    domains: ['localhost'],
  },
  experimental: {
    serverComponentsExternalPackages: ['winston'],
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
  // Optimize bundle size
  swcMinify: true,
}

export default nextConfig
