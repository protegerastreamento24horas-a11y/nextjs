"use client";

import { useEffect, useState } from "react";

export default function TestNetworkPage() {
  const [networkInfo, setNetworkInfo] = useState<any>(null);

  useEffect(() => {
    console.log('=== PÁGINA DE TESTE DE REDE CARREGADA ===');
    
    // Coletar informações de rede
    const info = {
      timestamp: new Date().toISOString(),
      online: navigator.onLine,
      connection: typeof (navigator as any).connection !== 'undefined' ? {
        effectiveType: (navigator as any).connection.effectiveType,
        downlink: (navigator as any).connection.downlink,
        rtt: (navigator as any).connection.rtt
      } : 'Não disponível',
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      cookies: document.cookie,
      referrer: document.referrer,
      localStorageItems: typeof localStorage !== 'undefined' ? 
        Object.keys(localStorage).length : 
        0,
      sessionStorageItems: typeof sessionStorage !== 'undefined' ? 
        Object.keys(sessionStorage).length : 
        0
    };
    
    console.log('Informações de rede:', info);
    setNetworkInfo(info);
    
    // Verificar se há token no localStorage
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem("admin_token");
      console.log('Token no localStorage:', token);
      
      // Testar armazenamento de um novo token
      const testToken = 'test-token-' + Date.now();
      localStorage.setItem('test_token', testToken);
      console.log('Token de teste armazenado:', testToken);
      
      const retrievedTestToken = localStorage.getItem('test_token');
      console.log('Token de teste recuperado:', retrievedTestToken);
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste de Rede e Armazenamento</h1>
      <p>Esta página é para testar o funcionamento da rede e armazenamento.</p>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Informações de Rede</h2>
        {networkInfo ? (
          <div>
            <p><strong>Timestamp:</strong> {networkInfo.timestamp}</p>
            <p><strong>Online:</strong> {networkInfo.online ? 'Sim' : 'Não'}</p>
            <p><strong>Conexão:</strong> {JSON.stringify(networkInfo.connection)}</p>
            <p><strong>Language:</strong> {networkInfo.language}</p>
            <p><strong>Platform:</strong> {networkInfo.platform}</p>
            <p><strong>Cookies habilitados:</strong> {networkInfo.cookieEnabled ? 'Sim' : 'Não'}</p>
            <p><strong>Referrer:</strong> {networkInfo.referrer || 'Nenhum'}</p>
            <p><strong>localStorage items:</strong> {networkInfo.localStorageItems}</p>
            <p><strong>sessionStorage items:</strong> {networkInfo.sessionStorageItems}</p>
          </div>
        ) : (
          <p>Carregando informações...</p>
        )}
      </div>
      
      <div style={{ background: '#e0e0e0', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Informações de Cookies</h2>
        <p><strong>Cookies:</strong> {networkInfo?.cookies || 'Nenhum'}</p>
      </div>
    </div>
  );
}