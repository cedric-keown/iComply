# Brokerage Compliance Management System
## Cursor Prompts Gap Analysis & Reconciliation

**Date:** 23 November 2024  
**Project:** South African FSP Compliance Management Platform  
**Purpose:** Identify missing cursor instruction files needed for complete system implementation

---

## EXECUTIVE SUMMARY

The Brokerage Compliance Management system comprises **15 major functional modules** organized around the FAIS Act compliance requirements. Currently, **6 cursor prompt files** exist, leaving **9 critical modules** without development instructions.

### Current Coverage: 40% (6 of 15 modules)

---

## 1. EXISTING CURSOR PROMPT FILES ✅

### 1.1 Core Compliance Modules (Complete)

| File Name | Module | Status | Completeness |
|-----------|--------|--------|--------------|
| `cursor_prompt_fit_and_proper.txt` | Fit & Proper Requirements | ✅ Complete | 100% |
| `cursor_prompt_cpd_management.txt` | CPD Management | ✅ Complete | 100% |
| `cursor_prompt_fica_verification.txt` | FICA Verification | ✅ Complete | 100% |
| `cursor_prompt_document_management.txt` | Document Management | ✅ Complete | 100% |
| `cursor_prompt_complaints_management.md` | Complaints Management | ✅ Complete | 100% |
| `cursor_prompt_representatives_management.md` | Representatives Management | ✅ Complete | 100% |

**Total Coverage:** 6 modules with comprehensive implementation instructions

---

## 2. MISSING CURSOR PROMPT FILES ❌

### 2.1 CRITICAL - Dashboard Modules (Priority 1)

#### **Missing File #1: `cursor_prompt_dashboard_executive.md`**
**Module:** Executive Overview Dashboard  
**Menu Location:** Dashboard → Executive Overview  
**User Roles:** FSP Owner, Key Individual, Compliance Officer  

**Required Features:**
- Overall compliance health score (87% metric)
- Company license status & expiry tracking
- Team compliance matrix visualization
- Critical alerts counter (red/amber/green)
- Upcoming deadlines widget (CPD, renewals, audits)
- Representative compliance breakdown (12/15 compliant)
- Recent FSCA communications feed
- Quick action buttons (Add Rep, Log Complaint, Upload Doc)
- Real-time data refresh (every 5 minutes)
- Export to PDF for board meetings

**Technical Requirements:**
- Chart.js for visualizations (donut, bar, line charts)
- Real-time websocket connections for live updates
- Role-based data filtering
- Mobile-responsive cards
- Print-friendly layout

**Why Critical:** Primary landing page for all senior users; drives entire compliance oversight function

---

#### **Missing File #2: `cursor_prompt_dashboard_team_compliance.md`**
**Module:** Team Compliance Matrix  
**Menu Location:** Dashboard → Team Compliance Matrix  
**User Roles:** FSP Owner, Key Individual, Compliance Officer  

**Required Features:**
- Interactive matrix table (Representatives × Compliance Areas)
- Traffic light indicators (green/amber/red status)
- Sortable/filterable columns (name, status, expiry)
- Drill-down to individual representative details
- Bulk actions (send reminders, generate reports)
- Export capabilities (Excel, PDF, CSV)
- Compliance score calculation algorithm
- Historical trend visualization
- Automated email summary scheduling

**Data Points per Representative:**
- Fit & Proper status (✓/✗)
- CPD progress (15/18 hours with %)
- FICA compliance (✓/!)
- Document status (current/expiring/expired)
- Overall status badge (Compliant/At Risk/Non-Compliant)
- Last activity date
- Quick action buttons (View/Edit/Alert)

**Why Critical:** Core management tool for monitoring entire team compliance; required daily by principals

---

#### **Missing File #3: `cursor_prompt_dashboard_cpd_progress.md`**
**Module:** CPD Progress Dashboard  
**Menu Location:** Dashboard → CPD Progress Dashboard  
**User Roles:** FSP Owner, Key Individual, Compliance Officer  

**Required Features:**
- Team-wide CPD statistics
- Deadline countdown (188 days to 31 May)
- Completion rate tracking (75% team compliant)
- Representative-level breakdown
- Category distribution (Technical vs Ethics hours)
- Trend analysis (monthly progress tracking)
- At-risk representative alerts
- Verification queue status (3 pending)
- Projected completion forecast

**Why Critical:** Time-sensitive compliance tracking with statutory deadline; requires proactive monitoring

---

