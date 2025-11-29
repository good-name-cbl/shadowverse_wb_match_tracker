import { ClassType, DeckTemplate as DeckTemplateModel } from '@/types';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const client = generateClient<Schema>();

/**
 * SeasonのtemplatesフィールドからDeckTemplate[]を取得するヘルパー
 */
function getTemplatesFromSeason(season: any): DeckTemplateModel[] {
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

/**
 * データベースから指定シーズン・クラスのアクティブなデッキテンプレートを取得
 * データがない場合は空配列を返す
 */
export async function fetchDeckTemplates(
  seasonId: string | null,
  className: ClassType
): Promise<string[]> {
  // シーズンIDがない場合は空配列を返す
  if (!seasonId) {
    return [];
  }

  try {
    // Seasonを取得（publicApiKeyで認証不要）
    const { data: seasonData } = await client.models.Season.get(
      { id: seasonId },
      { authMode: 'apiKey' }
    );

    if (!seasonData) {
      // Seasonが見つからない場合は空配列を返す
      return [];
    }

    // templatesフィールドからDeckTemplate[]を取得
    const allTemplates = getTemplatesFromSeason(seasonData);

    // 指定されたclassNameでフィルタリングし、isActive: trueのみ
    const classTemplates = allTemplates.filter(
      (t) => t.className === className && t.isActive
    );

    if (classTemplates.length === 0) {
      // データがない場合は空配列を返す
      return [];
    }

    // displayOrderでソート、指定がない場合は名前順
    const sortedTemplates = [...classTemplates].sort((a, b) => {
      if (a.displayOrder !== undefined && a.displayOrder !== null &&
          b.displayOrder !== undefined && b.displayOrder !== null) {
        return a.displayOrder - b.displayOrder;
      }
      if (a.displayOrder !== undefined && a.displayOrder !== null) return -1;
      if (b.displayOrder !== undefined && b.displayOrder !== null) return 1;
      return a.deckName.localeCompare(b.deckName);
    });

    return sortedTemplates.map((t) => t.deckName);
  } catch (error) {
    console.error('テンプレートの取得に失敗しました:', error);
    // エラー時は空配列を返す
    return [];
  }
}
