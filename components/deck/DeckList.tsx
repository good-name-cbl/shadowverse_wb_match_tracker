'use client';

import React from 'react';
import { Button } from '@/components/ui/Button';
import ClassIcon from '@/components/ui/ClassIcon';
import { Deck } from '@/types';

interface DeckListProps {
  decks: Deck[];
  currentDeckId: string | null;
  onSelectDeck: (deck: Deck) => void;
  onDeleteDeck: (deckId: string) => void | Promise<void>;
}

export const DeckList: React.FC<DeckListProps> = ({
  decks,
  currentDeckId,
  onSelectDeck,
  onDeleteDeck,
}) => {
  if (decks.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <h3 className="text-lg font-semibold text-slate-200 mb-4">
          登録済みデッキ
        </h3>
        <div className="py-8 text-slate-400">
          まだデッキが登録されていません。<br />
          上のフォームからデッキを追加してください。
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="text-lg font-semibold text-slate-200 mb-4 flex items-center">
        <span className="mr-2">📚</span>
        登録済みデッキ
      </h3>

      <div className="space-y-3">
        {decks.map((deck) => (
          <div
            key={deck.id}
            className={`border rounded-xl p-4 transition-all duration-200 ${currentDeckId === deck.id
                ? 'border-violet-500/50 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                : 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-600'
              }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ClassIcon
                  className={deck.className}
                  size="small"
                  showLabel
                  labelClassName="text-slate-400"
                />
                <div className={`font-medium ${currentDeckId === deck.id ? 'text-violet-200' : 'text-slate-200'}`}>
                  {deck.deckName}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {currentDeckId === deck.id ? (
                  <span className="text-violet-400 text-xs font-medium px-3 py-1 bg-violet-500/10 rounded-full border border-violet-500/20">
                    使用中
                  </span>
                ) : (
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onSelectDeck(deck)}
                    className="text-xs"
                  >
                    選択
                  </Button>
                )}

                <Button
                  size="sm"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  onClick={() => {
                    if (confirm('このデッキを削除しますか？')) {
                      onDeleteDeck(deck.id);
                    }
                  }}
                >
                  削除
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
