import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, BatchWriteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

interface MatchRecord {
  id: string;
  userId: string;
  myDeckId: string;
  opponentClass: string;
  opponentDeckType: string;
  isFirstPlayer: boolean;
  isWin: boolean;
  recordedAt: string;
}

interface Deck {
  id: string;
  userId: string;
  className: string;
  deckName: string;
}

interface AggregatedStats {
  statsType: string;
  statsKey: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  metadata?: any;
  updatedAt: string;
}

export const handler = async (event: any) => {
  console.log('集計処理を開始します...');

  const matchRecordTableName = process.env.MATCH_RECORD_TABLE_NAME;
  const deckTableName = process.env.DECK_TABLE_NAME;
  const aggregatedStatsTableName = process.env.AGGREGATED_STATS_TABLE_NAME;

  if (!matchRecordTableName || !deckTableName || !aggregatedStatsTableName) {
    throw new Error('環境変数が設定されていません');
  }

  try {
    // 1. MatchRecordを全件取得
    console.log('MatchRecordを取得中...');
    const matchRecords = await scanAllRecords(matchRecordTableName);
    console.log(`MatchRecord: ${matchRecords.length}件取得`);

    // 2. Deckを全件取得
    console.log('Deckを取得中...');
    const decks = await scanAllDecks(deckTableName);
    console.log(`Deck: ${decks.length}件取得`);

    if (matchRecords.length === 0) {
      console.log('対戦記録がありません。集計をスキップします。');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: '対戦記録がないため集計をスキップしました' }),
      };
    }

    // deckIdからclassNameを取得するマップを作成
    const deckIdToClassName = new Map<string, string>();
    decks.forEach((deck) => {
      deckIdToClassName.set(deck.id, deck.className);
    });

    // 3. 各種統計を集計
    const classStats = calculateClassStats(matchRecords);
    const deckStats = calculateDeckStats(matchRecords, decks);
    const matchupStats = calculateMatchupStats(matchRecords, deckIdToClassName);
    const turnOrderStats = calculateTurnOrderStats(matchRecords);

    // 4. AggregatedStatsテーブルに保存
    const statsToSave: AggregatedStats[] = [
      ...classStats,
      ...deckStats,
      ...matchupStats,
      ...turnOrderStats,
    ];

    console.log(`集計結果: ${statsToSave.length}件のデータを保存します`);
    await saveAggregatedStats(aggregatedStatsTableName, statsToSave);

    console.log('集計処理が完了しました');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: '集計処理が完了しました',
        stats: {
          totalMatchRecords: matchRecords.length,
          classStats: classStats.length,
          deckStats: deckStats.length,
          matchupStats: matchupStats.length,
          turnOrderStats: turnOrderStats.length,
        },
      }),
    };
  } catch (error) {
    console.error('集計処理でエラーが発生しました:', error);
    throw error;
  }
};

// MatchRecordを全件スキャン
async function scanAllRecords(tableName: string): Promise<MatchRecord[]> {
  const records: MatchRecord[] = [];
  let lastEvaluatedKey: any = undefined;

  do {
    const command = new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);
    if (response.Items) {
      records.push(...(response.Items as MatchRecord[]));
    }
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return records;
}

