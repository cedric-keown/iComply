# CURSOR PROMPT: RISK & ALERTS DASHBOARD MODULE

Create a fully functional, realistic HTML mockup for the Risk & Alerts Dashboard module of a South African FAIS broker compliance portal. This critical module aggregates compliance risks across all FSP activities, prioritizes interventions, tracks alert resolution, and provides risk scoring to prevent regulatory breaches and maintain FSP license compliance.

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
- Risk Overview (default)
- Active Alerts
- Risk Register
- Mitigation Actions
- Alert History
- Risk Analytics
- Reports

---

## 1. RISK OVERVIEW

### FSP Risk Score (Hero Section)

**Current Date Context:** 15 December 2024

**Large Risk Score Gauge (Center):**
```
FSP RISK SCORE: 42 / 100
MODERATE RISK
```
- Circular gauge meter (0-100 scale)
- Color zones:
  - 0-25: Green (Low Risk)
  - 26-60: Amber (Moderate Risk)
  - 61-100: Red (High Risk)
- Current score: 42 (Amber zone)
- Trend: ↓ -8 from last month (improvement)
- Last calculated: 15/12/2024 08:00

**Risk Score Breakdown:**
- Fit & Proper Risk: 15/25 (Moderate)
- CPD Compliance Risk: 18/25 (Moderate)
- FICA Risk: 5/20 (Low)
- Document Compliance: 4/15 (Low)
- Complaints: 0/15 (None)

### Critical Metrics (4 Cards)

**Card 1: Active Alerts**
- Large number: 23
- Icon: Alert-triangle
- Label: "Active Alerts"
- Breakdown:
  - 🚨 Critical: 3
  - ⚠️ High: 8
  - ℹ️ Medium: 12
  - 📋 Low: 0
- [View All Alerts]
- Status: Warning (amber)

**Card 2: Overdue Actions**
- Large number: 5
- Icon: Clock
- Label: "Overdue Actions"
- Oldest: 12 days overdue
- Status: Danger (red)
- [Review Urgent]

**Card 3: Representatives at Risk**
- Large number: 4
- Icon: Users-x
- Label: "At Risk Representatives"
- Details: 
  - Non-compliant: 2
  - Expiring soon: 2
- [View Details]
- Status: Warning (amber)

**Card 4: Upcoming Deadlines**
- Large number: 7
- Icon: Calendar
- Label: "Next 30 Days"
- Next critical: 3 days
- Status: Info (blue)
- [View Calendar]

### Risk Heatmap Matrix

**Visual Grid - Risk by Category & Severity:**

| Risk Category | Critical | High | Medium | Low | Total Risk |
|---------------|----------|------|--------|-----|------------|
| **Fit & Proper** | 1 🚨 | 2 ⚠️ | 3 ℹ️ | 0 | 15/25 |
| **CPD Compliance** | 1 🚨 | 4 ⚠️ | 5 ℹ️ | 0 | 18/25 |
| **FICA Verification** | 0 | 1 ⚠️ | 2 ℹ️ | 5 ✅ | 5/20 |
| **Document Management** | 0 | 0 | 2 ℹ️ | 8 ✅ | 4/15 |
| **Complaints** | 0 | 0 | 0 | 0 | 0/15 |
| **Supervision** | 1 🚨 | 1 ⚠️ | 0 | 0 | - |
| **TOTAL** | **3** | **8** | **12** | **13** | **42/100** |

**Color Coding:**
- 🚨 Red: Critical (immediate action required)
- ⚠️ Amber: High (action required within 7 days)
- ℹ️ Blue: Medium (monitor closely)
- ✅ Green: Low/No risk (compliant)

**Click any cell to drill down to specific alerts**

### Risk Timeline (Visual Chart)

**Line Chart - Risk Score Over Time:**
- X-axis: Last 12 months (Dec 2023 - Dec 2024)
- Y-axis: Risk score (0-100)
- Lines:
  - Overall FSP risk score (thick line)
  - Risk threshold zones (shaded areas)
  - Individual category trend lines (thin, color-coded)

**Key Events Marked on Timeline:**
- Aug 2024: Spike to 58 (FICA verification backlog)
- Sep 2024: Drop to 45 (backlog cleared)
- Oct 2024: Rise to 50 (CPD deadline approaching)
- Dec 2024: Current 42 (improvement from proactive management)

**Risk Trajectory:**
- Current trend: ↓ Decreasing (good)
- Projected next month: 38 (if current interventions continue)
- Target: <30 (Low risk zone)

### Top 5 Critical Risks (Priority List)

**Risk 1: 🚨 CRITICAL**
```
David Koopman - Multiple Compliance Failures
FSP: 56780 | Risk Score: 85/100

Issues:
• CPD: 6/18 hours (33%) - 12 hours behind
• Ethics: 1/3 hours - Non-compliant
• Inactive: 70 days since last activity
• Fit & Proper: Expires in 45 days

Impact: High (can affect FSP license if not resolved)
Days Open: 12 days
Assigned: Compliance Officer
Status: ⏳ Intervention in progress

[View Full Profile] [Schedule Meeting] [Escalate]
```

**Risk 2: 🚨 CRITICAL**
```
FICA Verification Backlog - 18 Clients Pending
Risk Score: 72/100

Issues:
• 18 clients pending verification (>30 days)
• 3 clients high-risk (>60 days overdue)
• Potential FICA breach exposure

Impact: High (regulatory breach, fines)
Days Open: 8 days
Assigned: FICA Officer
Status: ⚠️ Urgent action required

[View Pending Clients] [Assign Resources] [Generate Report]
```

**Risk 3: 🚨 CRITICAL**
```
Key Individual - Supervision Gap
Peter Williams - FSP: 67890 | Risk Score: 68/100

Issues:
• 8 representatives supervised (max recommended: 6)
• 2 supervised reps non-compliant
• Supervision ratio: 133% (above threshold)

Impact: Medium (vicarious liability risk)
Days Open: 5 days
Assigned: FSP Owner
Status: 🔄 Restructuring planned

[Review Supervision] [Reallocate Reps] [Risk Assessment]
```

