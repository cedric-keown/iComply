# CURSOR PROMPT: INTERNAL AUDITS MODULE

Create a fully functional, realistic HTML mockup for the Internal Audits module of a South African FAIS broker compliance portal. This module manages internal compliance audits, FSCA inspection preparedness, audit findings, corrective actions, and audit trails to ensure FSP regulatory compliance and readiness for FSCA inspections.

## BRAND & DESIGN REQUIREMENTS

**Brand Colors:**
- Primary (Teal/Turquoise): #5CBDB4
- Text (Charcoal Grey): #4A4A4A
- Background: #FFFFFF
- Light Grey: #F8F9FA
- Success: #28A745
- Warning: #FFC107
- Danger: #DC3545
- Info: #17A2B8

**Framework & Theme:**
- Use Bootstrap 5+ with Phoenix v1.23.0 theme: https://prium.github.io/phoenix/v1.23.0/index.html
- Fully responsive design (mobile-first)
- Vanilla JavaScript only (no frameworks)
- South African locale (dates: DD/MM/YYYY, currency: ZAR)

## MODULE STRUCTURE

### Top Navigation Tabs
- Audit Dashboard (default)
- Audit Schedule
- Active Audits
- Findings & Actions
- FSCA Inspections
- Audit History
- Reports

---

## 1. AUDIT DASHBOARD

### Hero Section: Audit Overview

**Current Date Context:** 15 December 2024

**Audit Status Card (Center Banner):**
```
FSP AUDIT STATUS: ✅ INSPECTION READY

Last Internal Audit: 30/11/2024
Next Scheduled Audit: 28/02/2025
Last FSCA Inspection: 15/08/2023
Days Since Last FSCA Visit: 488 days

Overall Compliance Score: 94/100
Status: ✅ Excellent
```

### Key Metrics (4 Cards)

**Card 1: Scheduled Audits**
- Large number: 4
- Icon: Calendar-check
- Label: "Upcoming Audits"
- Details: Next 90 days
- Next audit: 28/02/2025 (75 days)
- Status: Info (blue)
- [View Schedule]

**Card 2: Active Audits**
- Large number: 1
- Icon: Activity
- Label: "In Progress"
- Details: CPD Compliance Audit
- Started: 10/12/2024 (5 days ago)
- Status: Info (blue)
- [View Details]

**Card 3: Open Findings**
- Large number: 3
- Icon: Alert-circle
- Label: "Open Findings"
- Breakdown:
  - Critical: 0
  - High: 1
  - Medium: 2
  - Low: 0
- Status: Warning (amber)
- [Review Findings]

**Card 4: Corrective Actions**
- Large number: 2
- Icon: Check-square
- Label: "Pending Actions"
- Details: 
  - Overdue: 0
  - Due this week: 1
  - Due this month: 1
- Status: Info (blue)
- [View Actions]

### Compliance Score Breakdown

**Overall Compliance Score: 94/100**

**Score by Category (Progress Bars):**

**Fit & Proper Compliance:**
- Score: 98/100
- Status: ✅ Excellent
- Last Audited: 30/11/2024
- Findings: 0 open

**CPD Compliance:**
- Score: 92/100
- Status: ✅ Very Good
- Last Audited: 10/12/2024 (In progress)
- Findings: 1 open (medium)

**FICA Verification:**
- Score: 95/100
- Status: ✅ Excellent
- Last Audited: 15/10/2024
- Findings: 2 open (medium)

**Document Management:**
- Score: 96/100
- Status: ✅ Excellent
- Last Audited: 30/11/2024
- Findings: 0 open

**Complaints Handling:**
- Score: 100/100
- Status: ✅ Perfect
- Last Audited: 30/09/2024
- Findings: 0 open

**Representatives Management:**
- Score: 94/100
- Status: ✅ Very Good
- Last Audited: 30/11/2024
- Findings: 0 open

### Audit Trends Chart

**Line Chart - Compliance Score Over Time:**
- X-axis: Last 12 months (Dec 2023 - Dec 2024)
- Y-axis: Compliance score (0-100)
- Line: Overall FSP compliance score
- Target line: 90 (threshold for "Very Good")

**Historical Trend:**
- Dec 2023: 88
- Mar 2024: 91
- Jun 2024: 93
- Sep 2024: 95
- Dec 2024: 94 (current)
- Trend: ↑ Improving consistently

### Recent Audit Activity

**Last 5 Audit Actions:**

