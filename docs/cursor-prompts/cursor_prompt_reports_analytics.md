# CURSOR PROMPT: REPORTS & ANALYTICS MODULE
============================================================

Create a fully functional, realistic HTML mockup for the Reports & Analytics module of a South African FAIS broker compliance portal. This is the most comprehensive module, providing custom report building, scheduled reporting, data visualization, and FSCA-ready compliance reports across all FSP compliance areas.

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
- Chart.js for data visualization: https://www.chartjs.org/
- South African locale (dates: DD/MM/YYYY, currency: ZAR)

---

## ROLE-BASED ACCESS CONTROL

### FSP Owner / Principal
- **Access:** Full access to all reports and analytics
- **Reports:** All pre-built reports, custom reports, executive dashboards
- **Actions:** Create, edit, delete, schedule, export, share all reports
- **Analytics:** Full access to all data sources and metrics
- **Dashboards:** Executive overview with drill-down capabilities

### Key Individual
- **Access:** Reports for supervised representatives only
- **Reports:** Team performance reports, CPD tracking, compliance summaries
- **Actions:** View, export reports for supervised team
- **Analytics:** Limited to supervised representatives' data
- **Dashboards:** Team performance dashboard

### Compliance Officer
- **Access:** Full access to compliance reports and analytics
- **Reports:** All compliance reports, FSCA submissions, audit reports
- **Actions:** Create, schedule, export compliance reports
- **Analytics:** Full access to compliance metrics and trends
- **Dashboards:** Compliance monitoring dashboard

### Representative
- **Access:** Personal reports only
- **Reports:** Own CPD summary, FICA status, compliance status
- **Actions:** View and export personal reports only
- **Analytics:** None (no access to aggregated data)
- **Dashboards:** Personal compliance dashboard

### Admin Staff
- **Access:** View-only access to operational reports
- **Reports:** Basic activity reports, document logs
- **Actions:** View and export operational reports
- **Analytics:** Limited to operational metrics
- **Dashboards:** Operational dashboard

---

## MODULE STRUCTURE

### Navigation Tabs (Top of page)
- Report Library (default view)
- Custom Report Builder
- Scheduled Reports
- Analytics Dashboard
- FSCA Reports
- Export History

---

## SECTION 1: REPORT LIBRARY

### Page Header
**Title:** Report Library
**Subtitle:** Pre-built compliance reports ready to generate
**Current Date Context:** 23 November 2024

**Quick Actions:**
- 🆕 Create Custom Report
- 📅 Schedule New Report
- 📊 View Analytics Dashboard
- 🏦 Generate FSCA Report

---

### Pre-Built Report Categories

#### Category 1: Executive Reports (FSP Owner/Principal Only)

**Report 1: Executive Compliance Summary**
```
┌──────────────────────────────────────────────────────────┐
│ 📊 Executive Compliance Summary                          │
│                                                          │
│ Comprehensive overview of FSP compliance status across  │
│ all areas: Fit & Proper, CPD, FICA, Documents          │
│                                                          │
│ Last Generated: 20/11/2024 14:30                        │
│ Frequency: Monthly                                       │
│ Format: PDF (A4, 15-20 pages)                           │
│                                                          │
│ Includes:                                                │
│ • Overall compliance score and trend                     │
│ • Representative compliance breakdown                    │
│ • Key Individual performance analysis                    │
│ • Critical alerts and action items                       │
│ • Month-over-month comparison                            │
│ • Risk assessment matrix                                 │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

**Report 2: Financial Performance vs Compliance**
```
┌──────────────────────────────────────────────────────────┐
│ 💰 Financial Performance vs Compliance                   │
│                                                          │
│ Correlates business performance with compliance metrics │
│ to identify high-performing compliant representatives   │
│                                                          │
│ Last Generated: 15/11/2024 09:00                        │
│ Frequency: Quarterly                                     │
│ Format: Excel (Interactive Dashboard)                    │
│                                                          │
│ Includes:                                                │
│ • Revenue by representative                              │
│ • Compliance score correlation                           │
│ • Client acquisition vs compliance status                │
│ • Productivity analysis                                  │
│ • ROI on CPD investment                                  │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

**Report 3: Board of Directors Report**
```
┌──────────────────────────────────────────────────────────┐
│ 🎯 Board of Directors Report                             │
│                                                          │
│ High-level strategic report for board meetings and      │
│ governance oversight                                     │
│                                                          │
│ Last Generated: 01/11/2024 10:00                        │
│ Frequency: Quarterly                                     │
│ Format: PowerPoint (Board Presentation)                  │
│                                                          │
│ Includes:                                                │
│ • Strategic compliance overview                          │
│ • Risk heatmap and mitigation strategies                │
│ • Regulatory changes impact                              │
│ • Vicarious liability exposure                           │
│ • Investment recommendations                             │
│ • Industry benchmarking                                  │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 2: CPD Reports

**Report 4: CPD Compliance Summary**
```
┌──────────────────────────────────────────────────────────┐
│ 📚 CPD Compliance Summary                                │
│                                                          │
│ Current cycle progress for all representatives with     │
│ deadline tracking and risk assessment                    │
│                                                          │
│ Last Generated: 23/11/2024 08:00                        │
│ Frequency: Weekly                                        │
│ Format: PDF + Excel                                      │
│                                                          │
│ Data Scope:                                              │
│ • Cycle: 1 June 2024 - 31 May 2025                     │
│ • Representatives: 36                                    │
│ • Average Progress: 71%                                  │
│ • At-Risk: 10 representatives                            │
│                                                          │
│ Includes:                                                │
│ • Individual progress breakdown                          │
│ • Ethics hours compliance                                │
│ • Verifiable hours percentage                            │
│ • Timeline projection                                    │
│ • At-risk representative details                         │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

**Report 5: CPD Activity Log**
```
┌──────────────────────────────────────────────────────────┐
│ 📋 CPD Activity Log                                      │
│                                                          │
│ Detailed log of all CPD activities submitted, verified, │
│ and pending approval this cycle                          │
│                                                          │
│ Parameters: [Date Range] [Status] [Provider]            │
│ Format: Excel (Sortable, Filterable)                     │
│                                                          │
│ Columns:                                                 │
│ • Activity Date | Representative | Activity Type        │
│ • Provider | Hours | Verifiable | Ethics Hours         │
│ • Status | Uploaded Date | Verified By | Certificate   │
│                                                          │
│ [▶️ Generate Now] [📊 Customize] [👁️ Preview]           │
└──────────────────────────────────────────────────────────┘
```

**Report 6: CPD Provider Analysis**
```
┌──────────────────────────────────────────────────────────┐
│ 🏫 CPD Provider Analysis                                 │
│                                                          │
│ Analysis of which providers are most used and rated     │
│ highest by your representatives                          │
│                                                          │
│ Format: PDF with charts                                  │
│                                                          │
│ Includes:                                                │
│ • Top 10 providers by usage                              │
│ • Average quality ratings                                │
│ • Cost analysis per provider                             │
│ • Ethics vs technical breakdown                          │
│ • Representative feedback summary                        │
│ • Recommendations for preferred providers                │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 3: Fit & Proper Reports

**Report 7: Fit & Proper Status Report**
```
┌──────────────────────────────────────────────────────────┐
│ ✅ Fit & Proper Status Report                            │
│                                                          │
│ Complete overview of all F&P requirements per           │
│ representative with expiry tracking                      │
│                                                          │
│ Last Generated: 20/11/2024 11:00                        │
│ Frequency: Monthly                                       │
│ Format: PDF + Excel                                      │
│                                                          │
│ Includes:                                                │
│ • Qualifications status (current/expired)                │
│ • RE Exam status and expiry dates                       │
│ • Class of Business authorizations                       │
│ • Experience verification                                │
│ • Character & Integrity declarations                     │
│ • Upcoming renewal requirements (90 days)                │
│ • Non-compliant representatives                          │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

