'use client';

import React from 'react';
import { Select } from '@/components/ui/Select';
import { Deck } from '@/types';
import { CLASS_COLORS } from '@/utils/constants';

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

  const selectedDeck = decks.find(deck => deck.id === selectedDeckId);

  return (
    <div className="w-full">
      <Select
        label="使用デッキでフィルター"
        value={selectedDeckId || ''}
        onChange={(e) => onDeckChange(e.target.value || null)}
        options={deckOptions}
        placeholder="デッキを選択"
      />

      {selectedDeck && (
        <div
          className={`mt-4 p-4 rounded-xl border backdrop-blur-sm transition-all duration-300 animate-in fade-in slide-in-from-top-2 ${CLASS_COLORS[selectedDeck.className].replace('bg-', 'bg-').replace('text-white', '') + '/10 border-' + CLASS_COLORS[selectedDeck.className].replace('bg-', '').replace('text-white', '') + '/30'
            }`}
          style={{
            borderColor: 'rgba(255,255,255,0.1)',
            background: `linear-gradient(to right, rgba(30, 41, 59, 0.5), rgba(15, 23, 42, 0.5))`
          }}
        >
          <div className="flex items-center space-x-3">
            <div
              className={`w-2 h-10 rounded-full ${CLASS_COLORS[selectedDeck.className]}`}
            />
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider mb-0.5">
                Filtering by
              </p>
              <p className="text-sm font-bold text-slate-100 flex items-center">
                <span className="mr-2">{selectedDeck.className}</span>
                <span className="w-1 h-1 rounded-full bg-slate-500 mx-1" />
                <span>{selectedDeck.deckName}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
