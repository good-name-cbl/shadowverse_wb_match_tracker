'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { RadioGroup } from '@/components/ui/RadioGroup';
import { Button } from '@/components/ui/Button';
import { ClassType, MatchRecord } from '@/types';
import { CLASSES } from '@/utils/constants';

interface EditMatchRecordModalProps {
  isOpen: boolean;
  record: MatchRecord | null;
  onClose: () => void;
  onUpdate: (recordId: string, updatedData: {
    opponentClass: ClassType;
    opponentDeckType: string;
    isFirstPlayer: boolean;
    isWin: boolean;
  }) => Promise<void>;
}

export const EditMatchRecordModal: React.FC<EditMatchRecordModalProps> = ({
  isOpen,
  record,
  onClose,
  onUpdate,
}) => {
  const [opponentClass, setOpponentClass] = useState<ClassType | ''>('');
  const [opponentDeckType, setOpponentDeckType] = useState('');
  const [isFirstPlayer, setIsFirstPlayer] = useState<string>('');
  const [isWin, setIsWin] = useState<string>('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // モーダルが開かれたときに、recordから初期値を設定
  useEffect(() => {
    if (isOpen && record) {
      setOpponentClass(record.opponentClass);
      setOpponentDeckType(record.opponentDeckType);
      setIsFirstPlayer(String(record.isFirstPlayer));
      setIsWin(String(record.isWin));
      setError('');
    }
  }, [isOpen, record]);

  if (!isOpen || !record) {
    return null;
  }

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // バリデーション
    if (!opponentClass) {
      setError('相手クラスを選択してください');
      return;
    }
    if (!opponentDeckType.trim()) {
      setError('相手デッキタイプを入力してください');
      return;
    }
    if (!isFirstPlayer) {
      setError('先攻/後攻を選択してください');
      return;
    }
    if (!isWin) {
      setError('勝敗を選択してください');
      return;
    }

    try {
      setIsUpdating(true);
      await onUpdate(record.id, {
        opponentClass: opponentClass as ClassType,
        opponentDeckType: opponentDeckType.trim(),
        isFirstPlayer: isFirstPlayer === 'true',
        isWin: isWin === 'true',
      });
      onClose();
    } catch (err) {
      setError('更新に失敗しました。もう一度お試しください。');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="glass-card rounded-xl max-w-md w-full mx-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold text-slate-100 mb-6">
          対戦記録を編集
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 相手クラス */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              相手クラス
            </label>
            <Select
              value={opponentClass}
              onChange={(e) => setOpponentClass(e.target.value as ClassType)}
              options={classOptions}
            />
          </div>

          {/* 相手デッキタイプ */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              相手デッキタイプ
            </label>
            <Input
              type="text"
              value={opponentDeckType}
              onChange={(e) => setOpponentDeckType(e.target.value)}
              placeholder="例: 進化ロイヤル"
            />
          </div>

          {/* 先攻/後攻 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              先攻/後攻
            </label>
            <RadioGroup
              options={playerOrderOptions}
              value={isFirstPlayer}
              onChange={setIsFirstPlayer}
              name="edit-player-order"
            />
          </div>

          {/* 勝敗 */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              勝敗
            </label>
            <RadioGroup
              options={resultOptions}
              value={isWin}
              onChange={setIsWin}
              name="edit-result"
            />
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isUpdating}
              className="flex-1"
            >
              キャンセル
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isUpdating}
              className="flex-1"
            >
              {isUpdating ? '更新中...' : '更新する'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
