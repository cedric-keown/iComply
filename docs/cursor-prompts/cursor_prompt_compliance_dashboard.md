# CURSOR PROMPT: COMPLIANCE DASHBOARD & MONITORING MODULE
============================================================

Create a fully functional, realistic HTML mockup for the Compliance Dashboard & Monitoring module of a South African FAIS broker compliance portal. This module serves as the central hub for the Compliance Officer (as required by FAIS Act Section 17) and provides executive oversight of all compliance activities across the FSP.

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

---

## ROLE-BASED ACCESS CONTROL

### FSP Owner / Principal
- **Access:** Full access to all compliance monitoring features
- **Dashboard View:** Executive-level compliance overview
- **Actions:** View all, create alerts, schedule audits, assign compliance tasks
- **Reports:** Full access to all compliance reports

### Key Individual
- **Access:** Full access to supervised representatives' compliance
- **Dashboard View:** Filtered to supervised representatives
- **Actions:** View, create alerts for supervised reps, schedule reviews
- **Reports:** Compliance reports for supervised team only

### Compliance Officer
- **Access:** Full access to all compliance functions (primary user)
- **Dashboard View:** Comprehensive compliance workspace
- **Actions:** All compliance actions, create/manage alerts, conduct audits, manage FSCA communications
- **Reports:** All compliance reports, FSCA submissions

### Representative
- **Access:** Read-only view of own compliance status
- **Dashboard View:** Personal compliance dashboard only
- **Actions:** View own status, upload supporting documents
- **Reports:** None

### Admin Staff
- **Access:** No access to Compliance Dashboard
- **Dashboard View:** None
- **Actions:** None
- **Reports:** None

---

## MODULE STRUCTURE

### Top Navigation Tabs
- Compliance Dashboard (default)
- Alerts & Notifications
- Compliance Checks
- Internal Audits
- FSCA Communications
- TCF Monitoring

### Left Sidebar: Quick Navigation (Collapsible on mobile)
- **Overview**
  - Health Score
  - Critical Issues
  - Action Items
  - Recent Activity
- **By Compliance Area**
  - Fit & Proper (status)
  - CPD Compliance (status)
  - FICA Compliance (status)
  - Documentation (status)
  - Insurance Coverage (status)
  - Supervision Ratios (status)
- **By Priority**
  - Critical (count)
  - High (count)
  - Medium (count)
  - Low (count)
- **Quick Actions**
  - Schedule Audit
  - Create Alert
  - Log Issue
  - Generate Report

---

## 1. COMPLIANCE DASHBOARD TAB (Default View)

### Page Header
- Title: "Compliance Dashboard"
- Subtitle: "ABC Financial Services (FSP 12345) - Overall Compliance Health"
- Last Updated: 15/12/2024 14:30 (Auto-refresh every 5 minutes)
- Buttons: 
  - [Primary] Schedule Audit
  - [Success] Generate Report
  - [Info] Export to PDF
  - [Secondary] Settings (gear icon)

---

### Section 1: Overall Health Score (Hero Section)

**Large Centered Card:**

**Compliance Health Score:**
- Large circular progress indicator (donut chart)
- Score: 87% (color-coded: 0-69% red, 70-84% amber, 85-100% green)
- Center text: "87% COMPLIANT"
- Subtitle: "Good Standing"

**Score Calculation Algorithm:**
```javascript
// Weighted average of all compliance areas
const weights = {
  fitAndProper: 0.25,    // 25%
  cpd: 0.25,             // 25%
  fica: 0.20,            // 20%
  documentation: 0.15,   // 15%
  insurance: 0.10,       // 10%
  other: 0.05            // 5%
};

// Example calculation
const scores = {
  fitAndProper: 0.92,    // 92% compliant (11/12 reps)
  cpd: 0.75,             // 75% compliant (9/12 reps)
  fica: 0.88,            // 88% compliant (580/660 clients)
  documentation: 0.95,   // 95% compliant
  insurance: 1.00,       // 100% compliant
  other: 0.90            // 90% compliant
};

const healthScore = Math.round(
  (scores.fitAndProper * weights.fitAndProper) +
  (scores.cpd * weights.cpd) +
  (scores.fica * weights.fica) +
  (scores.documentation * weights.documentation) +
  (scores.insurance * weights.insurance) +
  (scores.other * weights.other)
) * 100;
// Result: 87%
```

**Trend Indicator:**
- Arrow icon: ↑ +3% vs last month (green)
- Text: "Improving"

**Breakdown Meters (Below main score):**
- Fit & Proper: 92% (green bar) - 11/12 compliant
- CPD: 75% (amber bar) - 9/12 compliant
- FICA: 88% (green bar) - 580/660 clients
- Documentation: 95% (green bar) - 850/895 current
- Insurance: 100% (green bar) - All policies current

---

### Section 2: Critical Issues & Alerts (High Visibility)

**Four Summary Cards (Row of 4 cards):**

**Card 1: Critical Issues**
- Icon: 🔴 (large, pulsing animation)
- Number: 1
- Label: "CRITICAL"
- Sublabel: "Requires immediate action"
- Border: Red, thick
- Background: Light red tint
- Click to filter issues

**Card 2: High Priority**
- Icon: 🟠
- Number: 3
- Label: "HIGH PRIORITY"
- Sublabel: "Resolve within 7 days"
- Border: Orange
- Background: Light orange tint
- Click to filter issues

**Card 3: Medium Priority**
- Icon: 🟡
- Number: 5
- Label: "MEDIUM PRIORITY"
- Sublabel: "Resolve within 30 days"
- Border: Yellow
- Background: Light yellow tint
- Click to filter issues

**Card 4: Low Priority**
- Icon: 🟢
- Number: 8
- Label: "LOW PRIORITY"
- Sublabel: "Resolve within 90 days"
- Border: Green
- Background: Light green tint
- Click to filter issues

---

### Section 3: Issues & Action Items (Main Content Area)

**Tab Sub-Navigation:**
- Active Issues (17)
- Action Items (12)
- Resolved (45)
- All (74)

**Filter Bar:**
- Priority: [Dropdown: All | Critical | High | Medium | Low]
- Category: [Dropdown: All | Fit & Proper | CPD | FICA | Documents | Insurance | Other]
- Assigned To: [Dropdown: All | Me | Unassigned | Specific User]
- Due Date: [Dropdown: All | Overdue | This Week | This Month | Next 90 Days]
- Search: [Text input with icon]

**Sort By:**
- Priority (default)
- Due Date
- Created Date
- Category
- Assigned To

---

**Issues Table (Active Issues Tab):**

**Columns:**
| Priority | Issue | Category | Assigned To | Due Date | Status | Actions |

**Sample Row 1 (Critical):**
- Priority: 🔴 CRITICAL (red badge)
- Issue: "Mike Johnson's RE5 certificate expired 2 days ago"
- Category: Fit & Proper
- Assigned To: Sarah Naidoo (Compliance Officer)
- Due Date: 13/12/2024 (OVERDUE - red text)
- Status: In Progress
- Actions: 
  - [View Details] 
  - [Add Note]
  - [Resolve]
  - [...More]

**Sample Row 2 (High Priority):**
- Priority: 🟠 HIGH
- Issue: "45 FICA reviews overdue (> 5 years)"
- Category: FICA
- Assigned To: Compliance Team
- Due Date: 20/12/2024 (7 days remaining)
- Status: Assigned
- Actions: [View Details] [Add Note] [Reassign]

**Sample Row 3 (High Priority):**
- Issue: "Professional Indemnity insurance expires in 30 days"
- Category: Insurance
- Assigned To: Thabo Mokoena (FSP Owner)
- Due Date: 15/01/2025
- Status: In Progress (renewal quote requested)

**Sample Row 4 (Medium Priority):**
- Issue: "3 representatives behind on CPD (< 50% complete with 6 months left)"
- Category: CPD
- Assigned To: Sarah Naidoo
- Due Date: 31/05/2025 (167 days remaining)
- Status: Monitoring

**Sample Row 5 (Medium Priority):**
- Issue: "Quarterly FSCA return submission due"
- Category: FSCA Compliance
- Assigned To: Compliance Officer
- Due Date: 31/01/2025
- Status: Not Started

