'use client';

import React from 'react';
import { DeckForm } from './DeckForm';
import { DeckList } from './DeckList';
import { Deck, ClassType } from '@/types';

interface DeckSectionProps {
  decks: Deck[];
  currentDeckId: string | null;
  onAddDeck: (className: ClassType, deckName: string) => void | Promise<void>;
  onSelectDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void | Promise<void>;
  isAddingDeck?: boolean;
}

export const DeckSection: React.FC<DeckSectionProps> = ({
  decks,
  currentDeckId,
  onAddDeck,
  onSelectDeck,
  onDeleteDeck,
  isAddingDeck = false,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          デッキ管理
        </h2>
        <p className="text-gray-600 mb-6">
          使用するデッキを登録・選択してください。選択したデッキで対戦記録を行います。
        </p>
      </div>

      <DeckForm
        onSubmit={onAddDeck}
        isLoading={isAddingDeck}
      />

      <DeckList
        decks={decks}
        currentDeckId={currentDeckId}
        onSelectDeck={onSelectDeck}
        onDeleteDeck={onDeleteDeck}
      />
    </div>
  );
};