**Risk 4: ⚠️ HIGH**
```
Expiring Fit & Proper - 2 Representatives
Risk Score: 55/100

Representatives:
• Sarah Naidoo: Expires 18/01/2025 (34 days)
• Kagiso Mokoena: Expires 25/01/2025 (41 days)

Issues:
• Renewal applications not yet submitted
• Supporting documents pending

Impact: High (license suspension risk)
Days Open: 15 days
Assigned: Compliance Officer
Status: ⏳ Awaiting submissions

[Send Reminders] [Track Progress] [View Checklist]
```

**Risk 5: ⚠️ HIGH**
```
Document Retention - 127 Documents Expiring
Risk Score: 48/100

Issues:
• 127 documents expire within 90 days
• 42 documents require renewal/update
• 15 mandatory FAIS documents included

Impact: Medium (audit compliance)
Days Open: 20 days
Assigned: Admin Staff
Status: 📋 Review in progress

[View Document List] [Generate Renewal Schedule] [Assign Tasks]
```

**[View All Risks (23)]** [Export Risk Register] [Generate Report]

### Risk Distribution Chart

**Donut Chart - Alerts by Category:**
- CPD Compliance: 35% (8 alerts)
- Fit & Proper: 30% (7 alerts)
- FICA: 17% (4 alerts)
- Documents: 13% (3 alerts)
- Complaints: 0% (0 alerts)
- Other: 5% (1 alert)

**Donut Chart - Alerts by Severity:**
- 🚨 Critical: 13% (3 alerts)
- ⚠️ High: 35% (8 alerts)
- ℹ️ Medium: 52% (12 alerts)
- 📋 Low: 0% (0 alerts)

### Quick Actions Panel

**Immediate Actions Available:**
- [Generate Executive Risk Report] → PDF summary for FSP Owner
- [Send Bulk Reminders] → Email to all at-risk representatives
- [Schedule Risk Review Meeting] → Calendar integration
- [Export Risk Register] → Excel detailed list
- [Configure Alert Rules] → Customize thresholds
- [View Audit Trail] → Recent risk-related actions

---

## 2. ACTIVE ALERTS

### Alert Filters & Search

**Filter Panel:**
- Severity: All / Critical / High / Medium / Low
- Category: All / Fit & Proper / CPD / FICA / Documents / Complaints / Other
- Status: All / Open / In Progress / Resolved / Overdue
- Assigned to: All / Select person
- Date range: Last 7 days / 30 days / 90 days / Custom

**Search Bar:**
- "Search alerts by representative, description, or ID..."

**Sort Options:**
- By severity (critical first)
- By date (newest first)
- By assigned person
- By days open

### Active Alerts List (23 Total)

**CRITICAL ALERTS (3) - Red Background:**

**Alert #1:**
```
🚨 CRITICAL ALERT #AL2024-147
David Koopman - Severe CPD Non-Compliance

FSP Number: 56780
Category: CPD Compliance
Severity: Critical
Risk Score: 85/100
Created: 03/12/2024
Days Open: 12 days
Status: ⏳ In Progress

Description:
Representative is severely behind CPD requirements and non-compliant with ethics minimum. 
Last activity was 70 days ago. Immediate intervention required.

Details:
• CPD Progress: 6/18 hours (33%)
• Ethics: 1/3 hours (non-compliant)
• Expected progress: 13 hours (7 hours behind)
• Days until deadline: 167

Impact Assessment:
• Representative cannot operate if not resolved
• FSP license risk if pattern continues
• Potential vicarious liability under Section 13(2)(a)

Assigned To: Thandiwe Mkhize (Compliance Officer)
Last Updated: 15/12/2024 09:30
Next Review: 16/12/2024

Actions Taken:
✅ 15/12/2024: Meeting scheduled with representative
✅ 14/12/2024: Escalation email sent to FSP Owner
✅ 10/12/2024: Reminder email sent
⏳ 16/12/2024: Follow-up meeting planned

Required Actions:
1. Complete ethics requirement (2 hours needed)
2. Log 7 hours technical CPD by end of January
3. Submit action plan for remaining hours

[View Full Details] [Add Update] [Escalate] [Send Reminder] [Mark Resolved]
```

**Alert #2:**
```
🚨 CRITICAL ALERT #AL2024-148
FICA Backlog - High-Risk Clients Overdue

Category: FICA Verification
Severity: Critical
Risk Score: 72/100
Created: 07/12/2024
Days Open: 8 days
Status: ⚠️ Urgent Action Required

Description:
18 clients pending FICA verification with 3 high-risk clients overdue >60 days.
Potential regulatory breach.

Details:
• Total pending: 18 clients
• >30 days: 12 clients
• >60 days: 3 clients (HIGH RISK)
• >90 days: 0 clients

Regulatory Risk:
• FICA Act breach exposure
• Potential FSCA inspection finding
• Fines up to R10 million per Section 45

Assigned To: Linda Zwane (FICA Officer)
Last Updated: 15/12/2024 14:20
Next Review: 16/12/2024

Actions Taken:
✅ 15/12/2024: Resource allocation approved
✅ 13/12/2024: Priority list created
✅ 10/12/2024: Backlog identified

Required Actions:
1. Complete 3 high-risk verifications by 20/12/2024
2. Process remaining 15 by 31/01/2025
3. Implement prevention measures

[View Pending Clients] [Assign Resources] [Update Progress] [Generate Report]
```

