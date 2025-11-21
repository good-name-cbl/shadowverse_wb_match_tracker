'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import {
  loadLocalStorageData,
  validateData,
  importDataToDynamoDB,
  clearLocalStorageData,
  hasLocalStorageData,
  type LocalStorageData,
  type MigrationResult,
} from '@/utils/dataMigration';

interface DataMigrationModalProps {
  userId: string;
  seasonId: string | null;
  onClose: () => void;
  onMigrationComplete: () => void;
}

type MigrationStep = 'check' | 'confirm' | 'importing' | 'complete' | 'error';

export const DataMigrationModal: React.FC<DataMigrationModalProps> = ({
  userId,
  seasonId,
  onClose,
  onMigrationComplete,
}) => {
  const [step, setStep] = useState<MigrationStep>('check');
  const [localData, setLocalData] = useState<LocalStorageData | null>(null);
  const [migrationResult, setMigrationResult] = useState<MigrationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    // LocalStorageデータの確認
    const data = loadLocalStorageData();
    if (!data || (data.decks.length === 0 && data.records.length === 0)) {
      setErrorMessage('移行可能なデータが見つかりませんでした。');
      setStep('error');
      return;
    }

    if (!validateData(data)) {
      setErrorMessage('データの形式が正しくありません。');
      setStep('error');
      return;
    }

    setLocalData(data);
    setStep('confirm');
  }, []);

  const handleImport = async () => {
    if (!localData) return;

    if (!seasonId) {
      setErrorMessage('シーズンが選択されていません。');
      setStep('error');
      return;
    }

    setStep('importing');

    try {
      const result = await importDataToDynamoDB(localData, userId, seasonId);
      setMigrationResult(result);

      if (result.success || result.decksImported > 0 || result.recordsImported > 0) {
        // 成功またはデータ部分的にインポートできた場合
        setStep('complete');
      } else {
        setErrorMessage('データのインポートに失敗しました。');
        setStep('error');
      }
    } catch (error: any) {
      setErrorMessage(`エラー: ${error.message}`);
      setStep('error');
    }
  };

  const handleClearAndClose = () => {
    clearLocalStorageData();
    onMigrationComplete();
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-slate-100 mb-4">
            データ移行ツール
          </h2>

          {step === 'check' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
              <p className="text-slate-400">データを確認中...</p>
            </div>
          )}

          {step === 'confirm' && localData && (
            <div className="space-y-6">
              <div className="bg-blue-500/10 border border-blue-500/20 text-blue-300 p-4 rounded-lg">
                <p className="font-medium mb-2">LocalStorageにデータが見つかりました！</p>
                <p className="text-sm">
                  以下のデータをクラウドにインポートしますか？
                </p>
              </div>

              <div className="space-y-4">
                <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
                  <h3 className="font-semibold text-slate-200 mb-2">📦 インポート内容</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">デッキ数:</span>
                      <span className="font-semibold text-slate-200">{localData.decks.length} 個</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">対戦記録数:</span>
                      <span className="font-semibold text-slate-200">{localData.records.length} 件</span>
                    </div>
                  </div>
                </div>

                {localData.decks.length > 0 && (
                  <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
                    <h3 className="font-semibold text-slate-200 mb-2">デッキ一覧</h3>
                    <div className="space-y-1 text-sm max-h-40 overflow-y-auto custom-scrollbar">
                      {localData.decks.map((deck) => (
                        <div key={deck.id} className="text-slate-400">
                          • {deck.className} - {deck.deckName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-300 p-4 rounded-lg text-sm">
                <p className="font-medium mb-1">⚠️ 注意事項</p>
                <ul className="list-disc list-inside space-y-1 text-yellow-300/80">
                  <li>インポートが完了すると、LocalStorageのデータは削除されます。</li>
                  <li>この操作は取り消しできません。</li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <Button variant="secondary" onClick={handleSkip}>
                  後で移行する
                </Button>
                <Button onClick={handleImport}>
                  インポートを開始
                </Button>
              </div>
            </div>
          )}

          {step === 'importing' && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto mb-4"></div>
              <p className="text-slate-400 mb-2">データをインポート中...</p>
              <p className="text-sm text-slate-500">しばらくお待ちください</p>
            </div>
          )}

          {step === 'complete' && migrationResult && (
            <div className="space-y-6">
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-lg">
                <p className="font-medium text-lg mb-2">✅ インポート完了！</p>
                <p className="text-sm">
                  データがクラウドに正常にインポートされました。
                </p>
              </div>

              <div className="border border-slate-700/50 rounded-lg p-4 bg-slate-800/30">
                <h3 className="font-semibold text-slate-200 mb-3">インポート結果</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">インポートしたデッキ:</span>
                    <span className="font-semibold text-green-400">
                      {migrationResult.decksImported} 個
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">インポートした対戦記録:</span>
                    <span className="font-semibold text-green-400">
                      {migrationResult.recordsImported} 件
                    </span>
                  </div>
                </div>
              </div>

              {migrationResult.errors.length > 0 && (
                <div className="border border-orange-500/20 rounded-lg p-4 bg-orange-500/10">
                  <h3 className="font-semibold text-orange-400 mb-2">
                    ⚠️ 一部のデータでエラーが発生しました
                  </h3>
                  <div className="space-y-1 text-sm text-orange-400/80 max-h-40 overflow-y-auto custom-scrollbar">
                    {migrationResult.errors.map((error, index) => (
                      <div key={index}>• {error}</div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={handleClearAndClose}>
                  完了（LocalStorageをクリア）
                </Button>
              </div>
            </div>
          )}

          {step === 'error' && (
            <div className="space-y-6">
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg">
                <p className="font-medium text-lg mb-2">❌ エラー</p>
                <p className="text-sm">{errorMessage}</p>
              </div>

              <div className="flex justify-end">
                <Button variant="secondary" onClick={handleSkip}>
                  閉じる
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
