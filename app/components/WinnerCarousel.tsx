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

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === fakeWinners.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000); // Muda a cada 3 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Últimos Ganhadores
      </h2>
      
      <div className="relative overflow-hidden rounded-xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-6 shadow-xl">
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
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="text-xl font-bold text-yellow-400">{winner.name}</h3>
                  <p className="text-gray-300">{winner.prize}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="bg-green-900/50 text-green-300 px-3 py-1 rounded-full text-sm">
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
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-purple-600" : "bg-gray-600"
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}