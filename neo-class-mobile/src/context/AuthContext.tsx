// src/context/AuthContext.tsx
import React, { createContext, ReactNode, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../../api/api';

export interface AuthContextData {
  token: string | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<void>;
  signOut(): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as any);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken]     = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem('@neo-class:token');
      if (stored) {
        setToken(stored);
        api.defaults.headers.common.Authorization = `Bearer ${stored}`;
      }
      setLoading(false);
    })();
  }, []);

  async function signIn(email: string, senha: string) {
    try {
      const res = await api.post('/login/aluno', {
        email,   // <<< aqui
        senha,
      });
      const jwt = (res.data as any).token;
      await AsyncStorage.setItem('@neo-class:token', jwt);
      api.defaults.headers.common.Authorization = `Bearer ${jwt}`;
      setToken(jwt);
    } catch (e: any) {
      console.log('🔥 LOGIN ERROR 🔥', {
        status:  e.response?.status,
        url:     e.config?.url,
        payload: e.config?.data,
        data:    e.response?.data,
      });
      Alert.alert(
        'Falha no login',
        e.response?.data || `Código ${e.response?.status}`
      );
      throw e;
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@neo-class:token');
    delete api.defaults.headers.common.Authorization;
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