**Alert #3:**
```
🚨 CRITICAL ALERT #AL2024-145
Key Individual Supervision Gap - Excessive Ratio

Representative: Peter Williams
FSP Number: 67890
Category: Supervision Structure
Severity: Critical
Risk Score: 68/100
Created: 10/12/2024
Days Open: 5 days
Status: 🔄 Restructuring Planned

Description:
Key Individual supervising 8 representatives (33% above recommended maximum of 6).
Two supervised representatives are non-compliant.

Details:
• Representatives supervised: 8
• Recommended maximum: 6
• Supervision ratio: 133%
• Non-compliant supervised reps: 2 (Sarah Naidoo, David Koopman)

Regulatory Risk:
• Vicarious liability exposure under Section 13(2)(a)
• Inadequate supervision capacity
• Potential FSP license issue

Assigned To: FSP Owner
Last Updated: 14/12/2024 11:00
Next Review: 17/12/2024

Actions Taken:
✅ 14/12/2024: Restructure proposal drafted
✅ 12/12/2024: Supervision capacity assessed
⏳ 17/12/2024: Board meeting scheduled

Required Actions:
1. Identify second Key Individual
2. Reallocate 2-3 representatives
3. Update supervision structure

[View Supervision Structure] [Reallocate Reps] [View Proposal] [Update Status]
```

**HIGH PRIORITY ALERTS (8) - Amber Background:**

**Alert #4:**
```
⚠️ HIGH ALERT #AL2024-149
Sarah Naidoo - Fit & Proper Expiring Soon

FSP Number: 23456
Category: Fit & Proper
Severity: High
Risk Score: 55/100
Created: 30/11/2024
Days Open: 15 days
Status: ⏳ Awaiting Submission

Description:
Fit & Proper status expires in 34 days. Renewal application not yet submitted.

Details:
• Current expiry: 18/01/2025
• Days remaining: 34 days
• Application status: Not submitted
• Required documents: 3 pending
• Ethics requirement: Not met (2/3 hours)

Risk:
• Cannot operate after expiry
• License suspension
• Client disruption

Assigned To: Compliance Officer
Last Updated: 15/12/2024 10:15
Next Review: 17/12/2024

Actions Required:
1. Submit renewal application by 20/12/2024
2. Upload supporting documents
3. Complete ethics CPD requirement

[Send Reminder] [View Checklist] [Track Documents] [Update]
```

*[7 more HIGH priority alerts displayed similarly]*

**MEDIUM PRIORITY ALERTS (12) - Blue Background:**

**Alert #5:**
```
ℹ️ MEDIUM ALERT #AL2024-150
Kagiso Mokoena - CPD Progress Behind Schedule

FSP Number: 34567
Category: CPD Compliance
Severity: Medium
Risk Score: 45/100
Created: 25/11/2024
Days Open: 20 days
Status: 📋 Monitoring

Description:
Representative behind expected CPD progress but still within recovery window.

Details:
• Current: 10/18 hours (56%)
• Expected: 13 hours (23% behind)
• Ethics: 2/3 hours (needs 1 more)
• Days remaining: 167 days

Actions Taken:
✅ 15/12/2024: Progress check sent
✅ 01/12/2024: Reminder email sent

Required Actions:
1. Log 1 ethics hour by 31/01/2025
2. Maintain pace of 1 activity per month
3. Review progress monthly

[View Progress] [Send Reminder] [Update Status]
```

*[11 more MEDIUM priority alerts displayed similarly]*

### Bulk Actions Panel

**Selected Alerts: 0**

**Available Actions:**
- [ ] Select all visible alerts
- [ ] Select all critical
- [ ] Select all high priority
- [ ] Select by assignee

**Actions:**
- [Reassign Selected] (0)
- [Send Reminders] (0)
- [Update Status] (0)
- [Export Selected] (0)
- [Generate Report] (0)

### Alert Statistics

**This Month (December 2024):**
- Alerts created: 12
- Alerts resolved: 7
- Alerts escalated: 3
- Average resolution time: 8.5 days
- Overdue alerts: 5

**By Category:**
- CPD: 8 alerts (35%)
- Fit & Proper: 7 alerts (30%)
- FICA: 4 alerts (17%)
- Documents: 3 alerts (13%)
- Other: 1 alert (5%)

---

## 3. RISK REGISTER

### Risk Register Table (Comprehensive)

**Sortable Table - All Identified Risks:**

| ID | Risk Description | Category | Likelihood | Impact | Risk Score | Status | Owner | Date Identified | Actions |
|----|-----------------|----------|------------|--------|------------|--------|-------|-----------------|---------|
| R-001 | David Koopman CPD non-compliance | CPD | Very High | High | 85 | Active | Compliance Officer | 03/12/2024 | [View] |
| R-002 | FICA verification backlog | FICA | High | Very High | 72 | Active | FICA Officer | 07/12/2024 | [View] |
| R-003 | Supervision gap - Peter Williams | Supervision | High | High | 68 | Active | FSP Owner | 10/12/2024 | [View] |
| R-004 | Sarah Naidoo F&P expiring | Fit & Proper | Medium | High | 55 | Active | Compliance Officer | 30/11/2024 | [View] |
| R-005 | Document retention expiring | Documents | Medium | Medium | 48 | Active | Admin Staff | 25/11/2024 | [View] |
| R-006 | Kagiso Mokoena CPD behind | CPD | Medium | Medium | 45 | Monitor | Key Individual | 25/11/2024 | [View] |
| R-007 | James Smith CPD progress | CPD | Medium | Medium | 42 | Monitor | Key Individual | 20/11/2024 | [View] |
| R-008 | Client database outdated | FICA | Low | Medium | 35 | Monitor | Admin Staff | 15/11/2024 | [View] |

**Risk Scoring Matrix:**
- **Likelihood:** Very Low (1) / Low (2) / Medium (3) / High (4) / Very High (5)
- **Impact:** Very Low (1) / Low (2) / Medium (3) / High (4) / Very High (5)
- **Risk Score:** Likelihood × Impact × 4 (max 100)

