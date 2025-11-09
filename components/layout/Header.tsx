'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';

interface HeaderProps {
  currentDeck?: { className: string; deckName: string } | null;
}

export const Header: React.FC<HeaderProps> = ({ currentDeck }) => {
  const { user, logout } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold">シャドウバース対戦記録</h1>
            {currentDeck && (
              <div className="hidden sm:block bg-blue-700 px-3 py-1 rounded-md">
                <span className="text-sm">
                  使用中: {currentDeck.className} - {currentDeck.deckName}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* 全体統計リンク */}
            <Link
              href="/stats"
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-md transition-colors text-sm font-medium"
            >
              <span>📈</span>
              <span>全体統計</span>
            </Link>

            {user && (
              <>
                <span className="text-sm hidden md:block">
                  {user.email}
                </span>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-sm text-red-200 hover:text-red-100 underline hidden md:block"
                >
                  アカウント削除
                </button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleLogout}
                >
                  ログアウト
                </Button>
              </>
            )}
          </div>
        </div>

        {/* モバイル版の追加情報 */}
        <div className="sm:hidden pb-3 flex items-center justify-between">
          {currentDeck && (
            <div className="bg-blue-700 px-3 py-1 rounded-md inline-block">
              <span className="text-sm">
                使用中: {currentDeck.className} - {currentDeck.deckName}
              </span>
            </div>
          )}
          <Link
            href="/stats"
            className="flex items-center space-x-1 px-3 py-1.5 bg-blue-700 hover:bg-blue-800 rounded-md transition-colors text-sm font-medium ml-auto"
          >
            <span>📈</span>
            <span>全体統計</span>
          </Link>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </header>
  );
};
