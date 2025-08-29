"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Winner = {
  userName: string;
  prizeDate: string;
};

export default function Home() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [result, setResult] = useState<{ isWinner: boolean; message: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [winners, setWinners] = useState<Winner[]>([]);

  useEffect(() => {
    fetchWinners();
  }, []);

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
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start max-w-4xl w-full">
        <div className="text-center w-full">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Rifa Premiada
          </h1>
          <p className="text-lg md:text-xl text-gray-300">
            Compre seu bilhete e concorra a prêmios incríveis!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          {/* Informações da rifa */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
            <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden mb-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 w-full h-full flex items-center justify-center">
                <span className="text-4xl font-bold">PRÊMIO</span>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">Prêmio Especial</h2>
            <p className="text-gray-300 mb-4">
              Concorra a um prêmio incrível! Cada bilhete custa apenas R$ 5,00.
            </p>
            <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 p-4 rounded-lg">
              <p className="text-center font-bold text-lg">Valor do bilhete: R$ 5,00</p>
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
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Processando..." : "Comprar Bilhete"}
              </button>
            </form>

            {/* Resultado do sorteio */}
            {result && (
              <div className={`mt-6 p-4 rounded-lg text-center ${result.isWinner ? 'bg-gradient-to-r from-green-600 to-emerald-700' : 'bg-gradient-to-r from-red-600 to-rose-700'}`}>
                <p className="text-2xl font-bold mb-2">
                  {result.isWinner ? "🎉 Parabéns! 🎉" : "😢 Não foi dessa vez 😢"}
                </p>
                <p>{result.message}</p>
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
                <div key={index} className="bg-gradient-to-br from-yellow-600/30 to-yellow-800/30 border border-yellow-600/50 rounded-lg p-4 text-center">
                  <p className="font-bold">{winner.userName}</p>
                  <p className="text-sm text-gray-300">
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