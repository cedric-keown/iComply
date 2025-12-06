# CURSOR PROMPT: EXECUTIVE DASHBOARD MODULE
============================================================

Create a fully functional, realistic HTML mockup for the Executive Dashboard of a South African FAIS broker compliance portal. This is the primary landing page for FSP Owners, Key Individuals, and Compliance Officers, providing a comprehensive at-a-glance view of the entire FSP's compliance status, team performance, and critical alerts.

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
- **Access:** Full executive dashboard with all metrics
- **Dashboard View:** Complete oversight of all compliance areas
- **Widgets:** All widgets visible (company, team, compliance, financial)
- **Actions:** Can drill down into any area, generate reports, take corrective actions

### Key Individual
- **Access:** Full executive dashboard (same as FSP Owner)
- **Dashboard View:** Complete oversight (may be filtered to supervised reps if configured)
- **Widgets:** All widgets visible
- **Actions:** Same as FSP Owner

### Compliance Officer
- **Access:** Compliance-focused executive dashboard
- **Dashboard View:** Emphasis on compliance metrics, less on financial
- **Widgets:** All compliance widgets, limited financial widgets
- **Actions:** Can drill down, generate compliance reports

### Representative
- **Access:** Redirected to "My Compliance Dashboard" (personal view)
- **Dashboard View:** Personal compliance status only
- **Widgets:** None from executive dashboard
- **Actions:** View own status, update own records

### Admin Staff
- **Access:** Redirected to "Operations Dashboard"
- **Dashboard View:** Data entry and document management focused
- **Widgets:** Task-based operational widgets
- **Actions:** Data entry, document uploads

---

## MODULE STRUCTURE

### Page Layout
- **No Tabs:** Single-page dashboard (all content visible on scroll)
- **Sections:** Organized in logical reading order (top to bottom)
- **Responsive Grid:** 12-column Bootstrap grid
- **Auto-refresh:** Every 5 minutes (with manual refresh button)
- **Print-friendly:** CSS print styles for board reports

### Dashboard Sections (Order)
1. Header with FSP License Status
2. Overall Compliance Health Score (Hero Section)
3. Critical Alerts & Action Items
4. Team Compliance Overview
5. Compliance by Area (6 cards)
6. CPD Progress Widget
7. FICA Status Widget
8. Recent Activity Timeline
9. Upcoming Deadlines Calendar
10. Quick Actions Panel
11. Key Statistics (Bottom)

---

## 1. HEADER WITH FSP LICENSE STATUS

### Top Banner (Full Width)

**Left Side:**
- Company Logo (customizable upload)
- FSP Name: **ABC Financial Services (Pty) Ltd**
- FSP Number: **FSP 12345**
- License Status: **✓ ACTIVE** (green badge)

**Center:**
- Page Title: **"Executive Dashboard"**
- Subtitle: **"Compliance Overview & Team Performance"**
- Last Updated: **15/12/2024 14:30** (auto-updating)

**Right Side:**
- User Profile: **Thabo Mokoena** (FSP Owner)
- [🔔 Alerts: 12] (badge with count)
- [⚙️ Settings]
- [🔄 Refresh] button
- [📊 Export Dashboard] dropdown
  - Export to PDF
  - Export to Excel
  - Email to Board
  - Schedule Weekly Email

---

### FSP License Information Card (Collapsible)

**Status Banner:**
- License Status: **ACTIVE** ✓ (large green badge)
- Valid Until: **14/03/2026** (441 days remaining)
- Next Renewal: **14/03/2026**
- License Type: **Category I - Long-term Insurance, Investments**

**Key Details (Expandable):**
- **License Issue Date:** 15/03/2015
- **Years Licensed:** 9 years, 9 months
- **Authorized Categories:**
  - Long-term Insurance (Life, Disability, Health)
  - Investment Products (Unit Trusts, ETFs, Collective Investments)
- **Representatives:** 12 active, 0 suspended
- **Key Individuals:** 3 appointed
- **Compliance Officer:** Sarah Naidoo

**Insurance Status:**
- **Professional Indemnity:**
  - Status: ✓ Current (green)
  - Insurer: Guardrisk
  - Policy Number: PI-2024-789456
  - Coverage: R5,000,000 (exceeds R2M minimum)
  - Expiry: 15/01/2025 (31 days) ⚠️ (amber warning)
  - [Upload Renewal] button
  
- **Fidelity Guarantee:**
  - Status: ✓ Current (green)
  - Insurer: Santam
  - Policy Number: FG-2024-123789
  - Coverage: R3,000,000
  - Expiry: 28/02/2025 (75 days) (green)

**Quick Actions:**
- [View Full License Details]
- [Download License Certificate]
- [Update License Information]
- [Renewal Reminders]

---

## 2. OVERALL COMPLIANCE HEALTH SCORE (Hero Section)

### Large Centered Card (Prominent Display)

