# User Profile to Representative Linking Guide

## Overview

This guide explains how to link `user_profiles` (which reference `public.users`) to `representatives` in the iComply database.

## Database Structure

- **`public.users`**: User accounts in the system
- **`user_profiles`**: Extended user information (references `public.users.id`)
- **`representatives`**: Representative records with compliance data

## Current Status

- ✅ **10 Representatives** exist (unlinked)
- ✅ **6 User Profiles** created from public.users
- ✅ **Helper Functions** created for linking

## Linking Methods

### Method 1: Simple Manual Linking (Recommended)

Link an existing user to a representative:

```sql
-- Link a user to a representative (creates user_profile if needed)
SELECT link_user_to_representative(
  p_user_id := 'user-uuid-from-public.users',
  p_representative_id := 'representative-uuid-here'
);
```

### Method 2: Create User Profile and Link

Create a user_profile for a representative and link them:

```sql
-- This function creates user_profile and links automatically
SELECT create_user_profile_for_representative(
  p_representative_id := 'representative-uuid-here',
  p_user_id := 'user-uuid-from-public.users',
  p_role_name := 'representative'  -- or 'key_individual', 'compliance_officer', etc.
);
```

### Method 3: Manual Linking (Existing User Profiles)

If user_profile already exists:

```sql
-- Link representative to existing user_profile
SELECT link_representative_to_user_profile(
  p_representative_id := 'representative-uuid-here',
  p_user_profile_id := 'user-profile-uuid-here'
);
```

### Method 4: Auto-Link by ID Number

If both representative and user_profile have matching ID numbers:

```sql
-- This will automatically link representatives to user_profiles by matching id_number
SELECT * FROM auto_link_by_id_number();
```

### Method 5: Bulk Link All Representatives

Try to link all representatives using available methods:

```sql
-- Attempts to link all representatives using ID number matching
SELECT * FROM bulk_link_all_representatives();
```

## Available Functions

### 1. `link_user_to_representative(user_id, representative_id)` ⭐ RECOMMENDED

Links a user from public.users to a representative. Creates user_profile if needed.

**Parameters:**
- `p_user_id` (UUID): The user's ID from public.users
- `p_representative_id` (UUID): The representative's ID

**Returns:** `BOOLEAN` - true if successful

**Example:**
```sql
SELECT link_user_to_representative(
  '714e6510-e575-43eb-a3f7-2f2279fe695d',  -- user ID from public.users
  '7c5e3a70-f51f-4fa4-9eb2-e90ace9b2b70'  -- representative ID
);
```

### 2. `link_representative_to_user_profile(representative_id, user_profile_id)`

Manually links a representative to an existing user profile.

**Parameters:**
- `p_representative_id` (UUID): The representative's ID
- `p_user_profile_id` (UUID): The user profile's ID

**Returns:** `BOOLEAN` - true if successful

**Example:**
```sql
SELECT link_representative_to_user_profile(
  '7c5e3a70-f51f-4fa4-9eb2-e90ace9b2b70',
  '714e6510-e575-43eb-a3f7-2f2279fe695d'
);
```

### 3. `create_user_profile_for_representative(representative_id, user_id, role_name)`

Creates a user_profile for a representative and links them automatically.

**Parameters:**
- `p_representative_id` (UUID): The representative's ID
- `p_user_id` (UUID): The public.users.id (must exist in public.users)
- `p_role_name` (TEXT): Role name (default: 'representative')

**Returns:** `UUID` - The created user_profile.id

**Example:**
```sql
SELECT create_user_profile_for_representative(
  '7c5e3a70-f51f-4fa4-9eb2-e90ace9b2b70',
  '714e6510-e575-43eb-a3f7-2f2279fe695d',
  'representative'
);
```

### 4. `auto_link_by_id_number()`

Automatically links representatives to user_profiles by matching ID numbers.

**Returns:** Table with `representative_id`, `user_profile_id`, `match_method`

**Example:**
```sql
SELECT * FROM auto_link_by_id_number();
```

## Views

### `unlinked_representatives`

Shows all representatives that don't have a linked user_profile:

```sql
SELECT * FROM unlinked_representatives;
```

### `user_representative_links`

Shows all user profiles and their linked representatives:

```sql
SELECT * FROM user_representative_links;
```

## Automatic User Profile Creation

User profiles are automatically created for all users in `public.users`. The migration has already created user_profiles for all 6 existing users.

## Workflow for New Representatives

1. **Create Representative Record:**
   ```sql
   INSERT INTO representatives (id_number, first_name, surname, ...)
   VALUES (...);
   ```

2. **User is Created in public.users:**
   - User profile is automatically created (or can be created manually)

3. **Link Representative to User:**
   ```sql
   -- Option A: Simple linking (recommended)
   SELECT link_user_to_representative(
     'user-id-from-public.users',
     'representative-id'
   );
   
   -- Option B: Auto-link by ID number (if both have matching id_number)
   SELECT * FROM auto_link_by_id_number();
   
   -- Option C: Bulk link all
   SELECT * FROM bulk_link_all_representatives();
   ```

## Checking Link Status

```sql
-- See all unlinked representatives
SELECT * FROM unlinked_representatives;

-- See all linked relationships
SELECT * FROM user_representative_links;

-- Count linked vs unlinked
SELECT 
  COUNT(*) FILTER (WHERE user_profile_id IS NOT NULL) as linked,
  COUNT(*) FILTER (WHERE user_profile_id IS NULL) as unlinked,
  COUNT(*) as total
FROM representatives;
```

## Troubleshooting

### Error: "User with id X does not exist in public.users"
- Ensure the user exists in `public.users` table
- Check `users` table to verify the user exists

### Error: "Representative with id X does not exist"
- Verify the representative ID is correct
- Check the `representatives` table

### Error: "Role X does not exist"
- Ensure the role exists in `user_roles` table
- Valid roles: 'fsp_owner', 'key_individual', 'compliance_officer', 'representative', 'admin_staff'

## Next Steps

1. **Create auth.users** via Supabase Auth (sign up process)
2. **Enable trigger** for automatic user_profile creation (optional)
3. **Link representatives** using one of the methods above
4. **Verify links** using the views provided

## Example: Complete Linking Workflow

```sql
-- 1. Get a representative that needs linking
SELECT id, id_number, first_name, surname, fsp_number_new 
FROM representatives 
WHERE user_profile_id IS NULL 
LIMIT 1;

-- 2. Get a user from public.users
SELECT id, email, role 
FROM users 
LIMIT 1;

-- 3. Link them together (simplest method)
SELECT link_user_to_representative(
  'user-id-from-step-2',
  'representative-id-from-step-1'
);

-- 4. Verify the link
SELECT * FROM user_representative_links 
WHERE representative_id = 'representative-id-from-step-1';
```

## Quick Start: Link All Available Representatives

```sql
-- See what can be linked
SELECT * FROM unlinked_representatives;

-- Try to auto-link by ID number
SELECT * FROM auto_link_by_id_number();

-- Or manually link specific ones
SELECT link_user_to_representative(
  (SELECT id FROM users WHERE email = 'user@example.com'),
  (SELECT id FROM representatives WHERE fsp_number_new = 'FSP12345-REP-001')
);
```