**Bulk Actions:**
- [Select All] checkbox
- Assign Selected
- Change Priority
- Set Due Date
- Export to Excel

---

### Section 4: Compliance by Area (Visual Breakdown)

**Six Cards (2 rows × 3 columns on desktop):**

**Card 1: Fit & Proper**
- Icon: 🎓
- Status: 92% Compliant (green)
- Progress bar: 11/12 representatives
- Details:
  - ✅ RE5 Current: 11
  - ✅ RE1 Current: 11
  - ✅ Background Checks: 12
  - ❌ Issues: 1 (Mike Johnson - RE5 expired)
- Quick Actions:
  - [View All]
  - [Run Check]
  - [Generate Report]

**Card 2: CPD Compliance**
- Icon: 📚
- Status: 75% Compliant (amber)
- Progress bar: 9/12 representatives
- Details:
  - ✅ Completed (18+ hours): 9
  - ⚠️ In Progress (10-17 hours): 2
  - ❌ At Risk (< 10 hours): 1
  - 📅 Days to Deadline: 167
- Quick Actions:
  - [View Progress]
  - [Send Reminders]
  - [CPD Report]

**Card 3: FICA Compliance**
- Icon: 🔍
- Status: 88% Compliant (green)
- Progress bar: 580/660 clients
- Details:
  - ✅ Current: 580 clients
  - ⚠️ Reviews Due (30 days): 35
  - ❌ Overdue: 45
  - 🔴 High Risk: 25 (all current)
- Quick Actions:
  - [View Reviews]
  - [Schedule Reviews]
  - [FICA Report]

**Card 4: Documentation**
- Icon: 📁
- Status: 95% Compliant (green)
- Progress bar: 850/895 current
- Details:
  - ✅ Current: 850 documents
  - ⚠️ Expiring (90 days): 30
  - ❌ Expired: 15
  - 📦 Retention Compliant: 100%
- Quick Actions:
  - [View Documents]
  - [Upload]
  - [Retention Report]

**Card 5: Insurance Coverage**
- Icon: 🛡️
- Status: 100% Compliant (green)
- Progress bar: Full
- Details:
  - ✅ Professional Indemnity: Current (expires 15/01/2025)
  - ✅ Fidelity Guarantee: Current (expires 28/02/2025)
  - ⚠️ PI Renewal Due: 31 days
  - ✅ Coverage: R5,000,000 (exceeds minimum)
- Quick Actions:
  - [View Policies]
  - [Upload Renewal]
  - [Insurance Report]

**Card 6: Supervision Ratios**
- Icon: 👥
- Status: 100% Compliant (green)
- Progress bar: Full
- Details:
  - Key Individuals: 3
  - Representatives: 12
  - Ratio: 1:4 (within 1:15 limit)
  - ✅ All reps supervised
- Quick Actions:
  - [View Hierarchy]
  - [Supervision Report]

---

### Section 5: Recent Compliance Activity (Timeline)

**Activity Feed (Last 7 days):**

**Entry 1:**
- Icon: 🟢 (green circle)
- Date: 15/12/2024 10:30
- User: Sarah Naidoo (Compliance Officer)
- Action: "Verified CPD certificate for Thabo Mokoena - 2.0 hours Ethics"
- Category: CPD
- [View Details]

**Entry 2:**
- Icon: 🟡 (amber circle)
- Date: 14/12/2024 15:45
- User: System (Automated)
- Action: "Alert created: 45 FICA reviews overdue"
- Category: FICA
- [View Alert]

**Entry 3:**
- Icon: 🔴 (red circle)
- Date: 13/12/2024 08:00
- User: System (Automated)
- Action: "Critical alert: Mike Johnson's RE5 expired"
- Category: Fit & Proper
- [View Alert] [Escalate]

**Entry 4:**
- Icon: 🟢
- Date: 12/12/2024 14:20
- User: Johan Smit (Key Individual)
- Action: "Completed internal audit: Q4 2024 FICA Compliance"
- Category: Internal Audit
- [View Audit Report]

**Entry 5:**
- Icon: 🟢
- Date: 11/12/2024 11:15
- User: Thabo Mokoena (FSP Owner)
- Action: "Approved new representative onboarding: Lisa van der Walt"
- Category: Representatives
- [View Profile]

**Entry 6:**
- Icon: 🟢
- Date: 10/12/2024 09:30
- User: Sarah Naidoo
- Action: "Submitted quarterly return to FSCA"
- Category: FSCA Communications
- [View Submission]

**Show More** button (load next 10)

---

### Section 6: Quick Statistics (Bottom Row)

**Four Metric Cards:**

**Card 1: Total Representatives**
- Number: 12
- Label: "Active Representatives"
- Change: +1 this month (green arrow)
- Sublabel: "11 compliant, 1 non-compliant"

**Card 2: Total Clients**
- Number: 660
- Label: "Active Clients"
- Change: +23 this quarter (green arrow)
- Sublabel: "580 FICA compliant"

**Card 3: Documents**
- Number: 895
- Label: "Total Documents"
- Change: +45 this week (green arrow)
- Sublabel: "850 current, 45 require action"

**Card 4: Open Complaints**
- Number: 2
- Label: "Active Complaints"
- Change: -1 this month (green arrow down)
- Sublabel: "Both within SLA"

---

## 2. ALERTS & NOTIFICATIONS TAB

### Page Header
- Title: "Alerts & Notifications"
- Subtitle: "Proactive compliance monitoring and escalation"
- Buttons:
  - [Primary] Create Custom Alert
  - [Success] Configure Alert Rules
  - [Info] Alert History
  - [Secondary] Export

---

### Alert Summary Cards (Top Row)

**Card 1: Active Alerts**
- Number: 17
- Icon: 🔔 (bell, animated)
- Breakdown:
  - 1 Critical
  - 3 High
  - 5 Medium
  - 8 Low

**Card 2: Due Today**
- Number: 3
- Icon: ⏰
- Sublabel: "Require action today"

**Card 3: Overdue**
- Number: 1
- Icon: ⚠️ (red)
- Sublabel: "Past due date"

**Card 4: Dismissed (7 days)**
- Number: 12
- Icon: ✓
- Sublabel: "Resolved this week"

---

### Alert Management Section

**Filter & Sort Bar:**
- Priority: [All | Critical | High | Medium | Low]
- Category: [All | CPD | FICA | Fit & Proper | Documents | Insurance | Other]
- Status: [All | Active | Acknowledged | Dismissed | Escalated]
- Assigned To: [All | Me | Unassigned | Specific User]
- Date Range: [Last 7 Days | Last 30 Days | Last 90 Days | Custom]

**Sort By:**
- Priority (default)
- Created Date
- Due Date
- Category

---

**Alerts Table:**

**Columns:**
| Priority | Alert | Category | Created | Due Date | Assigned To | Status | Actions |

**Sample Row 1 (Critical - Animated red background pulse):**
- Priority: 🔴 CRITICAL
- Alert: "Mike Johnson's RE5 certificate expired"
- Category: Fit & Proper
- Created: 13/12/2024 08:00 (2 days ago)
- Due Date: 13/12/2024 (OVERDUE)
- Assigned To: Sarah Naidoo (Compliance Officer)
- Status: Acknowledged (amber badge)
- Actions:
  - [View Details]
  - [Add Note]
  - [Escalate]
  - [Dismiss]

**Alert Detail Panel (Click to expand):**
- Full Description: "Representative Mike Johnson's RE5 certificate (issued 15/12/2019) expired on 13/12/2024. Representative cannot conduct business until certificate is renewed. Certificate number: RE5-2019-12345"
- Impact: "HIGH - Representative cannot advise clients. Potential FAIS Act contravention."
- Recommended Actions:
  1. Suspend representative immediately
  2. Contact FSCA for renewal process
  3. Notify affected clients
  4. Update FSCA register
- Related Documents:
  - Expired RE5 Certificate.pdf
  - Suspension Letter Template.docx
- Activity Log:
  - 13/12/2024 08:00: Alert created (System)
  - 13/12/2024 09:15: Acknowledged by Sarah Naidoo
  - 13/12/2024 10:30: Note added: "Contacted Mike, renewal exam scheduled 20/12"
  - 13/12/2024 14:45: Escalated to FSP Owner
