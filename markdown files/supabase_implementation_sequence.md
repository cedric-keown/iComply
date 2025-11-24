# SUPABASE IMPLEMENTATION SEQUENCE
## Logical Module Build Order to Minimize Database Dependency Complexity

**Date:** 23 November 2024  
**Project:** South African FSP Compliance Management Platform  
**Database:** Supabase (PostgreSQL + Realtime + Storage)

---

## 🎯 IMPLEMENTATION PHILOSOPHY

**Principle:** Build from foundation upward - each phase depends only on completed phases  
**Goal:** Avoid circular dependencies, enable parallel team work, allow incremental testing  
**Strategy:** Core entities first → Business logic → Compliance tracking → Monitoring → Reporting

---

## 📊 DATABASE DEPENDENCY TREE

```
LEVEL 1: Foundation (No Dependencies)
├── auth.users (Supabase Auth built-in)
├── fsp_configuration
├── system_settings
└── user_roles

LEVEL 2: User Management (Depends on Level 1)
├── user_profiles (→ auth.users)
├── representatives (→ auth.users, fsp_configuration)
├── key_individuals (→ representatives)
└── compliance_officers (→ representatives)

LEVEL 3: Core Business Entities (Depends on Level 2)
├── clients (→ representatives)
├── fit_and_proper_records (→ representatives)
└── cpd_activities (→ representatives)

LEVEL 4: Extended Compliance (Depends on Level 3)
├── fica_verifications (→ clients, representatives)
├── documents (→ representatives, clients - polymorphic)
└── complaints (→ clients, representatives)

LEVEL 5: Monitoring Systems (Depends on Levels 2-4)
├── alerts (→ representatives, multiple compliance tables)
├── notifications (→ auth.users, alerts)
├── compliance_checks (→ multiple compliance tables)
└── internal_audits (→ multiple compliance tables)

LEVEL 6: Reporting & Dashboards (Depends on All Levels)
├── report_templates
├── scheduled_reports (→ auth.users, report_templates)
├── dashboard_widgets (→ all data tables)
└── analytics_cache (→ aggregated data)
```

---

## 🏗️ PHASE-BY-PHASE IMPLEMENTATION

---

### **PHASE 1: FOUNDATION & AUTHENTICATION** (Week 1)
**Duration:** 3-5 days  
**Complexity:** Low  
**Team:** 1-2 developers

#### Modules to Build:
1. **Settings & Administration** (partial)
2. **Authentication & User Management** (partial)

#### Database Tables to Create:

```sql
-- 1.1 FSP Configuration (single row table)
CREATE TABLE fsp_configuration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fsp_name TEXT NOT NULL,
  fsp_license_number TEXT UNIQUE NOT NULL,
  registration_number TEXT,
  vat_number TEXT,
  address_street TEXT,
  address_city TEXT,
  address_province TEXT,
  address_postal_code TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.2 System Settings
CREATE TABLE system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL, -- 'string', 'number', 'boolean', 'json'
  category TEXT NOT NULL, -- 'general', 'compliance', 'notifications', 'security'
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.3 User Roles (enum-like reference table)
CREATE TABLE user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_name TEXT UNIQUE NOT NULL, -- 'fsp_owner', 'key_individual', 'compliance_officer', 'representative', 'admin_staff'
  role_display_name TEXT NOT NULL,
  role_description TEXT,
  permissions JSONB NOT NULL, -- Detailed permissions object
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 1.4 User Profiles (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES user_roles(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  mobile TEXT,
  id_number TEXT, -- South African ID
  fsp_number TEXT, -- FSP Representative Number
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'suspended'
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Supabase Features to Configure:
- ✅ Authentication (Email/Password, 2FA)
- ✅ Row Level Security (RLS) policies
- ✅ Database functions for common queries
- ✅ Realtime subscriptions setup

#### Why This Order:
- No dependencies - can start immediately
- Establishes authentication foundation
- Creates user role framework for all future modules
- RLS policies defined early prevent security issues later

---

### **PHASE 2: REPRESENTATIVES & KEY INDIVIDUALS** (Week 1-2)
**Duration:** 4-6 days  
**Complexity:** Medium  
**Dependencies:** Phase 1 complete

#### Modules to Build:
3. **Representatives Management**
4. **User Management** (complete)

#### Database Tables to Create:

```sql
-- 2.1 Representatives (core entity)
CREATE TABLE representatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_profile_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  fsp_number TEXT UNIQUE NOT NULL, -- e.g., FSP12345-TR-001
  supervised_by_ki_id UUID REFERENCES representatives(id), -- Self-reference to Key Individual
  
  -- Categories of Advice
  class_1_long_term BOOLEAN DEFAULT FALSE,
  class_2_short_term BOOLEAN DEFAULT FALSE,
  class_3_pension BOOLEAN DEFAULT FALSE,
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'suspended', 'deauthorized'
  onboarding_date DATE,
  authorization_date DATE,
  deauthorization_date DATE,
  deauthorization_reason TEXT,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.2 Key Individuals (special representatives)
CREATE TABLE key_individuals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_id UUID UNIQUE REFERENCES representatives(id) ON DELETE CASCADE,
  ki_type TEXT NOT NULL, -- 'principal', 'key_individual'
  appointment_date DATE NOT NULL,
  resignation_date DATE,
  
  -- Supervisory capacity
  max_supervised_count INTEGER DEFAULT 20,
  current_supervised_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2.3 Supervision Records (audit trail)
