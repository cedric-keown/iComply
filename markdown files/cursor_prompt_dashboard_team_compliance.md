# CURSOR PROMPT: TEAM COMPLIANCE MATRIX MODULE
============================================================

Create a fully functional, realistic HTML mockup for the Team Compliance Matrix module of a South African FAIS broker compliance portal. This is the most frequently used compliance management tool, providing a comprehensive at-a-glance view of every representative's compliance status across all areas (Fit & Proper, CPD, FICA, Documents) with traffic-light indicators and drill-down capabilities.

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
- **Access:** View all 12 representatives
- **Matrix View:** Complete matrix showing all compliance areas
- **Actions:** View details, send reminders, generate reports, take corrective actions
- **Bulk Actions:** Send bulk reminders, export data, assign supervisors

### Key Individual
- **Access:** View supervised representatives only (filtered automatically)
- **Matrix View:** Same as FSP Owner but filtered to supervised reps
- **Actions:** Same as FSP Owner for supervised reps
- **Bulk Actions:** Available for supervised reps only

### Compliance Officer
- **Access:** View all representatives (read-only for some fields)
- **Matrix View:** Complete matrix with emphasis on compliance metrics
- **Actions:** View details, verify records, send reminders, generate compliance reports
- **Bulk Actions:** Send compliance reminders, generate reports

### Representative
- **Access:** View own row only (redirected to personal dashboard)
- **Matrix View:** Personal compliance dashboard instead of matrix
- **Actions:** Update own records, view own status
- **Bulk Actions:** None

### Admin Staff
- **Access:** View all representatives (data entry focus)
- **Matrix View:** Limited to data verification tasks
- **Actions:** Update records, upload documents (with approval)
- **Bulk Actions:** Bulk data entry operations

---

## MODULE STRUCTURE

### Single-Page Layout
- **No Tabs:** All content on single scrollable page
- **Sections:** 
  1. Summary Cards (top)
  2. Filters & Search Bar
  3. Main Compliance Matrix Table
  4. Representative Detail Panel (expandable/modal)
- **Responsive:** Table converts to cards on mobile
- **Live Updates:** Real-time status indicators

---

## 1. PAGE HEADER & SUMMARY CARDS

### Page Header
- **Title:** "Team Compliance Matrix"
- **Subtitle:** "Real-time compliance status for all representatives"
- **Last Updated:** 15/12/2024 14:30 (auto-refresh every 2 minutes)
- **Buttons:**
  - [Primary] Generate Team Report
  - [Success] Send Bulk Reminder
  - [Info] Export to Excel
  - [Secondary] Print Matrix
  - [🔄 Refresh] icon button

---

### Summary Cards Row (5 cards across top)

**Card 1: Total Representatives**
- **Large Number:** 12
- **Label:** Active Representatives
- **Visual:** 12 circular avatars (11 green, 1 red)
- **Sublabel:** +1 this month
- **Click Action:** No filter (shows all)

**Card 2: Fully Compliant** ✓
- **Large Number:** 9
- **Percentage:** 75%
- **Label:** Fully Compliant
- **Visual:** Large green checkmark
- **Progress Bar:** 75% filled (green)
- **Click Action:** Filter to show only compliant reps

**Card 3: At Risk** ⚠️
- **Large Number:** 2
- **Percentage:** 17%
- **Label:** Need Attention
- **Visual:** Amber warning triangle
- **Progress Bar:** 17% filled (amber)
- **Names:** Johan Smith, Peter Nel
- **Click Action:** Filter to show only at-risk reps

**Card 4: Non-Compliant** ✗
- **Large Number:** 1
- **Percentage:** 8%
- **Label:** Non-Compliant
- **Visual:** Large red X (pulsing animation)
- **Progress Bar:** 8% filled (red)
- **Names:** Mike Johnson
- **Click Action:** Filter to show only non-compliant reps

**Card 5: Average Score**
- **Large Number:** 87%
- **Label:** Team Average
- **Visual:** Circular gauge
- **Change:** +2% vs last month ↑ (green)
- **Range:** Highest 98% - Lowest 45%
- **Click Action:** Sort by score

---

## 2. FILTERS & SEARCH BAR

### Filter Section (Collapsible on mobile)

**Search Bar (Left Side):**
- **Input:** Search by name, email, or FSCAR number
- **Icon:** 🔍 (magnifying glass)
- **Placeholder:** "Search representatives..."
- **Auto-suggest:** Shows matching names as user types
- **Clear button:** X to clear search

**Filter Dropdowns (Center):**

**Filter 1: Compliance Status**
- **Options:**
  - All (12)
  - ✓ Compliant (9)
  - ⚠️ At Risk (2)
  - ✗ Non-Compliant (1)
  - 🆕 New (onboarding)

**Filter 2: CPD Status**
- **Options:**
  - All
  - ✓ Completed (18+ hrs)
  - ⚠️ In Progress (10-17 hrs)
  - ✗ Behind Schedule (< 10 hrs)
  - ⏳ Not Started

