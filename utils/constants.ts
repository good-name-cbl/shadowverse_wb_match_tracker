import { ClassType } from '@/types';

export const CLASSES: ClassType[] = [
  'エルフ',
  'ロイヤル',
  'ウィッチ',
  'ドラゴン',
  'ナイトメア',
  'ビショップ',
  'ネメシス'
];

export const CLASS_COLORS: Record<ClassType, string> = {
  'エルフ': 'bg-green-500',
  'ロイヤル': 'bg-yellow-500',
  'ウィッチ': 'bg-purple-500',
  'ドラゴン': 'bg-red-500',
  'ナイトメア': 'bg-gray-800',
  'ビショップ': 'bg-blue-500',
  'ネメシス': 'bg-indigo-500'
};

export const WINRATE_COLORS = {
  high: 'text-green-600',
  medium: 'text-yellow-600',
  low: 'text-red-600'
};

export const getWinRateColor = (winRate: number): string => {
  if (winRate >= 60) return WINRATE_COLORS.high;
  if (winRate >= 40) return WINRATE_COLORS.medium;
  return WINRATE_COLORS.low;
};
