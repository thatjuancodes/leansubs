/**
 * Member Data Model
 * 
 * This is the core data structure for member records.
 * Keep this consistent when migrating to Supabase or PostgreSQL.
 */

export interface Member {
  id: string
  userId: string // Owner of the record (business owner)
  
  // Personal Information
  fullName: string
  email: string
  phone?: string
  
  // Membership Details
  membershipType: MembershipType
  status: MembershipStatus
  startDate: string // ISO date string
  endDate: string // ISO date string
  
  // Additional Info
  notes?: string
  
  // Metadata
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export type MembershipType = 
  | 'basic'
  | 'standard'
  | 'premium'
  | 'basic-annual'
  | 'standard-annual'
  | 'premium-annual'

export type MembershipStatus = 
  | 'active'
  | 'expired'
  | 'cancelled'
  | 'paused'

export interface CreateMemberInput {
  fullName: string
  email: string
  phone?: string
  membershipType: MembershipType
  status: MembershipStatus
  startDate: string
  endDate: string
  notes?: string
}

export interface UpdateMemberInput {
  id: string
  fullName?: string
  email?: string
  phone?: string
  membershipType?: MembershipType
  status?: MembershipStatus
  startDate?: string
  endDate?: string
  notes?: string
}

export interface MemberFilters {
  status?: MembershipStatus
  membershipType?: MembershipType
  search?: string // Search by name or email
}

/**
 * Database schema reference for future migration
 * 
 * PostgreSQL/Supabase Table: members
 * 
 * CREATE TABLE members (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID NOT NULL REFERENCES auth.users(id),
 *   full_name VARCHAR(255) NOT NULL,
 *   email VARCHAR(255) NOT NULL,
 *   phone VARCHAR(50),
 *   membership_type VARCHAR(50) NOT NULL,
 *   status VARCHAR(50) NOT NULL,
 *   start_date DATE NOT NULL,
 *   end_date DATE NOT NULL,
 *   notes TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_members_user_id ON members(user_id);
 * CREATE INDEX idx_members_status ON members(status);
 * CREATE INDEX idx_members_email ON members(email);
 */

