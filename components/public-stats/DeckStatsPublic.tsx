'use client';

import React, { useState } from 'react';
import { CLASS_COLORS, getWinRateColor, CLASSES } from '@/utils/constants';
import { ClassType } from '@/types';
import { Select } from '@/components/ui/Select';

interface AggregatedStats {
  statsType: string;
  statsKey: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  metadata?: any;
}

interface DeckStatsPublicProps {
  stats: AggregatedStats[];
}

export const DeckStatsPublic: React.FC<DeckStatsPublicProps> = ({ stats }) => {
  const [selectedClass, setSelectedClass] = useState<ClassType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'usage' | 'winRate'>('usage');
  const [minGames, setMinGames] = useState(10);

  // クラスフィルター
  const filteredStats = selectedClass === 'all'
    ? stats
    : stats.filter((s) => s.metadata?.className === selectedClass);

  // ソート
  let sortedStats = [...filteredStats];
  if (sortBy === 'usage') {
    sortedStats = sortedStats.sort((a, b) => b.totalGames - a.totalGames);
  } else {
    sortedStats = sortedStats
      .filter((s) => s.totalGames >= minGames)
      .sort((a, b) => b.winRate - a.winRate);
  }

  // TOP20に絞る
  const topStats = sortedStats.slice(0, 20);

  return (
    <div className="space-y-6">
      {/* Explanation Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-green-500" />
        <div className="absolute inset-0 bg-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3 bg-green-500/10 rounded-xl">
            <span className="text-2xl">ℹ️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-green-300 mb-2 flex items-center">
              この統計について
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              <strong className="text-green-400 font-medium">対戦相手が使用したデッキ</strong>の統計データです。
              テンプレート登録された主要デッキや、その他のデッキの使用率・勝率を確認できます。
              <br className="hidden sm:block" />
              <span className="text-slate-500 text-xs mt-1 block">
                ※ 自分が使用したデッキの統計ではなく、対戦相手のデッキ分布を示しています。
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 opacity-50" />
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
          <span className="mr-2">🔍</span> フィルター & 並び替え
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Class Filter */}
          <Select
            label="クラス"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value as ClassType | 'all')}
            options={[
              { value: 'all', label: 'すべてのクラス' },
              ...CLASSES.map(cls => ({ value: cls, label: cls }))
            ]}
          />

          {/* Sort By */}
          <Select
            label="並び順"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'usage' | 'winRate')}
            options={[
              { value: 'usage', label: '使用率順' },
              { value: 'winRate', label: '勝率順' }
            ]}
          />

          {/* Min Games (for win rate sort) */}
          {sortBy === 'winRate' && (
            <Select
              label="最低試合数"
              value={String(minGames)}
              onChange={(e) => setMinGames(Number(e.target.value))}
              options={[
                { value: '5', label: '5試合以上' },
                { value: '10', label: '10試合以上' },
                { value: '20', label: '20試合以上' },
                { value: '50', label: '50試合以上' }
              ]}
            />
          )}
        </div>
      </div>

      {/* Stats List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">{sortBy === 'usage' ? '📊' : '🏆'}</span>
            {sortBy === 'usage' ? 'デッキ使用率ランキング' : 'デッキ勝率ランキング'}
            <span className="text-sm font-normal text-slate-500 ml-3 bg-slate-800/50 px-2 py-1 rounded-full">
              TOP 20
            </span>
          </h3>
        </div>

        {topStats.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center">
            <p className="text-slate-500">該当するデータがありません</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {topStats.map((stat, index) => {
              const className = stat.metadata?.className || '';
              const deckName = stat.metadata?.deckName || stat.statsKey;
              const classColor = CLASS_COLORS[className as keyof typeof CLASS_COLORS] || 'bg-slate-500';
              const winRateColor = getWinRateColor(stat.winRate);

              return (
                <div
                  key={stat.statsKey}
                  className="glass-card rounded-xl p-5 relative overflow-hidden group hover:scale-[1.01] transition-all duration-300 border border-white/5 hover:border-white/10"
                >
                  {/* Background Gradient based on Class */}
                  <div className={`absolute top-0 right-0 w-64 h-64 opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity group-hover:opacity-10 ${classColor.replace('bg-', 'bg-')}`} />

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                    {/* Rank & Deck Info */}
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center bg-slate-800/50 rounded-xl border border-white/5 shadow-inner">
                        <span className={`text-xl font-black ${index < 3 ? 'text-yellow-400' : 'text-slate-500'}`}>
                          #{index + 1}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${classColor}`} />
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {className}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-slate-100 truncate group-hover:text-white transition-colors">
                          {deckName}
                        </h4>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-3 gap-8 md:w-1/2">
                      {/* Games */}
                      <div className="text-center md:text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">試合数</p>
                        <p className="text-xl font-bold text-slate-200">{stat.totalGames.toLocaleString()}</p>
                      </div>

                      {/* Win Rate */}
                      <div className="text-center md:text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">勝率</p>
                        <div className="flex flex-col items-end">
                          <p className={`text-xl font-black ${winRateColor.replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                            {stat.winRate.toFixed(1)}%
                          </p>
                          <div className="w-full md:w-24 h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${stat.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'
                                }`}
                              style={{ width: `${stat.winRate}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Record */}
                      <div className="text-center md:text-right">
                        <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">戦績</p>
                        <p className="text-lg font-medium text-slate-300">
                          <span className="text-green-400 font-bold">{stat.wins}</span>
                          <span className="text-slate-600 mx-1">-</span>
                          <span className="text-red-400 font-bold">{stat.losses}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
