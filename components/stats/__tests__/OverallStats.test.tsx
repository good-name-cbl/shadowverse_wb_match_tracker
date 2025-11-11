import React from 'react'
import { render, screen } from '@testing-library/react'
import { OverallStats } from '../OverallStats'
import { MatchRecord } from '@/types'

describe('OverallStats', () => {
  const mockRecords: MatchRecord[] = [
    {
      id: '1',
      userId: 'user1',
      myDeckId: 'deck1',
      seasonId: 'season1',
      opponentClass: 'エルフ',
      opponentDeckType: 'アグロ',
      isFirstPlayer: true,
      isWin: true,
      recordedAt: new Date('2024-01-01'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    {
      id: '2',
      userId: 'user1',
      myDeckId: 'deck1',
      seasonId: 'season1',
      opponentClass: 'ロイヤル',
      opponentDeckType: 'ミッドレンジ',
      isFirstPlayer: false,
      isWin: false,
      recordedAt: new Date('2024-01-02'),
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
    },
    {
      id: '3',
      userId: 'user1',
      myDeckId: 'deck1',
      seasonId: 'season1',
      opponentClass: 'ウィッチ',
      opponentDeckType: 'スペル',
      isFirstPlayer: true,
      isWin: true,
      recordedAt: new Date('2024-01-03'),
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03'),
    },
  ]

  it('should display correct statistics', () => {
    render(<OverallStats records={mockRecords} />)

    // Total games
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('試合')).toBeInTheDocument()

    // Wins
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getAllByText('勝')[0]).toBeInTheDocument()

    // Losses
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('敗')).toBeInTheDocument()

    // Win rate (2/3 = 66.7%)
    expect(screen.getByText('66.7%')).toBeInTheDocument()
  })

  it('should handle empty records', () => {
    render(<OverallStats records={[]} />)

    // All values should be 0
    expect(screen.getAllByText('0')[0]).toBeInTheDocument() // Total games
    expect(screen.getAllByText('0')[1]).toBeInTheDocument() // Wins
    expect(screen.getAllByText('0')[2]).toBeInTheDocument() // Losses
    expect(screen.getByText('0.0%')).toBeInTheDocument() // Win rate
  })

  it('should display 100% win rate when all wins', () => {
    const allWins = mockRecords.filter(r => r.isWin)
    render(<OverallStats records={allWins} />)

    expect(screen.getByText('100.0%')).toBeInTheDocument()
  })

  it('should display 0% win rate when all losses', () => {
    const allLosses = mockRecords.map(r => ({ ...r, isWin: false }))
    render(<OverallStats records={allLosses} />)

    expect(screen.getByText('0.0%')).toBeInTheDocument()
  })

  it('should apply correct color to win rate', () => {
    render(<OverallStats records={mockRecords} />)

    // Win rate is 66.7% which should use 'high' color (text-green-600)
    const winRateElement = screen.getByText('66.7%')
    expect(winRateElement.className).toContain('text-green-600')
  })

  it('should handle single record correctly', () => {
    const singleRecord = [mockRecords[0]]
    render(<OverallStats records={singleRecord} />)

    expect(screen.getByText('1')).toBeInTheDocument() // Total games
    expect(screen.getAllByText('勝')[0]).toBeInTheDocument() // Win label
    expect(screen.getByText('100.0%')).toBeInTheDocument() // Win rate
  })

  it('should calculate statistics correctly with many records', () => {
    const manyRecords = [
      ...Array(75).fill(null).map((_, i) => ({
        ...mockRecords[0],
        id: `win-${i}`,
        isWin: true,
      })),
      ...Array(25).fill(null).map((_, i) => ({
        ...mockRecords[0],
        id: `loss-${i}`,
        isWin: false,
      })),
    ]

    render(<OverallStats records={manyRecords} />)

    expect(screen.getByText('100')).toBeInTheDocument() // Total games
    expect(screen.getByText('75')).toBeInTheDocument() // Wins
    expect(screen.getByText('25')).toBeInTheDocument() // Losses
    expect(screen.getByText('75.0%')).toBeInTheDocument() // Win rate
  })

  it('should render with proper layout structure', () => {
    const { container } = render(<OverallStats records={mockRecords} />)

    // Check for grid layout
    const gridContainer = container.querySelector('.grid')
    expect(gridContainer).toBeInTheDocument()

    // Check for 4 stat cards
    const statCards = container.querySelectorAll('.bg-white')
    expect(statCards).toHaveLength(4)

    // Each card should have the expected structure
    statCards.forEach(card => {
      expect(card.querySelector('.text-2xl')).toBeInTheDocument() // Value
      expect(card.querySelector('.text-sm')).toBeInTheDocument() // Label
    })
  })
})