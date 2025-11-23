'use client';

import React from 'react';
import { MatchStatistics } from '@/types';
import { getWinRateColor } from '@/utils/constants';

interface OverallStatsProps {
  stats: MatchStatistics;
}

export const OverallStats: React.FC<OverallStatsProps> = ({ stats }) => {
  return (
    <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
      {/* Background Decoration */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl group-hover:bg-violet-500/20 transition-all duration-700" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl group-hover:bg-fuchsia-500/20 transition-all duration-700" />

      <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-slate-400 mb-6 flex items-center relative z-10">
        <span className="mr-3 text-2xl">📊</span>
        全体パフォーマンス
      </h3>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {/* Total Games */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group/card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">総試合数</div>
            <div className="p-1.5 rounded-lg bg-slate-700/50 text-slate-300 group-hover/card:text-white group-hover/card:bg-slate-600/50 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-slate-100">
            {stats.totalGames}
            <span className="text-sm font-normal text-slate-500 ml-1">戦</span>
          </div>
        </div>

        {/* Wins */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group/card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">勝利数</div>
            <div className="p-1.5 rounded-lg bg-green-500/10 text-green-400 group-hover/card:bg-green-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-green-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.3)]">
            {stats.wins}
            <span className="text-sm font-normal text-slate-500 ml-1">勝</span>
          </div>
        </div>

        {/* Losses */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group/card">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs font-medium text-slate-400 uppercase tracking-wider">敗北数</div>
            <div className="p-1.5 rounded-lg bg-red-500/10 text-red-400 group-hover/card:bg-red-500/20 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-red-400 drop-shadow-[0_0_10px_rgba(248,113,113,0.3)]">
            {stats.losses}
            <span className="text-sm font-normal text-slate-500 ml-1">敗</span>
          </div>
        </div>

        {/* Win Rate - Circular Progress */}
        <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:bg-slate-800/60 transition-all duration-300 group/card relative overflow-hidden flex flex-col items-center justify-center min-h-[160px]">
          <div className="relative w-24 h-24">
            {/* Background Circle */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700/50"
              />
              {/* Progress Circle */}
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={251.2}
                strokeDashoffset={251.2 - (251.2 * stats.winRate) / 100}
                strokeLinecap="round"
                className={`transition-all duration-1000 ease-out ${stats.winRate >= 50 ? 'text-green-500' : 'text-red-500'
                  } drop-shadow-[0_0_8px_rgba(currentColor,0.5)]`}
              />
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-xl font-black ${getWinRateColor(stats.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                {stats.winRate.toFixed(1)}
                <span className="text-xs font-normal ml-0.5">%</span>
              </span>
            </div>
          </div>

          <div className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
            勝率
          </div>
        </div>
      </div>
    </div>
  );
};
