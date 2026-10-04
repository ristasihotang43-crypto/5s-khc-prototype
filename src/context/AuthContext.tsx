import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { StorageService, INITIAL_USERS } from '../services/storage';

interface AuthContextType {
  currentUser: User | null;
  allUsers: User[];
  loginWithNip: (nip: string, password?: string) => Promise<boolean>;
  loginWithEmail: (email: string, password?: string) => Promise<boolean>;
  switchUser: (userId: string) => void;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load persisted session and users list
    const loadedUsers = StorageService.getUsers();
    setAllUsers(loadedUsers);

    try {
      const savedUserJson = localStorage.getItem('5s_current_user');
      if (savedUserJson) {
        const parsed = JSON.parse(savedUserJson);
        const match = loadedUsers.find((u) => u.id === parsed.id) || parsed;
        setCurrentUser(match);
      } else {
        // Default login with Rista (Operator) for instant experience if desired, or null for login page
        // Let's set default null so user sees the pristine Login page first as requested in Section 1!
        setCurrentUser(null);
      }
    } catch {
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithNip = async (nip: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    // Simulate authentic network latency
    await new Promise((res) => setTimeout(res, 600));

    const cleanNip = nip.trim();
    const user = allUsers.find(
      (u) => u.employee_id.toLowerCase() === cleanNip.toLowerCase()
    );

    if (!user) {
      setError('Nomor Induk Pekerja (NIP/NIK) tidak terdaftar dalam sistem.');
      setIsLoading(false);
      return false;
    }

    if (password && user.password && user.password !== password) {
      setError('Password yang Anda masukkan salah.');
      setIsLoading(false);
      return false;
    }

    setCurrentUser(user);
    localStorage.setItem('5s_current_user', JSON.stringify(user));
    setIsLoading(false);
    return true;
  };

  const loginWithEmail = async (email: string, password?: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    await new Promise((res) => setTimeout(res, 600));

    const cleanEmail = email.trim().toLowerCase();
    const user = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      setError('Email tidak terdaftar dalam sistem operasional pabrik.');
      setIsLoading(false);
      return false;
    }

    if (password && user.password && user.password !== password) {
      setError('Password yang Anda masukkan salah.');
      setIsLoading(false);
      return false;
    }

    setCurrentUser(user);
    localStorage.setItem('5s_current_user', JSON.stringify(user));
    setIsLoading(false);
    return true;
  };

  const switchUser = (userId: string) => {
    const user = allUsers.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      localStorage.setItem('5s_current_user', JSON.stringify(user));
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('5s_current_user');
  };

  const clearError = () => setError(null);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        allUsers,
        loginWithNip,
        loginWithEmail,
        switchUser,
        logout,
        isLoading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