**Report 8: Qualification Expiry Calendar**
```
┌──────────────────────────────────────────────────────────┐
│ 📅 Qualification Expiry Calendar                         │
│                                                          │
│ 12-month rolling calendar of qualification and RE Exam  │
│ expiry dates for proactive renewal management           │
│                                                          │
│ View: [Calendar] [List] [Timeline]                      │
│ Format: PDF Calendar + Excel List                        │
│                                                          │
│ Includes:                                                │
│ • Monthly expiry breakdown                               │
│ • Representative contact details                         │
│ • Qualification type and renewal requirements            │
│ • Estimated renewal cost                                 │
│ • Auto-generated reminder schedule                       │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 4: FICA Reports

**Report 9: FICA Compliance Status**
```
┌──────────────────────────────────────────────────────────┐
│ 🔐 FICA Compliance Status                                │
│                                                          │
│ Client verification status across all representatives   │
│ with risk categorization and remediation tracking       │
│                                                          │
│ Last Generated: 22/11/2024 16:00                        │
│ Frequency: Weekly                                        │
│ Format: PDF + Excel                                      │
│                                                          │
│ Metrics:                                                 │
│ • Total Clients: 1,248                                   │
│ • Fully Verified: 1,156 (93%)                           │
│ • Pending: 67 (5%)                                       │
│ • Overdue: 25 (2%)                                       │
│                                                          │
│ Includes:                                                │
│ • Verification status by representative                  │
│ • Outstanding documents list                             │
│ • High-risk client identification                        │
│ • Review schedule compliance                             │
│ • Remediation action plan                                │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

**Report 10: FICA Documentation Audit**
```
┌──────────────────────────────────────────────────────────┐
│ 📄 FICA Documentation Audit                              │
│                                                          │
│ Detailed audit of FICA documentation completeness and   │
│ quality for internal or FSCA inspection readiness       │
│                                                          │
│ Format: Comprehensive PDF Audit Report                   │
│                                                          │
│ Audit Criteria:                                          │
│ • ID document copies (quality, clarity, expiry)         │
│ • Proof of address (recency, validity)                  │
│ • Bank details verification                              │
│ • Tax compliance status                                  │
│ • Beneficial ownership documentation                     │
│ • Source of funds/wealth declarations                    │
│                                                          │
│ Output:                                                  │
│ • Compliance score per client                            │
│ • Gap analysis and remediation plan                      │
│ • Risk assessment matrix                                 │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 5: Document Management Reports

**Report 11: Document Repository Summary**
```
┌──────────────────────────────────────────────────────────┐
│ 📂 Document Repository Summary                           │
│                                                          │
│ Overview of all compliance documents stored in system   │
│ with retention schedule and storage metrics              │
│                                                          │
│ Last Generated: 21/11/2024 09:00                        │
│ Frequency: Monthly                                       │
│ Format: PDF + Excel                                      │
│                                                          │
│ Statistics:                                              │
│ • Total Documents: 3,847                                 │
│ • Storage Used: 2.4 GB                                   │
│ • Document Types: 24                                     │
│ • Retention Compliant: 98%                               │
│                                                          │
│ Includes:                                                │
│ • Document breakdown by category                         │
│ • Upload activity trend                                  │
│ • Storage growth projection                              │
│ • Retention schedule compliance                          │
│ • Upcoming purge requirements                            │
│ • Access audit trail summary                             │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

**Report 12: Document Access Audit Log**
```
┌──────────────────────────────────────────────────────────┐
│ 🔍 Document Access Audit Log                             │
│                                                          │
│ Complete audit trail of who accessed what documents     │
│ and when - critical for POPI Act compliance              │
│                                                          │
│ Parameters: [Date Range] [User] [Document Type]         │
│ Format: Excel (Sortable, Filterable)                     │
│                                                          │
│ Columns:                                                 │
│ • Timestamp | User | Action (View/Download/Edit/Delete) │
│ • Document Name | Document Type | Client/Rep Ref        │
│ • IP Address | Device | Duration | Success/Failed       │
│                                                          │
│ Use Cases:                                               │
│ • POPI Act compliance audits                             │
│ • Security incident investigation                        │
│ • Access pattern analysis                                │
│ • Unauthorized access detection                          │
│                                                          │
│ [▶️ Generate Now] [📊 Customize] [👁️ Preview]           │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 6: Complaints Management Reports

**Report 13: Complaints Register**
```
┌──────────────────────────────────────────────────────────┐
│ 📝 Complaints Register                                   │
│                                                          │
│ Official FAIS-compliant complaints register required    │
│ under Section 16 of the FAIS Act                         │
│                                                          │
│ Last Generated: 23/11/2024 07:00                        │
│ Frequency: Monthly                                       │
│ Format: PDF (FSCA Submission Format)                     │
│                                                          │
│ Period: Last 12 months                                   │
│ Total Complaints: 14                                     │
│ Resolved: 11 (79%)                                       │
│ Pending: 3 (21%)                                         │
│ Average Resolution Time: 18 days                         │
│                                                          │
│ Includes:                                                │
│ • Complaint details (date, nature, complainant)         │
│ • Representative involved                                │
│ • Resolution status and timeline                         │
│ • Remedial action taken                                  │
│ • OMBUD escalations                                      │
│ • Trends and root cause analysis                         │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

**Report 14: Complaint Trend Analysis**
```
┌──────────────────────────────────────────────────────────┐
│ 📈 Complaint Trend Analysis                              │
│                                                          │
│ Statistical analysis of complaint patterns to identify  │
│ systemic issues and improvement opportunities            │
│                                                          │
│ Format: PDF with charts and graphs                       │
│                                                          │
│ Analysis Includes:                                       │
│ • Complaint volume trends (monthly)                      │
│ • Complaint type distribution                            │
│ • Representative with most complaints                    │
│ • Product/service area analysis                          │
│ • Root cause identification                              │
│ • Resolution time trends                                 │
│ • Client satisfaction post-resolution                    │
│ • Preventative recommendations                           │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 7: Representative Performance Reports

**Report 15: Representative Performance Dashboard**
```
┌──────────────────────────────────────────────────────────┐
│ 👥 Representative Performance Dashboard                  │
│                                                          │
│ Comprehensive performance scorecard for each            │
│ representative across all compliance areas               │
│                                                          │
│ View: [Individual] [Team Comparison] [Trends]           │
│ Format: Excel Dashboard + PDF Summary                    │
│                                                          │
│ Metrics per Representative:                              │
│ • Overall Compliance Score (0-100)                       │
│ • CPD Progress and Status                                │
│ • Fit & Proper Status                                    │
│ • FICA Compliance Rate                                   │
│ • Complaints Received                                    │
│ • Client Portfolio Size                                  │
│ • Revenue Generation                                     │
│ • Risk Rating                                            │
│                                                          │
│ Rankings:                                                │
│ • Top Performers (Green Zone)                            │
│ • Average Performers (Blue Zone)                         │
│ • Needs Improvement (Amber Zone)                         │
│ • Critical Attention (Red Zone)                          │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 8: Key Individual Reports

