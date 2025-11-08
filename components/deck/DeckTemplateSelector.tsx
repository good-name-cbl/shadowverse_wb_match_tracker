'use client';

import React from 'react';
import { ClassType } from '@/types';
import { DECK_TEMPLATES } from '@/utils/deckTemplates';

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
  if (!selectedClass) {
    return (
      <div className="p-4 text-center text-gray-500">
        まずクラスを選択してください
      </div>
    );
  }

  const templates = DECK_TEMPLATES[selectedClass as ClassType];

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

      {/* テンプレート一覧 */}
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {templates.map((template, index) => (
          <div
            key={index}
            onClick={() => onSelectTemplate(template.name)}
            className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">
              {template.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