**Filter 3: FICA Status**
- **Options:**
  - All
  - ✓ All Clients Current
  - ⚠️ Some Reviews Overdue
  - ✗ Many Reviews Overdue

**Filter 4: Supervisor (Key Individual)**
- **Options:**
  - All
  - Thabo Mokoena (5 reps)
  - Johan Smit (4 reps)
  - Sarah Naidoo (3 reps)
  - Unassigned

**Filter 5: Employment Status**
- **Options:**
  - All
  - Active (12)
  - Suspended (0)
  - Pending Registration (0)
  - Terminated (show last 90 days)

**Action Buttons (Right Side):**
- [Clear All Filters]
- [Save Filter Preset]
- [Load Saved Preset ▼]

---

### Sort Options

**Sort By Dropdown:**
- Name (A-Z)
- Name (Z-A)
- Compliance Score (High to Low)
- Compliance Score (Low to High)
- Last Updated (Newest First)
- Last Updated (Oldest First)
- CPD Progress (%)
- FICA Status
- Critical Issues First

**Default Sort:** Critical Issues First, then by Name (A-Z)

---

## 3. MAIN COMPLIANCE MATRIX TABLE

### Table Structure (Responsive)

**Desktop View:** Full table with all columns
**Tablet View:** Reduced columns, horizontal scroll
**Mobile View:** Cards (one per representative)

---

### Table Columns (Desktop)

| # | Rep | F&P | CPD | FICA | Docs | Overall Status | Last Updated | Actions |

**Column Widths:**
- #: 40px (sequence number)
- Rep: 200px (name + avatar)
- F&P: 80px (Fit & Proper)
- CPD: 120px (progress bar + %)
- FICA: 100px (client compliance)
- Docs: 80px (document status)
- Overall Status: 120px (score + badge)
- Last Updated: 120px (date)
- Actions: 150px (buttons)

---

### Table Header Row (Sticky on Scroll)

**Header Cells (Sortable):**
- **#** - Row number
- **Representative** ↕️ - Sort by name
- **F&P** ↕️ - Sort by Fit & Proper status
- **CPD** ↕️ - Sort by CPD progress
- **FICA** ↕️ - Sort by FICA compliance
- **Docs** ↕️ - Sort by document status
- **Overall Status** ↕️ - Sort by compliance score
- **Last Updated** ↕️ - Sort by date
- **Actions** - No sort

**Select All Checkbox:**
- Located in header row (far left)
- Select/deselect all representatives
- Enables bulk actions

---

### Sample Table Rows (Detailed Examples)

---

**ROW 1: SARAH NAIDOO (Top Performer - All Green)**

**#:** 1 (with checkbox)

**Representative Column:**
- **Avatar:** SN (teal circle with initials)
- **Name:** Sarah Naidoo (bold, clickable)
- **Role Badge:** Senior Financial Advisor (blue badge)
- **Email:** sarah.naidoo@abcfinancial.co.za (small gray text)
- **FSCAR:** 123456 (small gray text)
- **Supervisor:** Thabo Mokoena (KI badge)

**Fit & Proper Column:**
- **Icon:** ✓ (large green checkmark in circle)
- **Tooltip on Hover:**
  - RE5: Valid until 20/08/2026
  - RE1: Valid until 15/03/2025
  - COB: Long-term, Investments ✓
  - Background: All current ✓
  - Last verified: 10/12/2024
- **Status:** COMPLIANT (green)

**CPD Column:**
- **Hours:** 20 / 18 hrs (bold)
- **Percentage:** 111% (green text)
- **Progress Bar:** Full + overflow (green, 100%+)
- **Ethics:** 4.0 hrs ✓ (green checkmark)
- **Status Badge:** COMPLETED ✓ (green pill)
- **Tooltip:**
  - Technical: 16 hrs
  - Ethics: 4 hrs (exceeds 3 hrs minimum)
  - Last activity: 05/12/2024
  - Next deadline: 31/05/2025 (167 days)

**FICA Column:**
- **Icon:** ✓ (green checkmark)
- **Status:** 45 / 45 clients (bold)
- **Percentage:** 100%
- **Sublabel:** All current (green text)
- **Tooltip:**
  - Total clients: 45
  - Current: 45 (100%)
  - Overdue: 0
  - Due next 30 days: 2
  - High risk: 3 (all current)
  - Last review: 14/12/2024

**Documents Column:**
- **Icon:** ✓ (green checkmark)
- **Status:** 28 / 28 docs (bold)
- **Percentage:** 100%
- **Sublabel:** All current (green text)
- **Tooltip:**
  - CPD certificates: 8 (all current)
  - Qualifications: 4 (all current)
  - Client docs: 12 (all current)
  - Other: 4 (all current)
  - Expiring soon: 0
  - Last upload: 12/12/2024

**Overall Status Column:**
- **Score:** 98% (extra-large, bold, green)
- **Status Badge:** ✓ COMPLIANT (large green pill)
- **Trend:** ↑ +1% (small green arrow)
- **Visual:** Mini circular gauge (98% filled green)
- **Rank:** #1 of 12

