import { CLASSES, CLASS_COLORS, getWinRateColor, WINRATE_COLORS } from '../constants'
import { ClassType } from '@/types'

describe('constants', () => {
  describe('CLASSES', () => {
    it('should contain all 7 Shadowverse classes', () => {
      expect(CLASSES).toHaveLength(7)
      expect(CLASSES).toContain('エルフ')
      expect(CLASSES).toContain('ロイヤル')
      expect(CLASSES).toContain('ウィッチ')
      expect(CLASSES).toContain('ドラゴン')
      expect(CLASSES).toContain('ナイトメア')
      expect(CLASSES).toContain('ビショップ')
      expect(CLASSES).toContain('ネメシス')
    })

    it('should be of type ClassType array', () => {
      CLASSES.forEach(cls => {
        const validClasses: ClassType[] = ['エルフ', 'ロイヤル', 'ウィッチ', 'ドラゴン', 'ナイトメア', 'ビショップ', 'ネメシス']
        expect(validClasses).toContain(cls)
      })
    })
  })

  describe('CLASS_COLORS', () => {
    it('should have colors for all classes', () => {
      CLASSES.forEach(cls => {
        expect(CLASS_COLORS[cls]).toBeDefined()
        expect(CLASS_COLORS[cls]).toMatch(/^bg-[a-z]+-\d{3}$/) // Tailwind bg-color format
      })
    })

    it('should have unique colors for each class', () => {
      const colors = Object.values(CLASS_COLORS)
      const uniqueColors = new Set(colors)
      expect(uniqueColors.size).toBe(colors.length)
    })

    it('should have correct color assignments', () => {
      expect(CLASS_COLORS['エルフ']).toBe('bg-green-500')
      expect(CLASS_COLORS['ロイヤル']).toBe('bg-yellow-500')
      expect(CLASS_COLORS['ウィッチ']).toBe('bg-purple-500')
      expect(CLASS_COLORS['ドラゴン']).toBe('bg-red-500')
      expect(CLASS_COLORS['ナイトメア']).toBe('bg-gray-800')
      expect(CLASS_COLORS['ビショップ']).toBe('bg-blue-500')
      expect(CLASS_COLORS['ネメシス']).toBe('bg-indigo-500')
    })
  })

  describe('WINRATE_COLORS', () => {
    it('should have colors for all win rate ranges', () => {
      expect(WINRATE_COLORS.high).toBe('text-green-600')
      expect(WINRATE_COLORS.medium).toBe('text-yellow-600')
      expect(WINRATE_COLORS.low).toBe('text-red-600')
    })
  })

  describe('getWinRateColor', () => {
    it('should return high color for win rate >= 60', () => {
      expect(getWinRateColor(60)).toBe('text-green-600')
      expect(getWinRateColor(75)).toBe('text-green-600')
      expect(getWinRateColor(100)).toBe('text-green-600')
    })

    it('should return medium color for win rate >= 40 and < 60', () => {
      expect(getWinRateColor(40)).toBe('text-yellow-600')
      expect(getWinRateColor(50)).toBe('text-yellow-600')
      expect(getWinRateColor(59.9)).toBe('text-yellow-600')
    })

    it('should return low color for win rate < 40', () => {
      expect(getWinRateColor(0)).toBe('text-red-600')
      expect(getWinRateColor(25)).toBe('text-red-600')
      expect(getWinRateColor(39.9)).toBe('text-red-600')
    })

    it('should handle edge cases', () => {
      expect(getWinRateColor(-10)).toBe('text-red-600')
      expect(getWinRateColor(110)).toBe('text-green-600')
    })
  })
})