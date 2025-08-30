"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Banner from "./components/Banner";
import WinnerCarousel from "./components/WinnerCarousel";

type Winner = {
  userName: string;
  prizeDate: string;
  prizeName: string;
  drawnNumbers: string;
};

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [result, setResult] = useState<{ isWinner: boolean; message: string; drawnNumbers?: number[]; prize?: any } | null>(null);
  const [prizeValue, setPrizeValue] = useState(10000); // Valor padrão R$ 10.000,00
  const [isLoading, setIsLoading] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ticketPrice, setTicketPrice] = useState(1000); // Preço padrão R$ 1.000,00
  
  // Estados para pagamento PIX
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [copyPaste, setCopyPaste] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);
  const sampleWinners = [
    { id: 1, name: "Ana Silva", prize: "Smartphone Galaxy S24", date: "2025-05-01", image: "/winner1.jpg" },
    { id: 2, name: "Carlos Oliveira", prize: "Notebook Gamer", date: "2025-05-05", image: "/winner2.jpg" },
    { id: 3, name: "Mariana Santos", prize: "Fone de Ouvido", date: "2025-05-08", image: "/winner3.jpg" },
    { id: 4, name: "Pedro Costa", prize: "Smartwatch", date: "2025-05-10", image: "/winner4.jpg" },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Confira os últimos ganhadores</h2>
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 scrollbar-hide">
          {sampleWinners.map((winner) => (
            <div key={winner.id} className="flex-none w-64 md:w-80 bg-gray-800/50 rounded-lg p-4 m-2 hover:bg-gray-700/50 transition-colors">
              <div className="relative w-full h-32 mb-3 rounded-lg overflow-hidden">
                <Image 
                  src={winner.image} 
                  alt={`Vencedor ${winner.name}`} 
                  width={300} 
                  height={200} 
                  className="object-cover"
                />
              </div>
              <h3 className="font-bold text-yellow-400">{winner.name}</h3>
              <p className="text-sm text-gray-300 mb-1">{winner.prize}</p>
              <p className="text-xs text-gray-400">
                {new Date(winner.date).toLocaleDateString('pt-BR')}
              </p>
            </div>
          ))}
        </div>
        <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-gray-900 to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-gray-900 to-transparent z-10"></div>
      </div>
    </div>
  );
}
'use client';

import React from 'react';
import Image from 'next/image';

