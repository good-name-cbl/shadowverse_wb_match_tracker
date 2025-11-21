'use client';

import React from 'react';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
  currentDeck?: { className: string; deckName: string } | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentDeck }) => {
  return (
    <div className="min-h-screen">
      <Header currentDeck={currentDeck} />
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {children}
      </main>
    </div>
  );
};
