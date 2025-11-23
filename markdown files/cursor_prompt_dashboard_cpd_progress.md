# CURSOR PROMPT: CPD PROGRESS DASHBOARD MODULE

Create a fully functional, realistic HTML mockup for the CPD Progress Dashboard module of a South African FAIS broker compliance portal. This specialized dashboard provides time-sensitive tracking of CPD progress for all representatives with focus on the critical May 31st annual deadline, enabling proactive management of compliance across the FSP.

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
- CPD Progress Overview (default)
- Individual Progress Tracker
- Team Comparison View
- Deadline Alerts
- Activity Feed
- Reports & Analytics

---

## 1. CPD PROGRESS OVERVIEW

### Hero Section: Deadline Countdown

**Current Date Context:** 15 December 2024

**Large Countdown Timer (Center Banner):**
```
âš ï¸ 167 DAYS UNTIL CPD DEADLINE
May 31, 2025
```
- Background: Light amber gradient
- Large countdown: 167 days (red if <30 days, amber if <90 days, green if >90 days)
- Progress bar showing: 46% of cycle elapsed (1 Jun 2024 - 31 May 2025)
- Date range: 1 June 2024 - 31 May 2025
- Quick action: [View Representatives at Risk]

### FSP-Wide Statistics (4 Cards)

**Card 1: Overall Compliance Rate**
- Large percentage: 67%
- Icon: Target
- Label: "FSP Compliance Rate"
- Sublabel: "8 of 12 representatives on track"
- Status: Warning (amber badge)
- Trend: ↑ +8% from last month
- [View Details]

**Card 2: Total Hours Logged**
- Large number: 168
- Icon: Clock
- Label: "Total CPD Hours"
- Sublabel: "Across all representatives"
- Required total: 216 hours (12 reps × 18 hours)
- Progress: 78% complete
- [View Breakdown]

**Card 3: At Risk Representatives**
- Large number: 4
- Icon: Alert-triangle
- Label: "At Risk"
- Sublabel: "Behind schedule or missing requirements"
- Status: Warning (amber)
- List preview: "View: S. Naidoo, P. Williams..."
- [Take Action]

**Card 4: Average Progress**
- Large number: 14.0
- Icon: Trending-up
- Label: "Average Hours/Rep"
- Sublabel: "Of 18 required"
- Benchmark: Target should be 15+ by now
- Status: Amber
- [Team Comparison]

### CPD Compliance Matrix (Visual Grid)

**Grid Layout - 12 Representatives:**

**Status Categories:**
- ✅ **On Track** (8 reps) - Green
- ⚠️ **Needs Attention** (3 reps) - Amber
- 🚨 **Urgent** (1 rep) - Red

**Representative Cards (Grid - 3 columns on desktop, 1 on mobile):**

Each card shows:
- Name & Photo
- FSP Number
- Progress ring (circular indicator)
- Hours: X / 18
- Status badge
- Last activity date
- Quick action button

**Example Card 1 - On Track:**
```
[Photo] Thandiwe Mkhize
FSP 12345
Progress: 16 / 18 hours (89%)
✅ On Track
Ethics: 4/3 ✓ | Verifiable: 14/14 ✓
Last activity: 10/12/2024
[View Details]
```

**Example Card 2 - Needs Attention:**
```
[Photo] Sarah Naidoo
FSP 23456
Progress: 11 / 18 hours (61%)
⚠️ Needs Attention
Ethics: 2/3 ⚠️ | Verifiable: 9/14
Last activity: 25/11/2024
[Send Reminder]
```

**Example Card 3 - Urgent:**
```
[Photo] David Koopman
FSP 34567
Progress: 6 / 18 hours (33%)
🚨 Urgent
Ethics: 1/3 🚨 | Verifiable: 5/14
Last activity: 05/10/2024
[Escalate]
```

### Progress Timeline Chart

**Visual Timeline (Horizontal):**
- X-axis: June 2024 - May 2025
- Y-axis: CPD Hours (0-18)
- Current date marker: 15 Dec 2024
- Ideal progress line (dotted): Shows where reps should be
- Actual average line (solid): Shows current average
- Individual rep lines (thin, color-coded)
- Shaded area: "Safe zone" above ideal progress

**Legend:**
- Green zone: On track
- Amber zone: Slightly behind
- Red zone: Significantly behind
- Black dot: Current position (15 Dec 2024)

### Compliance Category Breakdown

**Three Columns:**

**Column 1: Technical CPD**
- Total hours required: 168 (12 reps × 14 hours)
- Total hours logged: 132
- Progress: 79%
- Status: ⚠️ Amber
- Behind by: 36 hours
- Most common categories:
  - Product Knowledge: 48 hours
  - Regulatory Updates: 36 hours
  - Market Analysis: 28 hours
  - Risk Management: 20 hours

**Column 2: Ethics & Standards**
- Total hours required: 36 (12 reps × 3 hours)
- Total hours logged: 34
- Progress: 94%
- Status: ⚠️ Amber (2 reps not meeting minimum)
- Behind by: 2 hours
- Issue: 2 representatives have <3 ethics hours
- [View Non-Compliant Reps]

**Column 3: Verifiable Hours**
- Total verifiable: 142 hours
- Total non-verifiable: 26 hours
- Ratio: 85% verifiable (good)
- Target: >75% verifiable
- Status: ✅ Green

---

## 2. INDIVIDUAL PROGRESS TRACKER

### Representative Selection

**Dropdown Filter:**
- All Representatives
- My Supervised Reps (for Key Individuals)
- By Status: On Track / Needs Attention / Urgent
- By Branch: Cape Town / Johannesburg / Durban
- By Category: Long-term / Short-term / Both

**Search Bar:**
- "Search by name, FSP number..."

### Selected Representative: Sarah Naidoo

**Representative Header Card:**
```
[Profile Photo]
Sarah Naidoo
FSP Number: 23456
Category: Long-term Insurance
Supervisor: Thandiwe Mkhize (Key Individual)
Join Date: 15/03/2018
Status: ⚠️ NEEDS ATTENTION

Contact:
📧 sarah.naidoo@customfs.co.za
📱 +27 82 555 1234
```

