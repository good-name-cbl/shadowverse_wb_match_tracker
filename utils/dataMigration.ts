import { Deck, MatchRecord } from '@/types';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

export interface LocalStorageData {
  decks: Deck[];
  records: MatchRecord[];
}

export interface MigrationResult {
  success: boolean;
  decksImported: number;
  recordsImported: number;
  errors: string[];
}

/**
 * LocalStorageからデータを読み込む
 */
export const loadLocalStorageData = (): LocalStorageData | null => {
  try {
    const decksJson = localStorage.getItem('decks');
    const recordsJson = localStorage.getItem('records');

    if (!decksJson && !recordsJson) {
      return null; // データがない
    }

    const decks: Deck[] = decksJson ? JSON.parse(decksJson) : [];
    const records: MatchRecord[] = recordsJson ? JSON.parse(recordsJson) : [];

    return { decks, records };
  } catch (error) {
    console.error('LocalStorageの読み込みに失敗しました:', error);
    return null;
  }
};

/**
 * データのバリデーション
 */
export const validateData = (data: LocalStorageData): boolean => {
  try {
    // decksのバリデーション
    if (!Array.isArray(data.decks)) return false;
    for (const deck of data.decks) {
      if (!deck.id || !deck.userId || !deck.className || !deck.deckName) {
        return false;
      }
    }

    // recordsのバリデーション
    if (!Array.isArray(data.records)) return false;
    for (const record of data.records) {
      if (
        !record.id ||
        !record.userId ||
        !record.myDeckId ||
        !record.opponentClass ||
        !record.opponentDeckType ||
        typeof record.isFirstPlayer !== 'boolean' ||
        typeof record.isWin !== 'boolean' ||
        !record.recordedAt
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('データのバリデーションに失敗しました:', error);
    return false;
  }
};

/**
 * LocalStorageのデータをDynamoDBにインポート
 */
export const importDataToDynamoDB = async (
  data: LocalStorageData,
  userId: string,
  seasonId: string
): Promise<MigrationResult> => {
  const errors: string[] = [];
  let decksImported = 0;
  let recordsImported = 0;

  try {
    // 1. デッキをインポート
    const deckIdMapping = new Map<string, string>(); // 旧ID -> 新ID のマッピング

    for (const deck of data.decks) {
      try {
        const { data: newDeck } = await client.models.Deck.create({
          userId,
          className: deck.className,
          deckName: deck.deckName,
          createdAt: deck.createdAt,
        });

        if (newDeck) {
          deckIdMapping.set(deck.id, newDeck.id);
          decksImported++;
        }
      } catch (error: any) {
        errors.push(`デッキのインポート失敗: ${deck.deckName} - ${error.message}`);
      }
    }

    // 2. 対戦記録をインポート（デッキIDを新しいIDにマッピング）
    for (const record of data.records) {
      try {
        const newDeckId = deckIdMapping.get(record.myDeckId);
        if (!newDeckId) {
          errors.push(
            `対戦記録のインポート失敗: デッキID ${record.myDeckId} が見つかりません`
          );
          continue;
        }

        await client.models.MatchRecord.create({
          userId,
          myDeckId: newDeckId,
          seasonId,
          opponentClass: record.opponentClass,
          opponentDeckType: record.opponentDeckType,
          isFirstPlayer: record.isFirstPlayer,
          isWin: record.isWin,
          recordedAt: record.recordedAt,
        });

        recordsImported++;
      } catch (error: any) {
        errors.push(`対戦記録のインポート失敗: ${error.message}`);
      }
    }

    return {
      success: errors.length === 0,
      decksImported,
      recordsImported,
      errors,
    };
  } catch (error: any) {
    return {
      success: false,
      decksImported,
      recordsImported,
      errors: [...errors, `インポート処理エラー: ${error.message}`],
    };
  }
};

/**
 * LocalStorageのデータをクリア
 */
export const clearLocalStorageData = (): void => {
  try {
    localStorage.removeItem('decks');
    localStorage.removeItem('records');
    console.log('LocalStorageのデータをクリアしました');
  } catch (error) {
    console.error('LocalStorageのクリアに失敗しました:', error);
  }
};

/**
 * LocalStorageにデータが存在するかチェック
 */
export const hasLocalStorageData = (): boolean => {
  const decksJson = localStorage.getItem('decks');
  const recordsJson = localStorage.getItem('records');

  if (!decksJson && !recordsJson) return false;

  try {
    const decks = decksJson ? JSON.parse(decksJson) : [];
    const records = recordsJson ? JSON.parse(recordsJson) : [];

    return decks.length > 0 || records.length > 0;
  } catch (error) {
    return false;
  }
};
