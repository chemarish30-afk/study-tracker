'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authResolver, AuthResolution } from './auth-resolver';

interface User {
  id: number;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  studentId: number | null;
  allowedExamCourseIds: number[];
  loading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [studentId, setStudentId] = useState<number | null>(null);
  const [allowedExamCourseIds, setAllowedExamCourseIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const isAuthenticated = !!user;

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setStudentId(null);
    setAllowedExamCourseIds([]);
    localStorage.removeItem('jwt');
    localStorage.removeItem('user');
    authResolver.clearCache();
    router.push('/signin');
  };

  const refreshAuth = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const resolution = await authResolver.resolveUser(user);
      
      setStudentId(resolution.studentId);
      setAllowedExamCourseIds(resolution.allowedExamCourseIds);

      // Handle redirects based on resolution
      const currentPath = window.location.pathname;
      
      switch (resolution.redirectTo) {
        case 'onboarding':
          if (currentPath !== '/learning') {
            router.push('/learning');
          }
          break;
        case 'choose-exam':
          if (currentPath !== '/choose-exam') {
            router.push('/choose-exam');
          }
          break;
        case 'dashboard':
          if (currentPath !== '/dashboard') {
            router.push('/dashboard');
          }
          break;
      }
    } catch (error) {
      console.error('Auth refresh error:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const jwt = localStorage.getItem('jwt');
        const userData = localStorage.getItem('user');

        if (!jwt || !userData) {
          setLoading(false);
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // Resolve auth status
        const resolution = await authResolver.resolveUser(parsedUser);
        setStudentId(resolution.studentId);
        setAllowedExamCourseIds(resolution.allowedExamCourseIds);

        // Handle initial redirect
        const currentPath = window.location.pathname;
        
        switch (resolution.redirectTo) {
          case 'onboarding':
            if (currentPath !== '/learning') {
              router.push('/learning');
            }
            break;
          case 'choose-exam':
            if (currentPath !== '/choose-exam') {
              router.push('/choose-exam');
            }
            break;
          case 'dashboard':
            if (currentPath !== '/dashboard') {
              router.push('/dashboard');
            }
            break;
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [router]);

  const value: AuthContextType = {
    user,
    studentId,
    allowedExamCourseIds,
    loading,
    isAuthenticated,
    login,
    logout,
    refreshAuth,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