- Add Note: [Textarea] [Attach File] [Save]

**Sample Row 2 (High Priority):**
- Alert: "45 FICA reviews overdue (> 5 years)"
- Category: FICA
- Created: 14/12/2024 15:45 (Yesterday)
- Due Date: 20/12/2024 (6 days)
- Assigned To: Compliance Team
- Status: Active (blue badge)

**Sample Row 3 (High Priority):**
- Alert: "Professional Indemnity insurance expires in 30 days"
- Category: Insurance
- Created: 15/12/2024 08:00 (Today)
- Due Date: 15/01/2025
- Assigned To: Thabo Mokoena (FSP Owner)
- Status: In Progress (amber badge)

**Sample Row 4 (Medium Priority):**
- Alert: "3 representatives behind on CPD schedule"
- Category: CPD
- Created: 01/12/2024
- Due Date: 31/05/2025
- Assigned To: Sarah Naidoo
- Status: Monitoring (blue badge)

---

### Create Custom Alert (Modal/Slide-in Panel)

**Form Fields:**

1. Alert Title (text) - REQUIRED
   - Max 200 characters
   - Example: "Compliance review meeting required"

2. Priority (radio buttons) - REQUIRED
   - ⚪ Critical (send immediately, SMS + email + in-app)
   - ⚪ High (send within 1 hour, email + in-app)
   - ⚪ Medium (send daily digest, in-app)
   - ⚪ Low (send weekly digest, in-app)

3. Category (dropdown) - REQUIRED
   - Fit & Proper
   - CPD
   - FICA
   - Documents
   - Insurance
   - Complaints
   - Internal Audit
   - FSCA Communications
   - Other

4. Description (rich text editor) - REQUIRED
   - Full description of the alert
   - Formatting: bold, italic, bullets, numbered lists
   - Max 2000 characters

5. Assign To (multi-select dropdown)
   - FSP Owner
   - Key Individuals (list)
   - Compliance Officer
   - Specific Representative (searchable list)
   - All Users

6. Due Date (date picker)
   - Cannot be in the past
   - Optional for Low priority
   - Required for Critical/High/Medium

7. Recommended Actions (textarea)
   - Optional
   - Bulleted list of suggested actions
   - Max 1000 characters

8. Attach Documents (file upload)
   - Drag & drop zone
   - Multiple files allowed
   - Max 10MB per file
   - Supported: PDF, DOCX, XLSX, JPG, PNG

9. Notification Channels (checkboxes)
   - ☑ In-app notification (always enabled)
   - ☑ Email notification
   - ☐ SMS notification (Critical only)
   - ☐ WhatsApp notification (future feature)

10. Recurrence (optional)
    - ⚪ One-time alert
    - ⚪ Recurring alert
    - If recurring:
      - Frequency: [Daily | Weekly | Monthly | Quarterly | Annually]
      - Repeat until: [Date picker or "Until dismissed"]

**Buttons:**
- [Primary] Create Alert
- [Secondary] Save as Draft
- [Link] Cancel

---

### Alert Rules Configuration (Automated Alerts)

**Automated Alert Rules:**

**Table of Configured Rules:**

**Columns:**
| Rule Name | Trigger Condition | Priority | Recipients | Channels | Status | Actions |

**Sample Rule 1:**
- Rule Name: "RE5 Certificate Expiring Soon"
- Trigger: Certificate expiry date <= 30 days
- Priority: High
- Recipients: Compliance Officer, Affected Representative
- Channels: Email, In-app
- Status: ✅ Active
- Actions: [Edit] [Disable] [Test]

**Sample Rule 2:**
- Rule Name: "RE5 Certificate Expired"
- Trigger: Certificate expiry date < today
- Priority: Critical
- Recipients: FSP Owner, Compliance Officer, Key Individual, Affected Representative
- Channels: SMS, Email, In-app
- Status: ✅ Active
- Actions: [Edit] [Disable] [Test]

**Sample Rule 3:**
- Rule Name: "CPD Progress Behind Schedule"
- Trigger: Hours completed < 50% AND days to deadline < 180
- Priority: Medium
- Recipients: Compliance Officer, Affected Representative
- Channels: Email, In-app
- Status: ✅ Active

**Sample Rule 4:**
- Rule Name: "FICA Review Overdue"
- Trigger: Last review date > 5 years (for low risk)
- Priority: High
- Recipients: Compliance Officer, Client Representative
- Channels: Email, In-app
- Status: ✅ Active

**Sample Rule 5:**
- Rule Name: "Insurance Policy Expiring"
- Trigger: Policy expiry date <= 90 days
- Priority: High
- Recipients: FSP Owner, Compliance Officer
- Channels: Email, In-app
- Status: ✅ Active

**Sample Rule 6:**
- Rule Name: "Complaint Deadline Approaching"
- Trigger: Days to 6-week deadline <= 7 days
- Priority: High
- Recipients: Assigned Complaint Handler, Compliance Officer
- Channels: Email, In-app
- Status: ✅ Active

**Sample Rule 7:**
- Rule Name: "Compliance Score Drops"
- Trigger: Overall compliance score < 85%
- Priority: High
- Recipients: FSP Owner, Compliance Officer
- Channels: Email, In-app
- Status: ✅ Active

**Add New Rule Button:**
- [Primary] Create Alert Rule

---

### Edit Alert Rule (Modal)

**Rule Configuration:**

1. Rule Name (text) - REQUIRED
2. Description (textarea)
3. Trigger Condition (complex builder)
   - Field: [Dropdown of available fields]
   - Operator: [= | ≠ | > | < | ≥ | ≤ | contains | does not contain]
   - Value: [Text or dropdown based on field]
   - [+ Add Condition] (for AND/OR logic)
4. Priority: [Critical | High | Medium | Low]
5. Recipients: [Multi-select]
6. Notification Channels: [Checkboxes]
7. Alert Template: [Rich text editor with variables]
   - Available variables: {{name}}, {{date}}, {{days_remaining}}, {{certificate_number}}, etc.
8. Frequency: [Once | Daily | Weekly | Monthly]
9. Active: [Toggle switch]

**Buttons:**
- [Primary] Save Rule
- [Secondary] Test Rule (sends test alert)
- [Danger] Delete Rule
- [Link] Cancel

---

## 3. COMPLIANCE CHECKS TAB

### Page Header
- Title: "Compliance Checks & Audits"
- Subtitle: "Schedule and conduct compliance assessments"
- Buttons:
  - [Primary] Schedule New Check
  - [Success] Run Quick Check
  - [Info] View History
  - [Secondary] Templates

---

### Check Type Cards (Top Row)

**Card 1: Quick Checks**
- Icon: ⚡
- Description: "Instant compliance status check"
- Run Time: < 1 minute
- Checks: Basic compliance status
- Button: [Run Now]

**Card 2: Detailed Audits**
- Icon: 🔍
- Description: "Comprehensive compliance audit"
- Run Time: 5-10 minutes
- Checks: Deep dive into all areas
- Button: [Schedule Audit]

**Card 3: Spot Checks**
- Icon: 🎯
- Description: "Random sample verification"
- Run Time: 2-5 minutes
- Checks: Random representatives/clients
- Button: [Run Spot Check]

**Card 4: Scheduled Checks**
- Icon: 📅
- Description: "Automated recurring checks"
- Next Run: Tomorrow 08:00
- Frequency: Daily
- Button: [Manage Schedule]

---

### Compliance Check Templates

**Pre-built Check Templates:**

**Template 1: Full Fit & Proper Audit**
- Description: "Comprehensive audit of all representatives' F&P status"
- Checks:
  - ✓ RE5 certificate validity (all reps)
  - ✓ RE1 certificate validity (all reps)
  - ✓ Class of Business authorizations
  - ✓ Training completion status
  - ✓ Background checks (criminal, credit, debarment)
  - ✓ Experience verification
  - ✓ Reference checks
- Estimated Time: 10 minutes
- Frequency: Monthly
- Button: [Run Check] [Schedule] [Customize]

**Template 2: CPD Compliance Check**
- Description: "Annual CPD cycle compliance verification"
- Checks:
  - ✓ Hours completed vs required (per rep)
  - ✓ Ethics hours (minimum 3 hours)
  - ✓ Technical hours balance
  - ✓ Certificate verification status
  - ✓ Provider accreditation
  - ✓ On-track projection to 31 May deadline
