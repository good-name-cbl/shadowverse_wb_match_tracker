'use client';

import React from 'react';
import { getWinRateColor } from '@/utils/constants';

interface AggregatedStats {
  statsType: string;
  statsKey: string;
  totalGames: number;
  wins: number;
  losses: number;
  winRate: number;
  metadata?: any;
}

interface TurnOrderStatsProps {
  stats: AggregatedStats[];
}

export const TurnOrderStats: React.FC<TurnOrderStatsProps> = ({ stats }) => {
  const firstPlayerStats = stats.find((s) => s.statsKey === 'first');
  const secondPlayerStats = stats.find((s) => s.statsKey === 'second');

  const totalGames = (firstPlayerStats?.totalGames || 0) + (secondPlayerStats?.totalGames || 0);

  return (
    <div className="space-y-6">
      {/* Explanation Card */}
      <div className="glass-card rounded-xl p-6 bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="text-lg font-semibold text-amber-300 mb-2">
              この統計について
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-amber-400">先攻と後攻の有利不利</strong>を示す統計です。
              全ユーザーの対戦データから、先攻時と後攻時の勝率を集計しています。
              勝率差が大きいほど、先攻・後攻の影響が強い環境といえます。
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          🎲 先攻後攻統計サマリー
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="text-sm text-blue-300 mb-1">総試合数</p>
            <p className="text-2xl font-bold text-blue-400">
              {totalGames.toLocaleString()}
            </p>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
            <p className="text-sm text-purple-300 mb-1">先攻後攻の勝率差</p>
            <p className="text-2xl font-bold text-purple-400">
              {firstPlayerStats && secondPlayerStats
                ? Math.abs(firstPlayerStats.winRate - secondPlayerStats.winRate).toFixed(1)
                : 0}%
            </p>
          </div>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Player */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-100">
              ⚡ 先攻
            </h3>
            {firstPlayerStats && (
              <div className="text-right">
                <p className="text-sm text-slate-400">勝率</p>
                <p className={`text-3xl font-bold ${getWinRateColor(firstPlayerStats.winRate)}`}>
                  {firstPlayerStats.winRate.toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          {firstPlayerStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">試合数</p>
                  <p className="text-lg font-bold text-slate-200">
                    {firstPlayerStats.totalGames.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-300 mb-1">勝数</p>
                  <p className="text-lg font-bold text-green-400">
                    {firstPlayerStats.wins}
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-red-300 mb-1">敗数</p>
                  <p className="text-lg font-bold text-red-400">
                    {firstPlayerStats.losses}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <p className="text-sm text-slate-400 mb-2">勝敗比率</p>
                <div className="w-full bg-slate-700 rounded-full h-6">
                  <div
                    className="bg-green-500 h-6 rounded-full flex items-center justify-center text-xs text-white font-semibold shadow-sm"
                    style={{ width: `${firstPlayerStats.winRate}%` }}
                  >
                    {firstPlayerStats.winRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              データがありません
            </p>
          )}
        </div>

        {/* Second Player */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-slate-100">
              🛡️ 後攻
            </h3>
            {secondPlayerStats && (
              <div className="text-right">
                <p className="text-sm text-slate-400">勝率</p>
                <p className={`text-3xl font-bold ${getWinRateColor(secondPlayerStats.winRate)}`}>
                  {secondPlayerStats.winRate.toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          {secondPlayerStats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-lg p-3 text-center">
                  <p className="text-xs text-slate-400 mb-1">試合数</p>
                  <p className="text-lg font-bold text-slate-200">
                    {secondPlayerStats.totalGames.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-green-300 mb-1">勝数</p>
                  <p className="text-lg font-bold text-green-400">
                    {secondPlayerStats.wins}
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-lg p-3 text-center">
                  <p className="text-xs text-red-300 mb-1">敗数</p>
                  <p className="text-lg font-bold text-red-400">
                    {secondPlayerStats.losses}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <p className="text-sm text-slate-400 mb-2">勝敗比率</p>
                <div className="w-full bg-slate-700 rounded-full h-6">
                  <div
                    className="bg-green-500 h-6 rounded-full flex items-center justify-center text-xs text-white font-semibold shadow-sm"
                    style={{ width: `${secondPlayerStats.winRate}%` }}
                  >
                    {secondPlayerStats.winRate.toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center py-8">
              データがありません
            </p>
          )}
        </div>
      </div>

      {/* Analysis */}
      {firstPlayerStats && secondPlayerStats && (
        <div className="glass-card rounded-xl p-6">
          <h3 className="text-lg font-semibold text-slate-100 mb-4">
            📊 分析
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">先攻有利度</span>
              <span className={`font-semibold ${firstPlayerStats.winRate > 50 ? 'text-green-400' : 'text-red-400'
                }`}>
                {firstPlayerStats.winRate > 50 ? '+' : ''}
                {(firstPlayerStats.winRate - 50).toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-300">後攻有利度</span>
              <span className={`font-semibold ${secondPlayerStats.winRate > 50 ? 'text-green-400' : 'text-red-400'
                }`}>
                {secondPlayerStats.winRate > 50 ? '+' : ''}
                {(secondPlayerStats.winRate - 50).toFixed(1)}%
              </span>
            </div>
            <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-slate-300">
                {firstPlayerStats.winRate > secondPlayerStats.winRate ? (
                  <>
                    <span className="font-semibold text-blue-300">先攻が有利</span>
                    な環境です。先攻の勝率は
                    <span className="font-semibold"> {firstPlayerStats.winRate.toFixed(1)}%</span>、
                    後攻の勝率は
                    <span className="font-semibold"> {secondPlayerStats.winRate.toFixed(1)}%</span>
                    となっています。
                  </>
                ) : firstPlayerStats.winRate < secondPlayerStats.winRate ? (
                  <>
                    <span className="font-semibold text-blue-300">後攻が有利</span>
                    な環境です。後攻の勝率は
                    <span className="font-semibold"> {secondPlayerStats.winRate.toFixed(1)}%</span>、
                    先攻の勝率は
                    <span className="font-semibold"> {firstPlayerStats.winRate.toFixed(1)}%</span>
                    となっています。
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-blue-300">先攻後攻がほぼ同等</span>
                    な環境です。両方とも
                    <span className="font-semibold"> {firstPlayerStats.winRate.toFixed(1)}%</span>
                    の勝率となっています。
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
