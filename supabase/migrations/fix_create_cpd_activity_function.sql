-- =====================================================
-- Fix create_cpd_activity Function
-- =====================================================
-- Issue: Function was missing 'verifiable' and 'certificate_attached' parameters
-- This prevented users from setting these values when uploading CPD activities
-- Created: 2024-12-07

-- Drop existing function
DROP FUNCTION IF EXISTS create_cpd_activity(uuid, uuid, date, text, text, text, numeric, numeric, numeric, boolean, boolean, boolean, uuid);

-- Recreate with correct parameters including verifiable and certificate_attached
CREATE OR REPLACE FUNCTION create_cpd_activity(
    p_representative_id UUID,
    p_cpd_cycle_id UUID,
    p_activity_date DATE,
    p_activity_name TEXT,
    p_activity_type TEXT,
    p_provider_name TEXT,
    p_total_hours NUMERIC,
    p_ethics_hours NUMERIC DEFAULT 0,
    p_technical_hours NUMERIC DEFAULT 0,
    p_class_1_applicable BOOLEAN DEFAULT false,
    p_class_2_applicable BOOLEAN DEFAULT false,
    p_class_3_applicable BOOLEAN DEFAULT false,
    p_verifiable BOOLEAN DEFAULT true,  -- ✅ Added parameter
    p_certificate_attached BOOLEAN DEFAULT false,  -- ✅ Added parameter
    p_uploaded_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
    v_id UUID;
BEGIN
    -- Validation
    IF p_activity_name IS NULL OR p_activity_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Activity name is required');
    END IF;
    
    IF p_provider_name IS NULL OR p_provider_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Provider name is required');
    END IF;
    
    IF p_total_hours IS NULL OR p_total_hours <= 0 THEN
        RETURN json_build_object('success', false, 'error', 'Total hours must be greater than 0');
    END IF;

    -- Insert new CPD activity
    INSERT INTO cpd_activities (
        representative_id, cpd_cycle_id, activity_date, activity_name,
        activity_type, provider_name, total_hours, ethics_hours, technical_hours,
        class_1_applicable, class_2_applicable, class_3_applicable,
        verifiable,  -- ✅ Added column
        certificate_attached,  -- ✅ Added column
        uploaded_by, status
    )
    VALUES (
        p_representative_id, p_cpd_cycle_id, p_activity_date, p_activity_name,
        p_activity_type, p_provider_name, p_total_hours, p_ethics_hours, p_technical_hours,
        p_class_1_applicable, p_class_2_applicable, p_class_3_applicable,
        p_verifiable,  -- ✅ Added value
        p_certificate_attached,  -- ✅ Added value
        p_uploaded_by, 'pending'
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object(
        'success', true, 
        'id', v_id, 
        'message', 'CPD activity created successfully',
        'status', 'pending'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false, 
            'error', 'Failed to create CPD activity: ' || SQLERRM
        );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION create_cpd_activity TO authenticated;
GRANT EXECUTE ON FUNCTION create_cpd_activity TO service_role;

COMMENT ON FUNCTION create_cpd_activity IS 'Creates a new CPD activity with validation. Includes verifiable and certificate_attached parameters to control activity properties.';

