-- =====================================================
-- Fix get_cpd_progress_summary Function
-- =====================================================
-- Issue: Function was missing 'verifiable_hours' column in return type
-- This caused "structure of query does not match function result type" error
-- Created: 2024-12-07

-- Drop existing function
DROP FUNCTION IF EXISTS get_cpd_progress_summary(uuid, uuid);

-- Recreate with correct return columns including verifiable_hours
CREATE OR REPLACE FUNCTION get_cpd_progress_summary(
    p_representative_id UUID DEFAULT NULL,
    p_cpd_cycle_id UUID DEFAULT NULL
)
RETURNS TABLE (
    representative_id UUID,
    fsp_number TEXT,
    cpd_cycle_id UUID,
    cycle_name TEXT,
    total_hours_logged NUMERIC,
    ethics_hours_logged NUMERIC,
    technical_hours_logged NUMERIC,
    verifiable_hours NUMERIC,  -- ✅ Added this column
    activity_count BIGINT,
    progress_percentage NUMERIC,
    compliance_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        cps.representative_id,
        cps.fsp_number,
        cps.cpd_cycle_id,
        cps.cycle_name,
        cps.total_hours_logged,
        cps.ethics_hours_logged,
        cps.technical_hours_logged,
        cps.verifiable_hours,  -- ✅ Added this column
        cps.activity_count,
        cps.progress_percentage,
        cps.compliance_status
    FROM cpd_progress_summary cps
    WHERE (p_representative_id IS NULL OR cps.representative_id = p_representative_id)
      AND (p_cpd_cycle_id IS NULL OR cps.cpd_cycle_id = p_cpd_cycle_id)
    ORDER BY cps.compliance_status, cps.progress_percentage DESC;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_cpd_progress_summary(uuid, uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_cpd_progress_summary(uuid, uuid) TO service_role;

COMMENT ON FUNCTION get_cpd_progress_summary IS 'Retrieves CPD progress summary from materialized view with optional filtering by representative and cycle. Now includes verifiable_hours column.';

