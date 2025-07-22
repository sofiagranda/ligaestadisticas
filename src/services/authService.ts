// src/services/authService.ts
import api from '../api/api';

const TOKEN_KEY = 'token';

export const login = async (username: string, password: string): Promise<string> => {
  try {
    const response = await api.post('/auth/login', { username, password });
    const token = response.data.access_token;
    localStorage.setItem(TOKEN_KEY, token);
    return token; // ✅ NECESARIO para AuthContext
  } catch (error) {
    throw new Error('Login inválido');
  }
};


export const register = async (username: string, password: string): Promise<void> => {
  await api.post('/auth/register', { username, password });
};

export const logout = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};
