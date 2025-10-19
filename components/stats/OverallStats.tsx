'use client';

import React from 'react';
import { MatchStatistics } from '@/types';
import { getWinRateColor } from '@/utils/constants';

interface OverallStatsProps {
  stats: MatchStatistics;
}

export const OverallStats: React.FC<OverallStatsProps> = ({ stats }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        全体勝率
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">
            {stats.totalGames}
          </div>
          <div className="text-sm text-gray-600">
            総試合数
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.wins}
          </div>
          <div className="text-sm text-gray-600">
            勝利数
          </div>
        </div>

        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">
            {stats.losses}
          </div>
          <div className="text-sm text-gray-600">
            敗北数
          </div>
        </div>

        <div className="text-center">
          <div className={`text-2xl font-bold ${getWinRateColor(stats.winRate)}`}>
            {stats.winRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">
            勝率
          </div>
        </div>
      </div>

      {stats.totalGames > 0 && (
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.winRate}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