- Estimated Time: 5 minutes
- Frequency: Monthly
- Button: [Run Check] [Schedule] [Customize]

**Template 3: FICA Compliance Check**
- Description: "Client FICA verification status audit"
- Checks:
  - ✓ All clients have initial FICA (within 30 days of onboarding)
  - ✓ Reviews current based on risk level (1/3/5 years)
  - ✓ High-risk clients (annual reviews up to date)
  - ✓ PEP screening current
  - ✓ Sanctions screening current
  - ✓ Documentation complete (ID, POA, risk assessment)
- Estimated Time: 8 minutes
- Frequency: Weekly
- Button: [Run Check] [Schedule] [Customize]

**Template 4: Document Retention Check**
- Description: "5-year retention compliance verification"
- Checks:
  - ✓ All documents categorized correctly
  - ✓ Retention dates calculated
  - ✓ Documents within retention period
  - ✓ Eligible for deletion flagged
  - ✓ Legal hold documents protected
  - ✓ Storage limits monitored
- Estimated Time: 5 minutes
- Frequency: Monthly
- Button: [Run Check] [Schedule] [Customize]

**Template 5: Insurance Coverage Check**
- Description: "Professional Indemnity & Fidelity Guarantee verification"
- Checks:
  - ✓ PI policy current (not expired)
  - ✓ PI coverage meets minimum (R2 million)
  - ✓ FG policy current
  - ✓ FG coverage adequate
  - ✓ Certificates uploaded and valid
  - ✓ Renewal reminders set (90/60/30 days)
  - ✓ Premium payments current
- Estimated Time: 2 minutes
- Frequency: Monthly
- Button: [Run Check] [Schedule] [Customize]

**Template 6: Representative Supervision Check**
- Description: "Supervision ratio and oversight compliance"
- Checks:
  - ✓ Key Individual to Representative ratio (max 1:15)
  - ✓ All representatives assigned to KI
  - ✓ Supervision agreements signed
  - ✓ Regular supervision meetings logged
  - ✓ Supervision notes documented
- Estimated Time: 3 minutes
- Frequency: Quarterly
- Button: [Run Check] [Schedule] [Customize]

**Template 7: TCF Compliance Check**
- Description: "Treating Customers Fairly outcomes assessment"
- Checks:
  - ✓ Outcome 1: Culture of TCF in FSP
  - ✓ Outcome 2: Products designed to meet customer needs
  - ✓ Outcome 3: Clear product information
  - ✓ Outcome 4: Suitable advice given
  - ✓ Outcome 5: Products perform as expected
  - ✓ Outcome 6: No barriers to complaints/switching
- Estimated Time: 15 minutes
- Frequency: Quarterly
- Button: [Run Check] [Schedule] [Customize]

**Button:**
- [Success] Create Custom Template

---

### Recent Compliance Checks (Table)

**Columns:**
| Date/Time | Check Type | Conducted By | Overall Result | Issues Found | Report | Actions |

**Sample Row 1:**
- Date/Time: 15/12/2024 09:00
- Check Type: Quick Check - All Areas
- Conducted By: Sarah Naidoo (Compliance Officer)
- Overall Result: 87% (green badge) PASSED
- Issues Found: 5 (1 critical, 2 high, 2 medium)
- Report: [Download PDF] [View Online]
- Actions: [View Details] [Run Again] [Schedule Follow-up]

**Sample Row 2:**
- Date/Time: 10/12/2024 14:30
- Check Type: Full F&P Audit
- Conducted By: System (Scheduled)
- Overall Result: 92% (green) PASSED
- Issues Found: 1 (1 critical: Mike Johnson RE5 expired)
- Report: [Download PDF] [View Online]
- Actions: [View Details] [Run Again]

**Sample Row 3:**
- Date/Time: 05/12/2024 08:00
- Check Type: FICA Compliance Check
- Conducted By: Johan Smit (Key Individual)
- Overall Result: 88% (green) PASSED
- Issues Found: 45 (45 high: overdue reviews)
- Report: [Download PDF] [View Online]
- Actions: [View Details] [Create Remediation Plan]

**Sample Row 4:**
- Date/Time: 01/12/2024 10:15
- Check Type: CPD Compliance Check
- Conducted By: Sarah Naidoo
- Overall Result: 75% (amber) WARNING
- Issues Found: 3 (3 medium: reps behind schedule)
- Report: [Download PDF] [View Online]
- Actions: [View Details] [Send Reminders]

---

### Run Compliance Check (Process)

**Step 1: Select Check Type**
- Quick Check (basic status)
- Full Audit (comprehensive)
- Spot Check (random sample)
- Custom Check (select specific areas)

**Step 2: Select Scope**
- All Representatives
- Specific Representatives (multi-select)
- All Clients
- Specific Clients (filter by rep, risk level)
- All Documents
- Specific Document Categories

**Step 3: Configure Check**
- Check Name: [Text input]
- Include Historical Data: [Checkbox] Last 30 days | 90 days | 1 year
- Generate Report: [Checkbox - default ON]
- Email Report To: [Multi-select]
- Save as Template: [Checkbox]

**Step 4: Run Check**
- [Primary Button] Run Check Now
- [Secondary] Schedule for Later

**Progress Indicator:**
- Running Compliance Check...
- Progress bar: 45%
- Current Step: "Checking FICA compliance (350/660 clients)"
- Estimated Time: 3 minutes remaining

**Results Summary (After Completion):**
- Overall Score: 87% (color-coded badge)
- Total Checks: 1,247
- Passed: 1,085 (87%)
- Failed: 162 (13%)
- By Category:
  - Fit & Proper: 92% (green)
  - CPD: 75% (amber)
  - FICA: 88% (green)
  - Documents: 95% (green)
  - Insurance: 100% (green)
- Issues by Priority:
  - Critical: 1
  - High: 3
  - Medium: 5
  - Low: 8
- Buttons:
  - [Download Full Report PDF]
  - [Email Report]
  - [Create Action Plan]
  - [Schedule Follow-up Check]

---

## 4. INTERNAL AUDITS TAB

### Page Header
- Title: "Internal Audits"
- Subtitle: "Schedule and manage internal compliance audits"
- Buttons:
  - [Primary] Schedule Audit
  - [Success] View Audit Schedule
  - [Info] Audit Templates
  - [Secondary] Export Audit Log

---

### Audit Summary Cards

**Card 1: Scheduled Audits**
- Number: 4
- Icon: 📅
- Next Audit: 20/12/2024 (Q4 FICA Review)
- Button: [View Schedule]

**Card 2: In Progress**
- Number: 1
- Icon: ⏳
- Current: Q4 2024 Document Retention Audit
- Progress: 65%
- Button: [View Details]

**Card 3: Completed (This Year)**
- Number: 12
- Icon: ✅
- Latest: Q4 2024 FICA Compliance (10/12/2024)
- Button: [View Reports]

**Card 4: Findings (Open)**
- Number: 8
- Icon: 🔍
- Breakdown: 0 critical, 2 major, 6 minor
- Button: [View Findings]

---

### Audit Schedule (Calendar View)

**Month View Calendar:**
- Shows all scheduled audits
- Color-coded by audit type
- Click to view details or reschedule

**Upcoming Audits (List View):**

**Audit 1:**
- Date: 20/12/2024
- Type: FICA Compliance Review (Q4 2024)
- Scope: All clients (660 records)
- Auditor: Johan Smit (Key Individual)
- Estimated Duration: 2 hours
- Checklist: FICA_Q4_2024_Checklist.xlsx
- Status: Scheduled
- Actions: [View Details] [Reschedule] [Cancel]

**Audit 2:**
- Date: 15/01/2025
- Type: Annual CPD Compliance Audit
- Scope: All representatives (12)
- Auditor: Sarah Naidoo (Compliance Officer)
- Estimated Duration: 3 hours
- Checklist: CPD_Annual_Audit_Template.xlsx
- Status: Scheduled
- Actions: [View Details] [Reschedule] [Cancel]

