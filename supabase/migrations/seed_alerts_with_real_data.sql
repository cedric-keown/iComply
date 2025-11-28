-- Seed Alerts Data Using Real Database Records
-- This script creates realistic alerts by referencing actual representatives and clients
-- Run this after you have representatives and clients in your database

-- ============================================================================
-- HELPER FUNCTION: Get Random Representative ID
-- ============================================================================
-- This function gets a random representative ID for use in alerts
-- You can modify this to target specific representatives

-- ============================================================================
-- CRITICAL PRIORITY ALERTS
-- ============================================================================

-- Critical: RE5 Certificate Expired (using actual representative)
DO $$
DECLARE
    v_rep_id UUID;
    v_entity_id UUID;
BEGIN
    -- Get a random representative (or use a specific one)
    SELECT id INTO v_rep_id FROM representatives WHERE status = 'active' LIMIT 1;
    
    IF v_rep_id IS NOT NULL THEN
        v_entity_id := gen_random_uuid();
        
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            representative_id,
            status,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'RE5 Certificate Expired - Immediate Action Required',
            'Representative''s RE5 certificate expired 2 days ago. The representative is no longer authorized to provide financial services. Immediate action required to suspend activities or renew certificate.',
            'critical',
            'fit-proper',
            v_entity_id,
            v_rep_id,
            'active',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '2 days'
        );
    END IF;
END $$;

-- Critical: FSCA Compliance Notice
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'FSCA Compliance Notice Received - Response Required',
    'FSCA has issued a compliance notice regarding client complaint handling procedures. Response required within 48 hours. This is a critical regulatory matter.',
    'critical',
    'complaints',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
);

-- Critical: Professional Indemnity Insurance Expired
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Professional Indemnity Insurance Expired',
    'The FSP''s Professional Indemnity Insurance policy expired yesterday. Operating without valid insurance is a serious compliance violation. Immediate renewal required.',
    'critical',
    'insurance',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '1 day'
);

-- ============================================================================
-- HIGH PRIORITY ALERTS
-- ============================================================================

-- High: RE5 Expiring Soon (using actual representative)
DO $$
DECLARE
    v_rep_id UUID;
    v_entity_id UUID;
BEGIN
    SELECT id INTO v_rep_id FROM representatives WHERE status = 'active' LIMIT 1 OFFSET 1;
    
    IF v_rep_id IS NOT NULL THEN
        v_entity_id := gen_random_uuid();
        
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            representative_id,
            status,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'RE5 Certificate Expiring in 15 Days',
            'Representative''s RE5 certificate expires in 15 days. Renewal application must be submitted before expiry to maintain authorization status.',
            'high',
            'fit-proper',
            v_entity_id,
            v_rep_id,
            'active',
            NOW() - INTERVAL '5 days',
            NOW() + INTERVAL '15 days',
            NOW() - INTERVAL '5 days'
        );
    END IF;
END $$;

-- High: FICA Reviews Overdue
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    '45 FICA Reviews Overdue',
    'There are 45 client FICA reviews that are overdue. These must be completed within 7 days to maintain compliance with FICA regulations.',
    'high',
    'fica',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '7 days',
    NOW() - INTERVAL '3 days'
);

-- High: CPD Hours Shortfall (using actual representative)
DO $$
DECLARE
    v_rep_id UUID;
    v_entity_id UUID;
BEGIN
    SELECT id INTO v_rep_id FROM representatives WHERE status = 'active' LIMIT 1 OFFSET 2;
    
    IF v_rep_id IS NOT NULL THEN
        v_entity_id := gen_random_uuid();
        
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            representative_id,
            status,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'CPD Hours Shortfall - 2024 Cycle',
            'Representative is 12 CPD hours short of the required 18 hours for the 2024 cycle. Deadline: 31 December 2024. Additional training must be completed.',
            'high',
            'cpd',
            v_entity_id,
            v_rep_id,
            'active',
            NOW() - INTERVAL '7 days',
            DATE '2024-12-31',
            NOW() - INTERVAL '7 days'
        );
    END IF;
END $$;

-- High: Client Complaint Escalation (using actual client if available)
DO $$
DECLARE
    v_client_id UUID;
    v_entity_id UUID;
BEGIN
    SELECT id INTO v_client_id FROM clients WHERE status = 'active' LIMIT 1;
    
    IF v_client_id IS NOT NULL THEN
        v_entity_id := gen_random_uuid();
        
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            client_id,
            status,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'Client Complaint Requires Response - 5 Days Overdue',
            'Client complaint has not been responded to within the required 5 business day timeframe. Immediate response required.',
            'high',
            'complaints',
            v_entity_id,
            v_client_id,
            'active',
            NOW() - INTERVAL '8 days',
            NOW() - INTERVAL '3 days',
            NOW() - INTERVAL '8 days'
        );
    ELSE
        -- Insert without client_id if no clients exist
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            status,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'Client Complaint Requires Response - 5 Days Overdue',
            'Client complaint has not been responded to within the required 5 business day timeframe. Immediate response required.',
            'high',
            'complaints',
            gen_random_uuid(),
            'active',
            NOW() - INTERVAL '8 days',
            NOW() - INTERVAL '3 days',
            NOW() - INTERVAL '8 days'
        );
    END IF;
