/**
 * Session Service
 * 
 * Handles CRUD operations for session records.
 * Uses localStorage for now, can be replaced with Supabase/PostgreSQL later.
 */

import type { 
  Session, 
  CreateSessionInput, 
  UpdateSessionInput, 
  SessionFilters,
  SessionWithMember 
} from '@/types/session'
import type { Member } from '@/types/member'

const STORAGE_KEY = 'leansubs_sessions'
const MEMBERS_STORAGE_KEY = 'leansubs_members'

function getSessions(): Session[] {
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveSessions(sessions: Session[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

function getMembers(): Member[] {
  const data = localStorage.getItem(MEMBERS_STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

function saveMembers(members: Member[]): void {
  localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members))
}

export const sessionService = {
  /**
   * Create a new session record and deduct credits from member
   */
  async create(userId: string, input: CreateSessionInput): Promise<Session> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const sessions = getSessions()
          const members = getMembers()

          // Find the member
          const memberIndex = members.findIndex(m => m.id === input.memberId && m.userId === userId)
          if (memberIndex === -1) {
            reject(new Error('Member not found'))
            return
          }

          const member = members[memberIndex]
          const creditsToUse = input.creditsUsed || 1

          // Check if member has enough credits
          if (member.credits < creditsToUse) {
            reject(new Error(`Insufficient credits. Member has ${member.credits} credit(s) available.`))
            return
          }

          // Create the session
          const newSession: Session = {
            id: crypto.randomUUID(),
            userId,
            memberId: input.memberId,
            startTime: input.startTime,
            endTime: input.endTime,
            timestamp: input.startTime, // For backward compatibility
            status: 'unverified', // Default status
            creditsUsed: creditsToUse,
            notes: input.notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }

          // Deduct credits from member
          members[memberIndex].credits -= creditsToUse
          members[memberIndex].updatedAt = new Date().toISOString()

          // Save both
          sessions.push(newSession)
          saveSessions(sessions)
          saveMembers(members)

          resolve(newSession)
        } catch (error) {
          reject(error)
        }
      }, 300) // Simulate network delay
    })
  },

  /**
   * Get all sessions for a user with optional filters
   */
  async getAll(userId: string, filters?: SessionFilters): Promise<SessionWithMember[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let sessions = getSessions().filter(s => s.userId === userId)
        const members = getMembers()

        // Migrate old sessions without startTime
        sessions = sessions.map(s => {
          if (!s.startTime && s.timestamp) {
            return { ...s, startTime: s.timestamp }
          }
          return s
        })

        // Apply filters
        if (filters?.memberId) {
          sessions = sessions.filter(s => s.memberId === filters.memberId)
        }

        if (filters?.status) {
          sessions = sessions.filter(s => s.status === filters.status)
        }

        if (filters?.startDate) {
          sessions = sessions.filter(s => (s.startTime || s.timestamp) >= filters.startDate!)
        }

        if (filters?.endDate) {
          sessions = sessions.filter(s => (s.startTime || s.timestamp) <= filters.endDate!)
        }

        // Enrich with member data
        const sessionsWithMembers: SessionWithMember[] = sessions.map(session => {
          const member = members.find(m => m.id === session.memberId)
          return {
            ...session,
            memberName: member?.fullName || 'Unknown Member',
            memberEmail: member?.email || '',
          }
        })

        // Sort by startTime descending (newest first)
        sessionsWithMembers.sort((a, b) => 
          new Date(b.startTime || b.timestamp).getTime() - new Date(a.startTime || a.timestamp).getTime()
        )

        resolve(sessionsWithMembers)
      }, 300)
    })
  },

  /**
   * Get a single session by ID
   */
  async getById(id: string, userId: string): Promise<Session | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessions = getSessions()
        const session = sessions.find(s => s.id === id && s.userId === userId)
        resolve(session || null)
      }, 100)
    })
  },

  /**
   * Update a session (e.g., verify it, change timestamp, etc.)
   */
  async update(input: UpdateSessionInput, userId: string): Promise<Session> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const sessions = getSessions()
          const sessionIndex = sessions.findIndex(
            s => s.id === input.id && s.userId === userId
          )

          if (sessionIndex === -1) {
            reject(new Error('Session not found'))
            return
          }

          const session = sessions[sessionIndex]

          // Update fields
          if (input.startTime !== undefined) {
            session.startTime = input.startTime
            session.timestamp = input.startTime // Keep backward compatibility
          }
          if (input.endTime !== undefined) session.endTime = input.endTime
          if (input.status !== undefined) session.status = input.status
          if (input.creditsUsed !== undefined) {
            // If credits used changed, we need to adjust member credits
            const oldCredits = session.creditsUsed
            const newCredits = input.creditsUsed
            const creditDiff = newCredits - oldCredits

            if (creditDiff !== 0) {
              const members = getMembers()
              const memberIndex = members.findIndex(m => m.id === session.memberId)
              
              if (memberIndex !== -1) {
                members[memberIndex].credits -= creditDiff
                members[memberIndex].updatedAt = new Date().toISOString()
                saveMembers(members)
              }
            }

            session.creditsUsed = newCredits
          }
          if (input.notes !== undefined) session.notes = input.notes

          session.updatedAt = new Date().toISOString()

          sessions[sessionIndex] = session
          saveSessions(sessions)

          resolve(session)
        } catch (error) {
          reject(error)
        }
      }, 300)
    })
  },

  /**
   * Verify a session (shortcut for updating status to verified)
   */
  async verify(id: string, userId: string): Promise<Session> {
    return this.update({ id, status: 'verified' }, userId)
  },

  /**
   * Delete a session and refund credits to member
   */
  async delete(id: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        try {
          const sessions = getSessions()
          const sessionIndex = sessions.findIndex(
            s => s.id === id && s.userId === userId
          )

          if (sessionIndex === -1) {
            reject(new Error('Session not found'))
            return
          }

          const session = sessions[sessionIndex]

          // Refund credits to member
          const members = getMembers()
          const memberIndex = members.findIndex(m => m.id === session.memberId)
          
          if (memberIndex !== -1) {
            members[memberIndex].credits += session.creditsUsed
            members[memberIndex].updatedAt = new Date().toISOString()
            saveMembers(members)
          }

          // Remove session
          sessions.splice(sessionIndex, 1)
          saveSessions(sessions)

          resolve()
        } catch (error) {
          reject(error)
        }
      }, 300)
    })
  },

  /**
   * Get session statistics for a user
   */
  async getStats(userId: string): Promise<{
    total: number
    unverified: number
    verified: number
    totalCreditsUsed: number
  }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sessions = getSessions().filter(s => s.userId === userId)

        const stats = {
          total: sessions.length,
          unverified: sessions.filter(s => s.status === 'unverified').length,
          verified: sessions.filter(s => s.status === 'verified').length,
          totalCreditsUsed: sessions.reduce((sum, s) => sum + s.creditsUsed, 0),
        }

        resolve(stats)
      }, 100)
    })
  },

  /**
   * Get sessions for a specific member
   */
  async getByMemberId(memberId: string, userId: string): Promise<SessionWithMember[]> {
    return this.getAll(userId, { memberId })
  },
}

/**
 * TODO: Replace with Supabase/PostgreSQL
 * 
 * Example Supabase implementation:
 * 
 * async create(userId: string, input: CreateSessionInput): Promise<Session> {
 *   const { data: member } = await supabase
 *     .from('members')
 *     .select('credits')
 *     .eq('id', input.memberId)
 *     .eq('user_id', userId)
 *     .single()
 *   
 *   if (member.credits < (input.creditsUsed || 1)) {
 *     throw new Error('Insufficient credits')
 *   }
 *   
 *   // Start transaction
 *   const { data: session, error: sessionError } = await supabase
 *     .from('sessions')
 *     .insert({
 *       user_id: userId,
 *       member_id: input.memberId,
 *       timestamp: input.timestamp,
 *       credits_used: input.creditsUsed || 1,
 *       notes: input.notes,
 *     })
 *     .select()
 *     .single()
 *   
 *   if (sessionError) throw sessionError
 *   
 *   // Deduct credits
 *   const { error: updateError } = await supabase
 *     .from('members')
 *     .update({ credits: member.credits - (input.creditsUsed || 1) })
 *     .eq('id', input.memberId)
 *   
 *   if (updateError) throw updateError
 *   
 *   return session
 * }
 */