**Audit 3:**
- Date: 31/01/2025
- Type: Fit & Proper Annual Review
- Scope: All representatives (12)
- Auditor: Thabo Mokoena (FSP Owner)
- Estimated Duration: 4 hours
- Checklist: FitProper_Annual_Audit.xlsx
- Status: Scheduled

**Audit 4:**
- Date: 28/02/2025
- Type: Document Retention Compliance
- Scope: All documents (895 records)
- Auditor: System (Automated)
- Estimated Duration: 1 hour
- Checklist: Document_Retention_Check.xlsx
- Status: Scheduled

---

### Schedule New Audit (Modal/Page)

**Form Fields:**

1. Audit Name (text) - REQUIRED
   - Example: "Q1 2025 FICA Compliance Audit"

2. Audit Type (dropdown) - REQUIRED
   - FAIS Compliance
   - FICA Compliance
   - TCF Compliance
   - CPD Compliance
   - Fit & Proper Review
   - Document Retention
   - Financial Controls
   - IT Security & Data Protection
   - Complaints Handling
   - Custom Audit

3. Scheduled Date (date picker) - REQUIRED
4. Scheduled Time (time picker)
5. Estimated Duration (dropdown)
   - 1 hour | 2 hours | 3 hours | 4 hours | Full Day | Multiple Days

6. Auditor (dropdown) - REQUIRED
   - FSP Owner
   - Compliance Officer
   - Key Individual (list)
   - External Auditor
   - System (Automated)

7. Scope (checkboxes)
   - All Representatives
   - Specific Representatives [Multi-select]
   - All Clients
   - Specific Clients [Filter: By rep, by risk level]
   - All Documents
   - Specific Document Categories
   - Specific Time Period [Date range]

8. Audit Checklist (file upload or template selection)
   - Use Template: [Dropdown of templates]
   - Upload Custom Checklist: [File upload]

9. Notification Settings
   - ☑ Send reminder 7 days before
   - ☑ Send reminder 1 day before
   - ☑ Notify on completion
   - Email To: [Multi-select]

10. Recurrence (optional)
    - ⚪ One-time audit
    - ⚪ Recurring audit
    - If recurring:
      - Frequency: [Monthly | Quarterly | Semi-annually | Annually]
      - Repeat until: [Date picker or "Indefinitely"]

**Buttons:**
- [Primary] Schedule Audit
- [Secondary] Save as Draft
- [Link] Cancel

---

### Conduct Audit (During Audit Process)

**Audit Header:**
- Audit Name: Q4 2024 FICA Compliance Review
- Started: 15/12/2024 09:00
- Auditor: Johan Smit
- Progress: 65% (430/660 records reviewed)
- Estimated Completion: 15/12/2024 11:00

**Audit Checklist (Interactive):**

**Section 1: Initial FICA Verification**
- ☑ All clients have initial FICA completed (660/660) ✅ PASS
- ☑ FICA completed within 30 days of onboarding (655/660) ⚠️ WARNING
  - Finding: 5 clients exceeded 30-day requirement
  - Severity: Minor
  - [Add Note] [Attach Evidence]
- ☑ ID documents verified (660/660) ✅ PASS
- ☑ Proof of address verified (658/660) ⚠️ WARNING
  - Finding: 2 clients missing POA
  - Severity: Minor

**Section 2: Review Schedule Compliance**
- ☑ Low-risk clients reviewed every 5 years (480/495) ⚠️ WARNING
  - Finding: 15 clients overdue for review
  - Severity: Major
- ☑ Medium-risk clients reviewed every 3 years (90/115) ❌ FAIL
  - Finding: 25 clients overdue for review
  - Severity: Major
  - [Add Note] [Attach Evidence]
- ☑ High-risk clients reviewed annually (25/25) ✅ PASS

**Section 3: PEP & Sanctions Screening**
- ☑ All clients screened for PEP status (660/660) ✅ PASS
- ☑ All clients screened for sanctions (660/660) ✅ PASS
- ☑ High-risk clients re-screened quarterly (25/25) ✅ PASS

**Section 4: Documentation**
- ☑ All FICA files complete (640/660) ⚠️ WARNING
  - Finding: 20 clients missing risk assessment forms
  - Severity: Minor

**Overall Audit Score: 88% (GREEN - PASS)**

**Actions:**
- [Continue Audit]
- [Save Progress]
- [Pause Audit]
- [Complete & Generate Report]

---

### Audit Findings & Remediation

**Findings Summary:**
- Total Findings: 6
- Critical: 0
- Major: 2
- Minor: 4

**Findings Table:**

**Columns:**
| Severity | Finding | Audit Section | Evidence | Assigned To | Due Date | Status | Actions |

**Sample Finding 1 (Major):**
- Severity: 🟠 MAJOR
- Finding: "25 medium-risk clients overdue for FICA review (> 3 years)"
- Audit Section: FICA Review Schedule Compliance
- Evidence: Client_Review_Overdue_List.xlsx (attached)
- Assigned To: Sarah Naidoo (Compliance Officer)
- Due Date: 31/01/2025
- Status: Open
- Actions:
  - [View Details]
  - [Create Action Plan]
  - [Mark as Resolved]

**Finding Detail (Expanded):**
- Full Description: "During Q4 2024 FICA audit, 25 medium-risk clients were identified as overdue for their 3-year FICA review. Last reviews ranged from 3.2 to 3.8 years ago."
- Impact: "Non-compliance with FICA requirements. Potential regulatory sanction."
- Root Cause: "Inadequate review tracking system. Manual reminders missed."
- Recommended Remediation:
  1. Immediately schedule all 25 clients for FICA review
  2. Implement automated review reminder system
  3. Assign dedicated resource for FICA review management
- Related Documents:
  - Client_List_Overdue_Reviews.xlsx
  - FICA_Review_Schedule_Analysis.pdf
- Corrective Action Plan (CAP):
  - Action 1: Schedule 25 reviews (Assigned to: Sarah Naidoo, Due: 20/12/2024) - IN PROGRESS
  - Action 2: Implement automated system (Assigned to: IT, Due: 31/01/2025) - NOT STARTED
  - Action 3: Update procedure manual (Assigned to: Compliance, Due: 15/01/2025) - NOT STARTED
- Follow-up Audit: Scheduled for 28/02/2025

**Sample Finding 2 (Major):**
- Finding: "15 low-risk clients overdue for 5-year review"
- Severity: 🟠 MAJOR
- Assigned To: Sarah Naidoo
- Due Date: 15/02/2025
- Status: Action Plan Created

**Sample Finding 3 (Minor):**
- Finding: "5 clients exceeded 30-day initial FICA timeframe"
- Severity: 🟡 MINOR
- Assigned To: Representatives (various)
- Due Date: 31/12/2024
- Status: In Progress

**Sample Finding 4 (Minor):**
- Finding: "20 clients missing risk assessment forms"
- Severity: 🟡 MINOR
- Assigned To: Admin Staff
- Due Date: 31/12/2024
- Status: Open

---

### Audit Reports (Completed Audits)

**Recent Audit Reports:**

**Report 1:**
- Audit: Q4 2024 FICA Compliance Review
- Date: 10/12/2024
- Auditor: Johan Smit
- Overall Result: 88% (GREEN - PASS)
- Findings: 6 (0 critical, 2 major, 4 minor)
- Report: [Download PDF] [View Online]
- Status: Remediation in progress

**Report 2:**
- Audit: Q3 2024 CPD Compliance Check
- Date: 30/09/2024
- Auditor: Sarah Naidoo
- Overall Result: 82% (AMBER - WARNING)
- Findings: 4 (0 critical, 1 major, 3 minor)
- Report: [Download PDF] [View Online]
- Status: Remediation complete

**Report 3:**
- Audit: H1 2024 Document Retention Audit
- Date: 30/06/2024
- Auditor: System (Automated)
- Overall Result: 98% (GREEN - PASS)
- Findings: 2 (0 critical, 0 major, 2 minor)
- Report: [Download PDF] [View Online]
- Status: All findings resolved

**Report 4:**
- Audit: Annual Fit & Proper Review 2024
- Date: 31/03/2024
- Auditor: Thabo Mokoena
- Overall Result: 95% (GREEN - PASS)
- Findings: 1 (0 critical, 0 major, 1 minor)
- Report: [Download PDF] [View Online]
- Status: All findings resolved

---

