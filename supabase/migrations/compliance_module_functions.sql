-- ============================================================================
-- COMPLIANCE MODULE DATABASE FUNCTIONS
-- Functions to support the Compliance Management module dashboards
-- ============================================================================

-- ============================================================================
-- EXECUTIVE DASHBOARD HEALTH
-- ============================================================================

CREATE OR REPLACE FUNCTION get_executive_dashboard_health()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_reps INTEGER;
    v_active_reps INTEGER;
    v_compliant_reps INTEGER;
    v_at_risk_reps INTEGER;
    v_non_compliant_reps INTEGER;
    v_overall_score NUMERIC;
    v_fp_non_compliant INTEGER;
    v_cpd_non_compliant INTEGER;
    v_fica_non_compliant INTEGER;
BEGIN
    -- Get total and active representatives
    SELECT COUNT(*) INTO v_total_reps
    FROM representatives;
    
    SELECT COUNT(*) INTO v_active_reps
    FROM representatives
    WHERE status = 'active';
    
    -- Calculate compliance for active representatives
    -- Using the comprehensive compliance calculation
    WITH compliance_stats AS (
        SELECT 
            (get_representative_compliance(r.id)->>'overall_status')::TEXT as status,
            (get_representative_compliance(r.id)->>'overall_score')::NUMERIC as score,
            (get_representative_compliance(r.id)->'fit_proper'->>'compliant')::BOOLEAN as fp_compliant,
            (get_representative_compliance(r.id)->'cpd'->>'compliant')::BOOLEAN as cpd_compliant,
            (get_representative_compliance(r.id)->'fica'->>'compliant')::BOOLEAN as fica_compliant
        FROM representatives r
        WHERE r.status = 'active'
    )
    SELECT 
        COUNT(*) FILTER (WHERE status = 'compliant'),
        COUNT(*) FILTER (WHERE status = 'at_risk'),
        COUNT(*) FILTER (WHERE status = 'non_compliant'),
        AVG(score),
        COUNT(*) FILTER (WHERE fp_compliant = false),
        COUNT(*) FILTER (WHERE cpd_compliant = false),
        COUNT(*) FILTER (WHERE fica_compliant = false)
    INTO 
        v_compliant_reps,
        v_at_risk_reps,
        v_non_compliant_reps,
        v_overall_score,
        v_fp_non_compliant,
        v_cpd_non_compliant,
        v_fica_non_compliant
    FROM compliance_stats;
    
    RETURN json_build_object(
        'total_representatives', COALESCE(v_total_reps, 0),
        'active_representatives', COALESCE(v_active_reps, 0),
        'compliant_representatives', COALESCE(v_compliant_reps, 0),
        'at_risk_representatives', COALESCE(v_at_risk_reps, 0),
        'non_compliant_representatives', COALESCE(v_non_compliant_reps, 0),
        'overall_compliance_score', COALESCE(ROUND(v_overall_score, 2), 0),
        'fit_proper_non_compliant', COALESCE(v_fp_non_compliant, 0),
        'cpd_non_compliant', COALESCE(v_cpd_non_compliant, 0),
        'fica_non_compliant', COALESCE(v_fica_non_compliant, 0),
        'calculated_at', NOW()
    );
END;
$$;

-- ============================================================================
-- TEAM COMPLIANCE MATRIX
-- ============================================================================

