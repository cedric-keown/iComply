-- ============================================================================
-- UPDATE REPRESENTATIVE STATUSES FOR TESTING
-- Updates some representatives to show different status scenarios
-- ============================================================================
-- Date: 2025-12-06
-- Purpose: Demonstrate different representative statuses in Supervision Structure
-- ============================================================================

DO $$
DECLARE
    rep_ids UUID[];
    rep_count INTEGER;
BEGIN
    -- Get all representative IDs
    SELECT ARRAY_AGG(id) INTO rep_ids
    FROM (
        SELECT id 
        FROM representatives 
        ORDER BY created_at 
        LIMIT 20
    ) AS reps;
    
    rep_count := COALESCE(array_length(rep_ids, 1), 0);
    
    -- If no representatives found, exit
    IF rep_count = 0 THEN
        RAISE NOTICE 'No representatives found. Skipping status updates.';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % representatives. Updating statuses for demonstration...', rep_count;
    
    -- ========================================================================
    -- SCENARIO 1: Active Representatives (Majority)
    -- ========================================================================
    -- Keep most representatives as 'active' (default scenario)
    -- Representatives 1-12 remain active (no update needed if already active)
    
    IF rep_count >= 12 THEN
        UPDATE representatives 
        SET status = 'active',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ANY(rep_ids[1:12])
        AND status != 'active';
        
        RAISE NOTICE 'Set representatives 1-12 to ACTIVE status';
    END IF;
    
    -- ========================================================================
    -- SCENARIO 2: Suspended Representative
    -- ========================================================================
    -- Set rep 13 as suspended (under review, compliance issue, etc.)
    IF rep_count >= 13 THEN
        UPDATE representatives 
        SET status = 'suspended',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = rep_ids[13];
        
        RAISE NOTICE 'Set representative 13 to SUSPENDED status';
        
        -- Add a note explaining the suspension
        INSERT INTO representative_documents (
            representative_id, 
            document_type, 
            document_name, 
            issue_date, 
            expiry_date, 
            status,
            notes
        )
        VALUES (
            rep_ids[13],
            'compliance',
            'Suspension Notice',
            CURRENT_DATE,
            CURRENT_DATE + INTERVAL '90 days',
            'pending',
            'Suspended pending compliance review. CPD requirements not met for 2024. Review scheduled for ' || TO_CHAR(CURRENT_DATE + INTERVAL '30 days', 'DD/MM/YYYY')
        )
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- ========================================================================
    -- SCENARIO 3: Suspended Representative (Different Reason)
    -- ========================================================================
    -- Set rep 14 as suspended (awaiting qualification renewal)
    IF rep_count >= 14 THEN
        UPDATE representatives 
        SET status = 'suspended',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = rep_ids[14];
        
        RAISE NOTICE 'Set representative 14 to SUSPENDED status';
        
        -- Add a note explaining the suspension
        INSERT INTO representative_documents (
            representative_id, 
            document_type, 
            document_name, 
            issue_date, 
            expiry_date, 
            status,
            notes
        )
        VALUES (
            rep_ids[14],
            'compliance',
            'Temporary Suspension - Qualification Renewal',
            CURRENT_DATE - INTERVAL '15 days',
            CURRENT_DATE + INTERVAL '45 days',
            'pending',
            'Suspended pending RE5 qualification renewal. Exam scheduled for ' || TO_CHAR(CURRENT_DATE + INTERVAL '14 days', 'DD/MM/YYYY')
        )
        ON CONFLICT DO NOTHING;
    END IF;
    
    -- ========================================================================
    -- SCENARIO 4: Terminated Representative (Resigned)
    -- ========================================================================
    -- Set rep 15 as terminated (resigned)
    IF rep_count >= 15 THEN
        UPDATE representatives 
        SET status = 'terminated',
            updated_at = CURRENT_TIMESTAMP
        WHERE id = rep_ids[15];
        
        RAISE NOTICE 'Set representative 15 to TERMINATED status (resigned)';
        
        -- Add termination document
        INSERT INTO representative_documents (
            representative_id, 
            document_type, 
            document_name, 
            issue_date, 
            status,
            notes
        )
        VALUES (
            rep_ids[15],
            'termination',
            'Resignation Letter',
            CURRENT_DATE - INTERVAL '45 days',
            'archived',
            'Voluntary resignation. Last working day: ' || TO_CHAR(CURRENT_DATE - INTERVAL '30 days', 'DD/MM/YYYY') || '. Exit interview completed.'
        )
        ON CONFLICT DO NOTHING;
        
        -- Unassign any supervised clients (move to unassigned)
        UPDATE representatives 
        SET supervised_by_ki_id = NULL
        WHERE supervised_by_ki_id = rep_ids[15];
    END IF;
    
    -- ========================================================================
    -- SCENARIO 5: Terminated Representative (Compliance Issue)
    -- ========================================================================
    -- Set rep 16 as terminated (compliance violation)
    IF rep_count >= 16 THEN
        UPDATE representatives 
        SET status = 'terminated',
            is_debarred = true,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = rep_ids[16];
        
        RAISE NOTICE 'Set representative 16 to TERMINATED status (compliance violation)';
        
        -- Add termination document
        INSERT INTO representative_documents (
            representative_id, 
            document_type, 
            document_name, 
            issue_date, 
            status,
            notes
        )
        VALUES (
            rep_ids[16],
            'termination',
            'Termination Notice - Compliance Violation',
            CURRENT_DATE - INTERVAL '95 days',
            'archived',
            'Terminated for material compliance violation. Debarred from industry. Termination date: ' || TO_CHAR(CURRENT_DATE - INTERVAL '90 days', 'DD/MM/YYYY')
        )
        ON CONFLICT DO NOTHING;
        
        -- Unassign any supervised clients
        UPDATE representatives 
        SET supervised_by_ki_id = NULL
        WHERE supervised_by_ki_id = rep_ids[16];
    END IF;
    
    -- ========================================================================
    -- Summary
    -- ========================================================================
    RAISE NOTICE '==================================================================';
    RAISE NOTICE 'Status Update Summary:';
    RAISE NOTICE '- Active representatives: %', (SELECT COUNT(*) FROM representatives WHERE status = 'active');
    RAISE NOTICE '- Suspended representatives: %', (SELECT COUNT(*) FROM representatives WHERE status = 'suspended');
    RAISE NOTICE '- Terminated representatives: %', (SELECT COUNT(*) FROM representatives WHERE status = 'terminated');
    RAISE NOTICE '==================================================================';
    
END $$;

-- ============================================================================
-- Add helpful comment
-- ============================================================================
COMMENT ON TABLE representatives IS 'Stores representative information. Status can be: active, suspended, or terminated. Suspended reps may return to active status after resolving issues. Terminated reps are permanently separated.';

-- ============================================================================
-- Verification Query (run this to check results)
-- ============================================================================
-- SELECT 
--     r.id,
--     COALESCE(up.first_name || ' ' || up.surname, 'Unknown') as name,
--     r.representative_number,
--     r.status,
--     r.is_debarred,
--     r.updated_at
-- FROM representatives r
-- LEFT JOIN user_profiles up ON r.user_profile_id = up.id
-- ORDER BY r.created_at
-- LIMIT 20;