### CPD Progress Circle (Large, Centered)

**Circular Progress Indicator:**
- Center: 11 / 18 hours
- Percentage: 61%
- Color: Amber
- Ring segments:
  - Technical CPD: 8/14 (amber segment)
  - Ethics: 2/3 (red segment - below minimum)
  - Remaining: 1/1 (grey segment)

**Progress vs. Expected:**
- Expected hours by 15/12/2024: 13 hours
- Actual hours: 11 hours
- Variance: -2 hours (15% behind)
- Status: ⚠️ Behind Schedule

### Requirements Breakdown Table

| Requirement | Required | Logged | Status | Remaining |
|-------------|----------|--------|--------|-----------|
| **Technical CPD** | 14 | 8 | ⚠️ 57% | 6 hours |
| Long-term Insurance | 7 | 6 | ⚠️ 86% | 1 hour |
| General Financial | 7 | 2 | 🚨 29% | 5 hours |
| **Ethics & Standards** | 3 | 2 | 🚨 67% | 1 hour |
| **Total CPD** | 18 | 11 | ⚠️ 61% | 7 hours |
| **Verifiable Hours** | 14 | 9 | ⚠️ 64% | 5 hours |

**Alert Messages:**
```
🚨 CRITICAL: Ethics requirement not met (2/3 hours)
⚠️ WARNING: General Financial CPD significantly behind (2/7 hours)
⚠️ WARNING: Overall progress 15% below expected
```

### Activity Log (Last 10 Activities)

**Table Format:**

| Date | Activity | Provider | Category | Hours | Type | Status |
|------|----------|----------|----------|-------|------|--------|
| 10/12/2024 | Product Update: Living Annuities | Old Mutual | Product Knowledge | 2.0 | Verifiable | ✅ Approved |
| 25/11/2024 | FAIS Compliance Refresher | FSCA | Regulatory | 1.5 | Verifiable | ✅ Approved |
| 10/11/2024 | Ethics in Practice | FPI | Ethics | 1.0 | Verifiable | ✅ Approved |
| 28/10/2024 | Market Analysis Workshop | Alexander Forbes | Market Analysis | 3.0 | Verifiable | ✅ Approved |
| 15/10/2024 | Self-study: Tax Legislation | Self | Tax | 1.5 | Non-verifiable | ✅ Logged |
| 01/10/2024 | Insurance Legislation Update | ASISA | Regulatory | 2.0 | Verifiable | ✅ Approved |

**Action Buttons:**
- [Upload New Activity]
- [Request Certificate]
- [Send Reminder Email]
- [View All Activities]

### Milestone Timeline

**Visual Timeline:**
```
[Start] Jun 2024 ━━●━━━━━━●━━━━━━━━●━━━━━━━○━━━━━━━━━━━━[End] May 2025
         Sep 2024    Dec 2024    Mar 2025    Now      Deadline
         (Target)    (Current)   (Next)                (Final)
         6 hours     13 hours    16 hours              18 hours
         ✅          ⚠️          📍                    🎯
```

**Milestone Targets:**
- September 2024: 6 hours (✅ Achieved - 7 hours)
- December 2024: 13 hours (⚠️ Behind - 11 hours)
- March 2025: 16 hours (📍 At risk)
- May 2025: 18 hours (🎯 Final deadline)

### Recommendations Panel

**Personalized Action Items:**

1. **🚨 URGENT: Complete Ethics Requirement**
   - Current: 2 hours
   - Required: 3 hours
   - Shortage: 1 hour
   - Recommended action: Book ethics course immediately
   - Suggested providers: [FPI Ethics Course] [ASISA Ethics Update]

2. **⚠️ Priority: General Financial CPD**
   - Current: 2 hours
   - Required: 7 hours
   - Shortage: 5 hours
   - Recommended action: Attend multi-day workshop
   - Suggested: [Financial Planning Conference - 8 hours CPD]

3. **📅 Schedule: Remaining Activities**
   - Total remaining: 7 hours
   - Time remaining: 167 days
   - Recommended pace: 1 activity per month
   - Next suggested date: 15 January 2025

**Auto-Generated Email Preview:**
```
Subject: CPD Progress Update - Action Required

Dear Sarah,

Your CPD progress for 2024/2025:
• Current: 11/18 hours (61%)
• Behind schedule by: 2 hours (15%)
• URGENT: Ethics requirement not met (2/3 hours)

Recommended Actions:
1. Complete ethics course by 31 January 2025
2. Attend General Financial CPD workshop
3. Book remaining activities to stay on track

[View Full Dashboard] [Book CPD Activity]

Best regards,
CustomApp Compliance Team
```

[Send Reminder] [Customize Message]

---

## 3. TEAM COMPARISON VIEW

### Team Performance Matrix

**Side-by-side Comparison Table:**

| Representative | FSP # | Total Hours | % Complete | Ethics | Status | Trend | Last Activity | Action |
|----------------|-------|-------------|------------|--------|--------|-------|---------------|--------|
| Thandiwe Mkhize | 12345 | 16/18 | 89% | ✅ 4/3 | ✅ On Track | ↑ | 10/12/2024 | [View] |
| Johan van Zyl | 45678 | 15/18 | 83% | ✅ 3/3 | ✅ On Track | ↑ | 08/12/2024 | [View] |
| Linda Zwane | 56789 | 14/18 | 78% | ✅ 3/3 | ✅ On Track | → | 05/12/2024 | [View] |
| Peter Williams | 67890 | 14/18 | 78% | ✅ 3/3 | ✅ On Track | ↑ | 02/12/2024 | [View] |
| Amanda Botha | 78901 | 14/18 | 78% | ✅ 4/3 | ✅ On Track | → | 28/11/2024 | [View] |
| Michael Chen | 89012 | 13/18 | 72% | ✅ 3/3 | ✅ On Track | ↑ | 20/11/2024 | [View] |
| Sipho Dlamini | 90123 | 13/18 | 72% | ✅ 3/3 | ✅ On Track | → | 18/11/2024 | [View] |
| Rachel Levy | 01234 | 12/18 | 67% | ✅ 3/3 | ✅ On Track | ↓ | 15/11/2024 | [View] |
| Sarah Naidoo | 23456 | 11/18 | 61% | 🚨 2/3 | ⚠️ Needs Attention | ↓ | 25/11/2024 | [Remind] |
| Kagiso Mokoena | 34567 | 10/18 | 56% | ⚠️ 2/3 | ⚠️ Needs Attention | → | 12/11/2024 | [Remind] |
| James Smith | 45679 | 9/18 | 50% | ✅ 3/3 | ⚠️ Needs Attention | ↓ | 08/11/2024 | [Escalate] |
| David Koopman | 56780 | 6/18 | 33% | 🚨 1/3 | 🚨 Urgent | ↓↓ | 05/10/2024 | [Escalate] |

