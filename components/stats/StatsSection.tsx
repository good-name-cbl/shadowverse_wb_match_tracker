'use client';

import React, { useState, useMemo } from 'react';
import { OverallStats } from './OverallStats';
import { ClassStats } from './ClassStats';
import { DeckTypeStats } from './DeckTypeStats';
import { DeckFilter } from './DeckFilter';
import { MatchRecord, Deck } from '@/types';
import {
  calculateOverallStats,
  calculateClassStats,
  calculateDeckTypeStats,
  filterRecordsByDeck,
} from '@/utils/statistics';

interface StatsSectionProps {
  records: MatchRecord[];
  decks: Deck[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ records, decks }) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);

  const filteredRecords = useMemo(
    () => filterRecordsByDeck(records, selectedDeckId),
    [records, selectedDeckId]
  );

  const overallStats = useMemo(
    () => calculateOverallStats(filteredRecords),
    [filteredRecords]
  );

  const classStats = useMemo(
    () => calculateClassStats(filteredRecords),
    [filteredRecords]
  );

  const deckTypeStats = useMemo(
    () => calculateDeckTypeStats(filteredRecords),
    [filteredRecords]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          統計情報
        </h2>
        <p className="text-gray-600 mb-6">
          対戦記録から算出された詳細な統計情報を確認できます。
        </p>
      </div>

      <DeckFilter
        decks={decks}
        selectedDeckId={selectedDeckId}
        onDeckChange={setSelectedDeckId}
      />

      <OverallStats stats={overallStats} />

      <ClassStats stats={classStats} />

      <DeckTypeStats stats={deckTypeStats} />
    </div>
  );
};
