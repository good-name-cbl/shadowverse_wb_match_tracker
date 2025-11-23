'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAuth } from '@/contexts/AuthContext';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { LandingPage } from '@/components/landing/LandingPage';
import { Layout } from '@/components/layout/Layout';
import { DeckSection } from '@/components/deck/DeckSection';
import { MatchSection } from '@/components/match/MatchSection';
import { StatsSection } from '@/components/stats/StatsSection';
import { DataMigrationModal } from '@/components/migration/DataMigrationModal';
import { Deck, MatchRecord, ClassType, Season } from '@/types';
import { hasLocalStorageData } from '@/utils/dataMigration';

const client = generateClient<Schema>();

type ActiveTab = 'decks' | 'matches' | 'stats';

export default function Home() {
  const { isAuthenticated, user, isLoading: authLoading } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [records, setRecords] = useState<MatchRecord[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentSeasonId, setCurrentSeasonId] = useState<string | null>(null);
  const [currentDeckId, setCurrentDeckId] = useLocalStorage<string | null>('currentDeckId', null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('decks');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showMigrationModal, setShowMigrationModal] = useState(false);

  // データの初期読み込み
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsDataLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsDataLoading(true);

        // Seasonsを取得
        const { data: seasonsData } = await client.models.Season.list();
        const fetchedSeasons: Season[] = (seasonsData || []).map((season) => ({
          id: season.id,
          name: season.name,
          startDate: season.startDate || undefined,
          endDate: season.endDate || undefined,
          createdAt: season.createdAt,
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSeasons(fetchedSeasons);

        // 最新シーズンを設定（createdAtが最も新しいもの）
        const latestSeason = fetchedSeasons[0];
        if (latestSeason) {
          setCurrentSeasonId(latestSeason.id);
        }

        // Decksを取得
        const { data: decksData } = await client.models.Deck.list();
        const fetchedDecks: Deck[] = (decksData || []).map((deck) => ({
          id: deck.id,
          userId: deck.userId,
          className: deck.className as ClassType,
          deckName: deck.deckName,
          createdAt: deck.createdAt || new Date().toISOString(),
        }));
        setDecks(fetchedDecks);

        // MatchRecordsを取得
        const { data: recordsData } = await client.models.MatchRecord.list();
        const fetchedRecords: MatchRecord[] = (recordsData || []).map((record) => ({
          id: record.id,
          userId: record.userId,
          myDeckId: record.myDeckId,
          seasonId: record.seasonId,
          opponentClass: record.opponentClass as ClassType,
          opponentDeckType: record.opponentDeckType,
          isFirstPlayer: record.isFirstPlayer,
          isWin: record.isWin,
          recordedAt: record.recordedAt,
        }));
        setRecords(fetchedRecords);

        // LocalStorageに移行可能なデータがあるかチェック
        if (hasLocalStorageData()) {
          setShowMigrationModal(true);
        }
      } catch (error) {
        console.error('データの取得に失敗しました:', error);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user]);

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

  if (!isAuthenticated || !user) {
    return <LandingPage />;
  }

  const currentDeck = currentDeckId ? decks.find(deck => deck.id === currentDeckId) || null : null;

  // 移行完了後のデータ再取得
  const handleMigrationComplete = async () => {
    if (!user) return;

    try {
      // Decksを再取得
      const { data: decksData } = await client.models.Deck.list();
      const fetchedDecks: Deck[] = (decksData || []).map((deck) => ({
        id: deck.id,
        userId: deck.userId,
        className: deck.className as ClassType,
        deckName: deck.deckName,
        createdAt: deck.createdAt || new Date().toISOString(),
      }));
      setDecks(fetchedDecks);

      // MatchRecordsを再取得
      const { data: recordsData } = await client.models.MatchRecord.list();
      const fetchedRecords: MatchRecord[] = (recordsData || []).map((record) => ({
        id: record.id,
        userId: record.userId,
        myDeckId: record.myDeckId,
        seasonId: record.seasonId,
        opponentClass: record.opponentClass as ClassType,
        opponentDeckType: record.opponentDeckType,
        isFirstPlayer: record.isFirstPlayer,
        isWin: record.isWin,
        recordedAt: record.recordedAt,
      }));
      setRecords(fetchedRecords);
    } catch (error) {
      console.error('データの再取得に失敗しました:', error);
    }
  };

  const handleAddDeck = async (className: ClassType, deckName: string) => {
    if (!user) return;

    try {
      // オプティミスティックUI: ローカル状態を先に更新
      const tempId = `temp-${Date.now()}`;
      const tempDeck: Deck = {
        id: tempId,
        userId: user.id,
        className,
        deckName,
        createdAt: new Date().toISOString(),
      };
      setDecks([...decks, tempDeck]);

      // DynamoDBに保存
      const { data: newDeck } = await client.models.Deck.create({
        userId: user.id,
        className,
        deckName,
        createdAt: new Date().toISOString(),
      });

      if (newDeck) {
        // 一時IDを実際のIDに置き換え
        setDecks((prevDecks) =>
          prevDecks.map((deck) =>
            deck.id === tempId
              ? {
                id: newDeck.id,
                userId: newDeck.userId,
                className: newDeck.className as ClassType,
                deckName: newDeck.deckName,
                createdAt: newDeck.createdAt || new Date().toISOString(),
              }
              : deck
          )
        );
      }
    } catch (error) {
      console.error('デッキの追加に失敗しました:', error);
      // エラー時は元に戻す
      setDecks(decks);
    }
  };

  const handleSelectDeck = (deck: Deck) => {
    setCurrentDeckId(deck.id);
  };

  const handleSelectDeckById = (deckId: string | null) => {
    setCurrentDeckId(deckId);
  };

  const handleDeleteDeck = async (deckId: string) => {
    try {
      // オプティミスティックUI: ローカル状態を先に更新
      const originalDecks = decks;
      const originalRecords = records;

      setDecks(decks.filter(deck => deck.id !== deckId));
      if (currentDeckId === deckId) {
        setCurrentDeckId(null);
      }
      const recordsToDelete = records.filter(record => record.myDeckId === deckId);
      setRecords(records.filter(record => record.myDeckId !== deckId));

      // DynamoDBから削除
      await client.models.Deck.delete({ id: deckId });

      // 関連する対戦記録も削除
      await Promise.all(
        recordsToDelete.map((record) =>
          client.models.MatchRecord.delete({ id: record.id })
        )
      );
    } catch (error) {
      console.error('デッキの削除に失敗しました:', error);
      // エラー時は元に戻す（再取得）
      const { data: decksData } = await client.models.Deck.list();
      const fetchedDecks: Deck[] = (decksData || []).map((deck) => ({
        id: deck.id,
        userId: deck.userId,
        className: deck.className as ClassType,
        deckName: deck.deckName,
        createdAt: deck.createdAt || new Date().toISOString(),
      }));
      setDecks(fetchedDecks);

      const { data: recordsData } = await client.models.MatchRecord.list();
      const fetchedRecords: MatchRecord[] = (recordsData || []).map((record) => ({
        id: record.id,
        userId: record.userId,
        myDeckId: record.myDeckId,
        seasonId: record.seasonId,
        opponentClass: record.opponentClass as ClassType,
        opponentDeckType: record.opponentDeckType,
        isFirstPlayer: record.isFirstPlayer,
        isWin: record.isWin,
        recordedAt: record.recordedAt,
      }));
      setRecords(fetchedRecords);
    }
  };

  const handleAddRecord = async (matchData: {
    opponentClass: ClassType;
    opponentDeckType: string;
    isFirstPlayer: boolean;
    isWin: boolean;
  }) => {
    if (!currentDeck || !user || !currentSeasonId) return;

    try {
      // オプティミスティックUI: ローカル状態を先に更新
      const tempId = `temp-${Date.now()}`;
      const recordedAt = new Date().toISOString();
      const tempRecord: MatchRecord = {
        id: tempId,
        userId: user.id,
        myDeckId: currentDeck.id,
        seasonId: currentSeasonId,
        ...matchData,
        recordedAt,
      };
      setRecords([tempRecord, ...records]);

      // DynamoDBに保存
      const { data: newRecord } = await client.models.MatchRecord.create({
        userId: user.id,
        myDeckId: currentDeck.id,
        seasonId: currentSeasonId,
        opponentClass: matchData.opponentClass,
        opponentDeckType: matchData.opponentDeckType,
        isFirstPlayer: matchData.isFirstPlayer,
        isWin: matchData.isWin,
        recordedAt,
      });

      if (newRecord) {
        // 一時IDを実際のIDに置き換え
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === tempId
              ? {
                id: newRecord.id,
                userId: newRecord.userId,
                myDeckId: newRecord.myDeckId,
                seasonId: newRecord.seasonId,
                opponentClass: newRecord.opponentClass as ClassType,
                opponentDeckType: newRecord.opponentDeckType,
                isFirstPlayer: newRecord.isFirstPlayer,
                isWin: newRecord.isWin,
                recordedAt: newRecord.recordedAt,
              }
              : record
          )
        );
      }
    } catch (error) {
      console.error('対戦記録の追加に失敗しました:', error);
      // エラー時は元に戻す
      setRecords(records);
    }
  };

  const handleDeleteRecord = async (recordId: string) => {
    try {
      // オプティミスティックUI: ローカル状態を先に更新
      const originalRecords = records;
      setRecords(records.filter(record => record.id !== recordId));

      // DynamoDBから削除
      await client.models.MatchRecord.delete({ id: recordId });
    } catch (error) {
      console.error('対戦記録の削除に失敗しました:', error);
      // エラー時は元に戻す（再取得）
      const { data: recordsData } = await client.models.MatchRecord.list();
      const fetchedRecords: MatchRecord[] = (recordsData || []).map((record) => ({
        id: record.id,
        userId: record.userId,
        myDeckId: record.myDeckId,
        seasonId: record.seasonId,
        opponentClass: record.opponentClass as ClassType,
        opponentDeckType: record.opponentDeckType,
        isFirstPlayer: record.isFirstPlayer,
        isWin: record.isWin,
        recordedAt: record.recordedAt,
      }));
      setRecords(fetchedRecords);
    }
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

      <Layout currentDeck={currentDeck}>
        <div className="space-y-4 sm:space-y-6">
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
              onDeleteDeck={handleDeleteDeck}
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
    </>
  );
}
