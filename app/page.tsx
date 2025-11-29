'use client';

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useHybridData } from '@/hooks/useHybridData';
import { Layout } from '@/components/layout/Layout';
import { DeckSection } from '@/components/deck/DeckSection';
import { MatchSection } from '@/components/match/MatchSection';
import { StatsSection } from '@/components/stats/StatsSection';
import { DataMigrationModal } from '@/components/migration/DataMigrationModal';
import { EditMatchRecordModal } from '@/components/match/EditMatchRecordModal';
import { LoginPrompt } from '@/components/auth/LoginPrompt';
import { Deck, MatchRecord } from '@/types';

type ActiveTab = 'decks' | 'matches' | 'stats';

export default function Home() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [currentDeckId, setCurrentDeckId] = useLocalStorage<string | null>('currentDeckId', null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('decks');
  const [editingRecord, setEditingRecord] = useState<MatchRecord | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // ハイブリッドデータフック（認証状態に応じて自動切り替え）
  const {
    decks,
    records,
    currentSeasonId,
    isDataLoading,
    handleAddDeck,
    handleDeleteDeck,
    handleAddRecord,
    handleDeleteRecord,
    handleUpdateRecord,
    showMigrationModal,
    setShowMigrationModal,
    handleMigrationComplete,
    isUsingLocalStorage,
  } = useHybridData();

  if (authLoading || isDataLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
          <p className="text-slate-400">読み込み中...</p>
        </div>
      </div>
    );
  }

  const currentDeck = currentDeckId ? decks.find(deck => deck.id === currentDeckId) || null : null;

  const handleSelectDeck = (deck: Deck) => {
    setCurrentDeckId(deck.id);
  };

  const handleSelectDeckById = (deckId: string | null) => {
    setCurrentDeckId(deckId);
  };

  // デッキ削除時にcurrentDeckIdもクリア
  const handleDeleteDeckWithCleanup = async (deckId: string) => {
    if (currentDeckId === deckId) {
      setCurrentDeckId(null);
    }
    await handleDeleteDeck(deckId);
  };

  // 対戦記録追加のラッパー
  const handleAddRecordWrapper = async (matchData: {
    opponentClass: any;
    opponentDeckType: string;
    isFirstPlayer: boolean;
    isWin: boolean;
  }) => {
    if (!currentDeck) return;
    await handleAddRecord(currentDeck.id, matchData);
  };

  const tabButtons = [
    { id: 'decks' as const, label: 'デッキ管理', icon: '🃏' },
    { id: 'matches' as const, label: '対戦記録', icon: '⚔️' },
    { id: 'stats' as const, label: '統計情報', icon: '📊' },
  ];

  return (
    <>
      {showMigrationModal && user && (
        <DataMigrationModal
          userId={user.id}
          seasonId={currentSeasonId}
          onClose={() => setShowMigrationModal(false)}
          onMigrationComplete={handleMigrationComplete}
        />
      )}

      <EditMatchRecordModal
        isOpen={editingRecord !== null}
        record={editingRecord}
        onClose={() => setEditingRecord(null)}
        onUpdate={handleUpdateRecord}
      />

      <Layout currentDeck={currentDeck} isUsingLocalStorage={isUsingLocalStorage}>
        <div className="space-y-4 sm:space-y-6">
          {/* 未ログイン時のログイン促進バナー */}
          {isUsingLocalStorage && (
            <LoginPrompt />
          )}

          <div className="glass rounded-xl p-1 border border-white/5">
            <nav className="flex space-x-1">
              {tabButtons.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex flex-col items-center justify-center px-2 py-3 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-900/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
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
              seasonId={currentSeasonId}
              onAddDeck={handleAddDeck}
              onSelectDeck={handleSelectDeck}
              onDeleteDeck={handleDeleteDeckWithCleanup}
            />
          )}

          {activeTab === 'matches' && (
            <MatchSection
              currentDeck={currentDeck}
              currentDeckId={currentDeckId}
              seasonId={currentSeasonId}
              records={records}
              decks={decks}
              onSelectDeck={handleSelectDeckById}
              onAddRecord={handleAddRecordWrapper}
              onDeleteRecord={handleDeleteRecord}
              onEditRecord={setEditingRecord}
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
    </>
  );
}
