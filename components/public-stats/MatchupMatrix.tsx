'use client';

import React, { useState } from 'react';
import { CLASS_COLORS, CLASSES, getWinRateColor } from '@/utils/constants';
import { ClassType } from '@/types';
import { Select } from '@/components/ui/Select';

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
    if (totalGames < minGames) return 'rgba(30, 41, 59, 0.5)'; // slate-800/50

    if (winRate >= 60) return 'rgba(16, 185, 129, 0.3)'; // emerald-500/30
    if (winRate >= 55) return 'rgba(52, 211, 153, 0.3)'; // emerald-400/30
    if (winRate >= 52) return 'rgba(110, 231, 183, 0.3)'; // emerald-300/30
    if (winRate >= 48) return 'rgba(253, 230, 138, 0.2)'; // amber-200/20
    if (winRate >= 45) return 'rgba(252, 211, 77, 0.2)'; // amber-300/20
    if (winRate >= 40) return 'rgba(252, 165, 165, 0.3)'; // red-300/30
    return 'rgba(239, 68, 68, 0.3)'; // red-500/30
  };

  const getHeatMapBorderColor = (winRate: number, totalGames: number) => {
    if (totalGames < minGames) return 'rgba(71, 85, 105, 0.3)'; // slate-600/30

    if (winRate >= 60) return 'rgba(16, 185, 129, 0.8)';
    if (winRate >= 55) return 'rgba(52, 211, 153, 0.8)';
    if (winRate >= 52) return 'rgba(110, 231, 183, 0.8)';
    if (winRate >= 48) return 'rgba(253, 230, 138, 0.6)';
    if (winRate >= 45) return 'rgba(252, 211, 77, 0.6)';
    if (winRate >= 40) return 'rgba(252, 165, 165, 0.8)';
    return 'rgba(239, 68, 68, 0.8)';
  };

  return (
    <div className="space-y-6">
      {/* Explanation Card */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-1 h-full bg-purple-500" />
        <div className="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="flex items-start space-x-4 relative z-10">
          <div className="p-3 bg-purple-500/10 rounded-xl">
            <span className="text-2xl">ℹ️</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-purple-300 mb-2 flex items-center">
              この統計について
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed max-w-3xl">
              <strong className="text-purple-400 font-medium">クラス間の相性</strong>を示すヒートマップです。
              縦軸は<strong className="text-purple-400">自分が使用したクラス</strong>、
              横軸は<strong className="text-purple-400">対戦相手のクラス</strong>を表します。
              <br className="hidden sm:block" />
              <span className="text-slate-500 text-xs mt-1 block">
                ※ 緑色が有利（勝率高）、赤色が不利（勝率低）なマッチアップを示します。
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Settings */}
      <div className="glass-card rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 via-fuchsia-500 to-pink-500 opacity-50" />
        <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
          <span className="mr-2">⚙️</span> 設定
        </h3>
        <div className="max-w-xs">
          <Select
            label="最低試合数（色分け用）"
            value={String(minGames)}
            onChange={(e) => setMinGames(Number(e.target.value))}
            options={[
              { value: '3', label: '3試合以上' },
              { value: '5', label: '5試合以上' },
              { value: '10', label: '10試合以上' },
              { value: '20', label: '20試合以上' }
            ]}
          />
        </div>
      </div>

      {/* Matrix */}
      <div className="glass-card rounded-2xl p-6 overflow-hidden border border-white/5 shadow-xl">
        <h3 className="text-lg font-bold text-slate-100 mb-4 flex items-center">
          <span className="mr-2">⚔️</span> マッチアップマトリックス
        </h3>
        <p className="text-sm text-slate-400 mb-6">
          縦軸: 自分 / 横軸: 相手
        </p>

        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar pb-4">
          <table className="w-full border-separate border-spacing-1">
            <thead>
              <tr>
                <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-900/50 rounded-lg backdrop-blur-sm sticky left-0 z-10 border border-white/5">
                  自分 ＼ 相手
                </th>
                {CLASSES.map((cls) => (
                  <th
                    key={cls}
                    className="p-3 text-xs font-bold text-slate-300 uppercase tracking-wider rounded-lg border border-white/5 min-w-[80px]"
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
                    className="p-3 text-xs font-bold text-left text-slate-300 uppercase tracking-wider rounded-lg border border-white/5 sticky left-0 z-10 backdrop-blur-md"
                    style={{ backgroundColor: CLASS_COLORS[myClass] + '40' }}
                  >
                    {myClass}
                  </th>
                  {CLASSES.map((opponentClass) => {
                    const data = getMatchupData(myClass, opponentClass);
                    const bgColor = data
                      ? getHeatMapColor(data.winRate, data.totalGames)
                      : 'rgba(30, 41, 59, 0.3)';
                    const borderColor = data
                      ? getHeatMapBorderColor(data.winRate, data.totalGames)
                      : 'rgba(255, 255, 255, 0.05)';

                    return (
                      <td
                        key={`${myClass}-${opponentClass}`}
                        className="p-2 text-center cursor-pointer transition-all duration-200 hover:scale-105 hover:z-20 relative rounded-lg border"
                        style={{
                          backgroundColor: bgColor,
                          borderColor: borderColor,
                          boxShadow: data ? `0 0 10px ${borderColor}20` : 'none'
                        }}
                        onClick={() => data && setSelectedMatchup(data)}
                      >
                        {data ? (
                          <div className="flex flex-col items-center justify-center h-full">
                            <span className={`text-sm font-black ${data.totalGames < minGames ? 'text-slate-500' :
                              data.winRate >= 50 ? 'text-emerald-400' : 'text-red-400'
                              }`}>
                              {data.winRate.toFixed(0)}%
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {data.totalGames}G
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-700 text-xs">-</span>
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
          <p className="text-sm text-slate-400 mb-4 bg-slate-800/50 p-3 rounded-lg border border-white/5">
            モバイル表示では、試合数の多い順に上位20件を表示しています。
          </p>
          <div className="space-y-3">
            {stats
              .filter((s) => s.totalGames >= minGames)
              .sort((a, b) => b.totalGames - a.totalGames)
              .slice(0, 20)
              .map((stat) => (
                <div
                  key={stat.statsKey}
                  className="glass-card rounded-xl p-4 active:scale-95 transition-transform cursor-pointer border border-white/5"
                  onClick={() => setSelectedMatchup(stat)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-bold text-sm text-slate-200">{stat.statsKey}</div>
                    <div className={`text-lg font-black ${getWinRateColor(stat.winRate)}`}>
                      {stat.winRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>{stat.totalGames} Games</span>
                    <span className="flex items-center space-x-1">
                      <span className="text-green-400">{stat.wins}W</span>
                      <span>-</span>
                      <span className="text-red-400">{stat.losses}L</span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">勝率凡例</p>
          <div className="flex flex-wrap gap-3">
            {[
              { color: 'bg-emerald-500', label: '60%+' },
              { color: 'bg-emerald-400', label: '55-60%' },
              { color: 'bg-emerald-300', label: '52-55%' },
              { color: 'bg-amber-200', label: '48-52%' },
              { color: 'bg-amber-300', label: '45-48%' },
              { color: 'bg-red-300', label: '40-45%' },
              { color: 'bg-red-500', label: '<40%' },
            ].map((item) => (
              <div key={item.label} className="flex items-center space-x-2 bg-slate-800/50 px-2 py-1 rounded-md border border-white/5">
                <div className={`w-3 h-3 rounded-full ${item.color} shadow-sm`} />
                <span className="text-xs text-slate-300 font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedMatchup && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMatchup(null)}
        >
          <div
            className="glass-card rounded-2xl max-w-md w-full p-8 relative overflow-hidden animate-in zoom-in-95 duration-200 border border-white/10 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500" />

            <h3 className="text-xl font-black text-white mb-6 flex items-center">
              <span className="mr-2">📊</span> マッチアップ詳細
            </h3>

            <div className="space-y-6">
              <div className="bg-slate-800/50 rounded-xl p-4 border border-white/5">
                <p className="text-xs text-slate-400 uppercase tracking-wider mb-2">対戦カード</p>
                <p className="text-xl font-bold text-slate-100">
                  {selectedMatchup.statsKey}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">試合数</p>
                  <p className="text-3xl font-black text-white">
                    {selectedMatchup.totalGames}
                  </p>
                </div>
                <div className="bg-slate-800/30 rounded-xl p-4 border border-white/5">
                  <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">勝率</p>
                  <p className={`text-3xl font-black ${getWinRateColor(selectedMatchup.winRate)}`}>
                    {selectedMatchup.winRate.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/20">
                  <p className="text-xs text-green-300 uppercase tracking-wider mb-1">勝数</p>
                  <p className="text-2xl font-bold text-green-400">
                    {selectedMatchup.wins}
                  </p>
                </div>
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
                  <p className="text-xs text-red-300 uppercase tracking-wider mb-1">敗数</p>
                  <p className="text-2xl font-bold text-red-400">
                    {selectedMatchup.losses}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMatchup(null)}
              className="mt-8 w-full px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all font-bold shadow-lg shadow-violet-500/20"
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
