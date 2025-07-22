// src/api.ts
import axios from 'axios';
import { getToken } from '../services/authService';

const api = axios.create({
  baseURL: 'https://estadisticas-api.desarrollo-software.xyz/',
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token && config.headers) {
    config.headers.set?.('Authorization', `Bearer ${token}`);
  }
  return config;
});

export default api;
