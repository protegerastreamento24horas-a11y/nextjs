"use client";

import { useState, useEffect } from "react";

type Winner = {
  id: number;
  name: string;
  prize: string;
  date: string;
  photo?: string;
};

export default function WinnerCarousel() {
  const fakeWinners: Winner[] = [
    { id: 1, name: "Carlos Silva", prize: "R$ 5.000,00", date: "15/04/2024" },
    { id: 2, name: "Maria Oliveira", prize: "R$ 2.500,00", date: "10/04/2024" },
    { id: 3, name: "João Santos", prize: "R$ 1.000,00", date: "05/04/2024" },
    { id: 4, name: "Ana Costa", prize: "R$ 3.200,00", date: "01/04/2024" },
    { id: 5, name: "Pedro Almeida", prize: "R$ 7.500,00", date: "25/03/2024" },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentIndex((prevIndex) => 
          prevIndex === fakeWinners.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, [isHovered]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === fakeWinners.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? fakeWinners.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Últimos Ganhadores
      </h2>
      
      <div 
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700 p-6 shadow-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Botões de navegação */}
        <button 
          onClick={prevSlide}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
          aria-label="Anterior"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={nextSlide}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
          aria-label="Próximo"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {fakeWinners.map((winner) => (
            <div 
              key={winner.id} 
              className="flex-shrink-0 w-full flex flex-col md:flex-row items-center justify-between p-4"
            >
              <div className="flex items-center mb-4 md:mb-0">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-500 border-2 border-white rounded-xl w-16 h-16 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">🏆</span>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-yellow-400">{winner.name}</h3>
                  <p className="text-gray-300">{winner.prize}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3 py-1 rounded-full text-sm font-bold shadow-md">
                  Vencedor
                </span>
                <p className="text-gray-400 text-sm mt-1">{winner.date}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Indicadores */}
        <div className="flex justify-center mt-4 space-x-2">
          {fakeWinners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 w-6" 
                  : "bg-gray-600 hover:bg-gray-500"
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}