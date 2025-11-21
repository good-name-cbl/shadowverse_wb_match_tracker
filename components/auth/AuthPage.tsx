'use client';

import React, { useState, useEffect } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ResetPasswordForm } from './ResetPasswordForm';

type AuthMode = 'login' | 'signup' | 'reset';

export const AuthPage: React.FC = () => {
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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-fuchsia-600/20 blur-[100px]" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-2">
            Shadowverse Record
          </h1>
          <p className="text-slate-400">
            対戦結果を記録して勝率を分析しよう
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
    </div>
  );
};
