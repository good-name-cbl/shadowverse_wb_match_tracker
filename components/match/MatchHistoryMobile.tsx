'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { MatchRecord, Deck } from '@/types';
import { CLASS_COLORS } from '@/utils/constants';

interface MatchHistoryMobileProps {
  records: MatchRecord[];
  decks: Deck[];
  onDeleteRecord: (recordId: string) => void;
}

export const MatchHistoryMobile: React.FC<MatchHistoryMobileProps> = ({
  records,
  decks,
  onDeleteRecord,
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
      {records.slice(0, 10).map((record) => {
        const deck = getDeckById(record.myDeckId);
        return (
          <div key={record.id} className="bg-gray-50 rounded-lg p-4 border">
            <div className="flex items-start justify-between mb-3">
              <div className="text-xs text-gray-500">
                {formatDate(record.recordedAt)}
              </div>
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  record.isWin
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {record.isWin ? '勝利' : '敗北'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">使用デッキ</span>
                {deck ? (
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-3 h-3 rounded-full ${CLASS_COLORS[deck.className]}`}
                    />
                    <span className="text-sm text-gray-900">
                      {deck.deckName}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">
                    削除済みデッキ
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">相手</span>
                <div className="flex items-center space-x-2">
                  <div
                    className={`w-3 h-3 rounded-full ${CLASS_COLORS[record.opponentClass]}`}
                  />
                  <span className="text-sm text-gray-900">
                    {record.opponentDeckType}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600 font-medium">先行/後攻</span>
                <span className="text-sm text-gray-900">
                  {record.isFirstPlayer ? '先行' : '後攻'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200">
              <Button
                size="sm"
                variant="danger"
                className="w-full"
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
        );
      })}
    </div>
  );
};