**Risk Status:**
- 🚨 Active: Requires immediate action
- ⏳ In Progress: Mitigation underway
- 📋 Monitor: Under observation
- ✅ Resolved: Risk mitigated
- 🔄 Recurring: Ongoing management

### Risk Details View

**Clicking any risk opens detailed modal:**

**Example: Risk R-001 - David Koopman CPD Non-Compliance**

```
RISK ID: R-001
CATEGORY: CPD Compliance
STATUS: 🚨 Active
RISK SCORE: 85/100 (Critical)

DESCRIPTION:
Representative David Koopman is severely behind CPD requirements with only 33% 
completion and non-compliant ethics hours. Last activity was 70 days ago.

LIKELIHOOD ASSESSMENT: Very High (5/5)
Rationale: Pattern of inactivity, missed deadlines, no progress in 70 days

IMPACT ASSESSMENT: High (4/5)
Rationale: 
• FSP license risk if not resolved
• Vicarious liability exposure
• Potential client impact
• Regulatory breach

ROOT CAUSE ANALYSIS:
• Personal circumstances affecting availability
• Lack of proactive monitoring
• Inadequate early intervention

MITIGATION STRATEGY:
1. Immediate Intervention (Priority 1):
   - Schedule face-to-face meeting (16/12/2024)
   - Develop personalized CPD action plan
   - Identify barriers and support needed

2. Short-term Actions (Next 30 days):
   - Complete ethics requirement (2 hours)
   - Log minimum 3 hours technical CPD
   - Weekly progress check-ins

3. Long-term Monitoring:
   - Monthly supervision meetings
   - Automated alerts for inactivity >14 days
   - Quarterly performance review

REGULATORY IMPLICATIONS:
• FAIS Act Section 8A: CPD requirement breach
• Section 13(2)(a): Vicarious liability exposure
• Potential FSCA inspection finding
• FSP Owner liability per Section 13

FINANCIAL IMPACT:
• Potential fines: R50,000 - R1,000,000
• Operational impact: Medium
• Reputational risk: High

TIMELINE:
• Risk Identified: 03/12/2024
• Days Open: 12 days
• Target Resolution: 31/01/2025
• Next Review: 16/12/2024

RISK OWNER: Thandiwe Mkhize (Compliance Officer)
ESCALATION PATH: FSP Owner → FSCA

MONITORING METRICS:
• CPD hours logged (weekly)
• Activity completion (monthly)
• Compliance status (ongoing)

RELATED RISKS:
• R-003: Supervision gap (same Key Individual)
• R-006: General CPD monitoring

DOCUMENTS:
• Action Plan (draft).pdf
• Meeting Notes 14-12-2024.pdf
• Email Correspondence.pdf

[Edit Risk] [Add Update] [Upload Document] [Close Risk] [Escalate]
```

### Add New Risk

**Risk Entry Form:**

**Risk Details:**
- Risk Title: [Text field]
- Category: [Dropdown: CPD / Fit & Proper / FICA / Documents / Complaints / Supervision / Other]
- Description: [Text area - 500 characters]

**Risk Assessment:**
- Likelihood: [1-5 scale]
- Impact: [1-5 scale]
- Risk Score: [Auto-calculated]

**Risk Management:**
- Risk Owner: [Dropdown: Select person]
- Status: [Active / Monitor / Resolved]
- Target Resolution Date: [Date picker]

**Mitigation Strategy:**
- Immediate Actions: [Text area]
- Short-term Actions: [Text area]
- Long-term Monitoring: [Text area]

**Regulatory References:**
- Applicable Legislation: [Multi-select checkboxes]
- Potential Penalties: [Text field]

[Save Risk] [Save & Add Another] [Cancel]

---

## 4. MITIGATION ACTIONS

### Action Plan Dashboard

**Active Mitigation Actions: 18**

**Action Categories:**
- 🚨 Urgent (Due in 7 days): 5 actions
- ⚠️ Priority (Due in 30 days): 8 actions
- 📋 Scheduled (Due >30 days): 5 actions
- ✅ Completed (This month): 12 actions

### Urgent Actions (Due in 7 Days)

**Action #1:**
```
🚨 URGENT ACTION
Risk: David Koopman CPD Non-Compliance (R-001)
Action: Schedule and conduct intervention meeting

Due Date: 16/12/2024 (Tomorrow)
Assigned To: Thandiwe Mkhize (Compliance Officer)
Status: ⏳ In Progress
Priority: Critical

Action Steps:
1. ✅ Book meeting room (completed 15/12/2024)
2. ✅ Send meeting invite (completed 15/12/2024)
3. ⏳ Prepare action plan template
4. ⏳ Conduct meeting
5. ⏳ Document outcomes

Dependencies:
• Requires FSP Owner approval for support measures
• Ethics course booking system access

Resources Needed:
• 2 hours meeting time
• Action plan template
• CPD provider directory

Expected Outcome:
Signed action plan with clear milestones and deadlines

[View Details] [Update Progress] [Mark Complete] [Extend Deadline]
```

**Action #2:**
```
🚨 URGENT ACTION
Risk: FICA Verification Backlog (R-002)
Action: Complete 3 high-risk client verifications

Due Date: 20/12/2024 (5 days)
Assigned To: Linda Zwane (FICA Officer)
Status: 🔄 50% Complete (1.5/3 done)
Priority: Critical

Progress:
✅ Client 1: John Ndlovu - Verified 14/12/2024
⏳ Client 2: Sarah Thompson - In progress (70% complete)
📋 Client 3: Michael Botha - Scheduled 18/12/2024

Blockers:
• Client 2: Awaiting proof of residence
• Client 3: Appointment scheduled

Resources:
• FICA verification checklist
• Document upload portal
• Client communication templates

[View Client List] [Update Progress] [Request Extension] [Mark Complete]
```

*[3 more urgent actions displayed similarly]*

