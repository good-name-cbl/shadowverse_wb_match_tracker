'use client';

import React from 'react';
import ClassIcon from '@/components/ui/ClassIcon';
import { ClassStatistics } from '@/types';
import { getWinRateColor } from '@/utils/constants';

interface ClassStatsMobileProps {
  stats: ClassStatistics[];
}

export const ClassStatsMobile: React.FC<ClassStatsMobileProps> = ({ stats }) => {
  return (
    <div className="space-y-3">
      {stats.map((classStat) => (
        <div key={classStat.className} className="glass-card rounded-xl p-4 border border-slate-700/50">
          <div className="flex items-center justify-between mb-3">
            <ClassIcon
              className={classStat.className}
              size="medium"
              showLabel
              labelClassName="text-slate-200 font-medium"
            />
            {classStat.totalGames > 0 && (
              <span className={`text-sm font-bold ${getWinRateColor(classStat.winRate).replace('text-red-600', 'text-red-400').replace('text-green-600', 'text-green-400').replace('text-blue-600', 'text-blue-400')}`}>
                {classStat.winRate.toFixed(1)}%
              </span>
            )}
          </div>

          {classStat.totalGames > 0 ? (
            <div>
              <div className="flex justify-between text-xs text-slate-400 mb-2">
                <span>{classStat.totalGames}戦</span>
                <span className="text-green-400">{classStat.wins}勝</span>
                <span className="text-red-400">{classStat.losses}敗</span>
              </div>
              <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-violet-500 to-fuchsia-500 h-2 rounded-full"
                  style={{ width: `${classStat.winRate}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-xs text-slate-500 py-2">
              データなし
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
