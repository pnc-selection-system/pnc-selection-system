import type { AuthResponse, LoginPayload } from '../types/auth'

class AuthService {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const email = payload.email.trim().toLowerCase()
    const password = payload.password

    if (!email || !password) {
      throw new Error('Email and password are required')
    }

    if (email === 'admin@example.com' && password === '123456') {
      return {
        user: {
          id: '1',
          email,
          name: 'Admin User',
          role: 'admin',
        },
        token: 'mock-admin-token',
      }
    }

    if (email === 'user@example.com' && password === '123456') {
      return {
        user: {
          id: '2',
          email,
          name: 'Regular User',
          role: 'user',
        },
        token: 'mock-user-token',
      }
    }

    throw new Error('Invalid email or password')
  }

  logout(): void {
    // no-op placeholder for future backend integration
  }
}

export const authService = new AuthService()
