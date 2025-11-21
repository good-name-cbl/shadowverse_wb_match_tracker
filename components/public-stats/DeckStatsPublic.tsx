'use client';

import React, { useState } from 'react';
import { CLASS_COLORS, getWinRateColor, CLASSES } from '@/utils/constants';
import { ClassType } from '@/types';

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
      {/* Filters */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          フィルター
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Class Filter */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              クラス
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value as ClassType | 'all')}
              className="w-full px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-200"
            >
              <option value="all" className="bg-slate-900 text-slate-200">すべて</option>
              {CLASSES.map((cls) => (
                <option key={cls} value={cls} className="bg-slate-900 text-slate-200">
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              並び順
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'usage' | 'winRate')}
              className="w-full px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-200"
            >
              <option value="usage" className="bg-slate-900 text-slate-200">使用率順</option>
              <option value="winRate" className="bg-slate-900 text-slate-200">勝率順</option>
            </select>
          </div>

          {/* Min Games (for win rate sort) */}
          {sortBy === 'winRate' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                最低試合数
              </label>
              <select
                value={minGames}
                onChange={(e) => setMinGames(Number(e.target.value))}
                className="w-full px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-200"
              >
                <option value={5} className="bg-slate-900 text-slate-200">5試合以上</option>
                <option value={10} className="bg-slate-900 text-slate-200">10試合以上</option>
                <option value={20} className="bg-slate-900 text-slate-200">20試合以上</option>
                <option value={50} className="bg-slate-900 text-slate-200">50試合以上</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Stats List */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          {sortBy === 'usage' ? '📊 デッキ使用率 TOP20' : '🏆 デッキ勝率 TOP20'}
          {sortBy === 'winRate' && (
            <span className="text-sm text-slate-500 ml-2">
              （{minGames}試合以上）
            </span>
          )}
        </h3>

        {topStats.length === 0 ? (
          <p className="text-slate-500 text-center py-8">
            該当するデータがありません
          </p>
        ) : (
          <div className="space-y-3">
            {topStats.map((stat, index) => {
              const className = stat.metadata?.className || '';
              const deckName = stat.metadata?.deckName || stat.statsKey;
              const classColor = CLASS_COLORS[className as keyof typeof CLASS_COLORS] || '#6B7280';

              return (
                <div
                  key={stat.statsKey}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <span className="text-xl font-bold text-slate-600">
                        #{index + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span
                            className="px-2 py-0.5 rounded text-white text-xs font-medium flex-shrink-0 shadow-sm"
                            style={{ backgroundColor: classColor }}
                          >
                            {className}
                          </span>
                        </div>
                        <p className="font-semibold text-slate-200 truncate">
                          {deckName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-slate-400">
                        {sortBy === 'usage' ? '試合数' : '勝率'}
                      </p>
                      <p className={`text-xl font-bold ${sortBy === 'usage' ? 'text-slate-200' : getWinRateColor(stat.winRate)
                        }`}>
                        {sortBy === 'usage'
                          ? stat.totalGames.toLocaleString()
                          : `${stat.winRate.toFixed(1)}%`
                        }
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-slate-400">試合数</p>
                      <p className="font-semibold text-slate-200">{stat.totalGames.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-slate-400">勝率</p>
                      <p className={`font-semibold ${getWinRateColor(stat.winRate)}`}>
                        {stat.winRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-400">勝数/敗数</p>
                      <p className="font-semibold text-slate-200">
                        {stat.wins}勝{stat.losses}敗
                      </p>
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
