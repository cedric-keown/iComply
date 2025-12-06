-- ============================================================================
-- COMPLIANCE TRACKING SYSTEM
-- Complete implementation for CPD, Fit & Proper, FICA, and Document Management
-- ============================================================================

-- ============================================================================
-- 1. CPD (Continuing Professional Development) TABLES
-- ============================================================================

-- CPD Records Table
CREATE TABLE IF NOT EXISTS cpd_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID NOT NULL REFERENCES representatives(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN ('course', 'seminar', 'webinar', 'conference', 'self_study', 'other')),
    activity_name TEXT NOT NULL,
    provider TEXT,
    activity_date DATE NOT NULL,
    hours_earned NUMERIC(5,2) NOT NULL CHECK (hours_earned > 0),
    ethics_hours NUMERIC(5,2) DEFAULT 0 CHECK (ethics_hours >= 0),
    verifiable BOOLEAN DEFAULT true,
    verification_document TEXT,
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- CPD Requirements Table (annual requirements per representative)
CREATE TABLE IF NOT EXISTS cpd_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID NOT NULL REFERENCES representatives(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    required_hours NUMERIC(5,2) DEFAULT 18,
    required_ethics_hours NUMERIC(5,2) DEFAULT 3,
    due_date DATE NOT NULL,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'overdue')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(representative_id, year)
);

-- ============================================================================
-- 2. FIT & PROPER TABLES
-- ============================================================================

-- Qualifications/Certifications Table
CREATE TABLE IF NOT EXISTS representative_qualifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID NOT NULL REFERENCES representatives(id) ON DELETE CASCADE,
    qualification_type TEXT NOT NULL CHECK (qualification_type IN ('RE1', 'RE5', 'degree', 'diploma', 'certificate', 'other')),
    qualification_name TEXT NOT NULL,
    issuing_authority TEXT,
    issue_date DATE,
    expiry_date DATE,
    is_current BOOLEAN DEFAULT true,
    verification_document TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'expired', 'pending_renewal', 'revoked')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Background Checks Table
CREATE TABLE IF NOT EXISTS background_checks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID NOT NULL REFERENCES representatives(id) ON DELETE CASCADE,
    check_type TEXT NOT NULL CHECK (check_type IN ('criminal', 'credit', 'regulatory', 'employment', 'other')),
    check_date DATE NOT NULL,
    expiry_date DATE,
    result TEXT CHECK (result IN ('clear', 'issues_found', 'pending')),
    verified_by TEXT,
    verification_document TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 3. FICA/KYC VERIFICATION TABLES
-- ============================================================================

