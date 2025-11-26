-- ============================================================================
-- iCOMPLY CRUD OPERATIONS - PHASE 3 & 4
-- Fit & Proper, CPD, Clients, FICA
-- Generated: 2025-11-26
-- ============================================================================

-- ============================================================================
-- PHASE 3: CORE COMPLIANCE TRACKING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- FIT AND PROPER RECORDS CRUD
-- ----------------------------------------------------------------------------

-- Create Fit and Proper Record
CREATE OR REPLACE FUNCTION create_fit_and_proper_record(
    p_representative_id UUID,
    p_re5_qualification_name TEXT DEFAULT NULL,
    p_re5_qualification_number TEXT DEFAULT NULL,
    p_re5_issue_date DATE DEFAULT NULL,
    p_re5_expiry_date DATE DEFAULT NULL,
    p_re1_qualification_name TEXT DEFAULT NULL,
    p_re1_qualification_number TEXT DEFAULT NULL,
    p_re1_issue_date DATE DEFAULT NULL,
    p_re1_expiry_date DATE DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_representative_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Representative ID is required');
    END IF;

    INSERT INTO fit_and_proper_records (
        representative_id, re5_qualification_name, re5_qualification_number,
        re5_issue_date, re5_expiry_date, re1_qualification_name,
        re1_qualification_number, re1_issue_date, re1_expiry_date
    )
    VALUES (
        p_representative_id, p_re5_qualification_name, p_re5_qualification_number,
        p_re5_issue_date, p_re5_expiry_date, p_re1_qualification_name,
        p_re1_qualification_number, p_re1_issue_date, p_re1_expiry_date
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Fit and proper record created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create fit and proper record: ' || SQLERRM);
END;
$$;

-- Get Fit and Proper Records
CREATE OR REPLACE FUNCTION get_fit_and_proper_records(
    p_representative_id UUID DEFAULT NULL,
    p_overall_status TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    representative_id UUID,
    re5_qualification_name TEXT,
    re5_qualification_number TEXT,
    re5_issue_date DATE,
    re5_expiry_date DATE,
    re5_status TEXT,
    re1_qualification_name TEXT,
    re1_qualification_number TEXT,
    re1_issue_date DATE,
    re1_expiry_date DATE,
    re1_status TEXT,
    cob_class_1_date DATE,
    cob_class_2_date DATE,
    cob_class_3_date DATE,
    industry_experience_years DECIMAL,
    experience_verified BOOLEAN,
    criminal_record_check_date DATE,
    criminal_record_clear BOOLEAN,
    credit_check_date DATE,
    credit_check_clear BOOLEAN,
    overall_status TEXT,
    last_review_date DATE,
    next_review_date DATE,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT fp.*
    FROM fit_and_proper_records fp
    WHERE (p_representative_id IS NULL OR fp.representative_id = p_representative_id)
      AND (p_overall_status IS NULL OR fp.overall_status = p_overall_status)
    ORDER BY fp.updated_at DESC;
END;
$$;

-- Update Fit and Proper Record
CREATE OR REPLACE FUNCTION update_fit_and_proper_record(
    p_id UUID,
    p_re5_expiry_date DATE DEFAULT NULL,
    p_re1_expiry_date DATE DEFAULT NULL,
    p_cob_class_1_date DATE DEFAULT NULL,
    p_cob_class_2_date DATE DEFAULT NULL,
    p_cob_class_3_date DATE DEFAULT NULL,
    p_industry_experience_years DECIMAL DEFAULT NULL,
    p_experience_verified BOOLEAN DEFAULT NULL,
    p_criminal_record_check_date DATE DEFAULT NULL,
    p_criminal_record_clear BOOLEAN DEFAULT NULL,
    p_credit_check_date DATE DEFAULT NULL,
    p_credit_check_clear BOOLEAN DEFAULT NULL,
    p_overall_status TEXT DEFAULT NULL,
    p_next_review_date DATE DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE fit_and_proper_records 
    SET 
        re5_expiry_date = COALESCE(p_re5_expiry_date, re5_expiry_date),
        re1_expiry_date = COALESCE(p_re1_expiry_date, re1_expiry_date),
        cob_class_1_date = COALESCE(p_cob_class_1_date, cob_class_1_date),
        cob_class_2_date = COALESCE(p_cob_class_2_date, cob_class_2_date),
        cob_class_3_date = COALESCE(p_cob_class_3_date, cob_class_3_date),
        industry_experience_years = COALESCE(p_industry_experience_years, industry_experience_years),
        experience_verified = COALESCE(p_experience_verified, experience_verified),
        criminal_record_check_date = COALESCE(p_criminal_record_check_date, criminal_record_check_date),
        criminal_record_clear = COALESCE(p_criminal_record_clear, criminal_record_clear),
        credit_check_date = COALESCE(p_credit_check_date, credit_check_date),
        credit_check_clear = COALESCE(p_credit_check_clear, credit_check_clear),
        overall_status = COALESCE(p_overall_status, overall_status),
        next_review_date = COALESCE(p_next_review_date, next_review_date),
        last_review_date = CURRENT_DATE,
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Fit and proper record updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Fit and proper record not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update fit and proper record: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- CPD CYCLES CRUD
-- ----------------------------------------------------------------------------

-- Create CPD Cycle
CREATE OR REPLACE FUNCTION create_cpd_cycle(
    p_cycle_name TEXT,
    p_start_date DATE,
    p_end_date DATE,
    p_required_hours DECIMAL DEFAULT 18.0,
    p_required_ethics_hours DECIMAL DEFAULT 3.0,
    p_required_technical_hours DECIMAL DEFAULT 14.0,
    p_status TEXT DEFAULT 'active'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_cycle_name IS NULL OR p_cycle_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Cycle name is required');
    END IF;
    
    IF p_start_date IS NULL OR p_end_date IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Start and end dates are required');
    END IF;

    INSERT INTO cpd_cycles (
        cycle_name, start_date, end_date, required_hours,
        required_ethics_hours, required_technical_hours, status
    )
    VALUES (
        p_cycle_name, p_start_date, p_end_date, p_required_hours,
        p_required_ethics_hours, p_required_technical_hours, p_status
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'CPD cycle created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create CPD cycle: ' || SQLERRM);
END;
$$;

-- Get CPD Cycles
CREATE OR REPLACE FUNCTION get_cpd_cycles(
    p_status TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    cycle_name TEXT,
    start_date DATE,
    end_date DATE,
    required_hours DECIMAL,
    required_ethics_hours DECIMAL,
    required_technical_hours DECIMAL,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT cc.*
    FROM cpd_cycles cc
    WHERE (p_status IS NULL OR cc.status = p_status)
    ORDER BY cc.start_date DESC;
END;
$$;

-- Update CPD Cycle
CREATE OR REPLACE FUNCTION update_cpd_cycle(
    p_id UUID,
    p_status TEXT DEFAULT NULL,
    p_required_hours DECIMAL DEFAULT NULL,
    p_required_ethics_hours DECIMAL DEFAULT NULL,
    p_required_technical_hours DECIMAL DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE cpd_cycles 
    SET 
        status = COALESCE(p_status, status),
        required_hours = COALESCE(p_required_hours, required_hours),
        required_ethics_hours = COALESCE(p_required_ethics_hours, required_ethics_hours),
        required_technical_hours = COALESCE(p_required_technical_hours, required_technical_hours),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'CPD cycle updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'CPD cycle not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update CPD cycle: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- CPD ACTIVITIES CRUD
-- ----------------------------------------------------------------------------

-- Create CPD Activity
CREATE OR REPLACE FUNCTION create_cpd_activity(
    p_representative_id UUID,
    p_cpd_cycle_id UUID,
    p_activity_date DATE,
    p_activity_name TEXT,
    p_activity_type TEXT,
    p_provider_name TEXT,
    p_total_hours DECIMAL,
    p_ethics_hours DECIMAL DEFAULT 0,
    p_technical_hours DECIMAL DEFAULT 0,
    p_class_1_applicable BOOLEAN DEFAULT FALSE,
    p_class_2_applicable BOOLEAN DEFAULT FALSE,
    p_class_3_applicable BOOLEAN DEFAULT FALSE,
    p_uploaded_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_activity_name IS NULL OR p_activity_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Activity name is required');
    END IF;
    
    IF p_provider_name IS NULL OR p_provider_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Provider name is required');
    END IF;
    
    IF p_total_hours IS NULL OR p_total_hours <= 0 THEN
        RETURN json_build_object('success', false, 'error', 'Total hours must be greater than 0');
    END IF;

    INSERT INTO cpd_activities (
        representative_id, cpd_cycle_id, activity_date, activity_name,
        activity_type, provider_name, total_hours, ethics_hours, technical_hours,
        class_1_applicable, class_2_applicable, class_3_applicable,
        uploaded_by, status
    )
    VALUES (
        p_representative_id, p_cpd_cycle_id, p_activity_date, p_activity_name,
        p_activity_type, p_provider_name, p_total_hours, p_ethics_hours, p_technical_hours,
        p_class_1_applicable, p_class_2_applicable, p_class_3_applicable,
        p_uploaded_by, 'pending'
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'CPD activity created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create CPD activity: ' || SQLERRM);
END;
$$;

-- Get CPD Activities
CREATE OR REPLACE FUNCTION get_cpd_activities(
    p_representative_id UUID DEFAULT NULL,
    p_cpd_cycle_id UUID DEFAULT NULL,
    p_status TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    representative_id UUID,
    cpd_cycle_id UUID,
    activity_date DATE,
    activity_name TEXT,
    activity_type TEXT,
    provider_name TEXT,
    provider_accreditation_number TEXT,
    total_hours DECIMAL,
    ethics_hours DECIMAL,
    technical_hours DECIMAL,
    class_1_applicable BOOLEAN,
    class_2_applicable BOOLEAN,
    class_3_applicable BOOLEAN,
    verifiable BOOLEAN,
    certificate_attached BOOLEAN,
    status TEXT,
    verified_by UUID,
    verified_date TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT ca.*
    FROM cpd_activities ca
    WHERE (p_representative_id IS NULL OR ca.representative_id = p_representative_id)
      AND (p_cpd_cycle_id IS NULL OR ca.cpd_cycle_id = p_cpd_cycle_id)
      AND (p_status IS NULL OR ca.status = p_status)
    ORDER BY ca.activity_date DESC;
END;
$$;

-- Update CPD Activity
CREATE OR REPLACE FUNCTION update_cpd_activity(
    p_id UUID,
    p_activity_name TEXT DEFAULT NULL,
    p_total_hours DECIMAL DEFAULT NULL,
    p_ethics_hours DECIMAL DEFAULT NULL,
    p_technical_hours DECIMAL DEFAULT NULL,
    p_certificate_attached BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE cpd_activities 
    SET 
        activity_name = COALESCE(p_activity_name, activity_name),
        total_hours = COALESCE(p_total_hours, total_hours),
        ethics_hours = COALESCE(p_ethics_hours, ethics_hours),
        technical_hours = COALESCE(p_technical_hours, technical_hours),
        certificate_attached = COALESCE(p_certificate_attached, certificate_attached),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'CPD activity updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'CPD activity not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update CPD activity: ' || SQLERRM);
END;
$$;

-- Verify CPD Activity
CREATE OR REPLACE FUNCTION verify_cpd_activity(
    p_id UUID,
    p_verified_by UUID,
    p_status TEXT,
    p_rejection_reason TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF p_status NOT IN ('verified', 'rejected') THEN
        RETURN json_build_object('success', false, 'error', 'Status must be verified or rejected');
    END IF;

    UPDATE cpd_activities 
    SET 
        status = p_status,
        verified_by = p_verified_by,
        verified_date = NOW(),
        rejection_reason = p_rejection_reason,
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'CPD activity ' || p_status || ' successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'CPD activity not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to verify CPD activity: ' || SQLERRM);
END;
$$;

-- Delete CPD Activity
CREATE OR REPLACE FUNCTION delete_cpd_activity(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM cpd_activities WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'CPD activity deleted successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'CPD activity not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete CPD activity: ' || SQLERRM);
END;
$$;

-- Get CPD Progress Summary
CREATE OR REPLACE FUNCTION get_cpd_progress_summary(
    p_representative_id UUID DEFAULT NULL,
    p_cpd_cycle_id UUID DEFAULT NULL
)
RETURNS TABLE(
    representative_id UUID,
    fsp_number TEXT,
    cpd_cycle_id UUID,
    cycle_name TEXT,
    total_hours_logged DECIMAL,
    ethics_hours_logged DECIMAL,
    technical_hours_logged DECIMAL,
    activity_count BIGINT,
    progress_percentage NUMERIC,
    compliance_status TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT cps.*
    FROM cpd_progress_summary cps
    WHERE (p_representative_id IS NULL OR cps.representative_id = p_representative_id)
      AND (p_cpd_cycle_id IS NULL OR cps.cpd_cycle_id = p_cpd_cycle_id)
    ORDER BY cps.compliance_status, cps.progress_percentage DESC;
END;
$$;

-- ============================================================================
-- PHASE 4: CLIENTS & FICA
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CLIENTS CRUD
-- ----------------------------------------------------------------------------

-- Create Client
CREATE OR REPLACE FUNCTION create_client(
    p_assigned_representative_id UUID,
    p_client_type TEXT,
    p_title TEXT DEFAULT NULL,
    p_first_name TEXT DEFAULT NULL,
    p_last_name TEXT DEFAULT NULL,
    p_id_number TEXT DEFAULT NULL,
    p_date_of_birth DATE DEFAULT NULL,
    p_company_name TEXT DEFAULT NULL,
    p_registration_number TEXT DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_client_since DATE DEFAULT NULL,
    p_risk_category TEXT DEFAULT 'low'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_client_type IS NULL OR p_client_type = '' THEN
        RETURN json_build_object('success', false, 'error', 'Client type is required');
    END IF;
    
    -- Validate based on client type
    IF p_client_type = 'individual' AND (p_first_name IS NULL OR p_last_name IS NULL) THEN
        RETURN json_build_object('success', false, 'error', 'First and last name required for individual clients');
    END IF;
    
    IF p_client_type = 'corporate' AND p_company_name IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Company name required for corporate clients');
    END IF;

    INSERT INTO clients (
        assigned_representative_id, client_type, title, first_name, last_name,
        id_number, date_of_birth, company_name, registration_number,
        email, phone, mobile, client_since, risk_category, status
    )
    VALUES (
        p_assigned_representative_id, p_client_type, p_title, p_first_name, p_last_name,
        p_id_number, p_date_of_birth, p_company_name, p_registration_number,
        p_email, p_phone, p_mobile, COALESCE(p_client_since, CURRENT_DATE), p_risk_category, 'active'
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Client created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create client: ' || SQLERRM);
END;
$$;

-- Get Clients
CREATE OR REPLACE FUNCTION get_clients(
    p_assigned_representative_id UUID DEFAULT NULL,
    p_client_type TEXT DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_risk_category TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    assigned_representative_id UUID,
    client_type TEXT,
    title TEXT,
    first_name TEXT,
    last_name TEXT,
    id_number TEXT,
    date_of_birth DATE,
    company_name TEXT,
    registration_number TEXT,
    vat_number TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    status TEXT,
    client_since DATE,
    risk_category TEXT,
    pep_status BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT c.*
    FROM clients c
    WHERE (p_assigned_representative_id IS NULL OR c.assigned_representative_id = p_assigned_representative_id)
      AND (p_client_type IS NULL OR c.client_type = p_client_type)
      AND (p_status IS NULL OR c.status = p_status)
      AND (p_risk_category IS NULL OR c.risk_category = p_risk_category)
    ORDER BY c.created_at DESC;
END;
$$;

-- Get Single Client
CREATE OR REPLACE FUNCTION get_client(p_id UUID)
RETURNS TABLE(
    id UUID,
    assigned_representative_id UUID,
    client_type TEXT,
    title TEXT,
    first_name TEXT,
    last_name TEXT,
    id_number TEXT,
    date_of_birth DATE,
    company_name TEXT,
    registration_number TEXT,
    vat_number TEXT,
    email TEXT,
    phone TEXT,
    mobile TEXT,
    address_street TEXT,
    address_suburb TEXT,
    address_city TEXT,
    address_province TEXT,
    address_postal_code TEXT,
    status TEXT,
    client_since DATE,
    risk_category TEXT,
    pep_status BOOLEAN,
    sanctions_check BOOLEAN,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT c.*
    FROM clients c
    WHERE c.id = p_id;
END;
$$;

-- Update Client
CREATE OR REPLACE FUNCTION update_client(
    p_id UUID,
    p_assigned_representative_id UUID DEFAULT NULL,
    p_email TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_mobile TEXT DEFAULT NULL,
    p_address_street TEXT DEFAULT NULL,
    p_address_city TEXT DEFAULT NULL,
    p_address_province TEXT DEFAULT NULL,
    p_address_postal_code TEXT DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_risk_category TEXT DEFAULT NULL,
    p_pep_status BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE clients 
    SET 
        assigned_representative_id = COALESCE(p_assigned_representative_id, assigned_representative_id),
        email = COALESCE(p_email, email),
        phone = COALESCE(p_phone, phone),
        mobile = COALESCE(p_mobile, mobile),
        address_street = COALESCE(p_address_street, address_street),
        address_city = COALESCE(p_address_city, address_city),
        address_province = COALESCE(p_address_province, address_province),
        address_postal_code = COALESCE(p_address_postal_code, address_postal_code),
        status = COALESCE(p_status, status),
        risk_category = COALESCE(p_risk_category, risk_category),
        pep_status = COALESCE(p_pep_status, pep_status),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Client updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Client not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update client: ' || SQLERRM);
END;
$$;

-- Soft Delete Client
CREATE OR REPLACE FUNCTION delete_client(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE clients 
    SET status = 'inactive', updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Client deactivated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Client not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to deactivate client: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- FICA VERIFICATIONS CRUD
-- ----------------------------------------------------------------------------

-- Create FICA Verification
CREATE OR REPLACE FUNCTION create_fica_verification(
    p_client_id UUID,
    p_representative_id UUID,
    p_verification_type TEXT,
    p_verification_date DATE DEFAULT CURRENT_DATE,
    p_review_frequency_months INTEGER DEFAULT 60
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_verification_type IS NULL OR p_verification_type = '' THEN
        RETURN json_build_object('success', false, 'error', 'Verification type is required');
    END IF;

    INSERT INTO fica_verifications (
        client_id, representative_id, verification_type, verification_date,
        review_frequency_months, fica_status
    )
    VALUES (
        p_client_id, p_representative_id, p_verification_type, p_verification_date,
        p_review_frequency_months, 'pending'
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'FICA verification created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create FICA verification: ' || SQLERRM);
END;
$$;

-- Get FICA Verifications
CREATE OR REPLACE FUNCTION get_fica_verifications(
    p_client_id UUID DEFAULT NULL,
    p_representative_id UUID DEFAULT NULL,
    p_fica_status TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    client_id UUID,
    representative_id UUID,
    verification_type TEXT,
    verification_date DATE,
    id_document_type TEXT,
    id_document_verified BOOLEAN,
    address_document_verified BOOLEAN,
    bank_details_verified BOOLEAN,
    tax_reference_verified BOOLEAN,
    fica_status TEXT,
    completeness_percentage INTEGER,
    next_review_date DATE,
    verified_by UUID,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT fv.id, fv.client_id, fv.representative_id, fv.verification_type,
           fv.verification_date, fv.id_document_type, fv.id_document_verified,
           fv.address_document_verified, fv.bank_details_verified,
           fv.tax_reference_verified, fv.fica_status, fv.completeness_percentage,
           fv.next_review_date, fv.verified_by, fv.created_at, fv.updated_at
    FROM fica_verifications fv
    WHERE (p_client_id IS NULL OR fv.client_id = p_client_id)
      AND (p_representative_id IS NULL OR fv.representative_id = p_representative_id)
      AND (p_fica_status IS NULL OR fv.fica_status = p_fica_status)
    ORDER BY fv.verification_date DESC;
END;
$$;

-- Update FICA Verification
CREATE OR REPLACE FUNCTION update_fica_verification(
    p_id UUID,
    p_id_document_type TEXT DEFAULT NULL,
    p_id_document_verified BOOLEAN DEFAULT NULL,
    p_address_document_verified BOOLEAN DEFAULT NULL,
    p_bank_details_verified BOOLEAN DEFAULT NULL,
    p_tax_reference_verified BOOLEAN DEFAULT NULL,
    p_fica_status TEXT DEFAULT NULL,
    p_verified_by UUID DEFAULT NULL,
    p_verification_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_completeness INTEGER;
BEGIN
    -- Calculate completeness percentage
    SELECT 
        (CASE WHEN COALESCE(p_id_document_verified, id_document_verified) THEN 25 ELSE 0 END +
         CASE WHEN COALESCE(p_address_document_verified, address_document_verified) THEN 25 ELSE 0 END +
         CASE WHEN COALESCE(p_bank_details_verified, bank_details_verified) THEN 25 ELSE 0 END +
         CASE WHEN COALESCE(p_tax_reference_verified, tax_reference_verified) THEN 25 ELSE 0 END)
    INTO v_completeness
    FROM fica_verifications
    WHERE id = p_id;

    UPDATE fica_verifications 
    SET 
        id_document_type = COALESCE(p_id_document_type, id_document_type),
        id_document_verified = COALESCE(p_id_document_verified, id_document_verified),
        address_document_verified = COALESCE(p_address_document_verified, address_document_verified),
        bank_details_verified = COALESCE(p_bank_details_verified, bank_details_verified),
        tax_reference_verified = COALESCE(p_tax_reference_verified, tax_reference_verified),
        fica_status = COALESCE(p_fica_status, fica_status),
        completeness_percentage = v_completeness,
        verified_by = COALESCE(p_verified_by, verified_by),
        verification_notes = COALESCE(p_verification_notes, verification_notes),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'FICA verification updated successfully', 'completeness', v_completeness);
    ELSE
        RETURN json_build_object('success', false, 'error', 'FICA verification not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update FICA verification: ' || SQLERRM);
END;
$$;

-- Delete FICA Verification
CREATE OR REPLACE FUNCTION delete_fica_verification(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM fica_verifications WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'FICA verification deleted successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'FICA verification not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete FICA verification: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- CLIENT BENEFICIAL OWNERS CRUD
-- ----------------------------------------------------------------------------

-- Create Client Beneficial Owner
CREATE OR REPLACE FUNCTION create_client_beneficial_owner(
    p_client_id UUID,
    p_full_name TEXT,
    p_id_number TEXT DEFAULT NULL,
    p_nationality TEXT DEFAULT NULL,
    p_ownership_percentage DECIMAL DEFAULT NULL,
    p_control_type TEXT DEFAULT NULL,
    p_pep_status BOOLEAN DEFAULT FALSE
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_full_name IS NULL OR p_full_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Full name is required');
    END IF;

    INSERT INTO client_beneficial_owners (
        client_id, full_name, id_number, nationality,
        ownership_percentage, control_type, pep_status
    )
    VALUES (
        p_client_id, p_full_name, p_id_number, p_nationality,
        p_ownership_percentage, p_control_type, p_pep_status
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Beneficial owner created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create beneficial owner: ' || SQLERRM);
END;
$$;

-- Get Client Beneficial Owners
CREATE OR REPLACE FUNCTION get_client_beneficial_owners(
    p_client_id UUID
)
RETURNS TABLE(
    id UUID,
    client_id UUID,
    full_name TEXT,
    id_number TEXT,
    nationality TEXT,
    ownership_percentage DECIMAL,
    control_type TEXT,
    id_verified BOOLEAN,
    id_verification_date DATE,
    pep_status BOOLEAN,
    pep_relationship TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT cbo.*
    FROM client_beneficial_owners cbo
    WHERE cbo.client_id = p_client_id
    ORDER BY cbo.ownership_percentage DESC NULLS LAST;
END;
$$;

-- Update Client Beneficial Owner
CREATE OR REPLACE FUNCTION update_client_beneficial_owner(
    p_id UUID,
    p_ownership_percentage DECIMAL DEFAULT NULL,
    p_id_verified BOOLEAN DEFAULT NULL,
    p_id_verification_date DATE DEFAULT NULL,
    p_pep_status BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE client_beneficial_owners 
    SET 
        ownership_percentage = COALESCE(p_ownership_percentage, ownership_percentage),
        id_verified = COALESCE(p_id_verified, id_verified),
        id_verification_date = COALESCE(p_id_verification_date, id_verification_date),
        pep_status = COALESCE(p_pep_status, pep_status),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Beneficial owner updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Beneficial owner not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update beneficial owner: ' || SQLERRM);
END;
$$;

-- Delete Client Beneficial Owner
CREATE OR REPLACE FUNCTION delete_client_beneficial_owner(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    DELETE FROM client_beneficial_owners WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Beneficial owner deleted successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Beneficial owner not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete beneficial owner: ' || SQLERRM);
END;
$$;

-- ============================================================================
-- RBAC PERMISSIONS FOR PHASE 3 & 4 FUNCTIONS
-- ============================================================================

-- Add EXECUTE permissions for Admin role
INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
SELECT r.id, 'function', func.function_name, 'EXECUTE', true
FROM roles r
CROSS JOIN (VALUES 
    -- Phase 3 Functions
    ('create_fit_and_proper_record'), ('get_fit_and_proper_records'), ('update_fit_and_proper_record'),
    ('create_cpd_cycle'), ('get_cpd_cycles'), ('update_cpd_cycle'),
    ('create_cpd_activity'), ('get_cpd_activities'), ('update_cpd_activity'), ('verify_cpd_activity'), ('delete_cpd_activity'),
    ('get_cpd_progress_summary'),
    -- Phase 4 Functions
    ('create_client'), ('get_clients'), ('get_client'), ('update_client'), ('delete_client'),
    ('create_fica_verification'), ('get_fica_verifications'), ('update_fica_verification'), ('delete_fica_verification'),
    ('create_client_beneficial_owner'), ('get_client_beneficial_owners'), ('update_client_beneficial_owner'), ('delete_client_beneficial_owner')
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

-- Add read-only permissions for User role
INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
SELECT r.id, 'function', func.function_name, 'EXECUTE', true
FROM roles r
CROSS JOIN (VALUES 
    ('get_fit_and_proper_records'), ('get_cpd_cycles'), ('get_cpd_activities'), ('get_cpd_progress_summary'),
    ('get_clients'), ('get_client'), ('get_fica_verifications'), ('get_client_beneficial_owners'),
    ('create_cpd_activity'), ('update_cpd_activity')
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

-- ============================================================================
-- END OF PHASE 3-4 CRUD OPERATIONS
-- ============================================================================