#### **Missing File #4: `cursor_prompt_dashboard_risk_alerts.md`**
**Module:** Risk & Alerts Dashboard  
**Menu Location:** Dashboard → Risk & Alerts  
**User Roles:** FSP Owner, Key Individual, Compliance Officer  

**Required Features:**
- Consolidated alerts from all modules
- Priority-based categorization (Critical/High/Medium/Low)
- Alert aging and escalation tracking
- Dismissal workflow with audit trail
- Custom alert creation
- Automated alert generation rules
- Email/SMS notification integration
- Alert history and trends
- Risk scoring algorithm
- Remediation tracking

**Alert Categories:**
- Expiring qualifications (RE1/RE5)
- CPD behind schedule
- FICA reviews overdue
- Documents expiring/expired
- Complaint deadlines approaching
- Insurance policy renewals
- FSCA correspondence requiring response

**Why Critical:** Proactive risk management; prevents compliance breaches before they occur

---

### 2.2 CRITICAL - Compliance Module (Priority 1)

#### **Missing File #5: `cursor_prompt_compliance_dashboard.md`**
**Module:** Compliance Dashboard & Monitoring  
**Menu Location:** Compliance → Compliance Dashboard  
**User Roles:** FSP Owner, Key Individual, Compliance Officer  

**Required Features:**
- Overall health score calculation (87%)
- Issue categorization (Critical: 1, High: 3, Medium: 5)
- Compliance check scheduler
- Automated compliance assessments
- TCF (Treating Customers Fairly) outcomes tracking
- Regulatory change impact assessment
- Compliance calendar integration
- Action item management with due dates
- Assignee tracking and notifications

**Compliance Checks:**
- Fit & Proper Status (all representatives)
- CPD Compliance (annual cycle)
- FICA Compliance (client base)
- Documentation Status (5-year retention)
- Insurance Coverage (PI & FG)
- FSCA License Status
- Representative supervision ratios
- Training completion rates

**Why Critical:** Central hub for all compliance monitoring; required by FAIS Act Section 17 (Compliance Officer functions)

---

#### **Missing File #6: `cursor_prompt_alerts_notifications.md`**
**Module:** Alerts & Notifications System  
**Menu Location:** Compliance → Alerts & Notifications  
**User Roles:** All roles with role-based filtering  

**Required Features:**
- Multi-channel delivery (in-app, email, SMS, WhatsApp)
- Priority-based routing (Critical → FSP Owner immediately)
- Alert templates library
- Scheduling and recurring alerts
- Acknowledgment workflow
- Escalation rules (if unacknowledged within X hours)
- Alert suppression rules (prevent alert fatigue)
- User notification preferences
- Bulk alert actions
- Alert analytics and reporting

**Alert Types:**
- **Time-based:** Deadlines approaching, anniversaries
- **Threshold-based:** Compliance score drops below 85%
- **Event-based:** Representative leaves, client complaint filed
- **System-based:** Document upload failed, backup completed
- **Regulatory-based:** FSCA circulars published, legislation changed

**Why Critical:** Core communication infrastructure; ensures timely action on compliance issues

---

#### **Missing File #7: `cursor_prompt_internal_audits.md`**
**Module:** Internal Audits & FSCA Communications  
**Menu Location:** Compliance → Internal Audits / FSCA Communications  
**User Roles:** FSP Owner, Key Individual, Compliance Officer  

**Required Features:**

**Internal Audits:**
- Audit scheduling and planning
- Audit checklist templates (FAIS, FICA, TCF)
- Finding categorization (Critical/Major/Minor)
- Remediation action tracking
- Corrective Action Plans (CAPs)
- Follow-up audit scheduling
- Audit report generation
- Evidence attachment management
- Auditor assignment
- Audit history and trends

**FSCA Communications:**
- Correspondence tracking (inbound/outbound)
- Circular and bulletin management
- Submission tracking (quarterly, annual returns)
- Response deadline monitoring
- Document version control
- Communication templates
- Regulatory change log
- Impact assessment workflow
- Team notifications on new communications

**Why Critical:** Demonstrates proactive compliance culture; critical for FSCA inspections and license renewals

---

### 2.3 HIGH PRIORITY - Client Management Module

#### **Missing File #8: `cursor_prompt_client_management.md`**
**Module:** Client Management (separate from FICA)  
**Menu Location:** Clients & FICA → Client Directory / Add New Client  
**User Roles:** All roles with role-based data access  

