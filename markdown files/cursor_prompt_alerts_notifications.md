# CURSOR PROMPT: ALERTS & NOTIFICATIONS SYSTEM MODULE
============================================================

Create a fully functional, realistic HTML mockup for the Alerts & Notifications System of a South African FAIS broker compliance portal. This is the critical proactive monitoring infrastructure that prevents compliance breaches through automated alerts, multi-channel notifications, escalation workflows, and comprehensive alert rule management.

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
- South African locale (dates: DD/MM/YYYY, timezone: SAST, phone: +27)

---

## ROLE-BASED ACCESS CONTROL

### FSP Owner / Principal
- **Access:** View all alerts, create custom alerts, manage alert rules
- **Notifications:** Receive critical and high-priority alerts
- **Actions:** Acknowledge, dismiss, escalate, reassign, create
- **Rules:** Full access to configure automated alert rules

### Key Individual
- **Access:** View all alerts (or filtered to supervised reps if configured)
- **Notifications:** Receive alerts for supervised representatives
- **Actions:** Acknowledge, dismiss, escalate, create
- **Rules:** Read-only access to alert rules

### Compliance Officer
- **Access:** Full access to all alerts and alert management
- **Notifications:** Receive all compliance-related alerts
- **Actions:** Full alert management (create, edit, delete, configure)
- **Rules:** Full access to create and manage alert rules

### Representative
- **Access:** View own alerts only
- **Notifications:** Receive personal alerts (CPD reminders, document expiry)
- **Actions:** Acknowledge, mark as complete
- **Rules:** No access to alert rules

### Admin Staff
- **Access:** View operational alerts only
- **Notifications:** Receive system and data entry alerts
- **Actions:** Acknowledge, mark as complete
- **Rules:** No access to alert rules

---

## MODULE STRUCTURE

### Navigation Tabs
- Alerts Dashboard (default)
- Active Alerts
- Alert Rules (Automated)
- Alert History
- Notification Settings

### Global Alert Bell (Top Navigation)
- **Icon:** 🔔 (bell icon)
- **Badge:** Red circle with count (e.g., "12")
- **Animation:** Pulse for critical alerts
- **Dropdown:** Quick view of top 5 alerts
- **Click:** Opens full Alerts Dashboard

---

## 1. ALERTS DASHBOARD TAB (Default View)

### Page Header
- **Title:** "Alerts & Notifications"
- **Subtitle:** "Proactive compliance monitoring and escalation"
- **Last Updated:** 15/12/2024 14:30 (auto-refresh every 60 seconds)
- **Buttons:**
  - [🔴 Primary] Create Custom Alert
  - [⚙️ Secondary] Configure Alert Rules
  - [📊 Info] Alert Analytics
  - [📧 Secondary] Notification Settings
  - [🔄 Refresh] icon button

---

### Alert Summary Cards (Top Row - 6 cards)

**Card 1: Total Active Alerts**
- **Number:** 17 (extra-large)
- **Label:** Active Alerts
- **Icon:** 🔔 (animated if new alerts)
- **Change:** +4 since yesterday ↑
- **Status:** Monitoring
- **Click:** Shows all active alerts

