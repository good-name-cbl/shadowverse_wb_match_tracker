'use client';

import React, { useState, useEffect } from 'react';
import { ClassType } from '@/types';
import { fetchDeckTemplates } from '@/utils/deckTemplates';

interface DeckTemplateSelectorProps {
  selectedClass: ClassType | '';
  seasonId: string | null; // 現在のシーズンID
  onSelectTemplate: (deckName: string) => void;
  onClose: () => void;
}

export const DeckTemplateSelector: React.FC<DeckTemplateSelectorProps> = ({
  selectedClass,
  seasonId,
  onSelectTemplate,
  onClose,
}) => {
  const [templates, setTemplates] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // クラスまたはシーズンが変更されたらテンプレートを取得
  useEffect(() => {
    if (!selectedClass) {
      setTemplates([]);
      return;
    }

    const loadTemplates = async () => {
      setIsLoading(true);
      try {
        const fetchedTemplates = await fetchDeckTemplates(seasonId, selectedClass as ClassType);
        setTemplates(fetchedTemplates);
      } catch (error) {
        console.error('テンプレートの読み込みに失敗しました:', error);
        setTemplates([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTemplates();
  }, [selectedClass, seasonId]);

  if (!selectedClass) {
    return (
      <div className="p-4 text-center text-gray-500">
        まずクラスを選択してください
      </div>
    );
  }

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
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          読み込み中...
        </div>
      ) : templates.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {templates.map((templateName, index) => (
            <div
              key={index}
              onClick={() => onSelectTemplate(templateName)}
              className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-gray-900">
                {templateName}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-gray-500">
          テンプレートがありません
        </div>
      )}
    </div>
  );
};
