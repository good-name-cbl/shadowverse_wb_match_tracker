'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ClassType } from '@/types';
import { CLASSES } from '@/utils/constants';
import { DeckTemplateSelector } from './DeckTemplateSelector';

interface DeckFormProps {
  onSubmit: (className: ClassType, deckName: string) => void | Promise<void>;
  seasonId?: string | null; // 現在のシーズンID
  isLoading?: boolean;
}

export const DeckForm: React.FC<DeckFormProps> = ({ onSubmit, seasonId = null, isLoading = false }) => {
  const [className, setClassName] = useState<ClassType | ''>('');
  const [deckName, setDeckName] = useState('');
  const [error, setError] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);

  const classOptions = CLASSES.map(cls => ({
    value: cls,
    label: cls
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!className || !deckName.trim()) {
      setError('クラスとデッキ名を入力してください');
      return;
    }

    onSubmit(className as ClassType, deckName.trim());
    setClassName('');
    setDeckName('');
    setShowTemplates(false);
  };

  const handleTemplateSelect = (templateName: string) => {
    setDeckName(templateName);
    setShowTemplates(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        新しいデッキを追加
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 gap-4">
          <Select
            label="クラス"
            value={className}
            onChange={(e) => setClassName(e.target.value as ClassType)}
            options={classOptions}
            placeholder="クラスを選択"
            required
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                デッキ名
              </label>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setShowTemplates(!showTemplates)}
                disabled={!className}
              >
                {showTemplates ? '閉じる' : 'テンプレート'}
              </Button>
            </div>
            <Input
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              placeholder="例: 人形ネメシス"
              required
            />
            {showTemplates && className && (
              <div className="mt-2 p-4 border rounded-lg bg-gray-50">
                <DeckTemplateSelector
                  selectedClass={className as ClassType}
                  seasonId={seasonId}
                  onSelectTemplate={handleTemplateSelect}
                  onClose={() => setShowTemplates(false)}
                />
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <Button
          type="submit"
          isLoading={isLoading}
        >
          デッキを追加
        </Button>
      </form>
    </div>
  );
};
