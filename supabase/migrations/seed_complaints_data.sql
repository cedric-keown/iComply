-- ============================================================================
-- SEED REALISTIC COMPLAINTS DATA
-- Creates sample complaints with varied statuses, priorities, and categories
-- ============================================================================

DO $$
DECLARE
    v_rep_ids UUID[];
    v_user_ids UUID[];
    v_complaint_id UUID;
    v_today DATE := CURRENT_DATE;
BEGIN
    -- Get representative IDs for assignment
    SELECT ARRAY_AGG(id) INTO v_rep_ids
    FROM (SELECT id FROM representatives WHERE status = 'active' LIMIT 15) AS reps;
    
    -- Get user IDs for created_by and assigned_to
    SELECT ARRAY_AGG(id) INTO v_user_ids
    FROM (SELECT id FROM user_profiles LIMIT 10) AS users;
    
    -- Clear existing test complaints (optional - remove if you want to keep existing)
    -- DELETE FROM complaints WHERE complaint_reference_number LIKE 'COMP-2024%';
    
    RAISE NOTICE 'Creating realistic complaints data...';
    
    -- ========================================================================
    -- COMPLAINT 1: High Priority - Policy Cancellation Dispute (OPEN)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complainant_address,
        complaint_date, complaint_received_date, complaint_channel,
        complaint_category, complaint_subcategory, complaint_description,
        product_type, policy_number, priority, severity, status,
        assigned_to, investigation_notes, acknowledgement_sent_date,
        acknowledgement_due_date, resolution_due_date, is_overdue,
        created_by, created_at
    ) VALUES (
        'COMP-2024-001',
        v_rep_ids[1],
        'Sarah Johnson',
        'sarah.johnson@email.com',
        '082 555 1234',
        '15 Oak Street, Sandton, 2196',
        v_today - INTERVAL '5 days',
        v_today - INTERVAL '4 days',
        'email',
        'Policy Administration',
        'Unauthorized Cancellation',
        'Client claims their life insurance policy was cancelled without proper notification. They state they have proof of premium payments being up to date and were never informed of any pending cancellation. This has caused significant distress as they discovered the cancellation when trying to increase their coverage.',
        'Life Insurance',
        'LI-2023-456789',
        'high',
        'major',
        'investigating',
        v_user_ids[1],
        'Initial investigation started. Requested policy documents and payment history from admin. Client has provided bank statements showing debit orders. Awaiting response from underwriting department.',
        v_today - INTERVAL '4 days',
        v_today - INTERVAL '4 days',
        v_today + INTERVAL '11 days',
        false,
        v_user_ids[1],
        v_today - INTERVAL '4 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 2: Critical Priority - Claim Rejection (OPEN - OVERDUE)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, acknowledgement_sent_date,
        acknowledgement_due_date, resolution_due_date, is_overdue,
        created_by, created_at
    ) VALUES (
        'COMP-2024-002',
        v_rep_ids[2],
        'Michael Naidoo',
        'michael.naidoo@email.com',
        '083 777 9876',
        v_today - INTERVAL '25 days',
        v_today - INTERVAL '24 days',
        'phone',
        'Claims Processing',
        'Claim Rejection',
        'Critical illness claim rejected citing pre-existing condition. Client disputes this as they disclosed all medical history during application. Medical records show condition was diagnosed 2 years after policy inception. Client is facing financial hardship due to medical expenses.',
        'Critical Illness Insurance',
        'CI-2021-334455',
        'critical',
        'critical',
        'investigating',
        v_user_ids[2],
        'Medical records obtained. Underwriting notes from policy inception reviewed. Discrepancy found in application disclosure section. Scheduled meeting with client and medical advisor. Legal team consulted on policy wording interpretation.',
        v_today - INTERVAL '24 days',
        v_today - INTERVAL '24 days',
        v_today - INTERVAL '9 days',
        true,
        v_user_ids[1],
        v_today - INTERVAL '24 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 3: Medium Priority - Premium Increase (RESOLVED)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, resolution_description, resolution_date,
        acknowledgement_sent_date, acknowledgement_due_date,
        resolution_due_date, is_overdue, root_cause,
        preventative_action, systemic_issue, created_by, created_at
    ) VALUES (
        'COMP-2024-003',
        v_rep_ids[3],
        'Thandiwe Dlamini',
        'thandiwe.d@email.com',
        '072 444 5555',
        v_today - INTERVAL '45 days',
        v_today - INTERVAL '44 days',
        'portal',
        'Policy Administration',
        'Premium Increase',
        'Client received notice of 35% premium increase with only 14 days notice. Policy documentation states 30 days notice required for premium adjustments. Client requests proper notice period and explanation for increase amount.',
        'Short-term Insurance',
        'ST-2022-998877',
        'medium',
        'moderate',
        'resolved',
        v_user_ids[3],
        'Reviewed policy terms and premium increase notification process. Confirmed notice period was insufficient per policy terms. Premium increase justified due to claims history and industry trends but notification process violated policy terms.',
        'Premium increase valid but notice period inadequate. Offered client: 1) Additional 30 days at old premium rate, 2) Detailed breakdown of increase factors, 3) Review of alternative coverage options to reduce premium. Client accepted resolution and opted to reduce coverage slightly to maintain affordable premium.',
        v_today - INTERVAL '15 days',
        v_today - INTERVAL '44 days',
        v_today - INTERVAL '44 days',
        v_today - INTERVAL '14 days',
        false,
        'Automated premium increase notification system not configured to comply with minimum notice periods in policy documentation',
        'Updated notification system to enforce 30-day minimum notice period. Added calendar validation. Flagged for inclusion in next policy admin system upgrade sprint.',
        true,
        v_user_ids[1],
        v_today - INTERVAL '44 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 4: High Priority - Misrepresentation (PENDING OMBUD)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, acknowledgement_sent_date,
        acknowledgement_due_date, resolution_due_date, is_overdue,
        escalated_to_ombud, ombud_case_number, ombud_escalation_date,
        root_cause, systemic_issue, created_by, created_at
    ) VALUES (
        'COMP-2024-004',
        v_rep_ids[4],
        'James van der Merwe',
        'james.vdm@email.com',
        '084 222 3333',
        v_today - INTERVAL '90 days',
        v_today - INTERVAL '89 days',
        'in-person',
        'Sales & Advice',
        'Misrepresentation',
        'Client alleges representative misrepresented policy benefits during sale, specifically stating that policy would cover all medical procedures without sub-limits. Policy clearly states sub-limits on specific procedures. Client claims they would not have purchased if properly informed.',
        'Medical Aid Gap Cover',
        'GA-2023-112233',
        'high',
        'major',
        'pending',
        v_user_ids[2],
        'Sales call recording reviewed. Representative did mention "comprehensive coverage" but did not explicitly detail sub-limits. Policy documents were emailed to client with key features summary. Client signed declaration confirming receipt and understanding. Representative training records show completion of product knowledge assessment. Case complexity warrants external review.',
        v_today - INTERVAL '89 days',
        v_today - INTERVAL '89 days',
        v_today - INTERVAL '59 days',
        true,
        true,
        'OMB-2024-1156',
        v_today - INTERVAL '30 days',
        'Sales process did not adequately emphasize policy limitations and sub-limits. Verbal confirmation insufficient without explicit written explanation of key limitations',
        false,
        v_user_ids[1],
        v_today - INTERVAL '89 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 5: Medium Priority - Service Delays (INVESTIGATING)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, acknowledgement_sent_date,
        acknowledgement_due_date, resolution_due_date, is_overdue,
        created_by, created_at
    ) VALUES (
        'COMP-2024-005',
        v_rep_ids[5],
        'Fatima Moosa',
        'fatima.moosa@email.com',
        '071 888 9999',
        v_today - INTERVAL '12 days',
        v_today - INTERVAL '11 days',
        'email',
        'Customer Service',
        'Service Delays',
        'Multiple attempts to reach representative over 3 weeks for policy amendments. Emails not responded to, calls going to voicemail. Client needs to update beneficiary details urgently due to recent marriage.',
        'Retirement Annuity',
        'RA-2020-667788',
        'medium',
        'moderate',
        'investigating',
        v_user_ids[4],
        'Representative was on unexpected medical leave for 2 weeks. Backup coverage was not properly activated. Client communications were not redirected. Currently processing beneficiary update as priority. Implementing improved leave coverage protocol.',
        v_today - INTERVAL '11 days',
        v_today - INTERVAL '11 days',
        v_today + INTERVAL '4 days',
        false,
        v_user_ids[1],
        v_today - INTERVAL '11 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 6: Low Priority - Documentation Error (RESOLVED)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, resolution_description, resolution_date,
        acknowledgement_sent_date, acknowledgement_due_date,
        resolution_due_date, is_overdue, root_cause,
        preventative_action, systemic_issue, created_by, created_at
    ) VALUES (
        'COMP-2024-006',
        v_rep_ids[6],
        'Peter Botha',
        'peter.botha@email.com',
        '082 111 2222',
        v_today - INTERVAL '35 days',
        v_today - INTERVAL '34 days',
        'email',
        'Policy Administration',
        'Documentation Error',
        'Policy schedule shows incorrect ID number. Client concerned about potential claim issues. Requesting urgent correction.',
        'Funeral Cover',
        'FC-2024-445566',
        'low',
        'minor',
        'resolved',
        v_user_ids[5],
        'ID number transposition error during data capture. Verified correct ID from certified copy provided at application. No impact on policy validity or claims as biometric verification also on file.',
        'Policy schedule corrected and reissued. Client sent updated documents via courier. Confirmed ID number now matches certified copy. No charge for reissue. Processing time: 3 working days.',
        v_today - INTERVAL '29 days',
        v_today - INTERVAL '34 days',
        v_today - INTERVAL '34 days',
        v_today - INTERVAL '4 days',
        false,
        'Manual data capture error. No validation check for ID number format during policy setup',
        'Implemented automated ID number validation using Luhn algorithm. Added confirmation step in policy setup workflow. Training provided to data capture team.',
        true,
        v_user_ids[1],
        v_today - INTERVAL '34 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 7: High Priority - Claims Processing Delay (OPEN)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, acknowledgement_sent_date,
        acknowledgement_due_date, resolution_due_date, is_overdue,
        created_by, created_at
    ) VALUES (
        'COMP-2024-007',
        v_rep_ids[7],
        'Lindiwe Khumalo',
        'lindiwe.k@email.com',
        '073 666 7777',
        v_today - INTERVAL '18 days',
        v_today - INTERVAL '17 days',
        'phone',
        'Claims Processing',
        'Processing Delay',
        'Disability claim submitted 6 weeks ago, still no decision. Client submitted all requested medical documentation within 48 hours of initial submission. Multiple follow-ups have not expedited process. Client facing financial hardship.',
        'Disability Insurance',
        'DI-2022-778899',
        'high',
        'major',
        'investigating',
        v_user_ids[6],
        'Claim file review shows complete documentation submitted on time. Delay caused by backlog in medical assessment team. Escalated to claims manager. Independent medical assessment scheduled for next week. Interim payment being processed to assist client.',
        v_today - INTERVAL '17 days',
        v_today - INTERVAL '17 days',
        v_today + INTERVAL '28 days',
        false,
        v_user_ids[2],
        v_today - INTERVAL '17 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 8: Critical Priority - Investment Performance (PENDING)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, acknowledgement_sent_date,
        acknowledgement_due_date, resolution_due_date, is_overdue,
        escalated_to_fsca, fsca_case_number, fsca_escalation_date,
        created_by, created_at
    ) VALUES (
        'COMP-2024-008',
        v_rep_ids[8],
        'Robert Chen',
        'robert.chen@email.com',
        '084 555 6666',
        v_today - INTERVAL '60 days',
        v_today - INTERVAL '59 days',
        'email',
        'Investment Advice',
        'Unsuitable Advice',
        'Client alleges investment advice was unsuitable for their risk profile. Aggressive growth portfolio recommended despite client being 62 years old and 3 years from retirement. Portfolio has lost 22% value in market downturn. Client claims risk profile assessment was inadequate and they were not properly informed of risks.',
        'Investment Portfolio',
        'INV-2023-334455',
        'critical',
        'critical',
        'pending',
        v_user_ids[7],
        'Comprehensive review of initial risk profiling and advice process. Client risk questionnaire reviewed - client indicated "moderate to high" risk tolerance. Fact-find shows adequate income and other retirement provisions. Product disclosure documents signed. However, verbal discussion notes are sparse on downside risk scenarios. FSCA has requested full file. Independent compliance review commissioned.',
        v_today - INTERVAL '59 days',
        v_today - INTERVAL '59 days',
        v_today - INTERVAL '29 days',
        true,
        true,
        'FSCA-2024-0876',
        v_today - INTERVAL '20 days',
        v_user_ids[2],
        v_today - INTERVAL '59 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 9: Medium Priority - Premium Debit Order (OPEN)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, acknowledgement_sent_date,
        acknowledgement_due_date, resolution_due_date, is_overdue,
        created_by, created_at
    ) VALUES (
        'COMP-2024-009',
        v_rep_ids[9],
        'Zanele Ndlovu',
        'zanele.ndlovu@email.com',
        '072 333 4444',
        v_today - INTERVAL '8 days',
        v_today - INTERVAL '7 days',
        'portal',
        'Payment & Billing',
        'Debit Order Issues',
        'Premium debit order processed twice in same month causing bank account overdraft. Client incurred bank charges. Requesting refund of duplicate payment and bank charges.',
        'Life Insurance',
        'LI-2023-556677',
        'medium',
        'moderate',
        'investigating',
        v_user_ids[8],
        'Payment system logs show duplicate transaction due to system glitch during scheduled maintenance window. Duplicate debit identified. Refund process initiated. Client provided bank statements showing overdraft fees. Preparing compensation offer for bank charges plus goodwill gesture.',
        v_today - INTERVAL '7 days',
        v_today - INTERVAL '7 days',
        v_today + INTERVAL '8 days',
        false,
        v_user_ids[3],
        v_today - INTERVAL '7 days'
    );
    
    -- ========================================================================
    -- COMPLAINT 10: High Priority - Beneficiary Dispute (RESOLVED WITH COMPENSATION)
    -- ========================================================================
    INSERT INTO complaints (
        complaint_reference_number, representative_id, complainant_name,
        complainant_email, complainant_phone, complaint_date,
        complaint_received_date, complaint_channel, complaint_category,
        complaint_subcategory, complaint_description, product_type,
        policy_number, priority, severity, status, assigned_to,
        investigation_notes, resolution_description, resolution_date,
        acknowledgement_sent_date, acknowledgement_due_date,
        resolution_due_date, is_overdue, compensation_offered,
        compensation_amount, compensation_paid, compensation_payment_date,
        root_cause, preventative_action, systemic_issue,
        created_by, created_at
    ) VALUES (
        'COMP-2024-010',
        v_rep_ids[10],
        'Nomsa Zulu',
        'nomsa.zulu@email.com',
        '083 999 8888',
        v_today - INTERVAL '120 days',
        v_today - INTERVAL '119 days',
        'in-person',
        'Claims Processing',
        'Beneficiary Dispute',
        'Death claim - beneficiary nomination form submitted 6 months before policyholder death not processed. Original beneficiary (ex-spouse) received payment instead of updated beneficiary (current spouse). Family dispute escalated. Legal action threatened.',
        'Life Insurance',
        'LI-2021-998877',
        'high',
        'critical',
        'resolved',
        v_user_ids[9],
        'Full investigation conducted. Beneficiary change form found in archived correspondence but not processed into system. Form was complete and valid. Processing error occurred during system migration 8 months ago. Legal consulted. Full liability acknowledged.',
        'Company accepted full liability for processing error. Negotiated settlement with original beneficiary for return of funds. Claim paid to correct beneficiary with interest for delay. Legal costs covered. Formal apology issued to family. Internal processes reviewed and strengthened.',
        v_today - INTERVAL '30 days',
        v_today - INTERVAL '119 days',
        v_today - INTERVAL '119 days',
        v_today - INTERVAL '89 days',
        true,
        true,
        45000.00,
        true,
        v_today - INTERVAL '28 days',
        'Beneficiary change form received but not processed during system migration. Manual processing queue not monitored effectively during transition period',
        'Implemented automated beneficiary change tracking system. Added weekly audit of pending beneficiary changes. Enhanced quality control checks during system migrations. Additional training provided to admin team. Included in risk register for ongoing monitoring.',
        true,
        v_user_ids[2],
        v_today - INTERVAL '119 days'
    );
    
    RAISE NOTICE 'Successfully created 10 realistic complaints with varied statuses and scenarios';
    
END $$;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
SELECT 
    complaint_reference_number,
    complainant_name,
    complaint_category,
    complaint_subcategory,
    priority,
    status,
    is_overdue,
    CASE 
        WHEN resolution_date IS NOT NULL THEN 'Resolved'
        WHEN escalated_to_ombud THEN 'Escalated to Ombud'
        WHEN escalated_to_fsca THEN 'Escalated to FSCA'
        WHEN is_overdue THEN 'Overdue'
        ELSE 'On Track'
    END as current_state,
    complaint_date,
    resolution_due_date
FROM complaints
WHERE complaint_reference_number LIKE 'COMP-2024%'
ORDER BY complaint_date DESC;

