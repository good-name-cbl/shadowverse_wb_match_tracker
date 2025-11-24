'use client';

import React from 'react';
import ClassIcon from '@/components/ui/ClassIcon';
import { getWinRateColor } from '@/utils/constants';
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

interface ClassStatsPublicProps {
  stats: AggregatedStats[];
}

export const ClassStatsPublic: React.FC<ClassStatsPublicProps> = ({ stats }) => {
  // 使用率順にソート
  const statsByUsage = [...stats].sort((a, b) => b.totalGames - a.totalGames);

  const totalGames = stats.reduce((sum, s) => sum + s.totalGames, 0);

  return (
    <div className="space-y-6">
      {/* Explanation Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3 bg-blue-500/10 rounded-xl">
            <span className="text-2xl">ℹ️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-blue-300 mb-2 flex items-center">
              この統計について
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              <strong className="text-blue-400 font-medium">対戦相手が使用したクラス</strong>の統計データです。
              現在のメタゲームにおける各クラスの人気度（使用率）や、その強さ（勝率）を分析できます。
              <br className="hidden sm:block" />
              <span className="text-slate-500 text-xs mt-1 block">
                ※ 自分が使用したクラスの統計ではなく、対戦相手のクラス分布を示しています。
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <p className="text-sm font-medium text-blue-300 mb-1 uppercase tracking-wider">総試合数</p>
          <p className="text-3xl font-black text-white drop-shadow-lg">{totalGames.toLocaleString()}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />
          <p className="text-sm font-medium text-green-300 mb-1 uppercase tracking-wider">集計クラス数</p>
          <p className="text-3xl font-black text-white drop-shadow-lg">{stats.length}</p>
        </div>
        <div className="glass-card rounded-2xl p-6 relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300">
          <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all" />
          <p className="text-sm font-medium text-purple-300 mb-1 uppercase tracking-wider">平均勝率</p>
          <p className="text-3xl font-black text-white drop-shadow-lg">
            {stats.length > 0
              ? (stats.reduce((sum, s) => sum + s.winRate, 0) / stats.length).toFixed(1)
              : 0}%
          </p>
        </div>
      </div>

      {/* Main Stats Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5 shadow-xl">
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5 backdrop-blur-md">
          <h3 className="text-xl font-bold text-white flex items-center">
            <span className="mr-2">📊</span> クラス別成績
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-900/50 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-white/5">
                <th className="px-6 py-4">クラス</th>
                <th className="px-6 py-4 text-center">使用率</th>
                <th className="px-6 py-4 text-center">勝率</th>
                <th className="px-6 py-4 text-center">試合数</th>
                <th className="px-6 py-4 text-center hidden sm:table-cell">勝 - 敗</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {statsByUsage.map((stat, index) => {
                const usageRate = totalGames > 0 ? (stat.totalGames / totalGames) * 100 : 0;
                const winRateColor = getWinRateColor(stat.winRate);

                return (
                  <tr
                    key={stat.statsKey}
                    className="group hover:bg-white/5 transition-colors duration-200"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-slate-500 font-mono text-sm w-4">#{index + 1}</span>
                        <ClassIcon
                          className={stat.statsKey as ClassType}
                          size="large"
                          showLabel
                          labelClassName="font-bold text-slate-200 text-lg"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-slate-200">{usageRate.toFixed(1)}%</span>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                          <div
                            className="h-full bg-slate-400 rounded-full"
                            style={{ width: `${usageRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center">
                        <span className={`font-black text-lg ${winRateColor.replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                          {stat.winRate.toFixed(1)}%
                        </span>
                        <div className="w-24 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden relative">
                          <div
                            className={`h-full rounded-full ${stat.winRate >= 50 ? 'bg-gradient-to-r from-emerald-500 to-green-400' : 'bg-gradient-to-r from-orange-500 to-red-400'
                              }`}
                            style={{ width: `${stat.winRate}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-medium text-slate-300">{stat.totalGames.toLocaleString()}</span>
                    </td>
                    <td className="px-6 py-4 text-center hidden sm:table-cell">
                      <div className="flex items-center justify-center space-x-1 text-sm">
                        <span className="text-green-400 font-bold">{stat.wins}W</span>
                        <span className="text-slate-600">-</span>
                        <span className="text-red-400 font-bold">{stat.losses}L</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
