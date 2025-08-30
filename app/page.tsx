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
      alert("Código PIX copiado para a área de transferência!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
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

            {/* Contador regressivo */}
            <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-lg p-4 mb-6 border border-purple-500/30">
              <h2 className="text-lg font-semibold mb-2 text-center">Próximo sorteio em:</h2>
              <div className="flex justify-center space-x-2">
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg py-2 px-3">
                    <span className="text-2xl font-bold">{countdown.days.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Dias</span>
                </div>
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg py-2 px-3">
                    <span className="text-2xl font-bold">{countdown.hours.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Horas</span>
                </div>
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg py-2 px-3">
                    <span className="text-2xl font-bold">{countdown.minutes.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Minutos</span>
                </div>
                <div className="text-center">
                  <div className="bg-gray-700 rounded-lg py-2 px-3">
                    <span className="text-2xl font-bold">{countdown.seconds.toString().padStart(2, '0')}</span>
                  </div>
                  <span className="text-xs text-gray-400">Segundos</span>
                </div>
              </div>
            </div>

            {result?.isWinner ? (
              <div className="bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 rounded-lg p-6 mb-6 border border-yellow-500/30 text-center">
                <h2 className="text-2xl font-bold text-yellow-300 mb-2">🎉 Parabéns! 🎉</h2>
                <p className="text-xl mb-4">{result.message}</p>
                <div className="bg-yellow-900/30 rounded-lg p-4 inline-block">
                  <p className="font-bold">Números sorteados:</p>
                  <p className="text-2xl font-mono">{result.drawnNumbers?.join(', ')}</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite seu nome"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    E-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Digite seu e-mail"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 rounded-lg font-bold transition-all ${
                    isLoading
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
                    `Comprar bilhete por R$ ${ticketPrice.toLocaleString('pt-BR')}`
                  )}
                </button>
              </form>
            )}

            {result && !result.isWinner && !qrCode && (
              <div className="mt-4 p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-300">
                {result.message}
              </div>
            )}

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
        </div>

        <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Rifa Premiada. Todos os direitos reservados.</p>
          <p className="mt-1">Jogue com responsabilidade. Sorteios sujeitos a regulamentação.</p>
        </footer>
      </main>
    </div>
  );
}