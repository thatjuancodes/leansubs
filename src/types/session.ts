/**
 * Session Data Model
 * 
 * Sessions track when members use their credits.
 * Keep this consistent when migrating to Supabase or PostgreSQL.
 */

export interface Session {
  id: string
  userId: string // Owner of the record (business owner)
  memberId: string // Reference to the member
  
  // Session Details
  startTime: string // ISO datetime string (when the session started)
  endTime?: string // ISO datetime string (when the session ended) - optional
  timestamp: string // Deprecated: kept for backward compatibility, maps to startTime
  status: SessionStatus
  creditsUsed: number // Number of credits deducted (default: 1)
  
  // Additional Info
  notes?: string
  
  // Metadata
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

export type SessionStatus = 
  | 'unverified'
  | 'verified'

export interface CreateSessionInput {
  memberId: string
  startTime: string
  endTime?: string
  creditsUsed?: number // Default: 1
  notes?: string
}

export interface UpdateSessionInput {
  id: string
  startTime?: string
  endTime?: string
  status?: SessionStatus
  creditsUsed?: number
  notes?: string
}

export interface SessionFilters {
  memberId?: string
  status?: SessionStatus
  startDate?: string // Filter sessions from this date
  endDate?: string // Filter sessions to this date
}

export interface SessionWithMember extends Session {
  memberName: string
  memberEmail: string
}

/**
 * Database schema reference for future migration
 * 
 * PostgreSQL/Supabase Table: sessions
 * 
 * CREATE TABLE sessions (
 *   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
 *   user_id UUID NOT NULL REFERENCES auth.users(id),
 *   member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
 *   start_time TIMESTAMP WITH TIME ZONE NOT NULL,
 *   end_time TIMESTAMP WITH TIME ZONE,
 *   status VARCHAR(50) NOT NULL DEFAULT 'unverified',
 *   credits_used INTEGER NOT NULL DEFAULT 1,
 *   notes TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * CREATE INDEX idx_sessions_user_id ON sessions(user_id);
 * CREATE INDEX idx_sessions_member_id ON sessions(member_id);
 * CREATE INDEX idx_sessions_status ON sessions(status);
 * CREATE INDEX idx_sessions_start_time ON sessions(start_time);
 */