**Last Updated Column:**
- **Date:** 14/12/2024 (bold)
- **Time:** 16:30
- **By:** Self-updated
- **Icon:** 🔄 (recent activity)

**Actions Column:**
- [👁️ View] button (primary, small)
- [📧 Message] button (secondary, small)
- [...] More dropdown
  - Send Reminder
  - View CPD Details
  - View FICA Details
  - Generate Individual Report
  - Edit Details
  - View Audit Log

---

**ROW 2: THABO MOKOENA (Amber - In Progress)**

**#:** 2 (with checkbox)

**Representative:**
- **Avatar:** TM
- **Name:** Thabo Mokoena
- **Role:** Financial Advisor (blue badge)
- **Email:** thabo.mokoena@abcfinancial.co.za
- **FSCAR:** 123457
- **Supervisor:** Johan Smit (KI)

**Fit & Proper:**
- **Icon:** ✓ (green checkmark)
- **Status:** COMPLIANT
- **Tooltip:**
  - RE5: Valid until 10/06/2027
  - RE1: Valid until 20/04/2025
  - All checks current

**CPD:**
- **Hours:** 14 / 18 hrs
- **Percentage:** 78% (amber text)
- **Progress Bar:** 78% filled (amber/yellow)
- **Ethics:** 3.0 hrs ✓ (green)
- **Status Badge:** ⚠️ IN PROGRESS (amber pill)
- **Sublabel:** 167 days remaining
- **Tooltip:**
  - Technical: 11 hrs
  - Ethics: 3 hrs (meets minimum)
  - Last activity: 5 days ago
  - Projected: Will complete by deadline

**FICA:**
- **Icon:** ✓ (green)
- **Status:** 52 / 52 clients
- **Percentage:** 100%
- **All current**

**Documents:**
- **Icon:** ⚠️ (amber warning)
- **Status:** 31 / 33 docs
- **Percentage:** 94%
- **Sublabel:** 2 expiring soon (amber)
- **Tooltip:**
  - Expiring in 30 days: 2 documents
  - Action required by: 15/01/2025

**Overall Status:**
- **Score:** 85% (bold, green)
- **Status Badge:** ✓ COMPLIANT (green pill)
- **Trend:** → Stable
- **Rank:** #5 of 12

**Last Updated:**
- 15/12/2024 10:15
- By: CPD verified

**Actions:**
- [👁️ View] [📧 Message] [...]

---

**ROW 3: MIKE JOHNSON (Red - Critical)**

**#:** 3 (with checkbox)

**Representative:**
- **Avatar:** MJ (with red border)
- **Name:** Mike Johnson (bold, red text)
- **Role:** Junior Financial Advisor
- **Email:** mike.johnson@abcfinancial.co.za
- **FSCAR:** 123458
- **Supervisor:** Sarah Naidoo (KI)
- **Status Badge:** 🔴 SUSPENDED (red, pulsing)

**Fit & Proper:**
- **Icon:** ✗ (large red X, pulsing)
- **Status:** NON-COMPLIANT (red, bold)
- **Critical Issue:** RE5 EXPIRED (red badge)
- **Tooltip:**
  - ✗ RE5: EXPIRED 13/12/2024 (2 days ago)
  - ✓ RE1: Valid until 30/09/2025
  - ⚠️ Background checks: Due for renewal
  - URGENT ACTION REQUIRED
  - Representative suspended effective 13/12/2024

**CPD:**
- **Hours:** 8 / 18 hrs
- **Percentage:** 44% (red text)
- **Progress Bar:** 44% filled (red)
- **Ethics:** 1.5 hrs ✗ (red X - below 3 hrs)
- **Status Badge:** ✗ BEHIND SCHEDULE (red pill)
- **Sublabel:** 167 days remaining (red text)
- **Tooltip:**
  - Technical: 6.5 hrs (36%)
  - Ethics: 1.5 hrs (BELOW minimum of 3 hrs)
  - Last activity: 45 days ago
  - At current pace: WILL NOT COMPLETE
  - URGENT: Schedule CPD immediately

**FICA:**
- **Icon:** ⚠️ (amber warning)
- **Status:** 28 / 35 clients
- **Percentage:** 80%
- **Sublabel:** 7 overdue (amber)
- **Tooltip:**
  - Current: 28 (80%)
  - Overdue: 7 (20%)
  - High risk clients: 2 (1 overdue)
  - Action required

**Documents:**
- **Icon:** ✗ (red X)
- **Status:** 18 / 22 docs
- **Percentage:** 82%
- **Sublabel:** 4 expired (red)
- **Tooltip:**
  - Expired: 4 documents (URGENT)
  - Expiring: 3 documents (30 days)
  - Missing: RE5 renewal certificate
  - Action required immediately

**Overall Status:**
- **Score:** 45% (extra-large, bold, red)
- **Status Badge:** ✗ NON-COMPLIANT (large red pill, pulsing)
- **Trend:** ↓ -8% (red down arrow)
- **Rank:** #12 of 12 (last place)
- **Critical Badge:** 🚨 CRITICAL ATTENTION REQUIRED