**Summary Statistics:**
- Representatives on track: 8/12 (67%)
- Average completion: 67%
- Highest performer: Thandiwe Mkhize (89%)
- Lowest performer: David Koopman (33%)

**Sort Options:**
- By completion % (high to low)
- By status (urgent first)
- By last activity (most recent)
- By name (A-Z)
- By supervisor

**Filter Options:**
- Show: All / On Track / Needs Attention / Urgent
- Ethics status: All / Compliant / Non-compliant
- Activity: Active (last 30 days) / Inactive

### Visual Comparison Chart

**Bar Chart - Hours by Representative:**
- X-axis: Representative names
- Y-axis: CPD hours (0-18)
- Bars color-coded by status:
  - Green: On track
  - Amber: Needs attention
  - Red: Urgent
- Dotted line: 18-hour target
- Dotted line: Expected hours by now (13 hours)

**Chart Legend:**
- 🟢 On Track (8)
- 🟡 Needs Attention (3)
- 🔴 Urgent (1)

### Category Performance Comparison

**Heatmap Table:**

| Representative | Technical CPD | Ethics | Verifiable % | Overall |
|----------------|---------------|--------|--------------|---------|
| Thandiwe Mkhize | 🟢 13/14 | 🟢 4/3 | 🟢 94% | 🟢 89% |
| Johan van Zyl | 🟢 12/14 | 🟢 3/3 | 🟢 87% | 🟢 83% |
| Linda Zwane | 🟢 11/14 | 🟢 3/3 | 🟢 86% | 🟢 78% |
| Peter Williams | 🟢 11/14 | 🟢 3/3 | 🟢 79% | 🟢 78% |
| Amanda Botha | 🟢 11/14 | 🟢 4/3 | 🟢 93% | 🟢 78% |
| Michael Chen | 🟢 10/14 | 🟢 3/3 | 🟢 77% | 🟢 72% |
| Sipho Dlamini | 🟢 10/14 | 🟢 3/3 | 🟢 85% | 🟢 72% |
| Rachel Levy | 🟢 9/14 | 🟢 3/3 | 🟢 75% | 🟢 67% |
| Sarah Naidoo | 🟡 8/14 | 🔴 2/3 | 🟡 82% | 🟡 61% |
| Kagiso Mokoena | 🟡 7/14 | 🟡 2/3 | 🟡 70% | 🟡 56% |
| James Smith | 🟡 6/14 | 🟢 3/3 | 🔴 67% | 🟡 50% |
| David Koopman | 🔴 5/14 | 🔴 1/3 | 🔴 50% | 🔴 33% |

**Heat map colors:**
- 🟢 Green: Meeting/exceeding requirements (>75%)
- 🟡 Amber: Behind but recoverable (50-75%)
- 🔴 Red: Significantly behind (<50%)

### Bulk Actions Panel

**Multi-select Actions:**
- [ ] Select all representatives
- [ ] Select "Needs Attention" only
- [ ] Select "Urgent" only

**Available Actions:**
- [Send Reminder Emails] (selected: 0)
- [Schedule Follow-up Meetings] (selected: 0)
- [Generate Progress Reports] (selected: 0)
- [Export to Excel]

---

## 4. DEADLINE ALERTS

### Alert Configuration Panel

**Current Alert Rules:**

**Rule 1: 90-Day Warning**
- Trigger: 90 days before deadline
- Condition: Progress <75%
- Recipients: Representative + Supervisor
- Action: Email + In-app notification
- Status: ✅ Active
- Last sent: 15/09/2024 (3 recipients)

**Rule 2: 60-Day Warning**
- Trigger: 60 days before deadline
- Condition: Progress <60%
- Recipients: Representative + Supervisor + Compliance Officer
- Action: Email + In-app + SMS
- Status: ✅ Active
- Next scheduled: 01/04/2025

**Rule 3: 30-Day Critical**
- Trigger: 30 days before deadline
- Condition: Progress <50%
- Recipients: All stakeholders + FSP Owner
- Action: Email + In-app + SMS + Teams notification
- Status: ✅ Active
- Next scheduled: 01/05/2025

**Rule 4: Ethics Requirement Not Met**
- Trigger: Immediate
- Condition: Ethics hours <3
- Recipients: Representative + Compliance Officer
- Action: Email + In-app notification
- Status: ✅ Active
- Active alerts: 2 representatives

**[Add New Alert Rule]** [Edit Rules] [View Alert History]

### Active Alerts Dashboard

**Current Active Alerts (7):**

**Critical Alerts (1) - Red:**
```
🚨 David Koopman - Severely Behind Schedule
FSP 56780
Progress: 6/18 hours (33%)
Days remaining: 167
Gap: -7 hours from expected
Ethics: 1/3 hours 🚨
Last activity: 05/10/2024 (70 days ago)
Action Required: Immediate intervention

[Schedule Meeting] [Send Escalation Email] [View Details]
```

**Warning Alerts (3) - Amber:**
```
⚠️ Sarah Naidoo - Ethics Requirement Not Met
FSP 23456
Progress: 11/18 hours (61%)
Ethics: 2/3 hours (below minimum)
Recommended action: Book ethics course

[Send Reminder] [Suggest Courses] [View Profile]
```

```
⚠️ Kagiso Mokoena - Below Expected Progress
FSP 34567
Progress: 10/18 hours (56%)
Expected: 13 hours
Gap: -3 hours

[Send Reminder] [View Progress]
```