**Main Health Score (Center):**
- **Huge Circular Progress Indicator (Donut Chart)**
  - Outer ring: 300px diameter
  - Score: **87%** (extra-large font, 72px)
  - Color: Green (#28A745) for 85-100%, Amber (#FFC107) for 70-84%, Red (#DC3545) for 0-69%
  - Animated on page load (sweeps from 0% to 87%)
  - Center label: **"OVERALL COMPLIANCE"**
  - Sub-label: **"Good Standing"** (green text)

**Trend Indicator (Below Score):**
- Arrow: **↑ +3%** vs last month (green with up arrow)
- Text: **"Improving"** or **"Declining"** or **"Stable"**
- Link: **"View 12-month trend"** (opens chart modal)

**Score Breakdown (Around Donut Chart):**

**Six Mini Gauges (Radial arrangement around main donut):**

1. **Fit & Proper: 92%** (green)
   - Icon: 🎓
   - Status: 11/12 compliant
   - Click to: Fit & Proper module

2. **CPD: 75%** (amber)
   - Icon: 📚
   - Status: 9/12 compliant
   - Days to deadline: 167 days
   - Click to: CPD module

3. **FICA: 88%** (green)
   - Icon: 🔍
   - Status: 580/660 clients
   - Click to: FICA module

4. **Documents: 95%** (green)
   - Icon: 📁
   - Status: 850/895 current
   - Click to: Documents module

5. **Insurance: 100%** (green)
   - Icon: 🛡️
   - Status: All current
   - Click to: Settings > Insurance

6. **TCF: 85%** (green)
   - Icon: ✋
   - Status: Compliant
   - Click to: Compliance > TCF

**Calculation Methodology (Info Icon Tooltip):**
```
Health Score = Weighted Average:
- Fit & Proper: 25%
- CPD: 25%
- FICA: 20%
- Documentation: 15%
- Insurance: 10%
- Other (TCF, Supervision): 5%

Current Calculation:
(0.92 × 0.25) + (0.75 × 0.25) + (0.88 × 0.20) + 
(0.95 × 0.15) + (1.00 × 0.10) + (0.85 × 0.05) = 0.87 = 87%
```

**Below Health Score:**
- **Last Full Audit:** 10/12/2024 (5 days ago)
- **Next Scheduled Audit:** 20/12/2024 (5 days)
- [Schedule Audit] [Run Quick Check] [View Audit History]

---

## 3. CRITICAL ALERTS & ACTION ITEMS

### High-Visibility Alert Section (Red/Amber Background)

**Section Title:** **"⚠️ REQUIRES IMMEDIATE ATTENTION"**

**Alert Priority Cards (Horizontal Row):**

**Card 1: CRITICAL (Red, Pulsing Animation)**
- **Count:** 1
- **Icon:** 🔴 (large, pulsing)
- **Label:** "CRITICAL ISSUE"
- **Summary:** "Mike Johnson's RE5 expired 2 days ago"
- **Due:** OVERDUE (red text)
- **Action:** [View Details] [Take Action]
- **Border:** Thick red border
- **Background:** Light red tint (#FFE5E5)

**Card 2: HIGH PRIORITY (Orange)**
- **Count:** 3
- **Icon:** 🟠
- **Label:** "HIGH PRIORITY"
- **Top Item:** "45 FICA reviews overdue"
- **Due:** 6 days remaining
- **Action:** [View All 3] [Take Action]
- **Border:** Orange border
- **Background:** Light orange tint

**Card 3: MEDIUM PRIORITY (Yellow)**
- **Count:** 5
- **Icon:** 🟡
- **Label:** "MEDIUM PRIORITY"
- **Top Item:** "3 reps behind CPD schedule"
- **Due:** 30 days remaining
- **Action:** [View All 5]
- **Border:** Yellow border

**Card 4: UPCOMING DEADLINES (Blue)**
- **Count:** 8
- **Icon:** 📅
- **Label:** "UPCOMING DEADLINES"
- **Next:** "Quarterly FSCA return - 31/01/2025"
- **Action:** [View Calendar]
- **Border:** Blue border

**Quick Actions Bar:**
- [View All Alerts (17)]
- [Create Custom Alert]
- [Dismiss Selected]
- [Generate Alert Report]

---

## 4. TEAM COMPLIANCE OVERVIEW

### Section Title: **"Team Performance & Compliance Status"**

**Summary Cards Row (4 cards):**

**Card 1: Total Representatives**
- **Number:** 12 (extra-large)
- **Label:** Active Representatives
- **Breakdown:**
  - ✓ Compliant: 11 (92%) - green
  - ✗ Non-Compliant: 1 (8%) - red
- **Change:** +1 this month (green arrow up)
- **Visual:** 12 circular avatars (11 green, 1 red)
- **Action:** [View Team Matrix]

**Card 2: Average Compliance Score**
- **Number:** 87% (extra-large, green)
- **Label:** Team Average
- **Breakdown:**
  - Highest: 98% (Sarah Naidoo)
  - Lowest: 45% (Mike Johnson)
- **Change:** +2% vs last month
- **Visual:** Bell curve distribution chart
- **Action:** [View Rankings]

**Card 3: At Risk Representatives**
- **Number:** 3 (amber)
- **Label:** Need Attention
- **Names:**
  - Mike Johnson (45% - critical)
  - Johan Smith (68% - warning)
  - Peter Nel (72% - warning)
- **Visual:** 3 profile cards with scores
- **Action:** [Send Reminders] [View Details]

**Card 4: Recent Achievements**
- **Number:** 5 (green)
- **Label:** This Week
- **Achievements:**
  - Sarah Naidoo: CPD completed (18/18 hrs)
  - Thabo Mokoena: FICA audit passed
  - Lisa van Wyk: RE5 renewed
- **Visual:** Achievement badges
- **Action:** [View All]

---

### Team Compliance Matrix (Mini Version)

**Interactive Table (Sortable, Click to Expand):**

**Columns:**
| Rep Name | F&P | CPD | FICA | Docs | Overall | Actions |

**Sample Rows:**

**Row 1: (Green - Top Performer)**
- **Sarah Naidoo** (avatar)
- F&P: ✓ (green circle)
- CPD: 20/18 hrs ✓ (green, 111%)
- FICA: ✓ (green)
- Docs: ✓ (green)
- Overall: **98%** (green badge)
- Actions: [👁️ View] [📧 Message]

**Row 2: (Amber - On Track)**
- **Thabo Mokoena** (avatar)
- F&P: ✓ (green)
- CPD: 14/18 hrs ⚠️ (amber, 78%)
- FICA: ✓ (green)
- Docs: ✓ (green)
- Overall: **85%** (green badge)
- Actions: [👁️ View] [📧 Message]

**Row 3: (Red - Critical)**
- **Mike Johnson** (avatar)
- F&P: ✗ RE5 Expired (red)
- CPD: 8/18 hrs ⚠️ (amber, 44%)
- FICA: ✓ (green)
- Docs: ⚠️ 2 expired (amber)
- Overall: **45%** (red badge, pulsing)
- Actions: [🚨 Urgent] [👁️ View] [📧 Alert]

**Row 4-12:** (Collapsed by default)
- Show [+] Expand All / [-] Collapse All toggle

**Below Table:**
- [View Full Team Matrix] (opens dedicated page)
- [Export to Excel]
- [Send Bulk Reminder]
- [Generate Team Report]

---

## 5. COMPLIANCE BY AREA (Six Cards)

### Grid Layout (2 rows × 3 columns on desktop)

**Card 1: Fit & Proper Requirements**

**Header:**
- Icon: 🎓 (large)
- Title: **Fit & Proper**
- Status: **92% Compliant** (green badge)

**Main Metric:**
- **11 / 12 Representatives** (large font)
- Progress bar: 92% filled (green)

**Breakdown:**
- ✓ RE5 Current: 11 (1 expired)
- ✓ RE1 Current: 11 (1 expired)
- ✓ Class of Business: 12
- ✓ Background Checks: 12
- ✗ **Issues: 1 Critical**

**Critical Issue Alert:**
- 🔴 Mike Johnson: RE5 expired 13/12/2024
- [View Details] [Take Action]

**Trend (Sparkline):**
- Last 6 months: [▂▃▅▃▂▁] (declining trend)
- Last month: -8%

**Quick Actions:**
- [View All Representatives]
- [Run F&P Audit]
- [Generate Report]
- [Upload Certificate]

---

**Card 2: CPD Management**

**Header:**
- Icon: 📚
- Title: **CPD Compliance**
- Status: **75% Compliant** (amber badge)

**Main Metric:**
- **9 / 12 Representatives** (large)
- On track for 31 May 2025 deadline
- Progress bar: 75% (amber)

**Breakdown:**
- ✓ Completed (18+ hrs): 9
- ⚠️ In Progress (10-17 hrs): 2
- ✗ At Risk (< 10 hrs): 1
- 📅 Days to Deadline: **167 days**

**Team CPD Hours:**
- Total Hours: 165 hrs
- Average: 13.75 hrs per person
- Required: 18 hrs per person
- Ethics Hours: 42 hrs (average 3.5 hrs/person) ✓

**Projected Completion:**
- At current pace: **95% will be compliant**
- Estimated completion date: 15/04/2025
- Risk level: LOW (sufficient time)

**Pending Verifications:**
- ⏳ 3 certificates awaiting verification
- [Review Queue]

**Quick Actions:**
- [View CPD Dashboard]
- [Verify Certificates]
- [Send Reminders]
- [Annual CPD Report]

---

**Card 3: FICA Compliance**

**Header:**
- Icon: 🔍
- Title: **FICA Verification**
- Status: **88% Compliant** (green badge)

**Main Metric:**
- **580 / 660 Clients** (large)
- Progress bar: 88% (green)

**Breakdown:**
- ✓ Current: 580 clients
- ⚠️ Reviews Due (30 days): 35
- ✗ Overdue: 45
- 🔴 High Risk (annual): 25 (all current ✓)

**By Risk Category:**
- Low Risk (5-year): 495 clients (15 overdue)
- Medium Risk (3-year): 115 clients (25 overdue)
- High Risk (1-year): 25 clients (5 reviews due)
- EDD Clients: 8 clients (all current)

**Recent Activity:**
- Last 7 days: 12 reviews completed
- This month: 45 reviews completed
- Overdue rate: 6.8% (improving)

**Quick Actions:**
- [View FICA Dashboard]
- [Schedule Reviews]
- [Overdue List]
- [FICA Report]

---

**Card 4: Document Management**

**Header:**
- Icon: 📁
- Title: **Document Compliance**
- Status: **95% Compliant** (green badge)

**Main Metric:**
- **850 / 895 Documents Current** (large)
- Progress bar: 95% (green)

**Breakdown:**
- ✓ Active & Current: 850
- ⚠️ Expiring (90 days): 30
- ✗ Expired: 15
- 📦 5-Year Retention: 100% compliant

**Storage Status:**
- Used: 2.4 GB / 10 GB (24%)
- Documents: 895 total
- Average file size: 2.7 MB

**Categories:**
- CPD Certificates: 124 (98% current)
- FICA Documentation: 235 (92% current)
- Client Agreements: 186 (96% current)
- Qualifications: 45 (89% current)
- Other: 305 (95% current)

**Actions Required:**
- ⚠️ 15 expired documents need update
- ⚠️ 30 documents expiring in 90 days
- ✓ All retention requirements met

**Quick Actions:**
- [View Document Library]
- [Upload Documents]
- [Expiring Documents]
- [Retention Report]

---

**Card 5: Insurance Coverage**

**Header:**
- Icon: 🛡️
- Title: **Insurance Policies**
- Status: **100% Compliant** (green badge)

**Main Metric:**
- **ALL POLICIES CURRENT** ✓ (large, green)
- Progress bar: 100% (green)

**Professional Indemnity:**
- Status: ✓ Current
- Coverage: R5,000,000
- Minimum: R2,000,000 (250% of minimum) ✓
- Insurer: Guardrisk
- Expiry: 15/01/2025
- ⚠️ **31 days to renewal** (amber warning)
- [Upload Renewal Quote]

**Fidelity Guarantee:**
- Status: ✓ Current
- Coverage: R3,000,000
- Insurer: Santam
- Expiry: 28/02/2025
- ✓ 75 days to renewal (green)

**Premium Status:**
- PI Premium: Paid to date ✓
- FG Premium: Paid to date ✓
- Next payment: 15/01/2025 (R24,500)

**Claims History:**
- Year to date: 0 claims
- Last 5 years: 2 claims (both settled)

**Quick Actions:**
- [View Policies]
- [Upload Renewal]
- [Set Reminders]
- [Claims History]

---

**Card 6: Supervision & Oversight**

**Header:**
- Icon: 👥
- Title: **Representative Supervision**
- Status: **100% Compliant** (green badge)

**Main Metric:**
- **ALL REPS SUPERVISED** ✓ (large)
- Supervision Ratio: **1:4** (well within 1:15 limit)

**Key Individuals:**
- Total KIs: 3
- Total Reps: 12
- Average ratio: 1:4

**KI Breakdown:**
- **Thabo Mokoena (KI):** 5 supervised reps
- **Johan Smit (KI):** 4 supervised reps
- **Sarah Naidoo (KI/CO):** 3 supervised reps

**Supervision Compliance:**
- ✓ All reps assigned to KI: 12/12
- ✓ Supervision agreements: 12/12 signed
- ✓ Regular meetings: 100% compliance
- ✓ Supervision notes: Current for all

**Recent Supervision Activity:**
- This month: 36 meetings logged
- Average per rep: 3 meetings/month
- Issues identified: 2 (both addressed)

**Quick Actions:**
- [View Hierarchy]
- [Supervision Schedule]
- [Meeting Notes]
- [Supervision Report]

---

## 6. CPD PROGRESS WIDGET

### Compact CPD Status Card

**Header:**
- Title: **CPD Progress Tracker**
- Subtitle: "Annual cycle: 1 June 2024 - 31 May 2025"

**Countdown Clock (Prominent):**
- **167 DAYS** remaining (large font)
- Progress bar: 52% of year elapsed
- Status: ON TRACK ✓ (green)

**Team Progress Donut Chart:**
- Completed: 9 reps (75% - green segment)
- In Progress: 2 reps (17% - amber segment)
- At Risk: 1 rep (8% - red segment)

**Quick Stats:**
- Team Total: 165 hours
- Team Average: 13.75 hrs/person
- Target: 18 hrs/person (216 total)
- Ethics: 42 hrs (avg 3.5) ✓

**Top Performers:**
1. 🥇 Sarah Naidoo: 20 hrs (111%)
2. 🥈 Lisa van Wyk: 19 hrs (106%)
3. 🥉 Pieter Venter: 18.5 hrs (103%)

**Need Attention:**
- 🔴 Mike Johnson: 8 hrs (44%)
- ⚠️ Johan Smith: 12 hrs (67%)
- ⚠️ Peter Nel: 13 hrs (72%)

**Projection:**
- At current pace: 95% compliant by deadline
- Estimated shortfall: 1 rep (Mike Johnson)
- Recommended action: Immediate CPD scheduling

**Quick Actions:**
- [View CPD Dashboard]
- [Send Reminders]
- [Schedule Training]
- [Progress Report]

---

## 7. FICA STATUS WIDGET

### Compact FICA Overview Card

**Header:**
- Title: **FICA Review Status**
- Subtitle: "Client verification compliance"

**Overall Status:**
- **88% Compliant** (green badge)
- 580 / 660 clients current

**By Risk Category (Stacked Bar):**

**Low Risk (5-year review):**
- Total: 495 clients
- Current: 480 (97%) - green
- Overdue: 15 (3%) - red
- Due next 90 days: 12

**Medium Risk (3-year review):**
- Total: 115 clients
- Current: 90 (78%) - amber
- Overdue: 25 (22%) - red
- Due next 90 days: 18

**High Risk (Annual review):**
- Total: 25 clients
- Current: 25 (100%) - green
- Overdue: 0
- Due next 90 days: 5

**EDD Clients:**
- Total: 8 clients
- Current: 8 (100%) - green
- Enhanced monitoring: Active

**Upcoming Reviews (Next 30 Days):**
- Due this week: 5 clients
- Due this month: 35 clients
- [Schedule Now]

**Recent Activity:**
- Last 7 days: 12 reviews completed
- This month: 45 reviews completed
- Average review time: 25 minutes

**Quick Actions:**
- [View FICA Dashboard]
- [Schedule Reviews]
- [Overdue List (45)]
- [FICA Report]

---

## 8. RECENT ACTIVITY TIMELINE

### Activity Feed (Last 14 Days)

**Section Title:** **"Recent Activity & System Events"**

**Filter Tabs:**
- All Activity (default)
- Critical Only
- My Activity
- Team Activity
- System Events

**Timeline Entries (Most Recent First):**

**Entry 1: (Today, 2 hours ago)**
- **Time:** 15/12/2024 12:30
- **Icon:** 🟢 (green circle)
- **User:** Sarah Naidoo (avatar + name)
- **Action:** "Verified CPD certificate for Thabo Mokoena"
- **Details:** 2.0 hours Ethics - FICA Compliance Workshop
- **Category:** CPD (blue badge)
- [View Details] [View Certificate]

**Entry 2: (Today, 4 hours ago)**
- **Time:** 15/12/2024 10:15
- **Icon:** 🟡 (amber circle)
- **User:** System (automated)
- **Action:** "Alert created: 45 FICA reviews overdue"
- **Details:** Medium-risk clients require 3-year reviews
- **Category:** FICA (purple badge)
- [View Alert] [Schedule Reviews]

**Entry 3: (Yesterday)**
- **Time:** 14/12/2024 16:45
- **Icon:** 🟢
- **User:** Johan Smit
- **Action:** "Completed internal audit: Q4 FICA Compliance"
- **Details:** Overall score: 88%, 6 findings (0 critical, 2 major, 4 minor)
- **Category:** Audit (orange badge)
- [View Report] [View Findings]

**Entry 4: (2 days ago)**
- **Time:** 13/12/2024 08:00
- **Icon:** 🔴 (red circle, pulsing)
- **User:** System (automated)
- **Action:** "CRITICAL: Mike Johnson's RE5 certificate expired"
- **Details:** Certificate expired 13/12/2024, rep suspended
- **Category:** Fit & Proper (red badge)
- [View Details] [Take Action]

**Entry 5: (3 days ago)**
- **Time:** 12/12/2024 14:20
- **Icon:** 🟢
- **User:** Thabo Mokoena
- **Action:** "Approved new representative: Lisa van der Walt"
- **Details:** Onboarding complete, all F&P requirements met
- **Category:** Representatives (blue badge)
- [View Profile]

**Entry 6: (5 days ago)**
- **Time:** 10/12/2024 09:30
- **Icon:** 🟢
- **User:** Sarah Naidoo
- **Action:** "Submitted quarterly return to FSCA"
- **Details:** Q4 2024 submission, reference: FSCA/SUB/2024/456
- **Category:** FSCA (green badge)
- [View Submission] [Download Confirmation]

**Entry 7: (7 days ago)**
- **Time:** 08/12/2024 11:00
- **Icon:** 🟢
- **User:** Lisa van Wyk
- **Action:** "Completed CPD: 18.5 hours total"
- **Details:** Exceeded requirement (18 hrs), 3.5 ethics hours
- **Category:** CPD (blue badge)
- [View CPD Record]

**Entry 8: (10 days ago)**
- **Time:** 05/12/2024 15:30
- **Icon:** 🟢
- **User:** Admin Staff
- **Action:** "Uploaded 23 new client FICA documents"
- **Details:** Bulk upload completed successfully
- **Category:** Documents (teal badge)
- [View Documents]

**Show More Activity** (button to load older entries)

**Activity Summary (Past 30 Days):**
- Total Activities: 247
- Critical Events: 3
- Documents Uploaded: 156
- CPD Records Added: 45
- Compliance Checks: 12
- Audits Completed: 3

---

## 9. UPCOMING DEADLINES CALENDAR

### Calendar Widget (Next 90 Days)

**Section Title:** **"📅 Upcoming Deadlines & Important Dates"**

**View Options:**
- [List View] (default)
- [Calendar View]
- [Timeline View]

**Filter:**
- All Categories
- CPD
- FICA
- Insurance
- FSCA Submissions
- Representative Renewals
- Audits

---

**List View (Sorted by Date):**

**Deadline 1: OVERDUE (Red background)**
- **Date:** 13/12/2024 (2 days ago)
- **Priority:** 🔴 CRITICAL
- **Event:** Mike Johnson RE5 Certificate Expired
- **Category:** Fit & Proper
- **Assigned:** Sarah Naidoo
- **Status:** OVERDUE - Action required
- [Resolve Now]

**Deadline 2: THIS WEEK (Amber background)**
- **Date:** 20/12/2024 (5 days)
- **Priority:** 🟠 HIGH
- **Event:** Q4 FICA Internal Audit
- **Category:** Internal Audit
- **Assigned:** Johan Smit
- **Status:** Scheduled
- [View Checklist] [Reschedule]

**Deadline 3: THIS MONTH**
- **Date:** 31/12/2024 (16 days)
- **Priority:** 🟡 MEDIUM
- **Event:** TCF Training for New Representatives
- **Category:** Training
- **Assigned:** Compliance Officer
- **Status:** Not Started
- [Schedule Training]

**Deadline 4: NEXT MONTH**
- **Date:** 15/01/2025 (31 days)
- **Priority:** 🟠 HIGH
- **Event:** Professional Indemnity Insurance Renewal
- **Category:** Insurance
- **Assigned:** Thabo Mokoena (FSP Owner)
- **Status:** Renewal quote requested
- [Upload Renewal] [View Policy]

**Deadline 5:**
- **Date:** 31/01/2025 (47 days)
- **Priority:** 🟠 HIGH
- **Event:** Quarterly FSCA Return Submission (Q4 2024)
- **Category:** FSCA Submission
- **Assigned:** Sarah Naidoo
- **Status:** Not Started
- [Prepare Submission]

**Deadline 6:**
- **Date:** 15/02/2025 (62 days)
- **Priority:** 🟡 MEDIUM
- **Event:** Complete 45 Overdue FICA Reviews
- **Category:** FICA
- **Assigned:** Compliance Team
- **Status:** In Progress (12/45 completed)
- [View Progress]

**Deadline 7:**
- **Date:** 28/02/2025 (75 days)
- **Priority:** 🟡 MEDIUM
- **Event:** Fidelity Guarantee Insurance Renewal
- **Category:** Insurance
- **Assigned:** Thabo Mokoena
- **Status:** Scheduled (renewal quote expected mid-Jan)

**Deadline 8:**
- **Date:** 31/03/2025 (106 days)
- **Priority:** 🟠 HIGH
- **Event:** Annual FSP Return to FSCA
- **Category:** FSCA Submission
- **Assigned:** Compliance Officer
- **Status:** Not Started
- [View Requirements]

**Deadline 9: CRITICAL ANNUAL DEADLINE**
- **Date:** 31/05/2025 (167 days)
- **Priority:** 🔴 CRITICAL
- **Event:** CPD Annual Deadline (18 hours required)
- **Category:** CPD
- **Assigned:** All Representatives
- **Status:** 75% on track, 3 at risk
- [View CPD Dashboard]

**Show All Deadlines (42 upcoming)** button

---

**Mini Calendar View (Visual):**

**December 2024:**
```
Su Mo Tu We Th Fr Sa
 1  2  3  4  5  6  7
 8  9 10 11 12 13 14
15 16 17 18 19 [20]21  ← Q4 FICA Audit
22 23 24 25 26 27 28
29 30 [31]              ← TCF Training
```

**January 2025:**
```
Su Mo Tu We Th Fr Sa
          1  2  3  4
 5  6  7  8  9 10 11
12 13 14 [15]16 17 18  ← PI Insurance
19 20 21 22 23 24 25
26 27 28 29 30 [31]    ← FSCA Return
```

**Color Legend:**
- 🔴 Red: Critical/Overdue
- 🟠 Orange: High priority
- 🟡 Yellow: Medium priority
- 🟢 Green: Completed

---

## 10. QUICK ACTIONS PANEL

### Floating Action Panel (Right Side or Bottom on Mobile)

**Section Title:** **"⚡ Quick Actions"**

**Grouped by Category:**

**Compliance Actions:**
- [+ Create Alert]
- [📋 Schedule Audit]
- [✓ Run Quick Check]
- [📊 Generate Report]

**Team Management:**
- [+ Add Representative]
- [📧 Send Team Reminder]
- [👥 View Team Matrix]
- [📈 Team Performance]

**Documents:**
- [📤 Upload Document]
- [📁 Bulk Upload]
- [🔍 Search Documents]
- [📋 Expiring Docs (45)]

**CPD Management:**
- [+ Add CPD Record]
- [✓ Verify Certificate]
- [📩 Send CPD Reminders]
- [📊 CPD Progress Report]

**FICA:**
- [+ Add Client]
- [📅 Schedule FICA Review]
- [🔍 Run PEP Screen]
- [📋 Overdue Reviews (45)]

**System:**
- [⚙️ Settings]
- [👤 User Management]
- [📧 Email Templates]
- [🔔 Alert Rules]

**Reports:**
- [📄 Executive Summary]
- [📊 Team Compliance]
- [📈 Trend Analysis]
- [📧 Email to Board]

---

## 11. KEY STATISTICS (Bottom Section)

### Statistics Dashboard (4 rows × 3 columns)

**Row 1: Team Metrics**

**Stat 1:**
- **Number:** 12
- **Label:** Active Representatives
- **Change:** +1 this month ↑ (green)
- **Icon:** 👥

**Stat 2:**
- **Number:** 87%
- **Label:** Average Compliance Score
- **Change:** +2% vs last month ↑ (green)
- **Icon:** 📊

**Stat 3:**
- **Number:** 3
- **Label:** Key Individuals
- **Change:** No change (neutral)
- **Icon:** 🎖️

---

**Row 2: Client Metrics**

**Stat 4:**
- **Number:** 660
- **Label:** Active Clients
- **Change:** +23 this quarter ↑ (green)
- **Icon:** 👤

**Stat 5:**
- **Number:** 88%
- **Label:** FICA Compliant
- **Change:** +3% this month ↑ (green)
- **Icon:** 🔍

**Stat 6:**
- **Number:** 45
- **Label:** Overdue FICA Reviews
- **Change:** -5 vs last month ↓ (green improvement)
- **Icon:** ⚠️

---

**Row 3: Document & Activity Metrics**

**Stat 7:**
- **Number:** 895
- **Label:** Total Documents
- **Change:** +45 this week ↑
- **Icon:** 📁

**Stat 8:**
- **Number:** 95%
- **Label:** Documents Current
- **Change:** +1% this month ↑ (green)
- **Icon:** ✓

**Stat 9:**
- **Number:** 2.4 GB
- **Label:** Storage Used (of 10 GB)
- **Change:** 24% capacity
- **Icon:** 💾

---

**Row 4: Compliance Activity Metrics**

**Stat 10:**
- **Number:** 12
- **Label:** Compliance Checks (30 days)
- **Change:** +2 vs previous period ↑
- **Icon:** ✓

**Stat 11:**
- **Number:** 3
- **Label:** Audits Completed (this quarter)
- **Change:** On schedule ✓
- **Icon:** 📋

**Stat 12:**
- **Number:** 2
- **Label:** Active Complaints
- **Change:** -1 vs last month ↓ (green)
- **Icon:** 📝

---

## SAMPLE DATA

**Current User: Thabo Mokoena**
- Role: FSP Owner / Principal
- Email: thabo.mokoena@abcfinancial.co.za
- Phone: +27 82 555 7890
- Company: ABC Financial Services (Pty) Ltd
- FSP Number: 12345

**FSP Details:**
- License Status: ACTIVE ✓
- License Expiry: 14/03/2026 (441 days)
- Categories: Long-term Insurance, Investments
- Years Licensed: 9 years, 9 months
- Representatives: 12 active
- Key Individuals: 3
- Compliance Officer: Sarah Naidoo

**Overall Compliance Status:**
- Health Score: 87% (GREEN)
- Trend: +3% vs last month (improving)
- Last Audit: 10/12/2024 (5 days ago)
- Next Audit: 20/12/2024 (5 days)

**Breakdown by Area:**
- Fit & Proper: 92% (11/12 compliant)
- CPD: 75% (9/12 compliant, 167 days to deadline)
- FICA: 88% (580/660 clients current)
- Documents: 95% (850/895 current)
- Insurance: 100% (all policies current, PI renewal in 31 days)
- Supervision: 100% (all reps supervised, ratio 1:4)

**Active Issues:**
- Critical: 1 (Mike Johnson RE5 expired)
- High: 3 (45 FICA overdue, PI renewal soon, quarterly return due)
- Medium: 5 (3 CPD behind schedule, TCF training, target market update)
- Low: 8 (various minor items)
- Total: 17 active issues

**Team Performance:**
- Total Reps: 12
- Compliant: 11 (92%)
- Non-Compliant: 1 (8%)
- Average Score: 87%
- Top Performer: Sarah Naidoo (98%)
- Needs Attention: Mike Johnson (45% - critical)

**CPD Status:**
- Team Total: 165 hours
- Team Average: 13.75 hrs/person
- Required: 18 hrs/person
- Completed: 9 reps (75%)
- In Progress: 2 reps
- At Risk: 1 rep
- Days to Deadline: 167 days

**FICA Status:**
- Total Clients: 660
- Current: 580 (88%)
- Reviews Due (30 days): 35
- Overdue: 45
- High Risk: 25 (all current)

**Insurance Status:**
- PI Policy: Current, expires 15/01/2025 (31 days) ⚠️
- PI Coverage: R5,000,000 (250% of minimum)
- FG Policy: Current, expires 28/02/2025 (75 days) ✓
- FG Coverage: R3,000,000

**Recent Activity (Last 7 Days):**
- Compliance checks: 3
- CPD records added: 8
- FICA reviews: 12
- Documents uploaded: 45
- Alerts created: 4
- Audits completed: 1

**Current Date:** 15/12/2024
**Current Time:** 14:30
**Last Refresh:** 15/12/2024 14:25 (5 minutes ago)
**Next Auto-Refresh:** 15/12/2024 14:30 (30 seconds)

---

## TECHNICAL REQUIREMENTS

### Performance
- Initial page load: < 3 seconds
- Dashboard data refresh: < 1 second
- Chart rendering: < 500ms
- Auto-refresh: Every 5 minutes (configurable)
- Manual refresh: Instant (with loading indicator)

### Responsive Breakpoints
- Mobile: < 768px (single column, stacked cards)
- Tablet: 768px - 1024px (2 columns)
- Desktop: > 1024px (3 columns, full layout)
- Large Desktop: > 1440px (4 columns for statistics)

### Charts & Visualizations
- Use Chart.js 4.0+
- Donut chart: Health score (animated)
- Bar charts: Compliance breakdown, CPD progress
- Line charts: Trend analysis
- Sparklines: Recent activity trends
- All charts: Responsive, print-friendly

### Real-Time Updates
- WebSocket connection for live alerts (optional Phase 2)
- Polling: Every 5 minutes (Phase 1)
- Manual refresh button
- Visual indicator when data is stale (> 10 minutes)

### Print Functionality
- Print-optimized CSS
- Remove navigation, sidebars
- Black & white friendly
- Page breaks at logical sections
- Include print date/time
- [Print Dashboard] button

### Export Functionality
- **PDF:** High-quality board report (jsPDF)
  - Include company logo
  - Executive summary on page 1
  - Detailed metrics on pages 2-3
  - Charts and graphs
  - Footer with page numbers
- **Excel:** Raw data export (SheetJS)
  - Multiple worksheets
  - Formatted tables
  - Charts included
- **Email:** Send to board/management
  - PDF attachment
  - Email body with executive summary
  - Scheduled weekly emails

### Accessibility
- ARIA labels on all interactive elements
- Keyboard navigation (Tab, Enter, Arrow keys)
- Screen reader compatible
- Focus indicators
- High contrast mode support
- Colorblind-friendly palette (not just red/green)

### Security
- Role-based data filtering (server-side)
- No sensitive data in localStorage
- Session timeout: 30 minutes
- Audit trail for all dashboard actions
- HTTPS only

---

## API ENDPOINTS

```
GET /api/dashboard/executive
  - Returns complete dashboard data for current user
  - Response includes: health score, compliance breakdown, alerts, team stats, recent activity

GET /api/dashboard/health-score
  - Returns overall compliance health score
  - Includes: score, trend, breakdown by area

GET /api/dashboard/alerts?priority={priority}
  - Returns alerts filtered by priority
  - Priority: critical | high | medium | low | all

GET /api/dashboard/team-overview
  - Returns team compliance summary
  - Includes: total reps, average score, at-risk reps, achievements

GET /api/dashboard/compliance-areas
  - Returns status for all 6 compliance areas
  - Includes: F&P, CPD, FICA, Documents, Insurance, Supervision

GET /api/dashboard/cpd-widget
  - Returns CPD progress summary
  - Includes: team progress, days remaining, top performers, at-risk

GET /api/dashboard/fica-widget
  - Returns FICA status summary
  - Includes: overall compliance, by risk category, upcoming reviews

GET /api/dashboard/recent-activity?limit={limit}
  - Returns recent activity timeline
  - Limit: 10-100 (default 20)

GET /api/dashboard/upcoming-deadlines?days={days}
  - Returns upcoming deadlines
  - Days: 30, 60, 90, 180, 365 (default 90)

GET /api/dashboard/statistics
  - Returns key statistics for bottom section
  - Includes: all 12 stat metrics

POST /api/dashboard/export
  - Request: { format: 'pdf' | 'excel', sections: [] }
  - Response: File download or email confirmation

GET /api/dashboard/refresh
  - Forces data refresh
  - Returns: { success: true, timestamp: '...' }
```

---

## FILE STRUCTURE

```
executive-dashboard/
├── index.html
├── css/
│   ├── dashboard.css
│   ├── health-score.css
│   ├── cards.css
│   ├── widgets.css
│   ├── timeline.css
│   ├── print.css
│   └── responsive.css
├── js/
│   ├── dashboard-main.js
│   ├── health-score.js
│   ├── team-overview.js
│   ├── compliance-areas.js
│   ├── widgets.js
│   ├── activity-timeline.js
│   ├── deadlines-calendar.js
│   ├── quick-actions.js
│   ├── statistics.js
│   ├── charts.js
│   ├── auto-refresh.js
│   ├── export.js
│   └── data.js
└── assets/
    ├── icons/
    ├── charts/
    └── exports/
```

---

## BUSINESS LOGIC

### Health Score Calculation
```javascript
function calculateHealthScore(data) {
  const weights = {
    fitAndProper: 0.25,  // 25%
    cpd: 0.25,           // 25%
    fica: 0.20,          // 20%
    documentation: 0.15, // 15%
    insurance: 0.10,     // 10%
    other: 0.05          // 5% (TCF, supervision)
  };
  
  const scores = {
    fitAndProper: data.f_p_compliant_reps / data.total_reps,
    cpd: data.cpd_compliant_reps / data.total_reps,
    fica: data.fica_compliant_clients / data.total_clients,
    documentation: data.current_documents / data.total_documents,
    insurance: (data.pi_current && data.fg_current) ? 1.0 : 0.0,
    other: calculateOtherScore(data)
  };
  
  const weightedScore = Object.keys(weights).reduce((total, key) => {
    return total + (scores[key] * weights[key]);
  }, 0);
  
  return {
    score: Math.round(weightedScore * 100),
    breakdown: scores,
    status: getScoreStatus(weightedScore * 100)
  };
}

function getScoreStatus(score) {
  if (score >= 85) return { label: 'Good Standing', color: 'green' };
  if (score >= 70) return { label: 'Needs Attention', color: 'amber' };
  return { label: 'Critical', color: 'red' };
}
```

### Auto-Refresh Logic
```javascript
let refreshInterval = 5 * 60 * 1000; // 5 minutes
let refreshTimer;

function startAutoRefresh() {
  refreshTimer = setInterval(() => {
    refreshDashboardData();
  }, refreshInterval);
}

function refreshDashboardData() {
  // Show loading indicator
  showLoadingIndicator();
  
  // Fetch fresh data
  fetch('/api/dashboard/executive')
    .then(response => response.json())
    .then(data => {
      updateDashboard(data);
      updateLastRefreshTime();
      hideLoadingIndicator();
    })
    .catch(error => {
      console.error('Refresh failed:', error);
      showErrorNotification('Unable to refresh dashboard');
    });
}

function updateLastRefreshTime() {
  const now = new Date();
  document.getElementById('last-updated').textContent = 
    formatDateTime(now);
}
```

### Alert Priority Display
```javascript
function getAlertDisplay(priority) {
  const styles = {
    critical: {
      icon: '🔴',
      color: '#DC3545',
      bgColor: '#FFE5E5',
      pulse: true,
      label: 'CRITICAL'
    },
    high: {
      icon: '🟠',
      color: '#FFC107',
      bgColor: '#FFF3CD',
      pulse: false,
      label: 'HIGH PRIORITY'
    },
    medium: {
      icon: '🟡',
      color: '#FFC107',
      bgColor: '#FFF9E6',
      pulse: false,
      label: 'MEDIUM PRIORITY'
    },
    low: {
      icon: '🟢',
      color: '#28A745',
      bgColor: '#E6F4EA',
      pulse: false,
      label: 'LOW PRIORITY'
    }
  };
  
  return styles[priority] || styles.low;
}
```

---

Generate a complete, production-ready executive dashboard that serves as the primary landing page for FSP Owners, Key Individuals, and Compliance Officers. The dashboard must provide immediate insight into overall compliance health, critical issues requiring attention, team performance, and upcoming deadlines - all optimized for quick executive decision-making and board reporting.