CREATE OR REPLACE FUNCTION get_team_compliance_matrix()
RETURNS TABLE(
    rep_id UUID,
    rep_name TEXT,
    rep_status TEXT,
    rep_fsp_number TEXT,
    overall_score NUMERIC,
    overall_status TEXT,
    compliance_indicator TEXT,
    fp_status TEXT,
    cpd_status TEXT,
    fica_status TEXT,
    docs_status TEXT,
    calculated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        COALESCE(r.first_name || ' ' || r.surname, up.first_name || ' ' || up.last_name, 'Unknown') as rep_name,
        r.status,
        COALESCE(r.fsp_number_new, r.representative_number) as fsp_number,
        (get_representative_compliance(r.id)->>'overall_score')::NUMERIC,
        (get_representative_compliance(r.id)->>'overall_status')::TEXT,
        CASE 
            WHEN (get_representative_compliance(r.id)->>'overall_status')::TEXT = 'compliant' THEN 'green'
            WHEN (get_representative_compliance(r.id)->>'overall_status')::TEXT = 'at_risk' THEN 'yellow'
            ELSE 'red'
        END as compliance_indicator,
        (get_representative_compliance(r.id)->'fit_proper'->>'status')::TEXT,
        (get_representative_compliance(r.id)->'cpd'->>'status')::TEXT,
        (get_representative_compliance(r.id)->'fica'->>'status')::TEXT,
        (get_representative_compliance(r.id)->'documents'->>'status')::TEXT,
        (get_representative_compliance(r.id)->>'calculated_at')::TIMESTAMPTZ
    FROM representatives r
    LEFT JOIN user_profiles up ON r.user_profile_id = up.id
    WHERE r.status = 'active'
    ORDER BY (get_representative_compliance(r.id)->>'overall_score')::NUMERIC ASC;
END;
$$;

-- ============================================================================
-- CPD PROGRESS DASHBOARD
-- ============================================================================

CREATE OR REPLACE FUNCTION get_cpd_progress_dashboard()
RETURNS TABLE(
    rep_id UUID,
    rep_name TEXT,
    earned_hours NUMERIC,
    required_hours NUMERIC,
    ethics_hours NUMERIC,
    required_ethics NUMERIC,
    percentage NUMERIC,
    cpd_status TEXT,
    compliant BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        COALESCE(up.first_name || ' ' || up.surname, 'Unknown') as rep_name,
        (calculate_cpd_compliance(r.id)->>'earned_hours')::NUMERIC,
        (calculate_cpd_compliance(r.id)->>'required_hours')::NUMERIC,
        (calculate_cpd_compliance(r.id)->>'earned_ethics')::NUMERIC,
        (calculate_cpd_compliance(r.id)->>'required_ethics')::NUMERIC,
        (calculate_cpd_compliance(r.id)->>'percentage')::NUMERIC,
        (calculate_cpd_compliance(r.id)->>'status')::TEXT,
        (calculate_cpd_compliance(r.id)->>'compliant')::BOOLEAN
    FROM representatives r
    LEFT JOIN user_profiles up ON r.user_profile_id = up.id
    WHERE r.status = 'active'
    ORDER BY (calculate_cpd_compliance(r.id)->>'percentage')::NUMERIC ASC;
END;
$$;

-- ============================================================================
-- COMPLAINTS DASHBOARD SUMMARY
-- ============================================================================

CREATE OR REPLACE FUNCTION get_complaints_dashboard_summary()
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_complaints INTEGER := 0;
    v_open_complaints INTEGER := 0;
    v_overdue_complaints INTEGER := 0;
    v_resolved_this_month INTEGER := 0;
BEGIN
    -- Note: This assumes a complaints table exists
    -- If not, returns zeros as placeholders
    
    BEGIN
        -- Try to get complaints data if table exists
        SELECT 
            COUNT(*),
            COUNT(*) FILTER (WHERE status IN ('open', 'investigating', 'pending')),
            COUNT(*) FILTER (WHERE status IN ('open', 'investigating') AND due_date < CURRENT_DATE)
        INTO v_total_complaints, v_open_complaints, v_overdue_complaints
        FROM complaints;
        
        SELECT COUNT(*)
        INTO v_resolved_this_month
        FROM complaints
        WHERE status = 'resolved'
        AND resolved_date >= DATE_TRUNC('month', CURRENT_DATE);
        
    EXCEPTION
        WHEN undefined_table THEN
            -- Complaints table doesn't exist yet
            v_total_complaints := 0;
            v_open_complaints := 0;
            v_overdue_complaints := 0;
            v_resolved_this_month := 0;
    END;
    
    RETURN json_build_object(
        'total_complaints', v_total_complaints,
        'open_complaints', v_open_complaints,
        'overdue_complaints', v_overdue_complaints,
        'resolved_this_month', v_resolved_this_month
    );
END;
$$;

-- ============================================================================
-- UPCOMING DEADLINES
-- ============================================================================

CREATE OR REPLACE FUNCTION get_upcoming_deadlines(
    p_days_ahead INTEGER DEFAULT 90
)
RETURNS TABLE(
    deadline_type TEXT,
    deadline_date DATE,
    rep_id UUID,
    rep_name TEXT,
    item_name TEXT,
    priority TEXT,
    days_until INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    -- CPD Deadlines
    SELECT 
        'CPD Requirement'::TEXT,
        cr.due_date,
        r.id,
        COALESCE(up.first_name || ' ' || up.surname, 'Unknown') as rep_name,
        'CPD Year ' || cr.year::TEXT as item_name,
        CASE 
            WHEN cr.due_date - CURRENT_DATE <= 30 THEN 'high'
            WHEN cr.due_date - CURRENT_DATE <= 60 THEN 'medium'
            ELSE 'low'
        END as priority,
        (cr.due_date - CURRENT_DATE)::INTEGER as days_until
    FROM cpd_requirements cr
    JOIN representatives r ON cr.representative_id = r.id
    LEFT JOIN user_profiles up ON r.user_profile_id = up.id
    WHERE cr.due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
    AND cr.status != 'completed'
    AND r.status = 'active'
    
    UNION ALL
    
    -- Qualification Expiry Deadlines
    SELECT 
        'Qualification Expiry'::TEXT,
        q.expiry_date,
        r.id,
        COALESCE(up.first_name || ' ' || up.surname, 'Unknown'),
        q.qualification_type || ' - ' || q.qualification_name,
        CASE 
            WHEN q.expiry_date - CURRENT_DATE <= 30 THEN 'high'
            WHEN q.expiry_date - CURRENT_DATE <= 60 THEN 'medium'
            ELSE 'low'
        END,
        (q.expiry_date - CURRENT_DATE)::INTEGER
    FROM representative_qualifications q
    JOIN representatives r ON q.representative_id = r.id
    LEFT JOIN user_profiles up ON r.user_profile_id = up.id
    WHERE q.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
    AND q.status = 'active'
    AND r.status = 'active'
    
    UNION ALL
    
    -- Document Expiry Deadlines
    SELECT 
        'Document Expiry'::TEXT,
        d.expiry_date,
        r.id,
        COALESCE(up.first_name || ' ' || up.surname, 'Unknown'),
        d.document_type || ' - ' || d.document_name,
        CASE 
            WHEN d.expiry_date - CURRENT_DATE <= 15 THEN 'high'
            WHEN d.expiry_date - CURRENT_DATE <= 30 THEN 'medium'
            ELSE 'low'
        END,
        (d.expiry_date - CURRENT_DATE)::INTEGER
    FROM representative_documents d
    JOIN representatives r ON d.representative_id = r.id
    LEFT JOIN user_profiles up ON r.user_profile_id = up.id
    WHERE d.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
    AND d.status = 'current'
    AND r.status = 'active'
    
    UNION ALL
    
    -- FICA Expiry Deadlines
    SELECT 
        'FICA Expiry'::TEXT,
        f.expiry_date,
        r.id,
        COALESCE(up.first_name || ' ' || up.surname, 'Unknown'),
        'Client: ' || f.client_name,
        CASE 
            WHEN f.expiry_date - CURRENT_DATE <= 30 THEN 'high'
            WHEN f.expiry_date - CURRENT_DATE <= 60 THEN 'medium'
            ELSE 'low'
        END,
        (f.expiry_date - CURRENT_DATE)::INTEGER
    FROM client_fica_records f
    JOIN representatives r ON f.representative_id = r.id
    LEFT JOIN user_profiles up ON r.user_profile_id = up.id
    WHERE f.expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + p_days_ahead
    AND f.verification_status = 'verified'
    AND r.status = 'active'
    
    ORDER BY deadline_date ASC, priority DESC;
END;
$$;

-- ============================================================================
-- HELPER: Get Representative Summary
-- ============================================================================

CREATE OR REPLACE FUNCTION get_representative_summary(p_representative_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_rep RECORD;
    v_compliance JSON;
BEGIN
    SELECT r.*, up.first_name, up.surname, up.email
    INTO v_rep
    FROM representatives r
    LEFT JOIN user_profiles up ON r.user_profile_id = up.id
    WHERE r.id = p_representative_id;
    
    IF v_rep IS NULL THEN
        RETURN json_build_object('error', 'Representative not found');
    END IF;
    
    -- Get compliance data
    v_compliance := get_representative_compliance(p_representative_id);
    
    RETURN json_build_object(
        'id', v_rep.id,
        'first_name', v_rep.first_name,
        'surname', v_rep.surname,
        'email', v_rep.email,
        'fsp_number', v_rep.fsp_number,
        'status', v_rep.status,
        'onboarding_date', v_rep.onboarding_date,
        'authorization_date', v_rep.authorization_date,
        'class_1_long_term', v_rep.class_1_long_term,
        'class_2_short_term', v_rep.class_2_short_term,
        'class_3_pension', v_rep.class_3_pension,
        'compliance', v_compliance,
        'is_debarred', v_rep.status = 'debarred'
    );
END;
$$;