**Card 2: Critical Alerts** 🔴
- **Number:** 1 (large, pulsing)
- **Label:** CRITICAL
- **Background:** Light red (#FFE5E5)
- **Border:** Thick red border (pulsing)
- **Icon:** ⚠️ (large, animated)
- **Sublabel:** Requires immediate action
- **Click:** Filters to show only critical alerts

**Card 3: High Priority Alerts** 🟠
- **Number:** 3
- **Label:** HIGH PRIORITY
- **Background:** Light orange (#FFF3CD)
- **Border:** Orange border
- **Icon:** ⚠️
- **Sublabel:** Action required within 7 days
- **Click:** Filters to show only high priority

**Card 4: Medium Priority** 🟡
- **Number:** 5
- **Label:** MEDIUM PRIORITY
- **Background:** Light yellow (#FFF9E6)
- **Icon:** ℹ️
- **Sublabel:** Action required within 30 days
- **Click:** Filters to show medium priority

**Card 5: Overdue Alerts** ⏰
- **Number:** 1 (red text)
- **Label:** OVERDUE
- **Background:** Light red
- **Icon:** ⏰ (red)
- **Sublabel:** Past due date
- **Animated:** Pulsing
- **Click:** Shows overdue alerts

**Card 6: Acknowledged** ✓
- **Number:** 8
- **Label:** ACKNOWLEDGED
- **Background:** Light green (#E6F4EA)
- **Icon:** ✓
- **Sublabel:** Awaiting action completion
- **Click:** Shows acknowledged alerts

---

### Quick Statistics Row (Below Summary Cards)

**Stat 1: Alerts Today**
- Number: 4 new alerts
- Icon: 📅
- Trend: Same as yesterday

**Stat 2: Avg Response Time**
- Number: 2.5 hours
- Icon: ⏱️
- Trend: -0.5 hrs (improving)

**Stat 3: Dismissed (7 Days)**
- Number: 12
- Icon: ✓
- Trend: +2 vs previous week

**Stat 4: Escalated (30 Days)**
- Number: 3
- Icon: ⬆️
- Trend: +1 vs previous month

---

### Alert Heatmap (Visual Timeline)

**7-Day Alert Activity Heatmap:**

```
        Mon  Tue  Wed  Thu  Fri  Sat  Sun
Critical █    -    -    -    -    -    -   (1)
High     ██   █    -    -    -    -    █   (4)
Medium   ███  ██   █    █    ██   -    -   (9)
Low      █    ██   █    -    █    -    ██  (8)
```

**Legend:**
- █ = 1-2 alerts
- ██ = 3-5 alerts
- ███ = 6+ alerts
- Hover: Shows exact count and details

**Click:** Opens detailed analytics for that day/priority

---

## 2. ACTIVE ALERTS TAB

### Filter & Search Bar

**Search Box (Left):**
- **Placeholder:** "Search alerts by keyword, representative, or category..."
- **Icon:** 🔍
- **Auto-suggest:** Shows matching alerts as user types
- **Clear:** X button to clear

**Filters (Center):**

**Priority Filter:**
- [All] [Critical] [High] [Medium] [Low]
- Default: All selected
- Badge shows count for each

**Category Filter:**
- [All Categories ▼]
  - Fit & Proper (4)
  - CPD (5)
  - FICA (3)
  - Documents (2)
  - Insurance (1)
  - Complaints (0)
  - System (2)

**Status Filter:**
- [All Status ▼]
  - Active (17)
  - Acknowledged (8)
  - In Progress (6)
  - Dismissed (0)
  - Escalated (2)

**Assigned To Filter:**
- [All Users ▼]
  - Me (5)
  - Sarah Naidoo (8)
  - Thabo Mokoena (3)
  - Johan Smit (4)
  - Unassigned (2)

**Date Range Filter:**
- [Last 7 Days ▼]
  - Today
  - Yesterday
  - Last 7 Days
  - Last 30 Days
  - Last 90 Days
  - Custom Range

**Sort Options (Right):**
- [Sort By: Priority ▼]
  - Priority (High to Low) - default
  - Date Created (Newest First)
  - Date Created (Oldest First)
  - Due Date (Soonest First)
  - Status
  - Category
  - Representative Name

**Action Buttons:**
- [Clear All Filters]
- [Save Filter Preset]
- [Bulk Actions ▼]

---

### Active Alerts Table

**Columns:**
| Priority | Alert | Category | Created | Due Date | Assigned To | Status | Actions |

---

### SAMPLE ALERT ROWS (Detailed Examples)

**ALERT ROW 1: CRITICAL - RE5 EXPIRED (Pulsing red background)**

**Priority Column:**
- **Badge:** 🔴 CRITICAL (large, red pill badge, pulsing animation)
- **Icon:** ⚠️ (red triangle with exclamation)

**Alert Column:**
- **Title:** "Mike Johnson's RE5 certificate expired" (bold, red text)
- **Reference:** ALT-2024-1234 (gray, small)
- **Description:** "Representative cannot conduct business until certificate is renewed"
- **Impact Badge:** 🚨 HIGH IMPACT (red)
- **Representative:** Mike Johnson (clickable link)
  - Avatar: MJ
  - FSCAR: 123458
- **Expand/Collapse:** [+] button to show full details

**Category Column:**
- **Badge:** Fit & Proper (blue pill badge)
- **Icon:** 🎓

**Created Column:**
- **Date:** 13/12/2024 (bold)
- **Time:** 08:00
- **By:** System (automated)
- **Age:** 2 days ago (red text - old alert)

**Due Date Column:**
- **Date:** 13/12/2024 (OVERDUE)
- **Text:** OVERDUE (large, red, bold)
- **Days Overdue:** 2 days (red badge)
- **Icon:** ⏰ (red clock, pulsing)

**Assigned To Column:**
- **Primary:** Sarah Naidoo (avatar + name)
  - Role: Compliance Officer
- **CC:** Thabo Mokoena (FSP Owner)
- **CC:** Mike Johnson (Representative)
- **Notification Sent:** ✓ Email, ✓ SMS, ✓ In-app

**Status Column:**
- **Badge:** Acknowledged (amber pill)
- **Timestamp:** 13/12/2024 09:15
- **By:** Sarah Naidoo
- **Progress:** 25% (action plan created)
- **Next Action:** Schedule renewal exam

**Actions Column:**
- **[👁️ View Details]** button (primary, small)
- **[📝 Add Note]** button (secondary, small)
- **[✓ Resolve]** button (success, small, disabled until action complete)
- **[...]** More dropdown:
  - Acknowledge
  - Add Note
  - Change Priority
  - Reassign
  - Set Due Date
  - Escalate
  - Dismiss
  - View History
  - Send Reminder

---

**EXPANDED ALERT PANEL (When [+] clicked):**

**Panel appears below alert row with full details:**

---

**Section 1: Full Description**
- **Alert ID:** ALT-2024-1234
- **Title:** Mike Johnson's RE5 certificate expired
- **Full Description:** 
  "Representative Mike Johnson's RE5 certificate (Certificate Number: RE5-2019-12345) expired on 13/12/2024 at 00:00. Per FAIS Act requirements, the representative has been automatically suspended and cannot provide financial advice or conduct any business until the certificate is renewed. This is a critical compliance breach that requires immediate action."

**Section 2: Impact Assessment**
- **Impact Level:** 🚨 HIGH
- **Business Impact:** Representative cannot conduct business, potential loss of income
- **Regulatory Impact:** FAIS Act contravention, potential FSCA sanction
- **Client Impact:** 35 clients affected, need reassignment or notification
- **Financial Impact:** Estimated revenue loss: R50,000/month

**Section 3: Affected Parties**
- **Representative:** Mike Johnson (FSCAR 123458)
  - Status: SUSPENDED (red badge)
  - Clients: 35 active clients
  - [View Representative Profile]
- **Supervisor:** Sarah Naidoo (Key Individual)
- **FSP Owner:** Thabo Mokoena

**Section 4: Recommended Actions** (Checklist)
- ☑ Suspend representative immediately (DONE - automated)
- ☐ Send suspension letter to representative
- ☐ Contact FSCA for renewal process guidance
- ☐ Schedule RE5 renewal exam (priority booking)
- ☐ Notify affected clients (35 clients)
- ☐ Reassign urgent client matters to other advisors
- ☐ Update FSCA register
- ☐ Document all actions taken
- ☐ Schedule compliance review meeting

**Section 5: Related Documents**
- 📄 Expired RE5 Certificate (RE5-2019-12345.pdf) [Download]
- 📄 Suspension Letter Template [Download]
- 📄 FSCA Renewal Guidelines [Download]
- 📄 Client Notification Template [Download]

**Section 6: Activity History** (Timeline)

**Entry 1:**
- **Time:** 13/12/2024 08:00
- **User:** System (automated)
- **Action:** Alert created - RE5 certificate expired
- **Details:** Automatic suspension triggered

**Entry 2:**
- **Time:** 13/12/2024 08:05
- **User:** System
- **Action:** Notifications sent
- **Details:**
  - ✓ Email sent to Mike Johnson
  - ✓ SMS sent to Mike Johnson (+27 82 345 6789)
  - ✓ Email sent to Sarah Naidoo (Supervisor)
  - ✓ Email sent to Thabo Mokoena (FSP Owner)
  - ✓ In-app notification created

**Entry 3:**
- **Time:** 13/12/2024 09:15
- **User:** Sarah Naidoo (Compliance Officer)
- **Action:** Alert acknowledged
- **Note:** "Contacted Mike. Renewal exam scheduled for 20/12. Will monitor progress."

**Entry 4:**
- **Time:** 13/12/2024 10:30
- **User:** Sarah Naidoo
- **Action:** Note added
- **Note:** "Mike confirmed he has been studying. Exam center confirmed booking. Estimated 7-10 days for certificate issuance after exam."

**Entry 5:**
- **Time:** 13/12/2024 14:45
- **User:** Thabo Mokoena (FSP Owner)
- **Action:** Alert escalated to board
- **Note:** "Notified board. Discussed interim arrangements for Mike's clients. Susan Jacobs will handle urgent matters."

**Entry 6:**
- **Time:** 14/12/2024 08:00
- **User:** System (automated)
- **Action:** Follow-up reminder sent
- **Details:** Day 1 overdue - reminder sent to all parties

**Entry 7:**
- **Time:** 15/12/2024 08:00
- **User:** System (automated)
- **Action:** Escalation warning
- **Details:** Day 2 overdue - escalation to FSP Owner confirmed

**Section 7: Add New Note/Update**
- **Textarea:** [Add note, update, or action taken...]
- **Attach File:** [Drag & drop or click to upload]
- **Notify:** 
  - ☑ Mike Johnson
  - ☑ Sarah Naidoo
  - ☑ Thabo Mokoena
- **Buttons:**
  - [Save Note]
  - [Save & Resolve]
  - [Cancel]

**Section 8: Similar Past Alerts**
- 🟠 Johan Smith - RE5 expired (2022) - Resolved in 14 days
- 🟠 Peter Nel - RE5 expired (2023) - Resolved in 7 days
- **Pattern:** Average resolution time: 10.5 days
- [View All Similar Alerts]

**Close Panel:** [X] button (top right)

---

**ALERT ROW 2: HIGH PRIORITY - FICA OVERDUE**

**Priority:** 🟠 HIGH

**Alert:**
- **Title:** "45 FICA reviews overdue (> 5 years)"
- **Reference:** ALT-2024-1235
- **Description:** "Medium-risk clients require 3-year reviews, currently 25 clients are overdue"
- **Impact:** MEDIUM
- **Category:** FICA

**Created:**
- 14/12/2024 15:45
- By: System (automated)
- Age: 21 hours ago

**Due Date:**
- 20/12/2024
- 6 days remaining (amber)
- Icon: ⏰

**Assigned To:**
- Compliance Team (bulk assignment)
- Primary: Sarah Naidoo
- Supporting: All Representatives

**Status:**
- **Badge:** Active (blue pill)
- **Progress:** Not Started
- **Next Action:** Schedule FICA review sessions

**Actions:** [View] [Schedule Reviews] [...]

---

**ALERT ROW 3: HIGH PRIORITY - INSURANCE RENEWAL**

**Priority:** 🟠 HIGH

**Alert:**
- **Title:** "Professional Indemnity insurance expires in 30 days"
- **Reference:** ALT-2024-1236
- **Description:** "PI policy (Guardrisk, R5M coverage) expires 15/01/2025"
- **Impact:** HIGH (cannot operate without PI insurance)
- **Category:** Insurance

**Created:**
- 15/12/2024 08:00
- By: System (automated alert rule)
- Age: 6 hours ago

**Due Date:**
- 15/01/2025
- 31 days remaining (amber warning)

**Assigned To:**
- Thabo Mokoena (FSP Owner)
- CC: Sarah Naidoo (Compliance Officer)

**Status:**
- **Badge:** In Progress (amber pill)
- **Progress:** 40% (renewal quote requested)
- **Note:** "Waiting for broker to send renewal terms"

**Actions:** [View] [Upload Renewal] [Contact Broker] [...]

---

**ALERT ROW 4: MEDIUM PRIORITY - CPD BEHIND SCHEDULE**

**Priority:** 🟡 MEDIUM

**Alert:**
- **Title:** "3 representatives behind on CPD schedule"
- **Reference:** ALT-2024-1237
- **Representatives:** Johan Smith (12 hrs), Peter Nel (13 hrs), Mike Johnson (8 hrs)
- **Category:** CPD

**Created:** 01/12/2024 08:00
**Due Date:** 31/05/2025 (167 days)
**Assigned:** Sarah Naidoo
**Status:** Monitoring (blue)
**Actions:** [View] [Send Reminders] [...]

---

**ALERT ROW 5-17:** (Collapsed summary)
- Show essential info only
- [Expand All] / [Collapse All] toggle

---

### Bulk Actions (When alerts selected)

**Selection Bar (Appears at bottom when checkboxes selected):**

**Left Side:**
- **Selected:** 3 alerts selected
- [Select All 17] link
- [Deselect All] link

**Center Actions:**
- **[Acknowledge Selected]** - Mark alerts as acknowledged
- **[Assign To...]** - Bulk reassign
- **[Change Priority...]** - Bulk priority change
- **[Add Note to All]** - Add same note to multiple alerts
- **[Set Due Date]** - Bulk due date setting
- **[Send Reminder]** - Send reminder to assigned users

**Right Actions:**
- **[Dismiss Selected]** (requires dismissal reason)
- **[Export Selected]** (PDF, Excel)
- **[Cancel Selection]** X

---

## 3. CREATE CUSTOM ALERT MODAL

### Modal Header
- **Title:** "Create Custom Alert"
- **Close:** X button (top right)

---

### Form (Multi-Step or Single Page)

**Step 1: Alert Details**

**1. Alert Title** (text input) - REQUIRED
- **Placeholder:** "Brief, descriptive title (e.g., Compliance review meeting required)"
- **Max Length:** 200 characters
- **Character Counter:** 0 / 200
- **Example:** "Quarterly board compliance presentation due"

**2. Alert Priority** (radio buttons) - REQUIRED

**Priority Options:**

- **⚪ Critical** (red)
  - **Description:** "Immediate action required. Sent via SMS, email, and in-app. Escalates if not acknowledged within 2 hours."
  - **Use for:** License expiry, representative suspension, critical FSCA correspondence
  - **SLA:** Immediate response required
  - **Channels:** SMS + Email + In-app + Push

- **⚪ High** (orange)
  - **Description:** "Action required within 7 days. Sent via email and in-app. Escalates if not acknowledged within 24 hours."
  - **Use for:** Certificate expiring soon, overdue reviews, insurance renewals
  - **SLA:** 7 days
  - **Channels:** Email + In-app

- **⚪ Medium** (yellow)
  - **Description:** "Action required within 30 days. In-app notification only. No automatic escalation."
  - **Use for:** Upcoming deadlines, progress monitoring, routine reviews
  - **SLA:** 30 days
  - **Channels:** In-app

- **⚪ Low** (green)
  - **Description:** "Information only or action required within 90 days. In-app notification. No escalation."
  - **Use for:** Training reminders, document requests, general notices
  - **SLA:** 90 days
  - **Channels:** In-app

**3. Category** (dropdown) - REQUIRED
- Fit & Proper
- CPD
- FICA
- Documents
- Insurance
- Complaints
- Internal Audit
- FSCA Communications
- System / Technical
- Training
- General

**4. Full Description** (rich text editor) - REQUIRED
- **Toolbar:** Bold, Italic, Underline, Bullet List, Numbered List
- **Placeholder:** "Provide detailed description of the alert, including context, impact, and any relevant background information..."
- **Max Length:** 2000 characters
- **Character Counter:** 0 / 2000

**Example:**
"The quarterly board compliance presentation is scheduled for 31/01/2025. Please prepare the following materials:
- Overall compliance health score with 6-month trend
- Team compliance matrix
- CPD progress report
- FICA compliance status
- Outstanding issues and action plans
- Budget vs actual for compliance activities

Materials should be submitted to the Board Secretary by 24/01/2025 for review."

**5. Impact Assessment** (dropdown)
- 🔴 Critical (business cannot operate)
- 🟠 High (significant impact on operations)
- 🟡 Medium (moderate impact, manageable)
- 🟢 Low (minimal impact)

---

**Step 2: Assignment & Notifications**

**6. Assign To** (multi-select dropdown with search) - REQUIRED
- **Search:** "Type to search users..."
- **Options:**
  - All Users (broadcast)
  - FSP Owner (Thabo Mokoena)
  - Compliance Officer (Sarah Naidoo)
  - All Key Individuals (3)
  - All Representatives (12)
  - Specific User (searchable list)
- **Selected:** Shows avatars of selected users
- **Count:** "5 users selected"

**7. CC (Copy)** (multi-select dropdown)
- Additional users to notify but not assign
- Same options as "Assign To"

**8. Due Date** (date picker) - REQUIRED for Critical/High/Medium
- **Date:** Calendar picker
- **Time:** Time picker (optional)
- **Validation:** Cannot be in the past
- **Auto-calculate:** Based on priority (optional)
  - Critical: Today
  - High: +7 days
  - Medium: +30 days
  - Low: +90 days

**9. Notification Channels** (checkboxes)
- ☑ **In-app notification** (always enabled, cannot disable)
- ☑ **Email notification**
  - Email preview: [Preview Email]
- ☐ **SMS notification** (Critical priority only, checkbox disabled for other priorities)
  - Character count: 160 characters max
  - Preview: [Preview SMS]
- ☐ **WhatsApp notification** (future feature, disabled)
  - Coming soon badge

**10. Escalation Settings** (conditional - for Critical & High only)
- ☑ **Enable auto-escalation**
- **If not acknowledged within:** [2] hours (Critical) or [24] hours (High)
- **Escalate to:** [Dropdown - FSP Owner, Key Individual, Board]
- **Escalation message:** [Textarea]

---

**Step 3: Additional Options**

**11. Recommended Actions** (textarea, optional)
- **Placeholder:** "List suggested actions or steps to resolve (one per line)"
- **Example:**
  ```
  1. Review quarterly compliance metrics
  2. Prepare slide deck with charts
  3. Schedule dry-run presentation
  4. Submit materials by 24/01/2025
  ```

**12. Attach Documents** (file upload)
- **Drag & Drop Zone:** "Drag files here or click to browse"
- **Supported Formats:** PDF, DOCX, XLSX, JPG, PNG
- **Max File Size:** 10 MB per file
- **Max Files:** 5 files
- **File List:** Shows uploaded files with [X] remove button

**13. Related Items** (optional)
- **Representative:** [Search dropdown]
- **Client:** [Search dropdown]
- **Document:** [Search dropdown]
- **Complaint:** [Search dropdown]
- **Audit:** [Search dropdown]

**14. Recurrence** (optional)
- **⚪ One-time alert** (default)
- **⚪ Recurring alert**
  
  **If Recurring:**
  - **Frequency:** [Daily | Weekly | Monthly | Quarterly | Annually]
  - **Repeat On:** [Checkboxes for days of week if weekly]
  - **Repeat Until:** [Date picker] or "Indefinitely"
  - **Stop After:** [Number] occurrences

**Example Use Cases:**
- Monthly: "Monthly compliance check - 1st of every month"
- Quarterly: "Quarterly FSCA return reminder - 15th of Jan, Apr, Jul, Oct"
- Annually: "Annual license renewal reminder - 90 days before expiry"

---

### Form Actions (Bottom of Modal)

**Buttons:**
- **[🔴 Create Alert]** (primary button - creates and activates alert immediately)
- **[💾 Save as Draft]** (secondary button - saves without activating)
- **[👁️ Preview]** (secondary button - shows preview of how alert will appear)
- **[Cancel]** (link/text button - closes modal without saving)

**Preview Modal (if Preview clicked):**
Shows how the alert will appear to recipients:
- In-app notification preview
- Email preview (if email enabled)
- SMS preview (if SMS enabled)
- Alert detail panel preview

---

## 4. ALERT RULES TAB (Automated Alerts)

### Page Header
- **Title:** "Automated Alert Rules"
- **Subtitle:** "Configure rules for automatic alert generation"
- **Buttons:**
  - [🔴 Primary] Create New Rule
  - [📊 Info] Rule Analytics
  - [📥 Secondary] Import Rules
  - [📤 Secondary] Export Rules

---

### Alert Rules Summary Cards

**Card 1: Active Rules**
- **Number:** 15
- **Label:** Active Rules
- **Status:** Running
- **Icon:** ✓ (green)

**Card 2: Disabled Rules**
- **Number:** 2
- **Label:** Disabled
- **Status:** Not monitoring
- **Icon:** ⏸️

**Card 3: Alerts Generated (30 Days)**
- **Number:** 127
- **Label:** Alerts Created
- **Trend:** +15 vs previous month
- **Icon:** 📊

**Card 4: Avg Alerts/Day**
- **Number:** 4.2
- **Label:** Daily Average
- **Trend:** Stable
- **Icon:** 📈

---

### Pre-Configured Alert Rules Table

**Table Structure:**

**Columns:**
| Status | Rule Name | Trigger Condition | Priority | Recipients | Alerts Generated | Actions |

---

### SAMPLE ALERT RULES (15 Pre-configured)

**RULE 1: RE5 Certificate Expired**

**Status:** ✓ Active (green toggle)

**Rule Name:**
- **"RE5 Certificate Expired"** (bold)
- **Rule ID:** RULE-F&P-001
- **Category:** Fit & Proper

**Trigger Condition:**
- **Logic:** `certificate_type = 'RE5' AND expiry_date < TODAY()`
- **Plain English:** "When any representative's RE5 certificate expiry date is in the past"
- **Check Frequency:** Daily at 08:00 SAST
- **Last Checked:** 15/12/2024 08:00

**Priority:** 🔴 Critical

**Recipients:**
- Representative (affected)
- Supervisor (Key Individual)
- Compliance Officer
- FSP Owner

**Notification Channels:**
- SMS + Email + In-app

**Escalation:**
- Immediate escalation to FSP Owner
- Automatic suspension of representative

**Alerts Generated:**
- **Last 30 Days:** 1 alert
- **Last 12 Months:** 3 alerts
- **Currently Active:** 1 (Mike Johnson)

**Actions:**
- [✏️ Edit Rule]
- [📊 View Analytics]
- [⏸️ Disable Rule]
- [🧪 Test Rule]
- [📋 View Generated Alerts]

---

**RULE 2: RE5 Certificate Expiring Soon (30 Days)**

**Status:** ✓ Active

**Rule Name:** "RE5 Certificate Expiring in 30 Days"
**Rule ID:** RULE-F&P-002
**Category:** Fit & Proper

**Trigger Condition:**
- **Logic:** `certificate_type = 'RE5' AND expiry_date BETWEEN TODAY() AND TODAY() + 30 DAYS`
- **Plain English:** "When any RE5 certificate will expire within the next 30 days"
- **Check Frequency:** Daily at 08:00

**Priority:** 🟠 High

**Recipients:**
- Representative (affected)
- Supervisor
- Compliance Officer

**Channels:** Email + In-app

**Escalation:**
- If not acknowledged within 24 hours → escalate to Supervisor

**Alerts Generated (30 Days):** 2

**Actions:** [Edit] [Analytics] [Disable] [Test]

---

**RULE 3: RE1 Certificate Expiring Soon (90 Days)**

**Status:** ✓ Active
**Priority:** 🟠 High
**Trigger:** RE1 expiry within 90 days
**Recipients:** Representative, Supervisor, Compliance Officer
**Alerts Generated:** 3 (last 30 days)

---

**RULE 4: CPD Progress Behind Schedule**

**Status:** ✓ Active
**Rule ID:** RULE-CPD-001
**Category:** CPD

**Trigger Condition:**
- **Logic:** `(cpd_hours_completed / cpd_hours_required) < 0.50 AND days_to_deadline < 180`
- **Plain English:** "When CPD progress is less than 50% and less than 180 days remain to deadline"
- **Check Frequency:** Weekly (every Monday 08:00)

**Priority:** 🟡 Medium

**Recipients:**
- Representative (affected)
- Supervisor
- Compliance Officer

**Channels:** Email + In-app

**Alerts Generated:** 15 (last 30 days)
- Currently: Johan Smith (67%), Peter Nel (72%), Mike Johnson (44%)

---

**RULE 5: CPD Ethics Hours Below Minimum**

**Status:** ✓ Active
**Trigger:** `ethics_hours < 3 AND days_to_deadline < 90`
**Priority:** 🟠 High
**Recipients:** Representative, Supervisor, Compliance Officer
**Alerts:** 8 (last 30 days)

---

**RULE 6: CPD Deadline Approaching (30 Days)**

**Status:** ✓ Active
**Trigger:** `cpd_hours_completed < cpd_hours_required AND days_to_deadline <= 30`
**Priority:** 🔴 Critical
**Recipients:** All, FSP Owner
**Alerts:** 0 (last 30 days)

---

**RULE 7: FICA Review Overdue (Low Risk)**

**Status:** ✓ Active
**Rule ID:** RULE-FICA-001
**Trigger:** `client_risk_level = 'LOW' AND last_review_date < TODAY() - 5 YEARS`
**Priority:** 🟠 High
**Recipients:** Client Representative, Compliance Officer
**Alerts:** 23 (last 30 days)

---

**RULE 8: FICA Review Overdue (Medium Risk)**

**Status:** ✓ Active
**Trigger:** `client_risk_level = 'MEDIUM' AND last_review_date < TODAY() - 3 YEARS`
**Priority:** 🟠 High
**Recipients:** Client Representative, Compliance Officer
**Alerts:** 31 (last 30 days)

---

**RULE 9: FICA Review Overdue (High Risk)**

**Status:** ✓ Active
**Trigger:** `client_risk_level = 'HIGH' AND last_review_date < TODAY() - 1 YEAR`
**Priority:** 🔴 Critical
**Recipients:** Client Representative, Compliance Officer, FSP Owner
**Alerts:** 2 (last 30 days)

---

**RULE 10: Professional Indemnity Insurance Expiring (90 Days)**

**Status:** ✓ Active
**Rule ID:** RULE-INS-001
**Trigger:** `insurance_type = 'PI' AND expiry_date <= TODAY() + 90 DAYS`
**Priority:** 🟠 High
**Recipients:** FSP Owner, Compliance Officer
**Alerts:** 1 (currently active)

---

**RULE 11: Professional Indemnity Insurance Expired**

**Status:** ✓ Active
**Trigger:** `insurance_type = 'PI' AND expiry_date < TODAY()`
**Priority:** 🔴 Critical (FSP cannot operate)
**Recipients:** FSP Owner, All Key Individuals, Board
**Channels:** SMS + Email + In-app
**Escalation:** Immediate to Board
**Alerts:** 0 (last 12 months)

---

**RULE 12: Fidelity Guarantee Insurance Expiring (90 Days)**

**Status:** ✓ Active
**Trigger:** `insurance_type = 'FG' AND expiry_date <= TODAY() + 90 DAYS`
**Priority:** 🟠 High
**Recipients:** FSP Owner, Compliance Officer
**Alerts:** 0 (last 30 days)

---

**RULE 13: Complaint 6-Week Deadline Approaching**

**Status:** ✓ Active
**Rule ID:** RULE-COMP-001
**Trigger:** `days_to_6_week_deadline <= 7`
**Priority:** 🟠 High
**Recipients:** Complaint Handler, Compliance Officer
**Alerts:** 4 (last 30 days)

---

**RULE 14: Compliance Health Score Drops Below 85%**

**Status:** ✓ Active
**Rule ID:** RULE-COMP-002
**Trigger:** `overall_compliance_score < 0.85`
**Priority:** 🟠 High
**Recipients:** FSP Owner, Compliance Officer
**Alerts:** 0 (last 30 days)

---

**RULE 15: Representative Compliance Score Below 70%**

**Status:** ✓ Active
**Trigger:** `representative_compliance_score < 0.70`
**Priority:** 🟡 Medium
**Recipients:** Representative, Supervisor, Compliance Officer
**Alerts:** 3 (last 30 days)

---

**RULE 16-17: Disabled Rules**

**RULE 16: Document Expiring (30 Days)** - ⏸️ Disabled
- Reason: Too many alerts, moved to 60 days

**RULE 17: Background Check Due (60 Days)** - ⏸️ Disabled
- Reason: Now handled by F&P module directly

---

### Create/Edit Alert Rule Modal

**Modal Header:**
- **Title:** "Create Automated Alert Rule"
- **Subtitle:** "Define conditions for automatic alert generation"

---

**Form Fields:**

**1. Rule Name** (text) - REQUIRED
- Example: "RE5 Certificate Expiring Soon"
- Max 100 characters

**2. Rule Description** (textarea)
- Explain what this rule does
- Example: "Creates an alert when an RE5 certificate will expire within 30 days"

**3. Category** (dropdown) - REQUIRED
- Fit & Proper
- CPD
- FICA
- Documents
- Insurance
- Complaints
- System

**4. Trigger Condition Builder** (Visual Builder)

**Condition Builder Interface:**

```
┌─────────────────────────────────────────────────┐
│ IF                                              │
│ ┌───────────────┐  ┌──────┐  ┌──────────────┐ │
│ │ Certificate   │  │  =   │  │    RE5       │ │
│ └───────────────┘  └──────┘  └──────────────┘ │
│ AND                                             │
│ ┌───────────────┐  ┌──────┐  ┌──────────────┐ │
│ │ Expiry Date   │  │  <=  │  │ TODAY + 30   │ │
│ └───────────────┘  └──────┘  └──────────────┘ │
│                                                 │
│ [+ Add Condition]  [+ Add OR Group]            │
└─────────────────────────────────────────────────┘
```

**Field Dropdown Options:**
- Certificate Type
- Certificate Expiry Date
- CPD Hours Completed
- CPD Hours Required
- FICA Last Review Date
- Client Risk Level
- Document Expiry Date
- Insurance Type
- Insurance Expiry Date
- Complaint Due Date
- Compliance Score
- And more...

**Operator Options:**
- = (equals)
- ≠ (not equals)
- > (greater than)
- < (less than)
- ≥ (greater than or equal)
- ≤ (less than or equal)
- BETWEEN
- IN
- CONTAINS

**Value Options:**
- Static values (text, number, date)
- Dynamic values (TODAY, TODAY + X DAYS, etc.)
- Variable placeholders

**5. Check Frequency** (dropdown)
- Every 15 minutes (system alerts only)
- Hourly
- Daily at [time picker]
- Weekly on [day selector] at [time]
- Monthly on [day] at [time]
- Custom cron expression

**6. Alert Priority** (radio buttons)
- Critical | High | Medium | Low

**7. Recipients** (multi-select)
- Affected Representative
- Representative's Supervisor
- Compliance Officer
- FSP Owner
- All Key Individuals
- All Representatives
- Specific User
- Custom role

**8. Notification Channels** (checkboxes)
- In-app (always on)
- Email
- SMS (Critical only)

**9. Escalation Settings**
- Enable escalation (checkbox)
- If not acknowledged within [number] [hours/days]
- Escalate to [dropdown]

**10. Alert Template**
- Alert title template: "[Rep Name]'s RE5 expires in [Days]"
- Alert description template: "Certificate [Cert Number] expires on [Expiry Date]"
- Use variables: {{rep_name}}, {{cert_number}}, {{days_remaining}}, etc.

**11. Active Status** (toggle)
- ON: Rule is active and monitoring
- OFF: Rule is disabled

**Actions:**
- [Save & Activate]
- [Save as Draft]
- [Test Rule Now]
- [Cancel]

---

**Test Rule Button:**
Shows results:
- "Rule would generate 3 alerts based on current data"
- Lists affected items
- Preview of alert that would be created
- [Create Alerts] or [Cancel Test]

---

## 5. ALERT HISTORY TAB

### Page Header
- **Title:** "Alert History"
- **Subtitle:** "All alerts (active, resolved, dismissed)"
- **Date Range:** Last 90 days (default)

---

### Filters (Same as Active Alerts Tab)
- Search, Priority, Category, Status, Date Range

**Additional Status Options:**
- All
- Active
- Acknowledged
- In Progress
- Resolved
- Dismissed
- Escalated

---

### Alert History Table

**Same structure as Active Alerts but includes:**
- **Resolved Date** column
- **Resolved By** column
- **Resolution Time** (hours/days from creation to resolution)
- **Dismissal Reason** (if dismissed)

**Statistics:**
- Total Alerts: 247 (last 90 days)
- Avg Resolution Time: 2.5 days
- Dismissed: 12 (5%)
- Escalated: 8 (3%)

**Charts:**
- Alert Volume by Priority (pie chart)
- Alert Volume Over Time (line chart)
- Resolution Time by Category (bar chart)
- Top Alert Generators (rules that create most alerts)

---

## 6. NOTIFICATION SETTINGS TAB

### User Notification Preferences

**Email Notifications:**
- ☑ Enable email notifications
- **Email Address:** thabo.mokoena@abcfinancial.co.za
- **Delivery Format:**
  - ⚪ Individual emails (real-time)
  - ⚪ Daily digest (08:00 SAST)
  - ⚪ Weekly digest (Monday 08:00)
- **Priority Filter:**
  - ☑ Critical
  - ☑ High
  - ☑ Medium
  - ☐ Low

**SMS Notifications:**
- ☑ Enable SMS notifications
- **Mobile Number:** +27 82 555 7890
- **Verify Number** (button)
- **Delivery:**
  - Critical alerts only (forced)
  - Character limit: 160 chars
- **Rate Limit:** Max 10 SMS per day

**In-App Notifications:**
- ☑ Enable in-app notifications (cannot disable)
- **Badge Icon:** Show count on bell icon
- **Desktop Notifications:** ☑ Enable browser notifications
- **Sound:** ☑ Play notification sound
- **Popup:** ☑ Show notification popup

**Quiet Hours:**
- ☑ Enable quiet hours (no notifications)
- **From:** 22:00 SAST
- **To:** 06:00 SAST
- **Exceptions:**
  - ☑ Critical alerts override quiet hours

**Notification Summary:**
- ☑ Send weekly summary email
- **Day:** Monday
- **Time:** 08:00 SAST
- **Include:** Alert statistics, resolved items, pending actions

---

### System Notification Settings (Admin Only)

**Global Settings:**
- **From Email:** noreply@abcfinancial.co.za
- **From Name:** ABC Financial Compliance System
- **Reply-To:** compliance@abcfinancial.co.za
- **SMS Provider:** Twilio
- **SMS Sender ID:** ABCFinServ

**Rate Limits:**
- **Email:** 1000 per hour
- **SMS:** 100 per hour
- **In-app:** Unlimited

**Retry Logic:**
- **Failed Email:** Retry 3 times, 5 min intervals
- **Failed SMS:** Retry 2 times, 2 min intervals

**Blackout Periods:**
- Public Holidays: No non-critical alerts
- After Hours: Critical only (22:00 - 06:00)

---

## 7. GLOBAL ALERT BELL (Top Navigation)

### Bell Icon (Top Right of Every Page)

**Icon:** 🔔 (bell)
**Badge:** Red circle with count (e.g., "12")
**Animation:** Pulse for unread critical alerts

---

### Dropdown Menu (Click bell)

**Header:**
- **Title:** "Alerts & Notifications"
- **Count:** 12 unread
- **[Mark All as Read]** link

---

**Quick Alert List (Top 5 most recent/important):**

**Alert 1:**
- **Priority:** 🔴 (small red dot)
- **Title:** "Mike Johnson's RE5 expired" (bold if unread)
- **Time:** 2 days ago
- **Category Badge:** F&P (small blue pill)
- **Actions:** [View] [Dismiss]

**Alert 2:**
- **Priority:** 🟠
- **Title:** "45 FICA reviews overdue"
- **Time:** 21 hours ago
- **Category:** FICA
- **Actions:** [View] [Dismiss]

**Alert 3-5:** (Similar format)

---

**Footer:**
- [View All Alerts (17)] (link to full Alerts Dashboard)
- [Notification Settings] (link)

---

## SAMPLE DATA

**Current User:** Thabo Mokoena (FSP Owner)
**Date:** 15/12/2024 14:30
**FSP:** ABC Financial Services (FSP 12345)

**Active Alerts Summary:**
- Total: 17
- Critical: 1
- High: 3
- Medium: 5
- Low: 8
- Overdue: 1
- Acknowledged: 8

**Top Alerts:**
1. Mike Johnson RE5 expired (Critical - 2 days overdue)
2. 45 FICA reviews overdue (High - 6 days to action)
3. PI insurance expires 31 days (High - 31 days)
4. 3 reps behind CPD (Medium - 167 days)
5. Quarterly FSCA return due (Medium - 47 days)

**Alert Rules:**
- Active: 15
- Disabled: 2
- Alerts generated (30 days): 127
- Avg per day: 4.2

**Notification Settings:**
- Email: Enabled (individual)
- SMS: Enabled (critical only)
- In-app: Enabled
- Quiet hours: 22:00 - 06:00

---

## TECHNICAL REQUIREMENTS

### Real-Time Notifications
- WebSocket connection for live alerts
- Fallback to long-polling (60-second intervals)
- Browser push notifications (with permission)
- Service worker for background notifications

### Alert Processing
- Rule evaluation: Scheduled cron jobs
- Critical rules: Every 15 minutes
- High rules: Every hour
- Medium/Low rules: Daily
- Database queue for alert generation
- Deduplication logic (prevent duplicate alerts)

### Notification Delivery
- Email: SMTP integration (SendGrid/Mailgun)
- SMS: Twilio API integration
- In-app: Real-time via WebSocket
- Push: Firebase Cloud Messaging (mobile)

### Performance
- Alert creation: < 1 second
- Rule evaluation: < 10 seconds per rule
- Notification delivery: < 30 seconds
- Dashboard load: < 2 seconds

### API Endpoints
```
GET /api/alerts?status=active&priority=critical
GET /api/alerts/{id}
POST /api/alerts
PUT /api/alerts/{id}
DELETE /api/alerts/{id}
POST /api/alerts/{id}/acknowledge
POST /api/alerts/{id}/dismiss
POST /api/alerts/{id}/escalate

GET /api/alert-rules
GET /api/alert-rules/{id}
POST /api/alert-rules
PUT /api/alert-rules/{id}
DELETE /api/alert-rules/{id}
POST /api/alert-rules/{id}/test

GET /api/notifications/settings
PUT /api/notifications/settings
POST /api/notifications/test

WebSocket: ws://api.example.com/alerts/stream
```

---

Generate a complete, production-ready alerts and notifications system that provides proactive compliance monitoring, multi-channel delivery, sophisticated escalation workflows, and comprehensive alert rule management for South African FSP compliance management.
