import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface HuffadzProfile {
  city: string;
  province: string;
  bio: string;
  verifiedJuz: number;
  badge_tier: string;
  gender: string;
  interests: string[];
  hobbies: string[];
  juzProgress: number;
  experiences: any[];
  certificationsList: any[];
  skillsList: string[];
  showSkills: boolean;
  showExperiences: boolean;
}

export interface RawUser {
  id: string;
  name: string;
  email: string;
  role: string;
  uniqueId: string;
  photo_url: string | null;
  cover_photo_url: string | null;
  username: string;
  phone: string;
  birthday: string;
  province_id: number;
  city_id: number;
  verification_level: string;
  huffadzProfile: HuffadzProfile | null;
  city: { id: number; name: string } | null;
  province: { id: number; name: string } | null;
}

export interface User extends RawUser {
  /** user_id (alias for id, backward compat with mock) */
  user_id: string;
  /** avatar_url (alias for photo_url, backward compat with mock) */
  avatar_url: string | null;
  /** juz_count (from huffadzProfile.juzProgress) */
  juz_count: number;
  /** bio (from huffadzProfile.bio) */
  bio: string;
  /** city (from huffadzProfile.city or city.name) */
  city_name: string;
  /** interests (from huffadzProfile.interests) */
  interests: string[];
  /** profile_completed — inferred: true if huffadzProfile exists */
  profile_completed: boolean;
  /** followers_count / following_count / posts_count — defaults */
  followers_count: number;
  following_count: number;
  posts_count: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  /** `options.persist` (default true) — false pindah token/user ke memori saja, tidak ditulis ke AsyncStorage (mode "jangan ingat saya"). */
  login: (userData: User | RawUser, userToken: string, options?: { persist?: boolean }) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
}

function normalizeUser(raw: RawUser): User {
  const hp = raw.huffadzProfile;
  return {
    ...raw,
    user_id: raw.id,
    avatar_url: raw.photo_url,
    juz_count: hp?.juzProgress || hp?.verifiedJuz || 0,
    bio: hp?.bio || '',
    city_name: hp?.city || raw.city?.name || '',
    interests: hp?.interests || [],
    profile_completed: !!hp,
    followers_count: 0,
    following_count: 0,
    posts_count: 0,
  };
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

const USER_KEY = 'sidaq_user';
const TOKEN_KEY = 'sidaq_token';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [persistSession, setPersistSession] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          const userData = JSON.parse(storedUser);
          if (userData.photo_url?.startsWith('blob:')) userData.photo_url = null;
          if (userData.cover_photo_url?.startsWith('blob:')) userData.cover_photo_url = null;
          setUser('user_id' in userData ? userData : normalizeUser(userData));
          setToken(storedToken);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (token && persistSession) {
      AsyncStorage.setItem(TOKEN_KEY, token);
    } else if (!token) {
      AsyncStorage.removeItem(TOKEN_KEY);
    }
  }, [token, persistSession]);

  useEffect(() => {
    if (user && persistSession) {
      AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    } else if (!user) {
      AsyncStorage.removeItem(USER_KEY);
    }
  }, [user, persistSession]);

  const login = useCallback(async (userData: User | RawUser, userToken: string, options?: { persist?: boolean }) => {
    const normalized = 'user_id' in userData ? userData as User : normalizeUser(userData as RawUser);
    setPersistSession(options?.persist !== false);
    setUser(normalized);
    setToken(userToken);
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    setToken(null);
    setPersistSession(true);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, updateUser, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
