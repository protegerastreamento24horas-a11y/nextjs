"use client";

import { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { useRouter } from "next/navigation";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

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
  ticketsLast7Days: { date: string; count: number }[];
};

export default function AdminPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [stats, setStats] = useState<Stats>({ 
    totalTickets: 0, 
    totalWinners: 0,
    ticketsLast7Days: []
  });
  const [winningChance, setWinningChance] = useState(100);
  const [newWinningChance, setNewWinningChance] = useState(100);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<{username: string, role: string} | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
    fetchData();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return;
      }

      const response = await fetch('/api/admin/auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        router.push('/admin/login');
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Erro na autenticação:", error);
      router.push('/admin/login');
    }
  };

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
      
      // Dados para o gráfico dos últimos 7 dias
      const ticketsLast7Days = getLast7DaysTickets(ticketsData);
      
      setStats({ totalTickets, totalWinners, ticketsLast7Days });
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLast7DaysTickets = (tickets: Ticket[]) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const count = tickets.filter(ticket => {
        const ticketDate = new Date(ticket.purchaseDate);
        const ticketDateString = ticketDate.toISOString().split('T')[0];
        return ticketDateString === dateString;
      }).length;
      
      last7Days.push({
        date: dateString,
        count
      });
    }
    
    return last7Days;
  };

  const updateWinningChance = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({ winningChance: newWinningChance }),
      });
      
      if (response.ok) {
        setWinningChance(newWinningChance);
        alert(`Chance de vitória atualizada para 1 em ${newWinningChance}`);
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao atualizar a chance de vitória');
      }
    } catch (error) {
      console.error("Erro ao atualizar chance de vitória:", error);
      alert('Erro ao atualizar a chance de vitória');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // Dados para o gráfico de barras
  const barChartData = {
    labels: stats.ticketsLast7Days.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('pt-BR', { weekday: 'short' });
    }),
    datasets: [
      {
        label: 'Bilhetes Vendidos',
        data: stats.ticketsLast7Days.map(item => item.count),
        backgroundColor: 'rgba(147, 51, 234, 0.5)',
        borderColor: 'rgba(147, 51, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Dados para o gráfico de pizza
  const pieChartData = {
    labels: ['Bilhetes Vendidos', 'Prêmios Entregues'],
    datasets: [
      {
        data: [stats.totalTickets, stats.totalWinners],
        backgroundColor: [
          'rgba(147, 51, 234, 0.5)',
          'rgba(22, 163, 74, 0.5)',
        ],
        borderColor: [
          'rgba(147, 51, 234, 1)',
          'rgba(22, 163, 74, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Painel Administrativo - Rifa Premiada
          </h1>
          <p className="text-gray-400 mt-2">Gerencie sua rifa e acompanhe as estatísticas</p>
        </header>

        {/* Navegação por abas */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'dashboard' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'tickets' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('tickets')}
          >
            Bilhetes
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'winners' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('winners')}
          >
            Vencedores
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'settings' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('settings')}
          >
            Configurações
          </button>
        </div>

        {activeTab === 'dashboard' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300">
                <h3 className="text-lg font-semibold mb-2">Bilhetes Vendidos</h3>
                <p className="text-3xl font-bold">{stats.totalTickets}</p>
                <p className="text-blue-200 text-sm mt-1">Total acumulado</p>
              </div>
              
              <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300">
                <h3 className="text-lg font-semibold mb-2">Prêmios Entregues</h3>
                <p className="text-3xl font-bold">{stats.totalWinners}</p>
                <p className="text-green-200 text-sm mt-1">Total de vencedores</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-xl p-6 shadow-lg transform hover:scale-105 transition duration-300">
                <h3 className="text-lg font-semibold mb-2">Chance de Vitória</h3>
                <p className="text-3xl font-bold">1 em {winningChance}</p>
                <p className="text-purple-200 text-sm mt-1">Probabilidade atual</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Gráfico de barras - Bilhetes nos últimos 7 dias */}
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Bilhetes Vendidos (Últimos 7 Dias)</h2>
                <div className="h-80">
                  <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>

              {/* Gráfico de pizza - Distribuição */}
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
                <h2 className="text-2xl font-bold mb-4">Distribuição</h2>
                <div className="h-80">
                  <Pie data={pieChartData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
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
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Nome</th>
                      <th className="py-3 px-4 text-left">E-mail</th>
                      <th className="py-3 px-4 text-left">Data</th>
                      <th className="py-3 px-4 text-left">Resultado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => (
                      <tr key={ticket.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4 text-sm text-gray-400">{ticket.id.substring(0, 8)}...</td>
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
        )}

        {activeTab === 'winners' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Vencedores</h2>
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
                      <th className="py-3 px-4 text-left">ID</th>
                      <th className="py-3 px-4 text-left">Nome</th>
                      <th className="py-3 px-4 text-left">E-mail</th>
                      <th className="py-3 px-4 text-left">Data do Prêmio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map((winner) => (
                      <tr key={winner.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4 text-sm text-gray-400">{winner.id.substring(0, 8)}...</td>
                        <td className="py-3 px-4">{winner.userName}</td>
                        <td className="py-3 px-4">{winner.userEmail || "-"}</td>
                        <td className="py-3 px-4">
                          {new Date(winner.prizeDate).toLocaleDateString("pt-BR")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Configurações do Sistema</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Chance de Vitória</h3>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <p className="mb-4 text-gray-300">
                    Configure a probabilidade de um usuário ganhar ao comprar um bilhete.
                  </p>
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
                  <div className="mt-4 p-3 bg-gray-700/50 rounded-lg">
                    <p className="text-sm">
                      <span className="font-bold">Chance atual:</span> 1 em {winningChance} ({(100/winningChance).toFixed(2)}%)
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Informações do Sistema</h3>
                <div className="space-y-4">
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Tecnologias Utilizadas</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Next.js 14 (App Router)</li>
                      <li>• TypeScript</li>
                      <li>• Tailwind CSS</li>
                      <li>• Prisma ORM</li>
                      <li>• PostgreSQL (Supabase)</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Estatísticas do Sistema</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Total de bilhetes: {stats.totalTickets}</li>
                      <li>• Total de vencedores: {stats.totalWinners}</li>
                      <li>• Taxa de vitória: {stats.totalTickets > 0 ? ((stats.totalWinners/stats.totalTickets)*100).toFixed(2) : '0.00'}%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}