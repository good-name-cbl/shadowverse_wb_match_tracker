'use client';

import React from 'react';
import { DeckSelector } from './DeckSelector';
import { MatchForm } from './MatchForm';
import { MatchHistory } from './MatchHistory';
import { MatchRecord, Deck, ClassType } from '@/types';

interface MatchSectionProps {
  currentDeck: Deck | null;
  currentDeckId: string | null;
  records: MatchRecord[];
  decks: Deck[];
  onSelectDeck: (deckId: string | null) => void;
  onAddRecord: (matchData: {
    opponentClass: ClassType;
    opponentDeckType: string;
    isFirstPlayer: boolean;
    isWin: boolean;
  }) => void | Promise<void>;
  onDeleteRecord: (recordId: string) => void | Promise<void>;
  isAddingRecord?: boolean;
}

export const MatchSection: React.FC<MatchSectionProps> = ({
  currentDeck,
  currentDeckId,
  records,
  decks,
  onSelectDeck,
  onAddRecord,
  onDeleteRecord,
  isAddingRecord = false,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          対戦記録
        </h2>
        <p className="text-gray-600 mb-6">
          対戦結果を記録して、詳細な統計情報を確認しましょう。
        </p>
      </div>

      <DeckSelector
        decks={decks}
        currentDeckId={currentDeckId}
        onSelectDeck={onSelectDeck}
      />

      <MatchForm
        currentDeck={currentDeck}
        onSubmit={onAddRecord}
        isLoading={isAddingRecord}
      />

      <MatchHistory
        records={records}
        decks={decks}
        onDeleteRecord={onDeleteRecord}
      />
    </div>
  );
};
