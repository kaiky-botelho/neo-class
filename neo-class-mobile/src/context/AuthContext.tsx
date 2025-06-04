// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

export interface User {
  id: number;
  nome: string;
  emailInstitucional: string;
  turmaId: number;
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
    async function loadStorageData() {
      const token = await AsyncStorage.getItem('@app:token');
      const userStr = await AsyncStorage.getItem('@app:user');
      if (token && userStr) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        setUser(JSON.parse(userStr));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, senha: string) {
    setLoading(true);
    try {
      // Espera { token: string; user: User } do backend
      const response = await api.post<{
        token: string;
        user: User;
      }>('/login/aluno', { email, senha });

      const { token, user: userData } = response.data;
      await AsyncStorage.setItem('@app:token', token);
      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
      api.defaults.headers.Authorization = `Bearer ${token}`;
      setUser(userData);
    } catch (err: any) {
      throw err;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    AsyncStorage.multiRemove(['@app:token', '@app:user']);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
