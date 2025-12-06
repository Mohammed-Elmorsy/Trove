import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.philips.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.foodandwine.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blackmountainproducts.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
