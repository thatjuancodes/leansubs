import type { Member, CreateMemberInput, UpdateMemberInput, MemberFilters } from '@/types/member'

/**
 * Member Service
 * 
 * Handles all member-related operations.
 * Currently uses localStorage, but designed to be easily replaced
 * with Supabase or PostgreSQL backend.
 * 
 * Migration Path:
 * 1. For Supabase: Replace methods with supabase.from('members').select/insert/update/delete
 * 2. For PostgreSQL: Replace with fetch() calls to your API endpoints
 */

class MemberService {
  private readonly STORAGE_KEY = 'leansubs_members'

  /**
   * Get all members for the current user
   * TODO: Replace with Supabase query or API call
   * 
   * Supabase example:
   * const { data, error } = await supabase
   *   .from('members')
   *   .select('*')
   *   .eq('user_id', userId)
   *   .order('created_at', { ascending: false })
   */
  async getAll(userId: string, filters?: MemberFilters): Promise<Member[]> {
    await this.delay()
    
    const members = this.loadFromStorage()
    
    // Migrate old records without credits field
    let needsMigration = false
    const migratedMembers = members.map(m => {
      if (m.credits === undefined) {
        needsMigration = true
        return { ...m, credits: 0 }
      }
      return m
    })
    
    if (needsMigration) {
      this.saveToStorage(migratedMembers)
    }
    
    let filtered = migratedMembers.filter(m => m.userId === userId)

    // Apply filters
    if (filters?.status) {
      filtered = filtered.filter(m => m.status === filters.status)
    }
    if (filters?.membershipType) {
      filtered = filtered.filter(m => m.membershipType === filters.membershipType)
    }
    if (filters?.search) {
      const search = filters.search.toLowerCase()
      filtered = filtered.filter(m => 
        m.fullName.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search)
      )
    }

    return filtered.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }

  /**
   * Get a single member by ID
   * TODO: Replace with Supabase query or API call
   * 
   * Supabase example:
   * const { data, error } = await supabase
   *   .from('members')
   *   .select('*')
   *   .eq('id', id)
   *   .single()
   */
  async getById(id: string): Promise<Member | null> {
    await this.delay()
    
    const members = this.loadFromStorage()
    return members.find(m => m.id === id) || null
  }

  /**
   * Create a new member
   * TODO: Replace with Supabase insert or API POST
   * 
   * Supabase example:
   * const { data, error } = await supabase
   *   .from('members')
   *   .insert([{
   *     user_id: userId,
   *     full_name: input.fullName,
   *     email: input.email,
   *     ...
   *   }])
   *   .select()
   *   .single()
   */
  async create(userId: string, input: CreateMemberInput): Promise<Member> {
    await this.delay()

    // Validate email uniqueness for this user
    const existing = await this.getAll(userId)
    if (existing.some(m => m.email === input.email)) {
      throw new Error('A member with this email already exists')
    }

    const now = new Date().toISOString()
    const member: Member = {
      id: this.generateId(),
      userId,
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      membershipType: input.membershipType,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate,
      credits: input.credits,
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    }

    const members = this.loadFromStorage()
    members.push(member)
    this.saveToStorage(members)

    return member
  }

  /**
   * Update an existing member
   * TODO: Replace with Supabase update or API PATCH
   * 
   * Supabase example:
   * const { data, error } = await supabase
   *   .from('members')
   *   .update({
   *     full_name: input.fullName,
   *     updated_at: new Date().toISOString(),
   *   })
   *   .eq('id', input.id)
   *   .select()
   *   .single()
   */
  async update(input: UpdateMemberInput): Promise<Member> {
    await this.delay()

    const members = this.loadFromStorage()
    const index = members.findIndex(m => m.id === input.id)

    if (index === -1) {
      throw new Error('Member not found')
    }

    // Check email uniqueness if email is being changed
    if (input.email && input.email !== members[index].email) {
      const duplicate = members.find(m => 
        m.id !== input.id && 
        m.email === input.email && 
        m.userId === members[index].userId
      )
      if (duplicate) {
        throw new Error('A member with this email already exists')
      }
    }

    const updatedMember: Member = {
      ...members[index],
      ...input,
      updatedAt: new Date().toISOString(),
    }

    members[index] = updatedMember
    this.saveToStorage(members)

    return updatedMember
  }

  /**
   * Delete a member
   * TODO: Replace with Supabase delete or API DELETE
   * 
   * Supabase example:
   * const { error } = await supabase
   *   .from('members')
   *   .delete()
   *   .eq('id', id)
   */
  async delete(id: string): Promise<void> {
    await this.delay()

    const members = this.loadFromStorage()
    const filtered = members.filter(m => m.id !== id)
    
    if (filtered.length === members.length) {
      throw new Error('Member not found')
    }

    this.saveToStorage(filtered)
  }

  /**
   * Get member count by status
   * Useful for dashboard statistics
   */
  async getStats(userId: string): Promise<{
    total: number
    active: number
    expired: number
    cancelled: number
    paused: number
  }> {
    await this.delay()

    const members = await this.getAll(userId)
    
    return {
      total: members.length,
      active: members.filter(m => m.status === 'active').length,
      expired: members.filter(m => m.status === 'expired').length,
      cancelled: members.filter(m => m.status === 'cancelled').length,
      paused: members.filter(m => m.status === 'paused').length,
    }
  }

  // Private helper methods
  private loadFromStorage(): Member[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error('Error loading members from storage:', error)
      return []
    }
  }

  private saveToStorage(members: Member[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(members))
    } catch (error) {
      console.error('Error saving members to storage:', error)
      throw new Error('Failed to save member data')
    }
  }

  private generateId(): string {
    // In production, this would be a UUID from the database
    return `member_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }

  private delay(ms: number = 300): Promise<void> {
    // Simulate API latency
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Export singleton instance
export const memberService = new MemberService()

