'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface HeaderProps {
  currentDeck?: { className: string; deckName: string } | null;
}

export const Header: React.FC<HeaderProps> = ({ currentDeck }) => {
  const { user, logout } = useAuth();

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
            {user && (
              <>
                <span className="text-sm hidden sm:block">
                  {user.email}
                </span>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={logout}
                >
                  ログアウト
                </Button>
              </>
            )}
          </div>
        </div>

        {currentDeck && (
          <div className="sm:hidden pb-3">
            <div className="bg-blue-700 px-3 py-1 rounded-md inline-block">
              <span className="text-sm">
                使用中: {currentDeck.className} - {currentDeck.deckName}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