**Required Features:**
- Client directory with advanced search
- Client onboarding workflow
- Client profile management (personal details, contacts)
- Representative assignment
- Client categorization (individual, business, trust)
- Product/policy association
- Communication history log
- Document attachments
- Client portal access management
- Bulk import/export
- Client transfer workflow (between representatives)
- Inactive/archive client management

**Client Data Structure:**
- Personal information (name, ID, DOB, gender)
- Contact details (email, mobile, address)
- Banking information
- Tax information
- Marketing consent
- Communication preferences
- Risk profile
- Assigned representative
- Relationship start date
- Client status (Active/Inactive/Deceased/Transferred)

**Integration Points:**
- FICA verification module
- Document management (client docs)
- Complaints (client complaints)
- Representatives (assignment)

**Why High Priority:** Foundation for all client-related compliance; required before FICA workflows can function fully

---

### 2.4 HIGH PRIORITY - Reports & Analytics Module

#### **Missing File #9: `cursor_prompt_reports_analytics.md`**
**Module:** Reports & Analytics  
**Menu Location:** Reports → Standard Reports / Custom Report Builder  
**User Roles:** All roles with role-based report access  

**Required Features:**

**Standard Reports:**
1. Executive Summary (for board meetings)
2. Team Compliance Report (monthly snapshot)
3. CPD Annual Report (FSCA submission format)
4. FICA Compliance Report (quarterly)
5. Complaints Summary (monthly/annual)
6. TCF Outcomes Report
7. Representative Performance Report
8. Document Compliance Report (5-year retention)
9. Audit Findings Report
10. Risk Assessment Report

**Custom Report Builder:**
- Drag-and-drop report designer
- Data source selection (representatives, clients, CPD, FICA, documents)
- Filter builder (date ranges, categories, statuses)
- Column/field selector
- Sorting and grouping options
- Calculation fields (sums, averages, percentages)
- Chart/graph integration
- Save report templates
- Share report definitions with team

**Scheduled Reports:**
- Recurring schedule setup (daily/weekly/monthly)
- Email distribution lists
- Automatic generation and delivery
- Report history and archiving

**Export Formats:**
- PDF (formatted, print-ready)
- Excel (with formulas)
- CSV (raw data)
- Word (formatted report document)

**Why High Priority:** Essential for regulatory submissions, board reporting, and management decision-making

---

### 2.5 MEDIUM PRIORITY - Settings & Administration Module

#### **Missing File #10: `cursor_prompt_settings_administration.md`**
**Module:** Settings & Administration  
**Menu Location:** Settings → (All sub-sections)  
**User Roles:** FSP Owner, Key Individual (limited for Compliance Officer)  

**Required Sections:**

**1. Company Profile:**
- FSP details (name, number, license type)
- License information (issue date, expiry, categories)
- Contact information (physical, postal, email, phone)
- Banking details (for system billing)
- Company logo upload
- Trading hours
- Public holidays calendar (SA)

**2. Insurance Management:**
- Professional Indemnity (PI) policy tracking
  - Insurer name
  - Policy number
  - Coverage amount (minimum R2 million)
  - Premium amount
  - Effective date / Expiry date
  - Renewal reminder (90/60/30 days before)
  - Certificate upload
- Fidelity Guarantee policy tracking (same structure)
- Claims history log
- Renewal notifications

**3. User Management:**
- User list (all system users)
- Add new user workflow
- User roles assignment (6 roles)
- User permissions matrix
- User activation/deactivation
- Password reset functionality
- MFA enforcement
- User activity log
- Bulk user import

**4. System Configuration:**
- Email templates editor
  - Alert emails
  - Reminder emails
  - Report emails
  - Custom templates
- Alert settings
  - Alert thresholds configuration
  - Notification frequency
  - Escalation rules
  - Quiet hours settings
- Workflow automation
  - Trigger definitions
  - Action automation rules
  - Conditional logic builder
- Integration settings
  - API key management
  - Webhook configurations
  - Third-party integrations

**5. Compliance Settings:**
- CPD hour requirements (by category)
- FICA review schedules (low/medium/high risk)
- Document categories management
- Risk assessment rules configuration
- Retention period settings
- Approval workflow configuration

**6. Billing & Subscription:**
- Current plan details
- Usage statistics (users, storage, documents)
- Invoices history
- Payment methods (credit card, EFT)
- Upgrade/downgrade plan
- Billing contact information

**Why Medium Priority:** Required for system configuration but not day-to-day compliance operations; can be implemented after core modules

---

