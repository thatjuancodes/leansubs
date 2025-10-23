# Authentication Setup Guide

## Current Implementation (Mock)

The authentication system is currently using a **mock implementation** with a static user for development. This can be easily replaced with Supabase or PostgreSQL later.

### Static Credentials
```
Email: admin@test.com
Password: admin
```

## File Structure

```
src/
├── types/
│   └── auth.ts              # TypeScript interfaces for auth
├── services/
│   └── auth.service.ts      # Auth service (replace with Supabase/PostgreSQL)
├── context/
│   └── auth.context.tsx     # React Context for auth state
├── components/
│   └── protected-route.tsx  # Protected route wrapper
└── pages/
    ├── login.tsx            # Login page
    ├── register.tsx         # Registration page
    └── dashboard.tsx        # Protected dashboard
```

## How It Works

### 1. Auth Service (`src/services/auth.service.ts`)
The auth service provides a clean interface for authentication:

```typescript
// Login
await authService.login({ email, password })

// Register
await authService.register({ name, businessName, email, password })

// Logout
await authService.logout()

// Get current user
const user = authService.getCurrentUser()

// Check if authenticated
const isAuth = authService.isAuthenticated()
```

### 2. Auth Context (`src/context/auth.context.tsx`)
React Context provides auth state across the app:

```typescript
const { user, isAuthenticated, isLoading, login, register, logout } = useAuth()
```

### 3. Protected Routes
Use the `ProtectedRoute` component to protect pages:

```typescript
<Route 
  path="/dashboard" 
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  } 
/>
```

## Replacing with Real Authentication

### Option 1: Supabase

1. **Install Supabase client:**
   ```bash
   yarn add @supabase/supabase-js
   ```

2. **Create Supabase client** (`src/lib/supabase.ts`):
   ```typescript
   import { createClient } from '@supabase/supabase-js'
   
   export const supabase = createClient(
     process.env.VITE_SUPABASE_URL!,
     process.env.VITE_SUPABASE_ANON_KEY!
   )
   ```

3. **Update auth service** (`src/services/auth.service.ts`):
   ```typescript
   import { supabase } from '@/lib/supabase'
   
   async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
     const { data, error } = await supabase.auth.signInWithPassword({
       email,
       password,
     })
     
     if (error) throw error
     
     return {
       user: {
         id: data.user.id,
         email: data.user.email!,
         name: data.user.user_metadata.name,
         businessName: data.user.user_metadata.businessName,
         createdAt: data.user.created_at,
       },
       token: data.session.access_token,
     }
   }
   
   async register(credentials: RegisterCredentials): Promise<AuthResponse> {
     const { data, error } = await supabase.auth.signUp({
       email: credentials.email,
       password: credentials.password,
       options: {
         data: {
           name: credentials.name,
           businessName: credentials.businessName,
         },
       },
     })
     
     if (error) throw error
     // ... handle response
   }
   
   async logout(): Promise<void> {
     await supabase.auth.signOut()
   }
   
   getCurrentUser(): User | null {
     // Get user from Supabase session
     const session = supabase.auth.getSession()
     // ... transform to User type
   }
   ```

### Option 2: PostgreSQL (with custom backend)

1. **Create backend API endpoints:**
   - `POST /api/auth/login`
   - `POST /api/auth/register`
   - `POST /api/auth/logout`
   - `GET /api/auth/me`

2. **Update auth service** (`src/services/auth.service.ts`):
   ```typescript
   const API_URL = import.meta.env.VITE_API_URL
   
   async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
     const response = await fetch(`${API_URL}/auth/login`, {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({ email, password }),
     })
     
     if (!response.ok) {
       throw new Error('Invalid credentials')
     }
     
     const data = await response.json()
     
     // Store token and user
     localStorage.setItem(this.STORAGE_KEY, data.token)
     localStorage.setItem(this.USER_KEY, JSON.stringify(data.user))
     
     return data
   }
   
   // Similar for register, logout, etc.
   ```

## Environment Variables

Create a `.env` file in the project root:

```env
# For Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# For custom backend
VITE_API_URL=http://localhost:8000
```

## Storage

Currently using `localStorage` for:
- `leansubs_auth_token` - JWT token
- `leansubs_user` - User data

**Note:** For production, consider using httpOnly cookies for better security.

## Features Implemented

✅ Login with email/password
✅ Registration (currently returns mock user)
✅ Logout
✅ Protected routes
✅ Auth state persistence
✅ Loading states
✅ Error handling
✅ Form validation

## Testing

Use the static credentials to test:
1. Go to `/login`
2. Enter `admin@test.com` / `admin`
3. Click "Sign in"
4. You'll be redirected to `/dashboard`

## Next Steps

1. Replace mock auth with Supabase or PostgreSQL
2. Add password reset functionality
3. Add email verification
4. Add social login (Google, etc.)
5. Implement refresh token logic
6. Add role-based access control (RBAC)

---

**Last Updated:** October 23, 2025