```
⚠️ James Smith - Verifiable Hours Low
FSP 45679
Progress: 9/18 hours (50%)
Verifiable: 6/9 hours (67% - below target 75%)
Action: Prioritize verifiable activities

[Send Guidance] [View Activities]
```

**Information Alerts (3) - Blue:**
```
ℹ️ Rachel Levy - Approaching Next Milestone
FSP 01234
Progress: 12/18 hours (67%)
Next milestone: 16 hours by 31/03/2025
On track: Maintain current pace

[View Timeline] [Acknowledge]
```

```
ℹ️ Michael Chen - Inactive for 25 Days
FSP 89012
Progress: 13/18 hours (72%)
Last activity: 20/11/2024
Reminder: Consider scheduling next activity

[Send Gentle Reminder]
```

```
ℹ️ Linda Zwane - Ethics Exceeded
FSP 56789
Progress: 14/18 hours (78%)
Ethics: 3/3 hours ✅
Note: Can reallocate surplus ethics hours

[View Breakdown]
```

### Alert History

**Recent Alerts Sent (Last 30 Days):**

| Date | Alert Type | Recipient | Status | Response | Time to Action |
|------|------------|-----------|--------|----------|----------------|
| 15/12/2024 | Critical | David Koopman | 🔴 No response | - | 0 days |
| 12/12/2024 | Warning | Sarah Naidoo | ⚠️ Acknowledged | Email opened | 1 day |
| 10/12/2024 | Info | Michael Chen | ✅ Resolved | Activity logged | 2 days |
| 05/12/2024 | Warning | Kagiso Mokoena | ⚠️ Pending | Email opened | 10 days |
| 01/12/2024 | Critical | James Smith | ⚠️ In progress | Meeting scheduled | 14 days |

**Alert Statistics:**
- Total alerts sent (this cycle): 47
- Average response time: 3.5 days
- Resolution rate: 78%
- Escalations required: 3

**[View Full Alert History]** [Export Report] [Configure Alert Rules]

### Scheduled Reminders

**Upcoming Automated Reminders:**

| Scheduled Date | Recipients | Message Type | Condition |
|----------------|------------|--------------|-----------|
| 20/12/2024 | 4 representatives | General reminder | <70% progress |
| 31/01/2025 | All representatives | Mid-cycle check-in | All |
| 28/02/2025 | 6 representatives | 3-month warning | <80% progress |
| 31/03/2025 | All representatives | Final quarter push | <100% |
| 01/05/2025 | Non-compliant reps | Critical 30-day alert | <100% |

**[Edit Schedule]** [Add Custom Reminder] [Preview Messages]

---

## 5. ACTIVITY FEED

### Real-Time Activity Stream

**Live Feed - Last 30 Days:**

**Today - 15 December 2024**
```
🎓 10:30 AM - Thandiwe Mkhize
Logged new CPD activity: "Product Update: Living Annuities"
Provider: Old Mutual | Hours: 2.0 | Category: Product Knowledge
Status: Pending approval
[Approve] [Review] [Request Info]
```

```
📧 09:15 AM - System
Reminder email sent to Sarah Naidoo
Subject: "CPD Progress Update - Ethics Requirement"
Status: Delivered ✓
[View Email] [Track Response]
```

**Yesterday - 14 December 2024**
```
✅ 16:45 PM - Compliance Officer
Approved CPD activity for Johan van Zyl
Activity: "FAIS Compliance Update" | Hours: 1.5
New total: 15/18 hours (83%)
```

```
📊 14:30 PM - System
Weekly progress report generated
Recipients: FSP Owner, Key Individuals, Compliance Officer
[View Report]
```

**13 December 2024**
```
🎓 11:20 AM - Peter Williams
Logged new CPD activity: "Risk Management Workshop"
Provider: ASISA | Hours: 3.0 | Category: Risk Management
Attached: Certificate.pdf
Status: Pending approval
[Approve] [Review]
```

```
⚠️ 09:00 AM - System
Alert triggered for David Koopman
Type: 70-day inactivity warning
Notifications sent to: Rep, Supervisor, Compliance Officer
[View Alert Details]
```

**12 December 2024**
```
📅 15:30 PM - Linda Zwane
Registered for upcoming CPD course
Course: "Ethics in Financial Services"
Provider: FPI | Date: 20/01/2025 | Hours: 1.5
Status: Booking confirmed
```

**Filter Options:**
- Activity type: All / Logged / Approved / Rejected / Reminders / Alerts
- Representative: All / Select specific
- Date range: Last 7 days / 30 days / 90 days / Custom
- Status: All / Pending / Complete / Action required

**[Export Activity Log]** [Subscribe to Feed] [Configure Filters]

### Activity Statistics

**This Month (December 2024):**
- Activities logged: 12
- Activities approved: 8
- Pending approval: 4
- Total hours logged: 18.5
- Reminders sent: 7
- Alerts triggered: 3

**Busiest Days:**
- Monday: 5 activities
- Wednesday: 4 activities
- Friday: 3 activities

**Most Active Representatives:**
1. Thandiwe Mkhize - 3 activities
2. Johan van Zyl - 2 activities
3. Peter Williams - 2 activities

---

## 6. REPORTS & ANALYTICS

### Pre-Built Reports

**Report 1: CPD Progress Summary**
- Description: Comprehensive overview of all representatives
- Includes: Progress %, hours breakdown, status, trends
- Format: PDF, Excel
- Frequency: Weekly
- Last generated: 14/12/2024
- [Generate Now] [Schedule] [View Sample]

**Report 2: At-Risk Representatives**
- Description: Detailed analysis of representatives behind schedule
- Includes: Gap analysis, recommendations, action plans
- Format: PDF, Excel
- Frequency: Bi-weekly
- Last generated: 09/12/2024
- [Generate Now] [Schedule] [Email to FSP Owner]

**Report 3: Category Analysis**
- Description: Breakdown by CPD category (Technical, Ethics, etc.)
- Includes: Hours by category, compliance rates, gaps
- Format: PDF, Excel, PowerPoint
- Frequency: Monthly
- Last generated: 30/11/2024
- [Generate Now] [Schedule]