CREATE TABLE supervision_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_id UUID REFERENCES representatives(id) ON DELETE CASCADE,
  key_individual_id UUID REFERENCES key_individuals(id) ON DELETE CASCADE,
  supervision_date DATE NOT NULL,
  meeting_type TEXT, -- 'one_on_one', 'group', 'review'
  notes TEXT,
  action_items TEXT,
  next_meeting_date DATE,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Supabase Features:
- ✅ RLS policies for representative data isolation
- ✅ Database triggers for supervision count updates
- ✅ Realtime subscriptions for representative status changes
- ✅ Computed columns for compliance status

#### Why This Order:
- Representatives are central to ALL compliance modules
- Self-referencing FK (supervised_by_ki_id) handled early
- No dependency on Clients or Compliance records yet
- Enables parallel work on Fit & Proper and CPD next

---

### **PHASE 3: CORE COMPLIANCE TRACKING** (Week 2-3)
**Duration:** 6-8 days  
**Complexity:** Medium-High  
**Dependencies:** Phase 2 complete

#### Modules to Build:
5. **Fit & Proper Requirements**
6. **CPD Management**

#### Database Tables to Create:

```sql
-- 3.1 Fit & Proper Records
CREATE TABLE fit_and_proper_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_id UUID REFERENCES representatives(id) ON DELETE CASCADE,
  
  -- RE5 Qualification
  re5_qualification_name TEXT,
  re5_qualification_number TEXT,
  re5_issue_date DATE,
  re5_expiry_date DATE,
  re5_status TEXT, -- 'current', 'expiring_soon', 'expired'
  
  -- RE1 Qualification
  re1_qualification_name TEXT,
  re1_qualification_number TEXT,
  re1_issue_date DATE,
  re1_expiry_date DATE,
  re1_status TEXT,
  
  -- COB Training
  cob_class_1_date DATE,
  cob_class_2_date DATE,
  cob_class_3_date DATE,
  
  -- Experience
  industry_experience_years DECIMAL(4,1),
  experience_verified BOOLEAN DEFAULT FALSE,
  experience_verification_date DATE,
  
  -- Character & Integrity
  criminal_record_check_date DATE,
  criminal_record_clear BOOLEAN,
  credit_check_date DATE,
  credit_check_clear BOOLEAN,
  character_declaration_signed BOOLEAN DEFAULT FALSE,
  character_declaration_date DATE,
  
  -- Overall Status
  overall_status TEXT, -- 'compliant', 'expiring_soon', 'non_compliant'
  last_review_date DATE,
  next_review_date DATE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 CPD Cycles
CREATE TABLE cpd_cycles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cycle_name TEXT NOT NULL, -- e.g., "2024/2025"
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  required_hours DECIMAL(4,1) DEFAULT 18.0,
  required_ethics_hours DECIMAL(4,1) DEFAULT 3.0,
  required_technical_hours DECIMAL(4,1) DEFAULT 14.0,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'archived'
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 CPD Activities
CREATE TABLE cpd_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_id UUID REFERENCES representatives(id) ON DELETE CASCADE,
  cpd_cycle_id UUID REFERENCES cpd_cycles(id),
  
  -- Activity Details
  activity_date DATE NOT NULL,
  activity_name TEXT NOT NULL,
  activity_type TEXT, -- 'workshop', 'webinar', 'course', 'conference', 'self_study'
  provider_name TEXT NOT NULL,
  provider_accreditation_number TEXT,
  
  -- Hours
  total_hours DECIMAL(4,1) NOT NULL,
  ethics_hours DECIMAL(4,1) DEFAULT 0,
  technical_hours DECIMAL(4,1) DEFAULT 0,
  
  -- Classification
  class_1_applicable BOOLEAN DEFAULT FALSE,
  class_2_applicable BOOLEAN DEFAULT FALSE,
  class_3_applicable BOOLEAN DEFAULT FALSE,
  
  -- Verification
  verifiable BOOLEAN DEFAULT TRUE,
  certificate_attached BOOLEAN DEFAULT FALSE,
  certificate_document_id UUID, -- FK to documents table (added later)
  
  -- Status
  status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  verified_by UUID REFERENCES auth.users(id),
  verified_date TIMESTAMPTZ,
  rejection_reason TEXT,
  
  -- Metadata
  uploaded_by UUID REFERENCES auth.users(id),
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 CPD Progress Summary (materialized view for performance)
CREATE MATERIALIZED VIEW cpd_progress_summary AS
SELECT 
  r.id AS representative_id,
  r.fsp_number,
  c.id AS cpd_cycle_id,
  c.cycle_name,
  COALESCE(SUM(a.total_hours), 0) AS total_hours_logged,
  COALESCE(SUM(a.ethics_hours), 0) AS ethics_hours_logged,
  COALESCE(SUM(a.technical_hours), 0) AS technical_hours_logged,
  COUNT(a.id) AS activity_count,
  ROUND((COALESCE(SUM(a.total_hours), 0) / c.required_hours * 100), 2) AS progress_percentage,
  CASE 
    WHEN COALESCE(SUM(a.total_hours), 0) >= c.required_hours 
         AND COALESCE(SUM(a.ethics_hours), 0) >= c.required_ethics_hours 
    THEN 'compliant'
    WHEN COALESCE(SUM(a.total_hours), 0) >= (c.required_hours * 0.7) THEN 'on_track'
    WHEN COALESCE(SUM(a.total_hours), 0) >= (c.required_hours * 0.5) THEN 'at_risk'
    ELSE 'critical'
  END AS compliance_status
FROM representatives r
CROSS JOIN cpd_cycles c
LEFT JOIN cpd_activities a ON a.representative_id = r.id 
  AND a.cpd_cycle_id = c.id 
  AND a.status = 'verified'
WHERE r.status = 'active' 
  AND c.status = 'active'
GROUP BY r.id, r.fsp_number, c.id, c.cycle_name, c.required_hours, c.required_ethics_hours;

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_cpd_progress_summary()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY cpd_progress_summary;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;
```

