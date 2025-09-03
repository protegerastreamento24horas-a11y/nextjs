"use client";

import { useEffect, useState } from "react";

export default function TestMiddlewareDetailsPage() {
  const [requestInfo, setRequestInfo] = useState<any>(null);

  useEffect(() => {
    console.log('=== PÁGINA DE TESTE DO MIDDLEWARE DETALHADA CARREGADA ===');
    
    // Coletar informações da requisição
    const info = {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookies: document.cookie,
      localStorageItems: typeof localStorage !== 'undefined' ? 
        Object.keys(localStorage).filter(key => key.includes('token')) : 
        [],
      sessionStorageItems: typeof sessionStorage !== 'undefined' ? 
        Object.keys(sessionStorage).filter(key => key.includes('token')) : 
        []
    };
    
    console.log('Informações da requisição:', info);
    setRequestInfo(info);
    
    // Verificar se há token no localStorage
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem("admin_token");
      console.log('Token no localStorage:', token);
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste Detalhado do Middleware</h1>
      <p>Esta página é para testar o funcionamento do middleware com mais detalhes.</p>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Informações da Requisição</h2>
        {requestInfo ? (
          <div>
            <p><strong>Timestamp:</strong> {requestInfo.timestamp}</p>
            <p><strong>User Agent:</strong> {requestInfo.userAgent}</p>
            <p><strong>Language:</strong> {requestInfo.language}</p>
            <p><strong>Cookies:</strong> {requestInfo.cookies || 'Nenhum'}</p>
            <p><strong>localStorage tokens:</strong> {requestInfo.localStorageItems.join(', ') || 'Nenhum'}</p>
            <p><strong>sessionStorage tokens:</strong> {requestInfo.sessionStorageItems.join(', ') || 'Nenhum'}</p>
          </div>
        ) : (
          <p>Carregando informações...</p>
        )}
      </div>
    </div>
  );
}