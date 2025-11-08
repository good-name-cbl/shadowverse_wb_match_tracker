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
  const [step, setStep] = useState<'email' | 'confirm'>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { resetPassword, confirmResetPassword } = useAuth();

  const handleRequestReset = async (e: React.FormEvent) => {
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
      setStep('confirm');
    } catch (error: any) {
      setError(error.message || 'パスワードリセットに失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!code || !newPassword || !confirmNewPassword) {
      setError('すべての項目を入力してください');
      setIsLoading(false);
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('パスワードが一致しません');
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError('パスワードは8文字以上で入力してください');
      setIsLoading(false);
      return;
    }

    try {
      await confirmResetPassword(email, code, newPassword);
      setIsSuccess(true);
    } catch (error: any) {
      setError(error.message || 'パスワードの変更に失敗しました');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            パスワード変更完了
          </h2>

          <div className="text-center space-y-4">
            <div className="text-green-600">
              パスワードの変更が完了しました。
            </div>

            <div className="text-gray-600 text-sm">
              新しいパスワードでログインしてください。
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

  if (step === 'confirm') {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
            新しいパスワードを設定
          </h2>

          <form onSubmit={handleConfirmReset} className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 text-sm p-3 rounded">
              メールに送信された確認コードと新しいパスワードを入力してください。
            </div>

            <Input
              label="確認コード"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="メールに送信された6桁のコード"
              required
            />

            <Input
              label="新しいパスワード"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="パスワード（8文字以上、大文字・小文字・数字・記号を含む）"
              required
            />

            <Input
              label="新しいパスワード確認"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="パスワード確認"
              required
            />

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
              パスワードを変更
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
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          パスワードリセット
        </h2>

        <form onSubmit={handleRequestReset} className="space-y-4">
          <Input
            label="メールアドレス"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            required
          />

          <div className="text-gray-600 text-sm">
            登録されたメールアドレスにパスワードリセット用の確認コードを送信します。
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
            確認コードを送信
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
