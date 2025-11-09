import { MatchRecord, MatchStatistics, ClassStatistics, DeckTypeStatistics, ClassType } from '@/types';

export const calculateOverallStats = (records: MatchRecord[]): MatchStatistics => {
  const totalGames = records.length;
  const wins = records.filter(record => record.isWin).length;
  const losses = totalGames - wins;
  const winRate = totalGames > 0 ? (wins / totalGames) * 100 : 0;

  return {
    totalGames,
    wins,
    losses,
    winRate: Math.round(winRate * 10) / 10
  };
};

export const calculateClassStats = (records: MatchRecord[]): ClassStatistics[] => {
  const classes = ['エルフ', 'ロイヤル', 'ウィッチ', 'ドラゴン', 'ナイトメア', 'ビショップ', 'ネメシス'] as ClassType[];

  return classes.map(className => {
    const classRecords = records.filter(record => record.opponentClass === className);
    const stats = calculateOverallStats(classRecords);

    return {
      className,
      ...stats
    };
  }).sort((a, b) => b.totalGames - a.totalGames);
};

export const calculateDeckTypeStats = (records: MatchRecord[]): DeckTypeStatistics[] => {
  const deckTypeMap = new Map<string, MatchRecord[]>();

  records.forEach(record => {
    const key = record.opponentDeckType;
    if (!deckTypeMap.has(key)) {
      deckTypeMap.set(key, []);
    }
    deckTypeMap.get(key)!.push(record);
  });

  return Array.from(deckTypeMap.entries()).map(([deckType, deckRecords]) => {
    const firstPlayerRecords = deckRecords.filter(record => record.isFirstPlayer);
    const secondPlayerRecords = deckRecords.filter(record => !record.isFirstPlayer);

    return {
      deckType,
      ...calculateOverallStats(deckRecords),
      firstPlayerStats: calculateOverallStats(firstPlayerRecords),
      secondPlayerStats: calculateOverallStats(secondPlayerRecords)
    };
  }).sort((a, b) => b.totalGames - a.totalGames);
};

export const filterRecordsByDeck = (records: MatchRecord[], deckId: string | null): MatchRecord[] => {
  if (!deckId) return records;
  return records.filter(record => record.myDeckId === deckId);
};

export const filterRecordsBySeason = (records: MatchRecord[], seasonId: string | null): MatchRecord[] => {
  if (!seasonId) return records;
  return records.filter(record => record.seasonId === seasonId);
};

export const filterRecordsByDeckAndSeason = (
  records: MatchRecord[],
  deckId: string | null,
  seasonId: string | null
): MatchRecord[] => {
  let filtered = records;
  if (seasonId) {
    filtered = filtered.filter(record => record.seasonId === seasonId);
  }
  if (deckId) {
    filtered = filtered.filter(record => record.myDeckId === deckId);
  }
  return filtered;
};
