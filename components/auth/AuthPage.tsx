'use client';

import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { ResetPasswordForm } from './ResetPasswordForm';

type AuthMode = 'login' | 'signup' | 'reset';

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            シャドウバース対戦記録
          </h1>
          <p className="text-gray-600">
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
