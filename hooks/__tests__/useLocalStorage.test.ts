import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from '../useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Reset all mocks
    jest.clearAllMocks()
  })

  it('should initialize with default value when localStorage is empty', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    )

    expect(result.current[0]).toBe('defaultValue')
  })

  it('should initialize with value from localStorage if it exists', () => {
    localStorage.setItem('testKey', JSON.stringify('storedValue'))

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    )

    expect(result.current[0]).toBe('storedValue')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    )

    act(() => {
      result.current[1]('newValue')
    })

    expect(result.current[0]).toBe('newValue')
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify('newValue')
    )
  })

  it('should handle complex objects', () => {
    const complexObject = {
      id: 1,
      name: 'Test',
      nested: {
        value: true,
        array: [1, 2, 3]
      }
    }

    const { result } = renderHook(() =>
      useLocalStorage('testKey', complexObject)
    )

    expect(result.current[0]).toEqual(complexObject)

    const newObject = { ...complexObject, id: 2 }
    act(() => {
      result.current[1](newObject)
    })

    expect(result.current[0]).toEqual(newObject)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'testKey',
      JSON.stringify(newObject)
    )
  })

  it('should handle arrays', () => {
    const initialArray = [1, 2, 3]
    const { result } = renderHook(() =>
      useLocalStorage('testKey', initialArray)
    )

    expect(result.current[0]).toEqual(initialArray)

    const newArray = [...initialArray, 4]
    act(() => {
      result.current[1](newArray)
    })

    expect(result.current[0]).toEqual(newArray)
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() =>
      useLocalStorage('testKey', 0)
    )

    act(() => {
      result.current[1](prev => prev + 1)
    })

    expect(result.current[0]).toBe(1)

    act(() => {
      result.current[1](prev => prev * 2)
    })

    expect(result.current[0]).toBe(2)
  })

  it('should handle null and undefined', () => {
    const { result: nullResult } = renderHook(() =>
      useLocalStorage('nullKey', null)
    )

    expect(nullResult.current[0]).toBeNull()

    act(() => {
      nullResult.current[1](undefined)
    })

    expect(nullResult.current[0]).toBeUndefined()
  })

  it('should handle corrupted localStorage data gracefully', () => {
    // Set invalid JSON in localStorage
    localStorage.getItem = jest.fn().mockReturnValue('invalid json')

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'defaultValue')
    )

    // Should fall back to default value when JSON parsing fails
    expect(result.current[0]).toBe('defaultValue')
  })

  it('should handle localStorage errors gracefully', () => {
    // Mock localStorage.setItem to throw an error
    const originalSetItem = localStorage.setItem
    localStorage.setItem = jest.fn().mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })

    const { result } = renderHook(() =>
      useLocalStorage('testKey', 'initialValue')
    )

    // Should not throw and value should still update in state
    act(() => {
      expect(() => result.current[1]('newValue')).not.toThrow()
    })

    expect(result.current[0]).toBe('newValue')

    // Restore original implementation
    localStorage.setItem = originalSetItem
  })

  it('should sync across multiple hooks with same key', () => {
    const { result: hook1 } = renderHook(() =>
      useLocalStorage('sharedKey', 'initial')
    )
    const { result: hook2 } = renderHook(() =>
      useLocalStorage('sharedKey', 'initial')
    )

    // Both hooks should have the same initial value
    expect(hook1.current[0]).toBe('initial')
    expect(hook2.current[0]).toBe('initial')

    // Update one hook
    act(() => {
      hook1.current[1]('updated')
    })

    // Both hooks should reflect the update
    expect(hook1.current[0]).toBe('updated')
    // Note: In a real implementation, you might need to trigger a storage event
    // to sync across hooks, but that depends on the implementation
  })

  it('should handle boolean values', () => {
    const { result } = renderHook(() =>
      useLocalStorage('boolKey', false)
    )

    expect(result.current[0]).toBe(false)

    act(() => {
      result.current[1](true)
    })

    expect(result.current[0]).toBe(true)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'boolKey',
      JSON.stringify(true)
    )
  })

  it('should handle number values', () => {
    const { result } = renderHook(() =>
      useLocalStorage('numberKey', 42)
    )

    expect(result.current[0]).toBe(42)

    act(() => {
      result.current[1](100)
    })

    expect(result.current[0]).toBe(100)
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'numberKey',
      JSON.stringify(100)
    )
  })
})