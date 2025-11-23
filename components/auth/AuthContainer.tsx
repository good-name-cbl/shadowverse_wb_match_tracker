'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ResetPasswordForm } from './ResetPasswordForm';

type AuthMode = 'login' | 'signup' | 'reset';

export const AuthContainer: React.FC = () => {
  // localStorageからmodeを復元（デフォルトはlogin）
  const [mode, setMode] = useState<AuthMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('authMode');
      return (saved as AuthMode) || 'login';
    }
    return 'login';
  });

  // modeが変わったらlocalStorageに保存
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authMode', mode);
    }
  }, [mode]);

  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-2">
          {mode === 'login' && 'おかえりなさい'}
          {mode === 'signup' && 'アカウント作成'}
          {mode === 'reset' && 'パスワード再設定'}
        </h2>
        <p className="text-slate-400">
          {mode === 'login' && 'アカウントにログインして記録を始めましょう'}
          {mode === 'signup' && '新しいアカウントを作成してデータを保存しましょう'}
          {mode === 'reset' && '登録したメールアドレスを入力してください'}
        </p>
      </div>

      {mode === 'login' && (
        <LoginForm
          onSwitchToSignup={() => setMode('signup')}
          onSwitchToReset={() => setMode('reset')}
        />
      )}

      {mode === 'signup' && (
        <SignupForm
          onSwitchToLogin={() => setMode('login')}
        />
      )}

      {mode === 'reset' && (
        <ResetPasswordForm
          onSwitchToLogin={() => setMode('login')}
        />
      )}
    </div>
  );
};