**Report 4: Monthly Activity Summary**
- Description: All CPD activities logged in the month
- Includes: Activity log, approvals, rejections, providers
- Format: PDF, Excel
- Frequency: Monthly (end of month)
- Last generated: 30/11/2024
- [Generate Now] [Schedule]

**Report 5: Forecast & Projections**
- Description: Projected completion rates based on current trends
- Includes: Statistical forecasts, risk assessment, interventions needed
- Format: PDF, PowerPoint
- Frequency: Quarterly
- Last generated: 30/09/2024
- [Generate Now] [Schedule]

### Custom Report Builder

**Report Configuration:**

**1. Select Data:**
- [ ] Representative details
- [ ] CPD hours (total, technical, ethics)
- [ ] Activity log
- [ ] Approval status
- [ ] Compliance status
- [ ] Trends and analytics
- [ ] Alerts and notifications

**2. Filter Criteria:**
- Representatives: All / Select specific / By status
- Date range: Current cycle / Custom date range
- Status filter: All / On track / Needs attention / Urgent
- Include: Active only / Include terminated reps

**3. Group By:**
- None
- Supervisor
- Branch
- Category
- Status

**4. Sort By:**
- Name (A-Z)
- Progress (high to low)
- Last activity (recent first)
- Status (critical first)

**5. Export Format:**
- PDF (formatted report)
- Excel (data spreadsheet)
- CSV (raw data)
- PowerPoint (presentation)

**6. Schedule:**
- Generate once now
- Schedule: Weekly / Bi-weekly / Monthly
- Email to: Select recipients
- Save as template: [Name template]

**[Preview Report]** [Generate] [Save as Template]

### Analytics Dashboard

**Historical Trends:**

**Line Chart - CPD Progress Over Time:**
- X-axis: Months (Jun 2024 - May 2025)
- Y-axis: Average hours per representative
- Lines:
  - Current cycle (2024/2025)
  - Previous cycle (2023/2024) - for comparison
  - Ideal progress line

**Key Insights:**
- Current cycle ahead of previous cycle by 12%
- Peak logging period: September-October
- Slowest period: December-January (holiday season)
- Average monthly growth: 1.8 hours/rep

**Compliance Rate Trends:**

**Area Chart:**
- Shows % of representatives compliant over time
- Current cycle vs. previous cycle
- Industry benchmark line (if available)

**Provider Analysis:**

**Bar Chart - Top CPD Providers:**
1. Old Mutual: 45 hours
2. ASISA: 38 hours
3. FPI: 32 hours
4. FSCA: 18 hours
5. Alexander Forbes: 15 hours

**Category Distribution:**

**Pie Chart:**
- Product Knowledge: 35%
- Regulatory Updates: 22%
- Ethics: 18%
- Market Analysis: 15%
- Risk Management: 10%

**Statistical Analysis:**

**Key Metrics:**
- Standard deviation: 3.2 hours
- Median completion: 68%
- Mode: 14 hours (most common)
- Completion velocity: 1.9 hours/month/rep
- Projected completion rate: 78% by deadline
- Risk probability: 22% will miss deadline

**Predictive Analytics:**

**Forecast Model:**
Based on current trends, projected outcomes:
- Representatives on track: 8/12 (67%)
- Representatives at risk: 3/12 (25%)
- Representatives likely to miss: 1/12 (8%)

**Recommended Interventions:**
- David Koopman: Immediate intensive support
- Sarah Naidoo: Schedule ethics course by Jan 31
- Kagiso Mokoena: Monthly check-ins
- James Smith: Supervisor meeting

---

## ROLE-BASED ACCESS CONTROL

### FSP Owner / Principal
- **Access:** Full access to all CPD Progress features
- **Dashboard View:** Entire FSP overview
- **Actions:** View all reports, send reminders, configure alerts, approve exceptions
- **Alerts:** Receives critical alerts and monthly summaries
- **Reports:** All reports, custom report builder

### Key Individual
- **Access:** Full access for supervised representatives
- **Dashboard View:** Filtered to supervised team
- **Actions:** View progress, send reminders, approve activities, escalate issues
- **Alerts:** Receives alerts for supervised representatives
- **Reports:** Team-level reports only

### Compliance Officer
- **Access:** Full access to all CPD Progress features
- **Dashboard View:** Comprehensive compliance workspace
- **Actions:** All monitoring, approval, alert configuration, report generation
- **Alerts:** All alerts and notifications
- **Reports:** All reports, custom reports, analytics

### Representative
- **Access:** Read-only view of own CPD progress
- **Dashboard View:** Personal CPD dashboard only
- **Actions:** View own progress, log activities, view recommendations
- **Alerts:** Receives personal reminders and alerts
- **Reports:** Personal progress report only

### Admin Staff
- **Access:** Limited to data entry and basic reporting
- **Dashboard View:** Team overview (read-only)
- **Actions:** Log activities on behalf of representatives, generate reports
- **Alerts:** None
- **Reports:** Standard reports only (no custom)

### External Auditor (Optional)
- **Access:** Read-only access to all CPD data
- **Dashboard View:** Audit-focused view
- **Actions:** View only, export data
- **Alerts:** None
- **Reports:** All reports (read-only)

---

## API ENDPOINTS

### GET /api/cpd-progress/overview
**Returns FSP-wide CPD statistics**

Response:
```json
{
  "cycle": {
    "startDate": "2024-06-01",
    "endDate": "2025-05-31",
    "daysRemaining": 167,
    "percentElapsed": 46
  },
  "fspStats": {
    "complianceRate": 67,
    "totalHoursLogged": 168,
    "totalHoursRequired": 216,
    "averageHoursPerRep": 14.0,
    "repsOnTrack": 8,
    "repsNeedAttention": 3,
    "repsUrgent": 1,
    "totalRepresentatives": 12
  },
  "categoryBreakdown": {
    "technical": {
      "required": 168,
      "logged": 132,
      "progress": 79
    },
    "ethics": {
      "required": 36,
      "logged": 34,
      "progress": 94
    },
    "verifiable": {
      "total": 142,
      "percentage": 85
    }
  }
}
```

