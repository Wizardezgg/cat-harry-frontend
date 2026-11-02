'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { IUser } from '../types';
import { fetcher } from '../lib/api';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (name: string, email: string, photoUrl: string, password: string) => Promise<void>;
  googleLogin: (name?: string, email?: string, photoUrl?: string) => Promise<IUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Hydration-safe initial check against /api/auth/me
  // Ensures logged-in users are NEVER redirected to /login on page refresh
  const refreshUser = useCallback(async () => {
    try {
      const data = await fetcher<{ success: boolean; user: IUser }>('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<IUser> => {
    const data = await fetcher<{ success: boolean; user: IUser; message: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(data.user);
    return data.user;
  };

  const register = async (name: string, email: string, photoUrl: string, password: string): Promise<void> => {
    await fetcher('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, photoUrl, password }),
    });
  };

  const googleLogin = async (name?: string, email?: string, photoUrl?: string): Promise<IUser> => {
    const data = await fetcher<{ success: boolean; user: IUser; message: string }>('/auth/google', {
      method: 'POST',
      body: JSON.stringify({
        name: name || 'Demo Creator',
        email: email || 'creator@studiospace.com',
        photoUrl: photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      }),
    });
    setUser(data.user);
    return data.user;
  };

  const logout = async (): Promise<void> => {
    try {
      await fetcher('/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        refreshUser,
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
