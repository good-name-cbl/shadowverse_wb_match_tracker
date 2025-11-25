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
import { Footer } from '@/components/layout/Footer';
import outputs from '@/amplify_outputs.json';

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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, [selectedSeasonId]);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('[DEBUG] Fetching stats with direct GraphQL...');
      console.log('[DEBUG] API URL:', outputs.data.url);
      console.log('[DEBUG] API Key exists:', !!outputs.data.api_key);

      // 直接fetchでGraphQLクエリを実行
      const response = await fetch(outputs.data.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': outputs.data.api_key,
        },
        body: JSON.stringify({
          query: `
            query ListAggregatedStats {
              listAggregatedStats {
                items {
                  id
                  seasonId
                  seasonName
                  statsType
                  statsKey
                  totalGames
                  wins
                  losses
                  winRate
                  metadata
                  updatedAt
                }
              }
            }
          `,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('[DEBUG] GraphQL result:', result);

      if (result.errors) {
        console.error('[DEBUG] GraphQL errors:', result.errors);
        throw new Error(result.errors[0]?.message || 'GraphQLエラーが発生しました');
      }

      if (result.data?.listAggregatedStats?.items) {
        const stats: AggregatedStats[] = result.data.listAggregatedStats.items
          .filter((stat: any) => stat !== null && stat !== undefined)
          .map((stat: any) => ({
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

        console.log('[DEBUG] Processed stats:', stats);
        console.log('[DEBUG] Stats length:', stats.length);

        setStatsData(stats);

        // 最終更新日時を取得
        if (stats.length > 0 && stats[0].updatedAt) {
          const date = new Date(stats[0].updatedAt);
          setLastUpdated(date.toLocaleString('ja-JP'));
        }
      } else {
        console.log('[DEBUG] No data returned');
      }
    } catch (error) {
      console.error('統計データの取得に失敗しました:', error);
      setError(error instanceof Error ? error.message : '統計データの取得に失敗しました');
    } finally {
      setIsLoading(false);
      console.log('[DEBUG] Loading finished');
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

  console.log('[DEBUG] statsData.length:', statsData.length);
  console.log('[DEBUG] classStats.length:', classStats.length);
  console.log('[DEBUG] deckStats.length:', deckStats.length);
  console.log('[DEBUG] matchupStats.length:', matchupStats.length);
  console.log('[DEBUG] turnOrderStats.length:', turnOrderStats.length);

  const tabButtons = [
    { id: 'class' as const, label: 'クラス別統計', icon: '🎴' },
    { id: 'deck' as const, label: 'デッキ別統計', icon: '📊' },
    { id: 'matchup' as const, label: 'マッチアップ', icon: '⚔️' },
    { id: 'turnOrder' as const, label: '先攻後攻', icon: '🎲' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/10 via-transparent to-transparent" />
        <div className="text-center relative z-10">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
            <div className="absolute inset-0 rounded-full border-4 border-t-violet-500 animate-spin" />
          </div>
          <p className="text-slate-400 animate-pulse">Loading Statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Ambient Glow - Subtle overlay for readability */}
      <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-violet-900/10 to-transparent pointer-events-none" />
      <div className="fixed top-20 right-0 w-[600px] h-[600px] bg-fuchsia-500/3 rounded-full blur-[100px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="glass border-b border-white/5 sticky top-0 z-50 backdrop-blur-xl bg-slate-950/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 via-fuchsia-400 to-white bg-clip-text text-transparent">
              Shadowverse Global Statistics
            </h1>
            <Link
              href="/"
              className="group flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-white/5 transition-all duration-300"
            >
              <span className="text-sm text-slate-400 group-hover:text-white transition-colors">ホームに戻る</span>
              <svg className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Info Card */}
          <div className="lg:col-span-8 glass-card rounded-2xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-700" />
            <h2 className="text-3xl font-black text-white mb-3 relative z-10">
              Global Meta Report
            </h2>
            <p className="text-slate-400 text-lg mb-4 relative z-10 max-w-2xl">
              全ユーザーの対戦データを集計した統計情報です。
              現在のメタゲームを分析し、最適なデッキ選択に役立てましょう。
            </p>
            {lastUpdated && (
              <div className="flex items-center space-x-2 text-sm text-slate-500 relative z-10">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>Last updated: {lastUpdated}</span>
              </div>
            )}
          </div>

          {/* Season Filter */}
          <div className="lg:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-50" />
            <div className="relative z-10">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center">
                <span className="mr-2">📅</span> Target Season
              </h3>
              <SeasonFilter
                selectedSeasonId={selectedSeasonId}
                onSeasonChange={setSelectedSeasonId}
                storageKey="publicStatsSeasonId"
              />
            </div>
          </div>
        </div>

        {error ? (
          <div className="glass-card rounded-2xl border border-red-500/20 p-8 text-center animate-in fade-in slide-in-from-top-2">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-red-400 mb-2">Failed to load statistics</h3>
            <p className="text-slate-400 mb-6">{error}</p>
            <button
              onClick={() => {
                setError(null);
                fetchStats();
              }}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-lg shadow-red-500/20"
            >
              Retry
            </button>
          </div>
        ) : statsData.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center animate-in fade-in slide-in-from-top-2">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700/50">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-bold text-slate-200 mb-2">No Data Available</h3>
            <p className="text-slate-400">
              まだ統計データがありません。対戦データが登録されると、ここに統計情報が表示されます。
            </p>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="glass-card rounded-2xl p-2 mb-8 sticky top-20 z-40 backdrop-blur-xl bg-slate-900/80 border border-white/10 shadow-xl">
              <nav className="flex space-x-2 overflow-x-auto no-scrollbar">
                {tabButtons.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 min-w-[100px] flex flex-col items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden group ${activeTab === tab.id
                        ? 'text-white shadow-lg'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                      }`}
                  >
                    {activeTab === tab.id && (
                      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-fuchsia-600 opacity-100" />
                    )}
                    <span className="text-2xl mb-1 relative z-10 transform transition-transform group-hover:scale-110 duration-300">{tab.icon}</span>
                    <span className="text-xs sm:text-sm font-bold relative z-10">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="animate-in fade-in slide-in-from-top-2 duration-500">
              {activeTab === 'class' && <ClassStatsPublic stats={classStats} />}
              {activeTab === 'deck' && <DeckStatsPublic stats={deckStats} />}
              {activeTab === 'matchup' && <MatchupMatrix stats={matchupStats} />}
              {activeTab === 'turnOrder' && <TurnOrderStats stats={turnOrderStats} />}
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