### GET /api/cpd-progress/representatives
**Returns all representatives with CPD progress**

Query parameters:
- status: on_track | needs_attention | urgent
- supervisor: [supervisor_id]
- branch: [branch_name]
- sort: progress | status | last_activity | name

Response:
```json
{
  "representatives": [
    {
      "id": "rep123",
      "fspNumber": "12345",
      "name": "Thandiwe Mkhize",
      "email": "thandiwe.mkhize@customfs.co.za",
      "phone": "+27 82 555 9999",
      "supervisor": "Key Individual",
      "branch": "Cape Town",
      "progress": {
        "totalHours": 16,
        "requiredHours": 18,
        "percentComplete": 89,
        "status": "on_track",
        "technical": {
          "hours": 13,
          "required": 14
        },
        "ethics": {
          "hours": 4,
          "required": 3,
          "compliant": true
        },
        "verifiable": {
          "hours": 14,
          "percentage": 88
        }
      },
      "lastActivity": "2024-12-10",
      "trend": "up",
      "alerts": []
    }
  ],
  "summary": {
    "total": 12,
    "onTrack": 8,
    "needsAttention": 3,
    "urgent": 1
  }
}
```

### GET /api/cpd-progress/representative/:id
**Returns detailed CPD progress for specific representative**

Response:
```json
{
  "representative": {
    "id": "rep456",
    "fspNumber": "23456",
    "name": "Sarah Naidoo",
    "email": "sarah.naidoo@customfs.co.za",
    "phone": "+27 82 555 1234",
    "category": "Long-term Insurance",
    "supervisor": {
      "id": "rep123",
      "name": "Thandiwe Mkhize"
    }
  },
  "progress": {
    "totalHours": 11,
    "requiredHours": 18,
    "percentComplete": 61,
    "status": "needs_attention",
    "expectedHours": 13,
    "variance": -2,
    "variancePercent": -15,
    "breakdown": {
      "technical": {
        "total": { "hours": 8, "required": 14, "status": "amber" },
        "longTermInsurance": { "hours": 6, "required": 7 },
        "generalFinancial": { "hours": 2, "required": 7 }
      },
      "ethics": {
        "hours": 2,
        "required": 3,
        "status": "red",
        "compliant": false
      }
    },
    "verifiable": {
      "hours": 9,
      "required": 14,
      "percentage": 64
    }
  },
  "activities": [
    {
      "id": "act123",
      "date": "2024-12-10",
      "title": "Product Update: Living Annuities",
      "provider": "Old Mutual",
      "category": "Product Knowledge",
      "hours": 2.0,
      "type": "Verifiable",
      "status": "Approved"
    }
  ],
  "milestones": [
    {
      "date": "2024-09-30",
      "targetHours": 6,
      "actualHours": 7,
      "status": "achieved"
    },
    {
      "date": "2024-12-31",
      "targetHours": 13,
      "actualHours": 11,
      "status": "behind"
    }
  ],
  "recommendations": [
    {
      "priority": "urgent",
      "type": "ethics_requirement",
      "message": "Complete ethics requirement (currently 2/3 hours)",
      "action": "Book ethics course immediately",
      "suggestedProviders": ["FPI Ethics Course", "ASISA Ethics Update"]
    }
  ],
  "alerts": [
    {
      "id": "alert789",
      "type": "ethics_not_met",
      "priority": "critical",
      "message": "Ethics requirement not met",
      "dateCreated": "2024-12-15"
    }
  ]
}
```

### GET /api/cpd-progress/comparison
**Returns team comparison data**

Response:
```json
{
  "comparison": [
    {
      "representativeId": "rep123",
      "name": "Thandiwe Mkhize",
      "fspNumber": "12345",
      "totalHours": 16,
      "percentComplete": 89,
      "ethics": { "hours": 4, "compliant": true },
      "status": "on_track",
      "trend": "up",
      "lastActivity": "2024-12-10"
    }
  ],
  "statistics": {
    "average": 14.0,
    "median": 13.5,
    "highest": { "rep": "Thandiwe Mkhize", "hours": 16 },
    "lowest": { "rep": "David Koopman", "hours": 6 }
  }
}
```

### GET /api/cpd-progress/alerts
**Returns active alerts**

Query parameters:
- priority: critical | warning | info
- representative: [rep_id]
- status: active | resolved

Response:
```json
{
  "alerts": [
    {
      "id": "alert123",
      "type": "severely_behind",
      "priority": "critical",
      "representative": {
        "id": "rep567",
        "name": "David Koopman",
        "fspNumber": "56780"
      },
      "message": "Severely behind schedule (6/18 hours, 33%)",
      "details": {
        "gap": -7,
        "ethicsHours": 1,
        "lastActivity": "2024-10-05",
        "daysSinceActivity": 70
      },
      "dateCreated": "2024-12-15",
      "status": "active",
      "actions": ["schedule_meeting", "send_escalation", "view_details"]
    }
  ],
  "summary": {
    "total": 7,
    "critical": 1,
    "warning": 3,
    "info": 3
  }
}
```

### POST /api/cpd-progress/alert-rules
**Configure alert rules**

Request:
```json
{
  "rule": {
    "name": "90-Day Warning",
    "trigger": {
      "type": "days_before_deadline",
      "value": 90
    },
    "condition": {
      "type": "progress_below",
      "value": 75
    },
    "recipients": ["representative", "supervisor"],
    "notifications": ["email", "in_app"],
    "active": true
  }
}
```

### GET /api/cpd-progress/activity-feed
**Returns recent activity stream**

Query parameters:
- type: logged | approved | rejected | reminder | alert
- representative: [rep_id]
- dateFrom: [date]
- dateTo: [date]
- limit: [number]

Response:
```json
{
  "activities": [
    {
      "id": "feed123",
      "timestamp": "2024-12-15T10:30:00Z",
      "type": "cpd_logged",
      "representative": {
        "id": "rep123",
        "name": "Thandiwe Mkhize"
      },
      "details": {
        "activity": "Product Update: Living Annuities",
        "provider": "Old Mutual",
        "hours": 2.0,
        "category": "Product Knowledge"
      },
      "status": "pending_approval",
      "actions": ["approve", "review", "request_info"]
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 5,
    "totalItems": 47
  }
}
```

