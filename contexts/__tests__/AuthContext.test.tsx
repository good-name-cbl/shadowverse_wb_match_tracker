import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../AuthContext'
import { signIn, signUp, signOut, getCurrentUser, confirmSignUp } from 'aws-amplify/auth'

// Mock AWS Amplify Auth
jest.mock('aws-amplify/auth', () => ({
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  getCurrentUser: jest.fn(),
  confirmSignUp: jest.fn(),
  resetPassword: jest.fn(),
  confirmResetPassword: jest.fn(),
}))

// Test component to access auth context
const TestComponent = () => {
  const { user, isAuthenticated, login, signup, logout } = useAuth()

  return (
    <div>
      <div data-testid="authenticated">{isAuthenticated.toString()}</div>
      <div data-testid="user">{user?.email || 'no-user'}</div>
      <button onClick={() => login('test@example.com', 'password')}>Login</button>
      <button onClick={() => signup('new@example.com', 'password')}>Signup</button>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('should provide auth context to children', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('authenticated')).toBeInTheDocument()
    expect(screen.getByTestId('user')).toBeInTheDocument()
  })

  it('should initialize as not authenticated', async () => {
    ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('Not authenticated'))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should load authenticated user on mount', async () => {
    const mockUser = { userId: '123', username: 'test@example.com' }
    ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  it('should handle login successfully', async () => {
    ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('Not authenticated'))
    ;(signIn as jest.Mock).mockResolvedValue({
      isSignedIn: true,
      userId: '123',
    })

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    })

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith({
        username: 'test@example.com',
        password: 'password',
      })
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
      expect(screen.getByTestId('user')).toHaveTextContent('test@example.com')
    })
  })

  it('should handle login failure', async () => {
    ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('Not authenticated'))
    ;(signIn as jest.Mock).mockRejectedValue(new Error('Invalid credentials'))

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalled()
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should handle signup successfully', async () => {
    ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('Not authenticated'))
    ;(signUp as jest.Mock).mockResolvedValue({
      isSignUpComplete: false,
      userId: '456',
      nextStep: { signUpStep: 'CONFIRM_SIGN_UP' },
    })

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText('Signup'))

    await waitFor(() => {
      expect(signUp).toHaveBeenCalledWith({
        username: 'new@example.com',
        password: 'password',
        options: {
          userAttributes: {
            email: 'new@example.com',
          },
        },
      })
    })
  })

  it('should handle logout successfully', async () => {
    const mockUser = { userId: '123', username: 'test@example.com' }
    ;(getCurrentUser as jest.Mock).mockResolvedValue(mockUser)
    ;(signOut as jest.Mock).mockResolvedValue({})

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    })

    await user.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(signOut).toHaveBeenCalled()
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
      expect(screen.getByTestId('user')).toHaveTextContent('no-user')
    })
  })

  it('should persist user to localStorage on login', async () => {
    ;(getCurrentUser as jest.Mock).mockRejectedValue(new Error('Not authenticated'))
    ;(signIn as jest.Mock).mockResolvedValue({
      isSignedIn: true,
      userId: '123',
    })

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByText('Login'))

    await waitFor(() => {
      const storedUser = localStorage.getItem('user')
      expect(storedUser).toBeTruthy()
      const parsedUser = JSON.parse(storedUser!)
      expect(parsedUser.email).toBe('test@example.com')
    })
  })

  it('should clear localStorage on logout', async () => {
    localStorage.setItem('user', JSON.stringify({ email: 'test@example.com' }))
    ;(getCurrentUser as jest.Mock).mockResolvedValue({ userId: '123', username: 'test@example.com' })
    ;(signOut as jest.Mock).mockResolvedValue({})

    const user = userEvent.setup()

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await waitFor(() => {
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    })

    await user.click(screen.getByText('Logout'))

    await waitFor(() => {
      expect(localStorage.getItem('user')).toBeNull()
    })
  })


  it('should throw error when useAuth is used outside of AuthProvider', () => {
    // Suppress console.error for this test
    const originalError = console.error
    console.error = jest.fn()

    expect(() => {
      render(<TestComponent />)
    }).toThrow('useAuth must be used within an AuthProvider')

    console.error = originalError
  })
})