#### Supabase Features:
- ✅ Materialized views for CPD progress (performance optimization)
- ✅ Database triggers to refresh materialized views
- ✅ Storage buckets for CPD certificates
- ✅ Computed columns for compliance status
- ✅ Database functions for CPD calculations

#### Why This Order:
- Both modules depend ONLY on Representatives (Phase 2)
- No dependency on Clients yet
- Can be built in parallel by different developers
- F&P and CPD are independent of each other

---

### **PHASE 4: CLIENTS & FICA** (Week 3-4)
**Duration:** 5-7 days  
**Complexity:** Medium-High  
**Dependencies:** Phase 2 complete (Representatives)

#### Modules to Build:
7. **Client Management**
8. **FICA Verification**

#### Database Tables to Create:

```sql
-- 4.1 Clients
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assigned_representative_id UUID REFERENCES representatives(id),
  
  -- Client Type
  client_type TEXT NOT NULL, -- 'individual', 'corporate', 'trust'
  
  -- Individual Client Details
  title TEXT, -- 'Mr', 'Mrs', 'Ms', 'Dr'
  first_name TEXT,
  last_name TEXT,
  id_number TEXT,
  date_of_birth DATE,
  
  -- Corporate Client Details
  company_name TEXT,
  registration_number TEXT,
  vat_number TEXT,
  
  -- Contact Details
  email TEXT,
  phone TEXT,
  mobile TEXT,
  address_street TEXT,
  address_suburb TEXT,
  address_city TEXT,
  address_province TEXT,
  address_postal_code TEXT,
  
  -- Client Status
  status TEXT DEFAULT 'active', -- 'active', 'inactive', 'deceased', 'suspended'
  client_since DATE,
  
  -- Risk Profile
  risk_category TEXT DEFAULT 'low', -- 'low', 'medium', 'high'
  pep_status BOOLEAN DEFAULT FALSE, -- Politically Exposed Person
  sanctions_check BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.2 FICA Verifications
CREATE TABLE fica_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  representative_id UUID REFERENCES representatives(id),
  
  -- Verification Type
  verification_type TEXT NOT NULL, -- 'initial', 'periodic_review', 'update'
  verification_date DATE NOT NULL,
  
  -- Identity Verification
  id_document_type TEXT, -- 'id_book', 'id_card', 'passport', 'drivers_license'
  id_document_number TEXT,
  id_document_expiry_date DATE,
  id_document_verified BOOLEAN DEFAULT FALSE,
  id_verification_date DATE,
  id_verification_method TEXT, -- 'original_sighted', 'certified_copy', 'electronic'
  
  -- Address Verification
  address_document_type TEXT, -- 'utility_bill', 'bank_statement', 'lease_agreement', 'rates_notice'
  address_document_date DATE,
  address_document_verified BOOLEAN DEFAULT FALSE,
  address_verification_date DATE,
  address_not_older_than_months INTEGER DEFAULT 3,
  
  -- Banking Details
  bank_name TEXT,
  account_holder_name TEXT,
  account_number TEXT,
  branch_code TEXT,
  account_type TEXT, -- 'cheque', 'savings', 'transmission'
  bank_details_verified BOOLEAN DEFAULT FALSE,
  bank_verification_date DATE,
  bank_verification_method TEXT, -- 'bank_letter', 'stamped_statement', 'electronic'
  
  -- Tax Compliance
  tax_number TEXT,
  tax_reference_verified BOOLEAN DEFAULT FALSE,
  tax_verification_date DATE,
  tax_status TEXT, -- 'compliant', 'non_compliant', 'not_required'
  
  -- Source of Funds/Wealth (for high-risk clients)
  source_of_funds_declared BOOLEAN DEFAULT FALSE,
  source_of_funds_description TEXT,
  source_of_wealth_declared BOOLEAN DEFAULT FALSE,
  source_of_wealth_description TEXT,
  
  -- Overall FICA Status
  fica_status TEXT DEFAULT 'pending', -- 'pending', 'compliant', 'incomplete', 'non_compliant'
  completeness_percentage INTEGER, -- 0-100
  
  -- Review Schedule
  next_review_date DATE,
  review_frequency_months INTEGER DEFAULT 60, -- 5 years for standard, 36 for corporate, 12 for high-risk
  
  -- Verification Officer
  verified_by UUID REFERENCES auth.users(id),
  verification_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4.3 Client Beneficial Owners (for corporate clients)
CREATE TABLE client_beneficial_owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  
  -- Beneficial Owner Details
  full_name TEXT NOT NULL,
  id_number TEXT,
  nationality TEXT,
  ownership_percentage DECIMAL(5,2), -- e.g., 25.50%
  control_type TEXT, -- 'shareholding', 'voting_rights', 'beneficial_interest', 'control'
  
  -- Identity Verification
  id_verified BOOLEAN DEFAULT FALSE,
  id_verification_date DATE,
  
  -- PEP Status
  pep_status BOOLEAN DEFAULT FALSE,
  pep_relationship TEXT, -- if PEP, relationship to main client
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Supabase Features:
- ✅ RLS policies for client data (representative can only see assigned clients)
- ✅ Full-text search on client names
- ✅ Database triggers for FICA review date calculation
- ✅ Computed columns for FICA completeness percentage
- ✅ Realtime subscriptions for client status changes

#### Why This Order:
- Depends ONLY on Representatives (Phase 2)
- Independent of F&P and CPD modules
- FICA naturally extends Clients
- No circular dependencies

---

### **PHASE 5: DOCUMENTS & COMPLAINTS** (Week 4-5)
**Duration:** 5-7 days  
**Complexity:** Medium  
**Dependencies:** Phases 2, 3, 4 complete

#### Modules to Build:
9. **Document Management**
10. **Complaints Management**

#### Database Tables to Create:

```sql
-- 5.1 Documents (polymorphic - can belong to multiple entity types)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Polymorphic Associations
  document_owner_type TEXT NOT NULL, -- 'representative', 'client', 'fsp', 'complaint', 'audit'
  document_owner_id UUID NOT NULL, -- ID of the owner entity
  
  -- Document Details
  document_name TEXT NOT NULL,
  document_type TEXT NOT NULL, -- 'cpd_certificate', 'id_document', 'proof_of_address', 'qualification', 'policy', 'correspondence'
  document_category TEXT NOT NULL, -- 'compliance', 'client', 'operational', 'regulatory'
  file_name TEXT NOT NULL,
  file_size_bytes BIGINT,
  file_type TEXT, -- 'pdf', 'jpg', 'png', 'docx', 'xlsx'
  mime_type TEXT,
  
  -- Storage
  storage_bucket TEXT DEFAULT 'compliance-documents',
  storage_path TEXT NOT NULL, -- Path in Supabase Storage
  storage_url TEXT, -- Public/Signed URL
  
  -- Metadata
  description TEXT,
  tags TEXT[], -- Array of tags for searching
  
  -- Retention & Compliance
  upload_date DATE DEFAULT CURRENT_DATE,
  document_date DATE, -- Actual date of the document content
  expiry_date DATE,
  retention_period_years INTEGER DEFAULT 5, -- FAIS Act requirement
  delete_after_date DATE, -- Auto-calculated: upload_date + retention_period
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'expired', 'archived', 'deleted'
  is_sensitive BOOLEAN DEFAULT FALSE,
  requires_encryption BOOLEAN DEFAULT FALSE,
  
  -- Access Audit
  uploaded_by UUID REFERENCES auth.users(id),
  last_accessed_by UUID REFERENCES auth.users(id),
  last_accessed_at TIMESTAMPTZ,
  access_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.2 Document Access Log (audit trail)
