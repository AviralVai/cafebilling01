import React, { createContext, useContext, useState } from 'react';
import { User, Shop } from '@/data/mockData';

interface AuthContextType {
  currentUser: User | null;
  currentShop: Shop | null;
  login: (user: User, shop?: Shop) => void;
  logout: () => void;
  setCurrentShop: (shop: Shop) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentShop, setCurrentShopState] = useState<Shop | null>(null);

  const login = (user: User, shop?: Shop) => {
    setCurrentUser(user);
    if (shop) setCurrentShopState(shop);
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentShopState(null);
  };

  const setCurrentShop = (shop: Shop) => setCurrentShopState(shop);

  return (
    <AuthContext.Provider value={{ currentUser, currentShop, login, logout, setCurrentShop }}>
      {children}
    </AuthContext.Provider>
  );
};
