"use client";

import { useState, useEffect, useRef } from "react";
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
import Image from "next/image";

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
  drawnNumbers: string | null;
};

type Winner = {
  id: string;
  userName: string;
  userEmail: string | null;
  prizeDate: string;
  drawnNumbers: string;
};

type Stats = {
  totalTickets: number;
  totalWinners: number;
  ticketsLast7Days: { date: string; count: number }[];
};

type RaffleConfig = {
  id: string;
  ticketPrice: number;
  prizeValue: number;
  maxNumber: number;
  winningNumbers: string;
  autoDrawnNumbers: number;
  winningProbability: number;
  isActive: boolean;
};

export default function AdminPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [stats, setStats] = useState<Stats>({ 
    totalTickets: 0, 
    totalWinners: 0,
    ticketsLast7Days: []
  });
  const [raffleConfig, setRaffleConfig] = useState<RaffleConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState<{username: string, role: string} | null>(null);
  const [bannerImage, setBannerImage] = useState<string>('/banner-bg.svg');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Form states for raffle config
  const [ticketPrice, setTicketPrice] = useState("1000");
  const [prizeValue, setPrizeValue] = useState("10000");
  const [maxNumber, setMaxNumber] = useState("10000");
  const [winningNumbers, setWinningNumbers] = useState("100,88,14");
  const [autoDrawnNumbers, setAutoDrawnNumbers] = useState("1");
  const [winningProbability, setWinningProbability] = useState("100");
  const [configError, setConfigError] = useState("");

  useEffect(() => {
    checkAuth();
    fetchData();
    fetchRaffleConfig();
    fetchBannerImage();
  }, []);

  const checkAuth = async () => {
    try {
      // Verificar token no localStorage primeiro
      let token = localStorage.getItem('admin_token');
      
      // Se não encontrar no localStorage, redirecionar para login
      if (!token) {
        router.push('/admin/login');
        return;
      }

      // Verificar se o token é válido
      const response = await fetch('/api/admin/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Se a verificação falhar, limpar tokens e redirecionar para login
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/admin/login?error=invalid_token');
        return;
      }

      const data = await response.json();
      setUser(data.user);
    } catch (error) {
      console.error("Erro na autenticação:", error);
      // Em caso de erro, limpar tokens e redirecionar para login
      localStorage.removeItem('admin_token');
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/admin/login?error=auth_failed');
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

  const fetchRaffleConfig = async () => {
    try {
      const token = localStorage.getItem('admin_token') || getCookie('admin_token');
      const response = await fetch('/api/admin/raffle-config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const config: RaffleConfig = await response.json();
        setRaffleConfig(config);
        setTicketPrice(config.ticketPrice.toString());
        setPrizeValue(config.prizeValue.toString());
        setMaxNumber(config.maxNumber.toString());
        setWinningNumbers(config.winningNumbers);
        setAutoDrawnNumbers(config.autoDrawnNumbers.toString());
        setWinningProbability(config.winningProbability.toString());
      } else if (response.status === 401) {
        // Token inválido, redirecionar para login
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/admin/login?error=invalid_token');
      }
    } catch (error) {
      console.error("Erro ao buscar configuração da rifa:", error);
    }
  };

  const fetchBannerImage = async () => {
    try {
      const token = localStorage.getItem('admin_token') || getCookie('admin_token');
      const response = await fetch('/api/admin/banner', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setBannerImage(data.imageUrl);
      } else if (response.status === 401) {
        // Token inválido, redirecionar para login
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/admin/login?error=invalid_token');
      }
    } catch (error) {
      console.error("Erro ao buscar imagem do banner:", error);
    }
  };

  // Função auxiliar para obter cookies
  const getCookie = (name: string) => {
    const cookies = document.cookie.split(';').map(cookie => cookie.trim());
    const cookie = cookies.find(cookie => cookie.startsWith(`${name}=`));
    return cookie ? cookie.split('=')[1] : null;
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

  const updateRaffleConfig = async () => {
    try {
      setConfigError("");
      
      const token = localStorage.getItem('admin_token') || getCookie('admin_token');
      const response = await fetch('/api/admin/raffle-config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
          ticketPrice: parseFloat(ticketPrice),
          prizeValue: parseFloat(prizeValue),
          maxNumber: parseInt(maxNumber),
          winningNumbers,
          autoDrawnNumbers: parseInt(autoDrawnNumbers),
          winningProbability: parseInt(winningProbability)
        }),
      });
      
      if (response.ok) {
        const updatedConfig = await response.json();
        setRaffleConfig(updatedConfig);
        alert('Configuração da rifa atualizada com sucesso!');
      } else if (response.status === 401) {
        // Token inválido, redirecionar para login
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/admin/login');
      } else {
        const data = await response.json();
        setConfigError(data.error || 'Erro ao atualizar a configuração da rifa');
      }
    } catch (error) {
      console.error("Erro ao atualizar configuração da rifa:", error);
      setConfigError('Erro ao atualizar a configuração da rifa');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    document.cookie = "admin_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push('/admin/login');
  };

  const handleBannerUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('admin_token') || getCookie('admin_token');
      const response = await fetch('/api/admin/banner', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setUploadMessage('Banner atualizado com sucesso!');
        setBannerImage(data.imageUrl);
        // Limpar o input de arquivo
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else if (response.status === 401) {
        // Token inválido, redirecionar para login
        localStorage.removeItem('admin_token');
        document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        router.push('/admin/login');
      } else {
        setUploadMessage(data.error || 'Erro ao atualizar o banner');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
      setUploadMessage('Erro ao fazer upload do banner');
    } finally {
      setIsUploading(false);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
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

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                Painel Administrativo - Rifa Premiada
              </h1>
              <p className="text-gray-400 mt-1">Bem-vindo, {user.username}!</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg transition duration-300"
            >
              Sair
            </button>
          </div>
        </header>

        {/* Navegação por abas */}
        <div className="flex flex-wrap border-b border-gray-700 mb-6">
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
            className={`py-2 px-4 font-medium ${activeTab === 'prizes' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('prizes')}
          >
            Prêmios
          </button>
          <button
            className={`py-2 px-4 font-medium ${activeTab === 'raffle-config' ? 'border-b-2 border-purple-500 text-purple-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('raffle-config')}
          >
            Configurar Rifa
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
                <h3 className="text-lg font-semibold mb-2">Preço do Bilhete</h3>
                <p className="text-3xl font-bold">
                  {raffleConfig ? `R$ ${raffleConfig.ticketPrice.toFixed(2)}` : 'Carregando...'}
                </p>
                <p className="text-purple-200 text-sm mt-1">Por bilhete</p>
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
                      <th className="py-3 px-4 text-left">Números Sorteados</th>
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
                          {ticket.drawnNumbers || "-"}
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
                      <th className="py-3 px-4 text-left">Números Sorteados</th>
                      <th className="py-3 px-4 text-left">Data do Prêmio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {winners.map((winner) => (
                      <tr key={winner.id} className="border-b border-gray-700 hover:bg-gray-750">
                        <td className="py-3 px-4 text-sm text-gray-400">{winner.id.substring(0, 8)}...</td>
                        <td className="py-3 px-4">{winner.userName}</td>
                        <td className="py-3 px-4">{winner.userEmail || "-"}</td>
                        <td className="py-3 px-4 font-bold text-yellow-400">{winner.drawnNumbers}</td>
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

        {activeTab === 'prizes' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Gerenciamento de Prêmios</h2>
              <button
                onClick={() => router.push('/admin/prizes')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Gerenciar Prêmios
              </button>
            </div>
            
            <div className="text-center py-8 text-gray-400">
              <p>Clique no botão acima para gerenciar os prêmios disponíveis para as rifas.</p>
              <p className="mt-2">Você pode adicionar, editar e excluir prêmios, além de definir sua raridade e valor.</p>
            </div>
          </div>
        )}

        {activeTab === 'raffle-config' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Configuração da Rifa</h2>
            
            {configError && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-6 text-red-300">
                {configError}
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Parâmetros da Rifa</h3>
                <div className="bg-gray-750 p-4 rounded-lg space-y-4">
                  <div>
                    <label htmlFor="ticketPrice" className="block mb-2">
                      Preço do Bilhete (R$)
                    </label>
                    <input
                      type="number"
                      id="ticketPrice"
                      value={ticketPrice}
                      onChange={(e) => setTicketPrice(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="prizeValue" className="block mb-2">
                      Valor do Prêmio (R$)
                    </label>
                    <input
                      type="number"
                      id="prizeValue"
                      value={prizeValue}
                      onChange={(e) => setPrizeValue(e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="maxNumber" className="block mb-2">
                      Número Máximo para Sorteio
                    </label>
                    <input
                      type="number"
                      id="maxNumber"
                      value={maxNumber}
                      onChange={(e) => setMaxNumber(e.target.value)}
                      min="1"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="winningNumbers" className="block mb-2">
                      Números Premiados (separados por vírgula)
                    </label>
                    <input
                      type="text"
                      id="winningNumbers"
                      value={winningNumbers}
                      onChange={(e) => setWinningNumbers(e.target.value)}
                      placeholder="Ex: 100,88,14"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      Exemplo: 100,88,14 - Os números devem estar entre 1 e {maxNumber || '10000'}
                    </p>
                  </div>
                  
                  <div>
                    <label htmlFor="autoDrawnNumbers" className="block mb-2">
                      Quantidade de Números Sorteados Automaticamente
                    </label>
                    <input
                      type="number"
                      id="autoDrawnNumbers"
                      value={autoDrawnNumbers}
                      onChange={(e) => setAutoDrawnNumbers(e.target.value)}
                      min="1"
                      max={maxNumber || 10000}
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="winningProbability" className="block mb-2">
                      Probabilidade de Ganhar (0-100%)
                    </label>
                    <input
                      type="number"
                      id="winningProbability"
                      value={winningProbability}
                      onChange={(e) => setWinningProbability(e.target.value)}
                      min="0"
                      max="100"
                      className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    />
                    <p className="text-sm text-gray-400 mt-1">
                      0% = Nenhum número premiado será sorteado<br />
                      100% = Probabilidade normal de acordo com os números
                    </p>
                  </div>
                  
                  <button
                    onClick={updateRaffleConfig}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 mt-4"
                  >
                    Atualizar Configuração
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Informações Atuais</h3>
                <div className="space-y-4">
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Configuração Atual</h4>
                    {raffleConfig ? (
                      <ul className="text-sm text-gray-300 space-y-2">
                        <li><span className="font-medium">Preço do Bilhete:</span> R$ {raffleConfig.ticketPrice.toFixed(2)}</li>
                        <li><span className="font-medium">Valor do Prêmio:</span> R$ {raffleConfig.prizeValue.toFixed(2)}</li>
                        <li><span className="font-medium">Número Máximo:</span> {raffleConfig.maxNumber}</li>
                        <li><span className="font-medium">Números Premiados:</span> {raffleConfig.winningNumbers}</li>
                        <li><span className="font-medium">Números Sorteados:</span> {raffleConfig.autoDrawnNumbers}</li>
                        <li><span className="font-medium">Probabilidade:</span> {raffleConfig.winningProbability}%</li>
                      </ul>
                    ) : (
                      <p className="text-gray-400">Carregando configuração...</p>
                    )}
                  </div>
                  
                  <div className="bg-gray-750 p-4 rounded-lg">
                    <h4 className="font-bold mb-2">Como Funciona</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Usuários pagam R$ {raffleConfig?.ticketPrice.toFixed(2) || '1000.00'} por bilhete</li>
                      <li>• Sistema sorteia {raffleConfig?.autoDrawnNumbers || '1'} número(s) entre 1 e {raffleConfig?.maxNumber || '10000'}</li>
                      <li>• Se o número sorteado estiver entre os premiados E passar na probabilidade, usuário ganha</li>
                      <li>• Probabilidade de ganhar: {raffleConfig?.winningProbability || '100'}%</li>
                      <li>• Valor do prêmio: R$ {raffleConfig?.prizeValue.toFixed(2) || '10000.00'}</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Configurações do Sistema</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">Banner do Site</h3>
                <div className="bg-gray-750 p-4 rounded-lg">
                  <div className="mb-4">
                    <h4 className="font-bold mb-2">Banner Atual</h4>
                    <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4">
                      <Image
                        src={bannerImage}
                        alt="Banner atual"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-bold mb-2">Atualizar Banner</h4>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleBannerUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      onClick={triggerFileInput}
                      disabled={isUploading}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isUploading 
                          ? 'bg-gray-600 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                      }`}
                    >
                      {isUploading ? 'Enviando...' : 'Selecionar Imagem'}
                    </button>
                    
                    {uploadMessage && (
                      <div className={`mt-2 p-2 rounded text-center text-sm ${
                        uploadMessage.includes('sucesso') 
                          ? 'bg-green-900/50 text-green-300' 
                          : 'bg-red-900/50 text-red-300'
                      }`}>
                        {uploadMessage}
                      </div>
                    )}
                    
                    <p className="text-xs text-gray-400 mt-2">
                      Formatos suportados: JPG, PNG, GIF. Tamanho máximo: 5MB.
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-750 p-4 rounded-lg mt-6">
                  <h4 className="font-bold mb-2">Informações do Sistema</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Next.js 14 (App Router)</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Prisma ORM</li>
                    <li>• PostgreSQL (Supabase)</li>
                  </ul>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">Sobre a Rifa</h3>
                <div className="bg-gray-750 p-4 rounded-lg mb-6">
                  <p className="text-sm text-gray-300">
                    Esta rifa utiliza um sistema de sorteio automático onde cada bilhete 
                    comprado participa de um sorteio com números entre 1 e {raffleConfig?.maxNumber || '10000'}. 
                    Os números premiados são definidos previamente na configuração da rifa.
                  </p>
                  <p className="text-sm text-gray-300 mt-2">
                    O sistema é completamente transparente e os resultados são registrados 
                    em tempo real no banco de dados. A probabilidade de ganhar pode ser
                    ajustada entre 0% e 100%.
                  </p>
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
        )}
      </div>
    </div>
  );
}