"use client";

import { useState } from "react";

export default function TestLogin() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          username: "admin", 
          password: "password" 
        }),
      });

      const data = await response.json();
      setResult({
        status: response.status,
        ok: response.ok,
        data: data
      });
    } catch (error: unknown) {
      setResult({
        error: error instanceof Error ? error.message : String(error)
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-8">Teste de Login</h1>
      
      <button
        onClick={testLogin}
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Testando..." : "Testar Login"}
      </button>

      {result && (
        <div className="mt-6 p-4 bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Resultado:</h2>
          <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-800 rounded">
        <h2 className="text-xl font-semibold mb-2">Credenciais esperadas:</h2>
        <p>Usuário: admin</p>
        <p>Senha: password</p>
      </div>
    </div>
  );
}