**Last Updated:**
- 13/12/2024 08:00
- By: System alert (RE5 expiry)

**Actions:**
- [🚨 URGENT ACTION] button (danger red, pulsing)
- [👁️ View] [📧 Alert] [...]
  - Suspend Representative (already suspended)
  - Escalate to FSP Owner
  - Create Action Plan
  - Schedule Urgent Meeting
  - Generate Incident Report
  - View Suspension Letter

---

**ROW 4: JOHAN SMITH (Amber - Warning)**

**#:** 4

**Representative:**
- **Avatar:** JS
- **Name:** Johan Smith
- **Role:** Financial Advisor
- **Supervisor:** Thabo Mokoena

**Fit & Proper:**
- **Icon:** ✓ (green)
- **Status:** COMPLIANT

**CPD:**
- **Hours:** 12 / 18 hrs
- **Percentage:** 67% (amber)
- **Progress Bar:** 67% (amber)
- **Ethics:** 2.5 hrs ⚠️ (amber - below 3 hrs)
- **Status Badge:** ⚠️ BEHIND (amber)
- **Tooltip:**
  - At risk of not completing
  - Needs 6 more hours
  - Ethics hours below minimum

**FICA:**
- **Icon:** ✓ (green)
- **Status:** 38 / 38 clients
- **All current**

**Documents:**
- **Icon:** ✓ (green)
- **Status:** 25 / 25 docs
- **All current**

**Overall Status:**
- **Score:** 68% (amber)
- **Status Badge:** ⚠️ AT RISK (amber)
- **Trend:** → Stable
- **Rank:** #11 of 12

**Last Updated:** 10/12/2024 14:20

**Actions:** [👁️ View] [📧 Remind] [...]

---

**ROW 5-12:** (Collapsed summary view)

Show condensed rows with just:
- Name
- Overall status badge
- Score
- [+] Expand button

**Expand All / Collapse All** toggle button

---

### Mobile View (Responsive Cards)

**On screens < 768px, convert table to cards:**

**Card Structure:**

```
┌─────────────────────────────────────┐
│ [Avatar] Sarah Naidoo          98%  │
│ Senior Financial Advisor       ✓    │
├─────────────────────────────────────┤
│ F&P: ✓  CPD: ✓  FICA: ✓  Docs: ✓  │
├─────────────────────────────────────┤
│ CPD: 20/18 hrs (111%) ━━━━━━━━━ ✓  │
│ FICA: 45/45 clients ✓               │
│ Updated: 14/12/2024                 │
├─────────────────────────────────────┤
│ [View Details] [Message] [•••]      │
└─────────────────────────────────────┘
```

**Swipe Actions on Mobile:**
- Swipe left: Quick actions menu
- Swipe right: Send message
- Long press: Multi-select

---

## 4. BULK ACTIONS BAR

### Appears when representatives are selected (checkbox)

**Bulk Actions Bar (Sticky at bottom):**

**Left Side:**
- **Selected:** 3 representatives selected
- [Select All 12] link
- [Deselect All] link

**Center Actions:**
- [📧 Send Reminder] button
  - Opens modal: Select reminder type (CPD, FICA, Document update)
- [📊 Generate Report] button
  - Opens modal: Select report type (Individual, Comparison, Team summary)
- [📤 Export Selected] button
  - Export to Excel, PDF, CSV
- [👤 Assign Supervisor] button
  - Opens modal: Select KI to assign

**Right Side:**
- [✓ Mark as Reviewed] button
- [Cancel Selection] button (X icon)

---

## 5. REPRESENTATIVE DETAIL PANEL

### Expandable Panel (Click on row or "View" button)

**Opens:** Slide-in panel from right (desktop) or full-screen modal (mobile)

**Panel Header:**
- **Close Button:** X (top right)
- **Representative Name:** Mike Johnson (large)
- **Overall Score:** 45% (extra-large, red)
- **Status Badge:** ✗ NON-COMPLIANT (red, pulsing)
- **Action Buttons:**
  - [📧 Send Message]
  - [📊 Generate Report]
  - [✏️ Edit Details]
  - [📋 View Audit Log]

---

### Panel Tabs:

**Tab 1: Overview** (default)
**Tab 2: Fit & Proper**
**Tab 3: CPD Details**
**Tab 4: FICA Status**
**Tab 5: Documents**
**Tab 6: Supervision**
**Tab 7: Activity Log**

---

### TAB 1: OVERVIEW

**Personal Information Card:**
- Full Name: Mike Johnson
- Email: mike.johnson@abcfinancial.co.za
- Mobile: +27 82 345 6789
- FSCAR Number: 123458
- Employee ID: EMP-2022-008
- Date of Birth: 15/08/1990 (34 years old)
- ID Number: 9008155800084
- Role: Junior Financial Advisor
- Employment Start: 15/03/2022 (2 years, 9 months)
- Status: SUSPENDED (red badge)
- Supervisor: Sarah Naidoo (Key Individual)

