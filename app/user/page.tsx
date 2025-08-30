"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Ticket = {
  id: string;
  purchaseDate: string;
  numbers: string;
  prizeValue: number;
  status: 'pending' | 'won' | 'lost';
};

export default function UserArea() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento de dados do usuário
    const fetchUserTickets = async () => {
      try {
        // Em uma implementação real, isso viria de uma API
        const mockTickets: Ticket[] = [
          {
            id: "TICKET-001",
            purchaseDate: "2025-05-15",
            numbers: "1234, 5678, 9012",
            prizeValue: 10000,
            status: "pending"
          },
          {
            id: "TICKET-002",
            purchaseDate: "2025-05-10",
            numbers: "2345, 6789, 0123",
            prizeValue: 5000,
            status: "lost"
          },
          {
            id: "TICKET-003",
            purchaseDate: "2025-05-05",
            numbers: "3456, 7890, 1234",
            prizeValue: 2500,
            status: "won"
          }
        ];
        
        setTickets(mockTickets);
      } catch (error) {
        console.error("Erro ao carregar tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTickets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'won': return 'bg-green-900/50 text-green-300';
      case 'lost': return 'bg-red-900/50 text-red-300';
      default: return 'bg-yellow-900/50 text-yellow-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'won': return 'Ganhou';
      case 'lost': return 'Perdeu';
      default: return 'Pendente';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Minha Área</h1>
          <p className="text-gray-400">Veja seu histórico de bilhetes e prêmios</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Informações do usuário */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
              <div className="flex items-center mb-6">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h2 className="text-xl font-bold text-white">Nome do Usuário</h2>
                  <p className="text-gray-400">usuário@exemplo.com</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Total de bilhetes:</span>
                  <span className="text-white font-bold">{tickets.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Bilhetes vencedores:</span>
                  <span className="text-green-400 font-bold">
                    {tickets.filter(t => t.status === 'won').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Prêmios totais:</span>
                  <span className="text-yellow-400 font-bold">
                    R$ {tickets
                      .filter(t => t.status === 'won')
                      .reduce((sum, ticket) => sum + ticket.prizeValue, 0)
                      .toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
              
              <div className="mt-6">
                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg transition-colors">
                  Editar perfil
                </button>
              </div>
            </div>
          </div>

          {/* Histórico de bilhetes */}
          <div className="lg:col-span-2">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Histórico de Bilhetes</h2>
                <Link 
                  href="/" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all"
                >
                  Comprar novo bilhete
                </Link>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                  <p className="text-gray-400 mt-2">Carregando bilhetes...</p>
                </div>
              ) : tickets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">Você ainda não comprou nenhum bilhete.</p>
                  <Link 
                    href="/" 
                    className="inline-block mt-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all"
                  >
                    Comprar seu primeiro bilhete
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {tickets.map((ticket) => (
                    <div key={ticket.id} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-white">Bilhete #{ticket.id}</h3>
                          <p className="text-sm text-gray-300 mt-1">
                            Comprado em: {new Date(ticket.purchaseDate).toLocaleDateString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-300">
                            Números: {ticket.numbers}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(ticket.status)}`}>
                            {getStatusText(ticket.status)}
                          </span>
                          {ticket.status === 'won' && (
                            <p className="text-yellow-400 font-bold mt-1">
                              R$ {ticket.prizeValue.toLocaleString('pt-BR')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}