CREATE TABLE document_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  accessed_by UUID REFERENCES auth.users(id),
  access_type TEXT NOT NULL, -- 'view', 'download', 'edit', 'delete', 'share'
  ip_address INET,
  user_agent TEXT,
  access_duration_seconds INTEGER, -- How long document was viewed
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.3 Complaints
CREATE TABLE complaints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_reference_number TEXT UNIQUE NOT NULL, -- e.g., COMP-2024-001
  
  -- Parties Involved
  client_id UUID REFERENCES clients(id),
  representative_id UUID REFERENCES representatives(id),
  
  -- Complainant Details (may not be a client in system)
  complainant_name TEXT NOT NULL,
  complainant_email TEXT,
  complainant_phone TEXT,
  complainant_address TEXT,
  
  -- Complaint Details
  complaint_date DATE NOT NULL,
  complaint_received_date DATE NOT NULL,
  complaint_channel TEXT, -- 'email', 'phone', 'letter', 'in_person', 'ombud', 'fsca'
  
  -- Nature of Complaint
  complaint_category TEXT NOT NULL, -- 'mis_selling', 'service_quality', 'claims', 'fees', 'conduct', 'advice_quality'
  complaint_subcategory TEXT,
  complaint_description TEXT NOT NULL,
  product_type TEXT, -- Which insurance product
  policy_number TEXT,
  
  -- Priority & Severity
  priority TEXT DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  severity TEXT DEFAULT 'minor', -- 'minor', 'moderate', 'major', 'critical'
  
  -- Resolution
  status TEXT DEFAULT 'open', -- 'open', 'investigating', 'pending_info', 'resolved', 'closed', 'escalated'
  assigned_to UUID REFERENCES auth.users(id), -- Compliance Officer or Manager
  investigation_notes TEXT,
  resolution_description TEXT,
  resolution_date DATE,
  
  -- Timelines (TCF Requirement: 6 weeks)
  acknowledgement_sent_date DATE,
  acknowledgement_due_date DATE, -- +2 working days from received_date
  resolution_due_date DATE, -- +6 weeks from received_date
  is_overdue BOOLEAN GENERATED ALWAYS AS (
    resolution_due_date < CURRENT_DATE AND status NOT IN ('resolved', 'closed')
  ) STORED,
  
  -- Escalation
  escalated_to_ombud BOOLEAN DEFAULT FALSE,
  ombud_case_number TEXT,
  ombud_escalation_date DATE,
  escalated_to_fsca BOOLEAN DEFAULT FALSE,
  fsca_case_number TEXT,
  fsca_escalation_date DATE,
  
  -- Remediation
  compensation_offered BOOLEAN DEFAULT FALSE,
  compensation_amount DECIMAL(15,2),
  compensation_paid BOOLEAN DEFAULT FALSE,
  compensation_payment_date DATE,
  
  -- Root Cause Analysis
  root_cause TEXT,
  preventative_action TEXT,
  systemic_issue BOOLEAN DEFAULT FALSE,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5.4 Complaint Communication Log
