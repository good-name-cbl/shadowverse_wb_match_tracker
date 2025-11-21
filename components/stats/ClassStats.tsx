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
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
        <span className="mr-2">🏆</span>
        クラス別勝率
      </h3>

      {/* モバイル表示 */}
      <div className="md:hidden">
        <ClassStatsMobile stats={stats} />
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                クラス
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                対戦数
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                勝利数
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                敗北数
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                勝率
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {stats.map((classStat) => (
              <tr key={classStat.className} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] ${CLASS_COLORS[classStat.className].replace('bg-', 'text-').replace('text-white', '')}`}
                      style={{ backgroundColor: 'currentColor' }}
                    />
                    <span className="text-sm font-medium text-slate-200">
                      {classStat.className}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                  {classStat.totalGames}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-green-400">
                  {classStat.wins}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-red-400">
                  {classStat.losses}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {classStat.totalGames > 0 ? (
                    <div className="flex items-center space-x-3">
                      <span className={`text-sm font-bold ${getWinRateColor(classStat.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                        {classStat.winRate.toFixed(1)}%
                      </span>
                      <div className="w-24 bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-full"
                          style={{ width: `${classStat.winRate}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-slate-500">
                      データなし
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
