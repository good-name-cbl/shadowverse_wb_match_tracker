'use client';

import { useMemo, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSeasonData } from './useSeasonData';
import { useLocalStorageData, MatchRecordInput } from './useLocalStorageData';
import { useDynamoDBData } from './useDynamoDBData';
import { Deck, MatchRecord, Season, ClassType } from '@/types';

export interface HybridDataState {
  // データ
  decks: Deck[];
  records: MatchRecord[];
  seasons: Season[];
  currentSeasonId: string | null;

  // ローディング状態
  isDataLoading: boolean;
  isSeasonLoading: boolean;

  // デッキ操作
  handleAddDeck: (className: ClassType, deckName: string) => Promise<void>;
  handleDeleteDeck: (deckId: string) => Promise<void>;

  // 対戦記録操作
  handleAddRecord: (currentDeckId: string, matchData: MatchRecordInput) => Promise<void>;
  handleDeleteRecord: (recordId: string) => Promise<void>;
  handleUpdateRecord: (recordId: string, updatedData: MatchRecordInput) => Promise<void>;

  // 移行関連
  showMigrationModal: boolean;
  setShowMigrationModal: (show: boolean) => void;
  handleMigrationComplete: () => Promise<void>;

  // データソース情報
  isUsingLocalStorage: boolean;
}

/**
 * 認証状態に応じてデータソースを切り替える統合フック
 * - 未ログイン時: LocalStorage
 * - ログイン時: DynamoDB
 * - シーズン情報: 常にDynamoDB（publicApiKey）
 */
export function useHybridData(): HybridDataState {
  const { isAuthenticated, user } = useAuth();

  // シーズンは常にDynamoDBから取得（publicApiKey）
  const { seasons, currentSeasonId, isLoading: isSeasonLoading } = useSeasonData();

  // 両方のデータソースを準備（使用するのは片方のみ）
  const localStorageData = useLocalStorageData(currentSeasonId);
  const dynamoDBData = useDynamoDBData(user?.id, currentSeasonId);

  // 認証状態に応じてデータソースを選択
  const isUsingLocalStorage = !isAuthenticated || !user;

  const dataSource = useMemo(() => {
    return isUsingLocalStorage ? localStorageData : dynamoDBData;
  }, [isUsingLocalStorage, localStorageData, dynamoDBData]);

  return {
    // データ
    decks: dataSource.decks,
    records: dataSource.records,
    seasons,
    currentSeasonId,

    // ローディング状態
    isDataLoading: isSeasonLoading || dataSource.isDataLoading,
    isSeasonLoading,

    // デッキ操作
    handleAddDeck: dataSource.handleAddDeck,
    handleDeleteDeck: dataSource.handleDeleteDeck,

    // 対戦記録操作
    handleAddRecord: dataSource.handleAddRecord,
    handleDeleteRecord: dataSource.handleDeleteRecord,
    handleUpdateRecord: dataSource.handleUpdateRecord,

    // 移行関連
    showMigrationModal: dataSource.showMigrationModal,
    setShowMigrationModal: dataSource.setShowMigrationModal,
    handleMigrationComplete: dataSource.handleMigrationComplete,

    // データソース情報
    isUsingLocalStorage,
  };
}