**Report 16: Key Individual Performance Report**
```
┌──────────────────────────────────────────────────────────┐
│ 🎖️ Key Individual Performance Report                     │
│                                                          │
│ Evaluation of Key Individual supervisory effectiveness  │
│ and team compliance outcomes                             │
│                                                          │
│ Last Generated: 15/11/2024 10:00                        │
│ Frequency: Quarterly                                     │
│ Format: PDF (Executive Summary)                          │
│                                                          │
│ Per Key Individual:                                      │
│ • Name and FSP Number                                    │
│ • Number of supervised representatives                   │
│ • Team compliance score                                  │
│ • CPD compliance rate                                    │
│ • FICA compliance rate                                   │
│ • Complaints under supervision                           │
│ • Supervision quality indicators                         │
│                                                          │
│ Analysis:                                                │
│ • Best practices from top performers                     │
│ • Support needs identification                           │
│ • Training recommendations                               │
│ • Accountability metrics                                 │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 9: Internal Audit Reports

**Report 17: Internal Audit Summary**
```
┌──────────────────────────────────────────────────────────┐
│ 🔎 Internal Audit Summary                                │
│                                                          │
│ Summary of all internal audits conducted with findings, │
│ remediation status, and recommendations                  │
│                                                          │
│ Last Generated: 10/11/2024 14:00                        │
│ Frequency: Quarterly                                     │
│ Format: PDF (Formal Audit Report)                        │
│                                                          │
│ Last Audit Date: 5 November 2024                        │
│ Audited Areas: 8                                         │
│ Findings: 12 (3 High, 5 Medium, 4 Low)                  │
│ Resolved: 7 (58%)                                        │
│ In Progress: 5 (42%)                                     │
│                                                          │
│ Includes:                                                │
│ • Audit scope and methodology                            │
│ • Findings by severity                                   │
│ • Management responses                                   │
│ • Remediation timeline                                   │
│ • Follow-up schedule                                     │
│ • Compliance improvement trends                          │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

#### Category 10: FSCA Submission Reports

**Report 18: Annual FSCA Compliance Report**
```
┌──────────────────────────────────────────────────────────┐
│ 🏦 Annual FSCA Compliance Report                         │
│                                                          │
│ Comprehensive annual report formatted for FSCA          │
│ submission (if requested by regulator)                   │
│                                                          │
│ Reporting Period: 1 Jan 2024 - 31 Dec 2024             │
│ Submission Deadline: 31 March 2025                       │
│ Format: PDF (FSCA Template Format)                       │
│                                                          │
│ Sections:                                                │
│ • FSP Details and License Information                    │
│ • Representative Register (Section 6A compliance)        │
│ • CPD Compliance Summary (Section 8A)                    │
│ • Fit & Proper Status (Section 6A)                       │
│ • FICA Compliance Overview                               │
│ • Complaints Register (Section 16)                       │
│ • Internal Audit Results                                 │
│ • Compliance Officer Declaration (Section 17)            │
│ • Financial Information (if applicable)                  │
│ • Changes to FSP Structure                               │
│                                                          │
│ [▶️ Generate Now] [📅 Schedule] [👁️ Preview]            │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 2: CUSTOM REPORT BUILDER

### Page Header
**Title:** Custom Report Builder
**Subtitle:** Create tailored reports with drag-and-drop simplicity

---

### Step 1: Select Data Sources

**Available Data Sources (Select Multiple):**
```
┌──────────────────────────────────────────────────────────┐
│ SELECT DATA SOURCES                                      │
│                                                          │
│ ☑️ Representatives                                       │
│   └─ Name, FSP Number, Status, Categories, Supervisors │
│                                                          │
│ ☑️ CPD Activities                                        │
│   └─ Hours, Dates, Providers, Status, Verifiable       │
│                                                          │
│ ☐ Fit & Proper Records                                  │
│   └─ Qualifications, RE Exams, Character Declarations   │
│                                                          │
│ ☐ FICA Verifications                                    │
│   └─ Client Details, Verification Status, Documents    │
│                                                          │
│ ☐ Documents                                              │
│   └─ Document Types, Upload Dates, Access Logs         │
│                                                          │
│ ☐ Complaints                                             │
│   └─ Complaint Details, Status, Resolution Timeline    │
│                                                          │
│ ☐ Clients                                                │
│   └─ Client Info, Portfolio Value, Representative      │
│                                                          │
│ ☐ Internal Audits                                       │
│   └─ Audit Findings, Remediation Status, Dates         │
│                                                          │
│ Selected: 2 data sources                                 │
└──────────────────────────────────────────────────────────┘
```

---

### Step 2: Choose Fields to Include

**Drag and Drop Interface:**
```
┌─────────────────────────────────┬───────────────────────┐
│ AVAILABLE FIELDS                │ SELECTED FIELDS       │
│                                 │                       │
│ Representatives:                │ 1. Representative Name│
│ • FSP Number                    │ 2. CPD Progress (%)   │
│ • Contact Details               │ 3. Hours Completed    │
│ • Category (Class 1/2/3)        │ 4. Ethics Hours       │
│ • Key Individual                │ 5. Last Activity Date │
│ • Status                        │ 6. Status             │
│ • Onboarding Date              │                       │
│                                 │                       │
│ CPD Activities:                 │ Drag fields from left │
│ • Activity Date                 │ to add them to report │
│ • Activity Type                 │                       │
│ • Provider                      │ ↑↓ Drag to reorder    │
│ • Hours                         │                       │
│ • Verifiable (Yes/No)          │ 🗑️ Remove field       │
│ • Ethics Hours                  │                       │
│ • Status (Verified/Pending)    │                       │
│ • Upload Date                   │                       │
│ • Certificate Attached         │                       │
│                                 │                       │
│ [Search fields...]              │ 6 fields selected     │
└─────────────────────────────────┴───────────────────────┘
```

---

### Step 3: Apply Filters

**Filter Configuration:**
```
┌──────────────────────────────────────────────────────────┐
│ APPLY FILTERS                                            │
│                                                          │
│ Date Range:                                              │
│ From: [01/06/2024] To: [23/11/2024]                     │
│ ○ This Month  ○ Last 3 Months  ● Custom Range           │
│                                                          │
│ Representatives:                                         │
│ Status: [All Statuses ▼]                                │
│ Key Individual: [All Supervisors ▼]                     │
│ Category: [All Categories ▼]                            │
│                                                          │
│ CPD Status:                                              │
│ ☐ Compliant (80%+)                                      │
│ ☑️ At Risk (50-79%)                                     │
│ ☑️ Critical (<50%)                                      │
│ ☐ Not Started (0%)                                      │
│                                                          │
│ Minimum CPD Hours: [___] Maximum: [___]                 │
│                                                          │
│ Ethics Hours:                                            │
│ ○ All  ● Met Minimum (3+ hours)  ○ Below Minimum        │
│                                                          │
│ [Clear All Filters] [Apply Filters]                     │
└──────────────────────────────────────────────────────────┘
```

---

### Step 4: Configure Display Options

**Display Settings:**
```
┌──────────────────────────────────────────────────────────┐
│ DISPLAY OPTIONS                                          │
│                                                          │
│ Sort By:                                                 │
│ Primary: [CPD Progress ▼] Order: [Descending ▼]        │
│ Secondary: [Representative Name ▼] [Ascending ▼]        │
│                                                          │
│ Grouping:                                                │
│ Group by: [Key Individual ▼]                            │
│ ☑️ Show group totals                                    │
│ ☑️ Show group subtotals                                 │
│                                                          │
│ Visualization:                                           │
│ ☑️ Include summary charts                               │
│   Chart Type: [Bar Chart ▼]                             │
│ ☑️ Include progress bars                                │
│ ☑️ Color-code by status                                 │
│                                                          │
│ Totals & Averages:                                       │
│ ☑️ Show column totals                                   │
│ ☑️ Show averages                                        │
│ ☑️ Show percentages                                     │
│                                                          │
│ Page Layout:                                             │
│ Orientation: ○ Portrait  ● Landscape                     │
│ Paper Size: [A4 ▼]                                      │
│ ☑️ Include page numbers                                 │
│ ☑️ Include generation date                              │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Step 5: Choose Output Format

