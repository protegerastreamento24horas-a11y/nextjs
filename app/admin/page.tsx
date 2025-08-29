"use client";

import { useState, useEffect } from "react";

type Ticket = {
  id: string;
  userName: string;
  userEmail: string | null;
  purchaseDate: string;
  isWinner: boolean;
};

type Winner = {
  id: string;
  userName: string;
  userEmail: string | null;
  prizeDate: string;
};

type Stats = {
  totalTickets: number;
  totalWinners: number;
};

export default function AdminPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [stats, setStats] = useState<Stats>({ totalTickets: 0, totalWinners: 0 });
  const [winningChance, setWinningChance] = useState(100);
  const [newWinningChance, setNewWinningChance] = useState(100);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
    // Carregar a chance atual de vitória
    const currentChance = parseInt(process.env.WINNING_CHANCE || '100');
    setWinningChance(currentChance);
    setNewWinningChance(currentChance);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Buscar bilhetes
      const ticketsResponse = await fetch('/api/admin/tickets');
      const ticketsData: Ticket[] = await ticketsResponse.json();
      setTickets(ticketsData);
      
      // Buscar vencedores
      const winnersResponse = await fetch('/api/admin/winners');
      const winnersData: Winner[] = await winnersResponse.json();
      setWinners(winnersData);
      
      // Calcular estatísticas
      const totalTickets = ticketsData.length;
      const totalWinners = winnersData.length;
      
      setStats({ totalTickets, totalWinners });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateWinningChance = () => {
    // Em uma implementação real, isso seria enviado para uma API
    alert(`Em uma implementação real, a chance de vitória seria atualizada para 1 em ${newWinningChance}`);
    // Para demonstração, vamos apenas atualizar o estado local
    setWinningChance(newWinningChance);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Painel Administrativo - Rifa Premiada
          </h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Bilhetes Vendidos</h3>
            <p className="text-3xl font-bold">{stats.totalTickets}</p>
          </div>
          
          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Prêmios Entregues</h3>
            <p className="text-3xl font-bold">{stats.totalWinners}</p>
          </div>
          
          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Chance de Vitória</h3>
            <p className="text-3xl font-bold">1 em {winningChance}</p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Configurar Chance de Vitória</h2>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="winningChance" className="block mb-2">
                Chance de vitória (1 em X)
              </label>
              <input
                type="number"
                id="winningChance"
                value={newWinningChance}
                onChange={(e) => setNewWinningChance(parseInt(e.target.value) || 100)}
                min="1"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={updateWinningChance}
                className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-6 rounded-lg transition duration-300"
              >
                Atualizar
              </button>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Bilhetes Comprados</h2>
            <button
              onClick={fetchData}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Atualizar
            </button>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando dados...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="py-3 px-4 text-left">Nome</th>
                    <th className="py-3 px-4 text-left">E-mail</th>
                    <th className="py-3 px-4 text-left">Data</th>
                    <th className="py-3 px-4 text-left">Resultado</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 px-4">{ticket.userName}</td>
                      <td className="py-3 px-4">{ticket.userEmail || "-"}</td>
                      <td className="py-3 px-4">
                        {new Date(ticket.purchaseDate).toLocaleDateString("pt-BR")}
                      </td>
                      <td className="py-3 px-4">
                        {ticket.isWinner ? (
                          <span className="bg-green-600/30 text-green-400 px-3 py-1 rounded-full text-sm">
                            Vencedor
                          </span>
                        ) : (
                          <span className="bg-red-600/30 text-red-400 px-3 py-1 rounded-full text-sm">
                            Não sorteado
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}