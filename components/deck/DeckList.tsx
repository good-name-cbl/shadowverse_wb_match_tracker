'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import { Deck } from '@/types';
import { CLASS_COLORS } from '@/utils/constants';

interface DeckListProps {
  decks: Deck[];
  currentDeckId: string | null;
  onSelectDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void | Promise<void>;
}

export const DeckList: React.FC<DeckListProps> = ({
  decks,
  currentDeckId,
  onSelectDeck,
  onDeleteDeck,
}) => {
  if (decks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          登録済みデッキ
        </h3>
        <div className="text-center py-8 text-gray-500">
          まだデッキが登録されていません。<br />
          上のフォームからデッキを追加してください。
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        登録済みデッキ
      </h3>

      <div className="space-y-3">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className={`border rounded-lg p-4 transition-colors ${
              currentDeckId === deck.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-4 h-4 rounded-full ${CLASS_COLORS[deck.className]}`}
                />
                <div>
                  <div className="font-medium text-gray-800">
                    {deck.deckName}
                  </div>
                  <div className="text-sm text-gray-600">
                    {deck.className}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {currentDeckId === deck.id ? (
                  <span className="text-blue-600 text-sm font-medium">
                    使用中
                  </span>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => onSelectDeck(deck)}
                  >
                    選択
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (confirm('このデッキを削除しますか？')) {
                      onDeleteDeck(deck.id);
                    }
                  }}
                >
                  削除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
