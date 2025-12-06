-- ============================================================================
-- SEED CPD ACTIVITIES - NEW SCHEMA
-- Creates sample CPD activities using the NEW schema (cpd_activities table)
-- This replaces the old seed data that used cpd_records table
-- ============================================================================

DO $$
DECLARE
    v_cycle_id UUID;
    v_rep_ids UUID[];
    v_rep_id UUID;
    v_activity_count INTEGER := 0;
BEGIN
    -- Get the active 2024/2025 cycle ID
    SELECT id INTO v_cycle_id
    FROM cpd_cycles
    WHERE cycle_name = '2024/2025' AND status = 'active'
    LIMIT 1;
    
    IF v_cycle_id IS NULL THEN
        RAISE EXCEPTION 'No active CPD cycle found! Please run initialize_cpd_cycle.sql first.';
    END IF;
    
    RAISE NOTICE '================================================';
    RAISE NOTICE 'SEEDING CPD ACTIVITIES (NEW SCHEMA)';
    RAISE NOTICE 'Active Cycle ID: %', v_cycle_id;
    RAISE NOTICE '================================================';
    
    -- Get up to 10 representative IDs
    SELECT ARRAY_AGG(id) INTO v_rep_ids
    FROM (
        SELECT id 
        FROM representatives 
        WHERE status IN ('active', 'suspended')
        ORDER BY created_at 
        LIMIT 10
    ) AS limited_reps;
    
    IF v_rep_ids IS NULL OR array_length(v_rep_ids, 1) = 0 THEN
        RAISE NOTICE 'No representatives found. Cannot seed CPD activities.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % representatives to seed CPD data for', array_length(v_rep_ids, 1);
    RAISE NOTICE '';
    
    -- ========================================================================
    -- REP 1: HIGHLY COMPLIANT (20+ hours, all verified)
    -- ========================================================================
    IF array_length(v_rep_ids, 1) >= 1 THEN
        v_rep_id := v_rep_ids[1];
        
        INSERT INTO cpd_activities (
            representative_id, cpd_cycle_id, activity_date, activity_name,
            activity_type, provider_name, total_hours, ethics_hours, technical_hours,
            class_1_applicable, class_2_applicable, class_3_applicable,
            verifiable, certificate_attached, status, verified_date
        ) VALUES
            (v_rep_id, v_cycle_id, '2024-08-15', 'FAIS Compliance Fundamentals 2024', 
             'course', 'Masthead Training', 8.0, 2.0, 6.0,
             true, false, false, true, true, 'verified', NOW() - INTERVAL '30 days'),
            (v_rep_id, v_cycle_id, '2024-09-20', 'Ethics in Financial Services', 
             'webinar', 'FSCA', 4.0, 2.0, 0.0,
             true, true, true, true, true, 'verified', NOW() - INTERVAL '20 days'),
            (v_rep_id, v_cycle_id, '2024-10-10', 'Investment Product Knowledge', 
             'seminar', 'FPI', 6.0, 0.0, 6.0,
             true, false, false, true, true, 'verified', NOW() - INTERVAL '10 days'),
            (v_rep_id, v_cycle_id, '2024-11-25', 'Annual Financial Services Conference', 
             'conference', 'FS Industry Association', 4.0, 1.0, 3.0,
             true, true, false, true, false, 'verified', NOW() - INTERVAL '5 days');
        
        v_activity_count := v_activity_count + 4;
        RAISE NOTICE '✅ Rep 1: Added 4 verified activities (22 hours total, 5 ethics)';
    END IF;
    
    -- ========================================================================
    -- REP 2: ON TRACK (15 hours, mostly verified)
    -- ========================================================================
    IF array_length(v_rep_ids, 1) >= 2 THEN
        v_rep_id := v_rep_ids[2];
        
        INSERT INTO cpd_activities (
            representative_id, cpd_cycle_id, activity_date, activity_name,
            activity_type, provider_name, total_hours, ethics_hours, technical_hours,
            class_1_applicable, class_2_applicable, class_3_applicable,
            verifiable, certificate_attached, status, verified_date
        ) VALUES
            (v_rep_id, v_cycle_id, '2024-07-10', 'Risk Management in Financial Services', 
             'course', 'Professional Training Co', 8.0, 2.0, 6.0,
             true, false, false, true, true, 'verified', NOW() - INTERVAL '40 days'),
            (v_rep_id, v_cycle_id, '2024-09-15', 'Compliance Updates 2024', 
             'webinar', 'FSCA', 4.0, 1.5, 2.5,
             true, true, false, true, true, 'verified', NOW() - INTERVAL '25 days'),
            (v_rep_id, v_cycle_id, '2024-11-20', 'Product Knowledge Study', 
             'self_study', 'Self', 3.0, 0.0, 3.0,
             true, false, false, false, false, 'pending', NULL);
        
        v_activity_count := v_activity_count + 3;
        RAISE NOTICE '✅ Rep 2: Added 3 activities (15 hours total, 1 pending)';
    END IF;
    
    -- ========================================================================
    -- REP 3: BEHIND SCHEDULE (8 hours only)
    -- ========================================================================
    IF array_length(v_rep_ids, 1) >= 3 THEN
        v_rep_id := v_rep_ids[3];
        
        INSERT INTO cpd_activities (
            representative_id, cpd_cycle_id, activity_date, activity_name,
            activity_type, provider_name, total_hours, ethics_hours, technical_hours,
            class_1_applicable, class_2_applicable, class_3_applicable,
            verifiable, certificate_attached, status, verified_date
        ) VALUES
            (v_rep_id, v_cycle_id, '2024-08-05', 'Basic Compliance Training', 
             'webinar', 'Online CPD Provider', 4.0, 1.0, 3.0,
             true, false, false, true, true, 'verified', NOW() - INTERVAL '35 days'),
            (v_rep_id, v_cycle_id, '2024-10-15', 'Product Training', 
             'course', 'Product Provider', 4.0, 0.5, 3.5,
             true, false, false, true, false, 'verified', NOW() - INTERVAL '15 days');
        
        v_activity_count := v_activity_count + 2;
        RAISE NOTICE '⚠️  Rep 3: Added 2 activities (8 hours - BEHIND)';
    END IF;
    
    -- ========================================================================
    -- REP 4: PENDING APPROVAL (12 hours, waiting verification)
    -- ========================================================================
    IF array_length(v_rep_ids, 1) >= 4 THEN
        v_rep_id := v_rep_ids[4];
        
        INSERT INTO cpd_activities (
            representative_id, cpd_cycle_id, activity_date, activity_name,
            activity_type, provider_name, total_hours, ethics_hours, technical_hours,
            class_1_applicable, class_2_applicable, class_3_applicable,
            verifiable, certificate_attached, status
        ) VALUES
            (v_rep_id, v_cycle_id, '2024-09-10', 'Market Updates Webinar', 
             'webinar', 'Industry Body', 5.0, 1.5, 3.5,
             true, true, false, true, true, 'pending'),
            (v_rep_id, v_cycle_id, '2024-11-15', 'Investment Basics Course', 
             'course', 'Training Provider', 7.0, 1.0, 6.0,
             true, false, false, true, true, 'pending');
        
        v_activity_count := v_activity_count + 2;
        RAISE NOTICE '⏳ Rep 4: Added 2 pending activities (12 hours awaiting approval)';
    END IF;
    
    -- ========================================================================
    -- REP 5: MIXED STATUS (10 hours verified, 3 pending)
    -- ========================================================================
    IF array_length(v_rep_ids, 1) >= 5 THEN
        v_rep_id := v_rep_ids[5];
        
        INSERT INTO cpd_activities (
            representative_id, cpd_cycle_id, activity_date, activity_name,
            activity_type, provider_name, total_hours, ethics_hours, technical_hours,
            class_1_applicable, class_2_applicable, class_3_applicable,
            verifiable, certificate_attached, status, verified_date
        ) VALUES
            (v_rep_id, v_cycle_id, '2024-08-20', 'Compliance Essentials', 
             'course', 'Training Institute', 8.0, 2.0, 6.0,
             true, false, false, true, true, 'verified', NOW() - INTERVAL '30 days'),
            (v_rep_id, v_cycle_id, '2024-10-25', 'Product Updates Webinar', 
             'webinar', 'Product Provider', 2.0, 0.5, 1.5,
             true, false, false, true, false, 'verified', NOW() - INTERVAL '12 days'),
            (v_rep_id, v_cycle_id, '2024-11-28', 'Industry Conference Day', 
             'conference', 'Conference Organizers', 3.0, 0.5, 2.5,
             true, true, false, false, false, 'pending');
        
        v_activity_count := v_activity_count + 3;
        RAISE NOTICE '📊 Rep 5: Added 3 activities (13 hours total, mixed status)';
    END IF;
    
    -- ========================================================================
    -- REPS 6-10: Quick seed with varied hours
    -- ========================================================================
    FOR i IN 6..LEAST(10, array_length(v_rep_ids, 1)) LOOP
        v_rep_id := v_rep_ids[i];
        
        -- Each rep gets 2-3 random activities
        INSERT INTO cpd_activities (
            representative_id, cpd_cycle_id, activity_date, activity_name,
            activity_type, provider_name, total_hours, ethics_hours, technical_hours,
            class_1_applicable, class_2_applicable, class_3_applicable,
            verifiable, certificate_attached, status, verified_date
        ) VALUES
            (v_rep_id, v_cycle_id, '2024-08-' || (10 + i)::text, 'Standard Training ' || i, 
             'course', 'CPD Provider', (8 + (i % 4) * 2)::DECIMAL, 2.0, (6 + (i % 4) * 2)::DECIMAL,
             true, (i % 2 = 0), (i % 3 = 0), true, true, 
             CASE WHEN i % 3 = 0 THEN 'pending' ELSE 'verified' END,
             CASE WHEN i % 3 != 0 THEN NOW() - (i * 5 || ' days')::INTERVAL ELSE NULL END),
            (v_rep_id, v_cycle_id, '2024-10-' || (5 + i)::text, 'Update Session ' || i, 
             'webinar', 'Industry Body', (4.0 + (i % 3))::DECIMAL, 1.0, (3.0 + (i % 3))::DECIMAL,
             true, false, false, true, (i % 2 = 0), 'verified', NOW() - (i * 3 || ' days')::INTERVAL);
        
        v_activity_count := v_activity_count + 2;
    END LOOP;
    
    IF array_length(v_rep_ids, 1) >= 6 THEN
        RAISE NOTICE '✅ Reps 6-10: Added % activities with varied hours', (LEAST(10, array_length(v_rep_ids, 1)) - 5) * 2;
    END IF;
    
    -- ========================================================================
    -- SUMMARY
    -- ========================================================================
    RAISE NOTICE '';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'CPD ACTIVITIES SEEDED SUCCESSFULLY';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Total activities created: %', v_activity_count;
    RAISE NOTICE 'Representatives with CPD data: %', array_length(v_rep_ids, 1);
    RAISE NOTICE 'CPD Cycle: 2024/2025';
    RAISE NOTICE '';
    RAISE NOTICE '✅ The CPD Management module now has sample data!';
    RAISE NOTICE 'Navigate to the CPD module to view and test.';
    RAISE NOTICE '================================================';
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE '❌ ERROR seeding CPD activities: %', SQLERRM;
        RAISE;
END $$;

