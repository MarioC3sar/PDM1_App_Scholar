import { loginWithMockApi } from "@/services/auth-service";
import { AuthContextType, LoginCredentials, User } from "@/types";
import React, { createContext, useEffect, useMemo, useState } from "react";

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };

    bootstrap().catch(() => setLoading(false));
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setLoading(true);

    try {
      const loggedUser = await loginWithMockApi(credentials);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      logout,
    }),
    [loading, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
