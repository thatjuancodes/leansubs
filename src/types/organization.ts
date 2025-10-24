export interface Organization {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

export interface UserOrganization {
  userId: string
  organizationId: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface CreateOrganizationInput {
  name: string
}

