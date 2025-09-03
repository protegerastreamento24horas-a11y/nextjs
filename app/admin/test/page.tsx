"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TestPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    console.log("=== PÁGINA DE TESTE CARREGADA ===");
    
    // Verificar token no localStorage
    const localStorageToken = typeof window !== 'undefined' ? localStorage.getItem("admin_token") : null;
    console.log("Token no localStorage:", localStorageToken ? localStorageToken.substring(0, 20) + '...' : 'NENHUM');
    
    // Verificar cookies
    const allCookies = typeof document !== 'undefined' ? document.cookie : '';
    console.log("Todos os cookies:", allCookies);
    
    const adminTokenCookie = typeof document !== 'undefined' ? 
      document.cookie.split(';').find(c => c.trim().startsWith('admin_token=')) : null;
    console.log("Cookie admin_token:", adminTokenCookie);
    
    setTokenInfo({
      localStorageToken: localStorageToken ? localStorageToken.substring(0, 20) + '...' : 'NENHUM',
      allCookies,
      adminTokenCookie
    });
  }, []);

  const handleLogout = () => {
    // Limpar tokens
    if (typeof window !== 'undefined') {
      localStorage.removeItem("admin_token");
      document.cookie = 'admin_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
    router.push('/admin/login');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste de Autenticação</h1>
      <p>Esta página é para diagnosticar o problema de autenticação.</p>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Informações de Token</h2>
        {tokenInfo ? (
          <div>
            <p><strong>Token no localStorage:</strong> {tokenInfo.localStorageToken}</p>
            <p><strong>Todos os cookies:</strong> {tokenInfo.allCookies}</p>
            <p><strong>Cookie admin_token:</strong> {tokenInfo.adminTokenCookie || 'NENHUM'}</p>
          </div>
        ) : (
          <p>Carregando informações...</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{ 
            backgroundColor: '#ff4444', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Limpar Tokens e Sair
        </button>
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={() => router.push('/admin')}
          style={{ 
            backgroundColor: '#4444ff', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Ir para Painel Admin
        </button>
      </div>
    </div>
  );
}