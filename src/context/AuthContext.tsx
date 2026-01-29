import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient } from '../services/api';

export type UserRole = 'admin' | 'product_manager' | 'engineer' | 'viewer';

interface User {
  id: number;
  username: string;
  email: string;
  role: UserRole;
}

export interface Feature {
  id: string;
  title: string;
  priority: string;
  description: string;
  kpi: string;
  customerName: string;
  engineeringComment: string;
  engineeringSignoff: boolean;
  engineeringComplexity: string;
  releaseDate: string;
  assignedEngineerId?: number;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  hasRole: (...roles: UserRole[]) => boolean;
  canEditFeature: (feature: Feature) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('access_token');
    if (token) {
      apiClient.getCurrentUser()
        .then(setUser)
        .catch(() => {
          localStorage.removeItem('access_token');
        })
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const data = await apiClient.login(username, password);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setUser(null);
    window.location.href = '/login';
  };

  const register = async (username: string, email: string, password: string) => {
    await apiClient.register(username, email, password);
  };

  const hasRole = (...roles: UserRole[]): boolean => {
    return user ? roles.includes(user.role) : false;
  };

  const canEditFeature = (feature: Feature): boolean => {
    if (!user) return false;

    if (user.role === 'admin') return true;
    if (user.role === 'product_manager') return true;
    if (user.role === 'engineer') {
      return feature.assignedEngineerId === user.id;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!user,
        isLoading,
        hasRole,
        canEditFeature,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
