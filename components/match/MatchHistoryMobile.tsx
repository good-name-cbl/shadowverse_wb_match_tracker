'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { MatchRecord, Deck } from '@/types';
import { CLASS_COLORS } from '@/utils/constants';

interface MatchHistoryMobileProps {
  records: MatchRecord[];
  decks: Deck[];
  onDeleteRecord: (recordId: string) => void | Promise<void>;
  onEditRecord: (record: MatchRecord) => void;
}

export const MatchHistoryMobile: React.FC<MatchHistoryMobileProps> = ({
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

  return (
    <div className="space-y-3">
      {[...records]
        .sort((a, b) => new Date(b.recordedAt).getTime() - new Date(a.recordedAt).getTime())
        .slice(0, 10)
        .map((record) => {
        const deck = getDeckById(record.myDeckId);
        return (
          <div key={record.id} className="glass-card rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs text-slate-400">
                {formatDate(record.recordedAt)}
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${record.isWin
                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}
              >
                {record.isWin ? '勝利' : '敗北'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">使用デッキ</span>
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
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">相手</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-2.5 h-2.5 rounded-full shadow-[0_0_8px_currentColor] ${CLASS_COLORS[record.opponentClass].replace('bg-', 'text-').replace('text-white', '')}`}
                    style={{ backgroundColor: 'currentColor' }}
                  />
                  <span className="text-sm text-slate-200">
                    {record.opponentDeckType}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">先攻/後攻</span>
                <span className="text-sm text-slate-200">
                  {record.isFirstPlayer ? '先攻' : '後攻'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-700/50">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-slate-300 hover:text-slate-100"
                  onClick={() => onEditRecord(record)}
                >
                  編集
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex-1 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm('この対戦記録を削除しますか？')) {
                      onDeleteRecord(record.id);
                    }
                  }}
                >
                  削除
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