**Export Format Selection:**
```
┌──────────────────────────────────────────────────────────┐
│ SELECT OUTPUT FORMAT                                     │
│                                                          │
│ ● PDF (Professional Reports)                             │
│   └─ Best for: Printing, sharing, presentations        │
│   └─ Features: Fixed layout, embedded fonts, charts     │
│                                                          │
│ ○ Excel (Data Analysis)                                  │
│   └─ Best for: Further analysis, pivot tables, graphs  │
│   └─ Features: Sortable, filterable, formulas          │
│                                                          │
│ ○ CSV (Raw Data)                                         │
│   └─ Best for: Import into other systems, databases    │
│   └─ Features: Plain text, universal compatibility     │
│                                                          │
│ ○ Word (Editable Reports)                                │
│   └─ Best for: Reports needing manual editing          │
│   └─ Features: Fully editable, template-based          │
│                                                          │
│ ○ PowerPoint (Presentations)                             │
│   └─ Best for: Board meetings, stakeholder updates     │
│   └─ Features: Slides, charts, executive summaries     │
│                                                          │
│ Multiple Formats:                                        │
│ ☐ Generate in multiple formats simultaneously           │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Step 6: Save Report Template

**Template Configuration:**
```
┌──────────────────────────────────────────────────────────┐
│ SAVE REPORT TEMPLATE                                     │
│                                                          │
│ Template Name:                                           │
│ [At-Risk Representatives CPD Summary_______________]     │
│                                                          │
│ Description:                                             │
│ [Weekly report showing all representatives below 70%    │
│  CPD completion with detailed breakdown and action      │
│  items_______________________________________]            │
│                                                          │
│ Category: [Custom Reports ▼]                            │
│                                                          │
│ Access Permissions:                                      │
│ ☑️ FSP Owner                                            │
│ ☑️ Key Individuals                                      │
│ ☑️ Compliance Officer                                   │
│ ☐ Representatives                                       │
│ ☐ Admin Staff                                           │
│                                                          │
│ Scheduling Options:                                      │
│ ☑️ Allow this report to be scheduled                    │
│ ☑️ Add to Report Library                                │
│                                                          │
│ [Cancel] [Save Template] [Save & Generate Now]          │
└──────────────────────────────────────────────────────────┘
```

---

### Report Preview Panel

**Live Preview:**
```
┌──────────────────────────────────────────────────────────┐
│ REPORT PREVIEW                                           │
│                                                          │
│ ┌────────────────────────────────────────────────────┐  │
│ │ At-Risk Representatives CPD Summary                │  │
│ │ Generated: 23 November 2024 15:30                 │  │
│ │                                                    │  │
│ │ Key Individual: Thandi Dlamini                    │  │
│ │                                                    │  │
│ │ Rep Name          Progress  Hours   Ethics Status │  │
│ │ Johannes Botha    50%       9.0/18  3/3    ⚠️     │  │
│ │ Last Activity: 02/11/2024                         │  │
│ │                                                    │  │
│ │ Daniel Fourie     0%        0.0/18  0/3    🔴     │  │
│ │ Last Activity: N/A                                │  │
│ │                                                    │  │
│ │ [Additional records...]                           │  │
│ │                                                    │  │
│ │ Group Total: 2 representatives                    │  │
│ │ Average Progress: 25%                             │  │
│ │                                                    │  │
│ │ [Chart showing progress distribution]             │  │
│ │                                                    │  │
│ │ Key Individual: Pieter van Rensburg              │  │
│ │ [Continues...]                                    │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Page 1 of 3                                              │
│                                                          │
│ [◀️ Previous Page] [1] [2] [3] [Next Page ▶️]           │
│                                                          │
│ [⬅️ Back to Editor] [▶️ Generate Report]                │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 3: SCHEDULED REPORTS

### Page Header
**Title:** Scheduled Reports
**Subtitle:** Automate report generation and delivery

---

### Active Scheduled Reports Table

**Table Columns:**
1. Report Name
2. Schedule (Frequency)
3. Next Run Date/Time
4. Recipients
5. Format
6. Last Run
7. Status
8. Actions

### Sample Scheduled Reports

**Row 1: Weekly CPD Update**
```
CPD Compliance Summary     | Weekly (Mondays 08:00)      | 25/11/2024 08:00 | principal@fsp.co.za  | PDF + Excel | 18/11/2024 | ✅ Active | ⏸️ ▶️ ⚙️ 🗑️
                           | Every Monday at 08:00       | In 2 days        | compliance@fsp.co.za |             | Success    | Running   | Pause Play Edit Delete
```

**Row 2: Monthly Executive Report**
```
Executive Compliance       | Monthly (1st of month)      | 01/12/2024 06:00 | board@fsp.co.za      | PDF         | 01/11/2024 | ✅ Active | ⏸️ ▶️ ⚙️ 🗑️
Summary                    | 1st of each month at 06:00  | In 8 days        | principal@fsp.co.za  |             | Success    | Running   |
```

**Row 3: Quarterly Audit Report**
```
Internal Audit Summary     | Quarterly (15th)            | 15/02/2025 10:00 | audit-team@fsp.co.za | PDF         | 15/11/2024 | ✅ Active | ⏸️ ▶️ ⚙️ 🗑️
                           | Every 3 months on the 15th  | In 84 days       | compliance@fsp.co.za |             | Success    | Running   |
```

**Row 4: Daily At-Risk Alert (Paused)**
```
At-Risk Reps Daily Alert   | Daily (Weekdays 17:00)      | N/A              | ki-team@fsp.co.za    | Email       | 20/11/2024 | ⏸️ Paused | ▶️ ⚙️ 🗑️
                           | Mon-Fri at 17:00            | Paused           | compliance@fsp.co.za | Summary     | Success    | Paused    | Resume Edit Delete
```

---

### Create New Scheduled Report

**Button:** [➕ Schedule New Report]

