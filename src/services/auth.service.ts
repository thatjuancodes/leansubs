import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'

/**
 * Mock Authentication Service
 * 
 * This is a simple mock implementation with a static user.
 * Replace this with Supabase or PostgreSQL integration later.
 * 
 * Static credentials:
 * Email: admin@test.com
 * Password: admin
 */

// Mock user data
const MOCK_USER: User = {
  id: '1',
  email: 'admin@test.com',
  name: 'Admin User',
  businessName: 'Demo Fitness',
  createdAt: new Date().toISOString(),
}

// Simulate API delay
function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class AuthService {
  private readonly STORAGE_KEY = 'leansubs_auth_token'
  private readonly USER_KEY = 'leansubs_user'

  /**
   * Login with email and password
   * TODO: Replace with Supabase auth.signInWithPassword() or PostgreSQL query
   */
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    await delay()

    // Mock authentication - check static credentials
    if (email === 'admin@test.com' && password === 'admin') {
      const token = this.generateMockToken()
      
      // Store auth data
      localStorage.setItem(this.STORAGE_KEY, token)
      localStorage.setItem(this.USER_KEY, JSON.stringify(MOCK_USER))

      return {
        user: MOCK_USER,
        token,
      }
    }

    throw new Error('Invalid email or password')
  }

  /**
   * Register a new user
   * TODO: Replace with Supabase auth.signUp() or PostgreSQL insert
   */
  async register(_credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay()

    // For now, mock registration always succeeds and returns the admin user
    // In production, this would create a new user in the database
    const token = this.generateMockToken()
    
    localStorage.setItem(this.STORAGE_KEY, token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(MOCK_USER))

    return {
      user: MOCK_USER,
      token,
    }
  }

  /**
   * Logout the current user
   * TODO: Replace with Supabase auth.signOut()
   */
  async logout(): Promise<void> {
    await delay(200)
    
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.USER_KEY)
  }

  /**
   * Get the current user from storage
   * TODO: Replace with Supabase auth.getUser() or PostgreSQL query
   */
  getCurrentUser(): User | null {
    const userJson = localStorage.getItem(this.USER_KEY)
    if (!userJson) return null

    try {
      return JSON.parse(userJson)
    } catch {
      return null
    }
  }

  /**
   * Get the auth token
   */
  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser()
  }

  /**
   * Generate a mock JWT token
   * In production, this comes from your backend/Supabase
   */
  private generateMockToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}

// Export singleton instance
export const authService = new AuthService()

