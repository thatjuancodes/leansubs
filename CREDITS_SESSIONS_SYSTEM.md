# LeanSubs Credits & Sessions System

## Overview
The Credits and Sessions system allows gym/fitness business owners to track member credits and record when members use their sessions. This document explains the complete implementation.

---

## Features

### 1. **Credits Management**
- Each member has a `credits` field representing available sessions
- Admins can set initial credits when creating a member
- Admins can edit credits at any time through the member edit form
- Credits are displayed prominently in the members table
- Credits are color-coded: green (available) / red (0 credits)

### 2. **Session Recording**
- Admins can record sessions for members
- Each session deducts credits from the member automatically
- Default timestamp is set to current date/time (editable)
- Customizable credits used per session (default: 1)
- Optional notes field for session details

### 3. **Session Verification**
- All sessions start with status: **"unverified"**
- Admins manually verify sessions to change status to **"verified"**
- Unverified sessions are highlighted in yellow
- Verified sessions are marked in green
- Easy one-click verification from the sessions table

### 4. **Smart Member Selection**
- Searchable dropdown when recording sessions
- Type to filter members by name or email
- Only shows active members with available credits
- Displays credit balance for each member
- Real-time validation of credit availability

---

## User Workflow

### Recording a Session

1. Navigate to **Dashboard** → **Record Session**
2. **Select Member**:
   - Type in the search box to filter members
   - Click on a member from the dropdown
   - See their available credits displayed
3. **Enter Session Details**:
   - Date & Time (defaults to now)
   - Credits to use (defaults to 1)
   - Optional notes
4. Click **Record Session**
5. Credits are automatically deducted from the member
6. Session is created with status "unverified"
7. Redirected to sessions list

### Verifying Sessions

1. Navigate to **Dashboard** → **View Sessions**
2. Find unverified sessions (yellow badge)
3. Click **Verify** button
4. Status changes to "verified" (green badge)

### Managing Member Credits

1. Navigate to **View Members**
2. Click on a member row
3. Edit the **Credits** field
4. Click **Update**

---

## Data Models

### Member Interface
```typescript
interface Member {
  id: string
  userId: string
  fullName: string
  email: string
  phone?: string
  membershipType: MembershipType
  status: MembershipStatus
  startDate: string
  endDate: string
  credits: number // ← NEW FIELD
  notes?: string
  createdAt: string
  updatedAt: string
}
```

### Session Interface
```typescript
interface Session {
  id: string
  userId: string
  memberId: string
  timestamp: string // When the session occurred
  status: 'unverified' | 'verified'
  creditsUsed: number // Default: 1
  notes?: string
  createdAt: string
  updatedAt: string
}
```

---

## Services

### Member Service
**File**: `src/services/member.service.ts`

- `create()` - Now includes credits field
- `update()` - Can update credits
- `getAll()` - Returns members with credits

### Session Service  
**File**: `src/services/session.service.ts`

**Key Methods:**
- `create(userId, input)` - Creates session and deducts credits
  - Validates member exists
  - Checks credit availability
  - Deducts credits atomically
  - Creates session with status "unverified"
  
- `getAll(userId, filters?)` - Returns sessions with member data
  - Can filter by status (unverified/verified)
  - Can filter by member
  - Can filter by date range
  - Returns `SessionWithMember` (includes member name/email)
  
- `verify(id, userId)` - Changes status to "verified"
  
- `delete(id, userId)` - Deletes session and refunds credits
  
- `getStats(userId)` - Returns session statistics
  - Total sessions
  - Unverified count
  - Verified count
  - Total credits used

---

## UI Components

### Pages

1. **Dashboard** (`/dashboard`)
   - **Member Statistics**: Total, Active, Paused members
   - **Session Statistics**: Total, Unverified, Verified sessions
   - **Quick Actions**: 4 buttons
     - Add Member
     - View Members
     - Record Session ← NEW
     - View Sessions ← NEW

2. **Add Session** (`/sessions/add`)
   - Searchable member dropdown (autocomplete)
   - Date/time picker (defaults to now)
   - Credits input (defaults to 1)
   - Notes textarea
   - Real-time credit validation
   - Shows remaining credits after deduction

3. **View Sessions** (`/sessions`)
   - Table view with all sessions
   - Columns: Member, Date/Time, Credits, Status, Action
   - Search by member name or email
   - Filter by status (All/Unverified/Verified)
   - One-click verification button
   - Color-coded status badges