export default function Banner() {
  return (
    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Rifa Premiada</h1>
          <p className="text-xl md:text-2xl text-white/90">Concorra a prêmios incríveis com apenas R$ 10</p>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Banner from "./components/Banner";
import WinnerCarousel from "./components/WinnerCarousel";

type Winner = {
  userName: string;
  prizeDate: string;
  prizeName: string;
  drawnNumbers: string;
};

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [result, setResult] = useState<{ isWinner: boolean; message: string; drawnNumbers?: number[]; prize?: any } | null>(null);
  const [prizeValue, setPrizeValue] = useState(10000); // Valor padrão R$ 10.000,00
  const [isLoading, setIsLoading] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ticketPrice, setTicketPrice] = useState(1000); // Preço padrão R$ 1.000,00
  
  // Estados para pagamento PIX
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [copyPaste, setCopyPaste] = useState<string | null>(null);
  const [ticketId, setTicketId] = useState<string | null>(null);

  useEffect(() => {
    fetchWinners();
    startCountdown();
    fetchRaffleInfo();
    
    // Atualizar o countdown a cada segundo
    const timer = setInterval(() => {
      startCountdown();
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const fetchRaffleInfo = async () => {
    try {
      // Em uma implementação real, buscaríamos as informações da API
      // Por enquanto, vamos manter os valores padrão
      setTicketPrice(1000);
      setPrizeValue(10000);
    } catch (error) {
      console.error("Erro ao buscar informações da rifa:", error);
    }
  };

  const startCountdown = () => {
    // Data fixa para o próximo sorteio (exemplo: 7 dias a partir de hoje)
    const nextDraw = new Date();
    nextDraw.setDate(nextDraw.getDate() + 7);
    
    const now = new Date();
    const diff = nextDraw.getTime() - now.getTime();
    
    if (diff > 0) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    }
  };

  const fetchWinners = async () => {
    try {
      const response = await fetch("/api/comprar");
      const data = await response.json();
      if (response.ok) {
        setWinners(data);
      } else {
        console.error("Erro ao buscar vencedores:", data.error);
      }
    } catch (error) {
      console.error("Erro ao buscar vencedores:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);
    setQrCode(null);
    setCopyPaste(null);
    setTicketId(null);

    try {
      const response = await fetch("/api/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, userEmail, ticketPrice }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Exibir QR Code para pagamento
        setQrCode(data.qrCode);
        setCopyPaste(data.copyPaste);
        setTicketId(data.ticketId);
      } else {
        setResult({
          isWinner: false,
          message: data.error || "Erro ao processar compra"
        });
      }
    } catch (error) {
      console.error("Erro ao processar compra:", error);
      setResult({
        isWinner: false,
        message: "Erro ao processar compra. Por favor, tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (copyPaste) {
      navigator.clipboard.writeText(copyPaste)
        .then(() => {
          alert("Código PIX copiado para a área de transferência!");
        })
        .catch(err => {
          console.error('Erro ao copiar texto: ', err);
          // Fallback para dispositivos mobile
          const textArea = document.createElement("textarea");
          textArea.value = copyPaste;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand("copy");
          document.body.removeChild(textArea);
          alert("Código PIX copiado para a área de transferência!");
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent py-4">
          Rifa Premiada
        </h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Participe da nossa rifa automática e concorra a prêmios incríveis com pagamento via PIX!
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Banner Principal */}
        <Banner />
        
        {/* Carrossel de Ganhadores */}
        <WinnerCarousel />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de compra */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
            <h1 className="text-3xl font-bold mb-2">Compre seu bilhete</h1>
            <p className="text-gray-400 mb-6">
              Concorra a R$ {prizeValue.toLocaleString('pt-BR')} com apenas R$ {ticketPrice.toLocaleString('pt-BR')}
            </p>
          <h2 className="text-2xl font-bold mb-4">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-yellow-400 mb-2">Mecânica da Rifa</h3>
              <ul className="text-sm space-y-1">
                <li>• Pague R$ {ticketPrice / 100} por bilhete via PIX</li>
                <li>• Números sorteados automaticamente</li>
                <li>• Prêmio principal: R$ {prizeValue / 100}</li>
                <li>• Sorteio em {countdown.days} dias</li>
              </ul>
            </div>
            <div className="bg-gray-700/50 p-4 rounded-lg">
              <h3 className="font-bold text-green-400 mb-2">Prêmios</h3>
              <ul className="text-sm space-y-1">
                <li>• Smartphone Top de Linha</li>
                <li>• Notebook Gamer</li>
                <li>• Fone de Ouvido Bluetooth</li>
                <li>• Smartwatch</li>
                <li>• Vale Compras R$ 100</li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-500/30 rounded-xl p-4 mb-6">
            <h3 className="font-bold text-xl mb-2 text-center">Próximo Sorteio</h3>
            <div className="flex justify-center space-x-2 md:space-x-4">
              <div className="text-center">
                <div className="bg-black/30 rounded-lg py-2 px-3 md:px-4">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.days.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm text-gray-400">Dias</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-black/30 rounded-lg py-2 px-3 md:px-4">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.hours.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm text-gray-400">Horas</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-black/30 rounded-lg py-2 px-3 md:px-4">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm text-gray-400">Minutos</div>
                </div>
              </div>
              <div className="text-center">
                <div className="bg-black/30 rounded-lg py-2 px-3 md:px-4">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</div>
                  <div className="text-xs md:text-sm text-gray-400">Segundos</div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulário de compra */}
          {!qrCode && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="userName" className="block text-sm font-medium mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="userName"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Seu nome completo"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="userEmail" className="block text-sm font-medium mb-1">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  id="userEmail"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="seu@email.com"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Necessário para receber notificações de prêmios
                </p>
              </div>
              
              <button
                type="submit"
                disabled={isLoading || !userName}
                className={`w-full py-3 rounded-lg font-bold transition-all ${
                  isLoading || !userName
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                }`}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  `Comprar Bilhete - R$ ${ticketPrice / 100}`
                )}
              </button>
              
              {result && (
                <div className={`p-4 rounded-lg ${result.isWinner ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
                  <p className={result.isWinner ? 'text-green-300' : 'text-red-300'}>
                    {result.message}
                  </p>
                  {result.drawnNumbers && (
                    <p className="mt-2">
                      Seus números: {result.drawnNumbers.join(', ')}
                    </p>
                  )}
                </div>
              )}
            </form>
          )}

            {/* Exibição do QR Code */}
            {qrCode && (
              <div className="mt-6 bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <h3 className="text-lg font-semibold mb-3 text-center">Pagamento PIX</h3>
                <div className="flex justify-center mb-4">
                  <Image 
                    src={`data:image/png;base64,${qrCode}`} 
                    alt="QR Code PIX" 
                    width={200} 
                    height={200} 
                    className="rounded-lg"
                  />
                </div>
                <p className="text-sm text-gray-300 mb-4">
                  Escaneie o QR Code ou copie o código PIX abaixo
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={copyPaste || ''}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-2 text-sm"
                  />
                  <button
                    onClick={copyToClipboard}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-r-lg font-medium transition-colors"
                  >
                    Copiar
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  ID do bilhete: {ticketId}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Últimos vencedores */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4">Últimos Vencedores</h2>
          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {winners.length > 0 ? (
              winners.map((winner, index) => (
                <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-yellow-400">{winner.userName}</h3>
                      <p className="text-sm text-gray-300">{winner.prizeName}</p>
                    </div>
                    <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded">
                      Vencedor
                    </span>
                  </div>
                  <div className="mt-2 text-xs text-gray-400">
                    <p>Números: {winner.drawnNumbers}</p>
                    <p>{new Date(winner.prizeDate).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-center py-4">
                Nenhum vencedor registrado ainda
              </p>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
        <p>© {new Date().getFullYear()} Rifa Premiada. Todos os direitos reservados.</p>
        <p className="mt-1">Jogue com responsabilidade. Sorteios sujeitos a regulamentação.</p>
      </footer>
    </div>
  );
}