| Date | Activity | Type | Auditor | Status |
|------|----------|------|---------|--------|
| 10/12/2024 | CPD Compliance Audit started | Internal | Compliance Officer | ⏳ In Progress |
| 30/11/2024 | Quarterly compliance audit completed | Internal | Compliance Officer | ✅ Complete |
| 15/11/2024 | F&P documentation review | Internal | Compliance Officer | ✅ Complete |
| 01/11/2024 | FICA verification spot check | Internal | FICA Officer | ✅ Complete |
| 15/10/2024 | Monthly compliance check | Internal | Compliance Officer | ✅ Complete |

**[View Full Activity Log]** [Export Log]

### FSCA Inspection Readiness

**Inspection Preparedness Score: 92/100**

**Readiness Categories:**

**Documentation Completeness:**
- Score: 95/100
- Status: ✅ Excellent
- All mandatory documents: Present
- Document age: Current (<12 months)
- Filing system: Well-organized

**Compliance Evidence:**
- Score: 94/100
- Status: ✅ Very Good
- Audit trails: Complete
- Representative files: Current
- Policy documentation: Up-to-date

**System & Processes:**
- Score: 90/100
- Status: ✅ Very Good
- Compliance processes: Documented
- Risk management: Active
- Monitoring systems: Functional

**Staff Preparedness:**
- Score: 88/100
- Status: ✅ Good
- Compliance training: Current
- Role understanding: Good
- Response procedures: Documented

**[Generate Inspection Report]** [Schedule Mock Inspection] [View Checklist]

---

## 2. AUDIT SCHEDULE

### Annual Audit Calendar

**2024/2025 Audit Schedule:**

**Quarterly Compliance Audits (4 per year):**
- ✅ Q1: 31/03/2024 - Completed (Score: 91/100)
- ✅ Q2: 30/06/2024 - Completed (Score: 93/100)
- ✅ Q3: 30/09/2024 - Completed (Score: 95/100)
- ✅ Q4: 30/11/2024 - Completed (Score: 94/100)
- 📋 Q1 2025: 31/03/2025 - Scheduled (75 days)

**Monthly Compliance Checks (12 per year):**
- December 2024: ⏳ In Progress
- January 2025: 📋 Scheduled (15/01/2025)
- February 2025: 📋 Scheduled (15/02/2025)
- [View Full Schedule]

**Specialized Audits:**

| Audit Type | Frequency | Last Completed | Next Scheduled | Status |
|------------|-----------|----------------|----------------|--------|
| Fit & Proper Review | Quarterly | 30/11/2024 | 28/02/2025 | 📋 |
| CPD Compliance | Bi-annual | 10/12/2024 | 01/06/2025 | ⏳ In Progress |
| FICA Verification | Monthly | 15/11/2024 | 15/01/2025 | 📋 |
| Document Retention | Annual | 15/09/2024 | 15/09/2025 | 📋 |
| Complaints Review | Quarterly | 30/09/2024 | 31/03/2025 | 📋 |
| Risk Assessment | Bi-annual | 30/06/2024 | 31/12/2024 | 📋 |
| Representative Files | Annual | 15/08/2024 | 15/08/2025 | 📋 |

### Calendar View

**Visual Calendar - Next 6 Months:**

**December 2024:**
- 10: CPD Audit started (in progress)
- 15: Monthly compliance check (today)
- 31: Risk assessment audit

**January 2025:**
- 15: FICA verification audit
- 15: Monthly compliance check
- 31: Policy documentation review

**February 2025:**
- 15: Monthly compliance check
- 28: Quarterly compliance audit (Q1 2025)
- 28: Fit & Proper review

**March 2025:**
- 15: Monthly compliance check
- 31: Complaints review

**[Add Custom Audit]** [Edit Schedule] [Export Calendar]

### Schedule New Audit

**Audit Creation Form:**

**Audit Details:**
- Audit Type: [Dropdown: Compliance / FICA / CPD / F&P / Documents / Risk / Representative Files / Other]
- Audit Name: [Text field]
- Scheduled Date: [Date picker] *Required
- Estimated Duration: [Dropdown: 1 day / 2-3 days / 1 week / 2 weeks / 1 month]

**Audit Scope:**
- Audit Scope: [Text area - describe what will be audited]
- Compliance Areas: [Multi-select checkboxes]
  - [ ] Fit & Proper
  - [ ] CPD
  - [ ] FICA
  - [ ] Documents
  - [ ] Complaints
  - [ ] Representatives
  - [ ] Risk Management
  - [ ] Other

**Audit Team:**
- Lead Auditor: [Dropdown: Select user] *Required
- Audit Team Members: [Multi-select]
- External Auditor: [ ] Yes / [x] No

