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
  const formRef = React.useRef<HTMLDivElement>(null);

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

  // エラー時にフォームの上部にスクロール
  React.useEffect(() => {
    if (error && formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [error]);

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
        console.error('アカウント作成エラー:', error);
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
      console.error('確認コードエラー:', error);
      setError(error.message || 'アカウントの確認に失敗しました');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div ref={formRef} className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {needsConfirmation ? 'メール確認' : '新規登録'}
        </h2>

        {!needsConfirmation ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* エラー表示 - より目立つデザイン */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 成功メッセージ */}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <Input
              label="メールアドレス"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              required
            />

            <div>
              <Input
                label="パスワード"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="8文字以上で入力してください"
                required
              />
              {/* パスワードポリシーのヘルプテキスト */}
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-3 rounded-md">
                <p className="font-medium mb-1">パスワードの要件:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>8文字以上</li>
                  <li>大文字を含む（A-Z）</li>
                  <li>小文字を含む（a-z）</li>
                  <li>数字を含む（0-9）</li>
                  <li>記号を含む（!@#$%など）</li>
                </ul>
              </div>
            </div>

            <Input
              label="パスワード確認"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="パスワードを再入力してください"
              required
            />

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
            {/* エラー表示 */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-red-800">
                      {error}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* 成功メッセージ */}
            {successMessage && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">
                      {successMessage}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded">
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
