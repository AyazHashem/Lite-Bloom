import type { NextConfig } from "next";

const rawAPIURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'
const apiURL = rawAPIURL.replace(/\/api\/?$/, '')

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${apiURL}/api/:path*`,
      },
    ]
  },

  typescript: {
    ignoreBuildErrors: false,
  },
  
  images: {
    remotePatterns: [],
  }
}

export default nextConfig;
