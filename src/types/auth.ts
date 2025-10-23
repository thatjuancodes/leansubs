export interface User {
  id: string
  email: string
  name: string
  businessName: string
  createdAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  name: string
  businessName: string
  email: string
  password: string
}

export interface AuthError {
  message: string
  code?: string
}

