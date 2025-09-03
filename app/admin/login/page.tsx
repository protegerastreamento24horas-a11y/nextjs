"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin({ searchParams }: any) {
  // Definir token do admin no localStorage
  const TOKEN_STORAGE_KEY = "admin_token";
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verificar se há mensagens de erro nos parâmetros da URL
  useEffect(() => {
    // Resolver searchParams se for uma Promise
    Promise.resolve(searchParams).then((params) => {
      const urlError = params?.error;
      const redirectedFrom = params?.redirectedFrom;
      
      if (urlError === 'invalid_token') {
        setError('Sessão expirada. Por favor, faça login novamente.');
      }
      
      if (redirectedFrom) {
        setError(`Acesso negado à página ${redirectedFrom}. Faça login para continuar.`);
      }
    });
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log('Tentando fazer login com:', { username, password });
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      console.log('Resposta do login:', response.status);
      const data = await response.json();
      console.log('Dados da resposta:', data);

      if (response.ok) {
        // Salvar token no localStorage para acesso seguro
        if (typeof window !== 'undefined') {
          console.log('Salvando token no localStorage');
          localStorage.setItem("admin_token", data.token);
          console.log('Token salvo:', data.token.substring(0, 20) + '...');
        }
        
        // Redirecionar para o painel
        console.log('Redirecionando para /admin');
        router.push("/admin");
        router.refresh();
      } else {
        console.log('Erro no login:', data.error);
        setError(data.error || "Erro ao fazer login");
      }
    } catch (err) {
      console.error("Erro de conexão:", err);
      setError("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  // Função para testar credenciais
  const testCredentials = () => {
    const username = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'ADMIN';
    const password = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'ADMIN123';
    alert(`Credenciais atuais:\nUsuário: ${username}\nSenha: ${password}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            Admin Rifa Premiada
          </h1>
          <p className="text-gray-400 mt-2">
            Área administrativa do sistema de rifas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium mb-1">
              Usuário
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite seu usuário"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Senha
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Digite sua senha"
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-3 text-red-300 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !username || !password}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              loading || !username || !password
                ? 'bg-gray-600 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Autenticando...
              </span>
            ) : (
              "Entrar"
            )}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button 
            onClick={testCredentials}
            className="text-xs text-gray-500 hover:text-gray-400 underline"
          >
            Mostrar credenciais de teste
          </button>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Área restrita - somente administradores autorizados</p>
        </div>
      </div>
    </div>
  );
}