### Priority Actions (Due in 30 Days)

**Action List:**
1. Submit F&P renewal - Sarah Naidoo (Due: 20/12/2024)
2. Reallocate supervision - Peter Williams (Due: 31/12/2024)
3. Ethics CPD booking - 3 representatives (Due: 15/01/2025)
4. Document renewal batch - 42 documents (Due: 31/01/2025)
5. Supervision structure review (Due: 15/01/2025)

*[Each action expandable for details]*

### Completed Actions (This Month)

**Recent Completions:**

| Date | Action | Risk | Owner | Days to Complete |
|------|--------|------|-------|------------------|
| 15/12/2024 | CPD reminder batch sent | R-006, R-007 | Compliance Officer | 1 day |
| 14/12/2024 | FICA backlog prioritized | R-002 | FICA Officer | 2 days |
| 12/12/2024 | Document audit completed | R-005 | Admin Staff | 5 days |
| 10/12/2024 | F&P checklist sent | R-004 | Compliance Officer | 1 day |
| 08/12/2024 | Supervision assessment | R-003 | FSP Owner | 3 days |

**[View All Completed (42)]** [Export Report]

### Action Timeline (Gantt Chart)

**Visual Timeline - Next 90 Days:**

December 2024:
[████████████████] 16/12: David Koopman meeting (R-001)
[█████████████████████] 20/12: High-risk FICA completions (R-002)
[██████████████████████████] 31/12: Supervision reallocate (R-003)

January 2025:
[███████████████] 15/01: Ethics CPD deadline (Multiple)
[████████████████████] 18/01: Sarah Naidoo F&P expiry (R-004)
[█████████████████████████████] 31/01: Document renewals (R-005)

February 2025:
[████████] 15/02: Quarterly risk review

### Action Performance Metrics

**This Month:**
- Actions created: 18
- Actions completed: 12
- Completion rate: 67%
- Average completion time: 6.5 days
- Overdue actions: 5

**Efficiency Metrics:**
- On-time completion: 75%
- Average days from creation to start: 2 days
- Escalations required: 3

---

## 5. ALERT HISTORY

### Historical Alert View

**Filter Options:**
- Date Range: Last 7 days / 30 days / 90 days / 12 months / Custom
- Status: All / Resolved / Closed / Expired
- Category: All categories
- Severity: All severities
- Resolution type: Resolved / Escalated / Closed without action

**Search:** "Search by representative, alert ID, or description..."

### Resolved Alerts (Last 30 Days)

**Summary Statistics:**
- Total resolved: 47 alerts
- Average resolution time: 8.5 days
- Fastest resolution: 2 hours
- Longest resolution: 21 days
- Resolution methods:
  - Issue resolved: 38 (81%)
  - Escalated: 6 (13%)
  - Closed without action: 3 (6%)

**Recent Resolutions:**

**Alert #AL2024-135 - RESOLVED**
```
✅ Resolved: 14/12/2024
Johan van Zyl - CPD Progress Warning

Original Severity: Medium
Category: CPD Compliance
Created: 01/12/2024
Days to Resolve: 13 days

Issue:
Representative behind CPD schedule (11/18 hours at time)

Resolution:
Representative logged 4 hours CPD activities (webinars and self-study).
Now on track with 15/18 hours (83%).

Resolution Actions:
• 14/12/2024: Activities approved by Compliance Officer
• 10/12/2024: 3-hour webinar attended
• 08/12/2024: 1-hour self-study logged
• 05/12/2024: Reminder sent

Resolved By: Thandiwe Mkhize (Compliance Officer)
Outcome: Successful - Risk eliminated
Lessons Learned: Early intervention effective

[View Full History] [Export Details]
```

**Alert #AL2024-128 - RESOLVED**
```
✅ Resolved: 12/12/2024
FICA Verification - 5 Clients Completed

Original Severity: High
Category: FICA Verification
Created: 25/11/2024
Days to Resolve: 17 days

Issue:
5 clients pending verification >30 days

Resolution:
All 5 client verifications completed successfully.
Documents approved and filed.

Resolution Actions:
• 12/12/2024: Final client verified
• 10/12/2024: 2 clients verified
• 05/12/2024: 2 clients verified
• 28/11/2024: Additional resources allocated

Resolved By: Linda Zwane (FICA Officer)
Outcome: Successful - All clients compliant
Lessons Learned: Resource allocation critical

[View Details]
```

*[More resolved alerts displayed]*

### Alert Trends & Analysis

**Resolution Time Trends (Line Chart):**
- X-axis: Last 12 months
- Y-axis: Average days to resolve
- Shows improving trend (current: 8.5 days, 12 months ago: 14 days)

**Resolution Methods (Pie Chart):**
- Issue Resolved: 81%
- Escalated: 13%
- Closed Without Action: 6%

**Most Common Alert Types:**
1. CPD Progress Warnings: 35%
2. Fit & Proper Renewals: 25%
3. FICA Verifications: 20%
4. Document Compliance: 15%
5. Other: 5%

---

## 6. RISK ANALYTICS

### Risk Metrics Dashboard

**Risk Score Trends:**

**Historical Risk Score (Line Chart):**
- 12-month trend showing overall FSP risk score
- Current: 42 (Moderate)
- 6 months ago: 58 (Moderate-High)
- 12 months ago: 35 (Moderate)
- Trend: ↓ Improving

**Risk by Category (Stacked Area Chart):**
Shows contribution of each category to overall risk over time
- CPD Risk (blue area)
- Fit & Proper Risk (green area)
- FICA Risk (yellow area)
- Document Risk (purple area)
- Other (gray area)

### Predictive Analytics

**Risk Forecast (Next 6 Months):**

Using historical trends and current data:
- January 2025: Projected 45 (CPD deadline pressure)
- February 2025: Projected 38 (post-deadline)
- March 2025: Projected 35 (stabilization)
- April 2025: Projected 33
- May 2025: Projected 38 (new cycle preparation)
- June 2025: Projected 30 (new cycle start)

