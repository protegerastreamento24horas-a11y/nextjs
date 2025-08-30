"use client";

import { useState } from "react";
import Image from "next/image";

type Prize = {
  id: number;
  name: string;
  value: number;
  image: string;
};

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<Prize[]>([
    { id: 1, name: "Smartphone Galaxy S24", value: 5000, image: "/prize1.jpg" },
    { id: 2, name: "Notebook Gamer", value: 8000, image: "/prize2.jpg" },
    { id: 3, name: "Viagem Internacional", value: 15000, image: "/prize3.jpg" },
    { id: 4, name: "Smart TV 65\"", value: 6000, image: "/prize4.jpg" },
  ]);

  const [selectedPrize, setSelectedPrize] = useState<number | null>(null);

  const toggleWishlistItem = (prizeId: number) => {
    if (selectedPrize === prizeId) {
      setSelectedPrize(null);
    } else {
      setSelectedPrize(prizeId);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-2xl mb-8">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Lista de Desejos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((prize) => (
          <div 
            key={prize.id} 
            className={`bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl border-2 p-4 cursor-pointer transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl ${
              selectedPrize === prize.id 
                ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
                : 'border-gray-600 hover:border-purple-500'
            }`}
            onClick={() => toggleWishlistItem(prize.id)}
          >
            <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden shadow-md">
              <Image 
                src={prize.image} 
                alt={prize.name} 
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
              />
              {selectedPrize === prize.id && (
                <div className="absolute inset-0 bg-yellow-500/20 flex items-center justify-center">
                  <div className="bg-yellow-500 rounded-full p-2">
                    <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <h3 className="font-bold text-white mb-1">{prize.name}</h3>
            <p className="text-yellow-400 font-bold text-lg">
              R$ {prize.value.toLocaleString('pt-BR')}
            </p>
            <div className="mt-3 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-sm transition-all ${
                selectedPrize === prize.id 
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-gray-900 font-bold' 
                  : 'bg-gray-600 text-gray-300 hover:bg-purple-600'
              }`}>
                {selectedPrize === prize.id ? 'Desejado' : 'Adicionar aos desejos'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPrize && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-purple-500/30 shadow-lg animate-pulse-slow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="bg-yellow-500 rounded-full p-2">
                <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-bold text-white mb-1">
                Prêmio selecionado como favorito:
              </h3>
              <p className="text-purple-200">
                {wishlist.find(p => p.id === selectedPrize)?.name}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                Você será notificado quando este prêmio estiver disponível em uma rifa!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}