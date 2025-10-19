'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { Deck } from '@/types';

interface DeckFilterProps {
  decks: Deck[];
  selectedDeckId: string | null;
  onDeckChange: (deckId: string | null) => void;
}

export const DeckFilter: React.FC<DeckFilterProps> = ({
  decks,
  selectedDeckId,
  onDeckChange,
}) => {
  const deckOptions = [
    { value: '', label: '全デッキ' },
    ...decks.map(deck => ({
      value: deck.id,
      label: `${deck.className} - ${deck.deckName}`
    }))
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        統計フィルター
      </h3>

      <div className="max-w-md">
        <Select
          label="使用デッキでフィルター"
          value={selectedDeckId || ''}
          onChange={(e) => onDeckChange(e.target.value || null)}
          options={deckOptions}
          placeholder="デッキを選択"
        />
      </div>

      {selectedDeckId && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            {decks.find(deck => deck.id === selectedDeckId)?.deckName} の統計を表示中
          </p>
        </div>
      )}
    </div>
  );
};
