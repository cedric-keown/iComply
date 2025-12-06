-- ============================================================================
-- UPDATE NON-SUPERVISOR REPRESENTATIVE STATUSES
-- Updates representatives who are NOT supervisors/Key Individuals
-- ============================================================================

DO $$
DECLARE
    non_supervisor_ids UUID[];
    ki_rep_ids UUID[];
BEGIN
    -- Get representative IDs of Key Individuals (these are supervisors)
    SELECT ARRAY_AGG(representative_id) INTO ki_rep_ids
    FROM key_individuals
    WHERE representative_id IS NOT NULL;
    
    -- Get representatives who are NOT supervisors
    SELECT ARRAY_AGG(id) INTO non_supervisor_ids
    FROM (
        SELECT id 
        FROM representatives 
        WHERE id != ALL(COALESCE(ki_rep_ids, ARRAY[]::UUID[]))
        ORDER BY created_at 
        LIMIT 10
    ) AS non_supervisors;
    
    -- Check if we found any non-supervisors
    IF non_supervisor_ids IS NULL OR array_length(non_supervisor_ids, 1) = 0 THEN
        RAISE NOTICE 'No non-supervisor representatives found';
        RETURN;
    END IF;
    
    RAISE NOTICE 'Found % non-supervisor representatives', array_length(non_supervisor_ids, 1);
    
    -- Set 2 non-supervisors to SUSPENDED
    IF array_length(non_supervisor_ids, 1) >= 2 THEN
        UPDATE representatives 
        SET status = 'suspended'
        WHERE id IN (non_supervisor_ids[1], non_supervisor_ids[2]);
        
        RAISE NOTICE '✓ Set 2 non-supervisors to SUSPENDED status';
    END IF;
    
    -- Set 2 non-supervisors to TERMINATED
    IF array_length(non_supervisor_ids, 1) >= 4 THEN
        UPDATE representatives 
        SET status = 'terminated'
        WHERE id IN (non_supervisor_ids[3], non_supervisor_ids[4]);
        
        RAISE NOTICE '✓ Set 2 non-supervisors to TERMINATED status';
    END IF;
    
    -- Show summary
    RAISE NOTICE '==================================================================';
    RAISE NOTICE 'STATUS SUMMARY:';
    RAISE NOTICE '- Total ACTIVE (🟢): %', (SELECT COUNT(*) FROM representatives WHERE status = 'active');
    RAISE NOTICE '- Total SUSPENDED (🟡): %', (SELECT COUNT(*) FROM representatives WHERE status = 'suspended');
    RAISE NOTICE '- Total TERMINATED (⚫): %', (SELECT COUNT(*) FROM representatives WHERE status = 'terminated');
    RAISE NOTICE '==================================================================';
    
END $$;

-- Verify the results - show non-supervisor representatives with their statuses
SELECT 
    r.id,
    r.first_name,
    r.surname,
    r.representative_number,
    r.status,
    CASE 
        WHEN r.status = 'active' THEN '🟢 Green badge'
        WHEN r.status = 'suspended' THEN '🟡 Yellow badge'
        WHEN r.status = 'terminated' THEN '⚫ Gray badge'
        ELSE '❓ Unknown'
    END as expected_badge,
    CASE 
        WHEN ki.id IS NOT NULL THEN '⭐ SUPERVISOR'
        ELSE '👤 Regular Rep'
    END as role
FROM representatives r
LEFT JOIN key_individuals ki ON r.id = ki.representative_id
ORDER BY 
    CASE WHEN ki.id IS NOT NULL THEN 0 ELSE 1 END, -- Supervisors first
    r.status,
    r.first_name
LIMIT 20;

