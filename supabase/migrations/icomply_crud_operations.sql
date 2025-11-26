-- ============================================================================
-- iCOMPLY CRUD OPERATIONS
-- Complete CRUD functions for all entities following RBAC patterns
-- Based on: supabase_implementation_sequence.md
-- Generated: 2025-11-26
-- ============================================================================

-- ============================================================================
-- PHASE 1: FOUNDATION & AUTHENTICATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FSP CONFIGURATION CRUD
-- ----------------------------------------------------------------------------

-- Create FSP Configuration
CREATE OR REPLACE FUNCTION create_fsp_configuration(
    p_fsp_name TEXT,
    p_fsp_license_number TEXT,
    p_registration_number TEXT DEFAULT NULL,
    p_vat_number TEXT DEFAULT NULL,
    p_address_street TEXT DEFAULT NULL,
    p_address_city TEXT DEFAULT NULL,
    p_address_province TEXT DEFAULT NULL,
    p_address_postal_code TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_website TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    -- Validate required fields
    IF p_fsp_name IS NULL OR p_fsp_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'FSP name is required');
    END IF;
    
    IF p_fsp_license_number IS NULL OR p_fsp_license_number = '' THEN
        RETURN json_build_object('success', false, 'error', 'FSP license number is required');
    END IF;

    INSERT INTO fsp_configuration (
        fsp_name, fsp_license_number, registration_number, vat_number,
        address_street, address_city, address_province, address_postal_code,
        phone, email, website
    )
    VALUES (
        p_fsp_name, p_fsp_license_number, p_registration_number, p_vat_number,
        p_address_street, p_address_city, p_address_province, p_address_postal_code,
        p_phone, p_email, p_website
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object(
        'success', true,
        'id', v_id,
        'message', 'FSP configuration created successfully'
    );
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'FSP license number already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create FSP configuration: ' || SQLERRM);
END;
$$;

