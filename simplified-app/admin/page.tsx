"use client";

import { useState, useEffect } from 'react';

type Ticket = {
  id: string;
  userName: string;
  userEmail: string;
  purchaseDate: string;
  isWinner: boolean;
};

export default function AdminPanel() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [winnerCount, setWinnerCount] = useState(0);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/comprar');
      const data = await response.json();
      setTickets(data);
      setWinnerCount(data.filter((ticket: Ticket) => ticket.isWinner).length);
    } catch (error) {
      console.error('Erro ao buscar bilhetes:', error);
    } finally {
      setLoading(false);
    }
  };

  const drawWinners = () => {
    if (tickets.length === 0) return;

    // Criar uma cópia dos bilhetes para não modificar o original
    const updatedTickets = [...tickets];
    
    // Selecionar aleatoriamente alguns bilhetes como vencedores
    const winnersToSelect = Math.min(3, updatedTickets.length); // Máximo de 3 vencedores
    const selectedIndexes = new Set<number>();
    
    while (selectedIndexes.size < winnersToSelect) {
      const randomIndex = Math.floor(Math.random() * updatedTickets.length);
      if (!selectedIndexes.has(randomIndex)) {
        selectedIndexes.add(randomIndex);
        updatedTickets[randomIndex] = {
          ...updatedTickets[randomIndex],
          isWinner: true
        };
      }
    }
    
    setTickets(updatedTickets);
    setWinnerCount(Array.from(selectedIndexes).length);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Painel Administrativo</h2>
          <button
            onClick={drawWinners}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Realizar Sorteio
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800">Total de Bilhetes</h3>
            <p className="text-3xl font-bold text-blue-600">{tickets.length}</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800">Bilhetes Vencedores</h3>
            <p className="text-3xl font-bold text-green-600">{winnerCount}</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-800">Participantes</h3>
            <p className="text-3xl font-bold text-purple-600">
              {new Set(tickets.map(t => t.userEmail)).size}
            </p>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Participante
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.id.substring(0, 12)}...
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {ticket.userName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {ticket.userEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(ticket.purchaseDate).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      ticket.isWinner 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {ticket.isWinner ? 'Vencedor' : 'Participante'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}