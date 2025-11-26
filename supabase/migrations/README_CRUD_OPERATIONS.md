# iComply CRUD Operations Documentation

## Overview

This document provides comprehensive documentation for all CRUD (Create, Read, Update, Delete) operations implemented for the iComply FSP Compliance Management Platform. All functions follow RBAC (Role-Based Access Control) patterns as specified in the RBAC_GUIDE.md.

## Table of Contents

- [Architecture](#architecture)
- [RBAC Roles](#rbac-roles)
- [Phase 1: Foundation & Authentication](#phase-1-foundation--authentication)
- [Phase 2: Representatives & Key Individuals](#phase-2-representatives--key-individuals)
- [Phase 3: Core Compliance Tracking](#phase-3-core-compliance-tracking)
- [Phase 4: Clients & FICA](#phase-4-clients--fica)
- [Phase 5: Documents & Complaints](#phase-5-documents--complaints)
- [Phase 6: Alerts & Monitoring](#phase-6-alerts--monitoring)
- [Phase 7: Dashboards & Reporting](#phase-7-dashboards--reporting)
- [Usage Examples](#usage-examples)
- [Error Handling](#error-handling)

## Architecture

### Function Structure

All CRUD functions follow this standard pattern:

```sql
CREATE OR REPLACE FUNCTION function_name(
    p_param1 TYPE,
    p_param2 TYPE DEFAULT NULL
)
RETURNS JSON  -- or TABLE for read operations
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_variable TYPE;
BEGIN
    -- Function logic
    RETURN json_build_object('success', true, 'id', v_id);
EXCEPTION
    WHEN OTHERS THEN
        RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$;
```

### Response Format

#### Write Operations (CREATE, UPDATE, DELETE)
```json
{
    "success": true,
    "id": "uuid",
    "message": "Operation completed successfully"
}
```

Or on error:
```json
{
    "success": false,
    "error": "Error message description"
}
```

#### Read Operations (GET)
Returns TABLE structure with columns matching the entity schema.

## RBAC Roles

### Admin
- Full CRUD access to all entities
- Can execute all functions
- Can manage system settings and configurations

### User
- Read access to all entities
- Create/Update access to own data (representatives, CPD activities)
- Limited write access to sensitive entities

### Viewer
- Read-only access to most entities
- Cannot modify any data
- Useful for audit and reporting purposes

### Representative
- Read/Write access to own data
- Can manage own CPD activities, clients, and compliance records
- Cannot access other representatives' data

## Phase 1: Foundation & Authentication

### FSP Configuration

#### `create_fsp_configuration()`
Creates the FSP (Financial Services Provider) configuration.

**Parameters:**
- `p_fsp_name` TEXT (required)
- `p_fsp_license_number` TEXT (required)
- `p_registration_number` TEXT
- `p_vat_number` TEXT
- `p_address_*` TEXT (street, city, province, postal_code)
- `p_phone` TEXT
- `p_email` TEXT
- `p_website` TEXT

**RBAC:** Admin only

**Example:**
```sql
SELECT create_fsp_configuration(
    'Example FSP',
    'FSP12345',
    'REG789',
    'VAT456',
    '123 Main St',
    'Cape Town',
    'Western Cape',
    '8001',
    '+27211234567',
    'info@examplefsp.co.za',
    'https://examplefsp.co.za'
);
```

#### `get_fsp_configuration()`
Retrieves the FSP configuration (returns the most recent record).

**RBAC:** Admin, User, Viewer

#### `update_fsp_configuration()`
Updates FSP configuration details.

**RBAC:** Admin only

### System Settings

#### `create_system_setting()`
Creates a system configuration setting.

**Parameters:**
- `p_setting_key` TEXT (required, unique)
- `p_setting_value` JSONB (required)
- `p_setting_type` TEXT (required): 'string', 'number', 'boolean', 'json'
- `p_category` TEXT (required): 'general', 'compliance', 'notifications', 'security'
- `p_description` TEXT

**RBAC:** Admin only

#### `get_system_settings()`
Retrieves system settings, optionally filtered by category.

**Parameters:**
- `p_category` TEXT (optional)

**RBAC:** Admin, User, Viewer

#### `update_system_setting()`
Updates a system setting value.

**RBAC:** Admin only

#### `delete_system_setting()`
Deletes a system setting.

**RBAC:** Admin only

### User Roles

#### `create_user_role()`
Creates a new user role definition.

**Parameters:**
- `p_role_name` TEXT (required, unique)
- `p_role_display_name` TEXT (required)
- `p_role_description` TEXT
- `p_permissions` JSONB (default: '{}')

**RBAC:** Admin only

#### `get_user_roles()`
Retrieves all user roles.

**RBAC:** Admin, User, Viewer

#### `update_user_role()`
Updates role details (cannot change role_name).

**RBAC:** Admin only

#### `delete_user_role()`
Deletes a role if it's not assigned to any users.

**RBAC:** Admin only

### User Profiles

#### `create_user_profile()`
Creates a user profile (linked to auth.users).

**Parameters:**
- `p_id` UUID (required, matches auth.users.id)
- `p_role_id` UUID (required)
- `p_first_name` TEXT (required)
- `p_last_name` TEXT (required)
- `p_email` TEXT (required, unique)
- `p_phone` TEXT
- `p_mobile` TEXT
- `p_id_number` TEXT (SA ID number)
- `p_fsp_number` TEXT
- `p_status` TEXT (default: 'active')

**RBAC:** Admin only

#### `get_user_profiles()`
Retrieves user profiles, optionally filtered by status.

**Parameters:**
- `p_status` TEXT (optional): 'active', 'inactive', 'suspended'

**RBAC:** Admin, User (limited to own profile), Viewer

#### `get_user_profile()`
Retrieves a single user profile by ID.

**RBAC:** Admin, User (own profile), Viewer

#### `update_user_profile()`
Updates user profile information.

**RBAC:** Admin, User (own profile)

#### `delete_user_profile()`
Soft deletes a user profile (sets status to 'inactive').

**RBAC:** Admin only

## Phase 2: Representatives & Key Individuals

### Representatives

#### `create_representative()`
Creates a representative record.

**Parameters:**
- `p_user_profile_id` UUID (required)
- `p_fsp_number` TEXT (required, unique)
- `p_supervised_by_ki_id` UUID (Key Individual supervising this rep)
- `p_class_1_long_term` BOOLEAN
- `p_class_2_short_term` BOOLEAN
- `p_class_3_pension` BOOLEAN
- `p_status` TEXT (default: 'active')
- `p_onboarding_date` DATE
- `p_authorization_date` DATE

**RBAC:** Admin only

#### `get_representatives()`
Retrieves representatives with optional filters.

**Parameters:**
- `p_status` TEXT (optional)
- `p_supervised_by_ki_id` UUID (optional)

**RBAC:** Admin, User, Viewer

#### `get_representative()`
Retrieves a single representative by ID.

**RBAC:** Admin, User, Viewer

#### `update_representative()`
Updates representative information.

**RBAC:** Admin only

#### `delete_representative()`
Soft deletes a representative (sets status to 'inactive').

**RBAC:** Admin only

### Key Individuals

#### `create_key_individual()`
Designates a representative as a Key Individual.

**Parameters:**
- `p_representative_id` UUID (required, unique)
- `p_ki_type` TEXT (required): 'principal', 'key_individual'
- `p_appointment_date` DATE (required)
- `p_max_supervised_count` INTEGER (default: 20)

**RBAC:** Admin only

#### `get_key_individuals()`
Retrieves active key individuals.

**Parameters:**
- `p_ki_type` TEXT (optional)

**RBAC:** Admin, User, Viewer

#### `update_key_individual()`
Updates key individual details.

**RBAC:** Admin only

#### `delete_key_individual()`
Sets resignation date for a key individual.

**RBAC:** Admin only

### Supervision Records

#### `create_supervision_record()`
Creates a supervision meeting record.

**Parameters:**
- `p_representative_id` UUID (required)
- `p_key_individual_id` UUID (required)
- `p_supervision_date` DATE (required)
- `p_meeting_type` TEXT: 'one_on_one', 'group', 'review'
- `p_notes` TEXT
- `p_action_items` TEXT
- `p_next_meeting_date` DATE
- `p_created_by` UUID

**RBAC:** Admin, User (if KI)

#### `get_supervision_records()`
Retrieves supervision records with filters.

**Parameters:**
- `p_representative_id` UUID (optional)
- `p_key_individual_id` UUID (optional)
- `p_limit` INTEGER (default: 100)

**RBAC:** Admin, User, Viewer

#### `update_supervision_record()`
Updates supervision record notes and action items.

**RBAC:** Admin, User (if KI)

#### `delete_supervision_record()`
Permanently deletes a supervision record.

**RBAC:** Admin only

## Phase 3: Core Compliance Tracking

### Fit and Proper Records

#### `create_fit_and_proper_record()`
Creates a Fit & Proper compliance record for a representative.

**Parameters:**
- `p_representative_id` UUID (required)
- RE5 qualification details (name, number, dates)
- RE1 qualification details (name, number, dates)

**RBAC:** Admin only

#### `get_fit_and_proper_records()`
Retrieves F&P records with optional filters.

**Parameters:**
- `p_representative_id` UUID (optional)
- `p_overall_status` TEXT (optional): 'compliant', 'expiring_soon', 'non_compliant'

**RBAC:** Admin, User, Viewer

#### `update_fit_and_proper_record()`
Updates F&P record with verification dates, status, etc.

**RBAC:** Admin only

### CPD Cycles

#### `create_cpd_cycle()`
Creates a CPD (Continuing Professional Development) cycle.

**Parameters:**
- `p_cycle_name` TEXT (required) e.g., "2024/2025"
- `p_start_date` DATE (required)
- `p_end_date` DATE (required)
- `p_required_hours` DECIMAL (default: 18.0)
- `p_required_ethics_hours` DECIMAL (default: 3.0)
- `p_required_technical_hours` DECIMAL (default: 14.0)
- `p_status` TEXT (default: 'active')

**RBAC:** Admin only

#### `get_cpd_cycles()`
Retrieves CPD cycles.

**Parameters:**
- `p_status` TEXT (optional): 'active', 'completed', 'archived'

**RBAC:** Admin, User, Viewer

#### `update_cpd_cycle()`
Updates CPD cycle details.

**RBAC:** Admin only

### CPD Activities

#### `create_cpd_activity()`
Logs a CPD activity for a representative.

**Parameters:**
- `p_representative_id` UUID (required)
- `p_cpd_cycle_id` UUID (required)
- `p_activity_date` DATE (required)
- `p_activity_name` TEXT (required)
- `p_activity_type` TEXT: 'workshop', 'webinar', 'course', 'conference', 'self_study'
- `p_provider_name` TEXT (required)
- `p_total_hours` DECIMAL (required, > 0)
- `p_ethics_hours` DECIMAL
- `p_technical_hours` DECIMAL
- `p_class_1/2/3_applicable` BOOLEAN
- `p_uploaded_by` UUID

**RBAC:** Admin, User (own activities)

#### `get_cpd_activities()`
Retrieves CPD activities with filters.

**Parameters:**
- `p_representative_id` UUID (optional)
- `p_cpd_cycle_id` UUID (optional)
- `p_status` TEXT (optional): 'pending', 'verified', 'rejected'

**RBAC:** Admin, User, Viewer

#### `update_cpd_activity()`
Updates CPD activity details.

**RBAC:** Admin, User (own activities)

#### `verify_cpd_activity()`
Approves or rejects a CPD activity.

**Parameters:**
- `p_id` UUID (required)
- `p_verified_by` UUID (required)
- `p_status` TEXT (required): 'verified', 'rejected'
- `p_rejection_reason` TEXT (if rejected)

**RBAC:** Admin only

#### `delete_cpd_activity()`
Permanently deletes a CPD activity.

**RBAC:** Admin only

#### `get_cpd_progress_summary()`
Retrieves aggregated CPD progress from the materialized view.

**Parameters:**
- `p_representative_id` UUID (optional)
- `p_cpd_cycle_id` UUID (optional)

**Returns:** Progress percentages and compliance status

**RBAC:** Admin, User, Viewer

## Phase 4: Clients & FICA

### Clients

#### `create_client()`
Creates a new client record.

**Parameters:**
- `p_assigned_representative_id` UUID (required)
- `p_client_type` TEXT (required): 'individual', 'corporate', 'trust'
- For individuals: title, first_name, last_name, id_number, date_of_birth
- For corporate: company_name, registration_number
- Contact details: email, phone, mobile
- `p_client_since` DATE
- `p_risk_category` TEXT (default: 'low'): 'low', 'medium', 'high'

**RBAC:** Admin, User

#### `get_clients()`
Retrieves clients with optional filters.

**Parameters:**
- `p_assigned_representative_id` UUID (optional)
- `p_client_type` TEXT (optional)
- `p_status` TEXT (optional): 'active', 'inactive', 'deceased', 'suspended'
- `p_risk_category` TEXT (optional)

**RBAC:** Admin, User (own clients), Viewer

#### `get_client()`
Retrieves a single client by ID with full details.

**RBAC:** Admin, User (own clients), Viewer

#### `update_client()`
Updates client information.

**RBAC:** Admin, User (own clients)

#### `delete_client()`
Soft deletes a client (sets status to 'inactive').

**RBAC:** Admin only

### FICA Verifications

#### `create_fica_verification()`
Creates a FICA verification record for a client.

**Parameters:**
- `p_client_id` UUID (required)
- `p_representative_id` UUID (required)
- `p_verification_type` TEXT (required): 'initial', 'periodic_review', 'update'
- `p_verification_date` DATE (default: CURRENT_DATE)
- `p_review_frequency_months` INTEGER (default: 60)

**RBAC:** Admin, User

#### `get_fica_verifications()`
Retrieves FICA verifications with filters.

**Parameters:**
- `p_client_id` UUID (optional)
- `p_representative_id` UUID (optional)
- `p_fica_status` TEXT (optional): 'pending', 'compliant', 'incomplete', 'non_compliant'

**RBAC:** Admin, User, Viewer

#### `update_fica_verification()`
Updates FICA verification details and calculates completeness percentage.

**Parameters:**
- `p_id` UUID (required)
- `p_id_document_verified` BOOLEAN
- `p_address_document_verified` BOOLEAN
- `p_bank_details_verified` BOOLEAN
- `p_tax_reference_verified` BOOLEAN
- `p_fica_status` TEXT
- `p_verified_by` UUID
- `p_verification_notes` TEXT

**Returns:** Success with completeness percentage

**RBAC:** Admin, User

#### `delete_fica_verification()`
Permanently deletes a FICA verification.

**RBAC:** Admin only

### Client Beneficial Owners

#### `create_client_beneficial_owner()`
Adds a beneficial owner for a corporate client.

**Parameters:**
- `p_client_id` UUID (required)
- `p_full_name` TEXT (required)
- `p_id_number` TEXT
- `p_nationality` TEXT
- `p_ownership_percentage` DECIMAL
- `p_control_type` TEXT: 'shareholding', 'voting_rights', 'beneficial_interest', 'control'
- `p_pep_status` BOOLEAN (default: FALSE)

**RBAC:** Admin, User

#### `get_client_beneficial_owners()`
Retrieves beneficial owners for a client.

**Parameters:**
- `p_client_id` UUID (required)

**RBAC:** Admin, User, Viewer

#### `update_client_beneficial_owner()`
Updates beneficial owner details.

**RBAC:** Admin, User

#### `delete_client_beneficial_owner()`
Permanently deletes a beneficial owner record.

**RBAC:** Admin only

## Phase 5: Documents & Complaints

### Documents

#### `create_document()`
Creates a document record (polymorphic - can belong to multiple entity types).

**Parameters:**
- `p_document_owner_type` TEXT (required): 'representative', 'client', 'fsp', 'complaint', 'audit'
- `p_document_owner_id` UUID (required)
- `p_document_name` TEXT (required)
- `p_document_type` TEXT (required): 'cpd_certificate', 'id_document', 'proof_of_address', etc.
- `p_document_category` TEXT (required): 'compliance', 'client', 'operational', 'regulatory'
- `p_file_name` TEXT (required)
- `p_file_size_bytes` BIGINT
- `p_file_type` TEXT: 'pdf', 'jpg', 'png', 'docx', 'xlsx'
- `p_storage_path` TEXT (Supabase Storage path)
- `p_storage_url` TEXT
- `p_document_date` DATE
- `p_expiry_date` DATE
- `p_retention_period_years` INTEGER (default: 5)
- `p_is_sensitive` BOOLEAN (default: FALSE)
- `p_uploaded_by` UUID

**RBAC:** Admin, User

#### `get_documents()`
Retrieves documents with filters.

**Parameters:**
- `p_document_owner_type` TEXT (optional)
- `p_document_owner_id` UUID (optional)
- `p_document_category` TEXT (optional)
- `p_status` TEXT (default: 'active')

**RBAC:** Admin, User, Viewer

#### `get_document()`
Retrieves a single document by ID and logs the access.

**RBAC:** Admin, User, Viewer

#### `update_document()`
Updates document metadata.

**RBAC:** Admin, User

#### `delete_document()`
Soft deletes a document (sets status to 'deleted').

**RBAC:** Admin only

#### `log_document_access()`
Logs document access for audit trail.

**Parameters:**
- `p_document_id` UUID (required)
- `p_accessed_by` UUID (required)
- `p_access_type` TEXT (required): 'view', 'download', 'edit', 'delete', 'share'
- `p_ip_address` INET
- `p_user_agent` TEXT

**RBAC:** System function (called automatically)

### Complaints

#### `create_complaint()`
Creates a new complaint record.

**Parameters:**
- `p_complaint_reference_number` TEXT (required, unique)
- `p_client_id` UUID
- `p_representative_id` UUID
- `p_complainant_name` TEXT (required)
- `p_complainant_email` TEXT
- `p_complainant_phone` TEXT
- `p_complaint_date` DATE (required)
- `p_complaint_received_date` DATE (required)
- `p_complaint_channel` TEXT: 'email', 'phone', 'letter', 'in_person', 'ombud', 'fsca'
- `p_complaint_category` TEXT (required): 'mis_selling', 'service_quality', 'claims', 'fees', 'conduct', 'advice_quality'
- `p_complaint_description` TEXT (required)
- `p_priority` TEXT (default: 'medium'): 'low', 'medium', 'high', 'critical'
- `p_severity` TEXT (default: 'minor'): 'minor', 'moderate', 'major', 'critical'
- `p_assigned_to` UUID
- `p_created_by` UUID

**Note:** Automatically calculates acknowledgement_due_date (+2 days) and resolution_due_date (+6 weeks)

**RBAC:** Admin, User

#### `get_complaints()`
Retrieves complaints with filters, sorted by priority and overdue status.

**Parameters:**
- `p_status` TEXT (optional): 'open', 'investigating', 'pending_info', 'resolved', 'closed', 'escalated'
- `p_priority` TEXT (optional)
- `p_assigned_to` UUID (optional)
- `p_representative_id` UUID (optional)
- `p_is_overdue` BOOLEAN (optional)

**RBAC:** Admin, User, Viewer

#### `get_complaint()`
Retrieves a single complaint with full details.

**RBAC:** Admin, User, Viewer

#### `update_complaint()`
Updates complaint status, notes, and resolution details.

**RBAC:** Admin, User

#### `add_complaint_communication()`
Logs a communication related to a complaint.

**Parameters:**
- `p_complaint_id` UUID (required)
- `p_communication_date` TIMESTAMPTZ (required)
- `p_communication_type` TEXT (required): 'email', 'phone', 'letter', 'meeting'
- `p_communication_direction` TEXT (required): 'inbound', 'outbound'
- `p_from_party` TEXT: 'complainant', 'fsp', 'ombud', 'fsca'
- `p_to_party` TEXT
- `p_subject` TEXT
- `p_message` TEXT (required)
- `p_logged_by` UUID

**RBAC:** Admin, User

#### `get_complaint_communications()`
Retrieves all communications for a complaint.

**RBAC:** Admin, User, Viewer

## Phase 6: Alerts & Monitoring

### Alert Rules

#### `create_alert_rule()`
Creates an automated alert rule.

**Parameters:**
- `p_rule_name` TEXT (required, unique)
- `p_rule_description` TEXT (required)
- `p_rule_type` TEXT (required): 'expiry', 'threshold', 'deadline', 'overdue', 'status_change'
- `p_target_entity` TEXT (required): 'representative', 'client', 'fica', 'cpd', 'fit_and_proper'
- `p_conditions` JSONB (required) - rule conditions in JSON format
- `p_priority` TEXT (required): 'low', 'medium', 'high', 'critical'
- `p_alert_frequency` TEXT (default: 'once'): 'once', 'daily', 'weekly', 'until_resolved'
- `p_send_email` BOOLEAN (default: TRUE)
- `p_send_in_app` BOOLEAN (default: TRUE)
- `p_created_by` UUID

**Example conditions JSONB:**
```json
{
  "field": "re5_expiry_date",
  "operator": "less_than_days",
  "value": 30
}
```

**RBAC:** Admin only

#### `get_alert_rules()`
Retrieves alert rules.

**Parameters:**
- `p_is_active` BOOLEAN (optional)
- `p_target_entity` TEXT (optional)

**RBAC:** Admin, User, Viewer

#### `update_alert_rule()`
Updates alert rule configuration.

**RBAC:** Admin only

#### `delete_alert_rule()`
Deletes an alert rule (cannot delete system rules).

**RBAC:** Admin only

### Alerts

#### `create_alert()`
Creates an alert instance (usually triggered automatically by rules).

**Parameters:**
- `p_alert_rule_id` UUID (required)
- `p_alert_title` TEXT (required)
- `p_alert_message` TEXT (required)
- `p_priority` TEXT (required)
- `p_entity_type` TEXT (required)
- `p_entity_id` UUID (required)
- `p_representative_id` UUID
- `p_client_id` UUID

**RBAC:** Admin only (typically system-generated)

#### `get_alerts()`
Retrieves alerts with filters, sorted by priority.

**Parameters:**
- `p_status` TEXT (default: 'active'): 'active', 'acknowledged', 'in_progress', 'resolved', 'dismissed'
- `p_priority` TEXT (optional)
- `p_representative_id` UUID (optional)
- `p_entity_type` TEXT (optional)

**RBAC:** Admin, User (own alerts), Viewer

#### `acknowledge_alert()`
Acknowledges an alert.

**Parameters:**
- `p_id` UUID (required)
- `p_acknowledged_by` UUID (required)

**RBAC:** Admin, User (own alerts)

#### `resolve_alert()`
Resolves an alert.

**Parameters:**
- `p_id` UUID (required)
- `p_resolved_by` UUID (required)
- `p_resolution_notes` TEXT

**RBAC:** Admin, User (own alerts)

### Internal Audits

#### `create_internal_audit()`
Creates an internal audit record.

**Parameters:**
- `p_audit_reference_number` TEXT (required, unique) e.g., "AUDIT-Q4-2024"
- `p_audit_name` TEXT (required)
- `p_audit_type` TEXT (required): 'quarterly', 'annual', 'spot_check', 'fsca_preparation', 'thematic'
- `p_audit_scope` TEXT (required): 'full_fsp', 'fica_only', 'cpd_only', 'specific_representatives'
- `p_audit_period_start` DATE (required)
- `p_audit_period_end` DATE (required)
- `p_planned_start_date` DATE
- `p_planned_completion_date` DATE
- `p_lead_auditor` UUID
- `p_created_by` UUID

**RBAC:** Admin only

#### `get_internal_audits()`
Retrieves internal audits.

**Parameters:**
- `p_status` TEXT (optional): 'planned', 'in_progress', 'fieldwork_complete', 'report_draft', 'completed', 'cancelled'
- `p_audit_type` TEXT (optional)

**RBAC:** Admin, User, Viewer

#### `update_internal_audit()`
Updates audit status and findings summary.

**RBAC:** Admin only

#### `create_audit_finding()`
Adds a finding to an audit. Automatically updates the audit's finding counts.

**Parameters:**
- `p_internal_audit_id` UUID (required)
- `p_finding_reference_number` TEXT (required) e.g., "F-001"
- `p_finding_title` TEXT (required)
- `p_finding_description` TEXT (required)
- `p_area_audited` TEXT (required): 'fica', 'cpd', 'fit_and_proper', 'documentation', 'supervision'
- `p_severity` TEXT (required): 'critical', 'high', 'medium', 'low'
- `p_recommendation` TEXT (required)
- `p_remediation_owner` UUID
- `p_remediation_due_date` DATE

**RBAC:** Admin only

#### `get_audit_findings()`
Retrieves findings for an audit, sorted by severity.

**Parameters:**
- `p_internal_audit_id` UUID (required)
- `p_remediation_status` TEXT (optional): 'open', 'in_progress', 'completed', 'verified', 'closed'

**RBAC:** Admin, User, Viewer

## Phase 7: Dashboards & Reporting

### Report Templates

#### `create_report_template()`
Creates a report template definition.

**Parameters:**
- `p_template_name` TEXT (required, unique)
- `p_template_description` TEXT (required)
- `p_template_category` TEXT (required): 'compliance', 'executive', 'regulatory', 'operational'
- `p_report_type` TEXT (required): 'cpd_summary', 'fica_status', 'compliance_health', 'fsca_submission'
- `p_data_sources` TEXT[] (array of table names)
- `p_report_structure` JSONB (template configuration)
- `p_created_by` UUID

**RBAC:** Admin only

#### `get_report_templates()`
Retrieves report templates.

**Parameters:**
- `p_template_category` TEXT (optional)
- `p_is_active` BOOLEAN (default: TRUE)

**RBAC:** Admin, User, Viewer

### Generated Reports

#### `generate_report()`
Initiates report generation from a template.

**Parameters:**
- `p_report_template_id` UUID (required)
- `p_report_name` TEXT (required)
- `p_date_range_start` DATE
- `p_date_range_end` DATE
- `p_filters_applied` JSONB
- `p_output_format` TEXT (default: 'pdf'): 'pdf', 'excel', 'csv', 'word'
- `p_generated_by` UUID

**Returns:** Report ID with status 'generating'

**RBAC:** Admin, User

#### `get_generated_reports()`
Retrieves generated reports history.

**Parameters:**
- `p_generated_by` UUID (optional)
- `p_status` TEXT (optional): 'generating', 'completed', 'failed'
- `p_limit` INTEGER (default: 50)

**RBAC:** Admin, User, Viewer

## Usage Examples

### Creating a Representative and CPD Activity

```sql
-- 1. Create user profile
SELECT create_user_profile(
    'auth-user-uuid',
    'role-uuid',
    'John',
    'Smith',
    'john.smith@example.com',
    '+27821234567',
    NULL,
    '8001015009087',
    NULL,
    'active'
);

-- 2. Create representative
SELECT create_representative(
    'auth-user-uuid',
    'FSP12345-REP-001',
    'ki-uuid',
    TRUE,  -- class_1_long_term
    FALSE,
    FALSE,
    'active',
    '2024-01-15',
    '2024-02-01'
);

-- 3. Log CPD activity
SELECT create_cpd_activity(
    'representative-uuid',
    'cpd-cycle-uuid',
    '2024-11-15',
    'FAIS Act Updates Workshop',
    'workshop',
    'FSB Accredited Provider',
    3.0,  -- total hours
    1.0,  -- ethics hours
    2.0,  -- technical hours
    TRUE,  -- class_1
    FALSE,
    FALSE,
    'user-uuid'
);

-- 4. Verify CPD activity
SELECT verify_cpd_activity(
    'activity-uuid',
    'admin-uuid',
    'verified',
    NULL
);

-- 5. Check CPD progress
SELECT * FROM get_cpd_progress_summary('representative-uuid', 'cpd-cycle-uuid');
```

### Creating and Managing a Client with FICA

```sql
-- 1. Create individual client
SELECT create_client(
    'representative-uuid',
    'individual',
    'Mr',
    'David',
    'Johnson',
    '8005125009087',
    '1980-05-12',
    NULL,  -- company_name
    NULL,  -- registration_number
    'david.johnson@example.com',
    '+27211234567',
    '+27821234567',
    '2024-01-10',
    'low'  -- risk_category
);

-- 2. Create FICA verification
SELECT create_fica_verification(
    'client-uuid',
    'representative-uuid',
    'initial',
    CURRENT_DATE,
    60  -- review_frequency_months
);

-- 3. Update FICA verification
SELECT update_fica_verification(
    'fica-uuid',
    'id_book',  -- id_document_type
    TRUE,  -- id_document_verified
    TRUE,  -- address_document_verified
    TRUE,  -- bank_details_verified
    TRUE,  -- tax_reference_verified
    'compliant',  -- fica_status
    'admin-uuid',
    'All documents verified and compliant'
);
```

### Creating a Complaint and Tracking

```sql
-- 1. Create complaint
SELECT create_complaint(
    'COMP-2024-001',
    'client-uuid',
    'representative-uuid',
    'John Doe',
    'john.doe@example.com',
    '+27821234567',
    '2024-11-20',
    '2024-11-21',
    'email',
    'service_quality',
    'Client concerned about response time to policy queries',
    'medium',
    'minor',
    'compliance-officer-uuid',
    'admin-uuid'
);

-- 2. Add communication log
SELECT add_complaint_communication(
    'complaint-uuid',
    NOW(),
    'email',
    'outbound',
    'fsp',
    'complainant',
    'Acknowledgement of Complaint',
    'Thank you for bringing this to our attention...',
    'user-uuid'
);

-- 3. Update complaint status
SELECT update_complaint(
    'complaint-uuid',
    'investigating',  -- status
    'high',  -- priority
    NULL,  -- assigned_to
    'Investigating response time procedures',  -- investigation_notes
    NULL,  -- resolution_description
    NULL,  -- resolution_date
    CURRENT_DATE,  -- acknowledgement_sent_date
    NULL,  -- root_cause
    NULL  -- preventative_action
);
```

## Error Handling

All CRUD functions return structured JSON responses with error handling:

### Success Response
```json
{
    "success": true,
    "id": "uuid-value",
    "message": "Operation completed successfully"
}
```

### Error Response
```json
{
    "success": false,
    "error": "Detailed error message"
}
```

### Common Error Types

1. **Validation Errors**: Required fields missing or invalid
   - "First name is required"
   - "Total hours must be greater than 0"

2. **Constraint Violations**: Unique constraints, foreign keys
   - "Email already exists"
   - "FSP number already exists"

3. **Not Found Errors**: Entity doesn't exist
   - "Client not found"
   - "Representative not found"

4. **Permission Errors**: RBAC restrictions
   - "Cannot delete system rule"
   - "Cannot delete role: it is currently assigned to users"

### Client-Side Error Handling Example

```javascript
try {
    const result = await callFunction('create_representative', params, token);
    
    if (!result.success) {
        console.error('Error:', result.error);
        showErrorAlert('Failed to create representative', result.error);
        return;
    }
    
    console.log('Created representative with ID:', result.id);
    showSuccessMessage('Representative created successfully');
} catch (error) {
    console.error('Unexpected error:', error);
    showErrorAlert('System Error', 'An unexpected error occurred');
}
```

## Migration Files

The CRUD operations are organized into three migration files:

1. **`icomply_crud_operations.sql`** - Phase 1 & 2
   - Foundation tables
   - Authentication & User Management
   - Representatives & Key Individuals

2. **`icomply_crud_operations_phase3_4.sql`** - Phase 3 & 4
   - Fit & Proper Records
   - CPD Management
   - Clients & FICA

3. **`icomply_crud_operations_phase5_6_7.sql`** - Phase 5, 6 & 7
   - Documents & Complaints
   - Alerts & Monitoring
   - Reports & Dashboards

## RBAC Permission Summary

### Function Permissions Added

All functions have RBAC permissions added automatically:

- **Admin Role**: Full CRUD access to all functions
- **User Role**: Read access + limited write access to own data
- **Viewer Role**: Read-only access

To add permissions for new functions, use this pattern:

```sql
INSERT INTO role_permissions (role_id, object_type, object_name, operation, allowed)
SELECT r.id, 'function', 'function_name', 'EXECUTE', true
FROM roles r
WHERE r.role_name = 'Admin'
AND NOT EXISTS (
    SELECT 1 FROM role_permissions rp 
    WHERE rp.role_id = r.id 
    AND rp.object_type = 'function' 
    AND rp.object_name = 'function_name' 
    AND rp.operation = 'EXECUTE'
)
ON CONFLICT DO NOTHING;
```

## Testing

### Basic Function Testing

```sql
-- Test create function
SELECT create_system_setting(
    'test_setting',
    '{"value": "test"}'::JSONB,
    'json',
    'general',
    'Test setting'
);

-- Test read function
SELECT * FROM get_system_settings('general');

-- Test update function
SELECT update_system_setting(
    'setting-uuid',
    '{"value": "updated"}'::JSONB,
    'Updated description'
);

-- Test delete function
SELECT delete_system_setting('setting-uuid');
```

### RBAC Testing

Test with different role users to ensure permissions are correctly applied.

## Performance Considerations

1. **Indexes**: Ensure indexes exist on frequently queried columns
2. **Materialized Views**: Used for CPD progress summary - refresh periodically
3. **Pagination**: Use LIMIT clauses in GET functions for large datasets
4. **Caching**: Consider caching frequently accessed reference data

## Security Best Practices

1. **SECURITY DEFINER**: All functions use SECURITY DEFINER
2. **search_path = public**: Prevents SQL injection
3. **Input Validation**: All required fields validated
4. **Soft Deletes**: Most entities use soft delete (status = 'inactive')
5. **Audit Logging**: Document access and modifications are logged

## Support

For questions or issues with the CRUD operations:

1. Check this documentation
2. Review RBAC_GUIDE.md for permission patterns
3. Check supabase_implementation_sequence.md for entity relationships
4. Review migration files for function implementation details

## Version History

- **v1.0** (2025-11-26): Initial CRUD operations for all 7 phases
  - Foundation & Authentication
  - Representatives & Key Individuals
  - Core Compliance Tracking
  - Clients & FICA
  - Documents & Complaints
  - Alerts & Monitoring
  - Dashboards & Reporting

---

**Document Last Updated:** 2025-11-26  
**Author:** iComply Development Team  
**Status:** Complete - Ready for Implementation

