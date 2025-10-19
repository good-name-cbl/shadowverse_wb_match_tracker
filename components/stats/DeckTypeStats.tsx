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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          デッキタイプ別勝率
        </h3>
        <div className="text-center py-8 text-gray-500">
          対戦記録がありません
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        デッキタイプ別勝率
      </h3>

      <div className="space-y-2">
        {stats.map((deckTypeStat) => (
          <div key={deckTypeStat.deckType} className="border rounded-lg">
            <div
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleExpanded(deckTypeStat.deckType)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">
                      {deckTypeStat.deckType}
                    </h4>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">
                        {deckTypeStat.totalGames}戦
                      </span>
                      <span className="text-green-600">
                        {deckTypeStat.wins}勝
                      </span>
                      <span className="text-red-600">
                        {deckTypeStat.losses}敗
                      </span>
                      <span className={`font-medium ${getWinRateColor(deckTypeStat.winRate)}`}>
                        {deckTypeStat.winRate.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full"
                      style={{ width: `${deckTypeStat.winRate}%` }}
                    />
                  </div>
                </div>
                <div className="ml-4">
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${
                      expandedDeckTypes.has(deckTypeStat.deckType) ? 'rotate-180' : ''
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
              <div className="px-4 pb-4 border-t bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">先行時</h5>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {deckTypeStat.firstPlayerStats.totalGames}戦
                      </span>
                      <span className="text-green-600">
                        {deckTypeStat.firstPlayerStats.wins}勝
                      </span>
                      <span className="text-red-600">
                        {deckTypeStat.firstPlayerStats.losses}敗
                      </span>
                      <span className={`font-medium ${getWinRateColor(deckTypeStat.firstPlayerStats.winRate)}`}>
                        {deckTypeStat.firstPlayerStats.totalGames > 0
                          ? `${deckTypeStat.firstPlayerStats.winRate.toFixed(1)}%`
                          : 'データなし'
                        }
                      </span>
                    </div>
                    {deckTypeStat.firstPlayerStats.totalGames > 0 && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-green-500 h-1 rounded-full"
                          style={{ width: `${deckTypeStat.firstPlayerStats.winRate}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">後攻時</h5>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        {deckTypeStat.secondPlayerStats.totalGames}戦
                      </span>
                      <span className="text-green-600">
                        {deckTypeStat.secondPlayerStats.wins}勝
                      </span>
                      <span className="text-red-600">
                        {deckTypeStat.secondPlayerStats.losses}敗
                      </span>
                      <span className={`font-medium ${getWinRateColor(deckTypeStat.secondPlayerStats.winRate)}`}>
                        {deckTypeStat.secondPlayerStats.totalGames > 0
                          ? `${deckTypeStat.secondPlayerStats.winRate.toFixed(1)}%`
                          : 'データなし'
                        }
                      </span>
                    </div>
                    {deckTypeStat.secondPlayerStats.totalGames > 0 && (
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1">
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
