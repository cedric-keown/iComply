# User-Representative Assignment System

## Overview

A many-to-many assignment system has been implemented to allow users to manage 3-10 representatives each. This includes access control via Row Level Security (RLS) policies to ensure users can only access and manage representatives they are assigned to.

## Implementation Summary

### ✅ Completed Tasks

1. **Created Assignment Table** (`user_representative_assignments`)
   - Many-to-many relationship between `user_profiles` and `representatives`
   - Supports different assignment types: 'management', 'supervision', 'view_only'
   - Includes audit trail (assigned_by, assigned_at, notes)

2. **Created Additional Representatives**
   - **Total Representatives:** 50 (10 existing + 40 new)
   - All with realistic South African names
   - Distributed across all users

3. **Assigned Representatives to Users**
   - **6 Users** with assignments:
     - **biancav User:** 10 representatives
     - **graham User:** 9 representatives
     - **calen User:** 8 representatives
     - **heila User:** 8 representatives
     - **lauren User:** 8 representatives
     - **cedric User:** 7 representatives
   - **Total Assignments:** 50 (all representatives assigned)

4. **Implemented Access Control (RLS Policies)**
   - Users can only **view** representatives assigned to them
   - Users can only **update** representatives assigned to them (with 'management' type)
   - FSP owners and compliance officers have full access
   - Only admins can create/delete representatives
   - Assignment table is also protected by RLS

## Database Schema

### Tables Created

#### `user_representative_assignments`
```sql
- id (UUID, Primary Key)
- user_profile_id (UUID, Foreign Key → user_profiles)
- representative_id (UUID, Foreign Key → representatives)
- assignment_type (TEXT) - 'management', 'supervision', 'view_only'
- assigned_by (UUID, Foreign Key → user_profiles)
- assigned_at (TIMESTAMPTZ)
- notes (TEXT)
- created_at, updated_at (TIMESTAMPTZ)
- UNIQUE(user_profile_id, representative_id)
```

### Views Created

#### `user_assigned_representatives`
Convenient view showing all assignments with user and representative details:
```sql
SELECT * FROM user_assigned_representatives;
```

### Helper Functions

#### `get_user_assigned_representatives(p_user_id UUID)`
Returns all representatives assigned to a specific user:
```sql
SELECT * FROM get_user_assigned_representatives('user-uuid-here');
```

## Access Control Rules

### Representative Access

1. **View Access:**
   - ✅ Representatives assigned to the user
   - ✅ Representatives where user is the representative (user_profile_id match)
   - ✅ All representatives (if user is FSP owner or compliance officer)

2. **Update Access:**
   - ✅ Representatives assigned with 'management' type
   - ✅ All representatives (if user is FSP owner or compliance officer)

3. **Insert Access:**
   - ✅ Only FSP owners, compliance officers, and key individuals

4. **Delete Access:**
   - ✅ Only FSP owners

### Assignment Table Access

- Users can view their own assignments
- Only admins (FSP owners, compliance officers, key individuals) can create/update/delete assignments

## Usage Examples

### View User's Assigned Representatives

```sql
-- Using the view
SELECT * FROM user_assigned_representatives 
WHERE user_email = 'calen@customapp.co.za';

-- Using the helper function
SELECT * FROM get_user_assigned_representatives('714e6510-e575-43eb-a3f7-2f2279fe695d');

-- Direct query
SELECT 
  r.first_name || ' ' || r.surname as name,
  r.fsp_number_new,
  ura.assignment_type
FROM user_representative_assignments ura
JOIN representatives r ON r.id = ura.representative_id
WHERE ura.user_profile_id = 'user-profile-uuid';
```

### Assign a Representative to a User

```sql
INSERT INTO user_representative_assignments (
  user_profile_id,
  representative_id,
  assignment_type,
  assigned_by,
  notes
) VALUES (
  'user-profile-uuid',
  'representative-uuid',
  'management',
  'current-user-uuid',
  'Assignment notes here'
);
```

### Remove an Assignment

```sql
DELETE FROM user_representative_assignments
WHERE user_profile_id = 'user-profile-uuid'
AND representative_id = 'representative-uuid';
```

## Current Assignment Distribution

| User | Email | Assigned Representatives |
|------|-------|-------------------------|
| biancav User | biancav@cardinal.co.za | 10 |
| graham User | graham@cardinal.co.za | 9 |
| calen User | calen@customapp.co.za | 8 |
| heila User | heila@customapp.co.za | 8 |
| lauren User | lauren@cardinal.co.za | 8 |
| cedric User | cedric@customapp.co.za | 7 |

**Total:** 50 assignments covering all 50 representatives

## Security Features

1. **Row Level Security (RLS)** enabled on:
   - `representatives` table
   - `user_representative_assignments` table

2. **Role-Based Access:**
   - Regular users: Only assigned representatives
   - Key Individuals: Can manage supervised representatives
   - Compliance Officers: Full access to all representatives
   - FSP Owners: Full access + delete permissions

3. **Audit Trail:**
   - All assignments track who assigned them and when
   - Notes field for assignment context

## Shared Assignments (Multiple Users per Representative)

✅ **The system fully supports multiple users accessing the same set of representatives.**

### Current Shared Assignments

The following representatives are currently shared by multiple users:

