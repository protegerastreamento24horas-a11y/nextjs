import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* configurações do Next.js */
  env: {
    // Variáveis de ambiente
    WINNING_CHANCE: process.env.WINNING_CHANCE || "100",
  },
  // Configurações para funcionar com Prisma no ambiente da Vercel
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', '.prisma'],
  },
  // Opcional: Configurações para imagens
  images: {
    domains: [], // Adicione domínios aqui se for usar imagens externas
  },
};

export default nextConfig;