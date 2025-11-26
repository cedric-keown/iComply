-- ============================================================================
-- iCOMPLY CRUD OPERATIONS - PHASE 5, 6, 7
-- Documents, Complaints, Alerts, Audits, Reports
-- Generated: 2025-11-26
-- ============================================================================

-- ============================================================================
-- PHASE 5: DOCUMENTS & COMPLAINTS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- DOCUMENTS CRUD
-- ----------------------------------------------------------------------------

-- Create Document
CREATE OR REPLACE FUNCTION create_document(
    p_document_owner_type TEXT,
    p_document_owner_id UUID,
    p_document_name TEXT,
    p_document_type TEXT,
    p_document_category TEXT,
    p_file_name TEXT,
    p_file_size_bytes BIGINT DEFAULT NULL,
    p_file_type TEXT DEFAULT NULL,
    p_storage_path TEXT DEFAULT NULL,
    p_storage_url TEXT DEFAULT NULL,
    p_document_date DATE DEFAULT NULL,
    p_expiry_date DATE DEFAULT NULL,
    p_retention_period_years INTEGER DEFAULT 5,
    p_is_sensitive BOOLEAN DEFAULT FALSE,
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
    IF p_document_name IS NULL OR p_document_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Document name is required');
    END IF;
    
    IF p_file_name IS NULL OR p_file_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'File name is required');
    END IF;

    INSERT INTO documents (
        document_owner_type, document_owner_id, document_name, document_type,
        document_category, file_name, file_size_bytes, file_type,
        storage_path, storage_url, document_date, expiry_date,
        retention_period_years, is_sensitive, uploaded_by, status
    )
    VALUES (
        p_document_owner_type, p_document_owner_id, p_document_name, p_document_type,
        p_document_category, p_file_name, p_file_size_bytes, p_file_type,
        p_storage_path, p_storage_url, p_document_date, p_expiry_date,
        p_retention_period_years, p_is_sensitive, p_uploaded_by, 'active'
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Document created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create document: ' || SQLERRM);
END;
$$;

-- Get Documents
CREATE OR REPLACE FUNCTION get_documents(
    p_document_owner_type TEXT DEFAULT NULL,
    p_document_owner_id UUID DEFAULT NULL,
    p_document_category TEXT DEFAULT NULL,
    p_status TEXT DEFAULT 'active'
)
RETURNS TABLE(
    id UUID,
    document_owner_type TEXT,
    document_owner_id UUID,
    document_name TEXT,
    document_type TEXT,
    document_category TEXT,
    file_name TEXT,
    file_size_bytes BIGINT,
    file_type TEXT,
    storage_path TEXT,
    storage_url TEXT,
    document_date DATE,
    expiry_date DATE,
    status TEXT,
    is_sensitive BOOLEAN,
    uploaded_by UUID,
    upload_date DATE,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT d.id, d.document_owner_type, d.document_owner_id, d.document_name,
           d.document_type, d.document_category, d.file_name, d.file_size_bytes,
           d.file_type, d.storage_path, d.storage_url, d.document_date,
           d.expiry_date, d.status, d.is_sensitive, d.uploaded_by,
           d.upload_date, d.created_at
    FROM documents d
    WHERE (p_document_owner_type IS NULL OR d.document_owner_type = p_document_owner_type)
      AND (p_document_owner_id IS NULL OR d.document_owner_id = p_document_owner_id)
      AND (p_document_category IS NULL OR d.document_category = p_document_category)
      AND (p_status IS NULL OR d.status = p_status)
    ORDER BY d.upload_date DESC;
END;
$$;

-- Get Single Document
CREATE OR REPLACE FUNCTION get_document(p_id UUID)
RETURNS TABLE(
    id UUID,
    document_owner_type TEXT,
    document_owner_id UUID,
    document_name TEXT,
    document_type TEXT,
    document_category TEXT,
    file_name TEXT,
    file_size_bytes BIGINT,
    file_type TEXT,
    mime_type TEXT,
    storage_bucket TEXT,
    storage_path TEXT,
    storage_url TEXT,
    description TEXT,
    tags TEXT[],
    upload_date DATE,
    document_date DATE,
    expiry_date DATE,
    retention_period_years INTEGER,
    status TEXT,
    is_sensitive BOOLEAN,
    requires_encryption BOOLEAN,
    uploaded_by UUID,
    access_count INTEGER,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Log access
    UPDATE documents SET access_count = access_count + 1, updated_at = NOW() WHERE id = p_id;
    
    RETURN QUERY
    SELECT d.*
    FROM documents d
    WHERE d.id = p_id;
END;
$$;

-- Update Document
CREATE OR REPLACE FUNCTION update_document(
    p_id UUID,
    p_document_name TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_tags TEXT[] DEFAULT NULL,
    p_expiry_date DATE DEFAULT NULL,
    p_status TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE documents 
    SET 
        document_name = COALESCE(p_document_name, document_name),
        description = COALESCE(p_description, description),
        tags = COALESCE(p_tags, tags),
        expiry_date = COALESCE(p_expiry_date, expiry_date),
        status = COALESCE(p_status, status),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Document updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Document not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update document: ' || SQLERRM);
END;
$$;

-- Soft Delete Document
CREATE OR REPLACE FUNCTION delete_document(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE documents 
    SET status = 'deleted', updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Document marked as deleted');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Document not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete document: ' || SQLERRM);
END;
$$;

-- Log Document Access
CREATE OR REPLACE FUNCTION log_document_access(
    p_document_id UUID,
    p_accessed_by UUID,
    p_access_type TEXT,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO document_access_log (
        document_id, accessed_by, access_type, ip_address, user_agent
    )
    VALUES (
        p_document_id, p_accessed_by, p_access_type, p_ip_address, p_user_agent
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id);
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to log document access: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- COMPLAINTS CRUD
-- ----------------------------------------------------------------------------

-- Create Complaint
CREATE OR REPLACE FUNCTION create_complaint(
    p_complaint_reference_number TEXT,
    p_complainant_name TEXT,
    p_complaint_date DATE,
    p_complaint_received_date DATE,
    p_complaint_channel TEXT,
    p_complaint_category TEXT,
    p_complaint_description TEXT,
    p_client_id UUID DEFAULT NULL,
    p_representative_id UUID DEFAULT NULL,
    p_complainant_email TEXT DEFAULT NULL,
    p_complainant_phone TEXT DEFAULT NULL,
    p_priority TEXT DEFAULT 'medium',
    p_severity TEXT DEFAULT 'minor',
    p_assigned_to UUID DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
    v_ack_due DATE;
    v_resolution_due DATE;
BEGIN
    IF p_complainant_name IS NULL OR p_complainant_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Complainant name is required');
    END IF;
    
    IF p_complaint_description IS NULL OR p_complaint_description = '' THEN
        RETURN json_build_object('success', false, 'error', 'Complaint description is required');
    END IF;

    -- Calculate due dates
    v_ack_due := p_complaint_received_date + INTERVAL '2 days';
    v_resolution_due := p_complaint_received_date + INTERVAL '6 weeks';

    INSERT INTO complaints (
        complaint_reference_number, client_id, representative_id,
        complainant_name, complainant_email, complainant_phone,
        complaint_date, complaint_received_date, complaint_channel,
        complaint_category, complaint_description, priority, severity,
        assigned_to, acknowledgement_due_date, resolution_due_date,
        status, created_by
    )
    VALUES (
        p_complaint_reference_number, p_client_id, p_representative_id,
        p_complainant_name, p_complainant_email, p_complainant_phone,
        p_complaint_date, p_complaint_received_date, p_complaint_channel,
        p_complaint_category, p_complaint_description, p_priority, p_severity,
        p_assigned_to, v_ack_due, v_resolution_due,
        'open', p_created_by
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Complaint created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Complaint reference number already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create complaint: ' || SQLERRM);
END;
$$;

-- Get Complaints
CREATE OR REPLACE FUNCTION get_complaints(
    p_status TEXT DEFAULT NULL,
    p_priority TEXT DEFAULT NULL,
    p_assigned_to UUID DEFAULT NULL,
    p_representative_id UUID DEFAULT NULL,
    p_is_overdue BOOLEAN DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    complaint_reference_number TEXT,
    client_id UUID,
    representative_id UUID,
    complainant_name TEXT,
    complaint_date DATE,
    complaint_received_date DATE,
    complaint_channel TEXT,
    complaint_category TEXT,
    complaint_description TEXT,
    priority TEXT,
    severity TEXT,
    status TEXT,
    assigned_to UUID,
    acknowledgement_due_date DATE,
    resolution_due_date DATE,
    is_overdue BOOLEAN,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT c.id, c.complaint_reference_number, c.client_id, c.representative_id,
           c.complainant_name, c.complaint_date, c.complaint_received_date,
           c.complaint_channel, c.complaint_category, c.complaint_description,
           c.priority, c.severity, c.status, c.assigned_to,
           c.acknowledgement_due_date, c.resolution_due_date, c.is_overdue,
           c.created_at
    FROM complaints c
    WHERE (p_status IS NULL OR c.status = p_status)
      AND (p_priority IS NULL OR c.priority = p_priority)
      AND (p_assigned_to IS NULL OR c.assigned_to = p_assigned_to)
      AND (p_representative_id IS NULL OR c.representative_id = p_representative_id)
      AND (p_is_overdue IS NULL OR c.is_overdue = p_is_overdue)
    ORDER BY 
        CASE WHEN c.is_overdue THEN 0 ELSE 1 END,
        c.priority DESC,
        c.complaint_received_date DESC;
END;
$$;

-- Get Single Complaint
CREATE OR REPLACE FUNCTION get_complaint(p_id UUID)
RETURNS TABLE(
    id UUID,
    complaint_reference_number TEXT,
    client_id UUID,
    representative_id UUID,
    complainant_name TEXT,
    complainant_email TEXT,
    complainant_phone TEXT,
    complainant_address TEXT,
    complaint_date DATE,
    complaint_received_date DATE,
    complaint_channel TEXT,
    complaint_category TEXT,
    complaint_subcategory TEXT,
    complaint_description TEXT,
    product_type TEXT,
    policy_number TEXT,
    priority TEXT,
    severity TEXT,
    status TEXT,
    assigned_to UUID,
    investigation_notes TEXT,
    resolution_description TEXT,
    resolution_date DATE,
    acknowledgement_sent_date DATE,
    acknowledgement_due_date DATE,
    resolution_due_date DATE,
    is_overdue BOOLEAN,
    escalated_to_ombud BOOLEAN,
    ombud_case_number TEXT,
    escalated_to_fsca BOOLEAN,
    fsca_case_number TEXT,
    compensation_offered BOOLEAN,
    compensation_amount DECIMAL,
    root_cause TEXT,
    preventative_action TEXT,
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
    FROM complaints c
    WHERE c.id = p_id;
END;
$$;

-- Update Complaint
CREATE OR REPLACE FUNCTION update_complaint(
    p_id UUID,
    p_status TEXT DEFAULT NULL,
    p_priority TEXT DEFAULT NULL,
    p_assigned_to UUID DEFAULT NULL,
    p_investigation_notes TEXT DEFAULT NULL,
    p_resolution_description TEXT DEFAULT NULL,
    p_resolution_date DATE DEFAULT NULL,
    p_acknowledgement_sent_date DATE DEFAULT NULL,
    p_root_cause TEXT DEFAULT NULL,
    p_preventative_action TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE complaints 
    SET 
        status = COALESCE(p_status, status),
        priority = COALESCE(p_priority, priority),
        assigned_to = COALESCE(p_assigned_to, assigned_to),
        investigation_notes = COALESCE(p_investigation_notes, investigation_notes),
        resolution_description = COALESCE(p_resolution_description, resolution_description),
        resolution_date = COALESCE(p_resolution_date, resolution_date),
        acknowledgement_sent_date = COALESCE(p_acknowledgement_sent_date, acknowledgement_sent_date),
        root_cause = COALESCE(p_root_cause, root_cause),
        preventative_action = COALESCE(p_preventative_action, preventative_action),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Complaint updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Complaint not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update complaint: ' || SQLERRM);
END;
$$;

-- Add Complaint Communication
CREATE OR REPLACE FUNCTION add_complaint_communication(
    p_complaint_id UUID,
    p_communication_date TIMESTAMPTZ,
    p_communication_type TEXT,
    p_communication_direction TEXT,
    p_from_party TEXT,
    p_to_party TEXT,
    p_message TEXT,
    p_subject TEXT DEFAULT NULL,
    p_logged_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO complaint_communications (
        complaint_id, communication_date, communication_type,
        communication_direction, from_party, to_party,
        subject, message, logged_by
    )
    VALUES (
        p_complaint_id, p_communication_date, p_communication_type,
        p_communication_direction, p_from_party, p_to_party,
        p_subject, p_message, p_logged_by
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Communication logged successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to log communication: ' || SQLERRM);
END;
$$;

-- Get Complaint Communications
CREATE OR REPLACE FUNCTION get_complaint_communications(
    p_complaint_id UUID
)
RETURNS TABLE(
    id UUID,
    complaint_id UUID,
    communication_date TIMESTAMPTZ,
    communication_type TEXT,
    communication_direction TEXT,
    from_party TEXT,
    to_party TEXT,
    subject TEXT,
    message TEXT,
    logged_by UUID,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT cc.*
    FROM complaint_communications cc
    WHERE cc.complaint_id = p_complaint_id
    ORDER BY cc.communication_date DESC;
END;
$$;

-- ============================================================================
-- PHASE 6: ALERTS & MONITORING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- ALERT RULES CRUD
-- ----------------------------------------------------------------------------

-- Create Alert Rule
CREATE OR REPLACE FUNCTION create_alert_rule(
    p_rule_name TEXT,
    p_rule_description TEXT,
    p_rule_type TEXT,
    p_target_entity TEXT,
    p_conditions JSONB,
    p_priority TEXT,
    p_alert_frequency TEXT DEFAULT 'once',
    p_send_email BOOLEAN DEFAULT TRUE,
    p_send_in_app BOOLEAN DEFAULT TRUE,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_rule_name IS NULL OR p_rule_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Rule name is required');
    END IF;

    INSERT INTO alert_rules (
        rule_name, rule_description, rule_type, target_entity,
        conditions, priority, alert_frequency, send_email,
        send_in_app, is_active, created_by
    )
    VALUES (
        p_rule_name, p_rule_description, p_rule_type, p_target_entity,
        p_conditions, p_priority, p_alert_frequency, p_send_email,
        p_send_in_app, true, p_created_by
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Alert rule created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Rule name already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create alert rule: ' || SQLERRM);
END;
$$;

-- Get Alert Rules
CREATE OR REPLACE FUNCTION get_alert_rules(
    p_is_active BOOLEAN DEFAULT NULL,
    p_target_entity TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    rule_name TEXT,
    rule_description TEXT,
    rule_type TEXT,
    target_entity TEXT,
    conditions JSONB,
    priority TEXT,
    alert_frequency TEXT,
    send_email BOOLEAN,
    send_sms BOOLEAN,
    send_in_app BOOLEAN,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT ar.id, ar.rule_name, ar.rule_description, ar.rule_type,
           ar.target_entity, ar.conditions, ar.priority, ar.alert_frequency,
           ar.send_email, ar.send_sms, ar.send_in_app, ar.is_active,
           ar.created_at
    FROM alert_rules ar
    WHERE (p_is_active IS NULL OR ar.is_active = p_is_active)
      AND (p_target_entity IS NULL OR ar.target_entity = p_target_entity)
    ORDER BY ar.priority DESC, ar.rule_name;
END;
$$;

-- Update Alert Rule
CREATE OR REPLACE FUNCTION update_alert_rule(
    p_id UUID,
    p_rule_description TEXT DEFAULT NULL,
    p_conditions JSONB DEFAULT NULL,
    p_priority TEXT DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE alert_rules 
    SET 
        rule_description = COALESCE(p_rule_description, rule_description),
        conditions = COALESCE(p_conditions, conditions),
        priority = COALESCE(p_priority, priority),
        is_active = COALESCE(p_is_active, is_active),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Alert rule updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Alert rule not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update alert rule: ' || SQLERRM);
END;
$$;

-- Delete Alert Rule
CREATE OR REPLACE FUNCTION delete_alert_rule(p_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if it's a system rule
    IF EXISTS (SELECT 1 FROM alert_rules WHERE id = p_id AND is_system_rule = true) THEN
        RETURN json_build_object('success', false, 'error', 'Cannot delete system rule');
    END IF;

    DELETE FROM alert_rules WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Alert rule deleted successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Alert rule not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to delete alert rule: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- ALERTS CRUD
-- ----------------------------------------------------------------------------

-- Create Alert
CREATE OR REPLACE FUNCTION create_alert(
    p_alert_rule_id UUID,
    p_alert_title TEXT,
    p_alert_message TEXT,
    p_priority TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_representative_id UUID DEFAULT NULL,
    p_client_id UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO alerts (
        alert_rule_id, alert_title, alert_message, priority,
        entity_type, entity_id, representative_id, client_id, status
    )
    VALUES (
        p_alert_rule_id, p_alert_title, p_alert_message, p_priority,
        p_entity_type, p_entity_id, p_representative_id, p_client_id, 'active'
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Alert created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create alert: ' || SQLERRM);
END;
$$;

-- Get Alerts
CREATE OR REPLACE FUNCTION get_alerts(
    p_status TEXT DEFAULT 'active',
    p_priority TEXT DEFAULT NULL,
    p_representative_id UUID DEFAULT NULL,
    p_entity_type TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    alert_rule_id UUID,
    alert_title TEXT,
    alert_message TEXT,
    priority TEXT,
    entity_type TEXT,
    entity_id UUID,
    representative_id UUID,
    client_id UUID,
    status TEXT,
    acknowledged_by UUID,
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID,
    resolved_at TIMESTAMPTZ,
    valid_from TIMESTAMPTZ,
    valid_until TIMESTAMPTZ,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT a.id, a.alert_rule_id, a.alert_title, a.alert_message, a.priority,
           a.entity_type, a.entity_id, a.representative_id, a.client_id,
           a.status, a.acknowledged_by, a.acknowledged_at, a.resolved_by,
           a.resolved_at, a.valid_from, a.valid_until, a.created_at
    FROM alerts a
    WHERE (p_status IS NULL OR a.status = p_status)
      AND (p_priority IS NULL OR a.priority = p_priority)
      AND (p_representative_id IS NULL OR a.representative_id = p_representative_id)
      AND (p_entity_type IS NULL OR a.entity_type = p_entity_type)
    ORDER BY 
        CASE a.priority
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            ELSE 4
        END,
        a.created_at DESC;
END;
$$;

-- Acknowledge Alert
CREATE OR REPLACE FUNCTION acknowledge_alert(
    p_id UUID,
    p_acknowledged_by UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE alerts 
    SET 
        status = 'acknowledged',
        acknowledged_by = p_acknowledged_by,
        acknowledged_at = NOW(),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Alert acknowledged successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Alert not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to acknowledge alert: ' || SQLERRM);
END;
$$;

-- Resolve Alert
CREATE OR REPLACE FUNCTION resolve_alert(
    p_id UUID,
    p_resolved_by UUID,
    p_resolution_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE alerts 
    SET 
        status = 'resolved',
        resolved_by = p_resolved_by,
        resolved_at = NOW(),
        resolution_notes = p_resolution_notes,
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Alert resolved successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Alert not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to resolve alert: ' || SQLERRM);
END;
$$;

-- ----------------------------------------------------------------------------
-- INTERNAL AUDITS CRUD
-- ----------------------------------------------------------------------------

-- Create Internal Audit
CREATE OR REPLACE FUNCTION create_internal_audit(
    p_audit_reference_number TEXT,
    p_audit_name TEXT,
    p_audit_type TEXT,
    p_audit_scope TEXT,
    p_audit_period_start DATE,
    p_audit_period_end DATE,
    p_planned_start_date DATE DEFAULT NULL,
    p_planned_completion_date DATE DEFAULT NULL,
    p_lead_auditor UUID DEFAULT NULL,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_audit_name IS NULL OR p_audit_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Audit name is required');
    END IF;

    INSERT INTO internal_audits (
        audit_reference_number, audit_name, audit_type, audit_scope,
        audit_period_start, audit_period_end, planned_start_date,
        planned_completion_date, lead_auditor, status, created_by
    )
    VALUES (
        p_audit_reference_number, p_audit_name, p_audit_type, p_audit_scope,
        p_audit_period_start, p_audit_period_end, p_planned_start_date,
        p_planned_completion_date, p_lead_auditor, 'planned', p_created_by
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Internal audit created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Audit reference number already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create internal audit: ' || SQLERRM);
END;
$$;

-- Get Internal Audits
CREATE OR REPLACE FUNCTION get_internal_audits(
    p_status TEXT DEFAULT NULL,
    p_audit_type TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    audit_reference_number TEXT,
    audit_name TEXT,
    audit_type TEXT,
    audit_scope TEXT,
    audit_period_start DATE,
    audit_period_end DATE,
    planned_start_date DATE,
    actual_start_date DATE,
    planned_completion_date DATE,
    actual_completion_date DATE,
    status TEXT,
    lead_auditor UUID,
    total_findings INTEGER,
    critical_findings INTEGER,
    high_findings INTEGER,
    overall_rating TEXT,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT ia.id, ia.audit_reference_number, ia.audit_name, ia.audit_type,
           ia.audit_scope, ia.audit_period_start, ia.audit_period_end,
           ia.planned_start_date, ia.actual_start_date, ia.planned_completion_date,
           ia.actual_completion_date, ia.status, ia.lead_auditor,
           ia.total_findings, ia.critical_findings, ia.high_findings,
           ia.overall_rating, ia.created_at
    FROM internal_audits ia
    WHERE (p_status IS NULL OR ia.status = p_status)
      AND (p_audit_type IS NULL OR ia.audit_type = p_audit_type)
    ORDER BY ia.audit_period_start DESC;
END;
$$;

-- Update Internal Audit
CREATE OR REPLACE FUNCTION update_internal_audit(
    p_id UUID,
    p_status TEXT DEFAULT NULL,
    p_actual_start_date DATE DEFAULT NULL,
    p_actual_completion_date DATE DEFAULT NULL,
    p_overall_rating TEXT DEFAULT NULL,
    p_executive_summary TEXT DEFAULT NULL,
    p_key_risks_identified TEXT DEFAULT NULL,
    p_recommendations TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE internal_audits 
    SET 
        status = COALESCE(p_status, status),
        actual_start_date = COALESCE(p_actual_start_date, actual_start_date),
        actual_completion_date = COALESCE(p_actual_completion_date, actual_completion_date),
        overall_rating = COALESCE(p_overall_rating, overall_rating),
        executive_summary = COALESCE(p_executive_summary, executive_summary),
        key_risks_identified = COALESCE(p_key_risks_identified, key_risks_identified),
        recommendations = COALESCE(p_recommendations, recommendations),
        updated_at = NOW()
    WHERE id = p_id;
    
    IF FOUND THEN
        RETURN json_build_object('success', true, 'message', 'Internal audit updated successfully');
    ELSE
        RETURN json_build_object('success', false, 'error', 'Internal audit not found');
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to update internal audit: ' || SQLERRM);
END;
$$;

-- Create Audit Finding
CREATE OR REPLACE FUNCTION create_audit_finding(
    p_internal_audit_id UUID,
    p_finding_reference_number TEXT,
    p_finding_title TEXT,
    p_finding_description TEXT,
    p_area_audited TEXT,
    p_severity TEXT,
    p_recommendation TEXT,
    p_remediation_owner UUID DEFAULT NULL,
    p_remediation_due_date DATE DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO audit_findings (
        internal_audit_id, finding_reference_number, finding_title,
        finding_description, area_audited, severity, recommendation,
        remediation_owner, remediation_due_date, remediation_status
    )
    VALUES (
        p_internal_audit_id, p_finding_reference_number, p_finding_title,
        p_finding_description, p_area_audited, p_severity, p_recommendation,
        p_remediation_owner, p_remediation_due_date, 'open'
    )
    RETURNING id INTO v_id;
    
    -- Update audit findings count
    UPDATE internal_audits
    SET 
        total_findings = total_findings + 1,
        critical_findings = critical_findings + CASE WHEN p_severity = 'critical' THEN 1 ELSE 0 END,
        high_findings = high_findings + CASE WHEN p_severity = 'high' THEN 1 ELSE 0 END,
        medium_findings = medium_findings + CASE WHEN p_severity = 'medium' THEN 1 ELSE 0 END,
        low_findings = low_findings + CASE WHEN p_severity = 'low' THEN 1 ELSE 0 END
    WHERE id = p_internal_audit_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Audit finding created successfully');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create audit finding: ' || SQLERRM);
END;
$$;

-- Get Audit Findings
CREATE OR REPLACE FUNCTION get_audit_findings(
    p_internal_audit_id UUID,
    p_remediation_status TEXT DEFAULT NULL
)
RETURNS TABLE(
    id UUID,
    internal_audit_id UUID,
    finding_reference_number TEXT,
    finding_title TEXT,
    finding_description TEXT,
    area_audited TEXT,
    severity TEXT,
    recommendation TEXT,
    management_response TEXT,
    remediation_status TEXT,
    remediation_owner UUID,
    remediation_due_date DATE,
    remediation_actual_date DATE,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT af.id, af.internal_audit_id, af.finding_reference_number,
           af.finding_title, af.finding_description, af.area_audited,
           af.severity, af.recommendation, af.management_response,
           af.remediation_status, af.remediation_owner, af.remediation_due_date,
           af.remediation_actual_date, af.created_at
    FROM audit_findings af
    WHERE af.internal_audit_id = p_internal_audit_id
      AND (p_remediation_status IS NULL OR af.remediation_status = p_remediation_status)
    ORDER BY 
        CASE af.severity
            WHEN 'critical' THEN 1
            WHEN 'high' THEN 2
            WHEN 'medium' THEN 3
            ELSE 4
        END,
        af.created_at;
END;
$$;

-- ============================================================================
-- PHASE 7: DASHBOARDS & REPORTING
-- ============================================================================

-- ----------------------------------------------------------------------------
-- REPORT TEMPLATES CRUD
-- ----------------------------------------------------------------------------

-- Create Report Template
CREATE OR REPLACE FUNCTION create_report_template(
    p_template_name TEXT,
    p_template_description TEXT,
    p_template_category TEXT,
    p_report_type TEXT,
    p_data_sources TEXT[],
    p_report_structure JSONB,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    IF p_template_name IS NULL OR p_template_name = '' THEN
        RETURN json_build_object('success', false, 'error', 'Template name is required');
    END IF;

    INSERT INTO report_templates (
        template_name, template_description, template_category,
        report_type, data_sources, report_structure,
        is_active, created_by
    )
    VALUES (
        p_template_name, p_template_description, p_template_category,
        p_report_type, p_data_sources, p_report_structure,
        true, p_created_by
    )
    RETURNING id INTO v_id;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Report template created successfully');
EXCEPTION
    WHEN unique_violation THEN
        RETURN json_build_object('success', false, 'error', 'Template name already exists');
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to create report template: ' || SQLERRM);
END;
$$;

-- Get Report Templates
CREATE OR REPLACE FUNCTION get_report_templates(
    p_template_category TEXT DEFAULT NULL,
    p_is_active BOOLEAN DEFAULT TRUE
)
RETURNS TABLE(
    id UUID,
    template_name TEXT,
    template_description TEXT,
    template_category TEXT,
    report_type TEXT,
    supports_pdf BOOLEAN,
    supports_excel BOOLEAN,
    is_active BOOLEAN,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT rt.id, rt.template_name, rt.template_description, rt.template_category,
           rt.report_type, rt.supports_pdf, rt.supports_excel, rt.is_active,
           rt.created_at
    FROM report_templates rt
    WHERE (p_template_category IS NULL OR rt.template_category = p_template_category)
      AND (p_is_active IS NULL OR rt.is_active = p_is_active)
    ORDER BY rt.template_name;
END;
$$;

-- Generate Report
CREATE OR REPLACE FUNCTION generate_report(
    p_report_template_id UUID,
    p_report_name TEXT,
    p_date_range_start DATE DEFAULT NULL,
    p_date_range_end DATE DEFAULT NULL,
    p_filters_applied JSONB DEFAULT NULL,
    p_output_format TEXT DEFAULT 'pdf',
    p_generated_by UUID DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO generated_reports (
        report_template_id, report_name, report_type, generation_date,
        date_range_start, date_range_end, filters_applied,
        output_format, status, generated_by
    )
    SELECT 
        p_report_template_id, p_report_name, rt.report_type, NOW(),
        p_date_range_start, p_date_range_end, p_filters_applied,
        p_output_format, 'generating', p_generated_by
    FROM report_templates rt
    WHERE rt.id = p_report_template_id
    RETURNING id INTO v_id;
    
    IF v_id IS NULL THEN
        RETURN json_build_object('success', false, 'error', 'Report template not found');
    END IF;
    
    RETURN json_build_object('success', true, 'id', v_id, 'message', 'Report generation initiated');
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', 'Failed to generate report: ' || SQLERRM);
END;
$$;

-- Get Generated Reports
CREATE OR REPLACE FUNCTION get_generated_reports(
    p_generated_by UUID DEFAULT NULL,
    p_status TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE(
    id UUID,
    report_template_id UUID,
    report_name TEXT,
    report_type TEXT,
    generation_date TIMESTAMPTZ,
    date_range_start DATE,
    date_range_end DATE,
    output_format TEXT,
    status TEXT,
    file_size_bytes BIGINT,
    storage_url TEXT,
    generated_by UUID,
    created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT gr.id, gr.report_template_id, gr.report_name, gr.report_type,
           gr.generation_date, gr.date_range_start, gr.date_range_end,
           gr.output_format, gr.status, gr.file_size_bytes, gr.storage_url,
           gr.generated_by, gr.created_at
    FROM generated_reports gr
    WHERE (p_generated_by IS NULL OR gr.generated_by = p_generated_by)
      AND (p_status IS NULL OR gr.status = p_status)
    ORDER BY gr.generation_date DESC
    LIMIT p_limit;
END;
$$;

-- ============================================================================
-- RBAC PERMISSIONS FOR PHASE 5, 6, 7 FUNCTIONS
-- ============================================================================

-- Add EXECUTE permissions for Admin role
INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
SELECT r.id, 'function', func.function_name, 'EXECUTE', true
FROM roles r
CROSS JOIN (VALUES 
    -- Phase 5 Functions
    ('create_document'), ('get_documents'), ('get_document'), ('update_document'), ('delete_document'), ('log_document_access'),
    ('create_complaint'), ('get_complaints'), ('get_complaint'), ('update_complaint'),
    ('add_complaint_communication'), ('get_complaint_communications'),
    -- Phase 6 Functions
    ('create_alert_rule'), ('get_alert_rules'), ('update_alert_rule'), ('delete_alert_rule'),
    ('create_alert'), ('get_alerts'), ('acknowledge_alert'), ('resolve_alert'),
    ('create_internal_audit'), ('get_internal_audits'), ('update_internal_audit'),
    ('create_audit_finding'), ('get_audit_findings'),
    -- Phase 7 Functions
    ('create_report_template'), ('get_report_templates'),
    ('generate_report'), ('get_generated_reports')
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
    ('get_documents'), ('get_document'), ('get_complaints'), ('get_complaint'),
    ('get_alerts'), ('acknowledge_alert'),
    ('get_report_templates'), ('generate_report'), ('get_generated_reports')
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
-- END OF PHASE 5-6-7 CRUD OPERATIONS
-- ============================================================================