// Deckを全件スキャン
async function scanAllDecks(tableName: string): Promise<Deck[]> {
  const decks: Deck[] = [];
  let lastEvaluatedKey: any = undefined;

  do {
    const command = new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const response = await docClient.send(command);
    if (response.Items) {
      decks.push(...(response.Items as Deck[]));
    }
    lastEvaluatedKey = response.LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return decks;
}

// クラス別統計の集計
function calculateClassStats(records: MatchRecord[]): AggregatedStats[] {
  const classMap = new Map<string, { totalGames: number; wins: number; losses: number }>();

  records.forEach((record) => {
    const className = record.opponentClass;
    if (!classMap.has(className)) {
      classMap.set(className, { totalGames: 0, wins: 0, losses: 0 });
    }

    const stats = classMap.get(className)!;
    stats.totalGames++;
    if (record.isWin) {
      stats.wins++;
    } else {
      stats.losses++;
    }
  });

  const result: AggregatedStats[] = [];
  classMap.forEach((stats, className) => {
    result.push({
      statsType: 'class',
      statsKey: className,
      totalGames: stats.totalGames,
      wins: stats.wins,
      losses: stats.losses,
      winRate: stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0,
      metadata: { className },
      updatedAt: new Date().toISOString(),
    });
  });

  return result;
}

// デッキ別統計の集計
function calculateDeckStats(records: MatchRecord[], decks: Deck[]): AggregatedStats[] {
  const deckMap = new Map<string, { totalGames: number; wins: number; losses: number; deckName: string; className: string }>();

  // deckIdからdeck情報を取得するマップ
  const deckIdMap = new Map<string, Deck>();
  decks.forEach((deck) => {
    deckIdMap.set(deck.id, deck);
  });

  records.forEach((record) => {
    const deckId = record.myDeckId;
    const deck = deckIdMap.get(deckId);
    if (!deck) return;

    const key = `${deck.className}:${deck.deckName}`;
    if (!deckMap.has(key)) {
      deckMap.set(key, { totalGames: 0, wins: 0, losses: 0, deckName: deck.deckName, className: deck.className });
    }

    const stats = deckMap.get(key)!;
    stats.totalGames++;
    if (record.isWin) {
      stats.wins++;
    } else {
      stats.losses++;
    }
  });

  const result: AggregatedStats[] = [];
  deckMap.forEach((stats, key) => {
    result.push({
      statsType: 'deck',
      statsKey: key,
      totalGames: stats.totalGames,
      wins: stats.wins,
      losses: stats.losses,
      winRate: stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0,
      metadata: { deckName: stats.deckName, className: stats.className },
      updatedAt: new Date().toISOString(),
    });
  });

  return result;
}

// マッチアップ統計の集計（自分のクラス vs 相手のクラス）
function calculateMatchupStats(records: MatchRecord[], deckIdToClassName: Map<string, string>): AggregatedStats[] {
  const matchupMap = new Map<string, { totalGames: number; wins: number; losses: number }>();

  records.forEach((record) => {
    const myClassName = deckIdToClassName.get(record.myDeckId);
    if (!myClassName) return;

    const key = `${myClassName} vs ${record.opponentClass}`;
    if (!matchupMap.has(key)) {
      matchupMap.set(key, { totalGames: 0, wins: 0, losses: 0 });
    }

    const stats = matchupMap.get(key)!;
    stats.totalGames++;
    if (record.isWin) {
      stats.wins++;
    } else {
      stats.losses++;
    }
  });

  const result: AggregatedStats[] = [];
  matchupMap.forEach((stats, key) => {
    const [myClass, opponentClass] = key.split(' vs ');
    result.push({
      statsType: 'matchup',
      statsKey: key,
      totalGames: stats.totalGames,
      wins: stats.wins,
      losses: stats.losses,
      winRate: stats.totalGames > 0 ? (stats.wins / stats.totalGames) * 100 : 0,
      metadata: { myClass, opponentClass },
      updatedAt: new Date().toISOString(),
    });
  });

  return result;
}

// 先攻後攻統計の集計
function calculateTurnOrderStats(records: MatchRecord[]): AggregatedStats[] {
  const firstPlayerStats = { totalGames: 0, wins: 0, losses: 0 };
  const secondPlayerStats = { totalGames: 0, wins: 0, losses: 0 };

  records.forEach((record) => {
    if (record.isFirstPlayer) {
      firstPlayerStats.totalGames++;
      if (record.isWin) {
        firstPlayerStats.wins++;
      } else {
        firstPlayerStats.losses++;
      }
    } else {
      secondPlayerStats.totalGames++;
      if (record.isWin) {
        secondPlayerStats.wins++;
      } else {
        secondPlayerStats.losses++;
      }
    }
  });

  return [
    {
      statsType: 'turnOrder',
      statsKey: 'first',
      totalGames: firstPlayerStats.totalGames,
      wins: firstPlayerStats.wins,
      losses: firstPlayerStats.losses,
      winRate: firstPlayerStats.totalGames > 0 ? (firstPlayerStats.wins / firstPlayerStats.totalGames) * 100 : 0,
      metadata: { turnOrder: 'first' },
      updatedAt: new Date().toISOString(),
    },
    {
      statsType: 'turnOrder',
      statsKey: 'second',
      totalGames: secondPlayerStats.totalGames,
      wins: secondPlayerStats.wins,
      losses: secondPlayerStats.losses,
      winRate: secondPlayerStats.totalGames > 0 ? (secondPlayerStats.wins / secondPlayerStats.totalGames) * 100 : 0,
      metadata: { turnOrder: 'second' },
      updatedAt: new Date().toISOString(),
    },
  ];
}

// AggregatedStatsテーブルに保存
async function saveAggregatedStats(tableName: string, stats: AggregatedStats[]): Promise<void> {
  // BatchWriteは25件ずつしか書き込めないので、分割して実行
  const batchSize = 25;
  for (let i = 0; i < stats.length; i += batchSize) {
    const batch = stats.slice(i, i + batchSize);
    const putRequests = batch.map((stat) => ({
      PutRequest: {
        Item: {
          id: `${stat.statsType}:${stat.statsKey}`,
          ...stat,
        },
      },
    }));

    const command = new BatchWriteCommand({
      RequestItems: {
        [tableName]: putRequests,
      },
    });

    await docClient.send(command);
  }
}
