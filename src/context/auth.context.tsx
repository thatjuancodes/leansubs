import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { User, LoginCredentials, RegisterCredentials } from '@/types/auth'
import type { Organization } from '@/types/organization'
import { authService } from '@/services/auth.service'

interface AuthContextValue {
  user: User | null
  organization: Organization | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (credentials: RegisterCredentials) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [organization, setOrganization] = useState<Organization | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing auth on mount
  useEffect(() => {
    function initAuth() {
      try {
        const currentUser = authService.getCurrentUser()
        const currentOrg = authService.getCurrentOrganization()
        if (currentUser && authService.isAuthenticated()) {
          setUser(currentUser)
          setOrganization(currentOrg)
        }
      } catch (error) {
        console.error('Error initializing auth:', error)
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  async function login(credentials: LoginCredentials) {
    try {
      const response = await authService.login(credentials)
      setUser(response.user)
      setOrganization(response.organization)
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  async function register(credentials: RegisterCredentials) {
    try {
      const response = await authService.register(credentials)
      setUser(response.user)
      setOrganization(response.organization)
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  }

  async function logout() {
    try {
      await authService.logout()
      setUser(null)
      setOrganization(null)
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const value: AuthContextValue = {
    user,
    organization,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

