import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string) => Promise<void>;
  register: (email: string, name: string) => Promise<void>;
  logout: () => void;
  reauthenticate: () => Promise<boolean>;
  deleteAccount: () => Promise<boolean>;
  updateProfile: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: UserProfile = {
  uid: 'user_default_123',
  email: 'student@bossbattles.local',
  displayName: 'Alex Rivers',
  level: 4,
  xp: 1450,
  xpForNextLevel: 2000,
  currentStreak: 7,
  bestStreak: 12,
  todayDamage: 45,
  lastDamageDate: new Date().toISOString().split('T')[0],
  aiConsent: true,
  gamificationConsent: true,
  createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('studyhabit_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('studyhabit_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('studyhabit_user');
    }
  }, [user]);

  const login = async (email: string) => {
    const nameFromEmail = email.split('@')[0] || 'Student';
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      uid: `user_${Date.now()}`,
      email,
      displayName: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
    };
    setUser(newUser);
  };

  const register = async (email: string, name: string) => {
    const newUser: UserProfile = {
      ...DEFAULT_USER,
      uid: `user_${Date.now()}`,
      email,
      displayName: name,
      level: 1,
      xp: 0,
      xpForNextLevel: 500,
      todayDamage: 0,
      currentStreak: 1,
    };
    setUser(newUser);
  };

  const logout = () => {
    // Clear session and local cache
    localStorage.removeItem('studyhabit_user');
    localStorage.removeItem('studyhabit_data');
    setUser(null);
  };

  const reauthenticate = async (): Promise<boolean> => {
    // Reauth confirmation simulation
    return true;
  };

  const deleteAccount = async (): Promise<boolean> => {
    if (!user) return false;
    // Wipe local cache
    localStorage.clear();
    setUser(null);
    return true;
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        reauthenticate,
        deleteAccount,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