**Modal: Schedule Report Configuration**
```
┌──────────────────────────────────────────────────────────┐
│ SCHEDULE REPORT                                          │
│                                                          │
│ Step 1: Select Report Template                          │
│ Report: [CPD Compliance Summary ▼]                      │
│                                                          │
│ Step 2: Set Schedule                                     │
│ Frequency:                                               │
│ ○ Daily  ● Weekly  ○ Monthly  ○ Quarterly  ○ Custom     │
│                                                          │
│ Day of Week:                                             │
│ ☐ Mon  ● Tue  ☐ Wed  ☐ Thu  ☐ Fri  ☐ Sat  ☐ Sun        │
│                                                          │
│ Time: [08:00] (South African Standard Time)             │
│                                                          │
│ Step 3: Recipients                                       │
│ To: [principal@fsp.co.za_____________________] [+ Add]   │
│     [compliance@fsp.co.za____________________] [✕]       │
│                                                          │
│ CC: [ki-thandi@fsp.co.za_____________________] [+ Add]   │
│                                                          │
│ Step 4: Email Message                                    │
│ Subject: [Weekly CPD Compliance Summary___________]      │
│                                                          │
│ Message:                                                 │
│ [Please find attached the weekly CPD compliance         │
│  summary report for the week ending [DATE].             │
│                                                          │
│  Key highlights are included in the attached report.    │
│                                                          │
│  Best regards,                                           │
│  Compliance System_____________________________]         │
│                                                          │
│ ☑️ Attach report as PDF                                 │
│ ☑️ Include summary in email body                        │
│                                                          │
│ Step 5: Start Date                                       │
│ Start on: [25/11/2024] (Next scheduled run)             │
│                                                          │
│ [Cancel] [Save Schedule] [Test Send Now]                │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 4: ANALYTICS DASHBOARD

### Page Header
**Title:** Analytics Dashboard
**Subtitle:** Real-time insights and data visualization

---

### Dashboard Layout (4 Quadrants)

#### Quadrant 1: Overall Compliance Health

**Gauge Chart:**
```
┌──────────────────────────────────────────────────────────┐
│ FSP COMPLIANCE HEALTH SCORE                              │
│                                                          │
│           ╭─────────────────╮                            │
│          ╱                   ╲                           │
│         │                     │                          │
│        │    ┌───────────┐     │                         │
│        │    │    78%    │     │  ⚠️ AT RISK             │
│        │    └───────────┘     │                         │
│         │                     │                          │
│          ╲                   ╱                           │
│           ╰─────────────────╯                            │
│                                                          │
│  0%─────25%─────50%─────75%─────100%                    │
│  🔴 Critical  ⚠️ At Risk  ✅ Good  🏆 Excellent          │
│                                                          │
│  Components:                                             │
│  CPD Compliance:        72% ⚠️                          │
│  Fit & Proper:          95% ✅                          │
│  FICA Compliance:       93% ✅                          │
│  Document Management:   88% ✅                          │
│  Complaints Mgmt:       100% 🏆                         │
│                                                          │
│  Trend: ↓ 2% from last month                            │
│  Action: Focus on CPD compliance                         │
└──────────────────────────────────────────────────────────┘
```

---

#### Quadrant 2: Compliance Trends (Line Chart)

**Multi-Line Chart:**
```
┌──────────────────────────────────────────────────────────┐
│ COMPLIANCE TRENDS (Last 6 Months)                        │
│                                                          │
│ 100%│                                                    │
│     │        ✓─────────✓─────────✓────────✓   Fit & Proper│
│  90%│       ╱           ╲       ╱  ╲      ╱             │
│     │      ╱             ╲     ╱    ╲    ╱              │
│  80%│─────╱───────────────╲───╱──────✓──╱   CPD         │
│     │    ╱                 ╲ ╱            ╲             │
│  70%│   ◆───────────────────◆──────────────◆   Overall  │
│     │                                                    │
│  60%│                                                    │
│     │                                                    │
│  50%│                                                    │
│     └────────────────────────────────────────────       │
│      Jun   Jul   Aug   Sep   Oct   Nov   Dec            │
│      2024  2024  2024  2024  2024  2024  2024           │
│                                                          │
│  Legend:                                                 │
│  ─✓─ Fit & Proper (Green)  ─◆─ CPD (Teal)              │
│  ─●─ FICA (Blue)  ─■─ Overall Health (Grey)            │
│                                                          │
│  Insight: CPD compliance dipped in October but          │
│  recovering in November with focused interventions.     │
└──────────────────────────────────────────────────────────┘
```

---

#### Quadrant 3: Representative Distribution (Pie Chart)

**Pie Chart:**
```
┌──────────────────────────────────────────────────────────┐
│ REPRESENTATIVE STATUS DISTRIBUTION                       │
│                                                          │
│                  ╭───────────╮                           │
│                ╱               ╲                         │
│              ╱                   ╲                       │
│            ╱          26         ╲                      │
│           │       COMPLIANT       │ 72%                  │
│           │        (72%)          │                      │
│            ╲                     ╱                       │
│              ╲     4           ╱                         │
│                ╲  AT RISK    ╱   11%                     │
│           6      ╲  (11%)  ╱                             │
│        CRITICAL   ╲       ╱                              │
│         (17%)      ╰─────╯                               │
│                                                          │
│  Total Representatives: 36                               │
│                                                          │
│  Breakdown:                                              │
│  ✅ Compliant:   26 reps (72%) - Green                  │
│  ⚠️ At Risk:      4 reps (11%) - Amber                  │
│  🔴 Critical:     6 reps (17%) - Red                    │
│                                                          │
│  Action: Focus on 6 critical representatives            │
└──────────────────────────────────────────────────────────┘
```

---

#### Quadrant 4: Top Alerts & Actions (List)

**Priority Alert List:**
```
┌──────────────────────────────────────────────────────────┐
│ TOP 5 PRIORITY ALERTS                                    │
│                                                          │
│ 1. 🔴 CRITICAL: 6 reps below 50% CPD completion         │
│    Due: 31 May 2025 (188 days)                          │
│    [View Details] [Assign Actions]                       │
│                                                          │
│ 2. ⚠️ URGENT: 25 FICA verifications overdue             │
│    Oldest: 45 days overdue                               │
│    [View Clients] [Send Reminders]                       │
│                                                          │
│ 3. ⚠️ ATTENTION: 3 RE Exam renewals in 60 days          │
│    Representatives: Botha, Khumalo, Fourie              │
│    [Schedule Renewals] [Notify Reps]                     │
│                                                          │
│ 4. ℹ️ INFO: Quarterly audit due 15 December 2024        │
│    Status: Planning phase                                │
│    [Start Audit] [Review Checklist]                      │
│                                                          │
│ 5. ✅ SUCCESS: 14 reps completed CPD early              │
│    Average: 94% completion                               │
│    [Send Recognition] [View List]                        │
│                                                          │
│ [View All Alerts →]                                      │
└──────────────────────────────────────────────────────────┘
```

---

### Additional Analytics Sections

#### Key Performance Indicators (KPIs)

**KPI Cards Row:**
```
┌────────────────┬────────────────┬────────────────┬────────────────┐
│ TOTAL REPS     │ AVG CPD HOURS  │ FICA VERIFIED  │ COMPLAINTS     │
│                │                │                │                │
│      36        │     12.8       │     93%        │      14        │
│   (Active)     │  of 18 hours   │   1,156/1,248  │  (Last year)   │
│                │                │                │                │
│  ↔️ No change  │  ↑ +1.2 hours  │  ↑ +2%        │  ↓ -3 cases    │
│  vs last month │  this month    │  this quarter  │  vs last year  │
└────────────────┴────────────────┴────────────────┴────────────────┘
```

---

#### Representative Performance Heatmap

**Heatmap Table:**
```
┌──────────────────────────────────────────────────────────┐
│ REPRESENTATIVE PERFORMANCE HEATMAP                       │
│                                                          │
│ Rep Name         │ CPD  │ F&P  │ FICA │ Docs │ Overall │
│──────────────────┼──────┼──────┼──────┼──────┼─────────│
│ Thabo Maluleke   │ 🟢   │ 🟢   │ 🟢   │ 🟢   │ 🟢 95%  │
│ Sarah v d Merwe  │ 🔵   │ 🟢   │ 🟢   │ 🟢   │ 🟢 88%  │
│ Johannes Botha   │ 🟡   │ 🟢   │ 🔵   │ 🟢   │ 🔵 78%  │
│ Nomvula Khumalo  │ 🔴   │ 🟡   │ 🔵   │ 🔵   │ 🔴 45%  │
│ Daniel Fourie    │ 🔴   │ 🔴   │ 🔴   │ 🟡   │ 🔴 22%  │
│                                                          │
│ Legend:                                                  │
│ 🟢 Compliant (80-100%)  🔵 Good (70-79%)                │
│ 🟡 At Risk (50-69%)     🔴 Critical (<50%)              │
│                                                          │
│ [Export Heatmap] [Filter View] [Full Screen]            │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 5: FSCA REPORTS

