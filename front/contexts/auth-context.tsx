import { loginWithApi } from "@/services/auth-service";
import { AuthContextType, LoginCredentials, User } from "@/types";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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

  const login = useCallback(async (credentials: LoginCredentials) => {
    setLoading(true);

    try {
      const loggedUser = await loginWithApi(credentials);
      setUser(loggedUser);
    } finally {
      setLoading(false);
    }
  }, []);

  const completeFirstAccess = useCallback(() => {
    setUser((currentUser) =>
      currentUser ? { ...currentUser, firstAccess: false } : currentUser,
    );
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    void SecureStore.deleteItemAsync("userToken");
  }, []);

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      completeFirstAccess,
      logout,
    }),
    [loading, user, login, completeFirstAccess, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
