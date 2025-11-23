'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { MatchRecord, Deck } from '@/types';
import { CLASS_COLORS } from '@/utils/constants';
import { MatchHistoryMobile } from './MatchHistoryMobile';

interface MatchHistoryProps {
  records: MatchRecord[];
  decks: Deck[];
  onDeleteRecord: (recordId: string) => void | Promise<void>;
  onEditRecord: (record: MatchRecord) => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({
  records,
  decks,
  onDeleteRecord,
  onEditRecord,
}) => {
  const getDeckById = (deckId: string) => {
    return decks.find(deck => deck.id === deckId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (records.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          最近の対戦履歴
        </h3>
        <div className="py-8 text-slate-400">
          まだ対戦記録がありません。<br />
          上のフォームから対戦結果を記録してください。
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
        <span className="mr-2">⚔️</span>
        最近の対戦履歴（最新10件）
      </h3>

      {/* モバイル表示 */}
      <div className="md:hidden">
        <MatchHistoryMobile
          records={records}
          decks={decks}
          onDeleteRecord={onDeleteRecord}
          onEditRecord={onEditRecord}
        />
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="border-b border-slate-700/50">
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                日時
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                使用デッキ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                相手
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                先攻/後攻
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                勝敗
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/30">
            {[...records]
              .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
              .slice(0, 10)
              .map((record) => {
              const deck = getDeckById(record.myDeckId);
              return (
                <tr key={record.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {formatDate(record.recordedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {deck ? (
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${CLASS_COLORS[deck.className].replace('bg-', 'text-').replace('text-white', '')}`}
                          style={{ backgroundColor: 'currentColor' }}
                        />
                        <span className="text-sm text-slate-200">
                          {deck.deckName}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-500">
                        削除済みデッキ
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${CLASS_COLORS[record.opponentClass].replace('bg-', 'text-').replace('text-white', '')}`}
                        style={{ backgroundColor: 'currentColor' }}
                      />
                      <div>
                        <div className="text-sm text-slate-200">
                          {record.opponentDeckType}
                        </div>
                        <div className="text-xs text-slate-500">
                          {record.opponentClass}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-300">
                    {record.isFirstPlayer ? '先攻' : '後攻'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${record.isWin
                          ? 'bg-green-500/10 text-green-400 border-green-500/20'
                          : 'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                    >
                      {record.isWin ? '勝利' : '敗北'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        className="text-slate-300 hover:text-slate-100"
                        onClick={() => onEditRecord(record)}
                      >
                        編集
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => {
                          if (confirm('この対戦記録を削除しますか？')) {
                            onDeleteRecord(record.id);
                          }
                        }}
                      >
                        削除
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
