import type { User, AuthResponse, LoginCredentials, RegisterCredentials } from '@/types/auth'
import type { Organization } from '@/types/organization'
import { organizationService } from './organization.service'

/**
 * Mock Authentication Service
 * 
 * This is a simple mock implementation using localStorage.
 * Replace this with Supabase or PostgreSQL integration later.
 * 
 * Static credentials for testing:
 * Email: admin@test.com
 * Password: admin
 * 
 * Supabase migration notes:
 * - Replace login() with supabase.auth.signInWithPassword()
 * - Replace register() with supabase.auth.signUp()
 * - Replace logout() with supabase.auth.signOut()
 * - Replace getCurrentUser() with supabase.auth.getUser()
 */

// Simulate API delay
function delay(ms: number = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class AuthService {
  private readonly STORAGE_KEY = 'leansubs_auth_token'
  private readonly USER_KEY = 'leansubs_user'
  private readonly USERS_DB_KEY = 'leansubs_users_db'
  private readonly CURRENT_ORG_KEY = 'leansubs_current_org'

  /**
   * Login with email and password
   * 
   * Supabase migration:
   * const { data, error } = await supabase.auth.signInWithPassword({ email, password })
   * const { data: orgs } = await supabase
   *   .from('user_organizations')
   *   .select('*, organizations(*)')
   *   .eq('user_id', data.user.id)
   *   .limit(1)
   */
  async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
    await delay()

    const users = this.getUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    // Get user's first organization
    const organizations = await organizationService.getUserOrganizations(user.id)
    
    if (organizations.length === 0) {
      throw new Error('User has no organizations')
    }

    const primaryOrg = organizations[0]
    const token = this.generateMockToken()
    
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
      currentOrganizationId: primaryOrg.id,
    }

    // Store auth data
    localStorage.setItem(this.STORAGE_KEY, token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData))
    localStorage.setItem(this.CURRENT_ORG_KEY, JSON.stringify(primaryOrg))

    return {
      user: userData,
      token,
      organization: primaryOrg,
    }
  }

  /**
   * Register a new user and create their first organization
   * 
   * Supabase migration:
   * const { data: authData, error } = await supabase.auth.signUp({ email, password, data: { name } })
   * const { data: org } = await supabase
   *   .from('organizations')
   *   .insert({ name: organizationName })
   *   .select()
   *   .single()
   * await supabase
   *   .from('user_organizations')
   *   .insert({ user_id: authData.user.id, organization_id: org.id, role: 'owner' })
   */
  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    await delay()

    const users = this.getUsers()

    // Check if email already exists
    if (users.some(u => u.email === credentials.email)) {
      throw new Error('Email already registered')
    }

    // Create user
    const newUser = {
      id: this.generateId(),
      email: credentials.email,
      password: credentials.password, // In production, this would be hashed
      name: credentials.name,
      createdAt: new Date().toISOString(),
    }

    // Save user to storage
    users.push(newUser)
    localStorage.setItem(this.USERS_DB_KEY, JSON.stringify(users))

    // Create organization for the user
    const organization = await organizationService.createOrganization(
      { name: credentials.organizationName },
      newUser.id
    )

    const token = this.generateMockToken()
    
    const userData: User = {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt,
      currentOrganizationId: organization.id,
    }

    // Store auth data
    localStorage.setItem(this.STORAGE_KEY, token)
    localStorage.setItem(this.USER_KEY, JSON.stringify(userData))
    localStorage.setItem(this.CURRENT_ORG_KEY, JSON.stringify(organization))

    return {
      user: userData,
      token,
      organization,
    }
  }

  /**
   * Logout the current user
   * 
   * Supabase migration:
   * await supabase.auth.signOut()
   */
  async logout(): Promise<void> {
    await delay(200)
    
    localStorage.removeItem(this.STORAGE_KEY)
    localStorage.removeItem(this.USER_KEY)
    localStorage.removeItem(this.CURRENT_ORG_KEY)
  }

  /**
   * Get the current user from storage
   * 
   * Supabase migration:
   * const { data: { user } } = await supabase.auth.getUser()
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
   * Get the current organization
   */
  getCurrentOrganization(): Organization | null {
    const orgJson = localStorage.getItem(this.CURRENT_ORG_KEY)
    if (!orgJson) return null

    try {
      const stored = JSON.parse(orgJson)
      
      // Check if we have a UserOrganization object instead of Organization (migration)
      if (stored.organizationId && !stored.id) {
        console.warn('Migrating UserOrganization to Organization object')
        // Fetch the actual organization
        const orgs = JSON.parse(localStorage.getItem('leansubs_organizations') || '[]')
        const actualOrg = orgs.find((o: Organization) => o.id === stored.organizationId)
        
        if (actualOrg) {
          // Update storage with the correct organization
          localStorage.setItem(this.CURRENT_ORG_KEY, JSON.stringify(actualOrg))
          return actualOrg
        }
        
        // If organization not found, return null and let user re-login
        return null
      }
      
      return stored
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

  // Private helper methods
  private getUsers(): Array<{ id: string; email: string; password: string; name: string; createdAt: string }> {
    const data = localStorage.getItem(this.USERS_DB_KEY)
    return data ? JSON.parse(data) : []
  }

  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  private generateMockToken(): string {
    return `mock_token_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}

// Export singleton instance
export const authService = new AuthService()

