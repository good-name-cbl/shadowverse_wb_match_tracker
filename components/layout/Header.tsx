'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/utils/auth';
import { Button } from '@/components/ui/Button';
import { DeleteAccountModal } from '@/components/settings/DeleteAccountModal';

interface HeaderProps {
  currentDeck?: { className: string; deckName: string } | null;
}

export const Header: React.FC<HeaderProps> = ({ currentDeck }) => {
  const { user, logout } = useAuth();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const userIsAdmin = isAdmin(user?.email);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-fuchsia-400">
              Shadowverse Record
            </h1>
            {currentDeck && (
              <div className="hidden sm:block bg-slate-800/50 border border-slate-700 px-3 py-1 rounded-full backdrop-blur-sm">
                <span className="text-sm text-slate-300">
                  <span className="text-slate-500 mr-2">使用中</span>
                  <span className="font-medium text-violet-300">{currentDeck.className}</span>
                  <span className="mx-2 text-slate-600">|</span>
                  <span className="text-slate-200">{currentDeck.deckName}</span>
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* 全体統計リンク */}
            <Link
              href="/stats"
              className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <span>📈</span>
              <span>全体統計</span>
            </Link>

            {/* 管理画面リンク（管理者のみ） */}
            {userIsAdmin && (
              <>
                <Link
                  href="/admin/seasons"
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <span>⚙️</span>
                  <span>シーズン管理</span>
                </Link>
                <Link
                  href="/admin/templates"
                  className="hidden sm:flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <span>📋</span>
                  <span>テンプレート管理</span>
                </Link>
              </>
            )}

            {user && (
              <>
                <span className="text-sm text-slate-400 hidden md:block">
                  {user.email}
                </span>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="text-sm text-red-400/70 hover:text-red-400 underline hidden md:block transition-colors"
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
        <div className="sm:hidden pb-3 flex items-center justify-between border-t border-white/5 pt-3">
          {currentDeck && (
            <div className="bg-slate-800/50 border border-slate-700 px-3 py-1 rounded-full backdrop-blur-sm">
              <span className="text-xs text-slate-300">
                <span className="font-medium text-violet-300">{currentDeck.className}</span>
                <span className="mx-1 text-slate-600">-</span>
                {currentDeck.deckName}
              </span>
            </div>
          )}
          <div className="flex items-center space-x-2 ml-auto">
            <Link
              href="/stats"
              className="flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <span>📈</span>
              <span>全体統計</span>
            </Link>
            {userIsAdmin && (
              <>
                <Link
                  href="/admin/seasons"
                  className="flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <span>⚙️</span>
                  <span>シーズン</span>
                </Link>
                <Link
                  href="/admin/templates"
                  className="flex items-center space-x-1 px-3 py-1.5 text-slate-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200 text-sm font-medium"
                >
                  <span>📋</span>
                  <span>テンプレート</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </header>
  );
};
