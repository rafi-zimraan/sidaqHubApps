import React, { createContext, useContext, useState } from 'react';
import { CURRENT_USER, MOCK_TOKEN } from '../utils/mock';

export interface User {
  user_id: string;
  email: string;
  name: string;
  avatar_url: string;
  juz_count: number;
  role: string;
  city: string;
  bio: string;
  interests: string[];
  followers_count: number;
  following_count: number;
  posts_count: number;
  profile_completed: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (token: string, user: User) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Tanpa backend: auto-login dengan user dummy supaya app langsung bisa dijelajah.
  const [user, setUser] = useState<User | null>(CURRENT_USER as User);
  const [token, setToken] = useState<string | null>(MOCK_TOKEN);
  const [loading] = useState(false);

  const login = async (newToken: string, userData: User) => {
    setToken(newToken);
    setUser(userData);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
