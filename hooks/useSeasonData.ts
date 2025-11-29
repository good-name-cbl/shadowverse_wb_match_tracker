'use client';

import { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { Season } from '@/types';

const client = generateClient<Schema>();

export interface SeasonDataState {
  seasons: Season[];
  currentSeason: Season | null;
  currentSeasonId: string | null;
  isLoading: boolean;
}

/**
 * シーズン情報を取得するフック
 * publicApiKeyで認証不要でアクセス可能
 */
export function useSeasonData(): SeasonDataState {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [currentSeason, setCurrentSeason] = useState<Season | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        // publicApiKeyでアクセス（認証不要）
        const { data: seasonsData } = await client.models.Season.list({
          authMode: 'apiKey',
        });

        const fetchedSeasons: Season[] = (seasonsData || [])
          .map((season) => ({
            id: season.id,
            name: season.name,
            startDate: season.startDate || undefined,
            endDate: season.endDate || undefined,
            createdAt: season.createdAt,
          }))
          .sort((a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        setSeasons(fetchedSeasons);

        // 最新シーズンを設定（createdAtが最も新しいもの）
        if (fetchedSeasons.length > 0) {
          setCurrentSeason(fetchedSeasons[0]);
        }
      } catch (error) {
        console.error('シーズンの取得に失敗しました:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, []);

  return {
    seasons,
    currentSeason,
    currentSeasonId: currentSeason?.id ?? null,
    isLoading,
  };
}
