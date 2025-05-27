// src/context/AuthContext.tsx

import React, {
  createContext,
  useState,
  useEffect,
  ReactNode
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  nome: string;
  email: string;
  // adicione aqui outros campos que venha do backend
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

  // Carrega o token e, se existir, mantém o usuário “logado”
  useEffect(() => {
    async function loadStorage() {
      const token = await AsyncStorage.getItem('@app:token');
      if (token) {
        api.defaults.headers.Authorization = `Bearer ${token}`;
        // opcional: se quiser buscar dados do usuário a cada reload:
        // const { data: userData } = await api.get<User>('/me');
        // setUser(userData);
      }
      setLoading(false);
    }
    loadStorage();
  }, []);

  // Faz o login e armazena token + user
  async function signIn(email: string, senha: string) {
    setLoading(true);
    const { data } = await api.post<{
      token: string;
      user: User;
    }>('/login/aluno', { email, senha });

    const { token, user: userData } = data;
    await AsyncStorage.setItem('@app:token', token);
    api.defaults.headers.Authorization = `Bearer ${token}`;
    setUser(userData);
    setLoading(false);
  }

  // Faz logout
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
