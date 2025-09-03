"use client";

import { useAuth } from '../AuthContext';
import { useRouter } from 'next/navigation';

export default function TestAuthPage() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const router = useRouter();

  const handleLogin = () => {
    // Simular login com um token de teste
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlRFU1QiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjk5OT99.xX9HQTiJ223Peo49R5CRyvvHm9o7r39r39r39r39r39';
    login(testToken);
  };

  const handleGoToAdmin = () => {
    router.push('/admin');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Teste de Autenticação</h1>
      
      <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '5px', marginTop: '20px' }}>
        <h2>Estado de Autenticação</h2>
        <p><strong>Usuário autenticado:</strong> {isAuthenticated ? 'Sim' : 'Não'}</p>
        {user && (
          <div>
            <p><strong>Nome de usuário:</strong> {user.username}</p>
            <p><strong>Função:</strong> {user.role}</p>
          </div>
        )}
      </div>
      
      <div style={{ marginTop: '20px' }}>
        <button 
          onClick={handleLogin}
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
          Simular Login
        </button>
        
        <button 
          onClick={logout}
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
          Logout
        </button>
        
        <button 
          onClick={handleGoToAdmin}
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