# Subscriptions System

## Overview

The subscription system allows organizations to record payments from members and automatically add credits to their accounts. This is designed with flexibility in mind for future integration with payment processors like Stripe.

## Data Model

### Subscription Interface

```typescript
interface Subscription {
  id: string                  // Unique subscription ID
  memberId: string            // Reference to member
  memberName: string          // Cached member name for display
  organizationId: string      // Organization this belongs to
  amount: number              // Payment amount (USD)
  credits: number             // Number of credits added
  createdAt: string           // ISO timestamp
  notes?: string              // Optional notes (payment method, invoice #, etc.)
}
```

### Create Subscription Input

```typescript
interface CreateSubscriptionInput {
  memberId: string            // Required: Member to add credits to
  amount: number              // Required: Payment amount
  credits: number             // Required: Credits to add
  notes?: string              // Optional: Additional information
}
```

## Core Features

### 1. **Create Subscription**
- Select member from searchable dropdown
- Enter payment amount
- Specify credits to add
- Add optional notes (payment method, invoice number, etc.)
- Automatically updates member's credit balance
- Redirect to subscriptions list after creation

### 2. **View Subscriptions**
- List all subscriptions for the organization
- Display key statistics:
  - Total subscriptions
  - Total revenue
  - Total credits sold
- Show subscription details:
  - Member name
  - Payment amount
  - Credits added
  - Timestamp
  - Notes (if any)
  - Delete button (trash icon)

### 3. **Delete Subscription**
- Click trash icon on any subscription
- Modal dialog appears with:
  - Warning that action cannot be undone
  - Full subscription details
  - Important note: Credits are NOT removed from member
  - Password confirmation field
- Enter user password to confirm deletion
- Password is verified before deletion
- Only removes the payment record
- Does NOT deduct credits from member's account

### 4. **Dashboard Integration**
- Subscription stats card shows total subscriptions and credits sold
- Quick action button to add new subscription
- Clickable stats card navigates to subscriptions list

## User Flow

### Adding a Subscription

1. Navigate to "Add Subscription" from dashboard or subscriptions page
2. Search and select a member from the dropdown
   - Dropdown shows member name, email, and current credit balance
   - Search filters by name or email
   - Shows confirmation when member is selected
3. Enter payment amount (e.g., $100.00)
4. Enter credits to add (e.g., 10)
5. Optionally add notes (e.g., "Stripe invoice #12345")
6. Submit form
7. Credits are immediately added to member's account
8. Success message displays
9. Redirect to subscriptions list after 2 seconds

### Viewing Subscriptions

1. Navigate to "Subscriptions" from dashboard
2. View statistics at the top:
   - Total subscriptions count
   - Total revenue (sum of all payments)
   - Total credits sold (sum of all credits)
3. Scroll through list of subscriptions (newest first)
4. Each subscription shows:
   - Member name
   - Date and time
   - Amount paid (green badge)
   - Credits added (blue badge)
   - Notes (if any)

## Service Layer

### `subscriptionService`

Located at: `src/services/subscription.service.ts`

#### Methods

**`createSubscription(input, organizationId)`**
- Creates a new subscription record
- Adds credits to member's account
- Returns the created subscription
- Throws error if member not found

**`getAll(organizationId)`**
- Returns all subscriptions for an organization
- Sorted by creation date (newest first)

**`getByMember(memberId)`**
- Returns all subscriptions for a specific member
- Sorted by creation date (newest first)

**`getById(id)`**
- Returns a single subscription by ID
- Returns null if not found

**`delete(id, organizationId)`**
- Deletes a subscription record
- Verifies subscription belongs to organization
- Returns void on success
- Throws error if not found or no permission
- **Important**: Does NOT remove credits from member

**`getStats(organizationId)`**
- Returns statistics for an organization:
  - `total`: Total number of subscriptions
  - `totalAmount`: Sum of all payment amounts
  - `totalCredits`: Sum of all credits sold

## LocalStorage Implementation

### Current State (Mock Database)

**Key**: `leansubs_subscriptions`

**Structure**: Array of Subscription objects

```json
[
  {
    "id": "sub_1234567890_abc123",
    "memberId": "mem_1234567890_xyz789",
    "memberName": "John Doe",
    "organizationId": "org_1234567890_abc123",
    "amount": 100,
    "credits": 10,
    "createdAt": "2025-10-24T10:30:00.000Z",
    "notes": "Stripe payment - Invoice #12345"
  }
]
```

## Future: Supabase/PostgreSQL Migration

### Database Schema

```sql
-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  credits INTEGER NOT NULL CHECK (credits > 0),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Indexes
  INDEX idx_subscriptions_member (member_id),
  INDEX idx_subscriptions_org (organization_id),
  INDEX idx_subscriptions_created (created_at DESC)
);

-- Row Level Security
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can only see subscriptions for their organizations
CREATE POLICY "Users can view subscriptions for their organizations"
  ON subscriptions
  FOR SELECT
  USING (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );

-- Users can create subscriptions for their organizations
CREATE POLICY "Users can create subscriptions for their organizations"
  ON subscriptions
  FOR INSERT
  WITH CHECK (
    organization_id IN (
      SELECT organization_id 
      FROM user_organizations 
      WHERE user_id = auth.uid()
    )
  );
```

### Database Function for Atomic Credit Updates

