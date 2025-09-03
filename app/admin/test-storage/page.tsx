"use client";

import { useEffect, useState } from "react";

export default function TestStoragePage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [newToken, setNewToken] = useState('');

  useEffect(() => {
    checkStorage();
  }, []);

  const checkStorage = () => {
    if (typeof window !== 'undefined') {
      console.log('=== VERIFICANDO ARMAZENAMENTO ===');
      const token = localStorage.getItem("admin_token");
      console.log('Token no localStorage:', token);
      
      setTokenInfo({
        token: token,
        timestamp: new Date().toISOString()
      });
    }
  };

  const saveToken = () => {
    if (typeof window !== 'undefined' && newToken) {
      console.log('Salvando novo token:', newToken);
      localStorage.setItem("admin_token", newToken);
      checkStorage();
    }
  };

  const clearToken = () => {
    if (typeof window !== 'undefined') {
      console.log('Removendo token');
      localStorage.removeItem("admin_token");
      checkStorage();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste de Armazenamento</h1>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Informações do Token</h2>
        {tokenInfo ? (
          <div>
            <p><strong>Token:</strong> {tokenInfo.token || 'NENHUM'}</p>
            <p><strong>Timestamp:</strong> {tokenInfo.timestamp}</p>
          </div>
        ) : (
          <p>Carregando informações...</p>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <input 
          type="text" 
          value={newToken} 
          onChange={(e) => setNewToken(e.target.value)}
          placeholder="Digite um token de teste"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button 
          onClick={saveToken}
          style={{ 
            backgroundColor: '#44ff44', 
            color: 'black', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Salvar Token
        </button>
        
        <button 
          onClick={clearToken}
          style={{ 
            backgroundColor: '#ff4444', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Limpar Token
        </button>
        
        <button 
          onClick={checkStorage}
          style={{ 
            backgroundColor: '#4444ff', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Verificar Armazenamento
        </button>
      </div>
    </div>
  );
}