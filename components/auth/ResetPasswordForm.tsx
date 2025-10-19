'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface ResetPasswordFormProps {
  onSwitchToLogin: () => void;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSwitchToLogin,
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email) {
      setError('メールアドレスを入力してください');
      setIsLoading(false);
      return;
    }

    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      setError('パスワードリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            送信完了
          </h2>

          <div className="text-center space-y-4">
            <div className="text-green-600">
              パスワードリセット用のリンクをメールアドレスに送信しました。
            </div>

            <div className="text-gray-600 text-sm">
              メールを確認して、リンクからパスワードを再設定してください。
            </div>

            <Button
              onClick={onSwitchToLogin}
              className="w-full"
            >
              ログイン画面に戻る
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          パスワードリセット
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />

          <div className="text-gray-600 text-sm">
            登録されたメールアドレスにパスワードリセット用のリンクを送信します。
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            リセットリンクを送信
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ログイン画面に戻る
          </button>
        </div>
      </div>
    </div>
  );
};