-- Client FICA Records
CREATE TABLE IF NOT EXISTS client_fica_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID, -- Would reference clients table
    representative_id UUID REFERENCES representatives(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'expired', 'rejected')),
    verification_date DATE,
    expiry_date DATE,
    id_verified BOOLEAN DEFAULT false,
    address_verified BOOLEAN DEFAULT false,
    source_of_funds_verified BOOLEAN DEFAULT false,
    tax_status_verified BOOLEAN DEFAULT false,
    risk_rating TEXT CHECK (risk_rating IN ('low', 'medium', 'high')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- FICA Documents
CREATE TABLE IF NOT EXISTS fica_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fica_record_id UUID NOT NULL REFERENCES client_fica_records(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('id_document', 'proof_of_address', 'tax_clearance', 'bank_statement', 'other')),
    document_name TEXT NOT NULL,
    document_url TEXT,
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    verified BOOLEAN DEFAULT false,
    verified_by UUID,
    verified_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. DOCUMENT MANAGEMENT TABLES
-- ============================================================================

-- Representative Documents
CREATE TABLE IF NOT EXISTS representative_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID NOT NULL REFERENCES representatives(id) ON DELETE CASCADE,
    document_type TEXT NOT NULL CHECK (document_type IN ('contract', 'mandate', 'qualification', 'compliance', 'id', 'tax', 'other')),
    document_name TEXT NOT NULL,
    document_url TEXT,
    issue_date DATE,
    expiry_date DATE,
    is_current BOOLEAN DEFAULT true,
    requires_renewal BOOLEAN DEFAULT false,
    renewal_reminder_days INTEGER DEFAULT 30,
    status TEXT DEFAULT 'current' CHECK (status IN ('current', 'expiring_soon', 'expired', 'archived')),
    notes TEXT,
    uploaded_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_cpd_records_rep ON cpd_records(representative_id);
CREATE INDEX IF NOT EXISTS idx_cpd_records_date ON cpd_records(activity_date);
CREATE INDEX IF NOT EXISTS idx_cpd_requirements_rep ON cpd_requirements(representative_id);
CREATE INDEX IF NOT EXISTS idx_cpd_requirements_year ON cpd_requirements(year);

CREATE INDEX IF NOT EXISTS idx_qualifications_rep ON representative_qualifications(representative_id);
CREATE INDEX IF NOT EXISTS idx_qualifications_expiry ON representative_qualifications(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_qualifications_status ON representative_qualifications(status);

CREATE INDEX IF NOT EXISTS idx_background_checks_rep ON background_checks(representative_id);
CREATE INDEX IF NOT EXISTS idx_background_checks_expiry ON background_checks(expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_fica_records_rep ON client_fica_records(representative_id);
CREATE INDEX IF NOT EXISTS idx_fica_records_status ON client_fica_records(verification_status);
CREATE INDEX IF NOT EXISTS idx_fica_records_expiry ON client_fica_records(expiry_date) WHERE expiry_date IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_rep_documents_rep ON representative_documents(representative_id);
CREATE INDEX IF NOT EXISTS idx_rep_documents_expiry ON representative_documents(expiry_date) WHERE expiry_date IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_rep_documents_status ON representative_documents(status);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cpd_records_updated_at BEFORE UPDATE ON cpd_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cpd_requirements_updated_at BEFORE UPDATE ON cpd_requirements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qualifications_updated_at BEFORE UPDATE ON representative_qualifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_background_checks_updated_at BEFORE UPDATE ON background_checks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_fica_records_updated_at BEFORE UPDATE ON client_fica_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rep_documents_updated_at BEFORE UPDATE ON representative_documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- COMPLIANCE CALCULATION FUNCTIONS
-- ============================================================================

-- Calculate CPD Compliance for a Representative
CREATE OR REPLACE FUNCTION calculate_cpd_compliance(
    p_representative_id UUID,
    p_year INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_year INTEGER;
    v_required_hours NUMERIC;
    v_required_ethics NUMERIC;
    v_earned_hours NUMERIC;
    v_earned_ethics NUMERIC;
    v_status TEXT;
    v_percentage NUMERIC;
BEGIN
    v_year := COALESCE(p_year, EXTRACT(YEAR FROM CURRENT_DATE)::INTEGER);
    
    -- Get requirements
    SELECT required_hours, required_ethics_hours
    INTO v_required_hours, v_required_ethics
    FROM cpd_requirements
    WHERE representative_id = p_representative_id AND year = v_year;
    
    -- Default requirements if not set
    v_required_hours := COALESCE(v_required_hours, 18);
    v_required_ethics := COALESCE(v_required_ethics, 3);
    
    -- Calculate earned hours
    SELECT 
        COALESCE(SUM(hours_earned), 0),
        COALESCE(SUM(ethics_hours), 0)
    INTO v_earned_hours, v_earned_ethics
    FROM cpd_records
    WHERE representative_id = p_representative_id 
        AND EXTRACT(YEAR FROM activity_date) = v_year
        AND status = 'approved';
    
    -- Determine status
    v_percentage := CASE WHEN v_required_hours > 0 
        THEN (v_earned_hours / v_required_hours) * 100 
        ELSE 0 
    END;
    
    IF v_earned_hours >= v_required_hours AND v_earned_ethics >= v_required_ethics THEN
        v_status := 'completed';
    ELSIF v_percentage >= 67 THEN
        v_status := 'in_progress';
    ELSE
        v_status := 'behind';
    END IF;
    
    RETURN json_build_object(
        'year', v_year,
        'required_hours', v_required_hours,
        'required_ethics', v_required_ethics,
        'earned_hours', v_earned_hours,
        'earned_ethics', v_earned_ethics,
        'percentage', ROUND(v_percentage, 2),
        'status', v_status,
        'compliant', v_earned_hours >= v_required_hours AND v_earned_ethics >= v_required_ethics
    );
END;
$$;

-- Calculate Fit & Proper Compliance
CREATE OR REPLACE FUNCTION calculate_fp_compliance(
    p_representative_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_has_re5 BOOLEAN;
    v_has_re1 BOOLEAN;
    v_re5_expiry DATE;
    v_re1_expiry DATE;
    v_expired_count INTEGER;
    v_expiring_soon_count INTEGER;
    v_status TEXT;
BEGIN
    -- Check RE5
    SELECT 
        COUNT(*) > 0,
        MAX(expiry_date)
    INTO v_has_re5, v_re5_expiry
    FROM representative_qualifications
    WHERE representative_id = p_representative_id 
        AND qualification_type = 'RE5'
        AND status = 'active'
        AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE);
    
    -- Check RE1
    SELECT 
        COUNT(*) > 0,
        MAX(expiry_date)
    INTO v_has_re1, v_re1_expiry
    FROM representative_qualifications
    WHERE representative_id = p_representative_id 
        AND qualification_type = 'RE1'
        AND status = 'active'
        AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE);
    
    -- Count expired qualifications
    SELECT COUNT(*)
    INTO v_expired_count
    FROM representative_qualifications
    WHERE representative_id = p_representative_id 
        AND expiry_date IS NOT NULL
        AND expiry_date < CURRENT_DATE
        AND status != 'revoked';
    
    -- Count expiring soon (within 90 days)
    SELECT COUNT(*)
    INTO v_expiring_soon_count
    FROM representative_qualifications
    WHERE representative_id = p_representative_id 
        AND expiry_date IS NOT NULL
        AND expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
        AND status = 'active';
    
    -- Determine status
    IF v_expired_count > 0 THEN
        v_status := 'non_compliant';
    ELSIF v_expiring_soon_count > 0 THEN
        v_status := 'warning';
    ELSIF v_has_re5 AND v_has_re1 THEN
        v_status := 'compliant';
    ELSE
        v_status := 'warning';
    END IF;
    
    RETURN json_build_object(
        'has_re5', COALESCE(v_has_re5, false),
        'has_re1', COALESCE(v_has_re1, false),
        're5_expiry', v_re5_expiry,
        're1_expiry', v_re1_expiry,
        'expired_count', v_expired_count,
        'expiring_soon_count', v_expiring_soon_count,
        'status', v_status,
        'compliant', v_status = 'compliant'
    );
END;
$$;

-- Calculate FICA Compliance
CREATE OR REPLACE FUNCTION calculate_fica_compliance(
    p_representative_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_clients INTEGER;
    v_verified_clients INTEGER;
    v_expired_clients INTEGER;
    v_pending_clients INTEGER;
    v_percentage NUMERIC;
    v_status TEXT;
BEGIN
    -- Count total clients
    SELECT COUNT(*)
    INTO v_total_clients
    FROM client_fica_records
    WHERE representative_id = p_representative_id;
    
    -- Count verified clients
    SELECT COUNT(*)
    INTO v_verified_clients
    FROM client_fica_records
    WHERE representative_id = p_representative_id 
        AND verification_status = 'verified'
        AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE);
    
    -- Count expired
    SELECT COUNT(*)
    INTO v_expired_clients
    FROM client_fica_records
    WHERE representative_id = p_representative_id 
        AND (verification_status = 'expired' 
             OR (expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE));
    
    -- Count pending
    SELECT COUNT(*)
    INTO v_pending_clients
    FROM client_fica_records
    WHERE representative_id = p_representative_id 
        AND verification_status = 'pending';
    
    -- Calculate percentage
    v_percentage := CASE WHEN v_total_clients > 0 
        THEN (v_verified_clients::NUMERIC / v_total_clients::NUMERIC) * 100 
        ELSE 100 
    END;
    
    -- Determine status
    IF v_expired_clients > 5 THEN
        v_status := 'critical';
    ELSIF v_expired_clients > 0 OR v_pending_clients > 0 THEN
        v_status := 'warning';
    ELSE
        v_status := 'current';
    END IF;
    
    RETURN json_build_object(
        'total_clients', v_total_clients,
        'verified_clients', v_verified_clients,
        'expired_clients', v_expired_clients,
        'pending_clients', v_pending_clients,
        'percentage', ROUND(v_percentage, 2),
        'status', v_status,
        'compliant', v_expired_clients = 0
    );
END;
$$;

-- Calculate Document Compliance
CREATE OR REPLACE FUNCTION calculate_document_compliance(
    p_representative_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_total_docs INTEGER;
    v_current_docs INTEGER;
    v_expired_docs INTEGER;
    v_expiring_soon INTEGER;
    v_percentage NUMERIC;
    v_status TEXT;
BEGIN
    -- Count total documents
    SELECT COUNT(*)
    INTO v_total_docs
    FROM representative_documents
    WHERE representative_id = p_representative_id
        AND status != 'archived';
    
    -- Count current documents
    SELECT COUNT(*)
    INTO v_current_docs
    FROM representative_documents
    WHERE representative_id = p_representative_id 
        AND status = 'current'
        AND (expiry_date IS NULL OR expiry_date > CURRENT_DATE);
    
    -- Count expired
    SELECT COUNT(*)
    INTO v_expired_docs
    FROM representative_documents
    WHERE representative_id = p_representative_id 
        AND (status = 'expired' 
             OR (expiry_date IS NOT NULL AND expiry_date < CURRENT_DATE));
    
    -- Count expiring soon (within 30 days)
    SELECT COUNT(*)
    INTO v_expiring_soon
    FROM representative_documents
    WHERE representative_id = p_representative_id 
        AND expiry_date IS NOT NULL
        AND expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
        AND status = 'current';
    
    -- Calculate percentage
    v_percentage := CASE WHEN v_total_docs > 0 
        THEN (v_current_docs::NUMERIC / v_total_docs::NUMERIC) * 100 
        ELSE 100 
    END;
    
    -- Determine status
    IF v_expired_docs > 3 THEN
        v_status := 'expired';
    ELSIF v_expired_docs > 0 OR v_expiring_soon > 2 THEN
        v_status := 'warning';
    ELSE
        v_status := 'current';
    END IF;
    
    RETURN json_build_object(
        'total_documents', v_total_docs,
        'current_documents', v_current_docs,
        'expired_documents', v_expired_docs,
        'expiring_soon', v_expiring_soon,
        'percentage', ROUND(v_percentage, 2),
        'status', v_status,
        'compliant', v_expired_docs = 0
    );
END;
$$;

-- ============================================================================
-- COMPREHENSIVE COMPLIANCE CALCULATION
-- ============================================================================

CREATE OR REPLACE FUNCTION get_representative_compliance(
    p_representative_id UUID,
    p_year INTEGER DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_cpd JSON;
    v_fp JSON;
    v_fica JSON;
    v_docs JSON;
    v_overall_score NUMERIC;
    v_overall_status TEXT;
    v_rep_status TEXT;
BEGIN
    -- Get representative status
    SELECT status INTO v_rep_status
    FROM representatives
    WHERE id = p_representative_id;
    
    -- If suspended or terminated, mark as non-compliant
    IF v_rep_status IN ('suspended', 'terminated', 'debarred') THEN
        RETURN json_build_object(
            'representative_id', p_representative_id,
            'status', v_rep_status,
            'overall_status', 'non_compliant',
            'overall_score', 0,
            'cpd', json_build_object('status', 'n/a', 'compliant', false),
            'fit_proper', json_build_object('status', 'n/a', 'compliant', false),
            'fica', json_build_object('status', 'n/a', 'compliant', false),
            'documents', json_build_object('status', 'n/a', 'compliant', false)
        );
    END IF;
    
    -- Calculate each component
    v_cpd := calculate_cpd_compliance(p_representative_id, p_year);
    v_fp := calculate_fp_compliance(p_representative_id);
    v_fica := calculate_fica_compliance(p_representative_id);
    v_docs := calculate_document_compliance(p_representative_id);
    
    -- Calculate overall score (weighted average)
    v_overall_score := (
        ((v_cpd->>'percentage')::NUMERIC * 0.30) +  -- CPD: 30%
        (CASE WHEN (v_fp->>'compliant')::BOOLEAN THEN 100 ELSE 0 END * 0.30) +  -- F&P: 30%
        ((v_fica->>'percentage')::NUMERIC * 0.25) +  -- FICA: 25%
        ((v_docs->>'percentage')::NUMERIC * 0.15)  -- Docs: 15%
    );
    
    -- Determine overall status
    IF v_overall_score >= 80 AND (v_cpd->>'compliant')::BOOLEAN AND (v_fp->>'compliant')::BOOLEAN THEN
        v_overall_status := 'compliant';
    ELSIF v_overall_score >= 60 THEN
        v_overall_status := 'at_risk';
    ELSE
        v_overall_status := 'non_compliant';
    END IF;
    
    RETURN json_build_object(
        'representative_id', p_representative_id,
        'status', v_rep_status,
        'overall_status', v_overall_status,
        'overall_score', ROUND(v_overall_score, 2),
        'cpd', v_cpd,
        'fit_proper', v_fp,
        'fica', v_fica,
        'documents', v_docs,
        'calculated_at', NOW()
    );
END;
$$;

-- Get compliance for all representatives
CREATE OR REPLACE FUNCTION get_all_representatives_compliance(
    p_year INTEGER DEFAULT NULL
)
RETURNS TABLE(
    representative_id UUID,
    overall_status TEXT,
    overall_score NUMERIC,
    compliance_data JSON
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        (get_representative_compliance(r.id, p_year)->>'overall_status')::TEXT,
        (get_representative_compliance(r.id, p_year)->>'overall_score')::NUMERIC,
        get_representative_compliance(r.id, p_year)
    FROM representatives r
    WHERE r.status = 'active'
    ORDER BY (get_representative_compliance(r.id, p_year)->>'overall_score')::NUMERIC ASC;
END;
$$;

-- ============================================================================
-- CRUD FUNCTIONS FOR CPD
-- ============================================================================

CREATE OR REPLACE FUNCTION create_cpd_record(
    p_representative_id UUID,
    p_activity_type TEXT,
    p_activity_name TEXT,
    p_provider TEXT,
    p_activity_date DATE,
    p_hours_earned NUMERIC,
    p_ethics_hours NUMERIC DEFAULT 0,
    p_verifiable BOOLEAN DEFAULT true,
    p_verification_document TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO cpd_records (
        representative_id, activity_type, activity_name, provider,
        activity_date, hours_earned, ethics_hours, verifiable,
        verification_document, notes
    )
    VALUES (
        p_representative_id, p_activity_type, p_activity_name, p_provider,
        p_activity_date, p_hours_earned, p_ethics_hours, p_verifiable,
        p_verification_document, p_notes
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'CPD record created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

CREATE OR REPLACE FUNCTION get_cpd_records(
    p_representative_id UUID,
    p_year INTEGER DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    activity_type TEXT,
    activity_name TEXT,
    provider TEXT,
    activity_date DATE,
    hours_earned NUMERIC,
    ethics_hours NUMERIC,
    status TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id, c.activity_type, c.activity_name, c.provider,
        c.activity_date, c.hours_earned, c.ethics_hours, c.status, c.created_at
    FROM cpd_records c
    WHERE c.representative_id = p_representative_id
        AND (p_year IS NULL OR EXTRACT(YEAR FROM c.activity_date) = p_year)
    ORDER BY c.activity_date DESC;
END;
$$;

-- ============================================================================
-- CRUD FUNCTIONS FOR FIT & PROPER
-- ============================================================================

CREATE OR REPLACE FUNCTION create_qualification(
    p_representative_id UUID,
    p_qualification_type TEXT,
    p_qualification_name TEXT,
    p_issuing_authority TEXT DEFAULT NULL,
    p_issue_date DATE DEFAULT NULL,
    p_expiry_date DATE DEFAULT NULL,
    p_verification_document TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO representative_qualifications (
        representative_id, qualification_type, qualification_name,
        issuing_authority, issue_date, expiry_date,
        verification_document, notes
    )
    VALUES (
        p_representative_id, p_qualification_type, p_qualification_name,
        p_issuing_authority, p_issue_date, p_expiry_date,
        p_verification_document, p_notes
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Qualification created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

CREATE OR REPLACE FUNCTION get_qualifications(
    p_representative_id UUID
)
RETURNS TABLE(
    id UUID,
    qualification_type TEXT,
    qualification_name TEXT,
    issuing_authority TEXT,
    issue_date DATE,
    expiry_date DATE,
    status TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        q.id, q.qualification_type, q.qualification_name, q.issuing_authority,
        q.issue_date, q.expiry_date, q.status, q.created_at
    FROM representative_qualifications q
    WHERE q.representative_id = p_representative_id
    ORDER BY q.expiry_date NULLS LAST, q.created_at DESC;
END;
$$;

-- ============================================================================
-- CRUD FUNCTIONS FOR FICA
-- ============================================================================

CREATE OR REPLACE FUNCTION create_fica_record(
    p_representative_id UUID,
    p_client_name TEXT,
    p_verification_status TEXT DEFAULT 'pending',
    p_risk_rating TEXT DEFAULT 'medium'
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO client_fica_records (
        representative_id, client_name, verification_status, risk_rating
    )
    VALUES (
        p_representative_id, p_client_name, p_verification_status, p_risk_rating
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'FICA record created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

CREATE OR REPLACE FUNCTION get_fica_records(
    p_representative_id UUID
)
RETURNS TABLE(
    id UUID,
    client_name TEXT,
    verification_status TEXT,
    verification_date DATE,
    expiry_date DATE,
    risk_rating TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        f.id, f.client_name, f.verification_status, f.verification_date,
        f.expiry_date, f.risk_rating, f.created_at
    FROM client_fica_records f
    WHERE f.representative_id = p_representative_id
    ORDER BY f.verification_date DESC NULLS LAST, f.created_at DESC;
END;
$$;

-- ============================================================================
-- CRUD FUNCTIONS FOR DOCUMENTS
-- ============================================================================

CREATE OR REPLACE FUNCTION create_document(
    p_representative_id UUID,
    p_document_type TEXT,
    p_document_name TEXT,
    p_document_url TEXT DEFAULT NULL,
    p_issue_date DATE DEFAULT NULL,
    p_expiry_date DATE DEFAULT NULL,
    p_requires_renewal BOOLEAN DEFAULT false
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO representative_documents (
        representative_id, document_type, document_name,
        document_url, issue_date, expiry_date, requires_renewal
    )
    VALUES (
        p_representative_id, p_document_type, p_document_name,
        p_document_url, p_issue_date, p_expiry_date, p_requires_renewal
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Document created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;

CREATE OR REPLACE FUNCTION get_documents(
    p_representative_id UUID
)
RETURNS TABLE(
    id UUID,
    document_type TEXT,
    document_name TEXT,
    document_url TEXT,
    issue_date DATE,
    expiry_date DATE,
    status TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id, d.document_type, d.document_name, d.document_url,
        d.issue_date, d.expiry_date, d.status, d.created_at
    FROM representative_documents d
    WHERE d.representative_id = p_representative_id
        AND d.status != 'archived'
    ORDER BY d.expiry_date NULLS LAST, d.created_at DESC;
END;
$$;

