-- ============================================================================
-- USER-REPRESENTATIVE LINKING FUNCTION
-- Provides reliable database function for linking users to representatives
-- Can be called from any page without requiring Supabase client
-- ============================================================================

-- Create the linking function
CREATE OR REPLACE FUNCTION link_user_to_representative(
    p_user_profile_id UUID,
    p_representative_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_old_rep_id UUID;
    v_old_rep_number TEXT;
    v_new_rep_number TEXT;
    v_new_rep_name TEXT;
BEGIN
    -- Validate inputs
    IF p_user_profile_id IS NULL THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'User profile ID is required'
        );
    END IF;
    
    -- Get info about old link (if any)
    SELECT id, representative_number INTO v_old_rep_id, v_old_rep_number
    FROM representatives
    WHERE user_profile_id = p_user_profile_id
    LIMIT 1;
    
    -- Clear any existing link for this user profile
    IF v_old_rep_id IS NOT NULL THEN
        UPDATE representatives 
        SET user_profile_id = NULL,
            updated_at = NOW()
        WHERE user_profile_id = p_user_profile_id;
        
        RAISE NOTICE 'Cleared old link: % (Rep ID: %)', v_old_rep_number, v_old_rep_id;
    END IF;
    
    -- If null or empty string provided, just clear the link (unlink)
    IF p_representative_id IS NULL OR p_representative_id = '00000000-0000-0000-0000-000000000000'::UUID THEN
        RETURN json_build_object(
            'success', true,
            'message', 'Representative link removed',
            'action', 'unlinked',
            'old_rep', v_old_rep_number
        );
    END IF;
    
    -- Check if representative exists
    IF NOT EXISTS (SELECT 1 FROM representatives WHERE id = p_representative_id) THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Representative not found'
        );
    END IF;
    
    -- Clear this representative's existing link (if linked to someone else)
    UPDATE representatives
    SET user_profile_id = NULL,
        updated_at = NOW()
    WHERE id = p_representative_id 
    AND user_profile_id IS NOT NULL
    AND user_profile_id != p_user_profile_id;
    
    -- Create the new link
    UPDATE representatives
    SET user_profile_id = p_user_profile_id,
        updated_at = NOW()
    WHERE id = p_representative_id
    RETURNING representative_number, (first_name || ' ' || surname) 
    INTO v_new_rep_number, v_new_rep_name;
    
    IF NOT FOUND THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Failed to create link - representative not found'
        );
    END IF;
    
    RAISE NOTICE 'Created new link: User % → Rep % (%)', p_user_profile_id, v_new_rep_number, v_new_rep_name;
    
    RETURN json_build_object(
        'success', true,
        'message', 'Representative link updated successfully',
        'action', 'linked',
        'representative_id', p_representative_id,
        'representative_number', v_new_rep_number,
        'representative_name', v_new_rep_name,
        'old_rep', v_old_rep_number
    );
    
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Failed to update representative link: ' || SQLERRM
        );
END;
$$;

-- Grant execute permission to Admin role
DO $$
BEGIN
    -- Grant to Admin role
    INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
    SELECT r.id, 'function', 'link_user_to_representative', 'EXECUTE', true
    FROM roles r
    WHERE r.role_name = 'Admin'
    AND NOT EXISTS (
        SELECT 1 FROM role_permissions rp 
        WHERE rp.role_id = r.id 
        AND rp.object_type = 'function' 
        AND rp.object_name = 'link_user_to_representative'
    )
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE '✅ link_user_to_representative function created and permissions granted';
END $$;

-- Test the function
DO $$
DECLARE
    v_result JSON;
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'TESTING link_user_to_representative FUNCTION';
    RAISE NOTICE '================================================';
    
    -- Show example usage
    RAISE NOTICE 'Example usage:';
    RAISE NOTICE 'SELECT link_user_to_representative(';
    RAISE NOTICE '    ''user-profile-uuid'',';
    RAISE NOTICE '    ''representative-uuid''';
    RAISE NOTICE ');';
    RAISE NOTICE '';
    RAISE NOTICE 'To unlink:';
    RAISE NOTICE 'SELECT link_user_to_representative(';
    RAISE NOTICE '    ''user-profile-uuid'',';
    RAISE NOTICE '    NULL';
    RAISE NOTICE ');';
    RAISE NOTICE '';
    RAISE NOTICE '✅ Function ready to use!';
    RAISE NOTICE '================================================';
END $$;

