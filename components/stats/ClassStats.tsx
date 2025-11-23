'use client';

import React from 'react';
import { ClassStatistics } from '@/types';
import { CLASS_COLORS, getWinRateColor } from '@/utils/constants';
import { ClassStatsMobile } from './ClassStatsMobile';

interface ClassStatsProps {
  stats: ClassStatistics[];
}

export const ClassStats: React.FC<ClassStatsProps> = ({ stats }) => {
  return (
    <div className="glass-card rounded-2xl p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center relative z-10">
        <span className="mr-3 text-2xl">🏆</span>
        クラス別パフォーマンス
      </h3>

      {/* モバイル表示 */}
      <div className="md:hidden">
        <ClassStatsMobile stats={stats} />
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:block overflow-x-auto relative z-10">
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                クラス
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                対戦数
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                勝利
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                敗北
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">
                勝率
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {stats.map((classStat) => (
              <tr key={classStat.className} className="group hover:bg-slate-700/20 transition-all duration-200">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div
                        className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${CLASS_COLORS[classStat.className].replace('bg-', 'text-').replace('text-white', '')}`}
                        style={{ backgroundColor: 'currentColor' }}
                      />
                      <div className={`absolute inset-0 w-3 h-3 rounded-full animate-ping opacity-20 ${CLASS_COLORS[classStat.className].replace('bg-', 'text-').replace('text-white', '')}`} style={{ backgroundColor: 'currentColor' }} />
                    </div>
                    <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {classStat.className}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-medium text-slate-300 bg-slate-800/50 px-2.5 py-1 rounded-md border border-slate-700/50">
                    {classStat.totalGames}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-bold text-green-400 drop-shadow-[0_0_8px_rgba(74,222,128,0.2)]">
                    {classStat.wins}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="text-sm font-bold text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,0.2)]">
                    {classStat.losses}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {classStat.totalGames > 0 ? (
                    <div className="flex items-center space-x-4">
                      <span className={`text-sm font-black w-12 text-right ${getWinRateColor(classStat.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                        {classStat.winRate.toFixed(1)}%
                      </span>
                      <div className="flex-1 bg-slate-800/50 rounded-full h-2 overflow-hidden border border-slate-700/30">
                        <div
                          className={`h-full rounded-full shadow-lg ${classStat.winRate >= 50
                              ? 'bg-gradient-to-r from-emerald-500 to-green-400 shadow-green-500/20'
                              : 'bg-gradient-to-r from-orange-500 to-red-400 shadow-red-500/20'
                            }`}
                          style={{ width: `${classStat.winRate}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500 italic">
                      No Data
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
