// src/api/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const api = axios.create({
  baseURL: 'http://localhost:8080/api'
});

// injeta header Authorization em toda requisição
api.interceptors.request.use(async config => {
  const token = await AsyncStorage.getItem('@neo-class:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