**Confidence Level:** 75%

**Risk Drivers Identified:**
1. CPD cycle deadline (May 31st)
2. Quarterly F&P renewals
3. Seasonal FICA activity patterns
4. Representative lifecycle (onboarding/termination)

### Compliance Performance Indicators

**Key Performance Indicators:**

**KPI 1: Alert Response Time**
- Target: <48 hours
- Current: 36 hours average
- Status: ✅ Meeting target
- Trend: ↓ Improving

**KPI 2: Resolution Rate**
- Target: >85% within 30 days
- Current: 82% within 30 days
- Status: ⚠️ Below target
- Trend: → Stable

**KPI 3: Overdue Actions**
- Target: <3%
- Current: 6% (5/85 actions)
- Status: ⚠️ Above target
- Trend: ↑ Increasing (needs attention)

**KPI 4: Risk Score**
- Target: <30 (Low risk)
- Current: 42 (Moderate risk)
- Status: ⚠️ Above target
- Trend: ↓ Improving

**KPI 5: Critical Alerts**
- Target: 0
- Current: 3
- Status: ❌ Target not met
- Trend: → Stable

### Comparative Analytics

**Year-over-Year Comparison:**

| Metric | Dec 2024 | Dec 2023 | Change |
|--------|----------|----------|--------|
| Risk Score | 42 | 58 | ↓ -16 (28% improvement) |
| Active Alerts | 23 | 35 | ↓ -12 (34% reduction) |
| Critical Alerts | 3 | 7 | ↓ -4 (57% reduction) |
| Avg Resolution | 8.5 days | 14 days | ↓ -5.5 days (39% faster) |
| Representatives at Risk | 4 | 8 | ↓ -4 (50% reduction) |

**Status:** 🟢 Significant improvement across all metrics

### Heatmap Analysis

**Risk Intensity Heatmap:**

Matrix showing risk concentration by:
- Representative (Y-axis)
- Compliance Category (X-axis)
- Color intensity = Risk level

Identifies:
- Highest risk individuals
- Most problematic categories
- Risk patterns and clusters

### Root Cause Analysis

**Top Risk Contributors:**

1. **CPD Management (40% of total risk)**
   - Root causes:
     - Lack of proactive planning
     - Deadline proximity pressure
     - Representative disengagement
   - Recommended fixes:
     - Quarterly CPD planning sessions
     - Automated monthly reminders
     - Early intervention protocol

2. **Fit & Proper Renewals (30%)**
   - Root causes:
     - Manual tracking insufficient
     - Late renewal applications
     - Document delays
   - Recommended fixes:
     - Automated 90-day alerts
     - Pre-prepared renewal packets
     - Document checklist system

3. **FICA Verification (15%)**
   - Root causes:
     - Resource constraints
     - Client delays
     - Backlog accumulation
   - Recommended fixes:
     - Additional FICA officer
     - Client communication templates
     - Priority escalation system

### Benchmarking (If Available)

**Industry Comparison:**
- FSP Risk Score: 42
- Industry Average: 48
- Status: ✅ 13% better than industry
- Percentile: 68th percentile

---

## 7. REPORTS

### Pre-Built Reports

**Report 1: Executive Risk Summary**
- Description: High-level risk overview for FSP Owner
- Includes: Risk score, critical alerts, top risks, trends
- Format: PDF (2 pages)
- Frequency: Weekly
- Last Generated: 14/12/2024
- [Generate Now] [Schedule] [Email to FSP Owner]

**Report 2: Detailed Risk Register**
- Description: Complete list of all risks with details
- Includes: Risk ID, description, scores, owners, actions
- Format: Excel
- Frequency: Monthly
- Last Generated: 30/11/2024
- [Generate Now] [Schedule]

**Report 3: Alert Performance Report**
- Description: Alert metrics and resolution analytics
- Includes: Response times, resolution rates, trends
- Format: PDF + Charts
- Frequency: Monthly
- Last Generated: 30/11/2024
- [Generate Now]

**Report 4: Mitigation Action Tracker**
- Description: Status of all mitigation actions
- Includes: Actions, deadlines, progress, owners
- Format: Excel + PDF
- Frequency: Bi-weekly
- Last Generated: 09/12/2024
- [Generate Now] [Schedule]

**Report 5: Compliance KPI Dashboard**
- Description: Key performance indicators tracking
- Includes: KPIs, targets, actuals, trends
- Format: PowerPoint
- Frequency: Quarterly
- Last Generated: 30/09/2024
- [Generate Now]

**Report 6: FSCA Inspection Readiness**
- Description: Risk assessment for regulatory inspections
- Includes: Compliance status, documentation, evidence
- Format: PDF
- Frequency: On-demand
- [Generate Now]

### Custom Report Builder

**Step 1: Select Report Type**
- Risk Summary
- Alert Analysis
- Action Tracking
- Trend Analysis
- Comparative Report

**Step 2: Select Data Range**
- Date From: [Date picker]
- Date To: [Date picker]
- Presets: Last 7 days / 30 days / 90 days / 12 months

**Step 3: Filter Criteria**
- Categories: [Multi-select]
- Severity: [Multi-select]
- Status: [Multi-select]
- Owners: [Multi-select]
- Representatives: [Multi-select]

**Step 4: Select Metrics**
- [ ] Risk scores and trends
- [ ] Alert statistics
- [ ] Resolution metrics
- [ ] Action progress
- [ ] KPI performance
- [ ] Comparative analysis

**Step 5: Export Format**
- PDF (Executive summary)
- Excel (Detailed data)
- PowerPoint (Presentation)
- CSV (Raw data)

**Step 6: Schedule & Distribute**
- Generate: Once now / Schedule recurring
- Frequency: [Dropdown]
- Email to: [Multi-select recipients]
- Save as template: [Checkbox + Name]

