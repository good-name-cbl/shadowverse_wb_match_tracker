import { ClassType } from '@/types';

export interface DeckTemplate {
  name: string;
}

export const DECK_TEMPLATES: Record<ClassType, DeckTemplate[]> = {
  'エルフ': [
    { name: 'リノエルフ' },
    { name: 'エズディアエルフ' },
    { name: 'テンポエルフ' },
    { name: 'コンボエルフ' },
    { name: 'ミッドレンジエルフ' }
  ],
  'ロイヤル': [
    { name: '財宝ロイヤル' },
    { name: 'ミッドレンジロイヤル' },
    { name: 'アグロロイヤル' },
    { name: '兵士ロイヤル' },
    { name: '指揮官ロイヤル' }
  ],
  'ウィッチ': [
    { name: 'スペルウィッチ' },
    { name: 'ライオウィッチ' },
    { name: '秘術ウィッチ' },
    { name: '土の秘術ウィッチ' },
    { name: 'スペルブーストウィッチ' }
  ],
  'ドラゴン': [
    { name: 'ほーちゃんOTKドラゴン' },
    { name: '疾走ドラゴン' },
    { name: 'ランプドラゴン' },
    { name: 'ミッドレンジドラゴン' },
    { name: 'ディスカードドラゴン' }
  ],
  'ナイトメア': [
    { name: 'モードナイトメア' },
    { name: 'ミッドレンジナイトメア' },
    { name: 'アグロナイトメア' },
    { name: '復讐ナイトメア' },
    { name: '自傷ナイトメア' }
  ],
  'ビショップ': [
    { name: 'クレストビショップ' },
    { name: '疾走ビショップ' },
    { name: '守護ビショップ' },
    { name: 'アミュレットビショップ' },
    { name: '教会ビショップ' }
  ],
  'ネメシス': [
    { name: '人形ネメシス' },
    { name: 'アーティファクトネメシス' },
    { name: 'リーシェナネメシス' },
    { name: '操り人形ネメシス' },
    { name: 'チェスネメシス' }
  ]
};