### Page Header
**Title:** FSCA Submission Reports
**Subtitle:** Regulator-ready compliance reports

---

### FSCA Report Templates

**Template 1: Annual Compliance Report**
```
┌──────────────────────────────────────────────────────────┐
│ 🏦 ANNUAL FSCA COMPLIANCE REPORT                         │
│                                                          │
│ Reporting Period: 1 January 2024 - 31 December 2024    │
│ Submission Deadline: 31 March 2025                       │
│                                                          │
│ Report includes all information required under:          │
│ • FAIS Act Section 6A (Fit & Proper requirements)       │
│ • Section 8A (CPD requirements)                          │
│ • Section 13 (Supervision and liability)                │
│ • Section 16 (Complaints management)                     │
│ • Section 17 (Compliance Officer functions)             │
│                                                          │
│ Sections:                                                │
│ ✅ FSP Details and License Information                   │
│ ✅ Representative Register (36 representatives)          │
│ ✅ CPD Compliance Summary (current cycle)                │
│ ✅ Fit & Proper Status Report                            │
│ ✅ FICA Compliance Overview                              │
│ ✅ Complaints Register (14 complaints)                   │
│ ✅ Internal Audit Summary (last 2 audits)               │
│ ✅ Compliance Officer Declaration                        │
│ ✅ Significant Changes to FSP Structure                  │
│                                                          │
│ Status: ✅ Ready to Generate                             │
│                                                          │
│ [▶️ Generate Report] [👁️ Preview] [📧 Email FSCA]       │
└──────────────────────────────────────────────────────────┘
```

**Template 2: Representative Register (Section 6A)**
```
┌──────────────────────────────────────────────────────────┐
│ 📋 REPRESENTATIVE REGISTER (Section 6A)                  │
│                                                          │
│ Official register of all representatives authorized     │
│ under FSP license FSP12345                               │
│                                                          │
│ As of: 23 November 2024                                  │
│ Total Representatives: 36                                │
│                                                          │
│ Format: PDF (FSCA Template Format)                       │
│                                                          │
│ Per Representative:                                      │
│ • Full Names and ID Number                               │
│ • FSP Representative Number                              │
│ • Category of Advice (Class 1/2/3)                      │
│ • Qualifications and RE Exam Status                      │
│ • CPD Compliance Status                                  │
│ • Fit & Proper Assessment                                │
│ • Supervision Details (Key Individual)                   │
│ • Date Authorized/Deauthorized                           │
│                                                          │
│ Includes attestations:                                   │
│ ✅ Criminal record checks completed                      │
│ ✅ Character & integrity declarations signed             │
│ ✅ Ongoing supervision arrangements confirmed            │
│                                                          │
│ [▶️ Generate Register] [👁️ Preview] [📧 Submit FSCA]    │
└──────────────────────────────────────────────────────────┘
```

**Template 3: CPD Compliance Report (Section 8A)**
```
┌──────────────────────────────────────────────────────────┐
│ 📚 CPD COMPLIANCE REPORT (Section 8A)                    │
│                                                          │
│ CPD compliance status for all representatives as        │
│ required under FSCA Board Notice 194 of 2017            │
│                                                          │
│ Reporting Cycle: 1 June 2024 - 31 May 2025             │
│ Report Date: 23 November 2024 (mid-cycle)               │
│                                                          │
│ Summary Statistics:                                      │
│ • Representatives: 36                                    │
│ • Average Progress: 71% (12.8/18 hours)                 │
│ • Compliant: 26 (72%)                                   │
│ • At Risk: 10 (28%)                                     │
│ • Ethics Compliance: 78% met minimum                     │
│                                                          │
│ Format: PDF + Excel Data                                 │
│                                                          │
│ Detailed breakdown includes:                             │
│ • Individual CPD hours by representative                 │
│ • Technical vs Ethics hours split                        │
│ • Verifiable hours percentage                            │
│ • CPD provider breakdown                                 │
│ • Activities completed per representative                │
│ • Projected year-end compliance                          │
│                                                          │
│ [▶️ Generate Report] [👁️ Preview] [📧 Submit FSCA]      │
└──────────────────────────────────────────────────────────┘
```

**Template 4: Complaints Register (Section 16)**
```
┌──────────────────────────────────────────────────────────┐
│ 📝 COMPLAINTS REGISTER (Section 16)                      │
│                                                          │
│ Official complaints register as required under          │
│ FAIS Act Section 16 and Circular 1 of 2012             │
│                                                          │
│ Reporting Period: 1 January 2024 - 31 December 2024    │
│ Total Complaints: 14                                     │
│                                                          │
│ Complaint Statistics:                                    │
│ • Resolved: 11 (79%)                                    │
│ • Pending: 3 (21%)                                      │
│ • Escalated to OMBUD: 1 (7%)                            │
│ • Average Resolution Time: 18 days                       │
│                                                          │
│ Format: PDF (FSCA Template Format)                       │
│                                                          │
│ Per Complaint Entry:                                     │
│ • Complaint reference number                             │
│ • Date received                                          │
│ • Complainant details (anonymized if required)          │
│ • Representative involved                                │
│ • Nature of complaint                                    │
│ • Investigation findings                                 │
│ • Resolution outcome                                     │
│ • Remedial action taken                                  │
│ • Date resolved/escalated                                │
│                                                          │
│ Includes root cause analysis and remediation plans      │
│                                                          │
│ [▶️ Generate Register] [👁️ Preview] [📧 Submit FSCA]    │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 6: EXPORT HISTORY

### Page Header
**Title:** Export History
**Subtitle:** Track all generated and exported reports

---

### Export History Table

**Table Columns:**
1. Report Name
2. Generated Date/Time
3. Generated By
4. Format
5. Recipients (if emailed)
6. File Size
7. Status
8. Actions

### Sample Export History

**Row 1: Recent Export**
```
CPD Compliance Summary     | 23/11/2024 08:15 | Lindiwe Mbatha        | PDF      | principal@fsp.co.za      | 2.4 MB | ✅ Success | 📥 💾 📧
                           | Today            | Compliance Officer    |          | compliance@fsp.co.za     |        | Delivered  | Download Save Email