## 3. SUPPORTING DOCUMENTS STATUS

### 3.1 Architecture & Design Documents ✅

| Document | Status | Purpose |
|----------|--------|---------|
| `MENU-STRUCTURE.md` | ✅ Complete | Full navigation hierarchy for all roles |
| `user_role_feature_matrix.html` | ✅ Complete | 120+ features × 6 roles permission matrix |
| `brokerage_compliance_management.html` | ✅ Complete | System overview prototype |
| `phase1_compliance_overview.html` | ✅ Complete | Phase 1 implementation scope |

**Assessment:** Documentation foundation is solid; provides clear specifications for all missing cursor prompts

---

## 4. IMPLEMENTATION PRIORITY MATRIX

### Priority 1: CRITICAL (Implement First)
**Target:** Weeks 1-4

1. ✅ Representatives Management (COMPLETE)
2. ✅ Fit & Proper (COMPLETE)
3. ✅ CPD Management (COMPLETE)
4. ✅ Document Management (COMPLETE)
5. ✅ FICA Verification (COMPLETE)
6. ✅ Complaints Management (COMPLETE)
7. ❌ **Dashboard - Executive Overview** ← START HERE
8. ❌ **Dashboard - Team Compliance Matrix**
9. ❌ **Compliance Dashboard**
10. ❌ **Alerts & Notifications System**

**Rationale:** These modules form the core compliance management infrastructure required for FSP license maintenance

---

### Priority 2: HIGH (Implement Next)
**Target:** Weeks 5-8

1. ❌ **Dashboard - CPD Progress**
2. ❌ **Dashboard - Risk & Alerts**
3. ❌ **Client Management**
4. ❌ **Reports & Analytics**
5. ❌ **Internal Audits**

**Rationale:** Enhances management visibility and supports regulatory reporting requirements

---

### Priority 3: MEDIUM (Implement Last)
**Target:** Weeks 9-12

1. ❌ **Settings & Administration**

**Rationale:** System configuration can use defaults initially; customization can follow once core operations are stable

---

## 5. CURSOR PROMPT TEMPLATE STRUCTURE

Each missing cursor prompt file should follow this standardized structure for consistency:

```markdown
# CURSOR PROMPT: [MODULE NAME]
============================================================

## BRAND & DESIGN REQUIREMENTS
- Brand Colors (CustomApp teal #5CBDB4)
- Bootstrap 5 + Phoenix v1.23.0 theme
- South African locale (DD/MM/YYYY, ZAR currency)
- Responsive design (mobile-first)

## ROLE-BASED ACCESS CONTROL
- FSP Owner: [permissions]
- Key Individual: [permissions]
- Compliance Officer: [permissions]
- Representative: [permissions]
- Admin Staff: [permissions]

## MODULE STRUCTURE
- Tab/Page structure
- Navigation flows
- Key workflows

## FEATURES & FUNCTIONALITY
### Feature 1
[Detailed specifications]

### Feature 2
[Detailed specifications]

## DATA STRUCTURES
- Database schema requirements
- Enums and constants
- Relationships

## BUSINESS LOGIC
- Validation rules
- Calculation formulas
- Workflow rules

## UI COMPONENTS
- Forms and fields
- Tables and grids
- Charts and visualizations
- Modals and overlays

## API REQUIREMENTS
- Endpoints needed
- Request/response formats
- Authentication requirements

## SAMPLE DATA
- Realistic test data
- Current date: [date]
- Sample users and scenarios

## TECHNICAL NOTES
- Performance considerations
- Security requirements
- Audit trail requirements

## INTEGRATION POINTS
- Related modules
- Data dependencies
- Trigger points
```

---

## 6. DEVELOPMENT SEQUENCE RECOMMENDATION

### Phase 1: Foundation (Weeks 1-2)
1. ✅ All 6 existing modules (COMPLETE)

### Phase 2: Management Visibility (Weeks 3-4)
1. **Dashboard - Executive Overview** (highest visibility)
2. **Dashboard - Team Compliance Matrix** (most used)
3. **Alerts & Notifications System** (enables proactive management)

### Phase 3: Compliance Infrastructure (Weeks 5-6)
1. **Compliance Dashboard** (central compliance hub)
2. **Dashboard - CPD Progress** (time-sensitive tracking)
3. **Dashboard - Risk & Alerts** (risk mitigation)

### Phase 4: Operational Tools (Weeks 7-8)
1. **Client Management** (foundation for FICA workflows)
2. **Internal Audits** (compliance verification)

