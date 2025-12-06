-- ============================================================================
-- COMPLIANCE TRACKING SYSTEM - SAMPLE DATA
-- Creates realistic compliance data for demonstration
-- ============================================================================

-- Get some representative IDs to work with
-- This assumes you have representatives in the database
DO $$
DECLARE
    rep_ids UUID[];
    rep_id UUID;
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
BEGIN
    -- Get up to 12 representative IDs
    SELECT ARRAY_AGG(id) INTO rep_ids
    FROM (
        SELECT id 
        FROM representatives 
        ORDER BY created_at 
        LIMIT 12
    ) AS limited_reps;
    
    -- If no representatives found, exit
    IF rep_ids IS NULL OR array_length(rep_ids, 1) = 0 THEN
        RAISE NOTICE 'No representatives found. Please add representatives first.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Adding compliance data for % representatives', array_length(rep_ids, 1);
    
    -- ========================================================================
    -- REPRESENTATIVE 1: HIGHLY COMPLIANT (Sarah Naidoo equivalent)
    -- ========================================================================
    IF array_length(rep_ids, 1) >= 1 THEN
        rep_id := rep_ids[1];
        
        -- CPD Records (Exceeded requirements)
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'course', 'FAIS Compliance Fundamentals 2024', 'FSB Training Institute', '2024-03-15', 8, 2, 'approved'),
            (rep_id, 'webinar', 'Ethics in Financial Services', 'FSCA', '2024-05-20', 4, 2, 'approved'),
            (rep_id, 'seminar', 'Investment Product Knowledge', 'Industry Association', '2024-08-10', 6, 0, 'approved'),
            (rep_id, 'conference', 'Annual Financial Services Conference', 'FS Conference', '2024-09-25', 4, 1, 'approved');
        
        -- Qualifications (All current)
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2020-08-15', '2026-08-20', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2020-03-10', '2025-03-15', 'active'),
            (rep_id, 'degree', 'Bachelor of Commerce (Finance)', 'University of Cape Town', '2018-06-01', NULL, 'active');
        
        -- Background Checks
        INSERT INTO background_checks (representative_id, check_type, check_date, expiry_date, result, verified_by)
        VALUES 
            (rep_id, 'criminal', '2024-01-15', '2025-01-15', 'clear', 'Compliance Department'),
            (rep_id, 'credit', '2024-01-15', '2025-01-15', 'clear', 'Compliance Department');
        
        -- FICA Records (All verified)
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'John Smith', 'verified', '2024-01-10', '2027-01-10', true, true, true, true, 'low'),
            (rep_id, 'Mary Johnson', 'verified', '2024-02-15', '2027-02-15', true, true, true, true, 'low'),
            (rep_id, 'Peter Williams', 'verified', '2024-03-20', '2027-03-20', true, true, true, true, 'medium');
        
        -- Documents (All current)
        INSERT INTO representative_documents (representative_id, document_type, document_name, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'contract', 'Employment Contract', '2020-01-15', NULL, 'current'),
            (rep_id, 'mandate', 'Client Mandate Agreement', '2024-01-01', '2025-01-01', 'current'),
            (rep_id, 'compliance', 'Code of Conduct Acknowledgment', '2024-01-01', '2025-01-01', 'current');
        
        -- CPD Requirement
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'completed');
    END IF;
    
    -- ========================================================================
    -- REPRESENTATIVE 2: COMPLIANT (Thabo Mokoena equivalent)
    -- ========================================================================
    IF array_length(rep_ids, 1) >= 2 THEN
        rep_id := rep_ids[2];
        
        -- CPD Records (In Progress)
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'course', 'Risk Management in Financial Services', 'Training Provider', '2024-04-10', 8, 2, 'approved'),
            (rep_id, 'webinar', 'Compliance Updates 2024', 'FSCA', '2024-06-15', 4, 1, 'approved'),
            (rep_id, 'self_study', 'Product Knowledge Study', 'Self', '2024-08-20', 3, 0, 'approved');
        
        -- Qualifications
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2019-06-10', '2027-06-10', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2019-04-15', '2025-04-20', 'active');
        
        -- FICA Records
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Sarah Brown', 'verified', '2024-02-10', '2027-02-10', true, true, true, true, 'low'),
            (rep_id, 'David Lee', 'verified', '2024-03-15', '2027-03-15', true, true, true, true, 'low');
        
        -- Documents (Some expiring soon)
        INSERT INTO representative_documents (representative_id, document_type, document_name, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'contract', 'Employment Contract', '2019-06-01', NULL, 'current'),
            (rep_id, 'mandate', 'Client Mandate Agreement', CURRENT_DATE - INTERVAL '11 months', CURRENT_DATE + INTERVAL '1 month', 'expiring_soon');
        
        -- CPD Requirement
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'in_progress');
    END IF;
    
    -- ========================================================================
    -- REPRESENTATIVE 3: NON-COMPLIANT - EXPIRED RE5 (Mike Johnson equivalent)
    -- ========================================================================
    IF array_length(rep_ids, 1) >= 3 THEN
        rep_id := rep_ids[3];
        
        -- CPD Records (Behind)
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'webinar', 'Basic Compliance Training', 'Online Provider', '2024-02-10', 4, 1, 'approved'),
            (rep_id, 'course', 'Product Training', 'Product Provider', '2024-04-15', 4, 0.5, 'approved');
        
        -- Qualifications (RE5 Expired!)
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2018-12-10', '2024-12-13', 'expired'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2020-09-20', '2025-09-30', 'active');
        
        -- FICA Records (Some overdue)
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Client A', 'expired', '2021-01-10', '2024-01-10', true, true, true, false, 'medium'),
            (rep_id, 'Client B', 'verified', '2024-03-15', '2027-03-15', true, true, true, true, 'low');
        
        -- Documents (Some expired)
        INSERT INTO representative_documents (representative_id, document_type, document_name, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'contract', 'Employment Contract', '2019-01-01', NULL, 'current'),
            (rep_id, 'compliance', 'Old Compliance Certificate', '2022-01-01', '2024-01-01', 'expired');
        
        -- CPD Requirement
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'overdue');
    END IF;
    
    -- ========================================================================
    -- REPRESENTATIVE 4: AT RISK - CPD BEHIND (Johan Smith equivalent)
    -- ========================================================================
    IF array_length(rep_ids, 1) >= 4 THEN
        rep_id := rep_ids[4];
        
        -- CPD Records (Behind on hours)
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'webinar', 'Market Updates', 'Industry Body', '2024-03-10', 5, 1.5, 'approved'),
            (rep_id, 'course', 'Investment Basics', 'Training Provider', '2024-07-15', 7, 1, 'approved');
        
        -- Qualifications (Valid)
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2020-05-15', '2026-05-15', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2020-07-20', '2025-07-20', 'active');
        
        -- FICA Records (All verified)
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Jane Doe', 'verified', '2024-01-20', '2027-01-20', true, true, true, true, 'low'),
            (rep_id, 'Bob Wilson', 'verified', '2024-04-10', '2027-04-10', true, true, true, true, 'low');
        
        -- Documents
        INSERT INTO representative_documents (representative_id, document_type, document_name, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'contract', 'Employment Contract', '2020-05-01', NULL, 'current'),
            (rep_id, 'mandate', 'Client Mandate', '2024-01-01', '2025-01-01', 'current');
        
        -- CPD Requirement
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'in_progress');
    END IF;
    
    -- ========================================================================
    -- REPRESENTATIVE 5: AT RISK - WARNINGS (Peter Nel equivalent)
    -- ========================================================================
    IF array_length(rep_ids, 1) >= 5 THEN
        rep_id := rep_ids[5];
        
        -- CPD Records
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'course', 'Compliance Training', 'Training Institute', '2024-05-10', 8, 2, 'approved'),
            (rep_id, 'webinar', 'Product Updates', 'Provider', '2024-08-15', 5, 1, 'approved');
        
        -- Qualifications
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2021-03-10', '2026-03-10', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2021-05-15', '2025-05-15', 'active');
        
        -- FICA Records (Some overdue)
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Client X', 'verified', '2024-02-10', '2027-02-10', true, true, true, true, 'low'),
            (rep_id, 'Client Y', 'expired', '2021-06-15', '2024-06-15', true, true, true, false, 'medium'),
            (rep_id, 'Client Z', 'expired', '2021-08-20', '2024-08-20', true, false, true, false, 'medium');
        
        -- Documents (One expired)
        INSERT INTO representative_documents (representative_id, document_type, document_name, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'contract', 'Employment Contract', '2021-03-01', NULL, 'current'),
            (rep_id, 'compliance', 'Old Certificate', '2022-01-01', '2024-01-01', 'expired');
        
        -- CPD Requirement
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'in_progress');
    END IF;
    
    -- ========================================================================
    -- REPRESENTATIVES 6-12: Mix of statuses
    -- ========================================================================
    
    -- Rep 6: Highly Compliant
    IF array_length(rep_ids, 1) >= 6 THEN
        rep_id := rep_ids[6];
        
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'course', 'Advanced Financial Planning', 'Professional Body', '2024-03-20', 10, 2.5, 'approved'),
            (rep_id, 'conference', 'Industry Conference 2024', 'Conference Org', '2024-06-15', 8, 1.5, 'approved');
        
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2019-08-10', '2025-08-10', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2019-10-15', '2025-10-15', 'active');
        
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Verified Client 1', 'verified', '2024-01-15', '2027-01-15', true, true, true, true, 'low'),
            (rep_id, 'Verified Client 2', 'verified', '2024-03-20', '2027-03-20', true, true, true, true, 'low');
        
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'completed');
    END IF;
    
    -- Rep 7: Non-Compliant - Critical FICA Issues
    IF array_length(rep_ids, 1) >= 7 THEN
        rep_id := rep_ids[7];
        
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'course', 'Basic Training', 'Provider', '2024-02-10', 18, 3.5, 'approved');
        
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', CURRENT_DATE - INTERVAL '2 years', CURRENT_DATE + INTERVAL '60 days', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', CURRENT_DATE - INTERVAL '2 years', CURRENT_DATE + INTERVAL '30 days', 'active');
        
        -- Critical: Many expired FICA records
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Expired Client 1', 'expired', '2021-01-10', '2024-01-10', true, true, true, false, 'high'),
            (rep_id, 'Expired Client 2', 'expired', '2021-02-15', '2024-02-15', true, false, true, false, 'high'),
            (rep_id, 'Expired Client 3', 'expired', '2021-03-20', '2024-03-20', true, true, false, false, 'medium'),
            (rep_id, 'Expired Client 4', 'expired', '2021-04-25', '2024-04-25', true, true, true, false, 'medium'),
            (rep_id, 'Expired Client 5', 'expired', '2021-05-30', '2024-05-30', true, false, true, false, 'medium'),
            (rep_id, 'Expired Client 6', 'expired', '2021-06-15', '2024-06-15', true, true, true, false, 'medium'),
            (rep_id, 'Current Client', 'verified', '2024-05-10', '2027-05-10', true, true, true, true, 'low');
        
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'completed');
    END IF;
    
    -- Rep 8: Compliant
    IF array_length(rep_ids, 1) >= 8 THEN
        rep_id := rep_ids[8];
        
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'course', 'Financial Services Training', 'Training Co', '2024-04-15', 16, 3, 'approved');
        
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2021-02-10', '2026-02-10', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2021-04-15', '2026-04-15', 'active');
        
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Good Client', 'verified', '2024-03-10', '2027-03-10', true, true, true, true, 'low');
        
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'in_progress');
    END IF;
    
    -- Rep 9: Non-Compliant - CPD Deficit
    IF array_length(rep_ids, 1) >= 9 THEN
        rep_id := rep_ids[9];
        
        -- Very few CPD hours
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'webinar', 'Quick Update Session', 'Online', '2024-02-05', 3, 0.5, 'approved'),
            (rep_id, 'webinar', 'Product Briefing', 'Provider', '2024-05-10', 3, 0.5, 'approved');
        
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2020-11-10', '2026-11-10', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2020-12-15', '2025-12-15', 'active');
        
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Client One', 'verified', '2024-01-20', '2027-01-20', true, true, true, true, 'low'),
            (rep_id, 'Client Two', 'expired', '2021-05-15', '2024-05-15', true, true, true, false, 'medium');
        
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'overdue');
    END IF;
    
    -- Rep 10-12: More compliant representatives
    FOR i IN 10..LEAST(12, array_length(rep_ids, 1)) LOOP
        rep_id := rep_ids[i];
        
        INSERT INTO cpd_records (representative_id, activity_type, activity_name, provider, activity_date, hours_earned, ethics_hours, status)
        VALUES 
            (rep_id, 'course', 'Standard Compliance Course', 'Provider', '2024-03-15', 14, 3, 'approved'),
            (rep_id, 'webinar', 'Update Session', 'Industry', '2024-06-20', 4, 0.5, 'approved');
        
        INSERT INTO representative_qualifications (representative_id, qualification_type, qualification_name, issuing_authority, issue_date, expiry_date, status)
        VALUES 
            (rep_id, 'RE5', 'Regulatory Examination for Representatives', 'FSCA', '2020-01-15', '2026-01-15', 'active'),
            (rep_id, 'RE1', 'Regulatory Examination for Representatives - Specific', 'FSCA', '2020-03-20', '2025-03-20', 'active');
        
        INSERT INTO client_fica_records (representative_id, client_name, verification_status, verification_date, expiry_date, id_verified, address_verified, source_of_funds_verified, tax_status_verified, risk_rating)
        VALUES 
            (rep_id, 'Standard Client', 'verified', '2024-02-15', '2027-02-15', true, true, true, true, 'low');
        
        INSERT INTO cpd_requirements (representative_id, year, required_hours, required_ethics_hours, due_date, status)
        VALUES (rep_id, current_year, 18, 3, MAKE_DATE(current_year, 12, 31), 'completed');
    END LOOP;
    
    RAISE NOTICE 'Compliance data added successfully!';
    
END $$;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check what was created
SELECT 
    'CPD Records' as table_name,
    COUNT(*) as count
FROM cpd_records
UNION ALL
SELECT 
    'Qualifications',
    COUNT(*)
FROM representative_qualifications
UNION ALL
SELECT 
    'Background Checks',
    COUNT(*)
FROM background_checks
UNION ALL
SELECT 
    'FICA Records',
    COUNT(*)
FROM client_fica_records
UNION ALL
SELECT 
    'Documents',
    COUNT(*)
FROM representative_documents
UNION ALL
SELECT 
    'CPD Requirements',
    COUNT(*)
FROM cpd_requirements;

