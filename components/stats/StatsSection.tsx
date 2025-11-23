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
    <div className="space-y-8 relative">
      {/* Background Ambient Glow */}
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-violet-500/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 mb-2">
            Statistics Dashboard
          </h2>
          <p className="text-slate-400 max-w-2xl">
            対戦記録から算出された詳細な統計情報を確認できます。
            <br className="hidden sm:block" />
            データを分析して、次の勝利につなげましょう。
          </p>
        </div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters - Spans full width */}
        <div className="lg:col-span-12 glass-card rounded-2xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-blue-500 opacity-50" />
          <h3 className="text-lg font-bold text-slate-200 mb-4 flex items-center">
            <span className="mr-2">🔍</span>
            フィルター設定
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

        {/* Overall Stats - Spans full width */}
        <div className="lg:col-span-12">
          <OverallStats stats={overallStats} />
        </div>

        {/* Class Stats - Spans 7 columns on large screens */}
        <div className="lg:col-span-7 flex flex-col">
          <ClassStats stats={classStats} />
        </div>

        {/* Deck Type Stats - Spans 5 columns on large screens */}
        <div className="lg:col-span-5 flex flex-col">
          <DeckTypeStats stats={deckTypeStats} />
        </div>
      </div>
    </div>
  );
};
