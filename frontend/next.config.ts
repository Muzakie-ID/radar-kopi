import type { NextConfig } from "next";

const backendUrl = process.env.BACKEND_URL || (process.env.NODE_ENV === 'production' ? 'http://webserver:80' : 'http://localhost:8000');

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'backend',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'webserver',
        port: '80',
        pathname: '/storage/**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        source: '/storage/:path*',
        destination: `${backendUrl}/storage/:path*`,
      },
    ];
  },
};

export default nextConfig;