**Notifications:**
- [ ] Notify audit team
- [ ] Notify FSP Owner
- [ ] Send reminder 7 days before
- [ ] Send reminder 1 day before

**[Schedule Audit]** [Save as Template] [Cancel]

---

## 3. ACTIVE AUDITS

### Current Active Audit: CPD Compliance Audit

**Audit Header:**
```
CPD COMPLIANCE AUDIT
Audit ID: AUD-2024-012
Status: ⏳ IN PROGRESS (40% Complete)

Started: 10/12/2024
Target Completion: 20/12/2024 (5 days remaining)
Lead Auditor: Thandiwe Mkhize (Compliance Officer)
Audit Team: Compliance Officer, 1 Staff Member

Objective: Verify CPD compliance across all representatives for 2024/2025 cycle
```

### Audit Progress

**Audit Checklist (Interactive):**

**Phase 1: Planning & Preparation**
- ✅ Define audit scope and objectives (10/12/2024)
- ✅ Assign audit team (10/12/2024)
- ✅ Prepare audit checklist (10/12/2024)
- ✅ Notify stakeholders (10/12/2024)

**Phase 2: Data Collection**
- ✅ Extract CPD data from system (11/12/2024)
- ✅ Review CPD tracking logs (12/12/2024)
- ⏳ Interview representatives (50% complete)
- ⏳ Review certificates and evidence (60% complete)
- 📋 Verify ethics requirements (pending)

**Phase 3: Analysis & Evaluation**
- ⏳ Analyze compliance rates (30% complete)
- 📋 Identify gaps and issues (pending)
- 📋 Assess risk exposure (pending)
- 📋 Compare to previous audits (pending)

**Phase 4: Reporting**
- 📋 Draft audit findings (pending)
- 📋 Develop recommendations (pending)
- 📋 Prepare final report (pending)
- 📋 Present to FSP Owner (pending)

**Phase 5: Follow-Up**
- 📋 Assign corrective actions (pending)
- 📋 Set deadlines (pending)
- 📋 Schedule follow-up review (pending)

**Overall Progress: 40%**

### Audit Findings (Preliminary)

**Findings Identified (3):**

**Finding 1: MEDIUM**
```
Finding ID: FIND-2024-012-001
Category: CPD Compliance
Severity: Medium
Status: Draft

Finding:
3 representatives behind expected CPD progress for current cycle period.
Representatives have logged <60% of required hours with 167 days remaining.

Evidence:
• David Koopman: 6/18 hours (33%)
• Sarah Naidoo: 11/18 hours (61%) + ethics not met
• Kagiso Mokoena: 10/18 hours (56%)

Impact:
Potential non-compliance if representatives don't complete requirements by May 31, 2025.

Recommendation:
1. Immediate intervention for David Koopman
2. Monthly progress monitoring for all three
3. Automated reminder system for representatives <70% progress

Assigned To: Compliance Officer
Target Resolution: 31/01/2025

[Edit Finding] [Add Evidence] [Mark Final]
```

**Finding 2: LOW**
```
Finding ID: FIND-2024-012-002
Category: Documentation
Severity: Low
Status: Draft

Finding:
5 representatives have CPD certificates not yet uploaded to system, though activities are logged.

Evidence:
• 5 representatives with logged activities lacking certificate uploads
• Certificates exist but not filed digitally

Impact:
Minor documentation gap. No compliance risk but could cause delays in FSCA inspection.

Recommendation:
Request certificate uploads from affected representatives within 14 days.

Assigned To: Admin Staff
Target Resolution: 31/12/2024

[Edit Finding] [Add Evidence] [Mark Final]
```

**Finding 3: OBSERVATION**
```
Finding ID: FIND-2024-012-003
Category: Process Improvement
Severity: Observation
Status: Draft

Finding:
CPD tracking system lacks automated alerts for representatives approaching deadlines.
Reminders are manual and inconsistent.

Impact:
Increases risk of representatives missing deadlines due to lack of proactive monitoring.

Recommendation:
Implement automated alert system:
• 90-day alert if <75% complete
• 60-day alert if <60% complete
• 30-day alert if <50% complete

Assigned To: System Administrator
Target Resolution: 31/03/2025

[Edit Finding] [Add Evidence] [Mark Final]
```

**[Add New Finding]** [Generate Preliminary Report] [Update Progress]

### Audit Documents

**Documents Collected:**
- CPD tracking report (15/12/2024)
- Representative interview notes (12/12/2024)
- Certificate review checklist (13/12/2024)
- Previous audit comparison (11/12/2024)

