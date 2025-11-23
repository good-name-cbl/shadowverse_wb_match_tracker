'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/utils/auth';
import { Season } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

const client = generateClient<Schema>();

export default function SeasonsAdminPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // 新規作成フォーム
  const [isCreating, setIsCreating] = useState(false);
  const [newSeasonName, setNewSeasonName] = useState('');
  const [newSeasonStartDate, setNewSeasonStartDate] = useState('');
  const [newSeasonEndDate, setNewSeasonEndDate] = useState('');

  // 編集フォーム
  const [editingSeasonId, setEditingSeasonId] = useState<string | null>(null);
  const [editSeasonName, setEditSeasonName] = useState('');
  const [editSeasonStartDate, setEditSeasonStartDate] = useState('');
  const [editSeasonEndDate, setEditSeasonEndDate] = useState('');

  // 管理者チェック
  useEffect(() => {
    if (!authLoading && !isAdmin(user?.email)) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // シーズン一覧取得
  useEffect(() => {
    if (!user || !isAdmin(user.email)) return;

    const fetchSeasons = async () => {
      try {
        setIsLoading(true);
        const { data } = await client.models.Season.list();
        const fetchedSeasons: Season[] = (data || []).map((s) => ({
          id: s.id,
          name: s.name,
          startDate: s.startDate || undefined,
          endDate: s.endDate || undefined,
          createdAt: s.createdAt,
        })).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSeasons(fetchedSeasons);
      } catch (err: any) {
        setError('シーズンの取得に失敗しました');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSeasons();
  }, [user]);

  // シーズン作成
  const handleCreateSeason = async () => {
    if (!newSeasonName.trim()) {
      setError('シーズン名を入力してください');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await client.models.Season.create({
        name: newSeasonName,
        startDate: newSeasonStartDate || undefined,
        endDate: newSeasonEndDate || undefined,
        createdAt: new Date().toISOString(),
      });

      if (data) {
        setSeasons([{
          id: data.id,
          name: data.name,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
          createdAt: data.createdAt,
        }, ...seasons]);
      }

      // フォームをリセット
      setNewSeasonName('');
      setNewSeasonStartDate('');
      setNewSeasonEndDate('');
      setIsCreating(false);
      setError('');
    } catch (err: any) {
      setError('シーズンの作成に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // シーズン編集開始
  const startEditing = (season: Season) => {
    setEditingSeasonId(season.id);
    setEditSeasonName(season.name);
    setEditSeasonStartDate(season.startDate || '');
    setEditSeasonEndDate(season.endDate || '');
  };

  // シーズン編集キャンセル
  const cancelEditing = () => {
    setEditingSeasonId(null);
    setEditSeasonName('');
    setEditSeasonStartDate('');
    setEditSeasonEndDate('');
  };

  // シーズン更新
  const handleUpdateSeason = async (id: string) => {
    if (!editSeasonName.trim()) {
      setError('シーズン名を入力してください');
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await client.models.Season.update({
        id,
        name: editSeasonName,
        startDate: editSeasonStartDate || undefined,
        endDate: editSeasonEndDate || undefined,
      });

      if (data) {
        setSeasons(seasons.map(s => s.id === id ? {
          id: data.id,
          name: data.name,
          startDate: data.startDate || undefined,
          endDate: data.endDate || undefined,
          createdAt: data.createdAt,
        } : s));
      }

      cancelEditing();
      setError('');
    } catch (err: any) {
      setError('シーズンの更新に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // シーズン削除
  const handleDeleteSeason = async (id: string) => {
    if (!confirm('このシーズンを削除してもよろしいですか？関連する対戦記録は削除されません。')) {
      return;
    }

    try {
      setIsLoading(true);
      await client.models.Season.delete({ id });
      setSeasons(seasons.filter(s => s.id !== id));
      setError('');
    } catch (err: any) {
      setError('シーズンの削除に失敗しました');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (user && !isAdmin(user.email))) {
    return null; // リダイレクト中
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-card rounded-xl p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-100">シーズン管理</h1>
            <Button onClick={() => router.push('/')}>
              トップへ戻る
            </Button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm mb-4">
              {error}
            </div>
          )}

          {/* 新規作成ボタン */}
          {!isCreating && (
            <div className="mb-6">
              <Button onClick={() => setIsCreating(true)}>
                新しいシーズンを作成
              </Button>
            </div>
          )}

          {/* 新規作成フォーム */}
          {isCreating && (
            <div className="glass border border-white/10 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">新しいシーズンを作成</h2>
              <div className="space-y-4">
                <Input
                  label="シーズン名"
                  type="text"
                  value={newSeasonName}
                  onChange={(e) => setNewSeasonName(e.target.value)}
                  placeholder="例: 蒼空の六竜（前半）"
                  required
                />
                <Input
                  label="開始日（任意）"
                  type="date"
                  value={newSeasonStartDate}
                  onChange={(e) => setNewSeasonStartDate(e.target.value)}
                />
                <Input
                  label="終了日（任意）"
                  type="date"
                  value={newSeasonEndDate}
                  onChange={(e) => setNewSeasonEndDate(e.target.value)}
                />
                <div className="flex space-x-2">
                  <Button onClick={handleCreateSeason} isLoading={isLoading}>
                    作成
                  </Button>
                  <Button onClick={() => setIsCreating(false)}>
                    キャンセル
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* シーズン一覧 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">シーズン一覧</h2>
            {isLoading && seasons.length === 0 ? (
              <p className="text-slate-400">読み込み中...</p>
            ) : seasons.length === 0 ? (
              <p className="text-slate-400">シーズンがありません</p>
            ) : (
              <div className="space-y-2">
                {seasons.map((season) => (
                  <div key={season.id} className="glass border border-white/5 rounded-lg p-4 hover:bg-white/5 transition-colors">
                    {editingSeasonId === season.id ? (
                      // 編集モード
                      <div className="space-y-4">
                        <Input
                          label="シーズン名"
                          type="text"
                          value={editSeasonName}
                          onChange={(e) => setEditSeasonName(e.target.value)}
                          required
                        />
                        <Input
                          label="開始日（任意）"
                          type="date"
                          value={editSeasonStartDate}
                          onChange={(e) => setEditSeasonStartDate(e.target.value)}
                        />
                        <Input
                          label="終了日（任意）"
                          type="date"
                          value={editSeasonEndDate}
                          onChange={(e) => setEditSeasonEndDate(e.target.value)}
                        />
                        <div className="flex space-x-2">
                          <Button onClick={() => handleUpdateSeason(season.id)} isLoading={isLoading}>
                            保存
                          </Button>
                          <Button onClick={cancelEditing}>
                            キャンセル
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // 表示モード
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-200">{season.name}</h3>
                            <div className="text-sm text-slate-400 space-y-1">
                              {season.startDate && (
                                <p>開始日: {season.startDate}</p>
                              )}
                              {season.endDate && (
                                <p>終了日: {season.endDate}</p>
                              )}
                              <p className="text-xs">作成日時: {new Date(season.createdAt).toLocaleString('ja-JP')}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => startEditing(season)}
                              className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 border border-blue-600 rounded"
                            >
                              編集
                            </button>
                            <button
                              onClick={() => handleDeleteSeason(season.id)}
                              className="text-red-600 hover:text-red-800 text-sm px-3 py-1 border border-red-600 rounded"
                            >
                              削除
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
