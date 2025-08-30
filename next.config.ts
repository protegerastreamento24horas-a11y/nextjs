import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  /* configurações do Next.js */
  outputFileTracingRoot: path.join(__dirname, '.'),
  experimental: {
    // Removida a configuração inválida do turbopack
  }
};

export default nextConfig;