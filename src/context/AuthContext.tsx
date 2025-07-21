import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Admin } from '../types';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  login: (email: string, password: string) => Promise<boolean>;
  adminLogin: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Hardcoded admin login
const mockAdmins: Admin[] = [
  {
    id: '1',
    username: 'admin',
    password: 'admin123',
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedAdmin = localStorage.getItem('loggedInAdmin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const registeredUsers: User[] = JSON.parse(localStorage.getItem('registeredUsers') || '[]');

    const foundUser = registeredUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('loggedInUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const adminLogin = async (username: string, password: string): Promise<boolean> => {
    const foundAdmin = mockAdmins.find(a => a.username === username && a.password === password);
    if (foundAdmin) {
      setAdmin(foundAdmin);
      localStorage.setItem('loggedInAdmin', JSON.stringify(foundAdmin));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    localStorage.removeItem('loggedInUser');
    localStorage.removeItem('loggedInAdmin');
  };

  return (
    <AuthContext.Provider value={{ user, admin, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
