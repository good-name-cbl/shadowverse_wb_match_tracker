import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MatchForm } from '../MatchForm'
import { ClassType } from '@/types'

describe('MatchForm', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const defaultProps = {
    onSubmit: mockOnSubmit,
    selectedDeckId: 'deck1',
    currentSeasonId: 'season1',
  }

  it('should render all form elements', () => {
    render(<MatchForm {...defaultProps} />)

    expect(screen.getByText('相手クラス')).toBeInTheDocument()
    expect(screen.getByLabelText('相手デッキタイプ')).toBeInTheDocument()
    expect(screen.getByText('先攻/後攻')).toBeInTheDocument()
    expect(screen.getByText('結果')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '記録' })).toBeInTheDocument()
  })

  it('should render disabled state when no deck is selected', () => {
    render(<MatchForm {...defaultProps} selectedDeckId={null} currentSeasonId="season1" />)

    const submitButton = screen.getByRole('button', { name: '記録' })
    expect(submitButton).toBeDisabled()
    expect(screen.getByText('デッキを選択してください')).toBeInTheDocument()
  })

  it('should submit form with correct values', async () => {
    const user = userEvent.setup()
    render(<MatchForm {...defaultProps} />)

    // Select opponent class (エルフ button)
    const elfButton = screen.getByRole('button', { name: 'エルフ' })
    await user.click(elfButton)

    // Enter opponent deck type
    const deckTypeInput = screen.getByLabelText('相手デッキタイプ')
    await user.type(deckTypeInput, 'アグロエルフ')

    // Select first player
    const firstPlayerButton = screen.getByRole('button', { name: '先攻' })
    await user.click(firstPlayerButton)

    // Select win
    const winButton = screen.getByRole('button', { name: '勝ち' })
    await user.click(winButton)

    // Submit form
    const submitButton = screen.getByRole('button', { name: '記録' })
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith({
      myDeckId: 'deck1',
      seasonId: 'season1',
      opponentClass: 'エルフ',
      opponentDeckType: 'アグロエルフ',
      isFirstPlayer: true,
      isWin: true,
    })
  })

  it('should reset form after submission', async () => {
    const user = userEvent.setup()
    render(<MatchForm {...defaultProps} />)

    // Fill and submit form
    await user.click(screen.getByRole('button', { name: 'ロイヤル' }))
    await user.type(screen.getByLabelText('相手デッキタイプ'), 'ミッドレンジ')
    await user.click(screen.getByRole('button', { name: '後攻' }))
    await user.click(screen.getByRole('button', { name: '負け' }))
    await user.click(screen.getByRole('button', { name: '記録' }))

    // Check that form is reset
    await waitFor(() => {
      const deckTypeInput = screen.getByLabelText('相手デッキタイプ') as HTMLInputElement
      expect(deckTypeInput.value).toBe('')
    })

    // Check that no class is selected (all buttons should not have selected styling)
    const classButtons = screen.getAllByRole('button')
    const selectedButtons = classButtons.filter(btn =>
      btn.className.includes('bg-blue-500') || btn.className.includes('ring-2')
    )
    // Only the default selected turn and result buttons should have selection styling
    expect(selectedButtons.length).toBeLessThanOrEqual(2)
  })

  it('should show all class options', () => {
    render(<MatchForm {...defaultProps} />)

    const classes: ClassType[] = ['エルフ', 'ロイヤル', 'ウィッチ', 'ドラゴン', 'ナイトメア', 'ビショップ', 'ネメシス']

    classes.forEach(className => {
      expect(screen.getByRole('button', { name: className })).toBeInTheDocument()
    })
  })

  it('should toggle first player selection', async () => {
    const user = userEvent.setup()
    render(<MatchForm {...defaultProps} />)

    const firstPlayerButton = screen.getByRole('button', { name: '先攻' })
    const secondPlayerButton = screen.getByRole('button', { name: '後攻' })

    // Default is first player
    expect(firstPlayerButton.className).toContain('ring-2')
    expect(secondPlayerButton.className).not.toContain('ring-2')

    // Click second player
    await user.click(secondPlayerButton)

    expect(firstPlayerButton.className).not.toContain('ring-2')
    expect(secondPlayerButton.className).toContain('ring-2')

    // Click first player again
    await user.click(firstPlayerButton)

    expect(firstPlayerButton.className).toContain('ring-2')
    expect(secondPlayerButton.className).not.toContain('ring-2')
  })

  it('should toggle win/loss selection', async () => {
    const user = userEvent.setup()
    render(<MatchForm {...defaultProps} />)

    const winButton = screen.getByRole('button', { name: '勝ち' })
    const lossButton = screen.getByRole('button', { name: '負け' })

    // Default is win
    expect(winButton.className).toContain('ring-2')
    expect(lossButton.className).not.toContain('ring-2')

    // Click loss
    await user.click(lossButton)

    expect(winButton.className).not.toContain('ring-2')
    expect(lossButton.className).toContain('ring-2')

    // Click win again
    await user.click(winButton)

    expect(winButton.className).toContain('ring-2')
    expect(lossButton.className).not.toContain('ring-2')
  })

  it('should require opponent class selection', async () => {
    const user = userEvent.setup()
    render(<MatchForm {...defaultProps} />)

    // Fill everything except opponent class
    await user.type(screen.getByLabelText('相手デッキタイプ'), 'テストデッキ')
    await user.click(screen.getByRole('button', { name: '先攻' }))
    await user.click(screen.getByRole('button', { name: '勝ち' }))

    // Try to submit
    const submitButton = screen.getByRole('button', { name: '記録' })
    await user.click(submitButton)

    // Should not have been called without opponent class
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should handle empty deck type', async () => {
    const user = userEvent.setup()
    render(<MatchForm {...defaultProps} />)

    // Select class but leave deck type empty
    await user.click(screen.getByRole('button', { name: 'ウィッチ' }))
    await user.click(screen.getByRole('button', { name: '先攻' }))
    await user.click(screen.getByRole('button', { name: '勝ち' }))

    // Submit form
    await user.click(screen.getByRole('button', { name: '記録' }))

    expect(mockOnSubmit).toHaveBeenCalledWith({
      myDeckId: 'deck1',
      seasonId: 'season1',
      opponentClass: 'ウィッチ',
      opponentDeckType: '',
      isFirstPlayer: true,
      isWin: true,
    })
  })

  it('should apply correct styles to selected class button', async () => {
    const user = userEvent.setup()
    render(<MatchForm {...defaultProps} />)

    const dragonButton = screen.getByRole('button', { name: 'ドラゴン' })

    // Initially not selected
    expect(dragonButton.className).not.toContain('bg-red-500')

    // Click to select
    await user.click(dragonButton)

    // Should have selected styles
    expect(dragonButton.className).toContain('bg-red-500')
  })
})