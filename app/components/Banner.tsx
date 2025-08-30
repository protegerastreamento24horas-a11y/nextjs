"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

export default function Banner() {
  const [bannerImage, setBannerImage] = useState<string>('/banner-bg.svg');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBannerImage().catch(error => 
      console.error("Erro ao inicializar imagem do banner:", error)
    );
  }, []);

  const fetchBannerImage = async () => {
    try {
      const response = await fetch('/api/admin/banner');
      if (response.ok) {
        const data = await response.json();
        setBannerImage(data.imageUrl);
      }
    } catch (error) {
      console.error("Erro ao buscar imagem do banner:", error);
      // Manter a imagem padrão em caso de erro
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl mb-8 group">
      {/* Imagem do banner otimizada com Next.js Image */}
      {!isLoading && (
        <Image
          src={bannerImage}
          alt="Banner Rifa Premiada"
          fill
          className="object-cover transition-all duration-700 group-hover:scale-105"
          priority
          onError={() => {
            if (bannerImage !== '/banner-bg.svg') {
              setBannerImage('/banner-bg.svg');
            }
          }}
        />
      )}
      
      {/* Conteúdo sobreposto */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 via-purple-800/60 to-pink-700/80 flex items-center justify-center">
        <div className="text-center p-4 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
            Rifa Premiada
          </h1>
          <p className="text-lg md:text-xl text-purple-100 mb-6 animate-fade-in-delay">
            Ganhe prêmios incríveis com nossa rifa automática
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-6 inline-block border border-white/30 shadow-lg animate-fade-in-delay-2">
            <p className="text-white font-bold text-xl md:text-2xl">
              Prêmio: R$ 10.000,00
            </p>
            <p className="text-purple-100 text-sm mt-2">
              Bilhete por apenas R$ 1.000,00
            </p>
          </div>
        </div>
      </div>
      
      {/* Efeito de overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
}