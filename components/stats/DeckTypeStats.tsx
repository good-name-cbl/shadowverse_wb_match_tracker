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
      <div className="glass-card rounded-2xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />
        <div className="relative z-10">
          <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-700/50">
            <span className="text-3xl">🃏</span>
          </div>
          <h3 className="text-xl font-bold text-slate-200 mb-2">
            デッキタイプ別データなし
          </h3>
          <p className="text-slate-400 max-w-md mx-auto">
            対戦記録を追加すると、相手のデッキタイプごとの勝率や先攻・後攻別の詳細な分析が表示されます。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl p-6">
      <h3 className="text-xl font-bold text-slate-100 mb-6 flex items-center">
        <span className="mr-3 text-2xl">🃏</span>
        デッキタイプ別分析
      </h3>

      <div className="space-y-4">
        {stats.map((deckTypeStat) => {
          const isExpanded = expandedDeckTypes.has(deckTypeStat.deckType);
          return (
            <div
              key={deckTypeStat.deckType}
              className={`border transition-all duration-300 rounded-xl overflow-hidden ${isExpanded
                  ? 'bg-slate-800/40 border-violet-500/30 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                  : 'bg-slate-800/20 border-slate-700/30 hover:bg-slate-800/40 hover:border-slate-600/50'
                }`}
            >
              <div
                className="p-5 cursor-pointer"
                onClick={() => toggleExpanded(deckTypeStat.deckType)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <h4 className="text-lg font-bold text-slate-100">
                          {deckTypeStat.deckType}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/50">
                          {deckTypeStat.totalGames} Games
                        </span>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                          <div className="text-xs text-slate-400 mb-0.5">Win Rate</div>
                          <div className={`text-lg font-black ${getWinRateColor(deckTypeStat.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                            {deckTypeStat.winRate.toFixed(1)}%
                          </div>
                        </div>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform duration-300 bg-slate-700/30 ${isExpanded ? 'rotate-180 bg-violet-500/20 text-violet-300' : 'text-slate-400'}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-slate-700/30 rounded-full h-2 overflow-hidden flex">
                      <div
                        className="bg-green-500 h-full transition-all duration-500"
                        style={{ width: `${deckTypeStat.winRate}%` }}
                      />
                      <div
                        className="bg-red-500/50 h-full transition-all duration-500"
                        style={{ width: `${100 - deckTypeStat.winRate}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-1 text-xs font-medium">
                      <span className="text-green-400">{deckTypeStat.wins} Wins</span>
                      <span className="text-red-400">{deckTypeStat.losses} Losses</span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
              >
                <div className="p-5 pt-0 border-t border-slate-700/30 bg-slate-900/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    {/* First Player Stats */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-4 border border-slate-700/50 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full blur-xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50" />

                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-sm font-bold text-blue-300 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-blue-400 mr-2 shadow-[0_0_5px_rgba(96,165,250,0.5)]"></span>
                          先攻 (1st)
                        </h5>
                        <span className="text-xs font-medium text-slate-400 bg-slate-700/30 px-2 py-1 rounded">
                          {deckTypeStat.firstPlayerStats.totalGames} Games
                        </span>
                      </div>

                      <div className="flex items-end justify-between mb-2">
                        <div className="text-2xl font-black text-slate-200">
                          {deckTypeStat.firstPlayerStats.totalGames > 0
                            ? `${deckTypeStat.firstPlayerStats.winRate.toFixed(1)}%`
                            : '-'
                          }
                        </div>
                        <div className="text-xs text-slate-400 mb-1">
                          <span className="text-green-400 font-bold">{deckTypeStat.firstPlayerStats.wins}W</span>
                          <span className="mx-1">-</span>
                          <span className="text-red-400 font-bold">{deckTypeStat.firstPlayerStats.losses}L</span>
                        </div>
                      </div>

                      {deckTypeStat.firstPlayerStats.totalGames > 0 && (
                        <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-blue-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"
                            style={{ width: `${deckTypeStat.firstPlayerStats.winRate}%` }}
                          />
                        </div>
                      )}
                    </div>

                    {/* Second Player Stats */}
                    <div className="bg-gradient-to-br from-slate-800/50 to-slate-800/30 rounded-xl p-4 border border-slate-700/50 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full blur-xl -mr-10 -mt-10 transition-opacity group-hover:opacity-100 opacity-50" />

                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-sm font-bold text-orange-300 flex items-center">
                          <span className="w-2 h-2 rounded-full bg-orange-400 mr-2 shadow-[0_0_5px_rgba(251,146,60,0.5)]"></span>
                          後攻 (2nd)
                        </h5>
                        <span className="text-xs font-medium text-slate-400 bg-slate-700/30 px-2 py-1 rounded">
                          {deckTypeStat.secondPlayerStats.totalGames} Games
                        </span>
                      </div>

                      <div className="flex items-end justify-between mb-2">
                        <div className="text-2xl font-black text-slate-200">
                          {deckTypeStat.secondPlayerStats.totalGames > 0
                            ? `${deckTypeStat.secondPlayerStats.winRate.toFixed(1)}%`
                            : '-'
                          }
                        </div>
                        <div className="text-xs text-slate-400 mb-1">
                          <span className="text-green-400 font-bold">{deckTypeStat.secondPlayerStats.wins}W</span>
                          <span className="mx-1">-</span>
                          <span className="text-red-400 font-bold">{deckTypeStat.secondPlayerStats.losses}L</span>
                        </div>
                      </div>

                      {deckTypeStat.secondPlayerStats.totalGames > 0 && (
                        <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-orange-500 h-1.5 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                            style={{ width: `${deckTypeStat.secondPlayerStats.winRate}%` }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
