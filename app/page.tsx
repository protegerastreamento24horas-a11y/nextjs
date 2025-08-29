"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

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
      setWinners(data);
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
      navigator.clipboard.writeText(copyPaste);
      alert("Código PIX copiado para a área de transferência!");
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

      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
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

        {/* Formulário de compra ou QR Code */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {qrCode ? "Pague com PIX" : "Comprar Bilhete"}
          </h2>
          
          {qrCode ? (
            <div className="text-center">
              <div className="bg-white p-4 rounded-lg inline-block">
                <img 
                  src={`data:image/png;base64,${qrCode}`} 
                  alt="QR Code para pagamento PIX" 
                  className="w-64 h-64"
                />
              </div>
              <p className="mt-4 text-sm text-gray-300">
                Aponte a câmera do seu celular para o QR Code acima ou copie o código abaixo:
              </p>
              <div className="mt-2 p-3 bg-gray-700 rounded-lg flex justify-between items-center">
                <span className="text-xs font-mono break-all">{copyPaste}</span>
                <button 
                  onClick={copyToClipboard}
                  className="ml-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
                >
                  Copiar
                </button>
              </div>
              <p className="mt-4 text-sm text-yellow-400">
                Após o pagamento, seu bilhete será automaticamente registrado e o sorteio será realizado!
              </p>
            </div>
          ) : (
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
          )}

          {/* Resultado do sorteio */}
          {result && (
            <div className={`mt-6 p-4 rounded-lg text-center animate-bounce ${result.isWinner ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-rose-700'}`}>
              <p className="text-2xl font-bold mb-2">
                {result.isWinner ? "🎉 Parabéns! 🎉" : "😢 Não foi dessa vez 😢"}
              </p>
              <p>{result.message}</p>
              {result.drawnNumbers && result.drawnNumbers.length > 0 && (
                <p className="mt-2 font-bold">Seus números sorteados: {result.drawnNumbers.join(', ')}</p>
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
                    Números: {winner.drawnNumbers}
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
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center mt-8">
        <p className="text-gray-400">© 2024 Rifa Premiada. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}