**[Preview Report]** [Generate] [Save Template]

### Report History

**Recently Generated Reports:**

| Date | Report Name | Type | Generated By | Recipients | Actions |
|------|-------------|------|--------------|------------|---------|
| 14/12/2024 | Executive Risk Summary | Pre-built | System | FSP Owner | [Download] [Resend] |
| 09/12/2024 | Mitigation Action Tracker | Pre-built | Compliance Officer | Management Team | [Download] |
| 30/11/2024 | Monthly Risk Register | Pre-built | System | FSP Owner, Compliance | [Download] |
| 15/11/2024 | Custom Alert Analysis | Custom | FSP Owner | Board | [Download] [Rerun] |

---

## ROLE-BASED ACCESS CONTROL

### FSP Owner / Principal
- **Access:** Full access to all Risk & Alerts features
- **Dashboard View:** Complete FSP risk overview
- **Actions:** View all, create risks, assign actions, approve escalations, configure rules
- **Alerts:** All alerts, critical notifications
- **Reports:** All reports, custom reports, analytics

### Key Individual
- **Access:** Risk data for supervised representatives
- **Dashboard View:** Filtered to supervised team risks
- **Actions:** View, create alerts for supervised reps, assign actions, escalate
- **Alerts:** Supervised representative alerts only
- **Reports:** Team-level risk reports

### Compliance Officer
- **Access:** Full access to Risk & Alerts (primary user)
- **Dashboard View:** Comprehensive risk management workspace
- **Actions:** All risk management, alert configuration, action assignment, reporting
- **Alerts:** All alerts, configure rules
- **Reports:** All reports, custom analytics

### Representative
- **Access:** Read-only view of own alerts
- **Dashboard View:** Personal alerts only
- **Actions:** View own alerts, acknowledge, upload evidence
- **Alerts:** Personal alerts only
- **Reports:** Personal compliance status only

### Admin Staff
- **Access:** Limited to data entry and basic monitoring
- **Dashboard View:** Overview only (read-only)
- **Actions:** Create alerts, update actions (assigned only)
- **Alerts:** View relevant alerts
- **Reports:** Standard reports only

### External Auditor (Optional)
- **Access:** Read-only access to risk register and history
- **Dashboard View:** Audit-focused view
- **Actions:** View only, export data
- **Alerts:** View only (no notifications)
- **Reports:** All reports (read-only)

---

## API ENDPOINTS

### GET /api/risk/overview
**Returns FSP risk overview**

Response:
```json
{
  "fspRiskScore": 42,
  "riskZone": "moderate",
  "trend": "decreasing",
  "trendValue": -8,
  "lastCalculated": "2024-12-15T08:00:00Z",
  "breakdown": {
    "fitAndProper": 15,
    "cpd": 18,
    "fica": 5,
    "documents": 4,
    "complaints": 0
  },
  "alerts": {
    "total": 23,
    "critical": 3,
    "high": 8,
    "medium": 12,
    "low": 0
  },
  "overdueActions": 5,
  "repsAtRisk": 4,
  "upcomingDeadlines": 7
}
```

### GET /api/risk/alerts
**Returns active alerts**

Query parameters:
- severity: critical | high | medium | low
- category: cpd | fit_proper | fica | documents | complaints | other
- status: open | in_progress | overdue
- assigned_to: [user_id]

Response:
```json
{
  "alerts": [
    {
      "id": "AL2024-147",
      "severity": "critical",
      "category": "cpd",
      "title": "David Koopman - Severe CPD Non-Compliance",
      "representative": {
        "id": "rep567",
        "name": "David Koopman",
        "fspNumber": "56780"
      },
      "riskScore": 85,
      "created": "2024-12-03",
      "daysOpen": 12,
      "status": "in_progress",
      "assignedTo": {
        "id": "user123",
        "name": "Thandiwe Mkhize",
        "role": "Compliance Officer"
      },
      "description": "Representative severely behind CPD requirements...",
      "impact": "High - FSP license risk",
      "actions": [
        {
          "date": "2024-12-15",
          "action": "Meeting scheduled",
          "status": "completed"
        }
      ],
      "nextReview": "2024-12-16"
    }
  ],
  "summary": {
    "total": 23,
    "byCategory": {
      "cpd": 8,
      "fit_proper": 7,
      "fica": 4,
      "documents": 3,
      "other": 1
    }
  }
}
```

### POST /api/risk/alerts
**Create new alert**

Request:
```json
{
  "severity": "high",
  "category": "cpd",
  "title": "Representative Name - Issue Description",
  "representative_id": "rep123",
  "description": "Detailed description of the risk...",
  "impact": "Impact assessment...",
  "assigned_to": "user456",
  "due_date": "2025-01-15"
}
```

### PUT /api/risk/alerts/:id
**Update alert**

Request:
```json
{
  "status": "in_progress",
  "update": "Scheduled intervention meeting for 16/12/2024",
  "next_review": "2024-12-16"
}
```

### GET /api/risk/register
**Returns complete risk register**

Response:
```json
{
  "risks": [
    {
      "id": "R-001",
      "description": "David Koopman CPD non-compliance",
      "category": "cpd",
      "likelihood": 5,
      "impact": 4,
      "riskScore": 80,
      "status": "active",
      "owner": {
        "id": "user123",
        "name": "Thandiwe Mkhize"
      },
      "dateIdentified": "2024-12-03",
      "targetResolution": "2025-01-31",
      "mitigation": {
        "immediate": "Schedule intervention meeting",
        "shortTerm": "Complete ethics CPD, log hours",
        "longTerm": "Monthly supervision, automated alerts"
      },
      "relatedAlerts": ["AL2024-147"]
    }
  ]
}
```

### POST /api/risk/register
**Add new risk**

