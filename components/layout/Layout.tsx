'use client';

import React from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  currentDeck?: { className: string; deckName: string } | null;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentDeck }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header currentDeck={currentDeck} />
      <main className="flex-1 max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 w-full">
        {children}
      </main>
      <Footer />
    </div>
  );
};