END $$;

-- High: Document Expiry Warning
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Key Individual License Expiring in 20 Days',
    'Key Individual license for Compliance Officer expires in 20 days. Renewal documentation must be submitted to FSCA before expiry.',
    'high',
    'documents',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '20 days',
    NOW() - INTERVAL '2 days'
);

-- ============================================================================
-- MEDIUM PRIORITY ALERTS
-- ============================================================================

-- Medium: Quarterly Compliance Review Due
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Q4 2024 Compliance Review Due',
    'Quarterly compliance review for Q4 2024 is due within the next 30 days. This includes review of all compliance activities, training records, and policy updates.',
    'medium',
    'compliance',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '25 days',
    NOW() - INTERVAL '5 days'
);

-- Medium: CPD Activity Submission Reminder
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'CPD Activity Documentation Pending',
    'Three representatives have completed CPD activities but have not yet submitted supporting documentation. Please ensure documentation is uploaded within 14 days.',
    'medium',
    'cpd',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '14 days',
    NOW() - INTERVAL '3 days'
);

-- Medium: FICA Risk Assessment Update
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'FICA Risk Assessment Update Required',
    'Annual FICA risk assessment review is due. The current risk assessment was completed 11 months ago and requires updating to reflect current business activities and risk profile.',
    'medium',
    'fica',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '10 days',
    NOW() + INTERVAL '20 days',
    NOW() - INTERVAL '10 days'
);

-- Medium: Training Program Completion
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Annual Compliance Training Program Due',
    'All representatives must complete the annual compliance training program by end of month. Training completion tracking is available in the system.',
    'medium',
    'training',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '7 days',
    DATE_TRUNC('month', NOW() + INTERVAL '1 month') - INTERVAL '1 day',
    NOW() - INTERVAL '7 days'
);

-- Medium: Internal Audit Finding
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Internal Audit Finding - Corrective Action Required',
    'Internal audit identified a finding related to client file documentation. Corrective action plan must be implemented within 30 days.',
    'medium',
    'internal-audit',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '25 days',
    NOW() - INTERVAL '5 days'
);

-- Medium: Policy Review Due
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Compliance Policy Annual Review Due',
    'The FSP''s Compliance Policy requires annual review. Last review was completed 12 months ago. Review must be completed and approved by Key Individual.',
    'medium',
    'documents',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '2 days',
    NOW() + INTERVAL '28 days',
    NOW() - INTERVAL '2 days'
);

-- ============================================================================
-- LOW PRIORITY ALERTS
-- ============================================================================

-- Low: CPD Activity Reminder
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'CPD Activity Reminder - Q1 2025',
    'Reminder: Q1 2025 CPD cycle begins next month. Representatives should start planning their CPD activities for the new cycle.',
    'low',
    'cpd',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '1 day',
    NOW() + INTERVAL '60 days',
    NOW() - INTERVAL '1 day'
);

-- Low: Document Archive Reminder
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Document Archive Review Due',
    'Quarterly document archive review is due. Please review and archive documents older than 5 years as per retention policy.',
    'low',
    'documents',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '3 days',
    NOW() + INTERVAL '27 days',
    NOW() - INTERVAL '3 days'
);

-- Low: System Maintenance Notification
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Scheduled System Maintenance',
    'System maintenance is scheduled for next weekend (Saturday 2:00 AM - 4:00 AM). The system will be unavailable during this time. Please plan accordingly.',
    'low',
    'system',
    gen_random_uuid(),
    'active',
    NOW(),
    NOW() + INTERVAL '7 days',
    NOW()
);

-- ============================================================================
-- ACKNOWLEDGED ALERTS
-- ============================================================================

-- Acknowledged: High Priority
DO $$
DECLARE
    v_rep_id UUID;
    v_entity_id UUID;
BEGIN
    SELECT id INTO v_rep_id FROM representatives WHERE status = 'active' LIMIT 1 OFFSET 3;
    
    IF v_rep_id IS NOT NULL THEN
        v_entity_id := gen_random_uuid();
        
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            representative_id,
            status,
            acknowledged_at,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'RE5 Renewal Application Submitted',
            'RE5 renewal application for representative has been submitted to FSCA. Awaiting approval. Status: Acknowledged and in progress.',
            'high',
            'fit-proper',
            v_entity_id,
            v_rep_id,
            'acknowledged',
            NOW() - INTERVAL '2 days',
            NOW() - INTERVAL '10 days',
            NOW() + INTERVAL '20 days',
            NOW() - INTERVAL '10 days'
        );
    END IF;
END $$;