### Phase 5: Reporting & Administration (Weeks 9-10)
1. **Reports & Analytics** (regulatory submissions)
2. **Settings & Administration** (system configuration)

**Total Development Timeline:** 10 weeks for complete system implementation

---

## 7. TECHNICAL DEPENDENCIES MAP

```
┌─────────────────────────────────────────┐
│     DATABASE & AUTHENTICATION           │
│     (Multi-tenant, JWT, RBAC)           │
└─────────────────┬───────────────────────┘
                  │
    ┌─────────────┴─────────────┐
    │                           │
┌───▼────────────────┐  ┌──────▼───────────────┐
│  REPRESENTATIVES   │  │  CLIENT MANAGEMENT   │
│   (Foundation)     │  │    (Foundation)      │
└───┬────────────────┘  └──────┬───────────────┘
    │                           │
    ├───────────┬───────────────┤
    │           │               │
┌───▼───────┐ ┌─▼────────────┐ ┌▼──────────────┐
│ FIT &     │ │ CPD          │ │ FICA          │
│ PROPER    │ │ MANAGEMENT   │ │ VERIFICATION  │
└───┬───────┘ └─┬────────────┘ └┬──────────────┘
    │           │               │
    └───────────┼───────────────┘
                │
    ┌───────────┴───────────────┐
    │                           │
┌───▼──────────────┐  ┌─────────▼────────────┐
│  DOCUMENT        │  │  COMPLAINTS          │
│  MANAGEMENT      │  │  MANAGEMENT          │
└───┬──────────────┘  └─────────┬────────────┘
    │                           │
    └───────────┬───────────────┘
                │
    ┌───────────┴───────────────────┐
    │                               │
┌───▼────────────────┐  ┌───────────▼──────────┐
│  COMPLIANCE        │  │  ALERTS &            │
│  DASHBOARD         │  │  NOTIFICATIONS       │
└───┬────────────────┘  └───────────┬──────────┘
    │                               │
    └───────────┬───────────────────┘
                │
    ┌───────────┴───────────────┐
    │                           │
┌───▼──────────────┐  ┌─────────▼────────────┐
│  DASHBOARDS      │  │  REPORTS &           │
│  (4 types)       │  │  ANALYTICS           │
└───┬──────────────┘  └─────────┬────────────┘
    │                           │
    └───────────┬───────────────┘
                │
        ┌───────▼────────┐
        │   SETTINGS &   │
        │   ADMIN        │
        └────────────────┘
```

**Key Dependencies:**
- **Representatives** must be complete before Fit & Proper, CPD, and Supervision
- **Client Management** must be complete before FICA workflows
- **Alerts System** can be built in parallel but integrates with all modules
- **Dashboards** require data from all underlying modules
- **Reports** require all data sources to be available

---

## 8. ESTIMATED DEVELOPMENT EFFORT

### Cursor Prompt Creation Time
| File | Estimated Hours | Complexity |
|------|----------------|------------|
| Dashboard - Executive Overview | 8-12 hours | High |
| Dashboard - Team Compliance | 6-8 hours | Medium-High |
| Dashboard - CPD Progress | 4-6 hours | Medium |
| Dashboard - Risk & Alerts | 6-8 hours | Medium-High |
| Compliance Dashboard | 8-10 hours | High |
| Alerts & Notifications | 10-12 hours | Very High |
| Internal Audits | 6-8 hours | Medium |
| Client Management | 8-10 hours | High |
| Reports & Analytics | 12-16 hours | Very High |
| Settings & Administration | 10-12 hours | High |
| **TOTAL** | **78-102 hours** | - |

**Estimated Timeline:** 10-13 working days at 8 hours/day

---

## 9. RISK ASSESSMENT

### High Risk Issues
1. **Alert System Complexity:** Multi-channel delivery, escalation rules, and integration with all modules makes this the most complex component
   - **Mitigation:** Build in phases; start with in-app alerts, add email/SMS later

2. **Report Builder Flexibility:** Custom report builder with drag-and-drop requires sophisticated UI
   - **Mitigation:** Start with standard reports; add custom builder as enhancement

3. **Dashboard Real-Time Data:** Live updates require websocket infrastructure
   - **Mitigation:** Start with polling (5-minute refresh); add websockets later

### Medium Risk Issues
1. **Client Management Scope Creep:** Could expand beyond compliance into full CRM
   - **Mitigation:** Strict focus on compliance-required client data only

