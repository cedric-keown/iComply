-- ============================================================================
-- GRANT ALL PERMISSIONS TO ADMINISTRATIVE STAFF ROLE
-- ============================================================================
-- This migration updates the Administrative Staff role to have full access
-- to all system functionality, matching the FSP Owner permissions level.
--
-- USER REQUEST:
-- Allow all functionality on user permissions for the Administrative Staff user role
--
-- CHANGE:
-- Updated permissions from limited (documents, clients) to full system access
-- ============================================================================

-- Update Administrative Staff role to have all permissions
UPDATE user_roles
SET 
    permissions = jsonb_build_object(
        'all', true,           -- ✅ Full access enabled
        'actions', jsonb_build_array('*'),  -- ✅ All actions allowed
        'modules', jsonb_build_array('*')   -- ✅ All modules accessible
    )
WHERE role_name = 'admin_staff';

-- ============================================================================
-- BEFORE:
-- ============================================================================
-- {
--   "all": false,
--   "actions": ["view", "upload", "manage"],
--   "modules": ["documents", "clients"]
-- }
--
-- AFTER:
-- ============================================================================
-- {
--   "all": true,
--   "actions": ["*"],
--   "modules": ["*"]
-- }
--
-- This means Administrative Staff users can now:
-- ✅ Access all modules (CPD, Representatives, Compliance, Documents, etc.)
-- ✅ Perform all actions (view, create, update, delete, approve, etc.)
-- ✅ Manage all system functionality
-- ✅ Same permission level as FSP Owner
-- ============================================================================

-- Verify the update
SELECT 
    id,
    role_name,
    role_display_name,
    role_description,
    permissions
FROM user_roles
WHERE role_name = 'admin_staff';