Request:
```json
{
  "title": "Risk title",
  "description": "Risk description",
  "category": "cpd",
  "likelihood": 4,
  "impact": 3,
  "owner_id": "user123",
  "target_date": "2025-02-28",
  "mitigation": {
    "immediate": "Actions...",
    "short_term": "Actions...",
    "long_term": "Actions..."
  }
}
```

### GET /api/risk/actions
**Returns mitigation actions**

Query parameters:
- status: urgent | priority | scheduled | completed
- assigned_to: [user_id]
- due_before: [date]

Response:
```json
{
  "actions": [
    {
      "id": "ACT-001",
      "risk_id": "R-001",
      "title": "Schedule intervention meeting",
      "due_date": "2024-12-16",
      "assigned_to": {
        "id": "user123",
        "name": "Thandiwe Mkhize"
      },
      "status": "in_progress",
      "priority": "critical",
      "progress": 60,
      "steps": [
        {
          "description": "Book meeting room",
          "completed": true,
          "completed_date": "2024-12-15"
        },
        {
          "description": "Send meeting invite",
          "completed": true,
          "completed_date": "2024-12-15"
        },
        {
          "description": "Prepare action plan",
          "completed": false,
          "completed_date": null
        }
      ]
    }
  ],
  "summary": {
    "urgent": 5,
    "priority": 8,
    "scheduled": 5,
    "overdue": 5
  }
}
```

### GET /api/risk/analytics
**Returns risk analytics and trends**

Response:
```json
{
  "historicalRiskScore": [
    { "month": "2024-01", "score": 45 },
    { "month": "2024-02", "score": 42 },
    // ...
    { "month": "2024-12", "score": 42 }
  ],
  "categoryTrends": {
    "cpd": [18, 22, 20, 18],
    "fit_proper": [12, 15, 14, 15],
    "fica": [8, 10, 6, 5]
  },
  "forecast": {
    "2025-01": 45,
    "2025-02": 38,
    "2025-03": 35
  },
  "kpis": {
    "alertResponseTime": {
      "target": 48,
      "actual": 36,
      "unit": "hours",
      "status": "meeting"
    },
    "resolutionRate": {
      "target": 85,
      "actual": 82,
      "unit": "percent",
      "status": "below"
    }
  }
}
```

---

## SAMPLE DATA

### Sample Risks

```json
[
  {
    "id": "R-001",
    "description": "David Koopman CPD non-compliance",
    "category": "cpd",
    "likelihood": 5,
    "impact": 4,
    "riskScore": 80,
    "status": "active",
    "owner": "Thandiwe Mkhize",
    "dateIdentified": "2024-12-03",
    "targetResolution": "2025-01-31"
  },
  {
    "id": "R-002",
    "description": "FICA verification backlog",
    "category": "fica",
    "likelihood": 4,
    "impact": 5,
    "riskScore": 80,
    "status": "active",
    "owner": "Linda Zwane",
    "dateIdentified": "2024-12-07",
    "targetResolution": "2025-01-31"
  }
]
```

---

## VALIDATION RULES

### Risk Score Calculation
- Risk Score = Likelihood (1-5) × Impact (1-5) × 4
- Maximum score: 100
- Zones: Low (0-25), Moderate (26-60), High (61-100)

### Alert Priority
- Critical: Risk score ≥60 OR regulatory breach imminent
- High: Risk score 40-59 OR deadline <30 days
- Medium: Risk score 25-39 OR monitoring required
- Low: Risk score <25 OR informational

### Action Status
- Urgent: Due within 7 days
- Priority: Due within 30 days
- Scheduled: Due >30 days
- Overdue: Past due date

---

## INTEGRATION POINTS

### Depends On:
- **All Compliance Modules:** Data sources for risks
- **Alerts & Notifications:** Alert delivery system
- **User Management:** Role assignments

### Integrates With:
- **Executive Dashboard:** Risk metrics
- **Compliance Dashboard:** Risk status
- **All Modules:** Risk aggregation

### Triggers:
- Auto-creates alerts based on thresholds
- Escalates unresolved high-priority items
- Generates scheduled reports
- Sends notifications to stakeholders

---

## REGULATORY REFERENCES

- **FAIS Act Section 13(2)(a):** Vicarious liability
- **FAIS Circular 4 of 2014:** Criminal penalties
- **Section 6A:** Fit & Proper requirements
- **Section 8A:** CPD requirements
- **FICA Act Section 45:** Penalties

---

## MOBILE RESPONSIVENESS

- Stack cards vertically on <768px
- Collapsible risk details
- Touch-friendly interfaces
- Simplified charts for mobile
- Swipe gestures for alert cards

---

## ACCESSIBILITY

- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader support
- High contrast mode
- Clear severity indicators (not color-only)

---

## PERFORMANCE REQUIREMENTS

- Dashboard load: <2 seconds
- Chart rendering: <1 second
- Alert filtering: <500ms
- Report generation: <10 seconds

---

## ERROR HANDLING

**No Risks Found:**
```
ℹ️ No risks identified for the selected criteria.
This is good - it means your FSP is compliant!
[View All] [Create Risk]
```

**Calculation Error:**
```
⚠️ Unable to calculate risk score.
Please contact support.
Error: CALC-500
[Retry] [Contact Support]
```

---

## TESTING SCENARIOS

1. High-risk representative (multiple compliance failures)
2. Medium-risk FSP (some alerts, manageable)
3. Low-risk FSP (all compliant)
4. Alert creation and escalation workflow
5. Bulk action processing
6. Report generation (all formats)

---

## DEPLOYMENT CHECKLIST

- [ ] API endpoints tested
- [ ] Risk scoring algorithm validated
- [ ] Alert rules configured
- [ ] Integration with all modules confirmed
- [ ] Report templates tested
- [ ] Mobile responsiveness verified
- [ ] Role-based access tested
- [ ] Sample data loaded

---

**END OF CURSOR PROMPT**
