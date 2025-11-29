'use client';

import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Deck, MatchRecord, ClassType } from '@/types';

// UUIDの簡易生成（外部依存なし）
const generateId = () =>
  `local-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export interface MatchRecordInput {
  opponentClass: ClassType;
  opponentDeckType: string;
  isFirstPlayer: boolean;
  isWin: boolean;
}

export interface LocalStorageDataState {
  decks: Deck[];
  records: MatchRecord[];
  isDataLoading: boolean;
  handleAddDeck: (className: ClassType, deckName: string) => Promise<void>;
  handleDeleteDeck: (deckId: string) => Promise<void>;
  handleAddRecord: (currentDeckId: string, matchData: MatchRecordInput) => Promise<void>;
  handleDeleteRecord: (recordId: string) => Promise<void>;
  handleUpdateRecord: (recordId: string, updatedData: MatchRecordInput) => Promise<void>;
  showMigrationModal: boolean;
  setShowMigrationModal: (show: boolean) => void;
  handleMigrationComplete: () => Promise<void>;
}

/**
 * LocalStorageをデータソースとするフック（未ログイン時用）
 */
export function useLocalStorageData(seasonId: string | null): LocalStorageDataState {
  const [decks, setDecks] = useLocalStorage<Deck[]>('decks', []);
  const [records, setRecords] = useLocalStorage<MatchRecord[]>('records', []);

  const handleAddDeck = useCallback(
    async (className: ClassType, deckName: string) => {
      const newDeck: Deck = {
        id: generateId(),
        userId: 'local',
        className,
        deckName,
        createdAt: new Date().toISOString(),
      };
      setDecks((prevDecks) => [...prevDecks, newDeck]);
    },
    [setDecks]
  );

  const handleDeleteDeck = useCallback(
    async (deckId: string) => {
      setDecks((prevDecks) => prevDecks.filter((d) => d.id !== deckId));
      setRecords((prevRecords) => prevRecords.filter((r) => r.myDeckId !== deckId));
    },
    [setDecks, setRecords]
  );

  const handleAddRecord = useCallback(
    async (currentDeckId: string, matchData: MatchRecordInput) => {
      if (!seasonId) {
        console.error('シーズンIDが設定されていません');
        return;
      }

      const newRecord: MatchRecord = {
        id: generateId(),
        userId: 'local',
        myDeckId: currentDeckId,
        seasonId,
        opponentClass: matchData.opponentClass,
        opponentDeckType: matchData.opponentDeckType,
        isFirstPlayer: matchData.isFirstPlayer,
        isWin: matchData.isWin,
        recordedAt: new Date().toISOString(),
      };
      setRecords((prevRecords) => [newRecord, ...prevRecords]);
    },
    [seasonId, setRecords]
  );

  const handleDeleteRecord = useCallback(
    async (recordId: string) => {
      setRecords((prevRecords) => prevRecords.filter((r) => r.id !== recordId));
    },
    [setRecords]
  );

  const handleUpdateRecord = useCallback(
    async (recordId: string, updatedData: MatchRecordInput) => {
      setRecords((prevRecords) =>
        prevRecords.map((r) =>
          r.id === recordId ? { ...r, ...updatedData } : r
        )
      );
    },
    [setRecords]
  );

  // LocalStorageモードでは移行モーダルは表示しない
  const showMigrationModal = false;
  const setShowMigrationModal = useCallback(() => {}, []);
  const handleMigrationComplete = useCallback(async () => {}, []);

  return {
    decks,
    records,
    isDataLoading: false, // LocalStorageは同期的に読み込まれる
    handleAddDeck,
    handleDeleteDeck,
    handleAddRecord,
    handleDeleteRecord,
    handleUpdateRecord,
    showMigrationModal,
    setShowMigrationModal,
    handleMigrationComplete,
  };
}