| Representative | Shared By | Users |
|----------------|-----------|-------|
| Michael Smith (FSP12345-REP-005) | 6 users | All users (team management) |
| Sarah Van der Merwe (FSP12345-REP-002) | 3 users | calen, graham, biancav |
| Pieter Botha (FSP12345-REP-003) | 3 users | calen, heila, lauren |
| Nomsa Dlamini (FSP12345-REP-004) | 3 users | calen, cedric, graham |
| Thabo Mthembu (FSP12345-REP-001) | 2 users | calen, cedric |

### How Shared Assignments Work

1. **Schema Support:** The `user_representative_assignments` table has a UNIQUE constraint on `(user_profile_id, representative_id)`, which means:
   - ✅ The same representative CAN be assigned to multiple users
   - ❌ The same user cannot be assigned the same representative twice

2. **RLS Policies:** The Row Level Security policies automatically allow all assigned users to:
   - View the shared representative
   - Update the shared representative (if assignment_type = 'management')

3. **No Conflicts:** Multiple users can simultaneously:
   - View the same representative
   - Update the same representative
   - Manage the same representative's data

### Helper Functions for Shared Assignments

#### 1. `assign_representatives_to_users(rep_ids[], user_ids[], type, assigned_by, notes)`

Assign the same set of representatives to multiple users at once:

```sql
-- Assign 3 representatives to 2 users (creates 6 assignments)
SELECT * FROM assign_representatives_to_users(
  ARRAY[
    'rep-uuid-1'::UUID,
    'rep-uuid-2'::UUID,
    'rep-uuid-3'::UUID
  ],
  ARRAY[
    'user-uuid-1'::UUID,
    'user-uuid-2'::UUID
  ],
  'management',
  'admin-uuid'::UUID,
  'Team shared assignment'
);
```

#### 2. `get_representative_shared_users(representative_id)`

Get all users who have access to a specific representative:

```sql
-- See who can access Michael Smith
SELECT * FROM get_representative_shared_users('56925bc4-4034-44ba-985c-11cfa2be3f49');
```

#### 3. `get_shared_representatives(user_ids[])`

Get representatives that are shared by ALL specified users:

```sql
-- Find representatives shared by calen and cedric
SELECT * FROM get_shared_representatives(ARRAY[
  '714e6510-e575-43eb-a3f7-2f2279fe695d', -- calen
  '8bc581b7-6963-4ac0-9371-b5abb6520864'  -- cedric
]);
```

### Use Cases for Shared Assignments

1. **Team Management:** Multiple supervisors managing the same team of representatives
2. **Backup Coverage:** Secondary users assigned to cover for primary managers
3. **Collaborative Management:** Multiple users working together on high-priority representatives
4. **Department Sharing:** Representatives shared across departments (e.g., Sales + Compliance)

### Example: Creating a Shared Assignment

```sql
-- Assign the same 5 representatives to 3 users (creates 15 assignments)
SELECT * FROM assign_representatives_to_users(
  -- Representatives to share
  ARRAY[
    '7c5e3a70-f51f-4fa4-9eb2-e90ace9b2b70'::UUID,  -- Thabo
    'c7853ea4-c825-4de5-b343-37b281989e79'::UUID,  -- Sarah
    'fb17d143-508f-47bd-b01b-5de7230ffb44'::UUID,  -- Pieter
    'd593cf44-0229-4803-bd80-cb6a8eb01d3d'::UUID,  -- Nomsa
    '56925bc4-4034-44ba-985c-11cfa2be3f49'::UUID   -- Michael
  ],
  -- Users who will share access
  ARRAY[
    '714e6510-e575-43eb-a3f7-2f2279fe695d'::UUID,  -- calen
    '8bc581b7-6963-4ac0-9371-b5abb6520864'::UUID,  -- cedric
    '9141a8cd-699b-4f37-879f-0f4f8e6a76a5'::UUID   -- graham
  ],
  'management',
  'admin-uuid'::UUID,
  'Team shared assignment - all 3 users can manage these 5 representatives'
);
```

## Next Steps

1. **Frontend Integration:**
   - Update UI to filter representatives based on user assignments
   - Add assignment management interface for admins
   - Show assignment status and shared users in representative views
   - Display "Shared with" indicator for representatives

2. **Additional Features:**
   - ✅ Bulk assignment operations (implemented)
   - Assignment history/audit log
   - Assignment expiration dates
   - Temporary assignments
   - Assignment priority/ownership levels

3. **Reporting:**
   - Assignment coverage reports
   - User workload distribution
   - Unassigned representatives report
   - Shared assignment analysis

## Migration Files

- `014_create_user_representative_assignments` - Created assignment table
- `015_create_additional_representatives` - Created 40 new representatives
- `016_assign_representatives_to_users` - Assigned representatives to users
- `017_update_rls_policies_for_assignments` - Updated RLS policies

## Testing

To verify the system is working:

```sql
-- Check all assignments
SELECT * FROM user_assigned_representatives ORDER BY user_name;

-- Check specific user's assignments
SELECT * FROM get_user_assigned_representatives('user-uuid-here');

-- Verify RLS is working (should only see assigned reps when logged in as regular user)
SELECT * FROM representatives;
```

---

**Status:** ✅ Complete and Operational
**Date:** 26 November 2024