**[Upload Document]** [View All Documents]

### Audit Notes

**Auditor Notes (Chronological):**

```
15/12/2024 14:30 - Compliance Officer
Completed review of 8/12 representative files. Overall compliance good.
3 representatives identified as behind schedule. Meeting scheduled with David Koopman for tomorrow.

14/12/2024 10:15 - Compliance Officer
Interviewed 6 representatives about CPD planning. Most are on track but some lack awareness of ethics requirement minimum.
Recommendation: Better communication of CPD requirements at start of cycle.

12/12/2024 15:45 - Admin Staff
Certificate upload process reviewed. 5 representatives missing digital copies though physical certificates verified.
Action: Email sent requesting uploads by 31/12/2024.

[Add Note]
```

---

## 4. FINDINGS & ACTIONS

### Open Findings (3)

**Filter Options:**
- Severity: [All / Critical / High / Medium / Low / Observation]
- Status: [All / Open / In Progress / Resolved / Closed]
- Category: [All / CPD / F&P / FICA / Documents / Representatives / Other]
- Date Range: [Last 30 days / 90 days / 12 months / All time]

**Sort:** [By Severity] [By Date] [By Assigned]

### Findings List

**HIGH SEVERITY FINDING (1):**

```
🚨 HIGH - FINDING #FIND-2024-011-003
FICA Verification Backlog - 6 Clients >30 Days

Audit: Quarterly Compliance Audit (30/11/2024)
Category: FICA Verification
Severity: High
Date Raised: 30/11/2024
Days Open: 15 days
Status: ⏳ IN PROGRESS

Finding Description:
6 clients have FICA verifications pending for >30 days, creating regulatory risk.
Some clients have been pending for up to 45 days.

Root Cause:
• Resource constraints in FICA verification team
• Backlog from October (increased new client onboarding)
• Manual verification process slow

Evidence:
• FICA tracking report (30/11/2024)
• Client verification log
• Resource allocation review

Regulatory Risk:
• FICA Act breach exposure
• Potential FSCA inspection finding
• Fines up to R10M under Section 45

Impact Assessment:
High - Immediate action required to prevent regulatory breach

Recommended Actions:
1. Immediate: Prioritize 3 highest-risk clients
2. Short-term: Allocate additional resources
3. Long-term: Improve FICA verification process

Corrective Actions Assigned: 2 (1 complete, 1 in progress)
Target Resolution: 31/12/2024

[View Details] [Add Action] [Update Status] [Close Finding]
```

**MEDIUM SEVERITY FINDINGS (2):**

```
⚠️ MEDIUM - FINDING #FIND-2024-012-001
CPD Progress - 3 Representatives Behind Schedule

[Details as shown in Active Audits section]
Status: Draft (Preliminary from current audit)

[View Details] [Finalize Finding]
```

```
⚠️ MEDIUM - FINDING #FIND-2024-010-002
Document Retention - 15 Expired Documents Not Archived

Audit: Document Management Audit (30/11/2024)
Category: Document Management
Severity: Medium
Date Raised: 30/11/2024
Days Open: 15 days
Status: ⏳ IN PROGRESS

Finding:
15 documents that expired in September 2024 not moved to archive folder.
Documents still in active filing system.

Impact:
Low compliance risk but affects organization and audit readiness.

Recommended Action:
Archive expired documents and update filing procedures.

Corrective Action: Assigned to Admin Staff (Due: 20/12/2024)
Status: 90% Complete

[View Details] [Update Status]
```

### Corrective Actions

**Active Corrective Actions (2):**

**Action 1:**
```
CORRECTIVE ACTION #CA-2024-011-003-A
Related Finding: FICA Verification Backlog (FIND-2024-011-003)

Action: Complete FICA verification for 3 high-priority clients
Assigned To: Linda Zwane (FICA Officer)
Due Date: 20/12/2024
Priority: High
Status: ⏳ IN PROGRESS (67% complete)

Action Steps:
✅ Step 1: Prioritize 3 clients (30/11/2024)
✅ Step 2: Request missing documents (01/12/2024)
⏳ Step 3: Complete verifications (2/3 done)
📋 Step 4: Update system records

Progress Updates:
• 15/12/2024: 2 of 3 clients verified (John Ndlovu, Sarah Thompson)
• 13/12/2024: Documents received from 2 clients
• 01/12/2024: Document requests sent

[Update Progress] [Mark Complete] [Request Extension]
```

