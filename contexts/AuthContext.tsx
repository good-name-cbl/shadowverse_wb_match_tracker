'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthAction, User } from '@/types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  isLoading: true,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, isLoading: true };
    case 'LOGIN_SUCCESS':
      return {
        isAuthenticated: true,
        user: action.payload,
        isLoading: false
      };
    case 'LOGIN_FAILURE':
      return {
        isAuthenticated: false,
        user: null,
        isLoading: false
      };
    case 'LOGOUT':
      return {
        isAuthenticated: false,
        user: null,
        isLoading: false
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user: User = JSON.parse(savedUser);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } else {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: Date.now().toString(),
        email,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user: User = {
        id: Date.now().toString(),
        email,
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem('user', JSON.stringify(user));
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE' });
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const resetPassword = async (email: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
