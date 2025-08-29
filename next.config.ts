import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* configurações do Next.js */
  experimental: {
    turbopack: {
      root: '.'
    }
  }
};

export default nextConfig;