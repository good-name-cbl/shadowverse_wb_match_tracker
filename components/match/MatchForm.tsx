'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Button } from '@/components/ui/Button';
import ClassIcon from '@/components/ui/ClassIcon';
import { ClassType, Deck } from '@/types';
import { CLASSES } from '@/utils/constants';
import { DeckTemplateSelector } from '../deck/DeckTemplateSelector';

interface MatchFormProps {
  currentDeck: Deck | null;
  seasonId?: string | null; // 現在のシーズンID
  onSubmit: (matchData: {
    opponentClass: ClassType;
    opponentDeckType: string;
    isFirstPlayer: boolean;
    isWin: boolean;
  }) => void | Promise<void>;
  isLoading?: boolean;
}

export const MatchForm: React.FC<MatchFormProps> = ({
  currentDeck,
  seasonId = null,
  onSubmit,
  isLoading = false,
}) => {
  const [opponentClass, setOpponentClass] = useState<ClassType | ''>('');
  const [opponentDeckType, setOpponentDeckType] = useState('');
  const [isFirstPlayer, setIsFirstPlayer] = useState<string>('');
  const [isWin, setIsWin] = useState<string>('');
  const [error, setError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const classOptions = CLASSES.map(cls => ({
    value: cls,
    label: cls
  }));

  const playerOrderOptions = [
    { value: 'true', label: '先攻' },
    { value: 'false', label: '後攻' }
  ];

  const resultOptions = [
    { value: 'true', label: '勝ち' },
    { value: 'false', label: '負け' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!currentDeck) {
      setError('使用デッキを選択してください');
      return;
    }

    if (!opponentClass || !opponentDeckType.trim() || !isFirstPlayer || !isWin) {
      setError('すべての項目を入力してください');
      return;
    }

    onSubmit({
      opponentClass: opponentClass as ClassType,
      opponentDeckType: opponentDeckType.trim(),
      isFirstPlayer: isFirstPlayer === 'true',
      isWin: isWin === 'true',
    });

    setOpponentClass('');
    setOpponentDeckType('');
    setIsFirstPlayer('');
    setIsWin('');
    setShowTemplates(false);
  };

  const handleTemplateSelect = (templateName: string) => {
    setOpponentDeckType(templateName);
    setShowTemplates(false);
  };

  if (!currentDeck) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          対戦結果の記録
        </h3>
        <div className="py-8 text-slate-400">
          対戦記録を行うには、まずデッキを選択してください。
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-6 flex items-center">
        <span className="mr-2">📝</span>
        対戦結果の記録
      </h3>

      <div className="mb-6 p-4 bg-violet-500/10 border border-violet-500/20 rounded-xl">
        <div className="flex items-center gap-3">
          <span className="bg-violet-500/20 px-2 py-0.5 rounded text-xs border border-violet-500/30 text-violet-200">使用中</span>
          <ClassIcon className={currentDeck.className} size="medium" showLabel labelClassName="text-violet-200" />
          <span className="text-sm text-violet-200">- {currentDeck.deckName}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-5">
          <Select
            label="相手のクラス"
            value={opponentClass}
            onChange={(e) => setOpponentClass(e.target.value as ClassType)}
            options={classOptions}
            placeholder="クラスを選択"
            required
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-slate-300 ml-1">
                相手のデッキタイプ
              </label>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setShowTemplates(!showTemplates)}
                disabled={!opponentClass}
                className="text-xs"
              >
                {showTemplates ? '閉じる' : 'テンプレートから入力'}
              </Button>
            </div>
            <Input
              value={opponentDeckType}
              onChange={(e) => setOpponentDeckType(e.target.value)}
              placeholder="例: 人形ネメシス"
              required
            />
            {showTemplates && opponentClass && (
              <div className="mt-3 p-4 border border-slate-700 rounded-xl bg-slate-900/50 backdrop-blur-sm">
                <DeckTemplateSelector
                  selectedClass={opponentClass as ClassType}
                  seasonId={seasonId}
                  onSelectTemplate={handleTemplateSelect}
                  onClose={() => setShowTemplates(false)}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <RadioGroup
            label="先攻/後攻"
            name="playerOrder"
            value={isFirstPlayer}
            onChange={setIsFirstPlayer}
            options={playerOrderOptions}
          />

          <RadioGroup
            label="勝敗"
            name="result"
            value={isWin}
            onChange={setIsWin}
            options={resultOptions}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded-lg">
            {error}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
        >
          対戦結果を記録
        </Button>
      </form>
    </div>
  );
};
