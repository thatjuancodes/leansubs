import type { Organization } from './organization'

export interface User {
  id: string
  email: string
  name: string
  createdAt: string
  currentOrganizationId?: string // The currently selected organization
}

export interface AuthResponse {
  user: User
  token: string
  organization: Organization // The user's primary/first organization
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  organizationName: string // Changed from businessName to be more explicit
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