-- Get FSP Configuration
CREATE OR REPLACE FUNCTION get_fsp_configuration()
RETURNS TABLE(
    id UUID,
    fsp_name TEXT,
    fsp_license_number TEXT,
    registration_number TEXT,
    vat_number TEXT,
    address_street TEXT,
    address_city TEXT,
    address_province TEXT,
    address_postal_code TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT fc.* FROM fsp_configuration fc
    ORDER BY fc.created_at DESC
    LIMIT 1;
END;
$$;

-- Update FSP Configuration
CREATE OR REPLACE FUNCTION update_fsp_configuration(
    p_id UUID,
    p_fsp_name TEXT DEFAULT NULL,
    p_fsp_license_number TEXT DEFAULT NULL,
    p_registration_number TEXT DEFAULT NULL,
    p_vat_number TEXT DEFAULT NULL,
    p_address_street TEXT DEFAULT NULL,
    p_address_city TEXT DEFAULT NULL,
    p_address_province TEXT DEFAULT NULL,
    p_address_postal_code TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_website TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE fsp_configuration 
    SET 
        fsp_name = COALESCE(p_fsp_name, fsp_name),
        fsp_license_number = COALESCE(p_fsp_license_number, fsp_license_number),
        registration_number = COALESCE(p_registration_number, registration_number),
        vat_number = COALESCE(p_vat_number, vat_number),
        address_street = COALESCE(p_address_street, address_street),
        address_city = COALESCE(p_address_city, address_city),
        address_province = COALESCE(p_address_province, address_province),
        address_postal_code = COALESCE(p_address_postal_code, address_postal_code),
        phone = COALESCE(p_phone, phone),
        email = COALESCE(p_email, email),
        website = COALESCE(p_website, website),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'FSP configuration updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'FSP configuration not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update FSP configuration: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- SYSTEM SETTINGS CRUD
-- ----------------------------------------------------------------------------

-- Create System Setting
CREATE OR REPLACE FUNCTION create_system_setting(
    p_setting_key TEXT,
    p_setting_value JSONB,
    p_setting_type TEXT,
    p_category TEXT,
    p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_setting_key IS NULL OR p_setting_key = '' THEN
        RETURN json_build_object('success', false, 'error', 'Setting key is required');
    END IF;

    INSERT INTO system_settings (setting_key, setting_value, setting_type, category, description)
    VALUES (p_setting_key, p_setting_value, p_setting_type, p_category, p_description)
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'System setting created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Setting key already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create system setting: ' || SQLERRM);
END;
$$;

-- Get System Settings
CREATE OR REPLACE FUNCTION get_system_settings(
    p_category TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    setting_key TEXT,
    setting_value JSONB,
    setting_type TEXT,
    category TEXT,
    description TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT ss.*
    FROM system_settings ss
    WHERE (p_category IS NULL OR ss.category = p_category)
    ORDER BY ss.category, ss.setting_key;
END;
$$;

-- Update System Setting
CREATE OR REPLACE FUNCTION update_system_setting(
    p_id UUID,
    p_setting_value JSONB DEFAULT NULL,
    p_description TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE system_settings 
    SET 
        setting_value = COALESCE(p_setting_value, setting_value),
        description = COALESCE(p_description, description),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'System setting updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'System setting not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update system setting: ' || SQLERRM);
END;
$$;

-- Delete System Setting
CREATE OR REPLACE FUNCTION delete_system_setting(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM system_settings WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'System setting deleted successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'System setting not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete system setting: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- USER ROLES CRUD
-- ----------------------------------------------------------------------------

-- Create User Role
CREATE OR REPLACE FUNCTION create_user_role(
    p_role_name TEXT,
    p_role_display_name TEXT,
    p_role_description TEXT DEFAULT NULL,
    p_permissions JSONB DEFAULT '{}'::JSONB
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_role_name IS NULL OR p_role_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Role name is required');
    END IF;

    INSERT INTO user_roles (role_name, role_display_name, role_description, permissions)
    VALUES (p_role_name, p_role_display_name, p_role_description, p_permissions)
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'User role created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Role name already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create user role: ' || SQLERRM);
END;
$$;

-- Get User Roles
CREATE OR REPLACE FUNCTION get_user_roles()
RETURNS TABLE(
    id UUID,
    role_name TEXT,
    role_display_name TEXT,
    role_description TEXT,
    permissions JSONB,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT ur.* FROM user_roles ur
    ORDER BY ur.role_name;
END;
$$;

-- Update User Role
CREATE OR REPLACE FUNCTION update_user_role(
    p_id UUID,
    p_role_display_name TEXT DEFAULT NULL,
    p_role_description TEXT DEFAULT NULL,
    p_permissions JSONB DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE user_roles 
    SET 
        role_display_name = COALESCE(p_role_display_name, role_display_name),
        role_description = COALESCE(p_role_description, role_description),
        permissions = COALESCE(p_permissions, permissions)
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'User role updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'User role not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update user role: ' || SQLERRM);
END;
$$;

-- Delete User Role
CREATE OR REPLACE FUNCTION delete_user_role(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if role is in use
    IF EXISTS (SELECT 1 FROM user_profiles WHERE role_id = p_id) THEN
        RETURN json_build_object('success', false, 'error', 'Cannot delete role: it is currently assigned to users');
    END IF;

    DELETE FROM user_roles WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'User role deleted successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'User role not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete user role: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- USER PROFILES CRUD
-- ----------------------------------------------------------------------------

-- Create User Profile
CREATE OR REPLACE FUNCTION create_user_profile(
    p_id UUID,
    p_role_id UUID,
    p_first_name TEXT,
    p_last_name TEXT,
    p_email TEXT,
    p_phone TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_id_number TEXT DEFAULT NULL,
    p_fsp_number TEXT DEFAULT NULL,
    p_status TEXT DEFAULT 'active'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_first_name IS NULL OR p_first_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'First name is required');
    END IF;
    
    IF p_last_name IS NULL OR p_last_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Last name is required');
    END IF;
    
    IF p_email IS NULL OR p_email = '' THEN
        RETURN json_build_object('success', false, 'error', 'Email is required');
    END IF;

    INSERT INTO user_profiles (
        id, role_id, first_name, last_name, email, phone, mobile,
        id_number, fsp_number, status
    )
    VALUES (
        p_id, p_role_id, p_first_name, p_last_name, p_email, p_phone, p_mobile,
        p_id_number, p_fsp_number, p_status
    );
    
    RETURN json_build_object('success', true, 'id', p_id, 'message', 'User profile created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Email already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create user profile: ' || SQLERRM);
END;
$$;

-- Get User Profiles
CREATE OR REPLACE FUNCTION get_user_profiles(
    p_status TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    role_id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    id_number TEXT,
    fsp_number TEXT,
    status TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT up.*
    FROM user_profiles up
    WHERE (p_status IS NULL OR up.status = p_status)
    ORDER BY up.created_at DESC;
END;
$$;

-- Get Single User Profile
CREATE OR REPLACE FUNCTION get_user_profile(p_id UUID)
RETURNS TABLE(
    id UUID,
    role_id UUID,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    id_number TEXT,
    fsp_number TEXT,
    status TEXT,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT up.*
    FROM user_profiles up
    WHERE up.id = p_id;
END;
$$;

-- Update User Profile
CREATE OR REPLACE FUNCTION update_user_profile(
    p_id UUID,
    p_role_id UUID DEFAULT NULL,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_id_number TEXT DEFAULT NULL,
    p_fsp_number TEXT DEFAULT NULL,
    p_status TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE user_profiles 
    SET 
        role_id = COALESCE(p_role_id, role_id),
        first_name = COALESCE(p_first_name, first_name),
        last_name = COALESCE(p_last_name, last_name),
        phone = COALESCE(p_phone, phone),
        mobile = COALESCE(p_mobile, mobile),
        id_number = COALESCE(p_id_number, id_number),
        fsp_number = COALESCE(p_fsp_number, fsp_number),
        status = COALESCE(p_status, status),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'User profile updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'User profile not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update user profile: ' || SQLERRM);
END;
$$;

-- Soft Delete User Profile
CREATE OR REPLACE FUNCTION delete_user_profile(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE user_profiles 
    SET status = 'inactive', updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'User profile deactivated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'User profile not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to deactivate user profile: ' || SQLERRM);
END;
$$;

-- ============================================================================
-- PHASE 2: REPRESENTATIVES & KEY INDIVIDUALS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- REPRESENTATIVES CRUD
-- ----------------------------------------------------------------------------

-- Create Representative
CREATE OR REPLACE FUNCTION create_representative(
    p_user_profile_id UUID,
    p_fsp_number TEXT,
    p_supervised_by_ki_id UUID DEFAULT NULL,
    p_class_1_long_term BOOLEAN DEFAULT FALSE,
    p_class_2_short_term BOOLEAN DEFAULT FALSE,
    p_class_3_pension BOOLEAN DEFAULT FALSE,
    p_status TEXT DEFAULT 'active',
    p_onboarding_date DATE DEFAULT NULL,
    p_authorization_date DATE DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_fsp_number IS NULL OR p_fsp_number = '' THEN
        RETURN json_build_object('success', false, 'error', 'FSP number is required');
    END IF;

    INSERT INTO representatives (
        user_profile_id, fsp_number, supervised_by_ki_id,
        class_1_long_term, class_2_short_term, class_3_pension,
        status, onboarding_date, authorization_date
    )
    VALUES (
        p_user_profile_id, p_fsp_number, p_supervised_by_ki_id,
        p_class_1_long_term, p_class_2_short_term, p_class_3_pension,
        p_status, p_onboarding_date, p_authorization_date
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Representative created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'FSP number already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create representative: ' || SQLERRM);
END;
$$;

-- Get Representatives
CREATE OR REPLACE FUNCTION get_representatives(
    p_status TEXT DEFAULT NULL,
    p_supervised_by_ki_id UUID DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    user_profile_id UUID,
    fsp_number TEXT,
    supervised_by_ki_id UUID,
    class_1_long_term BOOLEAN,
    class_2_short_term BOOLEAN,
    class_3_pension BOOLEAN,
    status TEXT,
    onboarding_date DATE,
    authorization_date DATE,
    deauthorization_date DATE,
    deauthorization_reason TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT r.*
    FROM representatives r
    WHERE (p_status IS NULL OR r.status = p_status)
      AND (p_supervised_by_ki_id IS NULL OR r.supervised_by_ki_id = p_supervised_by_ki_id)
    ORDER BY r.created_at DESC;
END;
$$;

-- Get Single Representative
CREATE OR REPLACE FUNCTION get_representative(p_id UUID)
RETURNS TABLE(
    id UUID,
    user_profile_id UUID,
    fsp_number TEXT,
    supervised_by_ki_id UUID,
    class_1_long_term BOOLEAN,
    class_2_short_term BOOLEAN,
    class_3_pension BOOLEAN,
    status TEXT,
    onboarding_date DATE,
    authorization_date DATE,
    deauthorization_date DATE,
    deauthorization_reason TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT r.*
    FROM representatives r
    WHERE r.id = p_id;
END;
$$;

-- Update Representative
CREATE OR REPLACE FUNCTION update_representative(
    p_id UUID,
    p_supervised_by_ki_id UUID DEFAULT NULL,
    p_class_1_long_term BOOLEAN DEFAULT NULL,
    p_class_2_short_term BOOLEAN DEFAULT NULL,
    p_class_3_pension BOOLEAN DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_authorization_date DATE DEFAULT NULL,
    p_deauthorization_date DATE DEFAULT NULL,
    p_deauthorization_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE representatives 
    SET 
        supervised_by_ki_id = COALESCE(p_supervised_by_ki_id, supervised_by_ki_id),
        class_1_long_term = COALESCE(p_class_1_long_term, class_1_long_term),
        class_2_short_term = COALESCE(p_class_2_short_term, class_2_short_term),
        class_3_pension = COALESCE(p_class_3_pension, class_3_pension),
        status = COALESCE(p_status, status),
        authorization_date = COALESCE(p_authorization_date, authorization_date),
        deauthorization_date = COALESCE(p_deauthorization_date, deauthorization_date),
        deauthorization_reason = COALESCE(p_deauthorization_reason, deauthorization_reason),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Representative updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Representative not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update representative: ' || SQLERRM);
END;
$$;

-- Soft Delete Representative
CREATE OR REPLACE FUNCTION delete_representative(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE representatives 
    SET status = 'inactive', updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Representative deactivated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Representative not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to deactivate representative: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- KEY INDIVIDUALS CRUD
-- ----------------------------------------------------------------------------

-- Create Key Individual
CREATE OR REPLACE FUNCTION create_key_individual(
    p_representative_id UUID,
    p_ki_type TEXT,
    p_appointment_date DATE,
    p_max_supervised_count INTEGER DEFAULT 20
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_ki_type IS NULL OR p_ki_type = '' THEN
        RETURN json_build_object('success', false, 'error', 'Key individual type is required');
    END IF;
    
    IF p_appointment_date IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Appointment date is required');
    END IF;

    INSERT INTO key_individuals (
        representative_id, ki_type, appointment_date, max_supervised_count, current_supervised_count
    )
    VALUES (
        p_representative_id, p_ki_type, p_appointment_date, p_max_supervised_count, 0
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Key individual created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Representative is already a key individual');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create key individual: ' || SQLERRM);
END;
$$;

-- Get Key Individuals
CREATE OR REPLACE FUNCTION get_key_individuals(
    p_ki_type TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    representative_id UUID,
    ki_type TEXT,
    appointment_date DATE,
    resignation_date DATE,
    max_supervised_count INTEGER,
    current_supervised_count INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT ki.*
    FROM key_individuals ki
    WHERE (p_ki_type IS NULL OR ki.ki_type = p_ki_type)
      AND ki.resignation_date IS NULL
    ORDER BY ki.appointment_date DESC;
END;
$$;

-- Update Key Individual
CREATE OR REPLACE FUNCTION update_key_individual(
    p_id UUID,
    p_resignation_date DATE DEFAULT NULL,
    p_max_supervised_count INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE key_individuals 
    SET 
        resignation_date = COALESCE(p_resignation_date, resignation_date),
        max_supervised_count = COALESCE(p_max_supervised_count, max_supervised_count),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Key individual updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Key individual not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update key individual: ' || SQLERRM);
END;
$$;

-- Delete Key Individual (set resignation date)
CREATE OR REPLACE FUNCTION delete_key_individual(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE key_individuals 
    SET resignation_date = CURRENT_DATE, updated_at = NOW()
    WHERE id = p_id AND resignation_date IS NULL;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Key individual resigned successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Key individual not found or already resigned');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to resign key individual: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- SUPERVISION RECORDS CRUD
-- ----------------------------------------------------------------------------

-- Create Supervision Record
CREATE OR REPLACE FUNCTION create_supervision_record(
    p_representative_id UUID,
    p_key_individual_id UUID,
    p_supervision_date DATE,
    p_meeting_type TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL,
    p_action_items TEXT DEFAULT NULL,
    p_next_meeting_date DATE DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_supervision_date IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Supervision date is required');
    END IF;

    INSERT INTO supervision_records (
        representative_id, key_individual_id, supervision_date, meeting_type,
        notes, action_items, next_meeting_date, created_by
    )
    VALUES (
        p_representative_id, p_key_individual_id, p_supervision_date, p_meeting_type,
        p_notes, p_action_items, p_next_meeting_date, p_created_by
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Supervision record created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create supervision record: ' || SQLERRM);
END;
$$;

-- Get Supervision Records
CREATE OR REPLACE FUNCTION get_supervision_records(
    p_representative_id UUID DEFAULT NULL,
    p_key_individual_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 100
)
RETURNS TABLE(
    id UUID,
    representative_id UUID,
    key_individual_id UUID,
    supervision_date DATE,
    meeting_type TEXT,
    notes TEXT,
    action_items TEXT,
    next_meeting_date DATE,
    created_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT sr.*
    FROM supervision_records sr
    WHERE (p_representative_id IS NULL OR sr.representative_id = p_representative_id)
      AND (p_key_individual_id IS NULL OR sr.key_individual_id = p_key_individual_id)
    ORDER BY sr.supervision_date DESC
    LIMIT p_limit;
END;
$$;

-- Update Supervision Record
CREATE OR REPLACE FUNCTION update_supervision_record(
    p_id UUID,
    p_notes TEXT DEFAULT NULL,
    p_action_items TEXT DEFAULT NULL,
    p_next_meeting_date DATE DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE supervision_records 
    SET 
        notes = COALESCE(p_notes, notes),
        action_items = COALESCE(p_action_items, action_items),
        next_meeting_date = COALESCE(p_next_meeting_date, next_meeting_date),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Supervision record updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Supervision record not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update supervision record: ' || SQLERRM);
END;
$$;

-- Delete Supervision Record
CREATE OR REPLACE FUNCTION delete_supervision_record(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM supervision_records WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Supervision record deleted successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Supervision record not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete supervision record: ' || SQLERRM);
END;
$$;

-- ============================================================================
-- PHASE 3: CORE COMPLIANCE TRACKING
-- ============================================================================

-- Due to the extensive nature of this file, I'll continue in the next part...
-- The pattern continues for:
-- - Fit & Proper Records CRUD
-- - CPD Cycles CRUD
-- - CPD Activities CRUD
-- - Clients CRUD (Phase 4)
-- - FICA Verifications CRUD (Phase 4)
-- - Documents CRUD (Phase 5)
-- - Complaints CRUD (Phase 5)
-- - Alerts CRUD (Phase 6)
-- - Internal Audits CRUD (Phase 6)
-- - Reports CRUD (Phase 7)

-- ============================================================================
-- RBAC PERMISSIONS FOR ALL FUNCTIONS
-- ============================================================================

-- Add EXECUTE permissions for Admin role on all functions
INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
SELECT r.id, 'function', func.function_name, 'EXECUTE', true
FROM roles r
CROSS JOIN (VALUES 
    -- Phase 1 Functions
    ('create_fsp_configuration'), ('get_fsp_configuration'), ('update_fsp_configuration'),
    ('create_system_setting'), ('get_system_settings'), ('update_system_setting'), ('delete_system_setting'),
    ('create_user_role'), ('get_user_roles'), ('update_user_role'), ('delete_user_role'),
    ('create_user_profile'), ('get_user_profiles'), ('get_user_profile'), ('update_user_profile'), ('delete_user_profile'),
    -- Phase 2 Functions
    ('create_representative'), ('get_representatives'), ('get_representative'), ('update_representative'), ('delete_representative'),
    ('create_key_individual'), ('get_key_individuals'), ('update_key_individual'), ('delete_key_individual'),
    ('create_supervision_record'), ('get_supervision_records'), ('update_supervision_record'), ('delete_supervision_record')
) AS func(function_name)
WHERE r.role_name = 'Admin'
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id 
    AND rp.object_type = 'function' 
    AND rp.object_name = func.function_name 
    AND rp.operation = 'EXECUTE'
)
ON CONFLICT DO NOTHING;

-- Add EXECUTE permissions for User role on read-only functions
INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
SELECT r.id, 'function', func.function_name, 'EXECUTE', true
FROM roles r
CROSS JOIN (VALUES 
    ('get_fsp_configuration'), ('get_system_settings'), ('get_user_roles'),
    ('get_user_profiles'), ('get_user_profile'),
    ('get_representatives'), ('get_representative'),
    ('get_key_individuals'), ('get_supervision_records')
) AS func(function_name)
WHERE r.role_name = 'User'
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id 
    AND rp.object_type = 'function' 
    AND rp.object_name = func.function_name 
    AND rp.operation = 'EXECUTE'
)
ON CONFLICT DO NOTHING;

-- Add EXECUTE permissions for Viewer role on read-only functions
INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
SELECT r.id, 'function', func.function_name, 'EXECUTE', true
FROM roles r
CROSS JOIN (VALUES 
    ('get_fsp_configuration'), ('get_system_settings'), ('get_user_roles'),
    ('get_user_profiles'), ('get_user_profile'),
    ('get_representatives'), ('get_representative'),
    ('get_key_individuals'), ('get_supervision_records')
) AS func(function_name)
WHERE r.role_name = 'Viewer'
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id 
    AND rp.object_type = 'function' 
    AND rp.object_name = func.function_name 
    AND rp.operation = 'EXECUTE'
)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- END OF PHASE 1-2 CRUD OPERATIONS
-- ============================================================================