**Action 2:**
```
CORRECTIVE ACTION #CA-2024-010-002-A
Related Finding: Expired Documents Not Archived (FIND-2024-010-002)

Action: Archive all expired documents and update procedures
Assigned To: Admin Staff
Due Date: 20/12/2024
Priority: Medium
Status: ⏳ IN PROGRESS (90% complete)

Action Steps:
✅ Step 1: Identify all expired documents (30/11/2024)
✅ Step 2: Create archive folders (05/12/2024)
✅ Step 3: Move documents to archive (13/12/2024 - 13/15 done)
⏳ Step 4: Update filing procedures (draft ready)
📋 Step 5: Train staff on new procedures

Progress Updates:
• 15/12/2024: 13/15 documents archived, procedures drafted
• 10/12/2024: Archive structure created
• 05/12/2024: Document inventory completed

[Update Progress] [Mark Complete]
```

**[Add Corrective Action]** [View Completed Actions] [Generate Action Report]

### Findings Trend Analysis

**Findings by Category (Last 12 Months):**

| Category | Critical | High | Medium | Low | Total |
|----------|----------|------|--------|-----|-------|
| CPD Compliance | 0 | 0 | 3 | 2 | 5 |
| FICA Verification | 0 | 2 | 1 | 1 | 4 |
| Document Management | 0 | 0 | 2 | 3 | 5 |
| Fit & Proper | 0 | 0 | 1 | 0 | 1 |
| Representatives | 0 | 0 | 0 | 1 | 1 |
| Complaints | 0 | 0 | 0 | 0 | 0 |
| **TOTAL** | **0** | **2** | **7** | **7** | **16** |

**Key Observations:**
- No critical findings in 12 months ✅
- Most findings are medium/low severity
- FICA and documents most common areas
- Complaints: Zero findings (excellent)

**Resolution Statistics:**
- Total findings (12 months): 16
- Resolved: 13 (81%)
- Open: 3 (19%)
- Average resolution time: 18 days
- Overdue findings: 0

---

## 5. FSCA INSPECTIONS

### FSCA Inspection History

**Last FSCA Inspection:**
```
FSCA ON-SITE INSPECTION
Date: 15/08/2023
Duration: 3 days
Inspection Type: Routine compliance inspection
Lead Inspector: FSCA Inspector [Name]
Reference: FSCA-2023-INS-0847

Outcome: ✅ NO MAJOR FINDINGS
Overall Assessment: Satisfactory

Findings:
• 0 Critical findings
• 0 High-priority findings
• 2 Minor observations (both resolved)
• Recommendations: 3 (all implemented)

Status: CLOSED (No follow-up required)
Final Report: [Download Report]
```

**Previous Inspections:**

| Date | Type | Duration | Outcome | Findings | Status |
|------|------|----------|---------|----------|--------|
| 15/08/2023 | Routine | 3 days | Satisfactory | 0 major | ✅ Closed |
| 22/03/2021 | Routine | 2 days | Satisfactory | 1 minor | ✅ Closed |
| 10/09/2019 | Follow-up | 1 day | Satisfactory | 0 | ✅ Closed |
| 15/05/2019 | Routine | 3 days | Requires improvement | 3 moderate | ✅ Closed |

### Inspection Preparedness Checklist

**FSCA Inspection Readiness Assessment:**

**Category 1: FSP Documentation (100% Complete)**
- ✅ FSP License (current and valid)
- ✅ Business Plan (updated within 12 months)
- ✅ Compliance Manual (current version)
- ✅ Risk Management Framework
- ✅ FAIS Act Policies & Procedures
- ✅ FICA Policies & Procedures
- ✅ POPIA Compliance Documentation

**Category 2: Representative Files (100% Complete)**
- ✅ Representative Register (all current)
- ✅ Fit & Proper Declarations (all signed)
- ✅ CPD Records (current cycle)
- ✅ Supervision Agreements (all executed)
- ✅ Employment/Appointment Contracts
- ✅ Debarment Checks (all conducted)
- ✅ FICA Verifications (all compliant)

**Category 3: Client Records (95% Complete)**
- ✅ Client Register (up-to-date)
- ✅ FICA Verification Records (95% complete)
- ⏳ Needs Advice Records (some missing - in progress)
- ✅ Suitability Assessments
- ✅ Product Disclosure Documents
- ✅ Client Communications Log

**Category 4: Compliance Records (100% Complete)**
- ✅ Complaints Register (current)
- ✅ Internal Audit Reports (last 3 years)
- ✅ Risk Assessments (current)
- ✅ Training Records
- ✅ Board/Management Meeting Minutes
- ✅ Compliance Officer Reports