```

**Row 2: Scheduled Export**
```
Executive Summary          | 20/11/2024 06:00 | System (Scheduled)    | PDF      | board@fsp.co.za          | 4.1 MB | ✅ Success | 📥 💾 📧
                           | 3 days ago       | Automated             |          |                          |        | Delivered  |
```

**Row 3: Custom Export**
```
At-Risk Reps Analysis      | 18/11/2024 14:30 | Thandi Dlamini        | Excel    | N/A (Downloaded)         | 856 KB | ✅ Success | 📥 💾 📧
                           | 5 days ago       | Key Individual        |          |                          |        | Complete   |
```

**Row 4: Failed Export**
```
FSCA Annual Report         | 15/11/2024 10:00 | Lindiwe Mbatha        | PDF      | fsca@fsca.co.za          | N/A    | ❌ Failed  | 🔄 📋
                           | 8 days ago       | Compliance Officer    |          |                          |        | Retry      | Retry View Log
```

---

### Export Statistics

**Statistics Cards:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ TOTAL       │ THIS MONTH  │ SUCCESS     │ TOTAL SIZE  │
│ EXPORTS     │             │ RATE        │             │
│             │             │             │             │
│    847      │     142     │   99.2%     │   8.4 GB    │
│ (All time)  │ (Nov 2024)  │ (842/847)   │ (Storage)   │
│             │             │             │             │
│ ↑ +23%      │ +15 reports │ ↔️ Stable    │ ↑ +320 MB   │
│ vs last yr  │ vs Oct 2024 │ High        │ this month  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

## MODAL COMPONENTS

### Modal 1: Report Preview

**Triggered by:** Clicking "Preview" on any report

**Modal Title:** Report Preview - [Report Name]
**Close Button:** ✕ (top right)

**Modal Content:**

**Navigation Bar:**
- [◀️ Previous] Page 1 of 15 [Next ▶️]
- [🔍 Zoom In] [🔍 Zoom Out] [📄 Full Screen]
- [📥 Download] [📧 Email] [🖨️ Print]

**Preview Window:**
- Shows PDF/document preview
- Scrollable content
- High-resolution rendering
- Page thumbnails sidebar (collapsible)

**Footer:**
- [Close] [Generate & Download] [Email to Recipients]

---

### Modal 2: Email Report

**Triggered by:** Clicking "Email" action

**Modal Title:** Email Report - [Report Name]
**Close Button:** ✕ (top right)

**Modal Content:**

**Recipients:**
```
To: [principal@fsp.co.za_________________________] [+ Add]
    [compliance@fsp.co.za_______________________] [✕ Remove]

CC: [____________________________________] [+ Add]

BCC: [____________________________________] [+ Add]
```

**Subject:**
```
Subject: [CPD Compliance Summary - 23 November 2024_______]
```

**Message:**
```
┌──────────────────────────────────────────────────────────┐
│ Please find attached the CPD Compliance Summary report   │
│ for the period 1 June 2024 - 23 November 2024.         │
│                                                          │
│ Key highlights:                                          │
│ • Overall FSP compliance: 72%                            │
│ • 26 of 36 representatives compliant                     │
│ • 10 representatives require attention                   │
│                                                          │
│ Detailed breakdown is provided in the attached report.   │
│                                                          │
│ Best regards,                                            │
│ Compliance Officer                                       │
│ Bright Future Financial Services                         │
│                                                          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

**Attachments:**
- ☑️ cpd-compliance-summary-23nov2024.pdf (2.4 MB)
- ☐ Add additional files...

**Options:**
- ☑️ Send copy to myself
- ☐ Request read receipt

**Footer:**
- [Cancel] [Send Email]

---

### Modal 3: Schedule Report

**Triggered by:** Clicking "Schedule" on any report

**Modal Title:** Schedule Report - [Report Name]
**Close Button:** ✕ (top right)

**Modal Content:**

(Same as shown in Section 2 under "Create New Scheduled Report")

---

## RESPONSIVE DESIGN NOTES

### Desktop (1200px+)
- 4-column card layout for pre-built reports
- Full-width custom report builder with drag-and-drop
- Side-by-side chart comparisons in analytics
- Split-screen preview mode

### Tablet (768px - 1199px)
- 2-column card layout for reports
- Stacked custom report builder steps
- Single-column charts with scrolling
- Modal overlays for preview

### Mobile (< 768px)
- Single-column card layout (stack vertically)
- Simplified report builder (step-by-step wizard)
- Touch-optimized drag-and-drop
- Full-screen modals for preview
- Simplified tables with expandable rows
- Mobile-friendly chart interactions

---

## ACCESSIBILITY FEATURES

- High contrast mode for charts
- Screen reader friendly tables and charts
- Keyboard navigation (Tab, Enter, Arrow keys)
- ARIA labels for all interactive elements
- Alt text for chart images (when exported)
- Focus indicators on buttons and links
- Color-blind friendly chart palettes
- Text alternatives for visual data

---

## PERFORMANCE CONSIDERATIONS

- Lazy load large tables (paginate after 100 rows)
- Cache generated reports for 24 hours
- Asynchronous report generation (show progress bar)
- Optimize chart rendering (canvas vs SVG)
- Compress exported files (ZIP for multiple formats)
- Background scheduling for large reports
- Database query optimization for data sources

---

## INTEGRATION POINTS

### Dependencies (Data Sources):
- All Modules → Complete data set for comprehensive reports
- Representatives Management → Representative details
- CPD Management → CPD activity data
- Fit & Proper Module → F&P status
- FICA Module → Client verification data
- Document Management → Document metadata
- Complaints Management → Complaints data
- Internal Audits → Audit findings

### Data This Module Provides To:
- Executive Dashboard → Key performance metrics
- Alerts Module → Report generation triggers
- Email System → Scheduled report delivery

### API Endpoints Used:
```
GET  /api/reports/library              → List pre-built reports
GET  /api/reports/templates/{id}       → Get report template
POST /api/reports/generate             → Generate custom report
POST /api/reports/schedule             → Schedule report
GET  /api/reports/scheduled            → List scheduled reports
PUT  /api/reports/scheduled/{id}       → Update schedule
DELETE /api/reports/scheduled/{id}     → Delete schedule
GET  /api/reports/history              → Export history
GET  /api/reports/download/{id}        → Download report
POST /api/reports/email                → Email report
GET  /api/analytics/dashboard          → Dashboard data
GET  /api/analytics/kpi                → KPI metrics
GET  /api/fsca/templates               → FSCA report templates
POST /api/fsca/generate                → Generate FSCA report
```

---

## BUSINESS LOGIC & VALIDATION

