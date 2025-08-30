"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import dynamic from 'next/dynamic';
import Wishlist from "./components/Wishlist";

// Carregando componentes com lazy loading
const Banner = dynamic(() => import('./components/Banner'), { 
  loading: () => <div className="h-64 md:h-80 lg:h-96 bg-gradient-to-r from-purple-900 to-pink-700 rounded-2xl mb-8 animate-pulse"></div>,
  ssr: true
});

const WinnerCarousel = dynamic(() => import('./components/WinnerCarousel'), { 
  loading: () => <div className="h-48 bg-gradient-to-r from-gray-800 to-gray-900 rounded-2xl mb-8 animate-pulse"></div>,
  ssr: true
});

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
        if (data.isWinner) {
          setResult({
            isWinner: true,
            message: `Parabéns ${userName}! Você ganhou ${data.prize}!`,
            drawnNumbers: data.drawnNumbers,
            prize: data.prize
          });
        } else {
          // Mostrar informações de pagamento PIX
          setQrCode(data.qrCode);
          setCopyPaste(data.copyPaste);
          setTicketId(data.ticketId);
        }
      } else {
        setResult({
          isWinner: false,
          message: data.error || "Erro ao processar compra"
        });
      }
    } catch (error) {
      setResult({
        isWinner: false,
        message: "Erro de conexão. Por favor, tente novamente."
      });
      console.error("Erro:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (copyPaste) {
      navigator.clipboard.writeText(copyPaste);
      // Mostrar feedback visual
      const button = document.getElementById('copy-button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Copiado!';
        setTimeout(() => {
          button.textContent = originalText;
        }, 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Banner Principal - Carregado com lazy loading */}
        <div className="group">
          <Banner />
        </div>
        
        {/* Lista de desejos */}
        <Wishlist />
        
        {/* Carrossel de Ganhadores - Carregado com lazy loading */}
        <div className="group">
          <WinnerCarousel />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Formulário de compra */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Compre seu bilhete
              </h1>
              <p className="text-gray-400">
                Concorra a <span className="font-bold text-yellow-400">R$ {prizeValue.toLocaleString('pt-BR')}</span> com apenas <span className="font-bold text-green-400">R$ {ticketPrice.toLocaleString('pt-BR')}</span>
              </p>
            </div>

            {/* Contador regressivo */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl p-4 mb-6 border border-purple-500/30 shadow-lg">
              <h2 className="text-lg font-semibold mb-3 text-center text-white">Próximo sorteio em:</h2>
              <div className="flex justify-center space-x-2">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg py-3 px-4 shadow-md">
                    <span className="text-2xl font-bold text-white">{countdown.days.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Dias</span>
                </div>
                <div className="text-center flex items-center justify-center text-gray-500">:</div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg py-3 px-4 shadow-md">
                    <span className="text-2xl font-bold text-white">{countdown.hours.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Horas</span>
                </div>
                <div className="text-center flex items-center justify-center text-gray-500">:</div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg py-3 px-4 shadow-md">
                    <span className="text-2xl font-bold text-white">{countdown.minutes.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Minutos</span>
                </div>
                <div className="text-center flex items-center justify-center text-gray-500">:</div>
                <div className="text-center">
                  <div className="bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg py-3 px-4 shadow-md">
                    <span className="text-2xl font-bold text-white">{countdown.seconds.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Segundos</span>
                </div>
              </div>
            </div>

            {result?.isWinner ? (
              <div className="bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-xl p-6 mb-6 border border-yellow-500/30 text-center shadow-lg">
                <div className="flex justify-center mb-4">
                  <div className="bg-yellow-500 rounded-full p-3">
                    <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-yellow-300 mb-2">🎉 Parabéns! 🎉</h2>
                <p className="text-xl mb-4 text-white">{result.message}</p>
                <div className="bg-yellow-900/30 rounded-lg p-4 inline-block border border-yellow-700">
                  <p className="font-bold text-yellow-200">Números sorteados:</p>
                  <p className="text-2xl font-mono text-white">{result.drawnNumbers?.join(', ')}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1 text-gray-300">
                    Nome completo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      id="name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Digite seu nome"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1 text-gray-300">
                    E-mail
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="email"
                      value={userEmail}
                      onChange={(e) => setUserEmail(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="Digite seu e-mail"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-bold transition-all transform hover:scale-[1.02] ${
                    isLoading
                      ? 'bg-gray-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg'
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
                    `Comprar bilhete por R$ ${ticketPrice.toLocaleString('pt-BR')}`
                  )}
                </button>
              </form>
            )}

            {result && !result.isWinner && !qrCode && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300 text-center">
                {result.message}
              </div>
            )}

            {qrCode && (
              <div className="mt-6 bg-gradient-to-br from-gray-700/50 to-gray-800/50 rounded-xl p-5 border border-gray-600 shadow-lg">
                <h3 className="text-lg font-semibold mb-4 text-center text-white">Pagamento PIX</h3>
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-2 rounded-lg shadow-lg">
                    <Image 
                      src={`data:image/png;base64,${qrCode}`} 
                      alt="QR Code PIX" 
                      width={200} 
                      height={200} 
                      className="rounded-lg"
                    />
                  </div>
                </div>
                <p className="text-sm text-gray-300 mb-4 text-center">
                  Escaneie o QR Code ou copie o código PIX abaixo
                </p>
                <div className="flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={copyPaste || ''}
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-l-lg px-4 py-3 text-sm text-gray-300 truncate"
                  />
                  <button
                    id="copy-button"
                    onClick={copyToClipboard}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-4 py-3 rounded-r-lg font-medium transition-colors text-white"
                  >
                    Copiar
                  </button>
                </div>
                <div className="mt-3 text-center">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/50 text-blue-300 border border-blue-700">
                    <svg className="mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ID do bilhete: {ticketId}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Últimos vencedores */}
          <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-white">Últimos Vencedores</h2>
              <div className="bg-gradient-to-r from-green-600 to-emerald-700 text-white px-3 py-1 rounded-full text-sm font-bold">
                Ao vivo
              </div>
            </div>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {winners.length > 0 ? (
                winners.map((winner, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-700/50 to-gray-800/50 p-4 rounded-xl border border-gray-600 hover:border-yellow-500/50 transition-all">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-yellow-400 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {winner.userName}
                        </h3>
                        <p className="text-sm text-gray-300">{winner.prizeName}</p>
                      </div>
                      <span className="text-xs bg-gradient-to-r from-green-600 to-emerald-700 text-white px-2 py-1 rounded-full">
                        Vencedor
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-gray-400 flex justify-between">
                      <p>Números: {winner.drawnNumbers}</p>
                      <p>{new Date(winner.prizeDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="bg-gray-700/50 rounded-full p-3 inline-block mb-3">
                    <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-400">
                    Nenhum vencedor registrado ainda
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Rifa Premiada. Todos os direitos reservados.</p>
          <p className="mt-1">Jogue com responsabilidade. Sorteios sujeitos a regulamentação.</p>
        </footer>
      </main>
    </div>
  );
}