## 5. FSCA COMMUNICATIONS TAB

### Page Header
- Title: "FSCA Communications"
- Subtitle: "Regulatory correspondence, submissions, and circulars"
- Buttons:
  - [Primary] Log New Communication
  - [Success] Schedule Submission
  - [Info] View Circulars
  - [Secondary] Export Log

---

### Communication Summary Cards

**Card 1: Active Items**
- Number: 5
- Icon: 📧
- Sublabel: "Requiring action"
- Button: [View All]

**Card 2: Pending Submissions**
- Number: 1
- Icon: 📤
- Next Due: 31/01/2025 (Quarterly Return)
- Button: [View Details]

**Card 3: Recent Circulars**
- Number: 3
- Icon: 📰
- Latest: Circular 8 of 2024 (CPD Updates)
- Button: [View All]

**Card 4: Overdue Items**
- Number: 0
- Icon: ✅ (green)
- Sublabel: "All up to date"

---

### FSCA Communications (Table)

**Tab Navigation:**
- All Communications (45)
- Inbound (28)
- Outbound (17)
- Circulars & Bulletins (12)
- Submissions (8)

**Filters:**
- Type: [All | Circular | Bulletin | Correspondence | Submission | Inspection Notice]
- Status: [All | Pending Response | Responded | Archived]
- Date Range: [Last 30 Days | Last Quarter | This Year | All Time]
- Priority: [All | High | Medium | Low]

---

**Communications Table:**

**Columns:**
| Date | Type | Subject | From/To | Due Date | Status | Actions |

**Sample Row 1 (Inbound):**
- Date: 01/12/2024
- Type: Circular (📰 icon)
- Subject: "FSCA Circular 8 of 2024: CPD Requirements Update"
- From: FSCA
- Due Date: 31/01/2025 (response/acknowledgment)
- Status: Reviewed (amber badge)
- Actions:
  - [View Full Circular]
  - [Impact Assessment]
  - [Acknowledge]
  - [Share with Team]

**Communication Detail (Expanded):**
- Reference Number: FSCA/CIRC/2024/08
- Date Received: 01/12/2024
- Subject: CPD Requirements Update - Ethics Hours
- Summary: "FSCA announces increase in mandatory ethics hours from 3 to 4 hours per annual CPD cycle, effective 1 June 2025."
- Full Circular: [Download PDF] [View Online]
- Impact Assessment:
  - Impact Level: MEDIUM
  - Affected Representatives: All (12)
  - Action Required: Update CPD tracking to require 4 ethics hours
  - Implementation Date: 1 June 2025
  - Responsible: Sarah Naidoo (Compliance Officer)
- Actions Taken:
  - 01/12/2024: Circular reviewed by Compliance Officer
  - 03/12/2024: Circular shared with all representatives
  - 05/12/2024: System updated to reflect new requirement
  - 10/12/2024: Acknowledgment sent to FSCA
- Related Documents:
  - FSCA_Circular_8_2024.pdf
  - Impact_Assessment_CPD_Update.docx
  - Acknowledgment_Letter_FSCA.pdf
- Follow-up: Update representative handbooks by 31/03/2025

**Sample Row 2 (Outbound):**
- Date: 15/11/2024
- Type: Submission (📤)
- Subject: "Quarterly Return - Q3 2024"
- To: FSCA
- Due Date: 15/11/2024 (submitted on time)
- Status: Submitted (green badge)
- Actions: [View Submission] [Download Confirmation]

**Sample Row 3 (Inbound):**
- Date: 10/11/2024
- Type: Correspondence (✉️)
- Subject: "Request for Information - Representative Supervision"
- From: FSCA
- Due Date: 10/12/2024 (30 days)
- Status: Responded (green badge)
- Actions: [View Request] [View Response]

**Sample Row 4 (Upcoming Submission):**
- Date: 31/01/2025
- Type: Submission (📤)
- Subject: "Quarterly Return - Q4 2024"
- To: FSCA
- Due Date: 31/01/2025 (46 days away)
- Status: Not Started (blue badge)
- Actions: [Prepare Submission] [Set Reminder]

**Sample Row 5 (Inbound - High Priority):**
- Date: 20/10/2024
- Type: Bulletin (⚠️)
- Subject: "Urgent: Fraud Alert - Unlicensed FSPs"
- From: FSCA
- Due Date: Immediate awareness
- Status: Acknowledged (green)
- Actions: [View Bulletin] [Shared with Team]

---

### Circulars & Bulletins Library

**Searchable archive of all FSCA circulars and bulletins:**

**Filters:**
- Year: [2024 | 2023 | 2022 | 2021 | All]
- Type: [All | Circular | Bulletin | Notice]
- Category: [All | FAIS | FICA | TCF | CPD | Other]
- Status: [All | New | Read | Implemented | Archived]

**Circulars Table:**

**Columns:**
| Date | Reference | Subject | Category | Status | Actions |

**Sample Entries:**
1. 01/12/2024 | FSCA/CIRC/2024/08 | CPD Requirements Update | CPD | Implemented
2. 15/10/2024 | FSCA/BULL/2024/12 | Fraud Alert - Unlicensed FSPs | FAIS | Acknowledged
3. 01/09/2024 | FSCA/CIRC/2024/07 | TCF Outcomes Reporting | TCF | Implemented
4. 15/06/2024 | FSCA/CIRC/2024/05 | FICA Review Requirements | FICA | Implemented
5. 01/03/2024 | FSCA/CIRC/2024/02 | Annual Returns Submission | FAIS | Implemented

---

### Submission Tracker

**Scheduled Submissions:**

**Table:**
| Submission Type | Frequency | Next Due Date | Status | Actions |

**Sample Submissions:**

1. **Quarterly Returns**
   - Frequency: Quarterly
   - Next Due: 31/01/2025
   - Status: Not Started (46 days remaining)
   - Actions: [Prepare] [View Template] [Set Reminder]

2. **Annual FSP Return**
   - Frequency: Annually
   - Next Due: 31/03/2025
   - Status: Not Started (106 days remaining)
   - Actions: [Prepare] [View Previous] [Set Reminder]

3. **CPD Annual Report**
   - Frequency: Annually
   - Next Due: 30/06/2025
   - Status: Not Started (197 days remaining)
   - Actions: [Prepare] [View Template]

4. **TCF Outcomes Report**
   - Frequency: Bi-annually
   - Next Due: 30/06/2025
   - Status: Not Started
   - Actions: [Prepare] [View Template]

---

### Log New FSCA Communication (Modal)

**Form Fields:**

1. Communication Type (dropdown) - REQUIRED
   - Inbound Correspondence
   - Outbound Correspondence
   - Circular/Bulletin (received)
   - Submission
   - Inspection Notice
   - Other

2. Date Received/Sent (date picker) - REQUIRED
3. FSCA Reference Number (text)
   - Example: FSCA/CIRC/2024/08

4. Subject (text) - REQUIRED
   - Max 200 characters

5. From/To (dropdown)
   - If Inbound: From FSCA
   - If Outbound: To FSCA

6. Priority (radio buttons)
   - ⚪ High (requires immediate action)
   - ⚪ Medium (requires action within 30 days)
   - ⚪ Low (for information only)

7. Category (dropdown)
   - FAIS Act
   - FICA
   - TCF
   - CPD
   - Licensing
   - Enforcement
   - Other

8. Summary (textarea)
   - Brief summary of communication
   - Max 500 characters

9. Due Date (date picker)
   - If action/response required

10. Attach Documents (file upload)
    - Drag & drop zone
    - Multiple files allowed
    - Supported: PDF, DOCX, XLSX

11. Assign To (dropdown)
    - FSP Owner
    - Compliance Officer
    - Key Individual
    - Specific Representative

12. Impact Assessment (textarea)
    - Assess impact on FSP operations
    - Action required
    - Resources needed

13. Notification Settings
    - ☑ Email assigned person
    - ☑ Create calendar reminder (7 days before due)
    - ☑ Add to compliance dashboard

**Buttons:**
- [Primary] Save Communication
- [Secondary] Save as Draft
- [Link] Cancel

---

## 6. TCF MONITORING TAB

