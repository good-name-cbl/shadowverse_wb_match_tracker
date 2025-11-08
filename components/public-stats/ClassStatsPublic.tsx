'use client';

import React from 'react';
import { CLASS_COLORS, getWinRateColor } from '@/utils/constants';

interface AggregatedStats {
  statsType: string;
  statsKey: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  metadata?: any;
}

interface ClassStatsPublicProps {
  stats: AggregatedStats[];
}

export const ClassStatsPublic: React.FC<ClassStatsPublicProps> = ({ stats }) => {
  // 使用率順にソート
  const statsByUsage = [...stats].sort((a, b) => b.totalGames - a.totalGames);

  // 勝率順にソート（最低10試合以上）
  const statsByWinRate = [...stats]
    .filter((s) => s.totalGames >= 10)
    .sort((a, b) => b.winRate - a.winRate);

  const totalGames = stats.reduce((sum, s) => sum + s.totalGames, 0);

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          📊 クラス別統計サマリー
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">総試合数</p>
            <p className="text-2xl font-bold text-blue-600">{totalGames.toLocaleString()}</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">集計クラス数</p>
            <p className="text-2xl font-bold text-green-600">{stats.length}</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">平均勝率</p>
            <p className="text-2xl font-bold text-purple-600">
              {stats.length > 0
                ? (stats.reduce((sum, s) => sum + s.winRate, 0) / stats.length).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Usage Ranking */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🔥 クラス使用率ランキング
        </h3>
        <div className="space-y-3">
          {statsByUsage.map((stat, index) => {
            const usageRate = totalGames > 0 ? (stat.totalGames / totalGames) * 100 : 0;
            const classColor = CLASS_COLORS[stat.statsKey as keyof typeof CLASS_COLORS] || '#6B7280';

            return (
              <div
                key={stat.statsKey}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl font-bold text-gray-400">
                      #{index + 1}
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: classColor }}
                    >
                      {stat.statsKey}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">使用率</p>
                    <p className="text-xl font-bold text-gray-800">
                      {usageRate.toFixed(1)}%
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <p className="text-gray-600">試合数</p>
                    <p className="font-semibold">{stat.totalGames.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">勝率</p>
                    <p className={`font-semibold ${getWinRateColor(stat.winRate)}`}>
                      {stat.winRate.toFixed(1)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">勝数/敗数</p>
                    <p className="font-semibold">
                      {stat.wins}勝{stat.losses}敗
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Win Rate Ranking */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          🏆 クラス勝率ランキング
          <span className="text-sm text-gray-500 ml-2">（10試合以上）</span>
        </h3>
        {statsByWinRate.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            10試合以上のデータがありません
          </p>
        ) : (
          <div className="space-y-3">
            {statsByWinRate.map((stat, index) => {
              const classColor = CLASS_COLORS[stat.statsKey as keyof typeof CLASS_COLORS] || '#6B7280';

              return (
                <div
                  key={stat.statsKey}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl font-bold text-gray-400">
                        #{index + 1}
                      </span>
                      <span
                        className="px-3 py-1 rounded-full text-white font-medium"
                        style={{ backgroundColor: classColor }}
                      >
                        {stat.statsKey}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">勝率</p>
                      <p className={`text-2xl font-bold ${getWinRateColor(stat.winRate)}`}>
                        {stat.winRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-600">試合数</p>
                      <p className="font-semibold">{stat.totalGames.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">勝数</p>
                      <p className="font-semibold text-green-600">{stat.wins}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">敗数</p>
                      <p className="font-semibold text-red-600">{stat.losses}</p>
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
