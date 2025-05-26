// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';

type AuthContextData = {
  token: string | null;
  signIn(email: string, senha: string): Promise<void>;
  signOut(): Promise<void>;
};

export const AuthContext = createContext<AuthContextData>({} as any);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // ao iniciar, tenta ler o token
    AsyncStorage.getItem('@neo-class:token').then(t => {
      if (t) setToken(t);
    });
  }, []);

  async function signIn(email: string, senha: string) {
    try {
      const resp = await api.post('/auth/login', { email, senha });
      const jwt = resp.data.token; 
      await AsyncStorage.setItem('@neo-class:token', jwt);
      setToken(jwt);
    } catch (err) {
      Alert.alert('Erro', 'E-mail ou senha inválidos');
    }
  }

  async function signOut() {
    await AsyncStorage.removeItem('@neo-class:token');
    setToken(null);
  }

  return (
    <AuthContext.Provider value={{ token, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
