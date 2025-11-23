'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import { useAuth } from '@/contexts/AuthContext';
import { isAdmin } from '@/utils/auth';
import { DeckTemplate, Season, ClassType } from '@/types';
import { CLASSES } from '@/utils/constants';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

const client = generateClient<Schema>();

// SeasonのtemplatesフィールドからDeckTemplate[]を取得するヘルパー
function getTemplatesFromSeason(season: any): DeckTemplate[] {
  if (!season.templates) return [];
  try {
    const parsed = typeof season.templates === 'string'
      ? JSON.parse(season.templates)
      : season.templates;
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to parse templates:', e);
    return [];
  }
}

export default function TemplateManagementPage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [templates, setTemplates] = useState<DeckTemplate[]>([]);
  const [seasons, setSeasons] = useState<Season[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 新規作成フォーム
  const [newSeasonId, setNewSeasonId] = useState('');
  const [newClassName, setNewClassName] = useState<ClassType>('エルフ');
  const [newDeckName, setNewDeckName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDisplayOrder, setNewDisplayOrder] = useState<number | ''>('');

  // 編集中のテンプレート
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDeckName, setEditDeckName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDisplayOrder, setEditDisplayOrder] = useState<number | ''>('');

  // Admin check
  useEffect(() => {
    if (!authLoading && !isAdmin(user?.email)) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Fetch seasons and templates
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch seasons
        const { data: seasonsData } = await client.models.Season.list();
        const fetchedSeasons: Season[] = (seasonsData || [])
          .map((s) => ({
            id: s.id,
            name: s.name,
            startDate: s.startDate || undefined,
            endDate: s.endDate || undefined,
            createdAt: s.createdAt,
          }))
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setSeasons(fetchedSeasons);

        // Set default season for new template
        if (fetchedSeasons.length > 0 && !newSeasonId) {
          setNewSeasonId(fetchedSeasons[0].id);
        }

        // Extract templates from all seasons
        const allTemplates: DeckTemplate[] = [];
        seasonsData?.forEach((season) => {
          const seasonTemplates = getTemplatesFromSeason(season);
          allTemplates.push(...seasonTemplates);
        });

        setTemplates(allTemplates);
      } catch (err) {
        console.error('データの取得に失敗しました:', err);
        setError('データの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    if (!authLoading && isAdmin(user?.email)) {
      fetchData();
    }
  }, [authLoading, user]);

  // Create template
  const handleCreateTemplate = async () => {
    if (!newDeckName.trim()) {
      setError('デッキ名を入力してください');
      return;
    }
    if (!newSeasonId) {
      setError('シーズンを選択してください');
      return;
    }

    try {
      setError(null);

      // Fetch the current season
      const { data: seasonData } = await client.models.Season.get({ id: newSeasonId });
      if (!seasonData) {
        setError('シーズンが見つかりません');
        return;
      }

      // Get existing templates
      const existingTemplates = getTemplatesFromSeason(seasonData);

      // Create new template
      const newTemplate: DeckTemplate = {
        id: `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        seasonId: newSeasonId,
        className: newClassName,
        deckName: newDeckName,
        description: newDescription || undefined,
        displayOrder: newDisplayOrder !== '' ? Number(newDisplayOrder) : undefined,
        isActive: true,
        createdAt: new Date().toISOString(),
      };

      // Update season with new templates
      const updatedTemplates = [...existingTemplates, newTemplate];
      await client.models.Season.update({
        id: newSeasonId,
        templates: JSON.stringify(updatedTemplates),
      });

      setTemplates([...templates, newTemplate]);

      // Reset form
      setNewDeckName('');
      setNewDescription('');
      setNewDisplayOrder('');
    } catch (err) {
      console.error('テンプレートの作成に失敗しました:', err);
      setError('テンプレートの作成に失敗しました');
    }
  };

  // Start editing
  const handleStartEdit = (template: DeckTemplate) => {
    setEditingId(template.id);
    setEditDeckName(template.deckName);
    setEditDescription(template.description || '');
    setEditDisplayOrder(template.displayOrder || '');
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditDeckName('');
    setEditDescription('');
    setEditDisplayOrder('');
  };

  // Save edit
  const handleSaveEdit = async (template: DeckTemplate) => {
    if (!editDeckName.trim()) {
      setError('デッキ名を入力してください');
      return;
    }

    try {
      setError(null);

      // Fetch the current season
      const { data: seasonData } = await client.models.Season.get({ id: template.seasonId });
      if (!seasonData) {
        setError('シーズンが見つかりません');
        return;
      }

      // Get existing templates and update the one being edited
      const existingTemplates = getTemplatesFromSeason(seasonData);
      const updatedTemplates = existingTemplates.map((t) =>
        t.id === template.id
          ? {
              ...t,
              deckName: editDeckName,
              description: editDescription || undefined,
              displayOrder: editDisplayOrder !== '' ? Number(editDisplayOrder) : undefined,
            }
          : t
      );

      // Update season
      await client.models.Season.update({
        id: template.seasonId,
        templates: JSON.stringify(updatedTemplates),
      });

      // Update local state
      setTemplates(
        templates.map((t) =>
          t.id === template.id
            ? {
                ...t,
                deckName: editDeckName,
                description: editDescription || undefined,
                displayOrder: editDisplayOrder !== '' ? Number(editDisplayOrder) : undefined,
              }
            : t
        )
      );
      handleCancelEdit();
    } catch (err) {
      console.error('テンプレートの更新に失敗しました:', err);
      setError('テンプレートの更新に失敗しました');
    }
  };

  // Toggle active status
  const handleToggleActive = async (template: DeckTemplate) => {
    try {
      setError(null);

      // Fetch the current season
      const { data: seasonData } = await client.models.Season.get({ id: template.seasonId });
      if (!seasonData) {
        setError('シーズンが見つかりません');
        return;
      }

      // Get existing templates and toggle the isActive status
      const existingTemplates = getTemplatesFromSeason(seasonData);
      const updatedTemplates = existingTemplates.map((t) =>
        t.id === template.id ? { ...t, isActive: !t.isActive } : t
      );

      // Update season
      await client.models.Season.update({
        id: template.seasonId,
        templates: JSON.stringify(updatedTemplates),
      });

      // Update local state
      setTemplates(
        templates.map((t) => (t.id === template.id ? { ...t, isActive: !t.isActive } : t))
      );
    } catch (err) {
      console.error('テンプレートの状態更新に失敗しました:', err);
      setError('テンプレートの状態更新に失敗しました');
    }
  };

  // Delete template
  const handleDeleteTemplate = async (template: DeckTemplate) => {
    if (!confirm('このテンプレートを削除してもよろしいですか？')) {
      return;
    }

    try {
      setError(null);

      // Fetch the current season
      const { data: seasonData } = await client.models.Season.get({ id: template.seasonId });
      if (!seasonData) {
        setError('シーズンが見つかりません');
        return;
      }

      // Get existing templates and remove the one being deleted
      const existingTemplates = getTemplatesFromSeason(seasonData);
      const updatedTemplates = existingTemplates.filter((t) => t.id !== template.id);

      // Update season
      await client.models.Season.update({
        id: template.seasonId,
        templates: JSON.stringify(updatedTemplates),
      });

      // Update local state
      setTemplates(templates.filter((t) => t.id !== template.id));
    } catch (err) {
      console.error('テンプレートの削除に失敗しました:', err);
      setError('テンプレートの削除に失敗しました');
    }
  };

  // Group templates by season and class
  const groupedTemplates = templates.reduce((acc, template) => {
    const seasonName =
      seasons.find((s) => s.id === template.seasonId)?.name || 'Unknown Season';
    if (!acc[seasonName]) {
      acc[seasonName] = {} as Record<ClassType, DeckTemplate[]>;
    }
    if (!acc[seasonName][template.className]) {
      acc[seasonName][template.className] = [];
    }
    acc[seasonName][template.className].push(template);
    return acc;
  }, {} as Record<string, Record<ClassType, DeckTemplate[]>>);

  // Sort templates within each group by displayOrder and name
  Object.keys(groupedTemplates).forEach((seasonName) => {
    Object.keys(groupedTemplates[seasonName]).forEach((className) => {
      groupedTemplates[seasonName][className as ClassType].sort((a, b) => {
        if (a.displayOrder !== undefined && b.displayOrder !== undefined) {
          return a.displayOrder - b.displayOrder;
        }
        if (a.displayOrder !== undefined) return -1;
        if (b.displayOrder !== undefined) return 1;
        return a.deckName.localeCompare(b.deckName);
      });
    });
  });

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-slate-400">読み込み中...</div>
      </div>
    );
  }

  if (!isAdmin(user?.email)) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-slate-100">デッキテンプレート管理</h1>
            <Button onClick={() => router.push('/')} variant="secondary">
              ホームに戻る
            </Button>
          </div>
          <p className="mt-2 text-sm text-slate-400">
            デッキタイプのテンプレートをシーズン・クラス別に管理します
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Create form */}
        <div className="glass-card rounded-xl p-8 mb-8">
          <h2 className="text-xl font-semibold text-slate-100 mb-4">新規テンプレート作成</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              label="シーズン"
              value={newSeasonId}
              onChange={(e) => setNewSeasonId(e.target.value)}
              options={seasons.map((s) => ({
                value: s.id,
                label: `${s.name}${s.startDate && s.endDate ? ` (${s.startDate} 〜 ${s.endDate})` : ''}`,
              }))}
            />
            <Select
              label="クラス"
              value={newClassName}
              onChange={(e) => setNewClassName(e.target.value as ClassType)}
              options={CLASSES.map((name) => ({
                value: name,
                label: name,
              }))}
            />
            <Input
              label="デッキ名"
              value={newDeckName}
              onChange={(e) => setNewDeckName(e.target.value)}
              placeholder="例: コンボエルフ"
            />
            <Input
              label="説明（任意）"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="デッキの説明"
            />
            <Input
              label="表示順序（任意）"
              type="number"
              value={newDisplayOrder}
              onChange={(e) => setNewDisplayOrder(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="数値が小さいほど上に表示"
            />
          </div>
          <div className="mt-4">
            <Button onClick={handleCreateTemplate}>作成</Button>
          </div>
        </div>

        {/* Templates list */}
        <div className="space-y-6">
          {Object.keys(groupedTemplates)
            .sort()
            .reverse()
            .map((seasonName) => (
              <div key={seasonName} className="glass-card rounded-xl p-8">
                <h2 className="text-xl font-semibold text-slate-100 mb-4">{seasonName}</h2>
                {Object.keys(groupedTemplates[seasonName])
                  .sort()
                  .map((className) => (
                    <div key={className} className="mb-6 last:mb-0">
                      <h3 className="text-lg font-medium text-slate-200 mb-3 border-b border-white/10 pb-2">
                        {className}
                      </h3>
                      <div className="space-y-2">
                        {groupedTemplates[seasonName][className as ClassType].map((template) => (
                          <div
                            key={template.id}
                            className={`flex items-center justify-between p-3 rounded-md border ${
                              template.isActive
                                ? 'glass border-white/10'
                                : 'glass border-white/5 opacity-60'
                            }`}
                          >
                            {editingId === template.id ? (
                              // Edit mode
                              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                                <Input
                                  label="デッキ名"
                                  value={editDeckName}
                                  onChange={(e) => setEditDeckName(e.target.value)}
                                />
                                <Input
                                  label="説明"
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                />
                                <Input
                                  label="表示順序"
                                  type="number"
                                  value={editDisplayOrder}
                                  onChange={(e) =>
                                    setEditDisplayOrder(e.target.value === '' ? '' : Number(e.target.value))
                                  }
                                />
                              </div>
                            ) : (
                              // View mode
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <span className="font-medium text-slate-200">
                                    {template.deckName}
                                  </span>
                                  {template.displayOrder !== undefined && (
                                    <span className="text-xs text-slate-500">
                                      (順序: {template.displayOrder})
                                    </span>
                                  )}
                                  {!template.isActive && (
                                    <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded">
                                      非アクティブ
                                    </span>
                                  )}
                                </div>
                                {template.description && (
                                  <p className="text-sm text-slate-400 mt-1">
                                    {template.description}
                                  </p>
                                )}
                              </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center space-x-2 ml-4">
                              {editingId === template.id ? (
                                <>
                                  <Button
                                    onClick={() => handleSaveEdit(template)}
                                    variant="primary"
                                    size="sm"
                                  >
                                    保存
                                  </Button>
                                  <Button
                                    onClick={handleCancelEdit}
                                    variant="secondary"
                                    size="sm"
                                  >
                                    キャンセル
                                  </Button>
                                </>
                              ) : (
                                <>
                                  <Button
                                    onClick={() => handleStartEdit(template)}
                                    variant="secondary"
                                    size="sm"
                                  >
                                    編集
                                  </Button>
                                  <Button
                                    onClick={() => handleToggleActive(template)}
                                    variant="secondary"
                                    size="sm"
                                  >
                                    {template.isActive ? '無効化' : '有効化'}
                                  </Button>
                                  <Button
                                    onClick={() => handleDeleteTemplate(template)}
                                    variant="danger"
                                    size="sm"
                                  >
                                    削除
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
            ))}

          {Object.keys(groupedTemplates).length === 0 && (
            <div className="glass-card rounded-xl p-8 text-center text-slate-400">
              まだテンプレートが登録されていません
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
