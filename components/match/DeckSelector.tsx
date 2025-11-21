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
      <div className="glass-card rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          使用デッキの選択
        </h3>
        <div className="py-8 text-slate-400">
          デッキが登録されていません。<br />
          まず「デッキ管理」でデッキを登録してください。
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center">
        <span className="mr-2">🎮</span>
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
          <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20 backdrop-blur-sm">
            <div className="flex items-center space-x-4">
              <div
                className={`w-4 h-4 rounded-full shadow-[0_0_8px_currentColor] ${CLASS_COLORS[currentDeck.className].replace('bg-', 'text-').replace('text-white', '')}`}
                style={{ backgroundColor: 'currentColor' }}
              />
              <div>
                <div className="font-medium text-violet-200">
                  選択中: {currentDeck.deckName}
                </div>
                <div className="text-sm text-violet-300/70">
                  {currentDeck.className}
                </div>
              </div>
            </div>
          </div>
        )}

        {!currentDeck && (
          <div className="p-4 bg-yellow-500/10 rounded-xl border border-yellow-500/20 backdrop-blur-sm">
            <div className="text-yellow-200/90 text-sm flex items-center">
              <span className="mr-2">⚠️</span>
              対戦記録を行うには、使用デッキを選択してください
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
