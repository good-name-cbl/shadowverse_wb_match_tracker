'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface SignupFormProps {
  onSwitchToLogin: () => void;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSwitchToLogin }) => {
  // localStorageから復元
  const [needsConfirmation, setNeedsConfirmation] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('signupNeedsConfirmation') === 'true';
    }
    return false;
  });

  const [registeredEmail, setRegisteredEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('signupRegisteredEmail') || '';
    }
    return '';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const { signup, confirmSignUp, isLoading } = useAuth();

  // localStorageに保存
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('signupNeedsConfirmation', String(needsConfirmation));
    }
  }, [needsConfirmation]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('signupRegisteredEmail', registeredEmail);
    }
  }, [registeredEmail]);

  const validatePassword = (password: string): string | null => {
    if (password.length < 8) {
      return 'パスワードは8文字以上で入力してください';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'パスワードは大文字・小文字・数字を含む必要があります';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('すべての項目を入力してください');
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError('パスワードが一致しません');
      return;
    }

    try {
      await signup(email, password);
    } catch (error: any) {
      if (error.message === 'CONFIRM_EMAIL_REQUIRED') {
        // localStorageに直接保存（コンポーネント破棄前に確実に保存）
        if (typeof window !== 'undefined') {
          localStorage.setItem('signupNeedsConfirmation', 'true');
          localStorage.setItem('signupRegisteredEmail', email);
        }
        setRegisteredEmail(email);
        setNeedsConfirmation(true);
        setSuccessMessage(
          'アカウントが作成されました。登録したメールアドレスに確認コードが送信されました。確認コードを入力してください。'
        );
      } else {
        setError(error.message || 'アカウント作成に失敗しました');
      }
    }
  };

  const handleConfirmSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!confirmationCode) {
      setError('確認コードを入力してください');
      return;
    }

    try {
      await confirmSignUp(registeredEmail, confirmationCode);
      setSuccessMessage(
        'アカウントが確認されました！ログイン画面に戻ってログインしてください。'
      );
      setTimeout(() => {
        // localStorageをクリア
        if (typeof window !== 'undefined') {
          localStorage.removeItem('authMode');
          localStorage.removeItem('signupNeedsConfirmation');
          localStorage.removeItem('signupRegisteredEmail');
        }
        onSwitchToLogin();
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'アカウントの確認に失敗しました');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {needsConfirmation ? 'メール確認' : '新規登録'}
        </h2>

        {!needsConfirmation ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />

            <Input
              label="パスワード"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="パスワード（8文字以上、大文字・小文字・数字を含む）"
              required
            />

            <Input
              label="パスワード確認"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワード確認"
              required
            />

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded">
                {successMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              アカウント作成
            </Button>
          </form>
        ) : (
          <form onSubmit={handleConfirmSignUp} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded mb-4">
              <p>{registeredEmail} に確認コードを送信しました。</p>
              <p className="mt-1">メールに記載された6桁の確認コードを入力してください。</p>
            </div>

            <Input
              label="確認コード"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="123456"
              required
              maxLength={6}
            />

            {error && (
              <div className="text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-800 text-sm p-3 rounded">
                {successMessage}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={isLoading}
            >
              確認する
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  // localStorageをクリア
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('signupNeedsConfirmation');
                    localStorage.removeItem('signupRegisteredEmail');
                  }
                  setNeedsConfirmation(false);
                  setRegisteredEmail('');
                  setConfirmationCode('');
                  setError('');
                  setSuccessMessage('');
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← 戻る
              </button>
            </div>
          </form>
        )}

        {!needsConfirmation && (
          <div className="mt-6 text-center">
            <div className="text-gray-600 text-sm">
              すでにアカウントをお持ちの方は{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                className="text-blue-600 hover:text-blue-800"
              >
                ログイン
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
