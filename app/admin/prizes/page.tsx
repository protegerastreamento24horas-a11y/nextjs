"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

type Prize = {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  value: number;
  rarity: number;
  isActive: boolean;
  createdAt: string;
};

export default function PrizesManagement() {
  const [prizes, setPrizes] = useState<Prize[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPrize, setEditingPrize] = useState<Prize | null>(null);
  const router = useRouter();

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [value, setValue] = useState("");
  const [rarity, setRarity] = useState("1");
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPrizes();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        router.push('/admin/login');
        return false;
      }

      const response = await fetch('/api/admin/auth', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        router.push('/admin/login');
        return false;
      }

      return true;
    } catch (error) {
      console.error("Erro na autenticação:", error);
      router.push('/admin/login');
      return false;
    }
  };

  const fetchPrizes = async () => {
    try {
      const isAuthenticated = await checkAuth();
      if (!isAuthenticated) return;

      setLoading(true);
      const response = await fetch('/api/admin/prizes');
      const data = await response.json();
      setPrizes(data);
    } catch (error) {
      console.error("Erro ao buscar prêmios:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem('admin_token');
      const url = editingPrize ? `/api/admin/prizes/${editingPrize.id}` : '/api/admin/prizes';
      const method = editingPrize ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token || ''}`
        },
        body: JSON.stringify({
          name,
          description,
          imageUrl: imageUrl || null,
          value: parseFloat(value),
          rarity: parseInt(rarity),
          isActive
        }),
      });

      if (response.ok) {
        await fetchPrizes();
        resetForm();
      } else {
        const data = await response.json();
        setError(data.error || 'Erro ao salvar prêmio');
      }
    } catch (error) {
      console.error("Erro ao salvar prêmio:", error);
      setError('Erro de conexão');
    }
  };

  const handleEdit = (prize: Prize) => {
    setEditingPrize(prize);
    setName(prize.name);
    setDescription(prize.description);
    setImageUrl(prize.imageUrl || "");
    setValue(prize.value.toString());
    setRarity(prize.rarity.toString());
    setIsActive(prize.isActive);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja excluir este prêmio?")) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`/api/admin/prizes/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token || ''}`
        },
      });

      if (response.ok) {
        await fetchPrizes();
      } else {
        const data = await response.json();
        alert(data.error || 'Erro ao excluir prêmio');
      }
    } catch (error) {
      console.error("Erro ao excluir prêmio:", error);
      alert('Erro de conexão');
    }
  };

  const resetForm = () => {
    setEditingPrize(null);
    setName("");
    setDescription("");
    setImageUrl("");
    setValue("");
    setRarity("1");
    setIsActive(true);
    setShowForm(false);
    setError("");
  };

  const getRarityLabel = (rarity: number) => {
    const labels = {
      1: { label: "Comum", color: "bg-gray-500" },
      2: { label: "Incomum", color: "bg-green-500" },
      3: { label: "Raro", color: "bg-blue-500" },
      4: { label: "Épico", color: "bg-purple-500" },
      5: { label: "Lendário", color: "bg-yellow-500" },
    };
    
    return labels[rarity as keyof typeof labels] || labels[1];
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
              Gerenciamento de Prêmios
            </h1>
            <p className="text-gray-400 mt-2">Gerencie os prêmios disponíveis para as rifas</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
          >
            {showForm ? "Cancelar" : "Novo Prêmio"}
          </button>
        </div>

        {showForm && (
          <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingPrize ? "Editar Prêmio" : "Adicionar Novo Prêmio"}
            </h2>
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded-lg p-3 mb-6 text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                    Nome do Prêmio
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Ex: Smartphone Premium"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-300 mb-2">
                    Valor (R$)
                  </label>
                  <input
                    id="value"
                    type="number"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="Ex: 2000.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  placeholder="Descreva o prêmio em detalhes"
                  rows={3}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-300 mb-2">
                    URL da Imagem (opcional)
                  </label>
                  <input
                    id="imageUrl"
                    type="text"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                    placeholder="https://exemplo.com/imagem.jpg"
                  />
                </div>

                <div>
                  <label htmlFor="rarity" className="block text-sm font-medium text-gray-300 mb-2">
                    Raridade
                  </label>
                  <select
                    id="rarity"
                    value={rarity}
                    onChange={(e) => setRarity(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
                  >
                    <option value="1">Comum</option>
                    <option value="2">Incomum</option>
                    <option value="3">Raro</option>
                    <option value="4">Épico</option>
                    <option value="5">Lendário</option>
                  </select>
                </div>

                <div className="flex items-center">
                  <input
                    id="isActive"
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-300">
                    Prêmio Ativo
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-lg transition duration-300"
                >
                  {editingPrize ? "Atualizar" : "Criar"} Prêmio
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-gray-800 rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold mb-6">Prêmios Cadastrados</h2>
          
          {loading ? (
            <div className="text-center py-8">
              <p>Carregando prêmios...</p>
            </div>
          ) : prizes.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Nenhum prêmio cadastrado ainda.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {prizes.map((prize) => {
                const rarityInfo = getRarityLabel(prize.rarity);
                return (
                  <div key={prize.id} className="bg-gray-750 rounded-xl p-6 border border-gray-700 hover:border-purple-500 transition duration-300">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">{prize.name}</h3>
                        <div className="flex items-center mt-1">
                          <span className={`px-2 py-1 text-xs rounded-full ${rarityInfo.color} text-white`}>
                            {rarityInfo.label}
                          </span>
                          {prize.isActive ? (
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-green-500/20 text-green-400">
                              Ativo
                            </span>
                          ) : (
                            <span className="ml-2 px-2 py-1 text-xs rounded-full bg-red-500/20 text-red-400">
                              Inativo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm mb-4">{prize.description}</p>
                    
                    {prize.imageUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden bg-gray-700 h-32 flex items-center justify-center">
                        <span className="text-gray-500">Imagem do prêmio</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center mt-4">
                      <div className="text-lg font-bold text-yellow-400">
                        R$ {prize.value.toFixed(2)}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(prize)}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition duration-300"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(prize.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition duration-300"
                        >
                          Excluir
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}