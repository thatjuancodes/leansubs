import type { Organization, UserOrganization, CreateOrganizationInput, UpdateOrganizationSettingsInput } from '@/types/organization'

/**
 * Organization Service
 * 
 * Manages organizations and user-organization relationships.
 * Uses localStorage for now, designed for easy migration to Supabase/PostgreSQL.
 * 
 * Migration notes:
 * - Replace localStorage calls with Supabase client queries
 * - Use Supabase RLS (Row Level Security) for access control
 * - For PostgreSQL, replace with API calls to your backend
 */

// Simulate API delay
function delay(ms: number = 300): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

class OrganizationService {
  private readonly ORGANIZATIONS_KEY = 'leansubs_organizations'
  private readonly USER_ORGS_KEY = 'leansubs_user_organizations'

  /**
   * Create a new organization
   * 
   * Supabase migration:
   * const { data, error } = await supabase
   *   .from('organizations')
   *   .insert({ name, created_at: new Date().toISOString() })
   *   .select()
   *   .single()
   */
  async createOrganization(input: CreateOrganizationInput, userId: string): Promise<Organization> {
    await delay()

    const organization: Organization = {
      id: this.generateId(),
      name: input.name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: {
        currency: 'VND',
        sessionDefaultLengthMinutes: 60,
      },
    }

    // Save organization
    const organizations = this.getOrganizations()
    organizations.push(organization)
    localStorage.setItem(this.ORGANIZATIONS_KEY, JSON.stringify(organizations))

    // Create user-organization relationship with 'owner' role
    await this.addUserToOrganization(userId, organization.id, 'owner')

    return organization
  }

  /**
   * Add a user to an organization
   * 
   * Supabase migration:
   * const { error } = await supabase
   *   .from('user_organizations')
   *   .insert({ user_id: userId, organization_id: orgId, role })
   */
  async addUserToOrganization(
    userId: string, 
    organizationId: string, 
    role: 'owner' | 'admin' | 'member' = 'member'
  ): Promise<UserOrganization> {
    await delay()

    const userOrg: UserOrganization = {
      userId,
      organizationId,
      role,
      joinedAt: new Date().toISOString(),
    }

    const userOrgs = this.getUserOrganizations()
    userOrgs.push(userOrg)
    localStorage.setItem(this.USER_ORGS_KEY, JSON.stringify(userOrgs))

    return userOrg
  }

  /**
   * Get all organizations for a user
   * 
   * Supabase migration:
   * const { data } = await supabase
   *   .from('user_organizations')
   *   .select('*, organizations(*)')
   *   .eq('user_id', userId)
   */
  async getUserOrganizations(userId: string): Promise<Organization[]> {
    await delay()

    const userOrgs = this.getUserOrganizations()
    const organizations = this.getOrganizations()

    const userOrgIds = userOrgs
      .filter(uo => uo.userId === userId)
      .map(uo => uo.organizationId)

    return organizations.filter(org => userOrgIds.includes(org.id))
  }

  /**
   * Get a specific organization by ID
   * 
   * Supabase migration:
   * const { data } = await supabase
   *   .from('organizations')
   *   .select()
   *   .eq('id', orgId)
   *   .single()
   */
  async getOrganizationById(orgId: string): Promise<Organization | null> {
    await delay()

    const organizations = this.getOrganizations()
    const org = organizations.find(org => org.id === orgId)
    
    if (!org) return null
    
    // Migrate old organizations to have settings
    if (!org.settings) {
      org.settings = {
        currency: 'VND',
        sessionDefaultLengthMinutes: 60,
      }
      // Save the migrated organization
      const index = organizations.findIndex(o => o.id === orgId)
      if (index !== -1) {
        organizations[index] = org
        localStorage.setItem(this.ORGANIZATIONS_KEY, JSON.stringify(organizations))
      }
    }
    
    return org
  }

  /**
   * Get user's role in an organization
   * 
   * Supabase migration:
   * const { data } = await supabase
   *   .from('user_organizations')
   *   .select('role')
   *   .eq('user_id', userId)
   *   .eq('organization_id', orgId)
   *   .single()
   */
  async getUserRole(userId: string, organizationId: string): Promise<'owner' | 'admin' | 'member' | null> {
    await delay()

    const userOrgs = this.getUserOrganizations()
    const userOrg = userOrgs.find(
      uo => uo.userId === userId && uo.organizationId === organizationId
    )

    return userOrg?.role || null
  }

  /**
   * Update organization details
   * 
   * Supabase migration:
   * const { data } = await supabase
   *   .from('organizations')
   *   .update({ name, updated_at: new Date().toISOString() })
   *   .eq('id', orgId)
   */
  async updateOrganization(orgId: string, updates: Partial<CreateOrganizationInput>): Promise<Organization> {
    await delay()

    const organizations = this.getOrganizations()
    const index = organizations.findIndex(org => org.id === orgId)

    if (index === -1) {
      throw new Error('Organization not found')
    }

    organizations[index] = {
      ...organizations[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(this.ORGANIZATIONS_KEY, JSON.stringify(organizations))
    return organizations[index]
  }

  /**
   * Update organization settings
   * 
   * Supabase migration:
   * const { data } = await supabase
   *   .from('organizations')
   *   .update({ settings, updated_at: new Date().toISOString() })
   *   .eq('id', orgId)
   */
  async updateSettings(orgId: string, updates: UpdateOrganizationSettingsInput): Promise<Organization> {
    await delay()

    const organizations = this.getOrganizations()
    const index = organizations.findIndex(org => org.id === orgId)

    if (index === -1) {
      throw new Error('Organization not found')
    }

    organizations[index] = {
      ...organizations[index],
      settings: {
        ...organizations[index].settings,
        ...updates,
      },
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(this.ORGANIZATIONS_KEY, JSON.stringify(organizations))
    return organizations[index]
  }

  // Private helper methods for localStorage access
  private getOrganizations(): Organization[] {
    const data = localStorage.getItem(this.ORGANIZATIONS_KEY)
    return data ? JSON.parse(data) : []
  }

  private getUserOrganizations(): UserOrganization[] {
    const data = localStorage.getItem(this.USER_ORGS_KEY)
    return data ? JSON.parse(data) : []
  }

  private generateId(): string {
    return `org_${Date.now()}_${Math.random().toString(36).substring(7)}`
  }
}

// Export singleton instance
export const organizationService = new OrganizationService()

