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
    <div className="w-full">
      <Select
        label="使用デッキでフィルター"
        value={selectedDeckId || ''}
        onChange={(e) => onDeckChange(e.target.value || null)}
        options={deckOptions}
        placeholder="デッキを選択"
      />

      {selectedDeckId && (
        <div className="mt-3 p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 backdrop-blur-sm">
          <p className="text-sm text-violet-200">
            {decks.find(deck => deck.id === selectedDeckId)?.deckName} の統計を表示中
          </p>
        </div>
      )}
    </div>
  );
};
