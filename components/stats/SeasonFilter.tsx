'use client';

import React, { useState, useEffect } from 'react';
import { Season } from '@/types';
import { Select } from '@/components/ui/Select';

interface SeasonFilterProps {
  selectedSeasonId: string | null; // null = 全シーズン
  onSeasonChange: (seasonId: string | null) => void;
  storageKey?: string; // localStorageのキー（個人統計と全体統計で分ける）
}

export const SeasonFilter: React.FC<SeasonFilterProps> = ({
  selectedSeasonId,
  onSeasonChange,
  storageKey = 'selectedSeasonId',
}) => {
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // シーズン一覧を取得（初回のみ）
  useEffect(() => {
    const fetchSeasons = async () => {
      try {
        setIsLoading(true);

        // 直接fetchでGraphQL APIを呼び出し
        const response = await fetch('https://df7vocdurnaynkgzi4bnmha3fu.appsync-api.ap-northeast-1.amazonaws.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.NEXT_PUBLIC_APPSYNC_API_KEY || '',
          },
          body: JSON.stringify({
            query: `
              query ListSeasons {
                listSeasons {
                  items {
                    id
                    name
                    startDate
                    endDate
                    createdAt
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.data?.listSeasons?.items) {
          const fetchedSeasons: Season[] = result.data.listSeasons.items
            .filter((s: any) => s !== null && s !== undefined)
            .map((s: any) => ({
              id: s.id,
              name: s.name,
              startDate: s.startDate || undefined,
              endDate: s.endDate || undefined,
              createdAt: s.createdAt,
            }))
            .sort((a: Season, b: Season) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

          setSeasons(fetchedSeasons);

          // 初回ロード時: localStorageから復元、またはデフォルト（最新シーズン）を設定
          if (!selectedSeasonId) {
            const savedSeasonId = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
            const defaultSeasonId = savedSeasonId || (fetchedSeasons[0]?.id || null);
            onSeasonChange(defaultSeasonId);
          }
        }
      } catch (err) {
        console.error('シーズンの取得に失敗しました:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // 初回のみ実行

  // 選択が変更されたらlocalStorageに保存
  useEffect(() => {
    if (typeof window !== 'undefined' && selectedSeasonId !== null) {
      localStorage.setItem(storageKey, selectedSeasonId);
    }
  }, [selectedSeasonId, storageKey]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSeasonChange(value === 'all' ? null : value);
  };

  if (isLoading) {
    return (
      <div className="text-sm text-slate-400">
        シーズン読み込み中...
      </div>
    );
  }

  // Selectコンポーネント用のoptions配列を作成
  const selectOptions = [
    { value: 'all', label: '全シーズン' },
    ...seasons.map((season) => ({
      value: season.id,
      label: `${season.name}${season.startDate && season.endDate ? ` (${season.startDate} 〜 ${season.endDate})` : ''}`,
    })),
  ];

  return (
    <Select
      label="シーズン"
      value={selectedSeasonId || 'all'}
      onChange={handleChange}
      options={selectOptions}
      placeholder="シーズンを選択"
    />
  );
};
