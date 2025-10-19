import { ClassType } from '@/types';

export interface DeckTemplate {
  name: string;
  archetype: 'アグロ' | 'ミッドレンジ' | 'コンボ' | 'コントロール';
  tier: 1 | 2 | 3 | 4;
}

export const DECK_TEMPLATES: Record<ClassType, DeckTemplate[]> = {
  'エルフ': [
    { name: 'リノエルフ', archetype: 'コンボ', tier: 1 },
    { name: 'エズディアエルフ', archetype: 'コントロール', tier: 2 },
    { name: 'テンポエルフ', archetype: 'アグロ', tier: 4 },
    { name: 'コンボエルフ', archetype: 'コンボ', tier: 3 },
    { name: 'ミッドレンジエルフ', archetype: 'ミッドレンジ', tier: 3 }
  ],
  'ロイヤル': [
    { name: '財宝ロイヤル', archetype: 'コンボ', tier: 1 },
    { name: 'ミッドレンジロイヤル', archetype: 'ミッドレンジ', tier: 2 },
    { name: 'アグロロイヤル', archetype: 'アグロ', tier: 3 },
    { name: '兵士ロイヤル', archetype: 'ミッドレンジ', tier: 3 },
    { name: '指揮官ロイヤル', archetype: 'ミッドレンジ', tier: 3 }
  ],
  'ウィッチ': [
    { name: 'スペルウィッチ', archetype: 'コンボ', tier: 1 },
    { name: 'ライオウィッチ', archetype: 'ミッドレンジ', tier: 2 },
    { name: '秘術ウィッチ', archetype: 'ミッドレンジ', tier: 3 },
    { name: '土の秘術ウィッチ', archetype: 'ミッドレンジ', tier: 4 },
    { name: 'スペルブーストウィッチ', archetype: 'コンボ', tier: 3 }
  ],
  'ドラゴン': [
    { name: 'ほーちゃんOTKドラゴン', archetype: 'コンボ', tier: 2 },
    { name: '疾走ドラゴン', archetype: 'ミッドレンジ', tier: 4 },
    { name: 'ランプドラゴン', archetype: 'コンボ', tier: 4 },
    { name: 'ミッドレンジドラゴン', archetype: 'ミッドレンジ', tier: 3 },
    { name: 'ディスカードドラゴン', archetype: 'コンボ', tier: 3 }
  ],
  'ナイトメア': [
    { name: 'モードナイトメア', archetype: 'コンボ', tier: 1 },
    { name: 'ミッドレンジナイトメア', archetype: 'ミッドレンジ', tier: 2 },
    { name: 'アグロナイトメア', archetype: 'アグロ', tier: 3 },
    { name: '復讐ナイトメア', archetype: 'アグロ', tier: 3 },
    { name: '自傷ナイトメア', archetype: 'ミッドレンジ', tier: 3 }
  ],
  'ビショップ': [
    { name: 'クレストビショップ', archetype: 'コントロール', tier: 1 },
    { name: '疾走ビショップ', archetype: 'ミッドレンジ', tier: 4 },
    { name: '守護ビショップ', archetype: 'コントロール', tier: 4 },
    { name: 'アミュレットビショップ', archetype: 'ミッドレンジ', tier: 3 },
    { name: '教会ビショップ', archetype: 'コントロール', tier: 3 }
  ],
  'ネメシス': [
    { name: '人形ネメシス', archetype: 'ミッドレンジ', tier: 2 },
    { name: 'アーティファクトネメシス', archetype: 'ミッドレンジ', tier: 2 },
    { name: 'リーシェナネメシス', archetype: 'コンボ', tier: 3 },
    { name: '操り人形ネメシス', archetype: 'ミッドレンジ', tier: 3 },
    { name: 'チェスネメシス', archetype: 'ミッドレンジ', tier: 4 }
  ]
};

export const getTierLabel = (tier: number): string => {
  switch (tier) {
    case 1: return 'Tier 1';
    case 2: return 'Tier 2';
    case 3: return 'Tier 3';
    case 4: return 'Tier 4';
    default: return '';
  }
};

export const getTierColor = (tier: number): string => {
  switch (tier) {
    case 1: return 'text-red-600';
    case 2: return 'text-orange-600';
    case 3: return 'text-yellow-600';
    case 4: return 'text-gray-600';
    default: return 'text-gray-600';
  }
};

export const getArchetypeColor = (archetype: string): string => {
  switch (archetype) {
    case 'アグロ': return 'bg-red-100 text-red-800';
    case 'ミッドレンジ': return 'bg-green-100 text-green-800';
    case 'コンボ': return 'bg-purple-100 text-purple-800';
    case 'コントロール': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};
