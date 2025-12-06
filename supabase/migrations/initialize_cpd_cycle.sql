-- ============================================================================
-- INITIALIZE CPD CYCLE FOR 2024/2025
-- Creates the active CPD cycle needed for the CPD Management module
-- ============================================================================

-- Check if cpd_cycles table exists (uses NEW schema)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cpd_cycles') THEN
        RAISE EXCEPTION 'ERROR: cpd_cycles table does not exist! Please run icomply_crud_operations_phase3_4.sql migration first.';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cpd_activities') THEN
        RAISE EXCEPTION 'ERROR: cpd_activities table does not exist! Please run icomply_crud_operations_phase3_4.sql migration first.';
    END IF;
    
    RAISE NOTICE 'CPD tables found. Proceeding with cycle initialization...';
END $$;

-- Create the 2024/2025 CPD Cycle if it doesn't exist
INSERT INTO cpd_cycles (
    id,
    cycle_name,
    start_date,
    end_date,
    required_hours,
    required_ethics_hours,
    required_technical_hours,
    status,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    '2024/2025',
    '2024-06-01',
    '2025-05-31',
    18.0,
    3.0,
    14.0,
    'active',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- Create the 2025/2026 CPD Cycle (upcoming)
INSERT INTO cpd_cycles (
    id,
    cycle_name,
    start_date,
    end_date,
    required_hours,
    required_ethics_hours,
    required_technical_hours,
    status,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    '2025/2026',
    '2025-06-01',
    '2026-05-31',
    18.0,
    3.0,
    14.0,
    'pending',
    NOW(),
    NOW()
)
ON CONFLICT DO NOTHING;

-- Mark 2023/2024 as completed if it exists
UPDATE cpd_cycles
SET status = 'completed'
WHERE cycle_name = '2023/2024'
AND status != 'completed';

-- Report created cycles
DO $$
DECLARE
    active_cycle RECORD;
    cycle_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO cycle_count FROM cpd_cycles;
    
    RAISE NOTICE '================================================';
    RAISE NOTICE 'CPD CYCLES INITIALIZED';
    RAISE NOTICE '================================================';
    RAISE NOTICE 'Total CPD cycles in database: %', cycle_count;
    RAISE NOTICE '';
    
    FOR active_cycle IN 
        SELECT cycle_name, start_date, end_date, status, required_hours
        FROM cpd_cycles
        ORDER BY start_date DESC
    LOOP
        RAISE NOTICE 'Cycle: % (% to %) - Status: % - Required: % hours', 
            active_cycle.cycle_name,
            active_cycle.start_date,
            active_cycle.end_date,
            active_cycle.status,
            active_cycle.required_hours;
    END LOOP;
    
    RAISE NOTICE '';
    RAISE NOTICE '✅ CPD cycle initialization complete!';
    RAISE NOTICE 'The CPD Management module is now ready to use.';
    RAISE NOTICE '================================================';
END $$;