**Compliance Summary Dashboard:**

**Four Status Cards:**

1. **Fit & Proper: NON-COMPLIANT** (red)
   - ✗ RE5 Expired (2 days ago)
   - ✓ RE1 Current
   - ⚠️ Background checks due
   - [View Details]

2. **CPD: BEHIND SCHEDULE** (red)
   - 8 / 18 hrs (44%)
   - Ethics: 1.5 / 3 hrs (below minimum)
   - 167 days to deadline
   - [View Details]

3. **FICA: WARNING** (amber)
   - 28 / 35 clients current (80%)
   - 7 clients overdue
   - [View Details]

4. **Documents: EXPIRED** (red)
   - 18 / 22 docs current (82%)
   - 4 documents expired
   - [View Details]

**Compliance Trend Chart:**
- Line chart showing last 6 months
- Showing decline from 85% (Jun) to 45% (Dec)
- Red trendline pointing downward

**Critical Issues (Red Alert Box):**
1. 🔴 RE5 Certificate Expired (13/12/2024) - URGENT
2. 🔴 Ethics CPD hours below minimum (1.5 / 3 hrs)
3. ⚠️ 7 FICA reviews overdue
4. ⚠️ 4 documents expired

**Recommended Actions:**
1. ✓ Suspend representative immediately (DONE)
2. Schedule RE5 renewal exam (priority)
3. Schedule ethics CPD training (minimum 2 hrs)
4. Complete overdue FICA reviews (7 clients)
5. Update expired documents (4 docs)
6. Schedule compliance review meeting

**Quick Actions:**
- [Create Action Plan]
- [Schedule Meeting]
- [Send Suspension Letter]
- [Escalate to FSP Owner]

---

### TAB 2: FIT & PROPER

**RE5 Certificate Section:**
- **Status:** ✗ EXPIRED (red, large)
- **Certificate Number:** RE5-2019-12345
- **Issue Date:** 15/12/2019
- **Expiry Date:** 13/12/2024 (2 days ago)
- **Provider:** Moonstone Business School
- **Class of Business:** Long-term Insurance, Investments
- **Certificate:** [View Expired Certificate PDF]
- **Action Required:** URGENT - Representative cannot conduct business
- **Actions:**
  - [Schedule Renewal Exam]
  - [Upload New Certificate]
  - [View Suspension Letter]

**RE1 Certificate Section:**
- **Status:** ✓ CURRENT (green)
- **Certificate Number:** RE1-2018-67890
- **Issue Date:** 10/03/2018
- **Expiry Date:** 30/09/2025 (289 days)
- **Provider:** FPI
- **Certificate:** [View Certificate PDF]

**Class of Business Section:**
- **Authorized Categories:**
  - ✓ Long-term Insurance (Life, Disability)
  - ✓ Investment Products (Unit Trusts)
- **Training Completion:**
  - ✓ Product training completed (15/03/2022)
  - ⚠️ Refresh training due (15/03/2025)

**Background Checks Section:**
- **Criminal Clearance:**
  - Status: ✓ Current
  - Date: 01/02/2024
  - Valid Until: 31/01/2025 (47 days)
  - Certificate: [View PDF]
  - ⚠️ Renewal due within 60 days

- **Credit Check:**
  - Status: ✓ Current
  - Date: 01/02/2024
  - Result: No adverse findings
  - Next Check: 01/02/2025

- **Debarment Status:**
  - Status: ✓ Clear
  - Last Checked: 10/12/2024
  - FSCA Register: No listings
  - Ombud Register: Clear

**Experience & Qualifications:**
- Total Experience: 2 years, 9 months
- Management Experience: None
- Qualifications:
  - ✓ B.Com Financial Management (University of Cape Town, 2017)
  - ✓ Postgraduate Diploma in Financial Planning (2019)

---

### TAB 3: CPD DETAILS

**Current Cycle:** 1 June 2024 - 31 May 2025

**Progress Overview:**
- **Total Hours:** 8.0 / 18.0 hrs (44%)
- **Progress Bar:** 44% filled (red)
- **Status:** ✗ BEHIND SCHEDULE (red badge)
- **Days Remaining:** 167 days

**By Category:**
- **Technical Hours:** 6.5 / ~15 hrs (43%)
- **Ethics Hours:** 1.5 / 3 hrs minimum ✗ (RED - below minimum)

**Projection:**
- At current pace: WILL NOT COMPLETE
- Additional hours needed: 10.0 hrs
- Recommended: 0.75 hrs/week to meet deadline

**CPD Activity Log (This Cycle):**

**Entry 1:**
- **Date:** 30/10/2024 (46 days ago)
- **Activity:** Investment Strategies Workshop
- **Provider:** FPI Online
- **Category:** Technical
- **Hours:** 3.0 hrs
- **Status:** ✓ Verified (05/11/2024)
- **Certificate:** [View PDF]

