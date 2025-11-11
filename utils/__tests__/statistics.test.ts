import {
  calculateOverallStats,
  calculateClassStats,
  calculateDeckTypeStats,
  filterRecordsByDeck,
  filterRecordsBySeason,
  filterRecordsByDeckAndSeason,
} from '../statistics'
import { MatchRecord } from '@/types'

describe('statistics', () => {
  // サンプルデータ
  const mockRecords: MatchRecord[] = [
    {
      id: '1',
      userId: 'user1',
      myDeckId: 'deck1',
      seasonId: 'season1',
      opponentClass: 'エルフ',
      opponentDeckType: 'アグロ',
      isFirstPlayer: true,
      isWin: true,
      recordedAt: new Date('2024-01-01T10:00:00Z'),
      createdAt: new Date('2024-01-01T10:00:00Z'),
      updatedAt: new Date('2024-01-01T10:00:00Z'),
    },
    {
      id: '2',
      userId: 'user1',
      myDeckId: 'deck1',
      seasonId: 'season1',
      opponentClass: 'エルフ',
      opponentDeckType: 'コントロール',
      isFirstPlayer: false,
      isWin: false,
      recordedAt: new Date('2024-01-02T10:00:00Z'),
      createdAt: new Date('2024-01-02T10:00:00Z'),
      updatedAt: new Date('2024-01-02T10:00:00Z'),
    },
    {
      id: '3',
      userId: 'user1',
      myDeckId: 'deck2',
      seasonId: 'season1',
      opponentClass: 'ロイヤル',
      opponentDeckType: 'ミッドレンジ',
      isFirstPlayer: true,
      isWin: true,
      recordedAt: new Date('2024-01-03T10:00:00Z'),
      createdAt: new Date('2024-01-03T10:00:00Z'),
      updatedAt: new Date('2024-01-03T10:00:00Z'),
    },
    {
      id: '4',
      userId: 'user1',
      myDeckId: 'deck2',
      seasonId: 'season2',
      opponentClass: 'ウィッチ',
      opponentDeckType: 'スペル',
      isFirstPlayer: false,
      isWin: true,
      recordedAt: new Date('2024-02-01T10:00:00Z'),
      createdAt: new Date('2024-02-01T10:00:00Z'),
      updatedAt: new Date('2024-02-01T10:00:00Z'),
    },
  ]

  describe('calculateOverallStats', () => {
    it('should calculate correct overall statistics', () => {
      const stats = calculateOverallStats(mockRecords)

      expect(stats.totalGames).toBe(4)
      expect(stats.wins).toBe(3)
      expect(stats.losses).toBe(1)
      expect(stats.winRate).toBe(75.0)
    })

    it('should handle empty records', () => {
      const stats = calculateOverallStats([])

      expect(stats.totalGames).toBe(0)
      expect(stats.wins).toBe(0)
      expect(stats.losses).toBe(0)
      expect(stats.winRate).toBe(0)
    })

    it('should handle all wins', () => {
      const allWins = mockRecords.filter(r => r.isWin)
      const stats = calculateOverallStats(allWins)

      expect(stats.winRate).toBe(100.0)
    })

    it('should handle all losses', () => {
      const allLosses = mockRecords.map(r => ({ ...r, isWin: false }))
      const stats = calculateOverallStats(allLosses)

      expect(stats.winRate).toBe(0)
    })
  })

  describe('calculateClassStats', () => {
    it('should calculate statistics grouped by opponent class', () => {
      const stats = calculateClassStats(mockRecords)

      expect(stats).toHaveLength(7) // 全クラス分の統計が返される

      const elfStats = stats.find(s => s.className === 'エルフ')
      expect(elfStats).toBeDefined()
      expect(elfStats?.totalGames).toBe(2)
      expect(elfStats?.wins).toBe(1)
      expect(elfStats?.losses).toBe(1)
      expect(elfStats?.winRate).toBe(50.0)

      const royalStats = stats.find(s => s.className === 'ロイヤル')
      expect(royalStats).toBeDefined()
      expect(royalStats?.totalGames).toBe(1)
      expect(royalStats?.wins).toBe(1)
      expect(royalStats?.winRate).toBe(100.0)

      const witchStats = stats.find(s => s.className === 'ウィッチ')
      expect(witchStats).toBeDefined()
      expect(witchStats?.totalGames).toBe(1)
      expect(witchStats?.wins).toBe(1)
      expect(witchStats?.winRate).toBe(100.0)

      // クラスと対戦していない場合は0になる
      const dragonStats = stats.find(s => s.className === 'ドラゴン')
      expect(dragonStats).toBeDefined()
      expect(dragonStats?.totalGames).toBe(0)
      expect(dragonStats?.wins).toBe(0)
      expect(dragonStats?.winRate).toBe(0)
    })

    it('should handle empty records', () => {
      const stats = calculateClassStats([])
      expect(stats).toHaveLength(7) // 全クラス分（全て0）
      stats.forEach(stat => {
        expect(stat.totalGames).toBe(0)
        expect(stat.wins).toBe(0)
        expect(stat.losses).toBe(0)
        expect(stat.winRate).toBe(0)
      })
    })

    it('should sort by total games in descending order', () => {
      const stats = calculateClassStats(mockRecords)

      for (let i = 0; i < stats.length - 1; i++) {
        expect(stats[i].totalGames).toBeGreaterThanOrEqual(stats[i + 1].totalGames)
      }
    })
  })

  describe('calculateDeckTypeStats', () => {
    it('should calculate statistics grouped by opponent deck type', () => {
      const stats = calculateDeckTypeStats(mockRecords)

      expect(stats).toHaveLength(4) // アグロ, コントロール, ミッドレンジ, スペル

      const aggroStats = stats.find(s => s.deckType === 'アグロ')
      expect(aggroStats).toBeDefined()
      expect(aggroStats?.totalGames).toBe(1)
      expect(aggroStats?.wins).toBe(1)
      expect(aggroStats?.firstPlayerStats.totalGames).toBe(1)
      expect(aggroStats?.firstPlayerStats.wins).toBe(1)
      expect(aggroStats?.secondPlayerStats.totalGames).toBe(0)
      expect(aggroStats?.secondPlayerStats.wins).toBe(0)
    })

    it('should calculate first/second player statistics correctly', () => {
      const stats = calculateDeckTypeStats(mockRecords)

      stats.forEach(stat => {
        expect(stat.firstPlayerStats.wins + stat.secondPlayerStats.wins).toBe(stat.wins)
        expect(stat.firstPlayerStats.losses + stat.secondPlayerStats.losses).toBe(stat.losses)
        expect(stat.firstPlayerStats.totalGames + stat.secondPlayerStats.totalGames).toBe(stat.totalGames)
      })
    })

    it('should handle empty records', () => {
      const stats = calculateDeckTypeStats([])
      expect(stats).toEqual([])
    })

    it('should calculate win rates correctly', () => {
      const stats = calculateDeckTypeStats(mockRecords)

      stats.forEach(stat => {
        if (stat.firstPlayerStats.totalGames > 0) {
          const expectedRate = (stat.firstPlayerStats.wins / stat.firstPlayerStats.totalGames) * 100
          expect(stat.firstPlayerStats.winRate).toBeCloseTo(expectedRate, 1)
        } else {
          expect(stat.firstPlayerStats.winRate).toBe(0)
        }

        if (stat.secondPlayerStats.totalGames > 0) {
          const expectedRate = (stat.secondPlayerStats.wins / stat.secondPlayerStats.totalGames) * 100
          expect(stat.secondPlayerStats.winRate).toBeCloseTo(expectedRate, 1)
        } else {
          expect(stat.secondPlayerStats.winRate).toBe(0)
        }
      })
    })
  })

  describe('filterRecordsByDeck', () => {
    it('should filter records by deck ID', () => {
      const filtered = filterRecordsByDeck(mockRecords, 'deck1')

      expect(filtered).toHaveLength(2)
      expect(filtered.every(r => r.myDeckId === 'deck1')).toBe(true)
    })

    it('should return all records when deckId is null', () => {
      const filtered = filterRecordsByDeck(mockRecords, null)

      expect(filtered).toEqual(mockRecords)
    })

    it('should return empty array when no matches', () => {
      const filtered = filterRecordsByDeck(mockRecords, 'nonexistent')

      expect(filtered).toEqual([])
    })
  })

  describe('filterRecordsBySeason', () => {
    it('should filter records by season ID', () => {
      const filtered = filterRecordsBySeason(mockRecords, 'season1')

      expect(filtered).toHaveLength(3)
      expect(filtered.every(r => r.seasonId === 'season1')).toBe(true)
    })

    it('should return all records when seasonId is undefined', () => {
      const filtered = filterRecordsBySeason(mockRecords, undefined)

      expect(filtered).toEqual(mockRecords)
    })

    it('should return all records when seasonId is null', () => {
      const filtered = filterRecordsBySeason(mockRecords, null)

      expect(filtered).toEqual(mockRecords)
    })

    it('should return empty array when no matches', () => {
      const filtered = filterRecordsBySeason(mockRecords, 'nonexistent')

      expect(filtered).toEqual([])
    })
  })

  describe('filterRecordsByDeckAndSeason', () => {
    it('should filter by both deck and season', () => {
      const filtered = filterRecordsByDeckAndSeason(mockRecords, 'deck2', 'season1')

      expect(filtered).toHaveLength(1)
      expect(filtered[0].myDeckId).toBe('deck2')
      expect(filtered[0].seasonId).toBe('season1')
    })

    it('should filter by deck only when seasonId is null', () => {
      const filtered = filterRecordsByDeckAndSeason(mockRecords, 'deck1', null)

      expect(filtered).toHaveLength(2)
      expect(filtered.every(r => r.myDeckId === 'deck1')).toBe(true)
    })

    it('should filter by season only when deckId is null', () => {
      const filtered = filterRecordsByDeckAndSeason(mockRecords, null, 'season2')

      expect(filtered).toHaveLength(1)
      expect(filtered[0].seasonId).toBe('season2')
    })

    it('should return all records when both are null', () => {
      const filtered = filterRecordsByDeckAndSeason(mockRecords, null, null)

      expect(filtered).toEqual(mockRecords)
    })

    it('should return empty array when no matches', () => {
      const filtered = filterRecordsByDeckAndSeason(mockRecords, 'deck1', 'season2')

      expect(filtered).toEqual([])
    })
  })
})