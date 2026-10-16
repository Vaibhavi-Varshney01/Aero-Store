import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children, onNotify }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('aerostore_token') || null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState('login');
  const [loading, setLoading] = useState(true);

  // Check stored token on boot
  const loadProfile = useCallback(async () => {
    const savedToken = localStorage.getItem('aerostore_token');
    if (!savedToken) {
      setLoading(false);
      return;
    }
    try {
      const profile = await api.getProfile();
      setUser(profile);
      setToken(savedToken);
    } catch (err) {
      // Invalid/expired token
      localStorage.removeItem('aerostore_token');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const openAuthModal = (tab = 'login') => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = async (email, password) => {
    try {
      const res = await api.login(email, password);
      localStorage.setItem('aerostore_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      if (onNotify) onNotify(`Welcome back, ${res.user.name}! 👋`, 'success');
      return { success: true, user: res.user };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'Login failed';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      return { success: false, error: msg };
    }
  };

  const register = async (name, email, password, role = 'customer') => {
    try {
      const res = await api.register(name, email, password, role);
      localStorage.setItem('aerostore_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      setIsAuthModalOpen(false);
      if (onNotify) onNotify(`Account created! Welcome to AeroStore (${res.user.role.toUpperCase()}), ${res.user.name} 🎉`, 'success');
      return { success: true, user: res.user };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'Registration failed';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      return { success: false, error: msg };
    }
  };


  const logout = async () => {
    await api.logout();
    localStorage.removeItem('aerostore_token');
    setUser(null);
    setToken(null);
    if (onNotify) onNotify('Signed out successfully.', 'info');
  };

  const upgradeToVip = async () => {
    try {
      const res = await api.upgradeToVip();
      localStorage.setItem('aerostore_token', res.access_token);
      setToken(res.access_token);
      setUser(res.user);
      if (onNotify) onNotify('👑 Congratulations! You are now an active AeroStore VIP Member! Enjoy exclusive discounts & zero delivery fees.', 'success');
      return { success: true, user: res.user };
    } catch (err) {
      const msg = err.problem?.detail || err.message || 'VIP upgrade failed';
      if (onNotify) onNotify(`⚠️ ${msg}`, 'error');
      return { success: false, error: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        upgradeToVip,
        logout,
        loading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