**Entry 2:**
- **Date:** 15/09/2024 (91 days ago)
- **Activity:** FICA Compliance Update
- **Provider:** Masthead Training
- **Category:** Ethics
- **Hours:** 1.5 hrs
- **Status:** ✓ Verified (20/09/2024)
- **Certificate:** [View PDF]

**Entry 3:**
- **Date:** 05/08/2024 (132 days ago)
- **Activity:** Market Analysis Webinar
- **Provider:** Self-logged
- **Category:** Technical
- **Hours:** 2.0 hrs
- **Status:** ✓ Verified (12/08/2024)
- **Certificate:** [View PDF]

**Entry 4:**
- **Date:** 20/07/2024 (148 days ago)
- **Activity:** Product Knowledge: Unit Trusts
- **Provider:** Moonstone
- **Category:** Technical
- **Hours:** 1.5 hrs
- **Status:** ✓ Verified (25/07/2024)
- **Certificate:** [View PDF]

**Last Activity:** 46 days ago (concerning gap)

**Pending Activities:** None

**Recommended CPD:**
- ⚠️ URGENT: Ethics training (minimum 1.5 hrs to meet 3 hrs minimum)
- ⚠️ Additional 8.5 hrs technical training required
- Suggested: TCF Outcomes Workshop (3 hrs Ethics)
- Suggested: Advanced Investment Planning (5 hrs Technical)

**Actions:**
- [Add CPD Record]
- [Upload Certificate]
- [Schedule Training]
- [Send CPD Reminder]

---

### TAB 4: FICA STATUS

**Client Portfolio Overview:**
- **Total Clients:** 35
- **Current:** 28 (80%)
- **Overdue Reviews:** 7 (20%)
- **Due Next 30 Days:** 3

**By Risk Category:**

**Low Risk (5-year review):**
- Total: 25 clients
- Current: 20 (80%)
- Overdue: 5 (20%)
- Due soon: 2

**Medium Risk (3-year review):**
- Total: 8 clients
- Current: 6 (75%)
- Overdue: 2 (25%)
- Due soon: 1

**High Risk (Annual review):**
- Total: 2 clients
- Current: 2 (100%) ✓
- Overdue: 0
- Due soon: 0

**Overdue FICA Reviews (Requires Action):**

**Client 1:**
- Name: John Doe
- ID: 7505125800083
- Risk Level: Low
- Last Review: 10/06/2019 (5 years, 6 months ago)
- Due Date: 10/06/2024 (OVERDUE by 188 days)
- Action: [Schedule Review] [View Client File]

**Client 2:**
- Name: Jane Smith
- ID: 8208145800089
- Risk Level: Medium
- Last Review: 15/09/2021 (3 years, 3 months ago)
- Due Date: 15/09/2024 (OVERDUE by 91 days)
- Action: [Schedule Review]

**[View All 7 Overdue Reviews]**

**Recent FICA Activity:**
- Last review completed: 25/11/2024 (20 days ago)
- Reviews this month: 2
- Reviews this quarter: 8
- Average review time: 30 minutes

**Actions:**
- [Schedule FICA Reviews]
- [View All Clients]
- [Generate FICA Report]
- [Send Client Notifications]

---

### TAB 5: DOCUMENTS

**Document Status:**
- **Total Documents:** 22
- **Current:** 18 (82%)
- **Expired:** 4 (18%)
- **Expiring (90 days):** 3

**By Category:**

**CPD Certificates:**
- Total: 4 documents
- Current: 4 (100%) ✓
- Latest: 30/10/2024

**Qualifications:**
- Total: 3 documents
- Current: 2 (67%)
- Expired: 1 (RE5 certificate)

**Client Documents:**
- Total: 12 documents
- Current: 10 (83%)
- Expired: 2

**Other Documents:**
- Total: 3 documents
- Current: 2 (67%)
- Expired: 1

**Expired Documents (Action Required):**

1. **RE5 Certificate**
   - Expired: 13/12/2024 (2 days ago)
   - Critical: Required for business
   - Action: [Upload Renewal]

2. **Criminal Clearance (pending renewal)**
   - Expiring: 31/01/2025 (47 days)
   - Warning: Renewal process should start
   - Action: [Upload New Certificate]

3. **Client Agreement - John Doe**
   - Expired: 20/10/2024 (56 days ago)
   - Action: [Upload Renewal]

4. **Client Agreement - Jane Smith**
   - Expired: 15/09/2024 (91 days ago)
   - Action: [Upload Renewal]

**Recent Uploads:**
- 30/10/2024: CPD Certificate (Investment Strategies)
- 20/09/2024: CPD Certificate (FICA Update)
- 12/08/2024: CPD Certificate (Market Analysis)

**Actions:**
- [Upload Document]
- [Bulk Upload]
- [View All Documents]
- [Document Retention Report]

---

### TAB 6: SUPERVISION

**Supervisor Information:**
- **Supervisor:** Sarah Naidoo
- **Role:** Key Individual & Compliance Officer
- **Supervision Ratio:** 1:3 (3 reps supervised)
- **Supervision Start:** 15/03/2022

