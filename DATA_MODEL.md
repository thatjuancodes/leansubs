# LeanSubs Data Model

## Overview

This document describes the data structure for LeanSubs member records. The model is designed to be consistent across localStorage (current), Supabase, and PostgreSQL implementations.

## Member Entity

### TypeScript Interface

```typescript
interface Member {
  id: string                    // UUID (UUID in DB, generated string in localStorage)
  userId: string                // Foreign key to user/business owner
  
  // Personal Information
  fullName: string              // Member's full name
  email: string                 // Member's email (unique per user)
  phone?: string                // Optional phone number
  
  // Membership Details
  membershipType: MembershipType // Type of membership
  status: MembershipStatus      // Current membership status
  startDate: string             // ISO date string - membership start
  endDate: string               // ISO date string - membership expiration
  
  // Additional Info
  notes?: string                // Optional notes about the member
  
  // Metadata
  createdAt: string             // ISO timestamp - when record was created
  updatedAt: string             // ISO timestamp - last update
}
```

### Enums

#### MembershipType
```typescript
type MembershipType = 
  | 'basic'           // Basic monthly membership
  | 'standard'        // Standard monthly membership
  | 'premium'         // Premium monthly membership
  | 'basic-annual'    // Basic annual membership
  | 'standard-annual' // Standard annual membership
  | 'premium-annual'  // Premium annual membership
```

#### MembershipStatus
```typescript
type MembershipStatus = 
  | 'active'     // Membership is currently active
  | 'expired'    // Membership has expired
  | 'cancelled'  // Membership was cancelled
  | 'paused'     // Membership is temporarily paused
```

## Database Schema

### PostgreSQL / Supabase

```sql
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Personal Information
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  
  -- Membership Details
  membership_type VARCHAR(50) NOT NULL 
    CHECK (membership_type IN ('basic', 'standard', 'premium', 'basic-annual', 'standard-annual', 'premium-annual')),
  status VARCHAR(50) NOT NULL 
    CHECK (status IN ('active', 'expired', 'cancelled', 'paused')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  
  -- Additional Info
  notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT unique_email_per_user UNIQUE (user_id, email)
);

-- Indexes for performance
CREATE INDEX idx_members_user_id ON members(user_id);
CREATE INDEX idx_members_status ON members(status);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_membership_type ON members(membership_type);
CREATE INDEX idx_members_end_date ON members(end_date);

-- Updated timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_members_updated_at 
  BEFORE UPDATE ON members 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();
```

## Service Layer

### Current Implementation: localStorage

File: `src/services/member.service.ts`

Storage Key: `leansubs_members`

Data is stored as a JSON array of Member objects.

### Methods Available

```typescript
// Create
await memberService.create(userId, input)

// Read
await memberService.getAll(userId, filters?)
await memberService.getById(id)
await memberService.getStats(userId)

// Update
await memberService.update(input)

// Delete
await memberService.delete(id)
```

## Migration Guide

### From localStorage to Supabase

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

3. **Update member.service.ts methods:**

   ```typescript
   // Example: getAll
   async getAll(userId: string, filters?: MemberFilters): Promise<Member[]> {
     let query = supabase
       .from('members')
       .select('*')
       .eq('user_id', userId)
     
     if (filters?.status) {
       query = query.eq('status', filters.status)
     }
     
     if (filters?.search) {
       query = query.or(`full_name.ilike.%${filters.search}%,email.ilike.%${filters.search}%`)
     }
     
     const { data, error } = await query.order('created_at', { ascending: false })
     
     if (error) throw error
     return data || []
   }
   
   // Example: create
   async create(userId: string, input: CreateMemberInput): Promise<Member> {
     const { data, error } = await supabase
       .from('members')
       .insert([{
         user_id: userId,
         full_name: input.fullName,
         email: input.email,
         phone: input.phone,
         membership_type: input.membershipType,
         status: input.status,
         start_date: input.startDate,
         end_date: input.endDate,
         notes: input.notes,
       }])
       .select()
       .single()
     
     if (error) throw error
     return this.transformFromDb(data)
   }
   
   // Helper to transform snake_case to camelCase
   private transformFromDb(dbRecord: any): Member {
     return {
       id: dbRecord.id,
       userId: dbRecord.user_id,
       fullName: dbRecord.full_name,
       email: dbRecord.email,
       phone: dbRecord.phone,
       membershipType: dbRecord.membership_type,
       status: dbRecord.status,
       startDate: dbRecord.start_date,
       endDate: dbRecord.end_date,
       notes: dbRecord.notes,
       createdAt: dbRecord.created_at,
       updatedAt: dbRecord.updated_at,
     }
   }
   ```

### From localStorage to Custom API (PostgreSQL)

1. **Create API endpoints:**
   - `GET /api/members` - List all members
   - `GET /api/members/:id` - Get single member
   - `POST /api/members` - Create member
   - `PATCH /api/members/:id` - Update member
   - `DELETE /api/members/:id` - Delete member
   - `GET /api/members/stats` - Get statistics

2. **Update member.service.ts:**

   ```typescript
   const API_URL = import.meta.env.VITE_API_URL
   
   async getAll(userId: string, filters?: MemberFilters): Promise<Member[]> {
     const params = new URLSearchParams()
     if (filters?.status) params.set('status', filters.status)
     if (filters?.search) params.set('search', filters.search)
     
     const response = await fetch(`${API_URL}/members?${params}`, {
       headers: {
         'Authorization': `Bearer ${authService.getToken()}`,
       },
     })
     
     if (!response.ok) throw new Error('Failed to fetch members')
     return response.json()
   }
   ```

## Validation Rules

- **Email**: Must be valid email format, unique per user
- **Full Name**: Required, 1-255 characters
- **Phone**: Optional, if provided should match phone format
- **Membership Type**: Must be one of the valid types
- **Status**: Must be one of the valid statuses
- **Start Date**: Required, must be a valid date
- **End Date**: Required, must be after start date
- **Notes**: Optional, max 10,000 characters

## Business Logic

### Auto-expiration
Consider implementing a cron job or scheduled function to automatically update status to 'expired' when `endDate` passes.

```typescript
// Example: Check and update expired memberships
async function updateExpiredMemberships() {
  const today = new Date().toISOString().split('T')[0]
  
  await supabase
    .from('members')
    .update({ status: 'expired' })
    .eq('status', 'active')
    .lt('end_date', today)
}
```

## Future Extensions

Consider adding these fields for enhanced functionality:

```typescript
interface MemberExtended extends Member {
  // Payment tracking
  lastPaymentDate?: string
  nextPaymentDate?: string
  paymentMethod?: string
  
  // Usage tracking
  totalSessions?: number
  lastSessionDate?: string
  
  // Profile
  dateOfBirth?: string
  address?: string
  emergencyContact?: string
  emergencyPhone?: string
  
  // Health/Fitness (for gyms)
  fitnessGoals?: string[]
  medicalNotes?: string
  
  // Communication preferences
  emailOptIn?: boolean
  smsOptIn?: boolean
}
```

---

**Last Updated:** October 23, 2025
**Version:** 1.0