**Category 5: Financial Records (100% Complete)**
- ✅ Financial Statements (last 3 years)
- ✅ Trust Account Records (if applicable)
- ✅ Professional Indemnity Insurance (current)
- ✅ Fidelity Insurance (current)
- ✅ Capital Adequacy Records

**Overall Readiness: 99% (Excellent)**

**Areas Needing Attention:**
- ⚠️ Some Needs Advice Records incomplete (10 records missing signatures)
- Target: Complete by 31/12/2024

**[Generate Full Checklist]** [Schedule Mock Inspection] [Export Readiness Report]

### Mock Inspection Planning

**Schedule Internal Mock Inspection:**

**Mock Inspection Details:**
- Inspection Date: [Date picker]
- Duration: [1 day / 2 days / 3 days]
- Inspection Type: [Full FSP Inspection / Targeted Review]

**Scope:**
- [ ] FSP documentation review
- [ ] Representative files review
- [ ] Client files review (sample)
- [ ] Compliance records review
- [ ] Systems & processes review
- [ ] Interviews with key personnel

**Mock Inspection Team:**
- Lead Auditor: [Select]
- Team Members: [Multi-select]
- External Consultant: [ ] Yes / [ ] No

**Objectives:**
- Identify gaps before real FSCA inspection
- Test inspection response procedures
- Train staff on inspection protocols
- Improve documentation organization

**[Schedule Mock Inspection]** [View Previous Mock Inspections]

### Inspection Response Procedures

**FSCA Inspection Protocol:**

**Phase 1: Notification (Day 1)**
1. Log inspection notice
2. Alert FSP Owner and Compliance Officer
3. Notify all key personnel
4. Confirm inspection date/time
5. Prepare inspection room

**Phase 2: Preparation (Days 2-7)**
1. Review readiness checklist
2. Organize all documentation
3. Brief all staff on procedures
4. Assign staff responsibilities
5. Conduct final document review
6. Prepare document index

**Phase 3: During Inspection**
1. Designated contact person present at all times
2. Log all document requests
3. Track inspector activities
4. Take notes on all discussions
5. Coordinate document provision
6. Daily debrief with team

**Phase 4: Post-Inspection**
1. Document all findings immediately
2. Acknowledge any issues raised
3. Develop corrective action plan
4. Submit required responses
5. Implement corrective actions
6. Schedule follow-up audits

**[View Full Protocol]** [Download PDF]

---

## 6. AUDIT HISTORY

### Historical Audits

**Filter Options:**
- Audit Type: [All / Internal / External / FSCA]
- Date Range: [Last 6 months / 12 months / 3 years / All time]
- Compliance Area: [All categories]
- Status: [All / Complete / In Progress / Cancelled]

**Completed Audits (Last 12 Months):**

| Date | Audit Name | Type | Lead Auditor | Compliance Score | Findings | Status |
|------|------------|------|--------------|------------------|----------|--------|
| 30/11/2024 | Q4 Compliance Audit | Internal | Compliance Officer | 94/100 | 3 minor | ✅ Complete |
| 15/11/2024 | F&P Documentation Review | Internal | Compliance Officer | 98/100 | 0 | ✅ Complete |
| 15/10/2024 | Monthly Compliance Check | Internal | Compliance Officer | 95/100 | 1 minor | ✅ Complete |
| 30/09/2024 | Q3 Compliance Audit | Internal | Compliance Officer | 95/100 | 2 minor | ✅ Complete |
| 15/09/2024 | Document Retention Audit | Internal | Admin Staff | 96/100 | 2 minor | ✅ Complete |
| 15/08/2024 | Representative Files Audit | Internal | Compliance Officer | 94/100 | 1 minor | ✅ Complete |
| 30/06/2024 | Q2 Compliance Audit | Internal | Compliance Officer | 93/100 | 3 minor | ✅ Complete |
| 01/06/2024 | CPD Cycle Review | Internal | Compliance Officer | 92/100 | 2 minor | ✅ Complete |

**[View All Audits (48)]** [Export History] [Comparative Analysis]

### Audit Details View

**Selected Audit: Q4 Compliance Audit (30/11/2024)**

