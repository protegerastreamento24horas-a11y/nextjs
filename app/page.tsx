"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Winner = {
  userName: string;
  prizeDate: string;
  prizeName: string;
  drawnNumber: number;
};

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [result, setResult] = useState<{ isWinner: boolean; message: string; drawnNumber?: number; prize?: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [ticketPrice, setTicketPrice] = useState(1000); // Preço padrão R$ 1.000,00

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
      // Por enquanto, vamos manter o valor padrão
      setTicketPrice(1000);
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
      setWinners(data);
    } catch (error) {
      console.error("Erro ao buscar vencedores:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/comprar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userName, userEmail }),
      });

      const data = await response.json();
      setResult(data);
      // Atualizar a lista de vencedores após uma nova compra
      if (data.isWinner) {
        setTimeout(fetchWinners, 1000);
      }
    } catch (error) {
      console.error("Erro ao comprar bilhete:", error);
      setResult({
        isWinner: false,
        message: "Ocorreu um erro ao processar sua solicitação. Tente novamente."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-4 md:p-8 pb-20 gap-8 sm:p-20 bg-gradient-to-b from-purple-900 to-black text-white">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-6xl w-full">
        <div className="text-center w-full">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4 animate-pulse">
            Rifa Premiada
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-6">
            Compre seu bilhete e concorra a prêmios incríveis!
          </p>
        </div>

        {/* Contador regressivo */}
        <div className="w-full bg-gradient-to-r from-purple-800 to-indigo-900 rounded-2xl p-6 text-center shadow-xl border border-purple-700">
          <h2 className="text-2xl font-bold mb-4">Próximo Sorteio</h2>
          <div className="flex justify-center gap-2 md:gap-4">
            <div className="flex flex-col items-center">
              <div className="bg-black/30 rounded-lg p-2 md:p-4 w-16 md:w-20">
                <span className="text-2xl md:text-3xl font-bold">{countdown.days}</span>
              </div>
              <span className="text-xs md:text-sm mt-2 text-gray-300">Dias</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-black/30 rounded-lg p-2 md:p-4 w-16 md:w-20">
                <span className="text-2xl md:text-3xl font-bold">{countdown.hours}</span>
              </div>
              <span className="text-xs md:text-sm mt-2 text-gray-300">Horas</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-black/30 rounded-lg p-2 md:p-4 w-16 md:w-20">
                <span className="text-2xl md:text-3xl font-bold">{countdown.minutes}</span>
              </div>
              <span className="text-xs md:text-sm mt-2 text-gray-300">Minutos</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="bg-black/30 rounded-lg p-2 md:p-4 w-16 md:w-20">
                <span className="text-2xl md:text-3xl font-bold">{countdown.seconds}</span>
              </div>
              <span className="text-xs md:text-sm mt-2 text-gray-300">Segundos</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
          {/* Informações da rifa */}
          <div className="lg:col-span-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold">PRÊMIOS ESPECIAIS</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4">Como Funciona</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-400 mb-2">Mecânica da Rifa</h3>
                <ul className="text-sm space-y-1">
                  <li>• Cada bilhete custa R$ {ticketPrice.toFixed(2)}</li>
                  <li>• Pagamento feito via PIX</li>
                  <li>• Sistema sorteia um número entre 1 e 10.000</li>
                  <li>• Números premiados: 100, 88 e 14</li>
                </ul>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <h3 className="font-bold text-yellow-400 mb-2">Premiação</h3>
                <ul className="text-sm space-y-1">
                  <li>• Prêmios variados por raridade</li>
                  <li>• Smartphone premium</li>
                  <li>• Viagens nacionais</li>
                  <li>• Itens de alto valor</li>
                </ul>
              </div>
            </div>
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-4 rounded-lg">
              <p className="text-center font-bold text-lg">Valor do bilhete: R$ {ticketPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* Formulário de compra */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center">Comprar Bilhete</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-2 font-medium">
                  Nome completo
                </label>
                <input
                  type="text"
                  id="name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Seu nome"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 font-medium">
                  E-mail (opcional)
                </label>
                <input
                  type="email"
                  id="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="seu@email.com"
                />
              </div>
              <div className="bg-gray-700/50 p-3 rounded-lg text-sm">
                <p className="font-medium mb-1">Termos da Rifa:</p>
                <ul className="list-disc pl-5 space-y-1 text-gray-300">
                  <li>Cada bilhete custa R$ {ticketPrice.toFixed(2)}</li>
                  <li>Pagamento via PIX</li>
                  <li>Sorteio ocorre a cada 7 dias</li>
                  <li>100% seguro e transparente</li>
                  <li>Números premiados: 100, 88 e 14</li>
                </ul>
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processando..." : "Comprar Bilhete por R$ " + ticketPrice.toFixed(2)}
              </button>
            </form>

            {/* Resultado do sorteio */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg text-center animate-bounce ${result.isWinner ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-rose-700'}`}>
                <p className="text-2xl font-bold mb-2">
                  {result.isWinner ? "🎉 Parabéns! 🎉" : "😢 Não foi dessa vez 😢"}
                </p>
                <p>{result.message}</p>
                {result.drawnNumber !== undefined && (
                  <p className="mt-2 font-bold">Seu número sorteado: {result.drawnNumber}</p>
                )}
                {result.isWinner && result.prize && (
                  <div className="mt-4 p-3 bg-white/10 rounded-lg">
                    <p className="font-bold">Prêmio: {result.prize.name}</p>
                    <p className="text-sm">Valor estimado: R$ {result.prize.value.toFixed(2)}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Últimos vencedores */}
        <div className="w-full bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Últimos Vencedores</h2>
          {winners.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {winners.map((winner, index) => (
                <div key={index} className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border border-yellow-600/50 rounded-lg p-4 text-center transform hover:scale-105 transition duration-300">
                  <p className="font-bold">{winner.userName}</p>
                  <p className="text-sm text-gray-300">
                    Ganhou: {winner.prizeName}
                  </p>
                  <p className="text-sm font-bold text-yellow-300">
                    Número: {winner.drawnNumber}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Sorteado em {new Date(winner.prizeDate).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-400">Nenhum vencedor registrado ainda.</p>
          )}
        </div>
      </main>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center">
        <p className="text-gray-400">© 2024 Rifa Premiada. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}