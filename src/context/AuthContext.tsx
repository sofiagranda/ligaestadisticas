// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { getToken, login as loginRequest, logout as doLogout } from '../services/authService';

type AuthContextType = {
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

// ⚠️ Crear contexto sin valores vacíos falsos (mejor manejarlo con undefined)
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [username, setUsername] = useState<string | null>(null);

  // Cargar token al montar
  useEffect(() => {
    const token = getToken();
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setUsername(decoded.username);
      } catch {
        doLogout();
      }
    }
  }, []);

  // ✅ Agregar función login
  const login = async (username: string, password: string) => {
    const token = await loginRequest(username, password); // guarda el token en localStorage
    const decoded: any = jwtDecode(token);
    setUsername(decoded.username);
  };

  const logout = () => {
    doLogout();
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};