### Report Generation Logic:
```javascript
function generateReport(template, filters, options) {
  // 1. Validate permissions
  if (!hasPermission(user, template)) {
    throw new Error('Insufficient permissions');
  }
  
  // 2. Apply filters and fetch data
  const data = fetchData(template.dataSources, filters);
  
  // 3. Apply calculations and aggregations
  const processed = processData(data, template.calculations);
  
  // 4. Generate visualizations (if requested)
  const charts = generateCharts(processed, template.chartConfig);
  
  // 5. Format according to template
  const formatted = formatReport(processed, charts, template.layout);
  
  // 6. Export to requested format(s)
  const outputs = exportFormats(formatted, options.formats);
  
  // 7. Log generation
  logReportGeneration(user, template, outputs);
  
  return outputs;
}
```

### Data Aggregation Example:
```javascript
function calculateCPDCompliance(representatives) {
  const summary = {
    totalReps: representatives.length,
    totalHours: 0,
    compliantCount: 0,
    atRiskCount: 0,
    criticalCount: 0
  };
  
  representatives.forEach(rep => {
    summary.totalHours += rep.cpdHours;
    
    const progress = (rep.cpdHours / 18) * 100;
    if (progress >= 80) summary.compliantCount++;
    else if (progress >= 50) summary.atRiskCount++;
    else summary.criticalCount++;
  });
  
  summary.averageHours = summary.totalHours / summary.totalReps;
  summary.complianceRate = (summary.compliantCount / summary.totalReps) * 100;
  
  return summary;
}
```

### Scheduled Report Execution:
```javascript
function executeScheduledReport(schedule) {
  try {
    // 1. Generate report
    const report = generateReport(
      schedule.template,
      schedule.filters,
      schedule.options
    );
    
    // 2. Email to recipients
    if (schedule.emailEnabled) {
      emailReport(
        report,
        schedule.recipients,
        schedule.emailSubject,
        schedule.emailBody
      );
    }
    
    // 3. Save to archive
    archiveReport(report, schedule);
    
    // 4. Update schedule metadata
    updateSchedule(schedule.id, {
      lastRun: new Date(),
      status: 'success',
      nextRun: calculateNextRun(schedule.frequency)
    });
    
  } catch (error) {
    // Log error and notify admin
    logError(error, schedule);
    notifyAdmin('Scheduled report failed', error);
    
    updateSchedule(schedule.id, {
      status: 'failed',
      errorMessage: error.message
    });
  }
}
```

---

## SAMPLE DATA CONTEXT

**Current Date:** 23 November 2024
**Current Time:** 15:45 (South African Standard Time)

**FSP Details:**
- FSP Name: Bright Future Financial Services (Pty) Ltd
- FSP License Number: FSP12345
- Total Representatives: 36
- Key Individuals: 2 (Thandi Dlamini, Pieter van Rensburg)
- Compliance Officer: Lindiwe Mbatha
- Total Clients: 1,248

**Compliance Summary:**
- Overall Health Score: 78% (At Risk)
- CPD Compliance: 72% (26 of 36 compliant)
- Fit & Proper: 95% (34 of 36 compliant)
- FICA Compliance: 93% (1,156 of 1,248 clients verified)
- Complaints: 14 total (last 12 months), 11 resolved

---

## TESTING SCENARIOS

### Scenario 1: FSP Owner - Generate Executive Report
- Login as FSP Owner
- Navigate to Report Library
- Select "Executive Compliance Summary"
- Preview report (15 pages, comprehensive)
- Generate PDF report
- Email to board@fsp.co.za
- Verify email delivery and download link

### Scenario 2: Compliance Officer - Custom At-Risk Report
- Login as Compliance Officer
- Navigate to Custom Report Builder
- Select data sources: Representatives, CPD Activities
- Add fields: Name, Progress, Hours, Status
- Filter: Progress < 70%
- Group by: Key Individual
- Include charts: Yes
- Preview report (3 pages)
- Save as template: "Weekly At-Risk CPD Report"
- Schedule: Weekly, Mondays 08:00
- Verify scheduled in Scheduled Reports list

### Scenario 3: Key Individual - Team Performance Report
- Login as Key Individual (Thandi Dlamini)
- Navigate to Report Library
- Select "Representative Performance Dashboard"
- System auto-filters to supervised reps only (18 reps)
- Generate Excel report
- View detailed breakdown per representative
- Export to Excel for analysis
- Verify data isolation (cannot see other KI's reps)

### Scenario 4: Compliance Officer - FSCA Submission
- Login as Compliance Officer
- Navigate to FSCA Reports
- Select "Annual FSCA Compliance Report"
- Review pre-populated data
- Preview 40-page comprehensive report
- Generate PDF (FSCA format)
- Verify all required sections included
- Download for submission

### Scenario 5: Representative - Personal Report
- Login as Representative
- Navigate to Report Library
- Limited view: Only "My Compliance Summary"
- Generate personal report (2 pages)
- View CPD progress, FICA status, F&P status
- Download PDF
- Verify cannot access team or FSP-wide data

---

## REGULATORY COMPLIANCE NOTES

**FAIS Act Section 17 (Compliance Officer Functions):**
- Compliance Officer must monitor and report on compliance
- Reports module provides tools for systematic compliance monitoring
- Scheduled reports ensure regular review and oversight
- Audit trail of all report generation for FSCA inspections

**FSCA Supervisory Expectations:**
- FSPs must maintain comprehensive records
- Reports must be available for FSCA inspections
- Regular management reporting on compliance status
- Evidence of proactive compliance management

**Data Protection (POPI Act):**
- Export logs for audit trail
- Access controls on sensitive reports
- Anonymization options for client data
- Secure transmission of emailed reports
- Retention policies for generated reports

---

## ADDITIONAL NOTES FOR CURSOR AI

1. **Use Chart.js for all visualizations** - consistent library
2. **Reports must be print-friendly** - use @media print CSS
3. **Large reports = progress indicators** - show generation progress
4. **Realistic data** - all numbers must align across reports
5. **South African locale** - dates, currency, phone formats
6. **File naming convention** - `report-type-date-time.format`
7. **Error handling** - graceful failures with retry options
8. **Performance** - optimize for reports with 1000+ records
9. **Security** - validate all user inputs, sanitize report parameters
10. **Accessibility** - WCAG 2.1 AA compliance for all report formats

---

## SUCCESS CRITERIA

Reports & Analytics module is considered complete when it:
1. ✅ Provides 18+ pre-built compliance reports
2. ✅ Enables drag-and-drop custom report creation
3. ✅ Supports multiple export formats (PDF, Excel, CSV, Word, PPT)
4. ✅ Allows report scheduling with email delivery
5. ✅ Displays real-time analytics dashboard with visualizations
6. ✅ Generates FSCA-ready submission reports
7. ✅ Maintains complete export history with audit trail
8. ✅ Enforces role-based access to reports and data
9. ✅ Performs efficiently with large datasets (1000+ records)
10. ✅ Provides professional, print-ready output suitable for board meetings and regulatory submissions

---

**END OF CURSOR PROMPT**

Generated: 23 November 2024  
Module: Reports & Analytics  
Priority: 3 (Medium)  
Estimated Effort: 12-16 hours development  
Complexity: HIGH (most complex module)
