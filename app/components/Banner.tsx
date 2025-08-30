import Image from "next/image";

export default function Banner() {
  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-xl overflow-hidden shadow-2xl mb-8">
      {/* Imagem do banner otimizada com Next.js Image */}
      <Image
        src="/banner-bg.svg"
        alt="Banner Rifa Premiada"
        fill
        className="object-cover"
        priority
      />
      
      {/* Conteúdo sobreposto */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-pink-700/80 flex items-center justify-center">
        <div className="text-center p-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">
            Rifa Premiada
          </h1>
          <p className="text-lg md:text-xl text-purple-200 mb-4">
            Ganhe prêmios incríveis com nossa rifa automática
          </p>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-white font-bold text-xl">
              Prêmio: R$ 10.000,00
            </p>
          </div>
        </div>
      </div>
      
      {/* Efeito de overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
    </div>
  );
}