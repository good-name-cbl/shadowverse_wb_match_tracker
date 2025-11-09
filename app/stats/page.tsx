'use client';

import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import Link from 'next/link';
import { ClassStatsPublic } from '@/components/public-stats/ClassStatsPublic';
import { DeckStatsPublic } from '@/components/public-stats/DeckStatsPublic';
import { MatchupMatrix } from '@/components/public-stats/MatchupMatrix';
import { TurnOrderStats } from '@/components/public-stats/TurnOrderStats';
import { SeasonFilter } from '@/components/stats/SeasonFilter';

const client = generateClient<Schema>();

interface AggregatedStats {
  seasonId: string;
  seasonName: string;
  statsType: string;
  statsKey: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  metadata?: any;
  updatedAt?: string;
}

type ActiveTab = 'class' | 'deck' | 'matchup' | 'turnOrder';

export default function PublicStatsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('class');
  const [statsData, setStatsData] = useState<AggregatedStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const { data } = await client.models.AggregatedStats.list({
        authMode: 'apiKey',
      });

      if (data) {
        const stats: AggregatedStats[] = data.map((stat) => ({
          seasonId: stat.seasonId,
          seasonName: stat.seasonName,
          statsType: stat.statsType,
          statsKey: stat.statsKey,
          totalGames: stat.totalGames,
          wins: stat.wins,
          losses: stat.losses,
          winRate: stat.winRate,
          metadata: stat.metadata,
          updatedAt: stat.updatedAt || undefined,
        }));

        setStatsData(stats);

        // 最終更新日時を取得
        if (stats.length > 0 && stats[0].updatedAt) {
          const date = new Date(stats[0].updatedAt);
          setLastUpdated(date.toLocaleString('ja-JP'));
        }
      }
    } catch (error) {
      console.error('統計データの取得に失敗しました:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // シーズンでフィルタリング
  const filteredStatsData = selectedSeasonId
    ? statsData.filter((s) => s.seasonId === selectedSeasonId)
    : statsData;

  const classStats = filteredStatsData.filter((s) => s.statsType === 'class');
  const deckStats = filteredStatsData.filter((s) => s.statsType === 'deck');
  const matchupStats = filteredStatsData.filter((s) => s.statsType === 'matchup');
  const turnOrderStats = filteredStatsData.filter((s) => s.statsType === 'turnOrder');

  const tabButtons = [
    { id: 'class' as const, label: 'クラス別統計', icon: '🎴' },
    { id: 'deck' as const, label: 'デッキ別統計', icon: '📊' },
    { id: 'matchup' as const, label: 'マッチアップ', icon: '⚔️' },
    { id: 'turnOrder' as const, label: '先攻後攻', icon: '🎲' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">統計データを読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">シャドウバース 全体統計</h1>
            <Link href="/" className="text-sm hover:text-blue-200">
              ホームに戻る
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Info Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            📈 全ユーザー統計
          </h2>
          <p className="text-gray-600 mb-4">
            すべてのユーザーの対戦データを集計した統計情報です。
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              最終更新: {lastUpdated}
            </p>
          )}
        </div>

        {/* Season Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <SeasonFilter
            selectedSeasonId={selectedSeasonId}
            onSeasonChange={setSelectedSeasonId}
            storageKey="publicStatsSeasonId"
          />
        </div>

        {filteredStatsData.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <p className="text-gray-600 text-lg">
              まだ統計データがありません。
            </p>
            <p className="text-gray-500 text-sm mt-2">
              対戦データが登録されると、ここに統計情報が表示されます。
            </p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-6">
              <nav className="flex space-x-1">
                {tabButtons.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex flex-col items-center justify-center px-2 py-3 text-xs sm:text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl sm:text-lg mb-1">{tab.icon}</span>
                    <span className="text-xs sm:text-sm leading-tight">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'class' && <ClassStatsPublic stats={classStats} />}
            {activeTab === 'deck' && <DeckStatsPublic stats={deckStats} />}
            {activeTab === 'matchup' && <MatchupMatrix stats={matchupStats} />}
            {activeTab === 'turnOrder' && <TurnOrderStats stats={turnOrderStats} />}
          </>
        )}
      </div>
    </div>
  );
}
