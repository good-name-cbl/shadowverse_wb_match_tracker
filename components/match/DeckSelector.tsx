'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { Deck } from '@/types';
import { CLASS_COLORS } from '@/utils/constants';

interface DeckSelectorProps {
  decks: Deck[];
  currentDeckId: string | null;
  onSelectDeck: (deckId: string | null) => void;
}

export const DeckSelector: React.FC<DeckSelectorProps> = ({
  decks,
  currentDeckId,
  onSelectDeck,
}) => {
  const currentDeck = currentDeckId ? decks.find(deck => deck.id === currentDeckId) : null;

  const deckOptions = [
    { value: '', label: 'デッキを選択してください' },
    ...decks.map(deck => ({
      value: deck.id,
      label: `${deck.className} - ${deck.deckName}`
    }))
  ];

  if (decks.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          使用デッキの選択
        </h3>
        <div className="text-center py-8 text-gray-500">
          デッキが登録されていません。<br />
          まず「デッキ管理」でデッキを登録してください。
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        使用デッキの選択
      </h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <Select
              label="現在使用するデッキ"
              value={currentDeckId || ''}
              onChange={(e) => onSelectDeck(e.target.value || null)}
              options={deckOptions}
              placeholder="デッキを選択"
            />
          </div>

          {currentDeckId && (
            <Button
              variant="secondary"
              onClick={() => onSelectDeck(null)}
            >
              選択解除
            </Button>
          )}
        </div>

        {currentDeck && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-3">
              <div
                className={`w-4 h-4 rounded-full ${CLASS_COLORS[currentDeck.className]}`}
              />
              <div>
                <div className="font-medium text-blue-900">
                  選択中: {currentDeck.deckName}
                </div>
                <div className="text-sm text-blue-700">
                  {currentDeck.className}
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentDeck && (
          <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <div className="text-yellow-800 text-sm">
              ⚠️ 対戦記録を行うには、使用デッキを選択してください
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
