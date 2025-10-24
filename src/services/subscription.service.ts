import type { Subscription, CreateSubscriptionInput } from '@/types/subscription'
import { memberService } from './member.service'

/**
 * Subscription Service
 * 
 * Manages subscription payments and credit additions.
 * Uses localStorage for now, designed for easy migration to Supabase/PostgreSQL.
 * 
 * Migration notes:
 * - Replace localStorage with Supabase/PostgreSQL queries
 * - Use database transactions to ensure credits are added atomically
 * - Add payment gateway integration (Stripe, etc.)
 */

// Simulate API delay
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class SubscriptionService {
  private readonly SUBSCRIPTIONS_KEY = 'leansubs_subscriptions'

  /**
   * Create a new subscription and add credits to member
   * 
   * Supabase migration:
   * const { data: subscription } = await supabase
   *   .from('subscriptions')
   *   .insert({ member_id, amount, credits, organization_id })
   *   .select()
   *   .single()
   * 
   * // Update member credits in same transaction
   * await supabase.rpc('add_member_credits', { member_id, credits })
   */
  async createSubscription(
    input: CreateSubscriptionInput,
    organizationId: string
  ): Promise<Subscription> {
    await delay()

    // Get member to retrieve name and current credits
    const member = await memberService.getById(input.memberId)
    if (!member) {
      throw new Error('Member not found')
    }

    // Create subscription record
    const subscription: Subscription = {
      id: this.generateId(),
      memberId: input.memberId,
      memberName: member.fullName,
      organizationId,
      amount: input.amount,
      credits: input.credits,
      createdAt: new Date().toISOString(),
      notes: input.notes,
    }

    // Save subscription
    const subscriptions = this.getSubscriptions()
    subscriptions.push(subscription)
    localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(subscriptions))

    // Add credits to member
    const currentCredits = member.credits || 0
    const newCredits = currentCredits + input.credits
    await memberService.update({ id: input.memberId, credits: newCredits })

    return subscription
  }

  /**
   * Get all subscriptions for an organization
   * 
   * Supabase migration:
   * const { data } = await supabase
   *   .from('subscriptions')
   *   .select('*, members(full_name)')
   *   .eq('organization_id', organizationId)
   *   .order('created_at', { ascending: false })
   */
  async getAll(organizationId: string): Promise<Subscription[]> {
    await delay()

    const subscriptions = this.getSubscriptions()
    return subscriptions
      .filter(s => s.organizationId === organizationId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * Get subscriptions for a specific member
   * 
   * Supabase migration:
   * const { data } = await supabase
   *   .from('subscriptions')
   *   .select()
   *   .eq('member_id', memberId)
   *   .order('created_at', { ascending: false })
   */
  async getByMember(memberId: string): Promise<Subscription[]> {
    await delay()

    const subscriptions = this.getSubscriptions()
    return subscriptions
      .filter(s => s.memberId === memberId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * Get subscription by ID
   */
  async getById(id: string): Promise<Subscription | null> {
    await delay()

    const subscriptions = this.getSubscriptions()
    return subscriptions.find(s => s.id === id) || null
  }

  /**
   * Delete a subscription
   * 
   * Note: This only removes the payment record, it does NOT deduct credits from the member.
   * 
   * Supabase migration:
   * const { error } = await supabase
   *   .from('subscriptions')
   *   .delete()
   *   .eq('id', id)
   *   .eq('organization_id', organizationId)
   */
  async delete(id: string, organizationId: string): Promise<void> {
    await delay()

    const subscriptions = this.getSubscriptions()
    const subscription = subscriptions.find(s => s.id === id && s.organizationId === organizationId)
    
    if (!subscription) {
      throw new Error('Subscription not found or you do not have permission to delete it')
    }

    const filtered = subscriptions.filter(s => s.id !== id)
    localStorage.setItem(this.SUBSCRIPTIONS_KEY, JSON.stringify(filtered))
  }

  /**
   * Get subscription statistics for an organization
   */
  async getStats(organizationId: string): Promise<{
    total: number
    totalAmount: number
    totalCredits: number
  }> {
    await delay()

    const subscriptions = this.getSubscriptions()
    const orgSubscriptions = subscriptions.filter(s => s.organizationId === organizationId)

    return {
      total: orgSubscriptions.length,
      totalAmount: orgSubscriptions.reduce((sum, s) => sum + s.amount, 0),
      totalCredits: orgSubscriptions.reduce((sum, s) => sum + s.credits, 0),
    }
  }

  // Private helper methods
  private getSubscriptions(): Subscription[] {
    const data = localStorage.getItem(this.SUBSCRIPTIONS_KEY)
    return data ? JSON.parse(data) : []
  }

  private generateId(): string {
    return `sub_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}

// Export singleton instance
export const subscriptionService = new SubscriptionService()