4. **Members Table** (`/members`)
   - Added **Credits** column
   - Green text for credits > 0
   - Red text for credits = 0

5. **Add/Edit Member Forms**
   - Added **Credits** input field
   - Number input with min="0"
   - Required field
   - Validation for positive numbers

---

## Data Persistence

### Current Implementation (localStorage)
- Members stored in: `leansubs_members`
- Sessions stored in: `leansubs_sessions`
- Credit deductions are atomic within the service

### Future Migration (Supabase/PostgreSQL)

**Database Schema:**

```sql
-- Members table
ALTER TABLE members ADD COLUMN credits INTEGER NOT NULL DEFAULT 0;

-- Sessions table
CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'unverified',
  credits_used INTEGER NOT NULL DEFAULT 1,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_member_id ON sessions(member_id);
CREATE INDEX idx_sessions_status ON sessions(status);
CREATE INDEX idx_sessions_timestamp ON sessions(timestamp);
```

**Migration Steps:**
1. Add credits column to members table
2. Create sessions table
3. Update `session.service.ts` with Supabase queries
4. Use database transactions for credit deductions
5. Add foreign key constraints

---

## Validation & Business Rules

### Session Creation Rules:
1. ✅ Member must exist
2. ✅ Member must have sufficient credits
3. ✅ Credits used must be ≥ 1
4. ✅ Session timestamp must be valid ISO date
5. ✅ Status defaults to "unverified"

### Credit Management Rules:
1. ✅ Credits can be any non-negative integer
2. ✅ Credits are deducted when session is created
3. ✅ Credits are refunded when session is deleted
4. ✅ Credit adjustments when editing creditsUsed in a session

### Member Selection Rules (Add Session):
1. ✅ Only shows active members
2. ✅ Only shows members with credits > 0
3. ✅ Validates credit availability before submission

---

## Styling

All components follow the **"Calm Precision"** brand styleguide:
- Primary color: `#4CA9FF` (Soft sky blue)
- Success color: `#22C55E` (Spring green)
- Warning color: `#FDBA74` (Apricot orange)
- Rounded corners: `0.75rem`
- Subtle shadows and transitions
- Clean typography (Poppins + IBM Plex Sans)

---

## Testing the System

### Test Workflow:

1. **Create a member with credits**
   - Go to Add Member
   - Fill in details
   - Set credits to 10
   - Save

2. **Record a session**
   - Go to Record Session
   - Search for the member
   - Select them (should show 10 credits)
   - Use default values
   - Submit

3. **Verify the results**
   - Member should now have 9 credits
   - Session should appear in View Sessions
   - Status should be "unverified" (yellow)
   - Dashboard should show 1 unverified session

4. **Verify the session**
   - Go to View Sessions
   - Click Verify on the session
   - Status changes to "verified" (green)
   - Dashboard updates stats

5. **Record multiple sessions**
   - Repeat recording sessions
   - Watch credits decrease
   - Try to use more credits than available (should fail)

---

## Future Enhancements

### Planned for Later:
- Auto-verification based on check-in/QR codes
- Session history per member (in member details)
- Credit packages (bulk purchase)
- Expiration dates for credits
- Session types (training, class, open gym)
- Analytics dashboard (sessions per day/week/month)
- Email notifications for low credits
- Mobile app for member check-ins

---

## File Structure

```
src/
├── types/
│   ├── member.ts (updated with credits)
│   └── session.ts (new)
├── services/
│   ├── member.service.ts (updated)
│   └── session.service.ts (new)
├── pages/
│   ├── dashboard.tsx (updated with session stats)
│   ├── members.tsx (updated with credits column)
│   ├── add-member.tsx (updated with credits field)
│   ├── add-session.tsx (new)
│   └── sessions.tsx (new)
└── App.tsx (updated with new routes)
```

---

## Summary

The Credits & Sessions system is fully functional with:
- ✅ Credits field on members
- ✅ Session recording with credit deduction
- ✅ Searchable member dropdown
- ✅ Unverified/Verified status workflow
- ✅ Dashboard integration with statistics
- ✅ Complete UI for all operations
- ✅ Data validation and error handling
- ✅ Ready for Supabase/PostgreSQL migration

All code follows project conventions and is production-ready for a localStorage-based prototype.


