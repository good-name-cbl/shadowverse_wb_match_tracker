'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { AuthPage } from '@/components/auth/AuthPage';
import { Layout } from '@/components/layout/Layout';
import { DeckSection } from '@/components/deck/DeckSection';
import { MatchSection } from '@/components/match/MatchSection';
import { StatsSection } from '@/components/stats/StatsSection';
import { Deck, MatchRecord, ClassType } from '@/types';

type ActiveTab = 'decks' | 'matches' | 'stats';

export default function Home() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [decks, setDecks] = useLocalStorage<Deck[]>('decks', []);
  const [records, setRecords] = useLocalStorage<MatchRecord[]>('records', []);
  const [currentDeckId, setCurrentDeckId] = useLocalStorage<string | null>('currentDeckId', null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('decks');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <AuthPage />;
  }

  const currentDeck = currentDeckId ? decks.find(deck => deck.id === currentDeckId) || null : null;

  const handleAddDeck = (className: ClassType, deckName: string) => {
    const newDeck: Deck = {
      id: Date.now().toString(),
      userId: user.id,
      className,
      deckName,
      createdAt: new Date().toISOString(),
    };
    setDecks([...decks, newDeck]);
  };

  const handleSelectDeck = (deck: Deck) => {
    setCurrentDeckId(deck.id);
  };

  const handleSelectDeckById = (deckId: string | null) => {
    setCurrentDeckId(deckId);
  };

  const handleDeleteDeck = (deckId: string) => {
    setDecks(decks.filter(deck => deck.id !== deckId));
    if (currentDeckId === deckId) {
      setCurrentDeckId(null);
    }
    setRecords(records.filter(record => record.myDeckId !== deckId));
  };

  const handleAddRecord = (matchData: {
    opponentClass: ClassType;
    opponentDeckType: string;
    isFirstPlayer: boolean;
    isWin: boolean;
  }) => {
    if (!currentDeck) return;

    const newRecord: MatchRecord = {
      id: Date.now().toString(),
      userId: user.id,
      myDeckId: currentDeck.id,
      ...matchData,
      recordedAt: new Date().toISOString(),
    };
    setRecords([newRecord, ...records]);
  };

  const handleDeleteRecord = (recordId: string) => {
    setRecords(records.filter(record => record.id !== recordId));
  };

  const tabButtons = [
    { id: 'decks' as const, label: 'デッキ管理', icon: '🃏' },
    { id: 'matches' as const, label: '対戦記録', icon: '⚔️' },
    { id: 'stats' as const, label: '統計情報', icon: '📊' },
  ];

  return (
    <Layout currentDeck={currentDeck}>
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
          <nav className="flex space-x-1">
            {tabButtons.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center px-2 py-3 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl sm:text-lg mb-1">{tab.icon}</span>
                <span className="text-xs sm:text-sm leading-tight">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {activeTab === 'decks' && (
          <DeckSection
            decks={decks}
            currentDeckId={currentDeckId}
            onAddDeck={handleAddDeck}
            onSelectDeck={handleSelectDeck}
            onDeleteDeck={handleDeleteDeck}
          />
        )}

        {activeTab === 'matches' && (
          <MatchSection
            currentDeck={currentDeck}
            currentDeckId={currentDeckId}
            records={records}
            decks={decks}
            onSelectDeck={handleSelectDeckById}
            onAddRecord={handleAddRecord}
            onDeleteRecord={handleDeleteRecord}
          />
        )}

        {activeTab === 'stats' && (
          <StatsSection
            records={records}
            decks={decks}
          />
        )}
      </div>
    </Layout>
  );
}