CREATE TABLE complaint_communications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  complaint_id UUID REFERENCES complaints(id) ON DELETE CASCADE,
  
  communication_date TIMESTAMPTZ NOT NULL,
  communication_type TEXT NOT NULL, -- 'email', 'phone', 'letter', 'meeting'
  communication_direction TEXT NOT NULL, -- 'inbound', 'outbound'
  
  from_party TEXT, -- 'complainant', 'fsp', 'ombud', 'fsca'
  to_party TEXT,
  
  subject TEXT,
  message TEXT,
  
  logged_by UUID REFERENCES auth.users(id),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Supabase Features:
- ✅ **Storage buckets** for document files
- ✅ **Storage RLS policies** for secure file access
- ✅ **Generated columns** for complaint overdue status
- ✅ **Database triggers** for complaint deadline calculation
- ✅ **Full-text search** on complaint descriptions
- ✅ **Foreign key to multiple entity types** (polymorphic documents)

#### Why This Order:
- Documents depend on Representatives, Clients, CPD Activities (Phases 2-4)
- Complaints depend on Representatives and Clients (Phases 2 & 4)
- Both are relatively independent modules
- Setting up Supabase Storage happens naturally here

---

### **PHASE 6: ALERTS & MONITORING** (Week 5-6)
**Duration:** 6-8 days  
**Complexity:** High  
**Dependencies:** Phases 2-5 complete (all compliance data exists)

#### Modules to Build:
11. **Alerts & Notifications**
12. **Internal Audits**

#### Database Tables to Create:

