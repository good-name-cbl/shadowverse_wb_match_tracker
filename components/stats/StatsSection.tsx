'use client';

import React, { useState, useMemo } from 'react';
import { OverallStats } from './OverallStats';
import { ClassStats } from './ClassStats';
import { DeckTypeStats } from './DeckTypeStats';
import { DeckFilter } from './DeckFilter';
import { SeasonFilter } from './SeasonFilter';
import { MatchRecord, Deck } from '@/types';
import {
  calculateOverallStats,
  calculateClassStats,
  calculateDeckTypeStats,
  filterRecordsByDeckAndSeason,
} from '@/utils/statistics';

interface StatsSectionProps {
  records: MatchRecord[];
  decks: Deck[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ records, decks }) => {
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
  const [selectedSeasonId, setSelectedSeasonId] = useState<string | null>(null);

  const filteredRecords = useMemo(
    () => filterRecordsByDeckAndSeason(records, selectedDeckId, selectedSeasonId),
    [records, selectedDeckId, selectedSeasonId]
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
        <h2 className="text-2xl font-bold text-slate-100 mb-2">
          統計情報
        </h2>
        <p className="text-slate-400">
          対戦記録から算出された詳細な統計情報を確認できます。
        </p>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
          <span className="mr-2">🔍</span>
          フィルター
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SeasonFilter
            selectedSeasonId={selectedSeasonId}
            onSeasonChange={setSelectedSeasonId}
            storageKey="personalStatsSeasonId"
          />
          <DeckFilter
            decks={decks}
            selectedDeckId={selectedDeckId}
            onDeckChange={setSelectedDeckId}
          />
        </div>
      </div>

      <OverallStats stats={overallStats} />

      <ClassStats stats={classStats} />

      <DeckTypeStats stats={deckTypeStats} />
    </div>
  );
};
