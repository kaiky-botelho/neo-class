// src/services/api.ts
import axios from 'axios';
import { Platform } from 'react-native';

const API_HOST = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api'
  : 'http://localhost:8080/api';

const api = axios.create({ baseURL: API_HOST });

export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
