import axios from 'axios';
import { Platform } from 'react-native';

const API_HOST = Platform.OS === 'android'
  ? 'http://10.0.2.2:8080/api'     // emulador Android
  : 'http://localhost:8080/api';   // iOS ou web

const api = axios.create({ baseURL: API_HOST });

export default api;