**Supervision Agreement:**
- Status: ✓ Signed (15/03/2022)
- Document: [View Agreement PDF]
- Last Review: 15/03/2024
- Next Review Due: 15/03/2025

**Supervision Meetings (Last 6 Months):**

**Meeting 1:**
- Date: 10/12/2024
- Duration: 45 minutes
- Type: Quarterly Review
- Topics: RE5 expiry, CPD progress, FICA backlog
- Outcome: Action plan created
- Notes: [View Meeting Notes]

**Meeting 2:**
- Date: 15/11/2024
- Duration: 30 minutes
- Type: Monthly Check-in
- Topics: CPD progress, client portfolio
- Outcome: No concerns identified
- Notes: [View Notes]

**Meeting 3:**
- Date: 10/10/2024
- Duration: 30 minutes
- Type: Monthly Check-in
- Topics: Performance review, training needs
- Outcome: Satisfactory performance
- Notes: [View Notes]

**[View All 24 Meetings]**

**Supervision Compliance:**
- ✓ Monthly meetings: 100% compliance
- ✓ Quarterly reviews: On schedule
- ✓ Documentation: All meetings logged
- ✓ Action items: 85% completion rate

**Current Action Items:**
1. 🔴 Renew RE5 certificate (Due: URGENT)
2. 🔴 Complete 2 hrs Ethics CPD (Due: 31/01/2025)
3. ⚠️ Complete 7 overdue FICA reviews (Due: 15/02/2025)
4. ⚠️ Update 4 expired documents (Due: 31/12/2024)

**Actions:**
- [Schedule Meeting]
- [Log Meeting Notes]
- [View Supervision History]
- [Generate Supervision Report]

---

### TAB 7: ACTIVITY LOG

**Comprehensive audit trail of all activities:**

**Filter Options:**
- Date Range: [Last 7 Days | Last 30 Days | Last 90 Days | Custom]
- Activity Type: [All | Updates | Alerts | Reviews | Documents | CPD | FICA | Other]
- Changed By: [All | System | Representative | Supervisor | Compliance Officer]

**Activity Entries (Most Recent First):**

**Entry 1:**
- **Date/Time:** 13/12/2024 08:00
- **Activity Type:** System Alert (red icon)
- **Description:** RE5 certificate expired
- **Changed By:** System (automated)
- **Details:** Certificate RE5-2019-12345 expired on 13/12/2024. Representative automatically suspended per FAIS requirements.
- **Impact:** Representative status changed to SUSPENDED
- **Actions Triggered:**
  - Email alert sent to representative
  - Email alert sent to supervisor (Sarah Naidoo)
  - Email alert sent to FSP Owner
  - Critical alert created in dashboard
- [View Full Details]

**Entry 2:**
- **Date/Time:** 10/12/2024 15:30
- **Activity Type:** Meeting Logged
- **Description:** Quarterly supervision meeting
- **Changed By:** Sarah Naidoo (Supervisor)
- **Details:** Discussed RE5 renewal (due in 3 days), CPD progress, FICA backlog
- **Notes:** [View Meeting Notes PDF]

**Entry 3:**
- **Date/Time:** 05/11/2024 14:20
- **Activity Type:** CPD Verified
- **Description:** CPD certificate verified - Investment Strategies (3.0 hrs)
- **Changed By:** Sarah Naidoo (Compliance Officer)
- **Details:** Certificate uploaded 30/10/2024, verified 05/11/2024
- **CPD Hours Updated:** 5.0 hrs → 8.0 hrs

**Entry 4:**
- **Date/Time:** 25/11/2024 11:15
- **Activity Type:** FICA Review Completed
- **Description:** FICA review completed for client Sarah Miller
- **Changed By:** Mike Johnson (Self)
- **Details:** Annual review for high-risk client
- **Documents Updated:** Risk assessment, ID verification

**Entry 5:**
- **Date/Time:** 15/11/2024 09:00
- **Activity Type:** Supervision Meeting
- **Description:** Monthly check-in
- **Changed By:** Sarah Naidoo (Supervisor)

**[Load More Activity (180 total entries)]**

**Export Activity Log:**
- [Export to Excel]
- [Export to PDF]
- [Email Activity Report]

---

## 6. ADDITIONAL FEATURES

### Print View

**When printing or "Print Matrix" clicked:**
- Remove navigation, filters, action buttons
- Convert to black & white friendly
- Show all representatives (expanded)
- Include company logo and header
- Add print date/time
- Page breaks between sections
- Summary on first page

### Export to Excel

**Excel Export includes:**
- **Sheet 1:** Team Matrix Summary
  - All columns from table
  - Color-coded cells (green/amber/red)
  - Totals and averages at bottom

- **Sheet 2:** Detailed Breakdown
  - One row per representative
  - All compliance data
  - F&P details, CPD hours, FICA stats, Document counts

- **Sheet 3:** Issues & Actions
  - List of all issues by representative
  - Priority, due date, status

- **Sheet 4:** CPD Details
  - CPD hours by representative
  - Technical vs Ethics breakdown
  - Days to deadline