```sql
-- 6.1 Alert Rules (configuration)
CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name TEXT UNIQUE NOT NULL,
  rule_description TEXT,
  
  -- Rule Configuration
  rule_type TEXT NOT NULL, -- 'expiry', 'threshold', 'deadline', 'overdue', 'status_change'
  target_entity TEXT NOT NULL, -- 'representative', 'client', 'fica', 'cpd', 'fit_and_proper'
  
  -- Conditions (stored as JSONB for flexibility)
  conditions JSONB NOT NULL,
  /* Example:
  {
    "field": "re5_expiry_date",
    "operator": "less_than_days",
    "value": 30
  }
  */
  
  -- Alert Settings
  priority TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  alert_frequency TEXT DEFAULT 'once', -- 'once', 'daily', 'weekly', 'until_resolved'
  
  -- Notification Channels
  send_email BOOLEAN DEFAULT TRUE,
  send_sms BOOLEAN DEFAULT FALSE,
  send_in_app BOOLEAN DEFAULT TRUE,
  
  -- Recipients
  notify_representative BOOLEAN DEFAULT TRUE,
  notify_key_individual BOOLEAN DEFAULT TRUE,
  notify_compliance_officer BOOLEAN DEFAULT TRUE,
  notify_fsp_owner BOOLEAN DEFAULT FALSE,
  
  -- Escalation
  escalation_enabled BOOLEAN DEFAULT FALSE,
  escalation_delay_hours INTEGER DEFAULT 24,
  escalation_to_role TEXT, -- 'key_individual', 'compliance_officer', 'fsp_owner'
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_system_rule BOOLEAN DEFAULT FALSE, -- System rules cannot be deleted
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.2 Alerts (generated alert instances)
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_rule_id UUID REFERENCES alert_rules(id),
  
  -- Alert Details
  alert_title TEXT NOT NULL,
  alert_message TEXT NOT NULL,
  priority TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
  
  -- Target Entity
  entity_type TEXT NOT NULL, -- 'representative', 'client', 'fica', etc.
  entity_id UUID NOT NULL,
  
  -- Associated Data (for quick reference)
  representative_id UUID REFERENCES representatives(id),
  key_individual_id UUID REFERENCES key_individuals(id),
  client_id UUID REFERENCES clients(id),
  
  -- Status
  status TEXT DEFAULT 'active', -- 'active', 'acknowledged', 'in_progress', 'resolved', 'dismissed'
  acknowledged_by UUID REFERENCES auth.users(id),
  acknowledged_at TIMESTAMPTZ,
  resolved_by UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  -- Escalation
  escalated BOOLEAN DEFAULT FALSE,
  escalated_to UUID REFERENCES auth.users(id),
  escalated_at TIMESTAMPTZ,
  
  -- Validity
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ, -- Alert expires if condition no longer true
  is_expired BOOLEAN GENERATED ALWAYS AS (valid_until < NOW()) STORED,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.3 Notifications (delivery log)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
  
  -- Recipient
  recipient_user_id UUID REFERENCES auth.users(id),
  recipient_email TEXT,
  recipient_phone TEXT,
  
  -- Notification Details
  notification_type TEXT NOT NULL, -- 'email', 'sms', 'in_app', 'push'
  notification_channel TEXT, -- Specific service: 'smtp', 'twilio', 'firebase'
  
  subject TEXT,
  body TEXT,
  
  -- Delivery Status
  status TEXT DEFAULT 'pending', -- 'pending', 'sent', 'delivered', 'failed', 'bounced'
  sent_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  failed_at TIMESTAMPTZ,
  failure_reason TEXT,
  
  -- Read Status (for in-app notifications)
  read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  
  -- External IDs (from SMS/email services)
  external_message_id TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.4 Internal Audits
CREATE TABLE internal_audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audit_reference_number TEXT UNIQUE NOT NULL, -- e.g., AUDIT-Q4-2024
  
  -- Audit Details
  audit_name TEXT NOT NULL,
  audit_type TEXT NOT NULL, -- 'quarterly', 'annual', 'spot_check', 'fsca_preparation', 'thematic'
  audit_scope TEXT NOT NULL, -- 'full_fsp', 'fica_only', 'cpd_only', 'specific_representatives'
  
  -- Audit Period
  audit_period_start DATE NOT NULL,
  audit_period_end DATE NOT NULL,
  
  -- Scheduling
  planned_start_date DATE,
  actual_start_date DATE,
  planned_completion_date DATE,
  actual_completion_date DATE,
  
  -- Status
  status TEXT DEFAULT 'planned', -- 'planned', 'in_progress', 'fieldwork_complete', 'report_draft', 'completed', 'cancelled'
  
  -- Audit Team
  lead_auditor UUID REFERENCES auth.users(id),
  audit_team_members UUID[], -- Array of user IDs
  
  -- Findings Summary
  total_findings INTEGER DEFAULT 0,
  critical_findings INTEGER DEFAULT 0,
  high_findings INTEGER DEFAULT 0,
  medium_findings INTEGER DEFAULT 0,
  low_findings INTEGER DEFAULT 0,
  
  -- Overall Assessment
  overall_rating TEXT, -- 'excellent', 'good', 'satisfactory', 'needs_improvement', 'unsatisfactory'
  executive_summary TEXT,
  key_risks_identified TEXT,
  recommendations TEXT,
  
  -- Follow-up
  follow_up_required BOOLEAN DEFAULT FALSE,
  follow_up_date DATE,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.5 Audit Findings
CREATE TABLE audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  internal_audit_id UUID REFERENCES internal_audits(id) ON DELETE CASCADE,
  finding_reference_number TEXT NOT NULL, -- e.g., F-001
  
  -- Finding Details
  finding_title TEXT NOT NULL,
  finding_description TEXT NOT NULL,
  area_audited TEXT NOT NULL, -- 'fica', 'cpd', 'fit_and_proper', 'documentation', 'supervision'
  
  -- Severity
  severity TEXT NOT NULL, -- 'critical', 'high', 'medium', 'low'
  risk_rating TEXT, -- 'critical', 'high', 'medium', 'low'
  
  -- Root Cause
  root_cause TEXT,
  impact TEXT,
  
  -- Recommendation
  recommendation TEXT NOT NULL,
  management_response TEXT,
  
  -- Remediation
  remediation_status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'completed', 'verified', 'closed'
  remediation_owner UUID REFERENCES auth.users(id),
  remediation_due_date DATE,
  remediation_actual_date DATE,
  remediation_evidence TEXT,
  
  -- Verification
  verified_by UUID REFERENCES auth.users(id),
  verification_date DATE,
  verification_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6.6 Compliance Checks (automated rule-based checks)
CREATE TABLE compliance_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_name TEXT NOT NULL,
  check_type TEXT NOT NULL, -- 'automated', 'manual'
  check_category TEXT NOT NULL, -- 'fica', 'cpd', 'fit_and_proper', 'documentation'
  
  -- Check Configuration
  check_query TEXT, -- SQL query to run for automated checks
  check_rules JSONB, -- Business rules in JSON format
  
  -- Scheduling
  frequency TEXT, -- 'daily', 'weekly', 'monthly', 'on_demand'
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  
  -- Results
  last_result_status TEXT, -- 'pass', 'fail', 'warning'
  last_result_summary TEXT,
  issues_found INTEGER DEFAULT 0,
  
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Supabase Features:
- ✅ **Database functions** for alert rule evaluation
- ✅ **Scheduled jobs** (pg_cron) for automated compliance checks
- ✅ **Realtime subscriptions** for in-app notifications
- ✅ **Webhook triggers** for email/SMS via external services
- ✅ **JSONB queries** for flexible alert condition matching

#### Why This Order:
- Depends on ALL compliance data (Phases 2-5)
- Alerts reference Representatives, Clients, F&P, CPD, FICA
- Internal Audits audit all compliance areas
- Alert rule engine needs complete data model to function

---

### **PHASE 7: DASHBOARDS & REPORTING** (Week 6-8)
**Duration:** 8-12 days  
**Complexity:** High  
**Dependencies:** ALL previous phases complete

#### Modules to Build:
13. **Executive Dashboard**
14. **Team Compliance Matrix**
15. **CPD Progress Dashboard**
16. **Risk & Alerts Dashboard**
17. **Compliance Dashboard**
18. **Reports & Analytics**

#### Database Tables to Create:

```sql
-- 7.1 Dashboard Configurations (user-customizable)
CREATE TABLE dashboard_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  dashboard_type TEXT NOT NULL, -- 'executive', 'team_matrix', 'cpd_progress', 'risk_alerts', 'compliance'
  
  -- Widget Configuration
  widgets JSONB NOT NULL,
  /* Example:
  [
    {
      "widget_id": "health_score",
      "position": 1,
      "visible": true,
      "size": "large"
    },
    {
      "widget_id": "critical_alerts",
      "position": 2,
      "visible": true,
      "size": "medium"
    }
  ]
  */
  
  -- Filters
  default_filters JSONB,
  
  is_default BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.2 Report Templates
CREATE TABLE report_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_name TEXT UNIQUE NOT NULL,
  template_description TEXT,
  template_category TEXT, -- 'compliance', 'executive', 'regulatory', 'operational'
  
  -- Report Configuration
  report_type TEXT NOT NULL, -- 'cpd_summary', 'fica_status', 'compliance_health', 'fsca_submission'
  data_sources TEXT[], -- Array of table names
  
  -- Report Structure
  report_structure JSONB, -- Sections, fields, charts configuration
  default_filters JSONB,
  default_sorting JSONB,
  
  -- Output Formats
  supports_pdf BOOLEAN DEFAULT TRUE,
  supports_excel BOOLEAN DEFAULT TRUE,
  supports_csv BOOLEAN DEFAULT FALSE,
  supports_word BOOLEAN DEFAULT FALSE,
  
  -- Permissions
  required_role TEXT, -- Minimum role required to generate
  
  is_system_template BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.3 Generated Reports (report history)
