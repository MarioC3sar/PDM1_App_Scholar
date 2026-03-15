import { AuthContextType, LoginCredentials, User } from "@/types";
import React, { createContext, useCallback, useEffect, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simular carregamento inicial (verificar se há usuário salvo)
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Aqui você pode adicionar lógica para verificar se há token salvo
        // e restaurar a sessão do usuário
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);
    try {
      // Simular chamada à API
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Validação básica
      if (!credentials.login || !credentials.password) {
        throw new Error("Usuário e senha são obrigatórios");
      }

      // Simular usuário logado (em produção, viria da API)
      const mockUser: User = {
        id: "1",
        email: credentials.login,
        name: credentials.login.split("@")[0],
        role: "student",
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
