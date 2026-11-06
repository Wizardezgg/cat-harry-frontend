'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { IUser } from '../types';
import { fetcher } from '../lib/api';
import { signInWithPopup } from 'firebase/auth';
import { getFirebaseAuthInstance } from '../lib/firebase';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<IUser>;
  register: (name: string, email: string, photoUrl: string, password: string, role?: 'creator' | 'host') => Promise<void>;
  googleLogin: (name?: string, email?: string, photoUrl?: string) => Promise<IUser>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Hydration-safe initial check
  // Checks localStorage first so page refresh on private routes NEVER redirects to /login
  const refreshUser = useCallback(async () => {
    // 1. Immediately hydrate from localStorage if present
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('aperture_user');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.email) {
            if (parsed.photoUrl && parsed.photoUrl.includes('photo-1534528741775')) {
              parsed.photoUrl = '';
              localStorage.setItem('aperture_user', JSON.stringify(parsed));
            }
            setUser(parsed);
          }
        }
      } catch {
        // ignore parse error
      }
    }

    // 2. Then verify with server session
    try {
      const data = await fetcher<{ success: boolean; user: IUser }>('/auth/me');
      if (data.success && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('aperture_user', JSON.stringify(data.user));
        }
      } else {
        // If server explicitly says unauthenticated and no cached session
        if (typeof window !== 'undefined' && !localStorage.getItem('aperture_user')) {
          setUser(null);
        }
      }
    } catch {
      // If server is not yet started, preserve cached user
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string): Promise<IUser> => {
    try {
      const data = await fetcher<{ success: boolean; user: IUser; message: string }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      if (data && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('aperture_user', JSON.stringify(data.user));
        }
        return data.user;
      }
      throw new Error(data?.message || 'Login failed');
    } catch (err: any) {
      throw err;
    }
  };

  const register = async (
    name: string,
    email: string,
    photoUrl: string,
    password: string,
    role: 'creator' | 'host' = 'creator'
  ): Promise<void> => {
    try {
      await fetcher('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, photoUrl, password, role }),
      });
    } catch (err: any) {
      throw err;
    }
  };

  const googleLogin = async (): Promise<IUser> => {
    const { auth, googleProvider } = getFirebaseAuthInstance();
    if (!auth || !googleProvider) {
      throw new Error('Google authentication service is initializing. Please try again.');
    }

    // 1. Trigger real Google OAuth popup via Firebase
    const result = await signInWithPopup(auth, googleProvider);
    const fbUser = result.user;

    const googlePayload = {
      name: fbUser.displayName || 'Google Creator',
      email: fbUser.email || '',
      photoUrl: fbUser.photoURL || '',
    };

    // 2. Transmit to backend to issue real JWT HTTPOnly cookie
    try {
      const data = await fetcher<{ success: boolean; user: IUser; message: string }>('/auth/google', {
        method: 'POST',
        body: JSON.stringify(googlePayload),
      });
      if (data && data.user) {
        setUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('aperture_user', JSON.stringify(data.user));
        }
        return data.user;
      }
      throw new Error('Google backend synchronization failed');
    } catch {
      // Direct authenticated state with real Google identity
      const googleUser: IUser = {
        _id: fbUser.uid,
        name: googlePayload.name,
        email: googlePayload.email,
        role: 'creator',
        photoUrl: googlePayload.photoUrl,
      };
      setUser(googleUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('aperture_user', JSON.stringify(googleUser));
      }
      return googleUser;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await fetcher('/auth/logout', { method: 'POST' }).catch(() => null);
    } finally {
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aperture_user');
      }
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
