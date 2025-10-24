# Multi-Organization Schema

## Overview

The application now supports a multi-organization model where:
- **Users can belong to multiple organizations**
- **Every user must have at least one organization** (created automatically during registration)
- Users have different roles per organization: `owner`, `admin`, or `member`

## Current Implementation (localStorage)

The system is currently mocked using localStorage with these data structures:

### Users Table (`leansubs_users_db`)
```typescript
{
  id: string
  email: string
  password: string  // In production: hashed
  name: string
  createdAt: string
}
```

### Organizations Table (`leansubs_organizations`)
```typescript
{
  id: string
  name: string
  createdAt: string
  updatedAt: string
}
```

### User-Organizations Junction Table (`leansubs_user_organizations`)
```typescript
{
  userId: string
  organizationId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}
```

## Registration Flow

When a user registers:
1. User record is created
2. Organization is created with the provided organization name
3. User-Organization relationship is created with `role: 'owner'`
4. Both user and organization data are stored in the session

## Supabase Migration Guide

### 1. Database Schema

Create the following tables in Supabase:

```sql
-- Users table (extend Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Organizations table
CREATE TABLE public.organizations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User-Organization relationships
CREATE TABLE public.user_organizations (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('owner', 'admin', 'member')) NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, organization_id)
);

-- Add indexes for performance
CREATE INDEX idx_user_organizations_user_id ON public.user_organizations(user_id);
CREATE INDEX idx_user_organizations_org_id ON public.user_organizations(organization_id);
```

### 2. Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_organizations ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Organizations: Users can read organizations they belong to
CREATE POLICY "Users can read own organizations"
  ON public.organizations FOR SELECT
  USING (
    id IN (
      SELECT organization_id 
      FROM public.user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- User-Organizations: Users can read their own relationships
CREATE POLICY "Users can read own relationships"
  ON public.user_organizations FOR SELECT
  USING (user_id = auth.uid());
```

### 3. Code Migration

Replace the localStorage implementations with Supabase calls:

#### auth.service.ts - Register

```typescript
async register(credentials: RegisterCredentials): Promise<AuthResponse> {
  // 1. Create auth user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        name: credentials.name
      }
    }
  })
  
  if (authError) throw authError
  if (!authData.user) throw new Error('User creation failed')

  // 2. Create profile
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({
      id: authData.user.id,
      name: credentials.name
    })
  
  if (profileError) throw profileError

  // 3. Create organization
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({ name: credentials.organizationName })
    .select()
    .single()
  
  if (orgError) throw orgError

  // 4. Create user-organization relationship
  const { error: relError } = await supabase
    .from('user_organizations')
    .insert({
      user_id: authData.user.id,
      organization_id: org.id,
      role: 'owner'
    })
  
  if (relError) throw relError

  return {
    user: {
      id: authData.user.id,
      email: authData.user.email!,
      name: credentials.name,
      createdAt: authData.user.created_at,
      currentOrganizationId: org.id
    },
    token: authData.session!.access_token,
    organization: org
  }
}
```

#### auth.service.ts - Login

```typescript
async login({ email, password }: LoginCredentials): Promise<AuthResponse> {
  // 1. Sign in
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (authError) throw authError
  if (!authData.user) throw new Error('Login failed')

  // 2. Get user profile
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select()
    .eq('id', authData.user.id)
    .single()
  
  if (profileError) throw profileError

  // 3. Get user's organizations
  const { data: userOrgs, error: orgsError } = await supabase
    .from('user_organizations')
    .select('*, organizations(*)')
    .eq('user_id', authData.user.id)
    .limit(1)
  
  if (orgsError) throw orgsError
  if (!userOrgs.length) throw new Error('User has no organizations')

  const primaryOrg = userOrgs[0].organizations

  return {
    user: {
      id: profile.id,
      email: authData.user.email!,
      name: profile.name,
      createdAt: profile.created_at,
      currentOrganizationId: primaryOrg.id
    },
    token: authData.session!.access_token,
    organization: primaryOrg
  }
}
```

#### organization.service.ts - Get User Organizations

```typescript
async getUserOrganizations(userId: string): Promise<Organization[]> {
  const { data, error } = await supabase
    .from('user_organizations')
    .select('*, organizations(*)')
    .eq('user_id', userId)
  
  if (error) throw error
  
  return data.map(uo => uo.organizations)
}
```

## PostgreSQL Migration (Without Supabase)

For a custom PostgreSQL backend:

1. **Create the same tables** shown above
2. **Implement API endpoints** in your backend (Node.js/Express, Python/FastAPI, etc.)
3. **Replace service calls** with fetch/axios calls to your API:

```typescript
// Example: auth.service.ts
async register(credentials: RegisterCredentials): Promise<AuthResponse> {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  
  if (!response.ok) {
    throw new Error('Registration failed')
  }
  
  return response.json()
}
```

## Benefits of This Architecture

1. **Scalability**: Users can join multiple organizations
2. **Role-based access**: Different permissions per organization
3. **Clean separation**: User identity vs organization membership
4. **Easy migration**: Code is structured for database transition
5. **Flexible**: Can add features like invites, team management, etc.

## Future Enhancements

- Organization switching (users with multiple orgs)
- Invite system (invite users to organizations)
- Transfer ownership
- Organization settings and preferences
- Billing per organization

## Testing

To test the current implementation:

1. Register a new user with organization name
2. Check localStorage for:
   - `leansubs_users_db` - should contain the user
   - `leansubs_organizations` - should contain the organization
   - `leansubs_user_organizations` - should show the relationship
3. Login should retrieve both user and organization data
4. Dashboard and profile pages should display organization name

