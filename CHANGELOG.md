# LeanSubs Changelog

## [Unreleased] - 2025-10-24

### Added - Subscription System

#### Core Features
- **Subscription Management**: Full CRUD operations for subscription/payment records
- **Credit System**: Automatic credit addition to members when subscriptions are created
- **Password-Protected Deletion**: Secure deletion with user password confirmation

#### New Pages
- `/subscriptions` - View all subscriptions with statistics
- `/subscriptions/add` - Create new subscriptions

#### New Components
- `DeleteSubscriptionModal` - Secure deletion confirmation dialog with password verification

#### New Services
- `subscriptionService` with methods:
  - `createSubscription()` - Create subscription and add credits to member
  - `getAll()` - Get all subscriptions for organization
  - `getByMember()` - Get subscriptions for specific member
  - `getById()` - Get single subscription
  - `delete()` - Delete subscription (password-protected)
  - `getStats()` - Get organization statistics

#### Dashboard Integration
- Added "Subscriptions" overview card (clickable)
- Added "Add Subscription" quick action button (green, credit card icon)
- Displays: total subscriptions, credits sold, revenue

#### UI/UX Features
- Searchable member dropdown with auto-complete
- Real-time credit balance display in member search
- Visual confirmation for selected members
- Click-outside to close dropdowns
- Password confirmation modal for deletion
- Warning messages about irreversible actions
- Success/error feedback messages
- Fully responsive design
- Dark mode support

#### Security
- Password verification before deletion
- Organization-scoped access control
- Validation for all input fields

#### Data Model
```typescript
interface Subscription {
  id: string
  memberId: string
  memberName: string
  organizationId: string
  amount: number
  credits: number
  createdAt: string
  notes?: string
}
```

#### Important Notes
- Subscriptions use localStorage (same as other entities)
- Designed for easy migration to Supabase/PostgreSQL
- Deleting a subscription does NOT remove credits from member
- Credits are automatically added on subscription creation

### Fixed
- Fixed `memberService.update()` parameter format in subscription creation
- Fixed organization ID being undefined in some contexts

### Documentation
- Created `SUBSCRIPTIONS_SYSTEM.md` with complete system documentation
- Includes Supabase/PostgreSQL migration guide
- Database schema with RLS policies
- Testing checklist

---

## Previous Updates

### Multi-Organization Support
- Users can belong to multiple organizations
- Organization created on sign-up
- Organization context throughout app

### Profile Management
- User profile page with information display
- Password change section (UI only, not functional)
- Back to dashboard navigation

### Landing Page Redesign
- Separate background colors for sections
- Gray hero section
- White features section
- Dark footer with copyright

### Header Component
- Reusable `AppHeader` component
- User dropdown menu with Profile and Logout
- Consistent across all authenticated pages

### Dashboard Simplification
- Single "Total Members" card (clickable)
- Single "Total Sessions" card (clickable)
- Three quick action buttons (Add Member, Record Session, Add Subscription)
- Clean, modern design with Chakra UI v3

### Authentication System
- Login/Register pages
- Protected routes
- Auth context with user and organization state
- Mock localStorage-based auth service

### Member Management
- Create, read, update, delete members
- Member list with filtering
- Member details drawer
- Credit tracking

### Session Management
- Record training sessions
- Session list with member information
- Session details drawer
- Credit deduction on session creation

---

## Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Chakra UI v3
- **Routing**: React Router DOM v6
- **Icons**: Lucide React (react-icons/lu)
- **Package Manager**: Yarn
- **State Management**: React Context API
- **Storage**: LocalStorage (temporary, designed for DB migration)

## Development Status
- ✅ Authentication (mock)
- ✅ Multi-organization support
- ✅ Member management
- ✅ Session management
- ✅ Subscription/payment tracking
- ✅ Dashboard with statistics
- ✅ Profile page
- 🚧 Password change (UI only)
- 📅 Planned: Supabase integration
- 📅 Planned: Payment gateway (Stripe)
- 📅 Planned: Recurring subscriptions
- 📅 Planned: Invoice generation

