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
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl mb-8">
      <h2 className="text-2xl font-bold text-white mb-6">Lista de Desejos</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {wishlist.map((prize) => (
          <div 
            key={prize.id} 
            className={`bg-gray-700/50 rounded-lg border-2 p-4 cursor-pointer transition-all ${
              selectedPrize === prize.id 
                ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
                : 'border-gray-600 hover:border-purple-500'
            }`}
            onClick={() => toggleWishlistItem(prize.id)}
          >
            <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
              <Image 
                src={prize.image} 
                alt={prize.name} 
                fill
                className="object-cover"
              />
            </div>
            <h3 className="font-bold text-white mb-1">{prize.name}</h3>
            <p className="text-yellow-400 font-bold text-lg">
              R$ {prize.value.toLocaleString('pt-BR')}
            </p>
            <div className="mt-3 flex justify-center">
              <span className={`px-3 py-1 rounded-full text-sm ${
                selectedPrize === prize.id 
                  ? 'bg-yellow-500 text-gray-900' 
                  : 'bg-gray-600 text-gray-300'
              }`}>
                {selectedPrize === prize.id ? 'Desejado' : 'Adicionar aos desejos'}
              </span>
            </div>
          </div>
        ))}
      </div>
      
      {selectedPrize && (
        <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg border border-purple-500/30">
          <h3 className="text-lg font-bold text-white mb-2">
            Prêmio selecionado como favorito:
          </h3>
          <p className="text-purple-200">
            {wishlist.find(p => p.id === selectedPrize)?.name}
          </p>
          <p className="text-sm text-gray-400 mt-2">
            Você será notificado quando este prêmio estiver disponível em uma rifa!
          </p>
        </div>
      )}
    </div>
  );
}