CREATE TABLE generated_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_template_id UUID REFERENCES report_templates(id),
  
  -- Report Details
  report_name TEXT NOT NULL,
  report_type TEXT NOT NULL,
  generation_date TIMESTAMPTZ DEFAULT NOW(),
  
  -- Parameters
  date_range_start DATE,
  date_range_end DATE,
  filters_applied JSONB,
  
  -- Output
  output_format TEXT NOT NULL, -- 'pdf', 'excel', 'csv', 'word'
  file_size_bytes BIGINT,
  storage_path TEXT, -- Path in Supabase Storage
  storage_url TEXT,
  
  -- Generation Status
  status TEXT DEFAULT 'generating', -- 'generating', 'completed', 'failed'
  generation_time_seconds DECIMAL(10,2),
  error_message TEXT,
  
  -- Metadata
  generated_by UUID REFERENCES auth.users(id),
  recipients UUID[], -- If emailed, array of user IDs
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.4 Scheduled Reports
CREATE TABLE scheduled_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_template_id UUID REFERENCES report_templates(id),
  
  -- Schedule Details
  schedule_name TEXT NOT NULL,
  frequency TEXT NOT NULL, -- 'daily', 'weekly', 'monthly', 'quarterly'
  
  -- Schedule Configuration
  schedule_config JSONB,
  /* Example for weekly:
  {
    "day_of_week": "monday",
    "time": "08:00",
    "timezone": "Africa/Johannesburg"
  }
  */
  
  -- Recipients
  recipients UUID[], -- Array of user IDs
  recipient_emails TEXT[], -- Additional emails (non-users)
  
  -- Email Configuration
  email_subject TEXT,
  email_body TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  last_run_at TIMESTAMPTZ,
  next_run_at TIMESTAMPTZ,
  last_run_status TEXT,
  
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7.5 Analytics Cache (for performance)
CREATE TABLE analytics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT UNIQUE NOT NULL,
  cache_type TEXT NOT NULL, -- 'dashboard_metric', 'chart_data', 'report_summary'
  
  -- Cached Data
  cache_data JSONB NOT NULL,
  
  -- Cache Control
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  is_valid BOOLEAN DEFAULT TRUE,
  
  -- Refresh Configuration
  refresh_interval_minutes INTEGER DEFAULT 5,
  auto_refresh BOOLEAN DEFAULT TRUE
);
```

#### Supabase Features:
- ✅ **Database views** for dashboard metrics (performance)
- ✅ **Materialized views** for complex aggregations
- ✅ **Database functions** for report generation
- ✅ **Storage buckets** for generated report files
- ✅ **Scheduled jobs** for report automation
- ✅ **Realtime subscriptions** for live dashboard updates

#### Why This Order:
- Dashboards query ALL tables (Phases 1-6)
- Reports aggregate data from entire system
- Analytics depend on complete data model
- Must be last to have all data sources available

---

## 🔄 DATABASE MIGRATION STRATEGY

### Migration Best Practices:

```sql
-- Example migration file structure
-- Migration: 001_create_foundation_tables.sql

BEGIN;

-- Create tables with explicit dependencies
CREATE TABLE fsp_configuration (...);
CREATE TABLE system_settings (...);
CREATE TABLE user_roles (...);
CREATE TABLE user_profiles (...);

-- Add indexes
CREATE INDEX idx_user_profiles_role_id ON user_profiles(role_id);
CREATE INDEX idx_user_profiles_status ON user_profiles(status);

-- Add RLS policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON user_profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles r
      JOIN user_profiles up ON up.role_id = r.id
      WHERE up.id = auth.uid()
      AND r.role_name IN ('fsp_owner', 'compliance_officer')
    )
  );

-- Add triggers
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMIT;
```

### Migration Naming Convention:
```
001_create_foundation_tables.sql
002_create_representatives.sql
003_create_fit_and_proper.sql
004_create_cpd_management.sql
005_create_clients_and_fica.sql
006_create_documents_complaints.sql
007_create_alerts_audits.sql
008_create_dashboards_reporting.sql
009_add_indexes.sql
010_add_rls_policies.sql
```

---

## ⚡ SUPABASE-SPECIFIC OPTIMIZATIONS

### 1. Row Level Security (RLS) Patterns

```sql
-- Representative data isolation
CREATE POLICY "Representatives see own data"
  ON representatives FOR SELECT
  USING (user_profile_id = auth.uid());

CREATE POLICY "Key Individuals see supervised reps"
  ON representatives FOR SELECT
  USING (
    supervised_by_ki_id IN (
      SELECT id FROM representatives
      WHERE user_profile_id = auth.uid()
    )
  );

CREATE POLICY "Compliance Officers see all"
  ON representatives FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role_id IN (
        SELECT id FROM user_roles
        WHERE role_name IN ('compliance_officer', 'fsp_owner')
      )
    )
  );
```

### 2. Realtime Subscriptions Setup

```javascript
// Client-side subscription for alerts
const supabase = createClient(supabaseUrl, supabaseKey);

// Subscribe to new alerts for current user
const alertsSubscription = supabase
  .channel('user-alerts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'alerts',
      filter: `representative_id=eq.${currentUserId}`
    },
    (payload) => {
      console.log('New alert received:', payload.new);
      showNotification(payload.new);
    }
  )
  .subscribe();
