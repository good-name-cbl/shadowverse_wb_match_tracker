'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { MatchRecord, Deck } from '@/types';
import { CLASS_COLORS } from '@/utils/constants';
import { MatchHistoryMobile } from './MatchHistoryMobile';

interface MatchHistoryProps {
  records: MatchRecord[];
  decks: Deck[];
  onDeleteRecord: (recordId: string) => void;
}

export const MatchHistory: React.FC<MatchHistoryProps> = ({
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

  if (records.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          最近の対戦履歴
        </h3>
        <div className="text-center py-8 text-gray-500">
          まだ対戦記録がありません。<br />
          上のフォームから対戦結果を記録してください。
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        最近の対戦履歴（最新10件）
      </h3>

      {/* モバイル表示 */}
      <div className="md:hidden">
        <MatchHistoryMobile
          records={records}
          decks={decks}
          onDeleteRecord={onDeleteRecord}
        />
      </div>

      {/* デスクトップ表示 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                日時
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                使用デッキ
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                相手
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                先行/後攻
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                勝敗
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {records.slice(0, 10).map((record) => {
              const deck = getDeckById(record.myDeckId);
              return (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(record.recordedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
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
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-3 h-3 rounded-full ${CLASS_COLORS[record.opponentClass]}`}
                      />
                      <div>
                        <div className="text-sm text-gray-900">
                          {record.opponentDeckType}
                        </div>
                        <div className="text-xs text-gray-500">
                          {record.opponentClass}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.isFirstPlayer ? '先行' : '後攻'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        record.isWin
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {record.isWin ? '勝利' : '敗北'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => {
                        if (confirm('この対戦記録を削除しますか？')) {
                          onDeleteRecord(record.id);
                        }
                      }}
                    >
                      削除
                    </Button>
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
