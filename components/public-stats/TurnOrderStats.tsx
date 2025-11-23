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
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
        <div className="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3 bg-amber-500/10 rounded-xl">
            <span className="text-2xl">ℹ️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-amber-300 mb-2 flex items-center">
              この統計について
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              <strong className="text-amber-400 font-medium">先攻と後攻の有利不利</strong>を示す統計データです。
              全ユーザーの対戦データから、先攻時と後攻時の勝率を集計しています。
              <br className="hidden sm:block" />
              <span className="text-slate-500 text-xs mt-1 block">
                ※ 勝率差が大きいほど、先攻・後攻の影響が強い環境といえます。
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <p className="text-sm font-medium text-blue-300 mb-1 uppercase tracking-wider">総試合数</p>
          <p className="text-3xl font-black text-white drop-shadow-lg">{totalGames.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <p className="text-sm font-medium text-purple-300 mb-1 uppercase tracking-wider">勝率差</p>
          <p className="text-3xl font-black text-white drop-shadow-lg">
            {firstPlayerStats && secondPlayerStats
              ? Math.abs(firstPlayerStats.winRate - secondPlayerStats.winRate).toFixed(1)
              : 0}%
          </p>
        </div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Player */}
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/5 hover:border-amber-500/30 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center border border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">先攻</h3>
                <p className="text-xs text-amber-400 uppercase tracking-wider font-medium">Aggressive</p>
              </div>
            </div>
            {firstPlayerStats && (
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">勝率</p>
                <p className={`text-4xl font-black ${getWinRateColor(firstPlayerStats.winRate)} drop-shadow-lg`}>
                  {firstPlayerStats.winRate.toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          {firstPlayerStats ? (
            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">試合数</p>
                  <p className="text-lg font-bold text-slate-200">
                    {firstPlayerStats.totalGames.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
                  <p className="text-[10px] text-green-300 uppercase tracking-wider mb-1">勝数</p>
                  <p className="text-lg font-bold text-green-400">
                    {firstPlayerStats.wins}
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-xl p-3 text-center border border-red-500/20">
                  <p className="text-[10px] text-red-300 uppercase tracking-wider mb-1">敗数</p>
                  <p className="text-lg font-bold text-red-400">
                    {firstPlayerStats.losses}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">勝敗比率</span>
                  <span className="text-slate-300 font-medium">{firstPlayerStats.winRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full ${firstPlayerStats.winRate >= 50 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-slate-500 to-slate-400'
                      } shadow-[0_0_10px_rgba(245,158,11,0.3)]`}
                    style={{ width: `${firstPlayerStats.winRate}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500">
              No Data Available
            </div>
          )}
        </div>

        {/* Second Player */}
        <div className="glass-card rounded-2xl p-8 relative overflow-hidden group border border-white/5 hover:border-blue-500/30 transition-all">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="flex items-center justify-between mb-8 relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <span className="text-2xl">🛡️</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">後攻</h3>
                <p className="text-xs text-blue-400 uppercase tracking-wider font-medium">Defensive</p>
              </div>
            </div>
            {secondPlayerStats && (
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">勝率</p>
                <p className={`text-4xl font-black ${getWinRateColor(secondPlayerStats.winRate)} drop-shadow-lg`}>
                  {secondPlayerStats.winRate.toFixed(1)}%
                </p>
              </div>
            )}
          </div>

          {secondPlayerStats ? (
            <div className="space-y-6 relative z-10">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-white/5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-1">試合数</p>
                  <p className="text-lg font-bold text-slate-200">
                    {secondPlayerStats.totalGames.toLocaleString()}
                  </p>
                </div>
                <div className="bg-green-500/10 rounded-xl p-3 text-center border border-green-500/20">
                  <p className="text-[10px] text-green-300 uppercase tracking-wider mb-1">勝数</p>
                  <p className="text-lg font-bold text-green-400">
                    {secondPlayerStats.wins}
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-xl p-3 text-center border border-red-500/20">
                  <p className="text-[10px] text-red-300 uppercase tracking-wider mb-1">敗数</p>
                  <p className="text-lg font-bold text-red-400">
                    {secondPlayerStats.losses}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between text-xs mb-2">
                  <span className="text-slate-400">勝敗比率</span>
                  <span className="text-slate-300 font-medium">{secondPlayerStats.winRate.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-800/50 rounded-full h-3 overflow-hidden border border-white/5">
                  <div
                    className={`h-full rounded-full ${secondPlayerStats.winRate >= 50 ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-gradient-to-r from-slate-500 to-slate-400'
                      } shadow-[0_0_10px_rgba(59,130,246,0.3)]`}
                    style={{ width: `${secondPlayerStats.winRate}%` }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-slate-500">
              No Data Available
            </div>
          )}
        </div>
      </div>

      {/* Analysis */}
      {firstPlayerStats && secondPlayerStats && (
        <div className="glass-card rounded-2xl p-8 border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500 opacity-50" />

          <h3 className="text-lg font-bold text-slate-100 mb-6 flex items-center">
            <span className="mr-2">📊</span> 環境分析
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <span className="text-sm text-slate-300 font-medium">先攻有利度</span>
              <span className={`text-lg font-black ${firstPlayerStats.winRate > 50 ? 'text-green-400' : 'text-slate-400'}`}>
                {firstPlayerStats.winRate > 50 ? '+' : ''}
                {(firstPlayerStats.winRate - 50).toFixed(1)}%
              </span>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5 flex items-center justify-between">
              <span className="text-sm text-slate-300 font-medium">後攻有利度</span>
              <span className={`text-lg font-black ${secondPlayerStats.winRate > 50 ? 'text-green-400' : 'text-slate-400'}`}>
                {secondPlayerStats.winRate > 50 ? '+' : ''}
                {(secondPlayerStats.winRate - 50).toFixed(1)}%
              </span>
            </div>
          </div>

          <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            <p className="text-slate-300 leading-relaxed relative z-10">
              {firstPlayerStats.winRate > secondPlayerStats.winRate ? (
                <>
                  <span className="font-bold text-amber-400 text-lg">先攻有利</span><br />
                  現在の環境は先攻が有利です。先攻の勝率は <span className="font-bold text-white">{firstPlayerStats.winRate.toFixed(1)}%</span>、後攻の勝率は <span className="font-bold text-white">{secondPlayerStats.winRate.toFixed(1)}%</span> となっています。
                </>
              ) : firstPlayerStats.winRate < secondPlayerStats.winRate ? (
                <>
                  <span className="font-bold text-blue-400 text-lg">後攻有利</span><br />
                  現在の環境は後攻が有利です。後攻の勝率は <span className="font-bold text-white">{secondPlayerStats.winRate.toFixed(1)}%</span>、先攻の勝率は <span className="font-bold text-white">{firstPlayerStats.winRate.toFixed(1)}%</span> となっています。
                </>
              ) : (
                <>
                  <span className="font-bold text-purple-400 text-lg">バランスが取れています</span><br />
                  先攻と後攻の勝率が同じです（<span className="font-bold text-white">{firstPlayerStats.winRate.toFixed(1)}%</span>）。
                </>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