### POST /api/cpd-progress/reminders/send
**Send manual reminder**

Request:
```json
{
  "recipients": ["rep456", "rep567"],
  "messageType": "custom",
  "subject": "CPD Progress Update - Action Required",
  "message": "Custom message content...",
  "includeProgress": true,
  "includeRecommendations": true
}
```

### GET /api/cpd-progress/reports/generate
**Generate report**

Query parameters:
- type: progress_summary | at_risk | category_analysis | monthly_activity | forecast
- format: pdf | excel | csv | powerpoint
- representatives: all | [comma-separated IDs]
- dateFrom: [date]
- dateTo: [date]

Response:
```json
{
  "report": {
    "id": "report123",
    "type": "progress_summary",
    "format": "pdf",
    "status": "generating",
    "downloadUrl": "/api/reports/download/report123",
    "expiresAt": "2024-12-16T10:30:00Z"
  }
}
```

### GET /api/cpd-progress/analytics
**Returns analytics and trends**

Response:
```json
{
  "trends": {
    "currentCycle": {
      "averageMonthlyGrowth": 1.8,
      "peakPeriod": "September-October",
      "slowestPeriod": "December-January"
    },
    "comparison": {
      "currentVsPrevious": 12,
      "trend": "ahead"
    }
  },
  "providers": [
    { "name": "Old Mutual", "hours": 45 },
    { "name": "ASISA", "hours": 38 },
    { "name": "FPI", "hours": 32 }
  ],
  "categories": {
    "productKnowledge": 35,
    "regulatory": 22,
    "ethics": 18,
    "marketAnalysis": 15,
    "riskManagement": 10
  },
  "predictions": {
    "projectedCompletionRate": 78,
    "repsLikelyToMiss": 1,
    "riskProbability": 22
  }
}
```

---

## SAMPLE DATA

### Representative CPD Progress Data

```json
[
  {
    "id": "rep123",
    "fspNumber": "12345",
    "firstName": "Thandiwe",
    "lastName": "Mkhize",
    "email": "thandiwe.mkhize@customfs.co.za",
    "phone": "+27 82 555 9999",
    "category": "Long-term Insurance",
    "supervisor": "Key Individual",
    "branch": "Cape Town",
    "progress": {
      "totalHours": 16,
      "requiredHours": 18,
      "percentComplete": 89,
      "status": "on_track",
      "technical": 13,
      "technicalRequired": 14,
      "ethics": 4,
      "ethicsRequired": 3,
      "ethicsCompliant": true,
      "verifiable": 14,
      "verifiablePercent": 88
    },
    "lastActivity": "2024-12-10",
    "trend": "up",
    "activities": 9
  },
  {
    "id": "rep456",
    "fspNumber": "23456",
    "firstName": "Sarah",
    "lastName": "Naidoo",
    "email": "sarah.naidoo@customfs.co.za",
    "phone": "+27 82 555 1234",
    "category": "Long-term Insurance",
    "supervisor": "Thandiwe Mkhize",
    "branch": "Cape Town",
    "progress": {
      "totalHours": 11,
      "requiredHours": 18,
      "percentComplete": 61,
      "status": "needs_attention",
      "technical": 8,
      "technicalRequired": 14,
      "ethics": 2,
      "ethicsRequired": 3,
      "ethicsCompliant": false,
      "verifiable": 9,
      "verifiablePercent": 82
    },
    "lastActivity": "2024-11-25",
    "trend": "down",
    "activities": 6,
    "alerts": [
      {
        "type": "ethics_not_met",
        "priority": "critical"
      }
    ]
  },
  {
    "id": "rep567",
    "fspNumber": "56780",
    "firstName": "David",
    "lastName": "Koopman",
    "email": "david.koopman@customfs.co.za",
    "phone": "+27 82 555 4567",
    "category": "Long-term Insurance",
    "supervisor": "Thandiwe Mkhize",
    "branch": "Cape Town",
    "progress": {
      "totalHours": 6,
      "requiredHours": 18,
      "percentComplete": 33,
      "status": "urgent",
      "technical": 5,
      "technicalRequired": 14,
      "ethics": 1,
      "ethicsRequired": 3,
      "ethicsCompliant": false,
      "verifiable": 3,
      "verifiablePercent": 50
    },
    "lastActivity": "2024-10-05",
    "trend": "down_down",
    "activities": 3,
    "alerts": [
      {
        "type": "severely_behind",
        "priority": "critical"
      },
      {
        "type": "inactive_70_days",
        "priority": "critical"
      }
    ]
  }
]
```

### CPD Activities Sample

```json
[
  {
    "id": "act123",
    "representativeId": "rep123",
    "date": "2024-12-10",
    "title": "Product Update: Living Annuities",
    "description": "Comprehensive update on living annuity products and recent legislative changes",
    "provider": "Old Mutual",
    "category": "Product Knowledge",
    "subcategory": "Long-term Insurance",
    "hours": 2.0,
    "type": "Verifiable",
    "format": "Webinar",
    "status": "Approved",
    "certificate": "cert_123.pdf",
    "approvedBy": "Compliance Officer",
    "approvedDate": "2024-12-11"
  },
  {
    "id": "act456",
    "representativeId": "rep456",
    "date": "2024-11-25",
    "title": "FAIS Compliance Refresher",
    "description": "Annual refresher on FAIS Act requirements and recent FSCA guidance",
    "provider": "FSCA",
    "category": "Regulatory",
    "subcategory": "Compliance",
    "hours": 1.5,
    "type": "Verifiable",
    "format": "Online Course",
    "status": "Approved",
    "certificate": "cert_456.pdf",
    "approvedBy": "Compliance Officer",
    "approvedDate": "2024-11-26"
  }
]
```

### Alert Rules Sample

