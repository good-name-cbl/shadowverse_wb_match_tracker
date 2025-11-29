'use client';

import { useState, useEffect, useCallback } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Deck, MatchRecord, ClassType } from '@/types';
import { hasLocalStorageData } from '@/utils/dataMigration';

const client = generateClient<Schema>();

export interface MatchRecordInput {
  opponentClass: ClassType;
  opponentDeckType: string;
  isFirstPlayer: boolean;
  isWin: boolean;
}

export interface DynamoDBDataState {
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
 * DynamoDBをデータソースとするフック（ログイン時用）
 */
export function useDynamoDBData(
  userId: string | undefined,
  seasonId: string | null
): DynamoDBDataState {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [records, setRecords] = useState<MatchRecord[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [showMigrationModal, setShowMigrationModal] = useState(false);

  // データの初期読み込み
  useEffect(() => {
    if (!userId) {
      setIsDataLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        setIsDataLoading(true);

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
  }, [userId]);

  // 移行完了後のデータ再取得
  const handleMigrationComplete = useCallback(async () => {
    if (!userId) return;

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
  }, [userId]);

  const handleAddDeck = useCallback(
    async (className: ClassType, deckName: string) => {
      if (!userId) return;

      try {
        // オプティミスティックUI: ローカル状態を先に更新
        const tempId = `temp-${Date.now()}`;
        const tempDeck: Deck = {
          id: tempId,
          userId,
          className,
          deckName,
          createdAt: new Date().toISOString(),
        };
        setDecks((prevDecks) => [...prevDecks, tempDeck]);

        // DynamoDBに保存
        const { data: newDeck } = await client.models.Deck.create({
          userId,
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
        // エラー時は再取得
        const { data: decksData } = await client.models.Deck.list();
        const fetchedDecks: Deck[] = (decksData || []).map((deck) => ({
          id: deck.id,
          userId: deck.userId,
          className: deck.className as ClassType,
          deckName: deck.deckName,
          createdAt: deck.createdAt || new Date().toISOString(),
        }));
        setDecks(fetchedDecks);
      }
    },
    [userId]
  );

  const handleDeleteDeck = useCallback(
    async (deckId: string) => {
      try {
        // オプティミスティックUI: ローカル状態を先に更新
        const recordsToDelete = records.filter((record) => record.myDeckId === deckId);
        setDecks((prevDecks) => prevDecks.filter((deck) => deck.id !== deckId));
        setRecords((prevRecords) => prevRecords.filter((record) => record.myDeckId !== deckId));

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
        // エラー時は再取得
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
    },
    [records]
  );

  const handleAddRecord = useCallback(
    async (currentDeckId: string, matchData: MatchRecordInput) => {
      if (!userId || !seasonId) return;

      try {
        // オプティミスティックUI: ローカル状態を先に更新
        const tempId = `temp-${Date.now()}`;
        const recordedAt = new Date().toISOString();
        const tempRecord: MatchRecord = {
          id: tempId,
          userId,
          myDeckId: currentDeckId,
          seasonId,
          ...matchData,
          recordedAt,
        };
        setRecords((prevRecords) => [tempRecord, ...prevRecords]);

        // DynamoDBに保存
        const { data: newRecord } = await client.models.MatchRecord.create({
          userId,
          myDeckId: currentDeckId,
          seasonId,
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
        // エラー時は再取得
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
    },
    [userId, seasonId]
  );

  const handleDeleteRecord = useCallback(async (recordId: string) => {
    try {
      // オプティミスティックUI: ローカル状態を先に更新
      setRecords((prevRecords) => prevRecords.filter((record) => record.id !== recordId));

      // DynamoDBから削除
      await client.models.MatchRecord.delete({ id: recordId });
    } catch (error) {
      console.error('対戦記録の削除に失敗しました:', error);
      // エラー時は再取得
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
  }, []);

  const handleUpdateRecord = useCallback(
    async (recordId: string, updatedData: MatchRecordInput) => {
      try {
        // オプティミスティックUI: ローカル状態を先に更新
        setRecords((prevRecords) =>
          prevRecords.map((record) =>
            record.id === recordId ? { ...record, ...updatedData } : record
          )
        );

        // DynamoDBで更新
        await client.models.MatchRecord.update({
          id: recordId,
          opponentClass: updatedData.opponentClass,
          opponentDeckType: updatedData.opponentDeckType,
          isFirstPlayer: updatedData.isFirstPlayer,
          isWin: updatedData.isWin,
        });
      } catch (error) {
        console.error('対戦記録の更新に失敗しました:', error);
        // エラー時は再取得
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
    },
    []
  );

  return {
    decks,
    records,
    isDataLoading,
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
