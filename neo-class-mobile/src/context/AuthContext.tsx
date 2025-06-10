import React, { createContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api, { setAuthToken } from '../services/api';
// Importar AxiosError se usar try/catch para erros de rede
import { AxiosError } from 'axios';
import Toast from 'react-native-toast-message'; // Importar Toast

export interface User {
  id: number;
  nome: string;
  emailInstitucional: string;
  turmaId?: number; // turmaId pode ser opcional ou não vir de Login
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(email: string, senha: string): Promise<void>;
  signOut(): void;
  // -> CORRIGIDO: changePassword AGORA ESPERA APENAS 1 ARGUMENTO <-
  changePassword(novaSenha: string): Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

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
      const response = await api.post<{
        token: string;
        user: User;
      }>('/login/aluno', { email, senha });

      const { token, user: userData } = response.data;
      await AsyncStorage.setItem('@app:token', token);
      await AsyncStorage.setItem('@app:user', JSON.stringify(userData));
      setAuthToken(token);
      setUser(userData);
    } catch (e) {
      setUser(null);
      // Re-throw the error for LoginScreen to catch and display Toast
      throw e; 
    } finally {
      setLoading(false);
    }
  }

  function signOut() {
    AsyncStorage.multiRemove(['@app:token', '@app:user']);
    setUser(null);
    setAuthToken(null);
    Toast.show({
      type: 'info',
      text1: 'Sessão Encerrada',
      text2: 'Você foi desconectado.',
      position: 'top',
      visibilityTime: 3000,
    });
  }

  // --- FUNÇÃO changePassword CORRIGIDA PARA 1 ARGUMENTO ---
  async function changePassword(novaSenha: string): Promise<void> {
    if (!user) { // Verificação extra caso o usuário não esteja logado (não deve acontecer se a rota for protegida)
      throw new Error('Usuário não autenticado.');
    }
    try {
      // Chama o novo endpoint que altera a senha do aluno autenticado via JWT
      await api.put('/login/aluno/senha', { novaSenha });
    } catch (error: any) { // Capturar o erro para re-lançar e ser tratado pela tela
      console.error("Erro no AuthContext.changePassword:", error);
      // Propagar o erro para a tela exibir o Toast
      throw error; 
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut, changePassword }}>
      {children}
    </AuthContext.Provider>
  );
};