-- Acknowledged: Medium Priority
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    acknowledged_at,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Compliance Training Scheduled',
    'Annual compliance training has been scheduled for all representatives. Training sessions will be conducted over the next two weeks.',
    'medium',
    'training',
    gen_random_uuid(),
    'acknowledged',
    NOW() - INTERVAL '1 day',
    NOW() - INTERVAL '5 days',
    NOW() + INTERVAL '14 days',
    NOW() - INTERVAL '5 days'
);

-- ============================================================================
-- RESOLVED ALERTS
-- ============================================================================

-- Resolved: High Priority
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    resolved_at,
    resolution_notes,
    valid_from,
    due_date,
    created_at
) VALUES (
    'FICA Review Completed',
    'All overdue FICA reviews have been completed and documented. Compliance status restored.',
    'high',
    'fica',
    gen_random_uuid(),
    'resolved',
    NOW() - INTERVAL '1 day',
    'All overdue FICA reviews have been completed. Documentation uploaded to system. Compliance officer has verified completion.',
    NOW() - INTERVAL '15 days',
    NOW() - INTERVAL '8 days',
    NOW() - INTERVAL '15 days'
);

-- Resolved: Medium Priority
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    resolved_at,
    resolution_notes,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Policy Review Completed',
    'Compliance Policy annual review has been completed and approved by Key Individual.',
    'medium',
    'documents',
    gen_random_uuid(),
    'resolved',
    NOW() - INTERVAL '3 days',
    'Policy review completed. Updated policy approved by Key Individual. New version uploaded to document library.',
    NOW() - INTERVAL '20 days',
    NOW() - INTERVAL '2 days',
    NOW() - INTERVAL '20 days'
);

-- ============================================================================
-- RECENT ALERTS (created today)
-- ============================================================================

-- Recent: Critical (2 hours ago)
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'FSCA Inspection Scheduled',
    'FSCA has scheduled an on-site inspection for next week. All compliance documentation must be prepared and available for review.',
    'critical',
    'compliance',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '2 hours',
    NOW() + INTERVAL '7 days',
    NOW() - INTERVAL '2 hours'
);

-- Recent: High (3 hours ago)
DO $$
DECLARE
    v_client_id UUID;
    v_entity_id UUID;
BEGIN
    SELECT id INTO v_client_id FROM clients WHERE status = 'active' LIMIT 1 OFFSET 1;
    
    IF v_client_id IS NOT NULL THEN
        v_entity_id := gen_random_uuid();
        
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            client_id,
            status,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'High-Risk Client FICA Review Due',
            'High-risk client requires enhanced due diligence review. Review must be completed within 7 days as per FICA requirements.',
            'high',
            'fica',
            v_entity_id,
            v_client_id,
            'active',
            NOW() - INTERVAL '3 hours',
            NOW() + INTERVAL '7 days',
            NOW() - INTERVAL '3 hours'
        );
    ELSE
        INSERT INTO alerts (
            alert_title,
            alert_message,
            priority,
            entity_type,
            entity_id,
            status,
            valid_from,
            due_date,
            created_at
        ) VALUES (
            'High-Risk Client FICA Review Due',
            'High-risk client requires enhanced due diligence review. Review must be completed within 7 days as per FICA requirements.',
            'high',
            'fica',
            gen_random_uuid(),
            'active',
            NOW() - INTERVAL '3 hours',
            NOW() + INTERVAL '7 days',
            NOW() - INTERVAL '3 hours'
        );
    END IF;
END $$;

-- Recent: Medium (5 hours ago)
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'New Compliance Regulation Published',
    'FSCA has published new guidance on client suitability assessments. All representatives must review and acknowledge the new requirements within 30 days.',
    'medium',
    'compliance',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '5 hours',
    NOW() + INTERVAL '30 days',
    NOW() - INTERVAL '5 hours'
);

-- Recent: Low (1 hour ago)
INSERT INTO alerts (
    alert_title,
    alert_message,
    priority,
    entity_type,
    entity_id,
    status,
    valid_from,
    due_date,
    created_at
) VALUES (
    'Monthly Compliance Newsletter Available',
    'December 2024 compliance newsletter is now available. Please review for updates on regulatory changes and best practices.',
    'low',
    'system',
    gen_random_uuid(),
    'active',
    NOW() - INTERVAL '1 hour',
    NULL,
    NOW() - INTERVAL '1 hour'
);

-- ============================================================================
-- SUMMARY
-- ============================================================================
-- This script creates 25 realistic alerts with various:
-- - Priorities: Critical (4), High (6), Medium (7), Low (4)
-- - Statuses: Active (19), Acknowledged (2), Resolved (2)
-- - Entity Types: fit-proper, fica, cpd, complaints, insurance, documents, 
--   compliance, training, internal-audit, system
-- - Time ranges: Overdue, upcoming, recent (today)
--
-- The script automatically links to actual representatives and clients when available,
-- and gracefully handles cases where no data exists yet.

