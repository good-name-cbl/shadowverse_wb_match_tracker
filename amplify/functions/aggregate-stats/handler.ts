import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// 環境変数からテーブル名を取得
const MATCH_RECORD_TABLE = process.env.MATCH_RECORD_TABLE!;
const SEASON_TABLE = process.env.SEASON_TABLE!;
const AGGREGATED_STATS_TABLE = process.env.AGGREGATED_STATS_TABLE!;

// 型定義
interface MatchRecord {
  id: string;
  userId: string;
  myDeckId: string;
  seasonId: string;
  opponentClass: string;
  opponentDeckType: string;
  isFirstPlayer: boolean;
  isWin: boolean;
  recordedAt: string;
}

interface Season {
  id: string;
  name: string;
  templates?: string; // JSON string
}

interface DeckTemplate {
  id: string;
  seasonId: string;
  className: string;
  deckName: string;
  description?: string;
  displayOrder?: number;
  isActive: boolean;
  createdAt: string;
}

interface AggregatedStat {
  id: string;
  seasonId: string;
  seasonName: string;
  statsType: string;
  statsKey: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  metadata?: any;
  updatedAt: string;
}

const CLASSES = ['エルフ', 'ロイヤル', 'ウィッチ', 'ドラゴン', 'ナイトメア', 'ビショップ', 'ネメシス'];

/**
 * Season.templatesフィールドからDeckTemplate[]を取得
 */
function getTemplatesFromSeason(season: Season): DeckTemplate[] {
  if (!season.templates) return [];
  try {
    const parsed = typeof season.templates === 'string'
      ? JSON.parse(season.templates)
      : season.templates;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse templates:', e);
    return [];
  }
}

/**
 * テンプレート名のセットを取得（クラス別）
 */
function getTemplateNamesPerClass(season: Season): Record<string, Set<string>> {
  const templates = getTemplatesFromSeason(season);
  const result: Record<string, Set<string>> = {};

  CLASSES.forEach(className => {
    result[className] = new Set();
  });

  templates.forEach(template => {
    if (template.isActive && result[template.className]) {
      result[template.className].add(template.deckName);
    }
  });

  return result;
}

/**
 * DynamoDBから全データをスキャン
 */
async function scanTable<T>(tableName: string): Promise<T[]> {
  const items: T[] = [];
  let lastKey: any = undefined;

  do {
    const command = new ScanCommand({
      TableName: tableName,
      ExclusiveStartKey: lastKey,
    });

    const response = await ddbDocClient.send(command);
    if (response.Items) {
      items.push(...(response.Items as T[]));
    }
    lastKey = response.LastEvaluatedKey;
  } while (lastKey);

  return items;
}

/**
 * 基本統計を計算
 */
function calculateStats(records: MatchRecord[]) {
  const totalGames = records.length;
  const wins = records.filter(r => r.isWin).length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  return {
    totalGames,
    wins,
    losses,
    winRate: Math.round(winRate * 10) / 10,
  };
}

/**
 * クラス別統計を集計
 */
