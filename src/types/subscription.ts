export interface Subscription {
  id: string
  memberId: string
  memberName: string
  organizationId: string
  amount: number
  credits: number
  createdAt: string
  notes?: string
}

export interface CreateSubscriptionInput {
  memberId: string
  amount: number
  credits: number
  notes?: string
}

