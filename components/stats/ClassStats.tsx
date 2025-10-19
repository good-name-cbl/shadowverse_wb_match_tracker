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
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
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
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                クラス
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                対戦数
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                勝利数
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                敗北数
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                勝率
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {stats.map((classStat) => (
              <tr key={classStat.className} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-4 h-4 rounded-full ${CLASS_COLORS[classStat.className]}`}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {classStat.className}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {classStat.totalGames}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600">
                  {classStat.wins}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600">
                  {classStat.losses}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {classStat.totalGames > 0 ? (
                    <div className="flex items-center space-x-2">
                      <span className={`text-sm font-medium ${getWinRateColor(classStat.winRate)}`}>
                        {classStat.winRate.toFixed(1)}%
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${classStat.winRate}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">
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
