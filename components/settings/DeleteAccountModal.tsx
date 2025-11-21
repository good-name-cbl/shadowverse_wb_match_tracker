'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const { deleteAccount } = useAuth();

  if (!isOpen) return null;

  const handleDelete = async () => {
    setError('');
    setIsDeleting(true);

    try {
      await deleteAccount();
      // 削除成功後、自動的にログアウトして認証画面に戻る
    } catch (error: any) {
      setError(error.message || 'アカウントの削除に失敗しました');
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="glass-card rounded-xl max-w-md w-full mx-4">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            アカウントを削除
          </h2>

          <div className="mb-6">
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
              <p className="text-red-400 font-semibold mb-2">
                ⚠️ 警告：この操作は取り消せません
              </p>
              <p className="text-red-400/80 text-sm">
                アカウントを削除すると、以下のデータが完全に削除されます：
              </p>
              <ul className="list-disc list-inside text-red-400/80 text-sm mt-2 space-y-1">
                <li>アカウント情報</li>
                <li>登録したすべてのデッキ</li>
                <li>すべての対戦記録</li>
                <li>統計データ</li>
              </ul>
            </div>

            <p className="text-slate-300 text-sm">
              本当にアカウントを削除してもよろしいですか？
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
              disabled={isDeleting}
            >
              キャンセル
            </Button>
            <Button
              onClick={handleDelete}
              variant="danger"
              className="flex-1"
              isLoading={isDeleting}
              disabled={isDeleting}
            >
              削除する
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