function aggregateClassStats(records: MatchRecord[], seasonId: string, seasonName: string): AggregatedStat[] {
  const stats: AggregatedStat[] = [];

  CLASSES.forEach(className => {
    const classRecords = records.filter(r => r.opponentClass === className);
    if (classRecords.length > 0) {
      const { totalGames, wins, losses, winRate } = calculateStats(classRecords);

      stats.push({
        id: `${seasonId}#class#${className}`,
        seasonId,
        seasonName,
        statsType: 'class',
        statsKey: className,
        totalGames,
        wins,
        losses,
        winRate,
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return stats;
}

/**
 * デッキ別統計を集計（テンプレート + クラス別「その他」）
 */
function aggregateDeckStats(
  records: MatchRecord[],
  seasonId: string,
  seasonName: string,
  templateNamesPerClass: Record<string, Set<string>>
): AggregatedStat[] {
  const stats: AggregatedStat[] = [];

  // デッキ名ごとに集計（テンプレート登録されているもの）
  const deckRecordsMap = new Map<string, MatchRecord[]>();
  // クラス別の「その他」
  const othersPerClass: Record<string, MatchRecord[]> = {};

  CLASSES.forEach(className => {
    othersPerClass[className] = [];
  });

  records.forEach(record => {
    const className = record.opponentClass;
    const deckType = record.opponentDeckType;
    const templateNames = templateNamesPerClass[className];

    // テンプレートに登録されているか確認
    if (templateNames && templateNames.has(deckType)) {
      // テンプレート登録済み
      if (!deckRecordsMap.has(deckType)) {
        deckRecordsMap.set(deckType, []);
      }
      deckRecordsMap.get(deckType)!.push(record);
    } else {
      // その他
      if (othersPerClass[className]) {
        othersPerClass[className].push(record);
      }
    }
  });

  // テンプレート登録デッキの統計
  deckRecordsMap.forEach((deckRecords, deckType) => {
    const { totalGames, wins, losses, winRate } = calculateStats(deckRecords);

    stats.push({
      id: `${seasonId}#deck#${deckType}`,
      seasonId,
      seasonName,
      statsType: 'deck',
      statsKey: deckType,
      totalGames,
      wins,
      losses,
      winRate,
      updatedAt: new Date().toISOString(),
    });
  });

  // クラス別「その他」の統計
  CLASSES.forEach(className => {
    const othersRecords = othersPerClass[className];
    if (othersRecords && othersRecords.length > 0) {
      const { totalGames, wins, losses, winRate } = calculateStats(othersRecords);
      const othersKey = `その他（${className}）`;

      stats.push({
        id: `${seasonId}#deck#${othersKey}`,
        seasonId,
        seasonName,
        statsType: 'deck',
        statsKey: othersKey,
        totalGames,
        wins,
        losses,
        winRate,
        metadata: JSON.stringify({ className, isOthers: true }),
        updatedAt: new Date().toISOString(),
      });
    }
  });

  return stats;
}

/**
 * マッチアップ統計を集計
 */
function aggregateMatchupStats(records: MatchRecord[], seasonId: string, seasonName: string): AggregatedStat[] {
  const stats: AggregatedStat[] = [];
  const matchupMap = new Map<string, MatchRecord[]>();

  records.forEach(record => {
    // マッチアップキー: "自分のクラス_vs_相手のクラス"
    // 注意: myDeckIdから自分のクラスを取得する必要があるが、
    // Lambda関数内ではDeck情報を取得できないため、
    // ここではopponentClassのみで集計
    // 後で改善が必要な場合は、MatchRecordにmyClassフィールドを追加する必要がある

    // 暫定: 相手クラスのみで集計
    const key = record.opponentClass;
    if (!matchupMap.has(key)) {
      matchupMap.set(key, []);
    }
    matchupMap.get(key)!.push(record);
  });

  matchupMap.forEach((matchupRecords, opponentClass) => {
    const { totalGames, wins, losses, winRate } = calculateStats(matchupRecords);

    stats.push({
      id: `${seasonId}#matchup#${opponentClass}`,
      seasonId,
      seasonName,
      statsType: 'matchup',
      statsKey: opponentClass,
      totalGames,
      wins,
      losses,
      winRate,
      updatedAt: new Date().toISOString(),
    });
  });

  return stats;
}

/**
 * 先攻後攻統計を集計
 */
function aggregateTurnOrderStats(records: MatchRecord[], seasonId: string, seasonName: string): AggregatedStat[] {
  const stats: AggregatedStat[] = [];

  const firstPlayerRecords = records.filter(r => r.isFirstPlayer);
  const secondPlayerRecords = records.filter(r => !r.isFirstPlayer);

  if (firstPlayerRecords.length > 0) {
    const { totalGames, wins, losses, winRate } = calculateStats(firstPlayerRecords);

    stats.push({
      id: `${seasonId}#turnOrder#first`,
      seasonId,
      seasonName,
      statsType: 'turnOrder',
      statsKey: 'first',
      totalGames,
      wins,
      losses,
      winRate,
      updatedAt: new Date().toISOString(),
    });
  }

  if (secondPlayerRecords.length > 0) {
    const { totalGames, wins, losses, winRate } = calculateStats(secondPlayerRecords);

    stats.push({
      id: `${seasonId}#turnOrder#second`,
      seasonId,
      seasonName,
      statsType: 'turnOrder',
      statsKey: 'second',
      totalGames,
      wins,
      losses,
      winRate,
      updatedAt: new Date().toISOString(),
    });
  }

  return stats;
}

/**
 * AggregatedStatsテーブルの古いデータを削除
 */
async function clearOldStats(seasonId: string) {
  console.log(`Clearing old stats for season: ${seasonId}`);

  const command = new ScanCommand({
    TableName: AGGREGATED_STATS_TABLE,
    FilterExpression: 'seasonId = :seasonId',
    ExpressionAttributeValues: {
      ':seasonId': seasonId,
    },
  });

  const response = await ddbDocClient.send(command);

  if (response.Items) {
    for (const item of response.Items) {
      await ddbDocClient.send(
        new DeleteCommand({
          TableName: AGGREGATED_STATS_TABLE,
          Key: { id: item.id },
        })
      );
    }
  }
}

/**
 * Lambda handler
 */
export const handler = async (event: any) => {
  console.log('Starting aggregation process...');

  try {
    // 1. 全MatchRecordを取得
    console.log('Fetching match records...');
    const matchRecords = await scanTable<MatchRecord>(MATCH_RECORD_TABLE);
    console.log(`Fetched ${matchRecords.length} match records`);

    // 2. 全Seasonを取得
    console.log('Fetching seasons...');
    const seasons = await scanTable<Season>(SEASON_TABLE);
    console.log(`Fetched ${seasons.length} seasons`);

    // 3. シーズンごとに集計
    for (const season of seasons) {
      console.log(`Processing season: ${season.name} (${season.id})`);

      // シーズンの対戦記録を取得
      const seasonRecords = matchRecords.filter(r => r.seasonId === season.id);

      if (seasonRecords.length === 0) {
        console.log(`No records for season ${season.name}, skipping...`);
        continue;
      }

      console.log(`Found ${seasonRecords.length} records for season ${season.name}`);

      // テンプレート情報を取得
      const templateNamesPerClass = getTemplateNamesPerClass(season);

      // 古い統計データを削除
      await clearOldStats(season.id);

      // 各種統計を集計
      const classStats = aggregateClassStats(seasonRecords, season.id, season.name);
      const deckStats = aggregateDeckStats(seasonRecords, season.id, season.name, templateNamesPerClass);
      const matchupStats = aggregateMatchupStats(seasonRecords, season.id, season.name);
      const turnOrderStats = aggregateTurnOrderStats(seasonRecords, season.id, season.name);

      const allStats = [...classStats, ...deckStats, ...matchupStats, ...turnOrderStats];

      console.log(`Generated ${allStats.length} stat records for season ${season.name}`);

      // DynamoDBに保存
      for (const stat of allStats) {
        await ddbDocClient.send(
          new PutCommand({
            TableName: AGGREGATED_STATS_TABLE,
            Item: stat,
          })
        );
      }

      console.log(`Saved stats for season ${season.name}`);
    }

    console.log('Aggregation process completed successfully');

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Aggregation completed successfully',
        processedSeasons: seasons.length,
        totalRecords: matchRecords.length,
      }),
    };
  } catch (error) {
    console.error('Error during aggregation:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Aggregation failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      }),
    };
  }
};
