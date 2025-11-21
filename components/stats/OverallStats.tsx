'use client';

import React from 'react';
import { MatchStatistics } from '@/types';
import { getWinRateColor } from '@/utils/constants';

interface OverallStatsProps {
  stats: MatchStatistics;
}

export const OverallStats: React.FC<OverallStatsProps> = ({ stats }) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center">
        <span className="mr-2">📊</span>
        全体勝率
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="text-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="text-3xl font-bold text-slate-100 mb-1">
            {stats.totalGames}
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            総試合数
          </div>
        </div>

        <div className="text-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="text-3xl font-bold text-green-400 mb-1">
            {stats.wins}
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            勝利数
          </div>
        </div>

        <div className="text-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50">
          <div className="text-3xl font-bold text-red-400 mb-1">
            {stats.losses}
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            敗北数
          </div>
        </div>

        <div className="text-center p-4 rounded-xl bg-slate-800/30 border border-slate-700/50 relative overflow-hidden">
          <div className={`text-3xl font-bold mb-1 ${getWinRateColor(stats.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
            {stats.winRate.toFixed(1)}%
          </div>
          <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            勝率
          </div>
          {/* Background glow based on winrate */}
          <div className={`absolute inset-0 opacity-10 ${stats.winRate >= 50 ? 'bg-green-500' : 'bg-red-500'
            }`} />
        </div>
      </div>

      {stats.totalGames > 0 && (
        <div className="mt-6">
          <div className="w-full bg-slate-700/50 rounded-full h-3 overflow-hidden border border-slate-600/50">
            <div
              className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(139,92,246,0.3)]"
              style={{ width: `${stats.winRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