### Page Header
- Title: "Treating Customers Fairly (TCF) Monitoring"
- Subtitle: "Six TCF Outcomes Assessment & Evidence"
- Buttons:
  - [Primary] Update TCF Assessment
  - [Success] Generate TCF Report
  - [Info] View History
  - [Secondary] Export

---

### TCF Overview Card

**TCF Compliance Score: 85% (GREEN)**
- Overall Status: Compliant
- Last Assessment: 30/11/2024
- Next Assessment Due: 31/05/2025
- Assessed By: Sarah Naidoo (Compliance Officer)

---

### Six TCF Outcomes (Accordion/Expandable Sections)

**Outcome 1: Consumers can be confident that they are dealing with firms where TCF is central to the corporate culture**

**Current Score: 90% (GREEN)**
**Status:** COMPLIANT

**Evidence:**
- ✅ TCF Policy documented and approved by board (15/01/2024)
- ✅ TCF training provided to all staff (Q1 2024)
- ✅ TCF included in performance reviews
- ✅ Complaints analysis shows TCF adherence
- ⚠️ TCF refresh training needed for 3 new representatives

**Key Indicators:**
- Staff awareness: 100% (12/12 trained)
- Board oversight: Quarterly TCF reviews
- Complaints related to unfair treatment: 0
- Customer satisfaction score: 4.2/5.0

**Actions Required:**
- Schedule TCF training for new representatives (Due: 31/12/2024)

**Evidence Documents:**
- TCF_Policy_2024.pdf
- TCF_Training_Attendance_2024.xlsx
- Board_TCF_Review_Minutes_Q3_2024.pdf
- Customer_Satisfaction_Survey_2024.xlsx

---

**Outcome 2: Products and services marketed and sold in the retail market are designed to meet the needs of identified consumer groups**

**Current Score: 88% (GREEN)**
**Status:** COMPLIANT

**Evidence:**
- ✅ Product due diligence process documented
- ✅ Target market analysis for all products
- ✅ Product suitability assessments conducted
- ✅ Regular product review (quarterly)
- ⚠️ One product (critical illness) requires updated target market analysis

**Key Indicators:**
- Products with target market identified: 95% (19/20)
- Product reviews completed: 100%
- Unsuitable product sales: 0
- Product performance vs. objectives: 92%

**Actions Required:**
- Update target market analysis for critical illness product (Due: 15/01/2025)

**Evidence Documents:**
- Product_Due_Diligence_Process.pdf
- Target_Market_Analysis_2024.xlsx
- Product_Review_Q4_2024.pdf

---

**Outcome 3: Consumers are provided with clear information and are kept appropriately informed before, during and after the point of sale**

**Current Score: 85% (GREEN)**
**Status:** COMPLIANT

**Evidence:**
- ✅ Product disclosure templates approved
- ✅ Clear fee structure communicated
- ✅ Regular client communication (quarterly statements)
- ✅ Plain language used in all documents
- ⚠️ Some clients report difficulty understanding product features

**Key Indicators:**
- Information completeness: 95%
- Client understanding (survey): 82%
- Complaints about unclear info: 1 (resolved)
- Documents in plain language: 100%

**Actions Required:**
- Review and simplify product brochures (Due: 28/02/2025)
- Conduct client information workshops (Q1 2025)

**Evidence Documents:**
- Product_Disclosure_Templates.pdf
- Fee_Schedule_2024.pdf
- Client_Communication_Samples.pdf
- Plain_Language_Assessment.docx

---

**Outcome 4: Where consumers receive advice, the advice is suitable and takes account of their circumstances**

**Current Score: 82% (AMBER)**
**Status:** WARNING - Improvement Needed

**Evidence:**
- ✅ Needs analysis process mandatory
- ✅ Advice records maintained (100%)
- ✅ Product recommendations justified
- ⚠️ 2 complaints about unsuitable advice (under investigation)
- ❌ Advice quality audits identify 3 instances of insufficient needs analysis

**Key Indicators:**
- Needs analysis completion rate: 100%
- Advice quality audit score: 82%
- Suitability complaints: 2 (being addressed)
- File review compliance: 95%

**Actions Required:**
- Complete investigation of 2 suitability complaints (Due: 31/12/2024)
- Provide refresher training on needs analysis (Due: 31/01/2025)
- Implement enhanced advice file review process (Due: 28/02/2025)

**Evidence Documents:**
- Needs_Analysis_Template.pdf
- Advice_File_Review_Report_Q4_2024.pdf
- Complaints_Investigation_In_Progress.pdf
- Advice_Quality_Audit_2024.pdf

---

**Outcome 5: Consumers are provided with products that perform as firms have led them to expect**

**Current Score: 90% (GREEN)**
**Status:** COMPLIANT

**Evidence:**
- ✅ Product performance monitoring in place
- ✅ Provider performance reviews conducted
- ✅ Client expectations managed appropriately
- ✅ Issues escalated to providers promptly
- ✅ No systemic product performance issues identified

**Key Indicators:**
- Claims paid vs. expected: 98%
- Product performance vs. projections: 95%
- Client satisfaction with products: 4.3/5.0
- Performance-related complaints: 0

**Actions Required:**
- None (maintain current monitoring)

**Evidence Documents:**
- Product_Performance_Review_2024.xlsx
- Provider_Scorecard_Q4_2024.pdf
- Claims_Analysis_2024.xlsx

---

**Outcome 6: Consumers do not face unreasonable post-sale barriers imposed by firms to change product, switch provider, submit a claim or make a complaint**

**Current Score: 88% (GREEN)**
**Status:** COMPLIANT

**Evidence:**
- ✅ Clear complaints process published
- ✅ All complaints resolved within SLA
- ✅ Claims assistance provided proactively
- ✅ Switching process documented and simple
- ⚠️ Average claim processing time could be improved

**Key Indicators:**
- Complaints resolved within 6 weeks: 100%
- Client switching requests: 5 (all processed smoothly)
- Claims assistance satisfaction: 4.5/5.0
- Average claim processing time: 18 days (target: 14 days)

**Actions Required:**
- Review claim processing efficiency with providers (Due: 31/01/2025)

**Evidence Documents:**
- Complaints_Process_2024.pdf
- Complaints_Resolution_Report_2024.xlsx
- Claims_Assistance_Records.pdf
- Client_Switching_Process.pdf

---

### TCF Action Plan

**Open Actions (Priority Order):**

1. **Complete suitability complaints investigation** (Outcome 4)
   - Assigned To: Sarah Naidoo
   - Due: 31/12/2024 (16 days)
   - Status: In Progress (65%)

2. **Schedule TCF training for new representatives** (Outcome 1)
   - Assigned To: Compliance Officer
   - Due: 31/12/2024
   - Status: Not Started

3. **Update target market analysis - critical illness product** (Outcome 2)
   - Assigned To: Key Individual
   - Due: 15/01/2025
   - Status: Not Started

4. **Provide refresher training on needs analysis** (Outcome 4)
   - Assigned To: Training Coordinator
   - Due: 31/01/2025
   - Status: Not Started

5. **Review claim processing efficiency** (Outcome 6)
   - Assigned To: Operations Manager
   - Due: 31/01/2025
   - Status: Not Started

---

### TCF Assessment History

**Table of Previous Assessments:**

**Columns:**
| Date | Overall Score | Status | Assessed By | Report | Actions |

**Sample Entries:**
1. 30/11/2024 | 85% | Compliant (Green) | Sarah Naidoo | [Download] [View]
2. 31/05/2024 | 87% | Compliant (Green) | Sarah Naidoo | [Download] [View]
3. 30/11/2023 | 83% | Warning (Amber) | Sarah Naidoo | [Download] [View]
4. 31/05/2023 | 85% | Compliant (Green) | Johan Smit | [Download] [View]

---

## SAMPLE DATA

**Current User: Sarah Naidoo**
- Role: Compliance Officer
- Email: sarah.naidoo@customapp.co.za
- Phone: +27 82 555 1234
- Authorizations: Full compliance monitoring access

**FSP Details:**
- FSP Name: ABC Financial Services (Pty) Ltd
- FSP Number: 12345
- License Categories: Long-term Insurance, Investments
- License Issue Date: 15/03/2015
- License Expiry: 14/03/2026
- Representatives: 12 active
- Clients: 660 active