- **Sheet 5:** FICA Status
  - Clients by representative
  - Overdue reviews by category
  - High-risk client status

**File Format:** .xlsx (Excel 2010+)
**Filename:** Team_Compliance_Matrix_2024-12-15.xlsx

### Generate Team Report (PDF)

**PDF Report includes:**
- **Cover Page:**
  - Company logo
  - Report title: "Team Compliance Matrix Report"
  - Date: 15/12/2024
  - FSP: ABC Financial Services (FSP 12345)
  - Prepared by: Thabo Mokoena

- **Executive Summary (Page 2):**
  - Overall compliance: 87%
  - Compliant: 9 reps (75%)
  - At Risk: 2 reps (17%)
  - Non-Compliant: 1 rep (8%)
  - Key issues: RE5 expiry, CPD behind, FICA overdue
  - Recommendations

- **Detailed Matrix (Pages 3-5):**
  - Full table with all representatives
  - Color-coded status indicators
  - Issue counts by category

- **Individual Summaries (Pages 6-17):**
  - One page per representative
  - Compliance score
  - Status by area
  - Current issues
  - Action items

- **Appendices:**
  - CPD Progress Chart
  - FICA Status Chart
  - Trend Analysis (6 months)

### Send Bulk Reminder

**Reminder Types:**
- CPD Reminder (for reps behind schedule)
- FICA Reminder (for reps with overdue reviews)
- Document Update Reminder (for reps with expired docs)
- General Compliance Reminder

**Bulk Reminder Form:**
- **To:** Selected representatives (3)
  - List with checkboxes
  - [Select All] [Deselect All]
- **Reminder Type:** [Dropdown]
- **Subject:** Pre-filled (editable)
- **Message:** Template (editable)
  - Include variables: {{name}}, {{hours_needed}}, {{days_remaining}}, etc.
- **Send Via:**
  - ☑ Email
  - ☐ SMS (for critical only)
  - ☑ In-app notification
- **CC:** Supervisors, Compliance Officer
- **Schedule:** [Send Now] or [Schedule for later]

**Buttons:**
- [Send Reminder]
- [Preview]
- [Save as Draft]
- [Cancel]

---

## SAMPLE DATA

**Current User:** Thabo Mokoena (FSP Owner)
**Date:** 15/12/2024 14:30
**FSP:** ABC Financial Services (Pty) Ltd
**FSP Number:** 12345

**Team Summary:**
- Total Representatives: 12
- Fully Compliant: 9 (75%)
- At Risk: 2 (17%)
- Non-Compliant: 1 (8%)
- Average Score: 87%

**Representative Breakdown:**

1. Sarah Naidoo - 98% ✓ (Top performer)
2. Lisa van Wyk - 95% ✓
3. Pieter Venter - 92% ✓
4. Thabo Mokoena - 85% ✓
5. Anna de Wet - 85% ✓
6. David Mthembu - 83% ✓
7. Susan Jacobs - 82% ✓
8. Lerato Dlamini - 80% ✓
9. Kevin O'Brien - 78% ✓
10. Peter Nel - 72% ⚠️ (At risk)
11. Johan Smith - 68% ⚠️ (At risk)
12. Mike Johnson - 45% ✗ (Non-compliant - SUSPENDED)

**Critical Issues:**
- Mike Johnson: RE5 expired, CPD behind, ethics below minimum
- Johan Smith: CPD behind schedule, ethics hours insufficient
- Peter Nel: CPD slightly behind

**CPD Status:**
- Completed: 9 reps
- In Progress: 2 reps
- Behind: 1 rep
- Days to deadline: 167

**FICA Status:**
- Total clients: 660
- Current: 580 (88%)
- Overdue: 80 (12%)
- High-risk: 25 (all current)

---

## TECHNICAL REQUIREMENTS

### Performance
- Initial table load: < 2 seconds (12 rows)
- Filter/sort operations: < 200ms
- Row expansion: Instant (< 100ms)
- Export to Excel: < 5 seconds
- PDF generation: < 10 seconds

### Real-Time Updates
- Auto-refresh: Every 2 minutes
- Status indicators: Live updates
- New activity: Push notifications
- Changes by others: Highlight updated rows

### Responsive Design
- Desktop: Full table (12 columns)
- Tablet: Horizontal scroll or reduced columns
- Mobile: Card view (stacked)
- Touch gestures: Swipe to expand, long-press to select

### Accessibility
- Keyboard navigation
- Screen reader support
- ARIA labels
- High contrast mode
- Focus indicators

### API Endpoints
```
GET /api/team-matrix
GET /api/team-matrix/representative/{id}
GET /api/team-matrix/export?format=excel|pdf
POST /api/team-matrix/bulk-reminder
GET /api/team-matrix/filters
POST /api/team-matrix/save-filter-preset
```

---

Generate a complete, production-ready team compliance matrix that provides instant visibility into every representative's compliance status with intuitive traffic-light indicators, drill-down capabilities, and powerful bulk actions for efficient team management.