```
AUDIT REPORT: Q4 2024 COMPLIANCE AUDIT
Audit ID: AUD-2024-011
Audit Date: 30/11/2024
Lead Auditor: Thandiwe Mkhize (Compliance Officer)
Audit Team: Compliance Officer, FICA Officer, Admin Staff

Audit Scope:
Comprehensive review of all compliance areas including:
• Fit & Proper status (all representatives)
• CPD compliance (2024/2025 cycle progress)
• FICA verification status
• Document management and retention
• Complaints handling
• Representative supervision structure

OVERALL COMPLIANCE SCORE: 94/100

Category Scores:
• Fit & Proper: 98/100 ✅
• CPD Compliance: 92/100 ✅
• FICA Verification: 93/100 ✅
• Document Management: 96/100 ✅
• Complaints: 100/100 ✅
• Representatives: 94/100 ✅

FINDINGS: 3 (All Minor)

Finding 1: FICA Backlog - 6 clients >30 days (HIGH)
Finding 2: Document Archiving - 15 expired docs not archived (MEDIUM)
Finding 3: CPD Tracking - Manual alerts (OBSERVATION)

STRENGTHS IDENTIFIED:
• Excellent Fit & Proper compliance (100% current)
• Strong complaints management (zero open complaints)
• Well-organized document system
• Effective representative supervision
• Good FICA compliance rate (95%)

AREAS FOR IMPROVEMENT:
• FICA verification process (resource allocation)
• Document archiving procedures
• Automated CPD tracking and alerts

RECOMMENDATIONS:
1. Allocate additional FICA verification resources
2. Implement automated document archiving
3. Deploy automated CPD reminder system
4. Continue quarterly audit schedule
5. Maintain strong complaints management

CORRECTIVE ACTIONS: 3 assigned
Target Completion: 31/12/2024

NEXT AUDIT: Q1 2025 - Scheduled 31/03/2025

[Download Full Report] [View Findings] [View Actions] [Compare to Previous]
```

### Audit Comparison Tool

**Compare Audits:**

**Select Audits to Compare:**
- Audit 1: [Dropdown: Q4 2024 - 30/11/2024]
- Audit 2: [Dropdown: Q3 2024 - 30/09/2024]

**[Generate Comparison]**

**Comparison Report:**

| Metric | Q4 2024 | Q3 2024 | Change |
|--------|---------|---------|--------|
| Overall Score | 94 | 95 | -1 ↓ |
| Fit & Proper | 98 | 97 | +1 ↑ |
| CPD Compliance | 92 | 94 | -2 ↓ |
| FICA | 93 | 96 | -3 ↓ |
| Documents | 96 | 95 | +1 ↑ |
| Complaints | 100 | 100 | 0 → |
| Representatives | 94 | 95 | -1 ↓ |
| Total Findings | 3 | 2 | +1 ↑ |

**Key Changes:**
- ↓ FICA score decreased due to backlog
- ↑ Fit & Proper improved (all renewals current)
- → Complaints remains perfect

---

## 7. REPORTS

### Pre-Built Reports

**Report 1: Comprehensive Audit Summary**
- Description: Complete audit overview for management
- Includes: All audits, scores, findings, trends
- Format: PDF (Executive Summary), Excel (Detailed)
- Frequency: Quarterly
- Last Generated: 30/11/2024
- [Generate Now] [Schedule] [Email to FSP Owner]

**Report 2: FSCA Inspection Readiness Report**
- Description: Detailed inspection preparedness assessment
- Includes: Checklist completion, gaps, action plan
- Format: PDF
- Frequency: Bi-annual
- Last Generated: 30/09/2024
- [Generate Now] [Schedule]

**Report 3: Findings & Corrective Actions Report**
- Description: All findings and action status
- Includes: Open findings, action progress, resolutions
- Format: PDF, Excel
- Frequency: Monthly
- Last Generated: 30/11/2024
- [Generate Now] [Schedule]

**Report 4: Compliance Trend Analysis**
- Description: Historical compliance score trends
- Includes: Score trends, category analysis, forecasts
- Format: PowerPoint, PDF
- Frequency: Quarterly
- Last Generated: 30/09/2024
- [Generate Now]

**Report 5: Audit Activity Log**
- Description: Complete audit activity history
- Includes: All audits, actions, dates, outcomes
- Format: Excel, CSV
- Frequency: On-demand
- [Generate Now]

### Custom Report Builder

**[Same structure as other modules]**

---

## ROLE-BASED ACCESS CONTROL

### FSP Owner / Principal
- **Access:** Full access to all audit functions
- **Actions:** View all audits, approve audit schedules, review findings, assign actions, approve corrective actions
- **Reports:** All audit reports, FSCA inspection reports

### Key Individual
- **Access:** View audits related to supervised representatives
- **Actions:** View findings, implement corrective actions (supervised area)
- **Reports:** Representative audit reports (supervised team)

### Compliance Officer
- **Access:** Full access to all audit functions (primary user)
- **Actions:** Conduct audits, create findings, assign corrective actions, manage FSCA inspections, generate reports
- **Reports:** All audit reports, analytics

