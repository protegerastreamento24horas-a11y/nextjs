import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* configurações do Next.js */
  env: {
    // Variáveis de ambiente
    WINNING_CHANCE: process.env.WINNING_CHANCE || "100",
  },
  // Opcional: Configurações para imagens
  images: {
    domains: [], // Adicione domínios aqui se for usar imagens externas
  },
};

export default nextConfig;