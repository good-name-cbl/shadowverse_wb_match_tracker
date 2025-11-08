'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthState, AuthAction, User } from '@/types';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession, resetPassword, confirmResetPassword, confirmSignUp, deleteUser } from 'aws-amplify/auth';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

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
  confirmSignUp: (email: string, code: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmResetPassword: (email: string, code: string, newPassword: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
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

  // 初回ロード時に認証状態を確認
  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();

      if (currentUser && session) {
        const user: User = {
          id: currentUser.userId,
          email: currentUser.signInDetails?.loginId || '',
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      // ユーザーが未ログインの場合
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const { isSignedIn } = await signIn({
        username: email,
        password,
      });

      if (isSignedIn) {
        const currentUser = await getCurrentUser();
        const user: User = {
          id: currentUser.userId,
          email: email,
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else {
        throw new Error('ログインに失敗しました');
      }
    } catch (error: any) {
      dispatch({ type: 'LOGIN_FAILURE' });

      // エラーメッセージの日本語化
      if (error.name === 'UserNotFoundException' || error.name === 'NotAuthorizedException') {
        throw new Error('メールアドレスまたはパスワードが正しくありません');
      } else if (error.name === 'UserNotConfirmedException') {
        throw new Error('メールアドレスが確認されていません。確認メールをご確認ください。');
      } else {
        throw new Error(error.message || 'ログインに失敗しました');
      }
    }
  };

  const signup = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'LOGIN_START' });

    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
          autoSignIn: true, // サインアップ後に自動ログイン
        },
      });

      // メール確認が必要な場合
      if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        // SET_LOADINGをdispatchしない（AuthPageが再マウントされるのを防ぐ）
        // UI側でメール確認の案内を表示
        throw new Error('CONFIRM_EMAIL_REQUIRED');
      }

      // 自動ログインが成功した場合
      if (isSignUpComplete) {
        const user: User = {
          id: userId || '',
          email,
          createdAt: new Date().toISOString(),
        };
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    } catch (error: any) {
      // エラーメッセージの日本語化
      if (error.message === 'CONFIRM_EMAIL_REQUIRED') {
        // メール確認が必要な場合は、LOGIN_FAILUREではなくSET_LOADINGのみ
        // （AuthPageの再マウントを防ぐため）
        dispatch({ type: 'SET_LOADING', payload: false });
        throw error; // そのまま伝播
      }

      dispatch({ type: 'LOGIN_FAILURE' });

      if (error.name === 'UsernameExistsException') {
        throw new Error('このメールアドレスは既に登録されています');
      } else if (error.name === 'InvalidPasswordException') {
        throw new Error('パスワードは8文字以上で、大文字、小文字、数字、記号を含む必要があります');
      } else if (error.name === 'InvalidParameterException') {
        throw new Error('入力内容に誤りがあります');
      } else {
        throw new Error(error.message || 'アカウント作成に失敗しました');
      }
    }
  };

  const handleConfirmSignUp = async (email: string, code: string): Promise<void> => {
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (isSignUpComplete) {
        // 確認完了後、自動ログインは行わない
        // ユーザーにログイン画面に戻るよう案内
        dispatch({ type: 'SET_LOADING', payload: false });
      } else {
        throw new Error('アカウントの確認に失敗しました');
      }
    } catch (error: any) {
      if (error.name === 'CodeMismatchException') {
        throw new Error('確認コードが正しくありません');
      } else if (error.name === 'ExpiredCodeException') {
        throw new Error('確認コードの有効期限が切れています');
      } else if (error.name === 'NotAuthorizedException') {
        throw new Error('このユーザーは既に確認済みです');
      } else {
        throw new Error(error.message || 'アカウントの確認に失敗しました');
      }
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut();
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error('Logout error:', error);
      // ログアウトは失敗してもローカル状態をクリア
      dispatch({ type: 'LOGOUT' });
    }
  };

  const handleResetPassword = async (email: string): Promise<void> => {
    try {
      await resetPassword({ username: email });
      // パスワードリセットコードがメールで送信される
    } catch (error: any) {
      if (error.name === 'UserNotFoundException') {
        throw new Error('このメールアドレスは登録されていません');
      } else if (error.name === 'LimitExceededException') {
        throw new Error('リクエストが多すぎます。しばらく待ってから再度お試しください。');
      } else {
        throw new Error(error.message || 'パスワードリセットに失敗しました');
      }
    }
  };

  const handleConfirmResetPassword = async (
    email: string,
    code: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword,
      });
    } catch (error: any) {
      if (error.name === 'CodeMismatchException') {
        throw new Error('確認コードが正しくありません');
      } else if (error.name === 'ExpiredCodeException') {
        throw new Error('確認コードの有効期限が切れています');
      } else if (error.name === 'InvalidPasswordException') {
        throw new Error('パスワードは8文字以上で、大文字、小文字、数字、記号を含む必要があります');
      } else {
        throw new Error(error.message || 'パスワードの変更に失敗しました');
      }
    }
  };

  const handleDeleteAccount = async (): Promise<void> => {
    try {
      // 1. 関連データを削除（デッキと対戦記録）
      // すべてのデッキを取得して削除
      const { data: decks } = await client.models.Deck.list();
      if (decks) {
        for (const deck of decks) {
          await client.models.Deck.delete({ id: deck.id });
        }
      }

      // すべての対戦記録を取得して削除
      const { data: records } = await client.models.MatchRecord.list();
      if (records) {
        for (const record of records) {
          await client.models.MatchRecord.delete({ id: record.id });
        }
      }

      // 2. Cognitoユーザーを削除
      await deleteUser();

      // 3. ローカル状態をクリア
      dispatch({ type: 'LOGOUT' });
    } catch (error: any) {
      if (error.name === 'NotAuthorizedException') {
        throw new Error('認証が必要です。再度ログインしてください。');
      } else if (error.name === 'UserNotFoundException') {
        throw new Error('ユーザーが見つかりません');
      } else {
        throw new Error(error.message || 'アカウントの削除に失敗しました');
      }
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    confirmSignUp: handleConfirmSignUp,
    logout,
    resetPassword: handleResetPassword,
    confirmResetPassword: handleConfirmResetPassword,
    deleteAccount: handleDeleteAccount,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