```sql
-- Function to add credits to member and create subscription
CREATE OR REPLACE FUNCTION add_member_credits_with_subscription(
  p_member_id UUID,
  p_organization_id UUID,
  p_amount DECIMAL,
  p_credits INTEGER,
  p_notes TEXT DEFAULT NULL
) RETURNS subscriptions AS $$
DECLARE
  v_subscription subscriptions;
BEGIN
  -- Start transaction (implicit in function)
  
  -- Update member credits
  UPDATE members
  SET credits = COALESCE(credits, 0) + p_credits,
      updated_at = NOW()
  WHERE id = p_member_id;
  
  -- Check if member was found
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Member not found';
  END IF;
  
  -- Create subscription record
  INSERT INTO subscriptions (
    member_id,
    organization_id,
    amount,
    credits,
    notes
  ) VALUES (
    p_member_id,
    p_organization_id,
    p_amount,
    p_credits,
    p_notes
  ) RETURNING * INTO v_subscription;
  
  RETURN v_subscription;
END;
$$ LANGUAGE plpgsql;
```

### Migration Steps

1. **Create Database Schema**
   - Run the SQL above to create the `subscriptions` table
   - Create the atomic function for credit updates

2. **Update Service Methods**
   - Replace localStorage calls with Supabase queries
   - Use the `add_member_credits_with_subscription` function for atomicity

3. **Update `subscriptionService.createSubscription`**

```typescript
async createSubscription(
  input: CreateSubscriptionInput,
  organizationId: string
): Promise<Subscription> {
  const { data, error } = await supabase
    .rpc('add_member_credits_with_subscription', {
      p_member_id: input.memberId,
      p_organization_id: organizationId,
      p_amount: input.amount,
      p_credits: input.credits,
      p_notes: input.notes || null,
    })
    .select('*, members(full_name)')
    .single()

  if (error) throw new Error(error.message)
  
  return {
    id: data.id,
    memberId: data.member_id,
    memberName: data.members.full_name,
    organizationId: data.organization_id,
    amount: data.amount,
    credits: data.credits,
    createdAt: data.created_at,
    notes: data.notes,
  }
}
```

4. **Update `subscriptionService.getAll`**

```typescript
async getAll(organizationId: string): Promise<Subscription[]> {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*, members(full_name)')
    .eq('organization_id', organizationId)
    .order('created_at', { ascending: false })

  if (error) throw new Error(error.message)
  
  return data.map(s => ({
    id: s.id,
    memberId: s.member_id,
    memberName: s.members.full_name,
    organizationId: s.organization_id,
    amount: s.amount,
    credits: s.credits,
    createdAt: s.created_at,
    notes: s.notes,
  }))
}
```

## UI Components

### Pages

**`/subscriptions`** - List all subscriptions
- Location: `src/pages/subscriptions.tsx`
- Shows statistics and list of all subscriptions
- Delete button on each subscription card

**`/subscriptions/add`** - Add new subscription
- Location: `src/pages/add-subscription.tsx`
- Form to create a new subscription

### Components

**`DeleteSubscriptionModal`** - Confirmation dialog for deletion
- Location: `src/components/delete-subscription-modal.tsx`
- Displays subscription details
- Warning messages
- Password confirmation field
- Validates password before deletion

### Dashboard Integration

**Overview Stats**
- Added third card for "Subscriptions"
- Shows total count and credits sold
- Clickable to navigate to subscriptions list

**Quick Actions**
- Added third button for "Add Subscription"
- Green background (success.500)
- Credit card icon
- Navigates to add subscription form

## Validation Rules

### Amount
- Must be a positive number
- Supports decimals (e.g., 99.99)
- Required field

### Credits
- Must be a positive integer
- No decimals allowed
- Required field

### Member
- Must select from existing members
- Searchable dropdown with auto-complete
- Shows member's current credit balance
- Required field

### Notes
- Optional text field
- No character limit
- Useful for tracking payment methods, invoice numbers, etc.

## Error Handling

### Common Errors

1. **Member Not Found**
   - Error: "Member not found"
   - Solution: Ensure member exists before creating subscription

2. **Invalid Amount**
   - Error: "Please enter a valid amount"
   - Solution: Enter a positive number

3. **Invalid Credits**
   - Error: "Please enter a valid number of credits"
   - Solution: Enter a positive integer

4. **No Member Selected**
   - Error: "Please select a member"
   - Solution: Select a member from the dropdown

## Future Enhancements

### Payment Gateway Integration

1. **Stripe Integration**
   - Add Stripe Checkout session
   - Webhook to create subscription on successful payment
   - Store Stripe payment ID in notes field

2. **Recurring Subscriptions**
   - Add subscription plans (monthly, yearly)
   - Auto-add credits on renewal
   - Handle failed payments

3. **Refunds**
   - Add ability to refund a subscription
   - Deduct credits from member account
   - Track refund status

4. **Invoice Generation**
   - Auto-generate PDF invoices
   - Email invoices to members
   - Store invoice URLs

5. **Payment History**
   - Filter subscriptions by date range
   - Export to CSV
   - Generate reports

## Testing Checklist

### Create Subscription
- [ ] Create subscription with valid data
- [ ] Verify credits are added to member
- [ ] Search and select member from dropdown
- [ ] Submit with missing required fields
- [ ] Submit with invalid amount (negative, zero)
- [ ] Submit with invalid credits (negative, zero, decimal)

### View Subscriptions
- [ ] View subscriptions list
- [ ] Check statistics accuracy
- [ ] Verify all subscription details display correctly
- [ ] Navigate from dashboard to subscriptions
- [ ] Navigate from dashboard to add subscription

### Delete Subscription
- [ ] Click delete button on a subscription
- [ ] Verify modal shows correct subscription details
- [ ] Verify warning messages display
- [ ] Try deleting without entering password
- [ ] Try deleting with wrong password
- [ ] Delete with correct password
- [ ] Verify subscription is removed from list
- [ ] Verify statistics update after deletion
- [ ] Verify member still has their credits
- [ ] Close modal without deleting

### General
- [ ] Test mobile responsiveness
- [ ] Test dark mode
- [ ] Test keyboard navigation (Enter to confirm)

