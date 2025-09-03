"use client";

import { useEffect } from "react";

export default function TestMiddlewarePage() {
  useEffect(() => {
    console.log('=== PÁGINA DE TESTE DO MIDDLEWARE CARREGADA ===');
    
    // Verificar cookies
    if (typeof document !== 'undefined') {
      console.log('Todos os cookies:', document.cookie);
    }
    
    // Verificar localStorage
    if (typeof localStorage !== 'undefined') {
      const token = localStorage.getItem("admin_token");
      console.log('Token no localStorage:', token);
    }
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste do Middleware</h1>
      <p>Esta página é para testar o funcionamento do middleware.</p>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Informações de Debug</h2>
        <p>Verifique o console do navegador para ver os logs.</p>
      </div>
    </div>
  );
}