```json
[
  {
    "id": "rule1",
    "name": "90-Day Warning",
    "active": true,
    "trigger": {
      "type": "days_before_deadline",
      "value": 90
    },
    "condition": {
      "type": "progress_below",
      "value": 75
    },
    "recipients": ["representative", "supervisor"],
    "notifications": ["email", "in_app"],
    "lastTriggered": "2024-09-15",
    "timesTriggered": 3
  },
  {
    "id": "rule2",
    "name": "Ethics Requirement Not Met",
    "active": true,
    "trigger": {
      "type": "immediate",
      "condition": "ethics_hours_below_3"
    },
    "recipients": ["representative", "compliance_officer"],
    "notifications": ["email", "in_app"],
    "lastTriggered": "2024-12-15",
    "timesTriggered": 2
  }
]
```

---

## VALIDATION RULES

### Progress Calculation
- Total hours = Sum of all approved activities
- Technical CPD = Total hours - Ethics hours
- Ethics hours = Hours from ethics category activities
- Verifiable % = (Verifiable hours / Total hours) × 100
- Status determination:
  - On Track: ≥75% progress OR ahead of expected
  - Needs Attention: 50-74% progress
  - Urgent: <50% progress OR ethics not met

### Alert Triggers
- 90-day warning: Progress <75% when 90 days remain
- 60-day warning: Progress <60% when 60 days remain
- 30-day critical: Progress <50% when 30 days remain
- Ethics alert: Immediate when ethics <3 hours
- Inactivity alert: No activity logged for >60 days

### Trend Calculation
- Up: Progress increased >5% in last 30 days
- Down: Progress decreased OR no activity in 30 days
- Stable: Progress within ±5% in last 30 days

### Report Validation
- Date range cannot exceed 12 months
- Minimum 1 representative selected
- Export format must be valid (PDF, Excel, CSV, PowerPoint)
- Scheduled reports require email recipients

---

## INTEGRATION POINTS

### Depends On:
- **CPD Management Module:** Core CPD tracking functionality
- **Representatives Management:** Representative profiles and data
- **Alerts & Notifications:** Alert delivery system
- **User Management:** Role-based access control

### Integrates With:
- **Compliance Dashboard:** Feeds CPD compliance status
- **Executive Dashboard:** Provides FSP-wide CPD metrics
- **Reports Module:** Supplies CPD data for reports
- **Audit Trail:** Logs all CPD progress views and actions

### Triggers:
- Generates alerts based on progress thresholds
- Updates compliance status in Representatives module
- Feeds data to Executive and Compliance dashboards
- Triggers reminders and escalations

---

## REGULATORY REFERENCES

### FAIS Act Requirements
- **Section 8A:** CPD Requirements
  - 30 hours annually (changed from 18 hours in some categories)
  - Minimum 3 hours ethics and practice standards
  - Minimum 75% verifiable

### FSCA Board Notice 194 of 2017
- CPD cycle: 1 June - 31 May annually
- Category-specific requirements
- Verifiable vs. non-verifiable activities
- Approved providers and formats

### Compliance Obligations
- Representatives must maintain current CPD
- FSP must monitor and track compliance
- Non-compliance affects Fit & Proper status
- Must provide evidence upon FSCA request

---

## MOBILE RESPONSIVENESS

### Mobile View Adaptations
- Stack cards vertically on <768px screens
- Convert tables to stacked cards
- Collapsible sections for detailed data
- Touch-friendly buttons (min 44px)
- Swipeable chart interactions
- Simplified navigation (hamburger menu)
- Representative cards: 1 column on mobile, 2 on tablet, 3 on desktop

### Priority Content on Mobile
1. Countdown timer
2. Personal/team progress
3. Active alerts
4. Recent activities
5. Quick actions

---

## ACCESSIBILITY

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader labels
- High contrast mode
- Alt text for all icons and charts
- Focus indicators on interactive elements
- Color-blind friendly palette (not relying on color alone)

---

## PERFORMANCE REQUIREMENTS

- Initial page load: <2 seconds
- Chart rendering: <1 second
- Table filtering: <500ms
- Report generation: <10 seconds
- Real-time updates: <5 seconds
- API response time: <1 second

---

## ERROR HANDLING

### Common Errors

**1. No Data Available**
```
ℹ️ No CPD progress data available for the current cycle.
Representatives may not have logged activities yet.
[View Previous Cycle] [Upload Activity]
```

**2. Calculation Error**
```
⚠️ Unable to calculate progress for some representatives.
This may be due to missing or incomplete data.
[View Affected Representatives] [Contact Support]
```

**3. Alert System Failure**
```
🚨 Alert system temporarily unavailable.
Alerts will be sent once the system is restored.
[Retry] [View System Status]
```

**4. Report Generation Failed**
```
❌ Report generation failed.
Please try again or contact support.
Error code: RPT-500
[Retry] [Contact Support]
```

---

## TESTING SCENARIOS

### Scenario 1: Representative On Track
- Progress: 16/18 hours (89%)
- Ethics: 4/3 (compliant)
- Status: On track
- Expected: Green status badge, no alerts

### Scenario 2: Representative Behind
- Progress: 11/18 hours (61%)
- Ethics: 2/3 (non-compliant)
- Status: Needs attention
- Expected: Amber badge, ethics alert triggered

### Scenario 3: Representative Urgent
- Progress: 6/18 hours (33%)
- Ethics: 1/3 (non-compliant)
- Last activity: >60 days ago
- Expected: Red badge, multiple critical alerts

### Scenario 4: Milestone Achievement
- Representative reaches expected milestone
- System logs achievement
- Expected: Positive notification, trend indicator updates

### Scenario 5: Bulk Reminder
- FSP Owner sends reminder to 4 representatives
- System sends emails and in-app notifications
- Expected: Activity log updated, emails delivered

---

## DEPLOYMENT CHECKLIST

- [ ] All API endpoints tested
- [ ] Role-based access control verified
- [ ] Mobile responsiveness checked
- [ ] Alert system configured and tested
- [ ] Report generation tested (all formats)
- [ ] Integration with CPD Management module confirmed
- [ ] Sample data loaded for demonstration
- [ ] Error handling tested
- [ ] Performance benchmarks met
- [ ] Accessibility audit completed
- [ ] User acceptance testing passed
- [ ] Documentation updated
- [ ] Training materials prepared

---

**END OF CURSOR PROMPT**