**Current Compliance Status:**
- Overall Health Score: 87% (GREEN - COMPLIANT)
- Fit & Proper: 92% (11/12 compliant)
- CPD: 75% (9/12 compliant)
- FICA: 88% (580/660 clients current)
- Documentation: 95% (850/895 current)
- Insurance: 100% (all policies current)

**Active Issues:**
- Critical: 1 (Mike Johnson RE5 expired)
- High: 3 (45 FICA overdue, PI renewal in 30 days, 2 suitability complaints)
- Medium: 5 (3 CPD behind, quarterly return due, 1 target market update)
- Low: 8 (various minor items)

**Recent Activity (Last 7 Days):**
- Compliance checks run: 3
- Alerts created: 4
- Audits completed: 1 (Q4 FICA Review)
- FSCA communications: 1 (Circular 8 of 2024 received)
- Issues resolved: 2

**Upcoming Deadlines:**
- 20/12/2024: Mike Johnson RE5 resolution (OVERDUE)
- 31/12/2024: TCF training for new reps
- 31/01/2025: Quarterly FSCA return
- 15/02/2025: FICA overdue reviews completion
- 31/05/2025: Annual CPD deadline

**Current Date:** 15/12/2024
**Current Time:** 14:30

---

## TECHNICAL REQUIREMENTS

### Performance Requirements
- Dashboard load time: < 2 seconds
- Compliance check execution: < 10 seconds for quick check
- Real-time alert delivery: < 5 seconds
- Report generation: < 30 seconds
- Auto-refresh: Every 5 minutes (configurable)

### Data Refresh
- Health score: Real-time calculation on page load
- Issues count: Real-time query
- Recent activity: Real-time feed
- Statistics: Cached (5-minute refresh)

### Charts & Visualizations
- Use Chart.js for all charts
- Donut chart: Health score (with animation)
- Bar charts: Compliance by area
- Line charts: Trend analysis
- Responsive charts (scale to container)

### Alerts & Notifications
- Browser notifications (permission required)
- Email integration (SMTP)
- SMS integration (Twilio or similar)
- WhatsApp Business API (future phase)
- Push notifications (mobile app - future)

### Export Functionality
- PDF: High-quality, print-ready (use jsPDF)
- Excel: Formatted with formulas (use SheetJS)
- CSV: Raw data export
- Word: Reports with charts (use docx.js)

### Responsive Design
- Mobile: Single column, collapsible sections
- Tablet: Two columns where appropriate
- Desktop: Full multi-column layout
- Touch-friendly buttons (min 44x44px)

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Space, Arrows)
- Screen reader compatible
- High contrast mode support
- Focus indicators on all controls

### Security
- Role-based data filtering (client-side and server-side)
- Audit trail for all compliance actions
- Encrypted data transmission (HTTPS)
- Session timeout (30 minutes inactive)
- Multi-factor authentication support

---

## API ENDPOINTS

### Compliance Dashboard
```
GET /api/compliance/health-score
GET /api/compliance/issues?priority={priority}&category={category}
GET /api/compliance/activity?limit={limit}&offset={offset}
GET /api/compliance/statistics
POST /api/compliance/issues
PUT /api/compliance/issues/{id}
DELETE /api/compliance/issues/{id}
```

### Alerts & Notifications
```
GET /api/alerts?priority={priority}&status={status}
POST /api/alerts
PUT /api/alerts/{id}
DELETE /api/alerts/{id}
POST /api/alerts/{id}/acknowledge
POST /api/alerts/{id}/dismiss
GET /api/alert-rules
POST /api/alert-rules
PUT /api/alert-rules/{id}
DELETE /api/alert-rules/{id}
POST /api/alert-rules/{id}/test
```

### Compliance Checks
```
GET /api/compliance-checks/templates
POST /api/compliance-checks/run
GET /api/compliance-checks/{id}/status
GET /api/compliance-checks/{id}/results
GET /api/compliance-checks/history
```

### Internal Audits
```
GET /api/audits?status={status}
POST /api/audits/schedule
PUT /api/audits/{id}
DELETE /api/audits/{id}
POST /api/audits/{id}/start
POST /api/audits/{id}/complete
GET /api/audits/{id}/findings
POST /api/audits/{id}/findings
PUT /api/audit-findings/{id}
```

### FSCA Communications
```
GET /api/fsca/communications?type={type}&status={status}
POST /api/fsca/communications
PUT /api/fsca/communications/{id}
GET /api/fsca/circulars
GET /api/fsca/submissions
POST /api/fsca/submissions
```

### TCF Monitoring
```
GET /api/tcf/assessment
POST /api/tcf/assessment
GET /api/tcf/outcomes/{outcome_id}
PUT /api/tcf/outcomes/{outcome_id}
GET /api/tcf/action-plan
POST /api/tcf/actions
PUT /api/tcf/actions/{id}
```

---

## FILE STRUCTURE

```
compliance-dashboard/
├── index.html
├── css/
│   ├── compliance-styles.css
│   ├── dashboard.css
│   ├── alerts.css
│   ├── audits.css
│   ├── charts.css
│   └── responsive.css
├── js/
│   ├── compliance-dashboard.js
│   ├── health-score.js
│   ├── issues-manager.js
│   ├── alerts-manager.js
│   ├── compliance-checks.js
│   ├── audit-scheduler.js
│   ├── fsca-communications.js
│   ├── tcf-monitoring.js
│   ├── charts.js
│   ├── notifications.js
│   └── data.js
└── assets/
    ├── icons/
    ├── templates/
    │   ├── audit-checklists/
    │   └── report-templates/
    └── sample-data/
```

---

## BUSINESS LOGIC

### Health Score Calculation
```javascript
function calculateHealthScore(data) {
  const weights = {
    fitAndProper: 0.25,
    cpd: 0.25,
    fica: 0.20,
    documentation: 0.15,
    insurance: 0.10,
    other: 0.05
  };
  
  const scores = {
    fitAndProper: data.compliantReps / data.totalReps,
    cpd: data.cpdCompliantReps / data.totalReps,
    fica: data.ficaCompliantClients / data.totalClients,
    documentation: data.currentDocuments / data.totalDocuments,
    insurance: data.currentPolicies / data.totalPolicies,
    other: data.otherCompliance
  };
  
  return Math.round(
    (scores.fitAndProper * weights.fitAndProper +
     scores.cpd * weights.cpd +
     scores.fica * weights.fica +
     scores.documentation * weights.documentation +
     scores.insurance * weights.insurance +
     scores.other * weights.other) * 100
  );
}
```

### Alert Priority Rules
```javascript
const alertRules = {
  critical: {
    color: '#DC3545',
    sla: 'immediate',
    channels: ['sms', 'email', 'in_app'],
    escalation: {
      if_not_acknowledged_within: '2 hours',
      escalate_to: ['fsp_owner', 'key_individual']
    }
  },
  high: {
    color: '#FFC107',
    sla: '7 days',
    channels: ['email', 'in_app'],
    escalation: {
      if_not_acknowledged_within: '24 hours',
      escalate_to: ['compliance_officer']
    }
  },
  medium: {
    color: '#FFC107',
    sla: '30 days',
    channels: ['in_app'],
    escalation: null
  },
  low: {
    color: '#28A745',
    sla: '90 days',
    channels: ['in_app'],
    escalation: null
  }
};
```

### Issue Aging Logic
```javascript
function getIssueAging(createdDate, dueDate) {
  const now = new Date();
  const created = new Date(createdDate);
  const due = new Date(dueDate);
  
  const daysOpen = Math.floor((now - created) / (1000 * 60 * 60 * 24));
  const daysUntilDue = Math.floor((due - now) / (1000 * 60 * 60 * 24));
  
  if (daysUntilDue < 0) {
    return { status: 'overdue', days: Math.abs(daysUntilDue), color: 'red' };
  } else if (daysUntilDue <= 7) {
    return { status: 'due_soon', days: daysUntilDue, color: 'amber' };
  } else {
    return { status: 'on_track', days: daysUntilDue, color: 'green' };
  }
}
```

---

Generate a complete, production-ready compliance dashboard and monitoring system that meets all FAIS Act Section 17 requirements for Compliance Officer functions. The system should provide comprehensive oversight, proactive alerting, and detailed audit capabilities for South African FSP compliance management.
