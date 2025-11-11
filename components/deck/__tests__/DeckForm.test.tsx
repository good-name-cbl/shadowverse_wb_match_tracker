import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeckForm } from '../DeckForm'
import { ClassType } from '@/types'

describe('DeckForm', () => {
  const mockOnSubmit = jest.fn()
  const mockOnCancel = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render form elements correctly', () => {
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    expect(screen.getByLabelText('クラス')).toBeInTheDocument()
    expect(screen.getByLabelText('デッキ名')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'テンプレートから選択' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument()
  })

  it('should enable submit button when form is filled', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const submitButton = screen.getByRole('button', { name: '追加' })
    expect(submitButton).toBeDisabled()

    const classSelect = screen.getByLabelText('クラス')
    const deckNameInput = screen.getByLabelText('デッキ名')

    await user.selectOptions(classSelect, 'エルフ')
    await user.type(deckNameInput, 'テストデッキ')

    expect(submitButton).toBeEnabled()
  })

  it('should call onSubmit with correct values when form is submitted', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const classSelect = screen.getByLabelText('クラス')
    const deckNameInput = screen.getByLabelText('デッキ名')
    const submitButton = screen.getByRole('button', { name: '追加' })

    await user.selectOptions(classSelect, 'ロイヤル')
    await user.type(deckNameInput, '進化ロイヤル')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith('ロイヤル' as ClassType, '進化ロイヤル')
  })

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const classSelect = screen.getByLabelText('クラス') as HTMLSelectElement
    const deckNameInput = screen.getByLabelText('デッキ名') as HTMLInputElement
    const submitButton = screen.getByRole('button', { name: '追加' })

    await user.selectOptions(classSelect, 'ウィッチ')
    await user.type(deckNameInput, 'スペルウィッチ')
    await user.click(submitButton)

    expect(classSelect.value).toBe('')
    expect(deckNameInput.value).toBe('')
    expect(submitButton).toBeDisabled()
  })

  it('should call onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalledTimes(1)
  })

  it('should show/hide template selector when button is clicked', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const templateButton = screen.getByRole('button', { name: 'テンプレートから選択' })

    // Initially, template selector should not be visible
    expect(screen.queryByText('テンプレートを選択')).not.toBeInTheDocument()

    // Click to show template selector
    await user.click(templateButton)

    // Template selector should be visible
    await waitFor(() => {
      expect(screen.getByText('テンプレートを選択')).toBeInTheDocument()
    })

    // Click again to hide
    await user.click(templateButton)

    // Template selector should be hidden
    await waitFor(() => {
      expect(screen.queryByText('テンプレートを選択')).not.toBeInTheDocument()
    })
  })

  it('should fill form when template is selected', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const templateButton = screen.getByRole('button', { name: 'テンプレートから選択' })
    const classSelect = screen.getByLabelText('クラス') as HTMLSelectElement
    const deckNameInput = screen.getByLabelText('デッキ名') as HTMLInputElement

    // Open template selector
    await user.click(templateButton)

    // Select a template (this would need to be mocked properly)
    const mockTemplate = { className: 'エルフ' as ClassType, deckName: 'アグロエルフ' }

    // Simulate template selection
    fireEvent(
      window,
      new CustomEvent('templateSelected', { detail: mockTemplate })
    )

    await waitFor(() => {
      expect(classSelect.value).toBe('エルフ')
      expect(deckNameInput.value).toBe('アグロエルフ')
    })
  })

  it('should not submit form when fields are empty', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const submitButton = screen.getByRole('button', { name: '追加' })

    // Try to submit with empty fields (button should be disabled)
    expect(submitButton).toBeDisabled()

    // Fill only class
    const classSelect = screen.getByLabelText('クラス')
    await user.selectOptions(classSelect, 'ドラゴン')

    // Submit button should still be disabled
    expect(submitButton).toBeDisabled()

    // Clear class and fill only deck name
    await user.selectOptions(classSelect, '')
    const deckNameInput = screen.getByLabelText('デッキ名')
    await user.type(deckNameInput, 'テストデッキ')

    // Submit button should still be disabled
    expect(submitButton).toBeDisabled()

    // Should not have called onSubmit
    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('should trim whitespace from deck name', async () => {
    const user = userEvent.setup()
    render(<DeckForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />)

    const classSelect = screen.getByLabelText('クラス')
    const deckNameInput = screen.getByLabelText('デッキ名')
    const submitButton = screen.getByRole('button', { name: '追加' })

    await user.selectOptions(classSelect, 'ナイトメア')
    await user.type(deckNameInput, '  ハンドレスナイトメア  ')
    await user.click(submitButton)

    expect(mockOnSubmit).toHaveBeenCalledWith('ナイトメア' as ClassType, 'ハンドレスナイトメア')
  })
})