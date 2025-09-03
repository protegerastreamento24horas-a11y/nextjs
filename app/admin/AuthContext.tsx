"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  username: string;
  role: string;
} | null;

type AuthContextType = {
  user: User;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticação no carregamento
    checkAuth();
  }, []);

  const checkAuth = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem("admin_token");
      
      if (!token) {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      
      try {
        // Com token simples, apenas verificar se existe
        // Em produção, você pode adicionar verificação de expiração
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ username: payload.username, role: payload.role });
        setIsAuthenticated(true);
      } catch (error) {
        // Se não for um token JWT, assumir que é um token simples válido
        setIsAuthenticated(true);
        setUser({ username: 'ADMIN', role: 'admin' });
      }
    }
  };

  const login = (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem("admin_token", token);
      checkAuth();
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("admin_token");
      setIsAuthenticated(false);
      setUser(null);
      router.push('/admin/login');
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}