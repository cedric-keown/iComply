-- =====================================================
-- Create refresh_cpd_progress Function
-- =====================================================
-- Purpose: Provide a callable function to refresh the cpd_progress_summary materialized view
-- This is needed because the view needs to be refreshed after CPD activities are created, updated, or deleted
-- Created: 2024-12-07

CREATE OR REPLACE FUNCTION refresh_cpd_progress()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    -- Refresh the materialized view
    REFRESH MATERIALIZED VIEW cpd_progress_summary;
    
    RETURN json_build_object(
        'success', true,
        'message', 'CPD progress summary refreshed successfully',
        'timestamp', NOW()
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object(
            'success', false,
            'error', 'Failed to refresh CPD progress: ' || SQLERRM
        );
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION refresh_cpd_progress() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_cpd_progress() TO service_role;

COMMENT ON FUNCTION refresh_cpd_progress IS 'Refreshes the cpd_progress_summary materialized view. Call this after creating, updating, or deleting CPD activities to ensure dashboard metrics are up to date.';