```

### 3. Storage Bucket Configuration

```javascript
// Create storage buckets during setup
await supabase.storage.createBucket('compliance-documents', {
  public: false,
  fileSizeLimit: 10485760, // 10MB
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png']
});

await supabase.storage.createBucket('cpd-certificates', {
  public: false,
  fileSizeLimit: 5242880, // 5MB
  allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/png']
});

await supabase.storage.createBucket('generated-reports', {
  public: false,
  fileSizeLimit: 52428800, // 50MB
  allowedMimeTypes: ['application/pdf', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
});
```

### 4. Database Functions for Business Logic

```sql
-- Function: Calculate CPD compliance status
CREATE OR REPLACE FUNCTION calculate_cpd_status(
  p_representative_id UUID,
  p_cpd_cycle_id UUID
)
RETURNS TEXT AS $$
DECLARE
  v_total_hours DECIMAL;
  v_ethics_hours DECIMAL;
  v_required_hours DECIMAL;
  v_required_ethics DECIMAL;
  v_progress_pct DECIMAL;
BEGIN
  -- Get required hours
  SELECT required_hours, required_ethics_hours
  INTO v_required_hours, v_required_ethics
  FROM cpd_cycles
  WHERE id = p_cpd_cycle_id;
  
  -- Get completed hours
  SELECT 
    COALESCE(SUM(total_hours), 0),
    COALESCE(SUM(ethics_hours), 0)
  INTO v_total_hours, v_ethics_hours
  FROM cpd_activities
  WHERE representative_id = p_representative_id
    AND cpd_cycle_id = p_cpd_cycle_id
    AND status = 'verified';
  
  -- Calculate progress
  v_progress_pct := (v_total_hours / v_required_hours) * 100;
  
  -- Determine status
  IF v_total_hours >= v_required_hours AND v_ethics_hours >= v_required_ethics THEN
    RETURN 'compliant';
  ELSIF v_progress_pct >= 70 THEN
    RETURN 'on_track';
  ELSIF v_progress_pct >= 50 THEN
    RETURN 'at_risk';
  ELSE
    RETURN 'critical';
  END IF;
END;
$$ LANGUAGE plpgsql;
```

---

## 📋 IMPLEMENTATION CHECKLIST

### Phase 1: Foundation ✓
- [ ] Supabase project created
- [ ] Authentication configured
- [ ] Database tables: fsp_configuration, system_settings, user_roles, user_profiles
- [ ] RLS policies enabled
- [ ] Basic API endpoints created

### Phase 2: Representatives ✓
- [ ] Tables: representatives, key_individuals, supervision_records
- [ ] RLS policies for representative data isolation
- [ ] Self-referencing FK working correctly
- [ ] Representative CRUD operations

### Phase 3: Core Compliance ✓
- [ ] Tables: fit_and_proper_records, cpd_cycles, cpd_activities
- [ ] Materialized view: cpd_progress_summary
- [ ] Storage bucket: cpd-certificates
- [ ] Triggers for CPD calculations

### Phase 4: Clients & FICA ✓
- [ ] Tables: clients, fica_verifications, client_beneficial_owners
- [ ] RLS policies for client data isolation
- [ ] FICA completeness calculation
- [ ] Client assignment to representatives

### Phase 5: Documents & Complaints ✓
- [ ] Tables: documents, document_access_log, complaints, complaint_communications
- [ ] Storage buckets: compliance-documents, generated-reports
- [ ] Polymorphic document associations working
- [ ] Complaint deadline calculations

### Phase 6: Alerts & Monitoring ✓
- [ ] Tables: alert_rules, alerts, notifications, internal_audits, audit_findings, compliance_checks
- [ ] Alert rule evaluation function
- [ ] Realtime subscriptions for notifications
- [ ] Scheduled jobs for automated checks

### Phase 7: Dashboards & Reporting ✓
- [ ] Tables: dashboard_configurations, report_templates, generated_reports, scheduled_reports, analytics_cache
- [ ] Database views for dashboard metrics
- [ ] Report generation functions
- [ ] Scheduled report automation

---

## 🎯 SUCCESS CRITERIA

### Database Health Indicators:
- ✅ No circular foreign key dependencies
- ✅ All RLS policies tested and working
- ✅ Query performance <100ms for dashboard queries
- ✅ Realtime subscriptions latency <500ms
- ✅ Storage buckets properly secured
- ✅ Automated backups configured
- ✅ Migration rollback tested

---

## 📚 ADDITIONAL RESOURCES

### Supabase Documentation:
- Authentication: https://supabase.com/docs/guides/auth
- Row Level Security: https://supabase.com/docs/guides/auth/row-level-security
- Realtime: https://supabase.com/docs/guides/realtime
- Storage: https://supabase.com/docs/guides/storage
- Database Functions: https://supabase.com/docs/guides/database/functions

### Migration Tools:
- Supabase CLI: https://supabase.com/docs/guides/cli
- Database migrations: https://supabase.com/docs/guides/cli/local-development

---

**Document Prepared By:** Ced  
**Date:** 23 November 2024  
**Status:** Implementation Sequence Defined  
**Next Step:** Begin Phase 1 - Foundation & Authentication

---

**Total Implementation Time:** 6-8 weeks for complete system  
**Recommended Team Size:** 2-3 developers + 1 QA engineer  
**Database Complexity:** High (16 modules, 40+ tables, multiple relationships)  
**Supabase Suitability:** ✅ Excellent (Realtime, RLS, Storage, Auth all utilized)
