'use client';

import React from 'react';
import { ClassStatistics } from '@/types';
import { CLASS_COLORS, getWinRateColor } from '@/utils/constants';

interface ClassStatsMobileProps {
  stats: ClassStatistics[];
}

export const ClassStatsMobile: React.FC<ClassStatsMobileProps> = ({ stats }) => {
  return (
    <div className="space-y-3">
      {stats.map((classStat) => (
        <div key={classStat.className} className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <div
                className={`w-4 h-4 rounded-full ${CLASS_COLORS[classStat.className]}`}
              />
              <span className="text-sm font-medium text-gray-900">
                {classStat.className}
              </span>
            </div>
            {classStat.totalGames > 0 && (
              <span className={`text-sm font-medium ${getWinRateColor(classStat.winRate)}`}>
                {classStat.winRate.toFixed(1)}%
              </span>
            )}
          </div>

          {classStat.totalGames > 0 ? (
            <div>
              <div className="flex justify-between text-xs text-gray-600 mb-2">
                <span>{classStat.totalGames}戦</span>
                <span className="text-green-600">{classStat.wins}勝</span>
                <span className="text-red-600">{classStat.losses}敗</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${classStat.winRate}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-gray-400 py-2">
              データなし
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
