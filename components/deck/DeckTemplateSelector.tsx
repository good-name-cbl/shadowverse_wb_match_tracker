'use client';

import React, { useState } from 'react';
import { ClassType } from '@/types';
import { DECK_TEMPLATES, getTierLabel, getTierColor, getArchetypeColor } from '@/utils/deckTemplates';

interface DeckTemplateSelectorProps {
  selectedClass: ClassType | '';
  onSelectTemplate: (deckName: string) => void;
  onClose: () => void;
}

export const DeckTemplateSelector: React.FC<DeckTemplateSelectorProps> = ({
  selectedClass,
  onSelectTemplate,
  onClose,
}) => {
  const [selectedTier, setSelectedTier] = useState<number | null>(null);

  if (!selectedClass) {
    return (
      <div className="p-4 text-center text-gray-500">
        まずクラスを選択してください
      </div>
    );
  }

  const templates = DECK_TEMPLATES[selectedClass as ClassType];
  const filteredTemplates = selectedTier
    ? templates.filter(template => template.tier === selectedTier)
    : templates;

  const tiers = [1, 2, 3, 4];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-gray-800">
          {selectedClass}のテンプレート
        </h4>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Tier フィルター */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedTier(null)}
          className={`px-3 py-1 text-xs rounded-full transition-colors ${
            selectedTier === null
              ? 'bg-blue-100 text-blue-800'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          全て
        </button>
        {tiers.map(tier => (
          <button
            key={tier}
            onClick={() => setSelectedTier(tier)}
            className={`px-3 py-1 text-xs rounded-full transition-colors ${
              selectedTier === tier
                ? 'bg-blue-100 text-blue-800'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {getTierLabel(tier)}
          </button>
        ))}
      </div>

      {/* テンプレート一覧 */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {filteredTemplates.map((template, index) => (
          <div
            key={index}
            onClick={() => onSelectTemplate(template.name)}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-900">
                {template.name}
              </span>
              <div className="flex items-center space-x-2">
                <span className={`text-xs font-medium ${getTierColor(template.tier)}`}>
                  {getTierLabel(template.tier)}
                </span>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getArchetypeColor(template.archetype)}`}>
                  {template.archetype}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-3 border-t">
        <p className="text-xs text-gray-500">
          ※ Tier情報は現在の環境に基づいています
        </p>
      </div>
    </div>
  );
};
