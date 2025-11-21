'use client';

import React, { useState } from 'react';
import { DeckTypeStatistics } from '@/types';
import { getWinRateColor } from '@/utils/constants';

interface DeckTypeStatsProps {
  stats: DeckTypeStatistics[];
}

export const DeckTypeStats: React.FC<DeckTypeStatsProps> = ({ stats }) => {
  const [expandedDeckTypes, setExpandedDeckTypes] = useState<Set<string>>(new Set());

  const toggleExpanded = (deckType: string) => {
    const newExpanded = new Set(expandedDeckTypes);
    if (newExpanded.has(deckType)) {
      newExpanded.delete(deckType);
    } else {
      newExpanded.add(deckType);
    }
    setExpandedDeckTypes(newExpanded);
  };

  if (stats.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          デッキタイプ別勝率
        </h3>
        <div className="py-8 text-slate-400">
          対戦記録がありません
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
        <span className="mr-2">🃏</span>
        デッキタイプ別勝率
      </h3>

      <div className="space-y-3">
        {stats.map((deckTypeStat) => (
          <div key={deckTypeStat.deckType} className="border border-slate-700/50 rounded-xl overflow-hidden bg-slate-800/30">
            <div
              className="p-4 cursor-pointer hover:bg-slate-700/30 transition-colors"
              onClick={() => toggleExpanded(deckTypeStat.deckType)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-200">
                      {deckTypeStat.deckType}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs sm:text-sm">
                      <span className="text-slate-400">
                        {deckTypeStat.totalGames}戦
                      </span>
                      <span className="text-green-400">
                        {deckTypeStat.wins}勝
                      </span>
                      <span className="text-red-400">
                        {deckTypeStat.losses}敗
                      </span>
                      <span className={`font-bold ${getWinRateColor(deckTypeStat.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                        {deckTypeStat.winRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-1.5 rounded-full"
                      style={{ width: `${deckTypeStat.winRate}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <svg
                    className={`w-5 h-5 text-slate-400 transform transition-transform ${expandedDeckTypes.has(deckTypeStat.deckType) ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {expandedDeckTypes.has(deckTypeStat.deckType) && (
              <div className="px-4 pb-4 border-t border-slate-700/50 bg-slate-900/30">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <h5 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">先攻時</h5>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {deckTypeStat.firstPlayerStats.totalGames}戦
                      </span>
                      <span className="text-green-400">
                        {deckTypeStat.firstPlayerStats.wins}勝
                      </span>
                      <span className="text-red-400">
                        {deckTypeStat.firstPlayerStats.losses}敗
                      </span>
                      <span className={`font-bold ${getWinRateColor(deckTypeStat.firstPlayerStats.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                        {deckTypeStat.firstPlayerStats.totalGames > 0
                          ? `${deckTypeStat.firstPlayerStats.winRate.toFixed(1)}%`
                          : '-'
                        }
                      </span>
                    </div>
                    {deckTypeStat.firstPlayerStats.totalGames > 0 && (
                      <div className="mt-2 w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${deckTypeStat.firstPlayerStats.winRate}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
                    <h5 className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">後攻時</h5>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">
                        {deckTypeStat.secondPlayerStats.totalGames}戦
                      </span>
                      <span className="text-green-400">
                        {deckTypeStat.secondPlayerStats.wins}勝
                      </span>
                      <span className="text-red-400">
                        {deckTypeStat.secondPlayerStats.losses}敗
                      </span>
                      <span className={`font-bold ${getWinRateColor(deckTypeStat.secondPlayerStats.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                        {deckTypeStat.secondPlayerStats.totalGames > 0
                          ? `${deckTypeStat.secondPlayerStats.winRate.toFixed(1)}%`
                          : '-'
                        }
                      </span>
                    </div>
                    {deckTypeStat.secondPlayerStats.totalGames > 0 && (
                      <div className="mt-2 w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
                        <div
                          className="bg-orange-500 h-1 rounded-full"
                          style={{ width: `${deckTypeStat.secondPlayerStats.winRate}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