### Representative
- **Access:** View own audit results only
- **Actions:** View findings related to own compliance, complete assigned corrective actions, provide evidence
- **Reports:** Personal compliance reports only

### Admin Staff
- **Access:** Limited to assigned audit support tasks
- **Actions:** Assist with document collection, update audit progress (assigned tasks only)
- **Reports:** Standard reports only

### External Auditor (Optional)
- **Access:** Read-only access to audit records
- **Actions:** Conduct external audits (when engaged), view history
- **Reports:** All reports (read-only)

---

## API ENDPOINTS

### GET /api/audits
**Returns audit list**

### GET /api/audits/:id
**Returns detailed audit information**

### POST /api/audits
**Create new audit**

### PUT /api/audits/:id
**Update audit**

### GET /api/audits/:id/findings
**Returns findings for specific audit**

### POST /api/audits/findings
**Create new finding**

### PUT /api/audits/findings/:id
**Update finding**

### GET /api/audits/corrective-actions
**Returns corrective actions**

### POST /api/audits/corrective-actions
**Create corrective action**

### PUT /api/audits/corrective-actions/:id
**Update corrective action progress**

### GET /api/audits/compliance-score
**Returns current compliance score**

### GET /api/audits/fsca-inspections
**Returns FSCA inspection history**

### GET /api/audits/statistics
**Returns audit statistics and trends**

---

## SAMPLE DATA

**[20+ sample audits with realistic findings, scores, timelines]**

---

## VALIDATION RULES

### Compliance Score Calculation
- Overall score = weighted average of category scores
- Categories weighted by importance
- Score range: 0-100
- Rating: <60 Poor, 60-79 Fair, 80-89 Good, 90-95 Very Good, 96-100 Excellent

### Finding Severity
- Critical: Regulatory breach, immediate action required
- High: Significant compliance risk, urgent action
- Medium: Moderate compliance gap, action required
- Low: Minor issue, improvement recommended
- Observation: Process improvement opportunity

### Audit Status
- Scheduled: Future audit
- In Progress: Currently conducting
- Complete: Audit finished, report issued
- Cancelled: Audit cancelled with reason

---

## INTEGRATION POINTS

### Depends On:
- **All Compliance Modules:** Data sources for audits
- **User Management:** Auditor assignments

### Integrates With:
- **Risk & Alerts Dashboard:** Audit findings feed risk score
- **Compliance Dashboard:** Audit results displayed
- **All Modules:** Audit coverage across FSP

### Triggers:
- Auto-schedules quarterly audits
- Generates compliance scores
- Creates alerts for overdue actions
- Notifies stakeholders of findings

---

## REGULATORY REFERENCES

- **FAIS Act Section 17:** Compliance Officer functions
- **FSCA Guidance:** On-site inspections
- **FAIS General Code of Conduct:** Compliance requirements
- **Record Retention:** 5-year requirement

---

## MOBILE RESPONSIVENESS
- Stack cards vertically <768px
- Collapsible audit details
- Touch-friendly checklists
- Swipeable audit cards
- Mobile-optimized reports

---

## ACCESSIBILITY
- WCAG 2.1 AA compliance
- Keyboard navigation for checklists
- Screen reader support
- Clear audit status indicators

---

## PERFORMANCE REQUIREMENTS
- Dashboard load: <2 seconds
- Audit list load: <1 second
- Report generation: <10 seconds
- Finding search: <500ms

---

## ERROR HANDLING

**No Audits Scheduled:**
```
ℹ️ No audits scheduled in the next 90 days.
Consider scheduling regular compliance audits.
[Schedule Audit]
```

**Audit Data Not Available:**
```
⚠️ Unable to load audit data.
Please refresh or contact support.
[Retry] [Contact Support]
```

---

## TESTING SCENARIOS

1. Complete audit lifecycle (schedule to completion)
2. Finding creation and corrective action workflow
3. FSCA inspection preparedness assessment
4. Mock inspection execution
5. Audit comparison and trending
6. Multi-auditor collaboration
7. Report generation (all formats)

---

## DEPLOYMENT CHECKLIST

- [ ] API endpoints tested
- [ ] Compliance scoring validated
- [ ] Finding workflows tested
- [ ] FSCA checklist verified
- [ ] Integration with all modules confirmed
- [ ] Report templates tested
- [ ] Role-based access verified
- [ ] Sample data loaded
- [ ] Mobile responsiveness checked

---

**END OF CURSOR PROMPT**
