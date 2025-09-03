"use client";

import { useState } from 'react';

export default function Home() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [ticketCount, setTicketCount] = useState(1);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [purchaseResult, setPurchaseResult] = useState<{success: boolean; message: string} | null>(null);

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPurchasing(true);
    setPurchaseResult(null);

    try {
      const response = await fetch('/api/comprar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName,
          userEmail,
          ticketCount,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPurchaseResult({
          success: true,
          message: `Compra realizada com sucesso! ID do pedido: ${data.ticketId}`,
        });
      } else {
        setPurchaseResult({
          success: false,
          message: data.error || 'Erro ao realizar a compra',
        });
      }
    } catch (error) {
      setPurchaseResult({
        success: false,
        message: 'Erro de conexão. Tente novamente.',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Participe da Nossa Rifa</h2>
        <p className="text-gray-600 mb-6">
          Compre seus bilhetes e concorra a prêmios incríveis! Cada bilhete custa R$ 10,00.
        </p>
        
        <form onSubmit={handlePurchase} className="space-y-4">
          <div>
            <label htmlFor="userName" className="block text-sm font-medium text-gray-700">
              Nome Completo
            </label>
            <input
              type="text"
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
              required
            />
          </div>
          
          <div>
            <label htmlFor="ticketCount" className="block text-sm font-medium text-gray-700">
              Quantidade de Bilhetes
            </label>
            <select
              id="ticketCount"
              value={ticketCount}
              onChange={(e) => setTicketCount(Number(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
            >
              {[1, 2, 3, 4, 5, 10, 15, 20].map((count) => (
                <option key={count} value={count}>
                  {count} bilhete{count > 1 ? 's' : ''}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex items-center">
            <button
              type="submit"
              disabled={isPurchasing}
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isPurchasing ? 'Processando...' : 'Comprar Bilhetes'}
            </button>
            <span className="ml-4 text-lg font-semibold text-gray-700">
              Total: R$ {(ticketCount * 10).toFixed(2)}
            </span>
          </div>
        </form>
        
        {purchaseResult && (
          <div className={`mt-4 p-4 rounded-md ${purchaseResult.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <p className={purchaseResult.success ? 'font-medium' : 'font-medium'}>
              {purchaseResult.message}
            </p>
          </div>
        )}
      </div>
      
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Como funciona?</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Escolha a quantidade de bilhetes que deseja</li>
          <li>Preencha seus dados e realize o pagamento via PIX</li>
          <li>Aguardar o sorteio dos números vencedores</li>
          <li>Se seu número for sorteado, você será contatado por email</li>
        </ul>
      </div>
    </div>
  );
}