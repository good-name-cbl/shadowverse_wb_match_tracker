'use client';

import React, { useState } from 'react';
import { CLASS_COLORS, CLASSES, getWinRateColor } from '@/utils/constants';
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

interface MatchupMatrixProps {
  stats: AggregatedStats[];
}

export const MatchupMatrix: React.FC<MatchupMatrixProps> = ({ stats }) => {
  const [selectedMatchup, setSelectedMatchup] = useState<AggregatedStats | null>(null);
  const [minGames, setMinGames] = useState(5);

  // マッチアップデータをマトリックス形式に変換
  const getMatchupData = (myClass: ClassType, opponentClass: ClassType) => {
    const key = `${myClass} vs ${opponentClass}`;
    return stats.find((s) => s.statsKey === key);
  };

  // 勝率の色をヒートマップで取得
  const getHeatMapColor = (winRate: number, totalGames: number) => {
    if (totalGames < minGames) return '#F3F4F6'; // グレー

    if (winRate >= 60) return '#10B981'; // 緑
    if (winRate >= 55) return '#34D399';
    if (winRate >= 52) return '#6EE7B7';
    if (winRate >= 48) return '#FDE68A'; // 黄色
    if (winRate >= 45) return '#FCD34D';
    if (winRate >= 40) return '#FCA5A5'; // 赤
    return '#EF4444';
  };

  return (
    <div className="space-y-6">
      {/* Explanation Card */}
      <div className="glass-card rounded-xl p-6 bg-purple-500/5 border border-purple-500/20">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">ℹ️</span>
          <div>
            <h3 className="text-lg font-semibold text-purple-300 mb-2">
              この統計について
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              <strong className="text-purple-400">クラス間の相性</strong>を示す統計です。
              縦軸は<strong className="text-purple-400">自分が使用したクラス</strong>、
              横軸は<strong className="text-purple-400">対戦相手のクラス</strong>を表します。
              各セルの色は勝率を示し、緑色が有利、赤色が不利なマッチアップです。
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          設定
        </h3>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            最低試合数（これ未満はグレー表示）
          </label>
          <select
            value={minGames}
            onChange={(e) => setMinGames(Number(e.target.value))}
            className="w-full max-w-xs px-3 py-2 glass-input rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500 text-slate-200"
          >
            <option value={3} className="bg-slate-900 text-slate-200">3試合以上</option>
            <option value={5} className="bg-slate-900 text-slate-200">5試合以上</option>
            <option value={10} className="bg-slate-900 text-slate-200">10試合以上</option>
            <option value={20} className="bg-slate-900 text-slate-200">20試合以上</option>
          </select>
        </div>
      </div>

      {/* Matrix */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-100 mb-4">
          ⚔️ マッチアップマトリックス
        </h3>
        <p className="text-sm text-slate-400 mb-4">
          縦軸: 自分のクラス　横軸: 相手のクラス
        </p>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-slate-700 bg-slate-800/50 p-2 text-xs font-medium text-slate-300">
                  自分＼相手
                </th>
                {CLASSES.map((cls) => (
                  <th
                    key={cls}
                    className="border border-slate-700 p-2 text-xs font-medium text-slate-300"
                    style={{ backgroundColor: CLASS_COLORS[cls] + '20' }}
                  >
                    {cls}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CLASSES.map((myClass) => (
                <tr key={myClass}>
                  <th
                    className="border border-slate-700 p-2 text-xs font-medium text-left text-slate-300"
                    style={{ backgroundColor: CLASS_COLORS[myClass] + '20' }}
                  >
                    {myClass}
                  </th>
                  {CLASSES.map((opponentClass) => {
                    const data = getMatchupData(myClass, opponentClass);
                    const bgColor = data
                      ? getHeatMapColor(data.winRate, data.totalGames)
                      : '#1e293b'; // slate-800

                    return (
                      <td
                        key={`${myClass}-${opponentClass}`}
                        className="border border-slate-700 p-2 text-center cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all"
                        style={{ backgroundColor: data ? bgColor : undefined }}
                      >
                        {data ? (
                          <div onClick={() => setSelectedMatchup(data)}>
                            <div className="text-sm font-bold text-slate-900">
                              {data.winRate.toFixed(1)}%
                            </div>
                            <div className="text-xs text-slate-700">
                              {data.totalGames}試合
                            </div>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-600">-</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <p className="text-sm text-slate-400 mb-4">
            モバイル表示では簡易版を表示しています
          </p>
          <div className="space-y-2">
            {stats
              .filter((s) => s.totalGames >= minGames)
              .sort((a, b) => b.totalGames - a.totalGames)
              .slice(0, 20)
              .map((stat) => (
                <div
                  key={stat.statsKey}
                  className="bg-slate-800/30 border border-slate-700/50 rounded-lg p-3 hover:bg-slate-800/50 transition-colors cursor-pointer"
                  onClick={() => setSelectedMatchup(stat)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold text-sm text-slate-200">{stat.statsKey}</div>
                    <div className={`text-lg font-bold ${getWinRateColor(stat.winRate)}`}>
                      {stat.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>{stat.totalGames}試合</span>
                    <span>{stat.wins}勝{stat.losses}敗</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-sm font-medium text-slate-300 mb-2">凡例（勝率）</p>
          <div className="flex flex-wrap gap-2 text-slate-300">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#10B981' }}></div>
              <span className="text-xs">60%以上</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#6EE7B7' }}></div>
              <span className="text-xs">52-60%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FDE68A' }}></div>
              <span className="text-xs">48-52%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#FCA5A5' }}></div>
              <span className="text-xs">40-48%</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded" style={{ backgroundColor: '#EF4444' }}></div>
              <span className="text-xs">40%未満</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded bg-slate-800"></div>
              <span className="text-xs">データ不足</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMatchup && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMatchup(null)}
        >
          <div
            className="glass-card rounded-xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-slate-100 mb-4">
              マッチアップ詳細
            </h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">対戦カード</p>
                <p className="text-xl font-bold text-slate-200">
                  {selectedMatchup.statsKey}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">試合数</p>
                  <p className="text-2xl font-bold text-slate-200">
                    {selectedMatchup.totalGames}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">勝率</p>
                  <p className={`text-2xl font-bold ${getWinRateColor(selectedMatchup.winRate)}`}>
                    {selectedMatchup.winRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400 mb-1">勝数</p>
                  <p className="text-xl font-semibold text-green-400">
                    {selectedMatchup.wins}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-slate-400 mb-1">敗数</p>
                  <p className="text-xl font-semibold text-red-400">
                    {selectedMatchup.losses}
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setSelectedMatchup(null)}
              className="mt-6 w-full px-4 py-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-900/20"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
