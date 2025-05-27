// src/api/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const host = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080'
  : 'http://172.20.10.6:8080';

const api = axios.create({
  baseURL: `${host}/api`,
  timeout: 10000,
});

// libera somente o login (secretaria, aluno, professor) sem token
const isAuthFree = (url?: string) =>
  !!url && url.startsWith('/login/');

api.interceptors.request.use(
  async config => {
    if (isAuthFree(config.url)) return config;
    const token = await AsyncStorage.getItem('@neo-class:token');
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  err => Promise.reject(err)
);

export default api;
