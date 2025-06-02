// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  nome: string;
  email: string;
  // …outros campos retornados pelo backend
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<void>;
  signOut(): void;
}

export const AuthContext = createContext<AuthContextData>({} as any);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorage() {
      const token = await AsyncStorage.getItem('@app:token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  async function signIn(email: string, senha: string) {
    setLoading(true);
    try {
      // OBS: não mais faz "throw new Error('401')". 
      //      Deixe o Axios repassar o 401 como err.response.status = 401
      const response = await api.post<{
        token: string;
        user: User;
      }>('/login/aluno', { email, senha });

      const { token, user: userData } = response.data;
      await AsyncStorage.setItem('@app:token', token);
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
    } catch (err: any) {
      // Só relança o próprio erro do Axios para o LoginScreen
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    AsyncStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
