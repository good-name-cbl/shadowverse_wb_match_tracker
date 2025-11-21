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
      <div className="p-4 text-center text-slate-400">
        まずクラスを選択してください
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-lg font-semibold text-slate-200">
          {selectedClass}のテンプレート
        </h4>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          ✕
        </button>
      </div>

      {/* テンプレート一覧 */}
      {isLoading ? (
        <div className="p-4 text-center text-slate-400">
          読み込み中...
        </div>
      ) : templates.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
          {templates.map((templateName, index) => (
            <div
              key={index}
              onClick={() => onSelectTemplate(templateName)}
              className="p-3 border border-slate-700 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200"
            >
              <span className="font-medium text-slate-200">
                {templateName}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-4 text-center text-slate-400">
          テンプレートがありません
        </div>
      )}
    </div>
  );
};
