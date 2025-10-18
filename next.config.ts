import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'encrypted-tbn0.gstatic.com',
      'media.licdn.com',
      'logo.clearbit.com',
      'jsearch.p.rapidapi.com',
      'tse1.mm.bing.net',
      'tse2.mm.bing.net',
      'tse3.mm.bing.net',
      'tse4.mm.bing.net',
      'static.licdn.com',
      'lh3.googleusercontent.com',
      'm.media-amazon.com',
      'upload.wikimedia.org',
      // YouTube thumbnail domains
      'i.ytimg.com',
      'img.youtube.com',
      'i1.ytimg.com',
      'i2.ytimg.com',
      'i3.ytimg.com',
      'i4.ytimg.com',
      'yt3.ggpht.com',
      'yt3.googleusercontent.com',
      // Invidious thumbnail proxy
      'invidious.snopyta.org'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/images/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: '**',
        pathname: '/hqdefault.jpg',
      }
    ],
  }
};

export default nextConfig;