2. **Settings Complexity:** Too many configuration options can overwhelm users
   - **Mitigation:** Provide sensible defaults; mark advanced settings clearly

---

## 10. NEXT STEPS & RECOMMENDATIONS

### Immediate Actions (This Week)
1. ✅ Complete this gap analysis
2. ❌ Create `cursor_prompt_dashboard_executive.md`
3. ❌ Create `cursor_prompt_dashboard_team_compliance.md`
4. ❌ Create `cursor_prompt_alerts_notifications.md`

### Short Term (Next 2 Weeks)
1. Complete all Priority 1 cursor prompts
2. Begin development of Executive Dashboard
3. Set up alerts infrastructure

### Medium Term (Next 4-6 Weeks)
1. Complete Priority 2 cursor prompts
2. Develop Client Management module
3. Build reporting infrastructure

### Long Term (Next 8-12 Weeks)
1. Complete all cursor prompts
2. Full system integration testing
3. User acceptance testing
4. Production deployment preparation

---

## 11. SUCCESS METRICS

### Completion Criteria
- ✅ All 15 modules have cursor prompt files
- ✅ All cursor prompts follow standardized template
- ✅ Role-based access control specified for all features
- ✅ Integration points documented between modules
- ✅ Sample data and test scenarios included
- ✅ South African regulatory requirements referenced

### Quality Assurance
- Each cursor prompt reviewed against FAIS Act requirements
- Each cursor prompt validated against user role permissions matrix
- Each cursor prompt includes realistic SA brokerage scenarios
- Each cursor prompt specifies CustomApp brand colors
- Each cursor prompt includes mobile-responsive design requirements

---

## APPENDIX A: MODULE CROSS-REFERENCE

| Module | Cursor Prompt File | Menu Location | Status |
|--------|-------------------|---------------|--------|
| Representatives | cursor_prompt_representatives_management.md | Representatives → All Representatives | ✅ |
| Fit & Proper | cursor_prompt_fit_and_proper.txt | Representatives → [Rep Profile] → Fit & Proper | ✅ |
| CPD Management | cursor_prompt_cpd_management.txt | CPD Management → Team CPD Dashboard | ✅ |
| FICA Verification | cursor_prompt_fica_verification.txt | Clients & FICA → FICA Reviews | ✅ |
| Document Management | cursor_prompt_document_management.txt | Documents → All Documents | ✅ |
| Complaints | cursor_prompt_complaints_management.md | Complaints → All Complaints | ✅ |
| Executive Dashboard | ❌ MISSING | Dashboard → Executive Overview | ❌ |
| Team Compliance Matrix | ❌ MISSING | Dashboard → Team Compliance Matrix | ❌ |
| CPD Progress Dashboard | ❌ MISSING | Dashboard → CPD Progress | ❌ |
| Risk & Alerts Dashboard | ❌ MISSING | Dashboard → Risk & Alerts | ❌ |
| Compliance Dashboard | ❌ MISSING | Compliance → Compliance Dashboard | ❌ |
| Alerts & Notifications | ❌ MISSING | Compliance → Alerts & Notifications | ❌ |
| Internal Audits | ❌ MISSING | Compliance → Internal Audits | ❌ |
| Client Management | ❌ MISSING | Clients & FICA → Client Directory | ❌ |
| Reports & Analytics | ❌ MISSING | Reports → Standard Reports | ❌ |
| Settings & Administration | ❌ MISSING | Settings → (All sections) | ❌ |

---

## APPENDIX B: REGULATORY COMPLIANCE MAPPING

Each cursor prompt must ensure compliance with:

| Regulation | Key Requirements | Affected Modules |
|------------|------------------|------------------|
| FAIS Act (2002) | Overall framework | ALL modules |
| Section 6A | Fit & Proper requirements | Fit & Proper, Representatives |
| Section 8A | CPD requirements (18 hours/year) | CPD Management, Dashboards |
| Section 13(2)(a) | Vicarious liability | Representatives, Compliance Dashboard |
| Section 17 | Compliance Officer functions | Compliance Dashboard, Internal Audits |
| FICA (2001) | Client verification | FICA Verification, Client Management |
| Section 21 | Record keeping (5 years) | Document Management |
| FAIS Circular 4/2014 | Criminal penalties | Alerts & Notifications |
| TCF Principles | Treating Customers Fairly | Complaints, Dashboards |

---

**Document End**

**Prepared by:** Ced  
**Review Date:** 23 November 2024  
**Next Review:** Upon completion of Priority 1 cursor prompts  

---
