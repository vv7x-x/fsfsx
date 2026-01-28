import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "../types";
import { apiClient } from "../services/api";
import { initSocket, disconnectSocket } from "../services/socket";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("fsfs_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await apiClient.getProfile();
      if (res.success) {
        setUser(res.data);
        initSocket(token);
      } else {
        localStorage.removeItem("fsfs_token");
      }
    } catch (err) {
      localStorage.removeItem("fsfs_token");
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    const { user: userData, token } = await apiClient.login(email, password);
    localStorage.setItem("fsfs_token", token);
    setUser(userData);
    initSocket(token);
  };

  const register = async (username: string, email: string, password: string) => {
    const { user: userData, token } = await apiClient.register(username, email, password);
    localStorage.setItem("fsfs_token", token);
    setUser(userData);
    initSocket(token);
  };

  const logout = () => {
    localStorage.removeItem("fsfs_token");
    setUser(null);
    disconnectSocket();
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
