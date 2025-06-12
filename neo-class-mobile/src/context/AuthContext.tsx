// src/context/AuthContext.tsx

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../services/api';
import Toast from 'react-native-toast-message';

export interface User {
  id: number;
  nome: string;
  emailInstitucional: string;
  turmaId?: number;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<void>;
  signOut(): void;
  changePassword(novaSenha: string): Promise<void>;
}

// Criamos o contexto com tipagem
export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Aqui explicito que props incluem children do tipo ReactNode
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStorageData() {
      const token = await AsyncStorage.getItem('@app:token');
      const userStr = await AsyncStorage.getItem('@app:user');
      if (token && userStr) {
        setAuthToken(token);
        setUser(JSON.parse(userStr));
      }
      setLoading(false);
    }
    loadStorageData();
  }, []);

  async function signIn(email: string, senha: string) {
    setLoading(true);
    try {
      const response = await api.post<{ token: string; user: User }>('/login/aluno', { email, senha });
      const { token, user: userData } = response.data;
      await AsyncStorage.multiSet([
        ['@app:token', token],
        ['@app:user', JSON.stringify(userData)],
      ]);
      setAuthToken(token);
      setUser(userData);
    } catch (error) {
      console.error('Erro no AuthContext.signIn:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    AsyncStorage.multiRemove(['@app:token', '@app:user']);
    setAuthToken(null);
    setUser(null);
    Toast.show({
      type: 'info',
      text1: 'Sessão Encerrada',
      text2: 'Você foi desconectado.',
      position: 'top',
      visibilityTime: 3000,
    });
  }

  async function changePassword(novaSenha: string): Promise<void> {
    if (!user) throw new Error('Usuário não autenticado.');
    try {
      await api.put('/login/aluno/senha', { novaSenha });
      Toast.show({
        type: 'success',
        text1: 'Senha Atualizada',
        text2: 'Sua senha foi alterada com sucesso.',
        position: 'top',
        visibilityTime: 3000,
      });
    } catch (err: any) {
      console.error('Erro no AuthContext.changePassword:', err);
      let msg = 'Erro ao alterar a senha. Tente novamente.';
      if (err.response?.data) {
        const data = err.response.data;
        msg = typeof data === 'string' ? data : data.message || JSON.stringify(data);
      }
      throw new Error(msg);
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};
