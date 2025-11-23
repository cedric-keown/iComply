# CURSOR PROMPT: COMPLAINTS MANAGEMENT MODULE

Create a fully functional, realistic HTML mockup for the Complaints Management module of a South African FAIS broker compliance portal. This module handles complaint logging, tracking, resolution workflows, deadline management, escalation to Ombudsman, and comprehensive reporting as per FAIS Act Section 26 and General Code of Conduct requirements.

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
- South African locale (dates: DD/MM/YYYY, phone +27, currency ZAR)

## MODULE STRUCTURE

### Top Navigation Tabs
- Complaints Dashboard (default)
- Log New Complaint
- Active Complaints
- Complaints Calendar
- Analysis & Trends
- Ombudsman Cases
- Reports

---

## 1. COMPLAINTS DASHBOARD

### Hero Section: Compliance Status (4 Cards)

**Card 1: Total Complaints**
- Large number: 34
- Icon: Megaphone
- Subtitle: "All time"
- This year: 8 complaints
- Trend: ↓ 20% vs last year

**Card 2: Active Cases**
- Large number: 2
- Icon: Clock
- Subtitle: "In progress"
- Status: Info (blue)
- Link: "View Active"

**Card 3: Approaching Deadline**
- Large number: 1
- Icon: Alert-triangle
- Subtitle: "6-week deadline"
- Days remaining: 5 days
- Status: Warning (amber)
- Link: "Review Now"

**Card 4: Ombudsman Cases**
- Large number: 0
- Icon: Scale
- Subtitle: "Escalated"
- Status: Success (green)
- Link: "View History"

### Regulatory Compliance Indicator

**FAIS Act Compliance Card:**
- Overall Status: ✅ COMPLIANT (green badge)
- 6-Week Resolution: 100% (8/8)
- 6-Month Closure: 100% (8/8)
- Average Resolution Time: 18 days
- Last FSCA Report: 30/11/2024

**Regulatory Requirements Display:**
- ⏱️ Initial Response: Within 48 hours (Required)
- 📅 First Resolution Attempt: Within 6 weeks (Section 26)
- ✅ Final Resolution: Within 6 months (Required)
- 📊 Ombudsman Notification: When escalated
- 📝 Record Retention: 5 years

### Complaints by Status (Visual Timeline)

**Interactive Status Timeline:**
```
Received → Acknowledged → Investigating → Resolved → Closed
   (0)         (0)            (2)          (0)      (32)
```

**Status Breakdown Cards:**

**Status 1: Received (0)**
- Count: 0
- Color: Blue
- Description: "Logged but not yet acknowledged"
- Action Required: Send acknowledgment within 48 hours

**Status 2: Acknowledged (0)**
- Count: 0
- Color: Info
- Description: "Client acknowledgment sent"
- Action Required: Begin investigation

**Status 3: In Progress (2)**
- Count: 2
- Color: Warning
- Description: "Under investigation"
- Action Required: Weekly updates, resolve within 6 weeks

**Status 4: Pending Information (0)**
- Count: 0
- Color: Amber
- Description: "Awaiting client response"
- Action Required: Follow up if no response in 7 days

**Status 5: Resolved (0)**
- Count: 0
- Color: Success
- Description: "Resolution offered to client"
- Action Required: Confirm acceptance

**Status 6: Closed (32)**
- Count: 32
- Color: Grey
- Description: "Case completed and filed"
- Action Required: None (archived)

**Status 7: Escalated (0)**
- Count: 0
- Color: Danger
- Description: "Referred to Ombudsman"
- Action Required: Monitor Ombudsman process

### Recent Activity Feed (Last 10 activities)

**Activity List:**

**Activity 1:**
- Type icon: ✓ (green)
- "Complaint CMP-2024-008 resolved"
- Details: "Client accepted resolution - product replacement"
- Client: Mary Johnson
- User: Sarah Naidoo
- Time: 3 days ago
- Action: View Details

**Activity 2:**
- Type icon: 📧 (blue)
- "Weekly update sent"
- Details: "CMP-2024-007 - Investigation ongoing"
- Client: Johan van Zyl
- User: System
- Time: 5 days ago

**Activity 3:**
- Type icon: 📝 (orange)
- "New complaint logged"
- Details: "CMP-2024-009 - Claim processing delay"
- Client: Thabo Mokoena
- User: Thabo Mokoena (Self-logged)
- Time: 7 days ago
- Action: Review

**Activity 4:**
- Type icon: ⏰ (amber)
- "Deadline reminder"
- Details: "CMP-2024-007 - 6-week deadline in 5 days"
- Client: Johan van Zyl
- User: System
- Time: 1 week ago

**Activity 5:**
- Type icon: ✓
- "Complaint CMP-2024-006 closed"
- Details: "Client satisfied with resolution"
- Client: Sipho Ndlovu
- Time: 2 weeks ago

### Deadline Tracker (Visual Widget)

**Critical Deadlines Card:**

**Approaching 6-Week Deadline:**
- CMP-2024-007 - Johan van Zyl
- Received: 05/11/2024
- 6-week deadline: 17/12/2024
- Days remaining: 5 days ⚠️
- Status: In Progress
- [Review Now] button

**Approaching 6-Month Deadline:**
- No complaints approaching 6-month deadline ✅

**Overdue Cases:**
- No overdue complaints ✅

### Quick Actions Panel
- [Primary Button] Log New Complaint
- [Secondary Button] View Active Cases
- [Secondary Button] Generate Report
- [Link] View Calendar
- [Link] Compliance Summary

### Alerts & Warnings

**Alert Cards:**

**Alert 1:** (Warning - Amber)
- Icon: Clock
- Title: "Deadline Approaching"
- Message: "CMP-2024-007 must be resolved within 5 days (6-week deadline)"
- Client: Johan van Zyl
- Action: [Review Case] [Send Update]

**Alert 2:** (Info - Blue)
- Icon: Info-circle
- Title: "Pending Client Response"
- Message: "CMP-2024-007 - Awaiting documents from client"
- Requested: 7 days ago
- Action: [Follow Up] [Dismiss]

### Statistics Charts

**Chart 1: Complaints by Category (Donut Chart)**
- Claims Issues: 12 (35%)
- Service Complaints: 10 (29%)
- Communication: 6 (18%)
- Product Issues: 4 (12%)
- Other: 2 (6%)

**Chart 2: Resolution Time Trend (Line Chart)**
- Last 12 months
- Average resolution time per month
- Target line at 6 weeks
- Shows improving trend

**Chart 3: Complaints by Representative (Bar Chart)**
- Shows complaints per representative
- Color-coded by status
- Helps identify training needs

---

## 2. LOG NEW COMPLAINT TAB

### Complaint Type Selection (First Step - Cards)

**Option 1: Client Complaint**
- Icon: Person-exclamation
- Description: "Complaint from existing client"
- Most common
- [Select] button

**Option 2: Third Party Complaint**
- Icon: People
- Description: "Complaint from non-client (e.g., beneficiary)"
- [Select] button

**Option 3: Internal Complaint**
- Icon: Building
- Description: "Internal issue or staff complaint"
- [Select] button

### Client Complaint Form (Multi-step Wizard)

**Progress Indicator:**
1. Complaint Details
2. Client Information
3. Issue Description
4. Representative Involved
5. Review & Submit

---

#### STEP 1: COMPLAINT DETAILS

**Form Fields:**

**Basic Information:**
1. Complaint Reference (auto-generated on save)
   - Format: CMP-YYYY-NNN
   - Display: "Will be assigned on save"

2. Date Received (date picker) - REQUIRED
   - Default: Today
   - Cannot be future date
   - Format: DD/MM/YYYY

3. Time Received (time picker)
   - Format: HH:MM
   - Default: Current time

4. How Received (dropdown) - REQUIRED
   - Email
   - Phone Call
   - In Person
   - Letter/Post
   - WhatsApp
   - Online Form
   - Social Media
   - Other (specify)

5. Urgency Level (radio buttons)
   - ⭕ Standard (6-week deadline)
   - ⭕ High Priority (Vulnerable client, significant financial loss)
   - ⭕ Critical (Regulatory risk, reputational damage)
   - Info tooltip explaining each level

6. Primary Category (dropdown) - REQUIRED
   - Claims Issues
     - Claim Rejected
     - Claim Delayed
     - Claim Amount Disputed
     - Documentation Requirements
   - Service Quality
     - Unresponsive Representative
     - Poor Communication
     - Incorrect Information
     - Unprofessional Behavior
   - Product Issues
     - Mis-selling
     - Unsuitable Product
     - Disclosure Failures
     - TCF Concerns
   - Financial Concerns
     - Fee Disputes
     - Commission Issues
     - Premium Queries
     - Refund Requests
   - Administrative
     - Policy Administration
     - Documentation Errors
     - Processing Delays
   - Other (please specify)

7. Sub-category (dynamic based on primary category)
   - Relevant options appear

8. Complaint Summary (text input) - REQUIRED
   - Brief one-line summary
   - Max 200 characters
   - Example: "Claim rejected without clear explanation"

**Buttons:**
- [Primary] Next: Client Information
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 2: CLIENT INFORMATION

**Client Selection:**

**Option A: Existing Client**
- Search box with autocomplete
- Search by: Name, ID Number, Policy Number, Phone
- Results show:
  - Client name
  - ID number
  - Contact details
  - Assigned representative
- [Select Client] button

**Selected Client Display:**
- Name: Thabo Johannes Mokoena
- ID: 8506155800083
- Email: thabo.mokoena@email.com
- Phone: +27 82 123 4567
- Address: 123 Main Road, Rondebosch, Cape Town
- Primary Representative: Sarah Naidoo
- [Change Client] button

**Option B: New Client (Not in System)**
- Toggle: "Client not in system"
- Manual entry form:
  - Full Name (text) - REQUIRED
  - ID/Passport Number (text)
  - Email (email) - REQUIRED
  - Mobile (text with format) - REQUIRED
  - Address (textarea)
  - Relationship to FSP (dropdown):
    - Prospective Client
    - Beneficiary
    - Former Client
    - Other Party
    - Unknown

**Contact Preference:**
- ☐ Email
- ☐ Phone
- ☐ SMS
- ☐ Letter
- Preferred contact time (time range selector)

**Additional Contact:**
- Is someone else handling this on client's behalf?
- ☐ Yes (show additional fields)
  - Representative Name
  - Relationship to Client
  - Contact Details
  - Authority Document Upload

**Buttons:**
- [Primary] Next: Issue Description
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 3: ISSUE DESCRIPTION

**Complaint Details:**

1. Detailed Description (rich text editor) - REQUIRED
   - Minimum 50 characters
   - Editor tools: Bold, Italic, Bullets, Numbering
   - Character counter
   - Placeholder: "Please provide a detailed description of the complaint, including dates, amounts, and specific concerns..."

2. Products/Policies Involved
   - Search and add multiple policies
   - Display:
     - Policy Number
     - Product Type
     - Status
     - Premium
   - [Add Policy] [Remove]

3. Date of Incident/Issue (date picker)
   - When did the issue occur?
   - Can be range (From/To dates)

4. Financial Impact (optional)
   - Currency: ZAR
   - Amount: R_____.00
   - Nature of loss:
     - ⭕ Direct Financial Loss
     - ⭕ Opportunity Cost
     - ⭕ Additional Expenses
     - ⭕ No Financial Impact
     - ⭕ Undetermined

5. Has client approached Ombudsman? (radio)
   - ⭕ No
   - ⭕ Yes - Ombudsman involved
   - If Yes:
     - Ombudsman Reference Number (text)
     - Date Approached (date)
     - Upload Ombudsman correspondence

6. Previous Attempts to Resolve (textarea)
   - Has client tried to resolve this before?
   - What was the outcome?
   - Timeline of previous interactions

7. Client's Expected Resolution (textarea) - REQUIRED
   - What does the client want?
   - What would satisfy the complaint?
   - Examples:
     - Refund of R5,000
     - Policy reinstatement
     - Claim approval
     - Apology and corrective action

**Supporting Documents:**
- Upload area (drag & drop)
- Accepted: PDF, JPG, PNG, Word, Excel
- Max 10MB per file, 10 files total
- Document types:
  - Email correspondence
  - Letters/notices
  - Policy documents
  - Proof of payment
  - Photos/evidence
  - Other supporting docs
- Each file: preview, filename, size, [Remove]

**Buttons:**
- [Primary] Next: Representative Involved
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 4: REPRESENTATIVE INVOLVED

**Representative Identification:**

1. Is complaint about a representative? (radio) - REQUIRED
   - ⭕ Yes - complaint involves representative conduct
   - ⭕ No - systemic/process/product issue
   - ⭕ Multiple representatives involved

**If Yes:**

**Select Representative(s):**
- Search/dropdown of all representatives
- Can select multiple
- For each selected representative:
  - Name & Photo
  - Position
  - Contact Details
  - Relationship to client (if applicable)
  - Years with FSP
  - [Remove]

**Representative's Alleged Actions:**
- Checkboxes for common issues:
  - ☐ Poor communication
  - ☐ Unresponsive to calls/emails
  - ☐ Incorrect advice given
  - ☐ Mis-selling
  - ☐ Failure to disclose
  - ☐ Unprofessional conduct
  - ☐ Conflict of interest
  - ☐ Breach of TCF
  - ☐ Other (specify)

**Representative's Perspective (optional at this stage):**
- Has representative been notified?
  - ⭕ Not yet
  - ⭕ Yes, representative aware
- Representative's initial comments (textarea)
- Will be asked to provide formal response later

**If No (Systemic Issue):**

**Area of Concern:**
- ⭕ Product design
- ⭕ Claims process
- ⭕ Administration systems
- ⭕ Company policies
- ⭕ Third party (insurer, underwriter)
- ⭕ Other

**Responsible Department/Team:**
- Dropdown of internal departments
- Will be assigned for investigation

**Buttons:**
- [Primary] Next: Review & Submit
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 5: REVIEW & SUBMIT

**Comprehensive Summary:**

**Section 1: Complaint Overview**
- Reference: CMP-2024-010 (draft)
- Status: Draft (will become "Received" on submission)
- Date Received: 15/12/2024 14:30
- How Received: Email
- Category: Claims Issues - Claim Rejected
- Urgency: Standard
- Summary: "Claim rejected without clear explanation"
- [Edit] button

**Section 2: Client Details**
- Name: Thabo Johannes Mokoena
- Contact: +27 82 123 4567 | thabo.mokoena@email.com
- Preferred Contact: Email
- Representative: Sarah Naidoo
- [Edit] button

**Section 3: Issue Description**
- Description: [First 200 characters of detailed description...]
- Policies Involved: POL-123456 (Life Cover)
- Date of Incident: 01/12/2024
- Financial Impact: R50,000.00 (Direct Financial Loss)
- Expected Resolution: "Claim to be re-assessed and approved based on policy terms"
- Documents: 3 files attached
- [Edit] button

**Section 4: Representative Involved**
- Representative: Sarah Naidoo
- Alleged Issues: Unresponsive to calls/emails, Claim not processed timeously
- [Edit] button

**Section 5: Case Assignment**

**Assign Handler (dropdown):**
- Sarah Naidoo (Compliance Officer) - Recommended
- Johan Smit (Key Individual)
- FSP Owner
- Other Compliance Officer

**Initial Target Resolution Date:**
- Auto-calculated: 26/01/2025 (6 weeks from received date)
- Can be adjusted if urgency level is high
- Display: "6-week deadline: 26/01/2025"
- Display: "6-month deadline: 15/06/2025"

**Priority & Escalation:**
- Priority Level: Standard | High | Critical
- Auto-escalate if no progress in: 2 weeks (checkbox + days)
- Notify compliance officer: ☑ Enabled

**Initial Actions Required:**
- ☑ Send acknowledgment email to client (within 48 hours)
- ☑ Notify representative of complaint
- ☑ Schedule initial investigation
- ☑ Create task list
- ☐ Request additional information from client
- ☐ Arrange client meeting

**Internal Notes (optional):**
- Textarea for internal team notes
- Not visible to client
- E.g., "Client is vulnerable elderly person - handle with care"

**Compliance Checklist:**
- ✅ Client details captured
- ✅ Issue description complete
- ✅ Category assigned
- ✅ Expected resolution documented
- ✅ Handler assigned
- ✅ Deadlines calculated
- ✅ Auto-notifications configured

**Buttons:**
- [Primary - Large] Submit Complaint
- [Secondary] Save as Draft
- [Secondary] Print Summary
- [Link] Back to Edit
- [Link] Cancel

**After Submission:**

**Success Modal:**
- ✅ Complaint Logged Successfully
- Reference Number: CMP-2024-010
- Status: Received
- Assigned to: Sarah Naidoo
- 6-Week Deadline: 26/01/2025
- Next Action: Acknowledgment email will be sent within 48 hours

**Actions:**
- [View Complaint Details]
- [Send Acknowledgment Now]
- [Log Another Complaint]
- [Return to Dashboard]

**Automatic Triggers on Submission:**
1. Email to assigned handler
2. Email to compliance officer
3. Add to active complaints queue
4. Create calendar deadlines
5. Start 48-hour acknowledgment timer
6. Log activity in audit trail
7. If representative involved, flag for representative notification

---

## 3. ACTIVE COMPLAINTS TAB

### Overview Stats (Cards)

**Card 1: Total Active**
- Number: 2
- Subtitle: "In progress"
- Status: Info

**Card 2: Due This Week**
- Number: 1
- Subtitle: "6-week deadline"
- Status: Warning

**Card 3: Pending Info**
- Number: 0
- Subtitle: "Awaiting client"
- Status: Amber

**Card 4: Average Age**
- Number: 14 days
- Subtitle: "Current cases"
- Status: Success

### Filter & Search Controls

**Filters:**
- Status: All | Received | Acknowledged | In Progress | Pending Info | Resolved
- Priority: All | Standard | High | Critical
- Category: All | Claims | Service | Product | Financial | Admin
- Handler: All | Me | Unassigned | [Select User]
- Date Range:
  - Received from: (date)
  - Received to: (date)
  - Quick filters: This Week | This Month | Last 30 Days | Last 90 Days
- Deadline Status:
  - All
  - Due This Week
  - Due Next Week
  - Due This Month
  - Overdue

**Sort By:**
- Deadline (Soonest First)
- Deadline (Latest First)
- Date Received (Newest)
- Date Received (Oldest)
- Client Name (A-Z)
- Priority (High to Low)

**Search:**
- Search by: Reference, Client Name, Representative, Keywords
- Real-time search

**View Options:**
- [List View] | [Card View] | [Table View]
- Toggle button

### Active Complaints List (Card View by Default)

**Complaint Card Structure:**

**Card 1: CMP-2024-007**

**Header Section:**
- Reference: CMP-2024-007
- Status Badge: 🔄 IN PROGRESS (blue)
- Priority Badge: ⚠️ HIGH (orange)
- Days Active: 38 days

**Client Info:**
- Name: Johan van Zyl
- ID: 7803125678901
- Contact: +27 83 456 7890
- Representative: Sarah Naidoo

**Issue Summary:**
- Category: Claims Issues - Claim Delayed
- Summary: "Life insurance claim pending for 6 weeks - urgent financial need"
- Financial Impact: R150,000.00
- Expected Resolution: Claim to be processed and paid within 5 business days

**Timeline Progress:**
- Visual timeline showing:
  - ✅ Received: 05/11/2024
  - ✅ Acknowledged: 06/11/2024 (within 48 hours)
  - ✅ Investigation Started: 08/11/2024
  - 🔄 In Progress: Now
  - ⏰ 6-Week Deadline: 17/12/2024 (5 days) ⚠️
  - 📅 6-Month Deadline: 05/05/2025 (142 days)

**Recent Activity:**
- 10/12/2024: Weekly update sent to client
- 03/12/2024: Documents requested from insurer
- 26/11/2024: Meeting with client
- 19/11/2024: Representative response received

**Assigned To:**
- Handler: Sarah Naidoo (Compliance Officer)
- Escalation Contact: Johan Smit (Key Individual)

**Quick Actions:**
- [View Full Details]
- [Add Update]
- [Send Communication]
- [Request Info]
- [Resolve]
- [More ⋯]

**Visual Deadline Indicator:**
- Progress bar showing time elapsed vs. 6-week deadline
- Color: Amber (approaching deadline)
- Text: "5 days to 6-week deadline"

---

**Card 2: CMP-2024-008**

**Header:**
- Reference: CMP-2024-008
- Status Badge: ✅ RESOLVED (green)
- Priority: Standard
- Days Active: 12 days

**Client Info:**
- Name: Mary Johnson
- ID: 8905126789012
- Contact: +27 84 567 8901
- Representative: Thabo Mokoena

**Issue Summary:**
- Category: Service Quality - Poor Communication
- Summary: "Representative not returning calls regarding policy query"
- Financial Impact: None
- Expected Resolution: Improved communication and policy clarification

**Timeline:**
- ✅ Received: 03/12/2024
- ✅ Resolved: 15/12/2024 (12 days)
- Awaiting: Client confirmation of satisfaction

**Resolution Summary:**
- Action Taken: Representative provided detailed policy explanation via email and phone call. Client satisfied with response.
- Resolution Type: Communication improvement
- Client Response: Pending confirmation

**Actions:**
- [View Details]
- [Close Case]
- [Reopen if needed]

---

### Table View (Alternative)

**Columns:**
| Ref | Status | Priority | Client | Category | Days Active | Deadline | Handler | Actions |

**Sample Rows:**

**Row 1:**
- CMP-2024-007
- 🔄 In Progress (blue)
- ⚠️ High (orange)
- Johan van Zyl
- Claims - Delay
- 38 days
- 5 days ⚠️
- Sarah Naidoo
- [👁️ View] [✏️ Update] [💬 Contact] [⋯ More]

**Row 2:**
- CMP-2024-008
- ✅ Resolved (green)
- Standard
- Mary Johnson
- Service - Communication
- 12 days
- N/A
- Thabo Mokoena
- [👁️ View] [✓ Close]

**Pagination:**
- Showing 1-10 of 2 active complaints
- Page controls

---

## 4. COMPLAINT DETAIL VIEW (Modal/Full Page)

**Opens when viewing a complaint:**

### Header Section
- Large Reference Number: CMP-2024-007
- Status Badge: 🔄 IN PROGRESS
- Priority: ⚠️ HIGH PRIORITY
- Days Active: 38 days
- Share button
- Print button
- Export to PDF
- More actions dropdown (⋯)

### Timeline Tracker (Prominent Visual)

**Visual Timeline:**
```
Received → Acknowledged → Investigating → Resolved → Closed
   ✅          ✅             🔄            ⏰        ⏰
05/11/24    06/11/24       08/11/24      TBD       TBD
```

**Deadline Alerts:**
- 🔴 6-Week Deadline: 17/12/2024 (5 days remaining) ⚠️
- 🟢 6-Month Deadline: 05/05/2025 (142 days remaining)
- Progress bar: 38 days of 42 days used (90%)

### Tabs in Detail View

**Tab 1: Overview**

**Client Information Card:**
- **Name:** Johan van Zyl
- **ID Number:** 7803125678901
- **Email:** johan.vanzyl@email.com
- **Mobile:** +27 83 456 7890
- **Address:** 45 Beach Road, Camps Bay, Cape Town, 8005
- **Assigned Representative:** Sarah Naidoo
- **Client Since:** 15/03/2018
- **Policies:** 3 active policies
- **Preferred Contact:** Phone, Email
- **Contact Times:** Weekdays 9am-5pm
- [View Full Client Profile] button

**Complaint Details Card:**
- **Reference:** CMP-2024-007
- **Date Received:** 05/11/2024 14:30
- **Received Via:** Email
- **Category:** Claims Issues - Claim Delayed
- **Sub-category:** Life Insurance Claim
- **Priority:** High (Vulnerable client, urgent financial need)
- **Handler:** Sarah Naidoo (Compliance Officer)
- **Escalation Contact:** Johan Smit (Key Individual)

**Issue Description:**
- Full text of complaint (expandable if long)
- "Client submitted life insurance claim 6 weeks ago following spouse's death. Claim has not been processed despite all required documents submitted. Client is in urgent financial need to cover funeral expenses and immediate living costs. Multiple follow-ups have received no substantive response."

**Financial Impact:**
- Type: Direct Financial Loss
- Amount: R150,000.00 (claim value)
- Additional Impact: Funeral expenses already paid out of pocket (R45,000)

**Policies Involved:**
- POL-LIF-123456 - Life Cover
  - Product: Family Life Plan
  - Sum Assured: R150,000
  - Status: Active
  - Premium: Current
  - [View Policy]

**Expected Resolution:**
- "Claim to be processed and paid within 5 business days. Client requires funds urgently for household expenses."

**Supporting Documents:**
- Death Certificate.pdf (245 KB) - [View] [Download]
- Claim Form Completed.pdf (1.2 MB) - [View] [Download]
- ID Document.pdf (856 KB) - [View] [Download]
- Email Correspondence.pdf (345 KB) - [View] [Download]
- Medical Records.pdf (2.1 MB) - [View] [Download]

**Representative Involvement:**
- Representative: Sarah Naidoo
- Alleged Issues:
  - ☑ Claim not processed timeously
  - ☑ Poor communication with client
  - ☑ Failure to escalate to insurer
- Representative Notified: 06/11/2024
- Representative Response: Submitted 10/11/2024
- [View Representative's Response]

**Tab 2: Activity Timeline**

**Complete chronological log of all activities:**

**Timeline Entry 1:**
- 🔵 Complaint Received
- Date/Time: 05/11/2024 14:30
- By: Client (Email)
- Details: Initial complaint email received from client
- [View Email]

**Timeline Entry 2:**
- 📧 Acknowledgment Sent
- Date/Time: 06/11/2024 09:15
- By: System (Auto)
- Details: Acknowledgment email sent to client within 48 hours
- Template: Standard acknowledgment
- [View Email Sent]

**Timeline Entry 3:**
- 📝 Representative Notified
- Date/Time: 06/11/2024 09:30
- By: Sarah Naidoo (Compliance Officer)
- Details: Representative Sarah Naidoo notified of complaint
- Action Required: Provide response within 3 business days
- [View Notification]

**Timeline Entry 4:**
- 🔍 Investigation Started
- Date/Time: 08/11/2024 10:00
- By: Sarah Naidoo
- Details: Case assigned for full investigation
- Investigation plan created
- [View Investigation Plan]

**Timeline Entry 5:**
- 💬 Client Contact
- Date/Time: 10/11/2024 11:30
- By: Sarah Naidoo
- Details: Phone call with client to gather additional details
- Duration: 25 minutes
- Outcome: Client provided timeline of interactions
- Notes: Client is elderly widow, very distressed about delay
- [View Call Notes]

**Timeline Entry 6:**
- 📄 Representative Response
- Date/Time: 10/11/2024 16:45
- By: Sarah Naidoo (Representative)
- Details: Representative submitted formal response
- Summary: Claim submitted to insurer on 01/10/2024, awaiting underwriter decision
- [View Full Response]

**Timeline Entry 7:**
- 📞 Insurer Contact
- Date/Time: 12/11/2024 09:00
- By: Sarah Naidoo (Compliance)
- Details: Contacted insurer claims department
- Person: Claims Manager - John Smith
- Outcome: Claim is with medical underwriter
- [View Contact Notes]

**Timeline Entry 8:**
- 📋 Internal Meeting
- Date/Time: 15/11/2024 14:00
- By: Sarah Naidoo, Johan Smit
- Details: Escalation meeting with Key Individual
- Decision: Escalate to insurer senior management
- [View Meeting Minutes]

**Timeline Entry 9:**
- ✉️ Weekly Update
- Date/Time: 19/11/2024 10:00
- By: System (Auto)
- Details: Weekly progress update sent to client
- Status: Investigation ongoing, insurer escalation
- [View Email Sent]

**Timeline Entry 10:**
- 🤝 Client Meeting
- Date/Time: 26/11/2024 15:00
- By: Sarah Naidoo, Johan Smit
- Details: In-person meeting with client
- Location: FSP Office
- Outcome: Client updated on progress, temporary assistance offered
- [View Meeting Notes]

**Timeline Entry 11:**
- ✉️ Weekly Update
- Date/Time: 03/12/2024 10:00
- By: System (Auto)
- Details: Weekly progress update sent to client
- [View Email Sent]

**Timeline Entry 12:**
- 📄 Documents Requested
- Date/Time: 03/12/2024 14:30
- By: Sarah Naidoo
- Details: Requested additional medical documents from insurer
- Deadline: 10/12/2024
- [View Request]

**Timeline Entry 13:**
- ✉️ Weekly Update
- Date/Time: 10/12/2024 10:00
- By: System (Auto)
- Details: Weekly progress update sent to client
- Status: Documents received, awaiting underwriter decision
- [View Email Sent]

**Timeline Entry 14:**
- 📝 Internal Note
- Date/Time: 13/12/2024 11:00
- By: Sarah Naidoo
- Details: Approaching 6-week deadline - escalation prepared
- Action: If no resolution by 16/12, will engage Ombudsman
- Internal only

**Add New Activity:**
- [📝 Add Note]
- [📞 Log Call]
- [📧 Send Email]
- [🤝 Schedule Meeting]
- [📄 Upload Document]
- [⏰ Set Reminder]

**Tab 3: Communications**

**All communications related to this complaint:**

**Filter Communications:**
- Type: All | Emails | Calls | SMS | Letters | Meetings
- Direction: All | Inbound | Outbound
- Participant: All | Client | Representative | Third Party

**Communication List:**

**Communication 1:**
- Type: 📧 Email
- Direction: Outbound
- From: sarah.naidoo@customapp.co.za
- To: johan.vanzyl@email.com
- Subject: Weekly Update - CMP-2024-007
- Date: 10/12/2024 10:00
- Status: Sent ✅
- [View Full Email] [Reply] [Forward]

**Communication 2:**
- Type: 📞 Phone Call
- Direction: Inbound
- From: Johan van Zyl (+27 83 456 7890)
- To: Sarah Naidoo
- Date: 08/12/2024 14:30
- Duration: 12 minutes
- Notes: "Client called to check on progress. Expressed frustration with delay. Reassured that escalation in progress."
- [View Call Notes] [Edit Notes]

**Communication 3:**
- Type: 📧 Email
- Direction: Inbound
- From: johan.vanzyl@email.com
- To: sarah.naidoo@customapp.co.za
- Subject: Re: Your complaint - CMP-2024-007
- Date: 06/11/2024 15:20
- Status: Received ✅
- Attachments: 2
- [View Full Email]

**Communication 4:**
- Type: 📧 Email
- Direction: Outbound
- From: sarah.naidoo@customapp.co.za
- To: johan.vanzyl@email.com
- Subject: Acknowledgment - Complaint CMP-2024-007
- Date: 06/11/2024 09:15
- Template: Standard Acknowledgment
- Status: Sent ✅, Opened ✅ (06/11/2024 10:30)
- [View Email]

**Communication 5:**
- Type: 🤝 Meeting
- Date: 26/11/2024 15:00
- Location: FSP Office, Cape Town
- Attendees: Johan van Zyl (Client), Sarah Naidoo, Johan Smit
- Duration: 45 minutes
- Agenda: Progress update, client reassurance
- Minutes: [View Meeting Minutes]
- Follow-up Actions: 2 items
- [View Full Details]

**Send New Communication:**
- [📧 Send Email] - Opens email template
- [📞 Log Call] - Opens call log form
- [📱 Send SMS] - Opens SMS form
- [✉️ Send Letter] - Opens letter template
- [🤝 Schedule Meeting] - Opens calendar

**Email Templates Available:**
- Acknowledgment
- Weekly Update
- Request for Information
- Resolution Offer
- Case Closed
- Escalation Notice
- Ombudsman Information

**Tab 4: Documents**

**All documents related to this complaint:**

**Document Categories:**
- Client Submitted Documents (5)
- Representative Documents (2)
- Internal Investigation (4)
- Third Party Correspondence (3)
- Resolution Documentation (0)

**Document List:**

**Client Documents:**
- Death Certificate.pdf
  - Uploaded: 05/11/2024 14:30
  - By: Client (via email)
  - Size: 245 KB
  - Status: ✅ Verified
  - [View] [Download] [Share]

- Claim Form Completed.pdf
  - Uploaded: 05/11/2024 14:30
  - By: Client
  - Size: 1.2 MB
  - Status: ✅ Verified
  - [View] [Download]

- ID Document.pdf
- Email Correspondence.pdf
- Medical Records.pdf

**Representative Documents:**
- Representative Response.pdf
  - Uploaded: 10/11/2024 16:45
  - By: Sarah Naidoo (Representative)
  - Size: 456 KB
  - Description: Formal response to complaint
  - [View] [Download]

- Claim Submission Proof.pdf

**Internal Investigation:**
- Investigation Plan.docx
- Call Notes - Client 10Nov.docx
- Meeting Minutes - 15Nov.pdf
- Escalation Request to Insurer.pdf

**Third Party:**
- Insurer Response - 12Nov.pdf
- Medical Underwriter Notes.pdf
- Insurer Escalation Response.pdf

**Upload New Document:**
- [📎 Upload Document] button
- Categories: Client | Representative | Internal | Third Party | Resolution
- Document type selection
- Description field
- Access control: Internal only | Shareable with client

**Tab 5: Resolution**

**This tab tracks resolution efforts and final outcome**

**Resolution Status:**
- Current Status: 🔄 IN PROGRESS
- Resolution Attempts: 2
- Current Approach: Escalation to insurer senior management

**Resolution Attempts:**

**Attempt 1:**
- Date: 15/11/2024
- Approach: Standard insurer follow-up
- Action: Contacted claims department
- Outcome: ❌ Unsuccessful - no progress
- Reason: Underwriter reviewing medical evidence
- Next Step: Escalate to management

**Attempt 2:**
- Date: 26/11/2024
- Approach: Escalation to insurer management
- Action: Meeting with client, escalation letter sent
- Outcome: ⏳ Pending - awaiting response
- Deadline Set: 10/12/2024
- Status: Response received, awaiting decision

**Current Resolution Plan:**

**Action Items:**
- ✅ Contact insurer claims - Completed 12/11
- ✅ Gather all supporting documents - Completed 03/12
- ✅ Escalate to insurer management - Completed 15/11
- ✅ Meet with client - Completed 26/11
- 🔄 Follow up on escalation - In progress
- ⏰ Prepare Ombudsman referral if needed - Pending
- ⏰ Final resolution offer - Pending

**Resolution Options Being Considered:**
1. **Preferred:** Insurer approves claim, pays full amount
2. **Alternative:** Partial payment with negotiated settlement
3. **Last Resort:** Refer to Ombudsman for determination

**Proposed Resolution (Draft):**
- Not yet finalized
- Waiting for insurer decision
- If approved: Full claim payment + compensation for delay
- If declined: Will prepare Ombudsman referral

**Client Satisfaction Check:**
- Has client been kept informed? ✅ Yes (weekly updates)
- Is client satisfied with progress? ⚠️ Partial (frustrated with delay but appreciates updates)
- Alternative resolution offered? ❌ Not yet
- Client willing to escalate to Ombudsman? ✅ Yes, if no resolution

**Compensation Consideration:**
- Financial loss: R45,000 (funeral costs paid out of pocket)
- Emotional distress: High (widow, vulnerable)
- Recommendation: Offer compensation if claim approved
- Amount: To be determined based on final outcome

**Final Resolution (When ready):**
- [Prepare Resolution Offer] button
- [Send to Client for Acceptance] button
- [Mark as Resolved] button

**Tab 6: Representative Response**

**Representative: Sarah Naidoo**
**Response Submitted: 10/11/2024 16:45**

**Response Form:**

**1. Were you aware of this complaint before official notification?**
- ⭕ Yes
- Response: "Yes, client had contacted me directly via email and phone regarding the claim delay."

**2. Summary of events from your perspective:**
"Client submitted life insurance claim on 01/10/2024 following spouse's death. All required documents were submitted by client. I submitted claim to insurer (Old Mutual) on 02/10/2024 via their portal. I received automated acknowledgment from insurer.

I followed up with insurer on 15/10/2024 and was advised claim is with medical underwriter due to recent policy inception (policy only 14 months old). I communicated this to client.

I followed up again on 30/10/2024 and was advised underwriter still reviewing. No substantive update provided. I requested escalation but was told to wait for standard process.

Client contacted me again on 04/11/2024 expressing distress and urgency. I attempted to escalate but received same response from insurer. Client then lodged formal complaint."

**3. What actions did you take to resolve the issue?**
- ✅ Contacted insurer multiple times (15/10, 30/10, 03/11)
- ✅ Kept client informed of progress
- ✅ Requested escalation from insurer
- ✅ Provided emotional support to client
- ❌ Did not escalate internally until client complained

**4. Supporting documentation:**
- Claim Submission Proof.pdf - Portal confirmation
- Email to Insurer 15Oct.pdf
- Email to Insurer 30Oct.pdf
- Client Email Chain.pdf

**5. Do you accept responsibility for any part of this complaint?**
- ⭕ Partial responsibility
- Explanation: "I accept I should have escalated internally sooner given client's vulnerable circumstances and financial urgency. I relied too heavily on insurer's standard timeline. I should have engaged compliance and management after second follow-up yielded no progress."

**6. What could have been done differently?**
- Earlier internal escalation
- More proactive insurer engagement
- Offer of interim assistance to client
- Better communication of expected timelines

**7. Lessons learned / training needs:**
- Need better process for escalating stuck claims
- Training on identifying vulnerable clients
- Guidelines on when to escalate internally
- Access to insurer senior contacts for escalations

**8. Additional comments:**
"I apologize for the distress caused to Mr. van Zyl. I should have recognized the urgency and escalated sooner. I was following what I believed was standard process, but in hindsight, this situation required exceptional handling. I am committed to improving my escalation protocols."

**Representative Acknowledgment:**
- ☑ I acknowledge this response is accurate and complete
- ☑ I understand this may be shared with the client
- Signature: Sarah Naidoo
- Date: 10/11/2024

**Compliance Officer Assessment:**
- Representative's response: ✅ Satisfactory
- Identified training needs: Yes - escalation protocols
- Disciplinary action required: No (coaching only)
- Notes: Representative showed good faith effort, accepted responsibility, identified improvements

**Tab 7: Internal Notes**

**Private notes for internal team only - NOT visible to client:**

**Note 1:**
- By: Sarah Naidoo (Compliance Officer)
- Date: 06/11/2024 10:00
- "Client is elderly widow (68 years old). Spouse passed suddenly. Client is clearly distressed and financially vulnerable. This requires sensitive handling. Flagging as high priority."
- [Edit] [Delete]

**Note 2:**
- By: Johan Smit (Key Individual)
- Date: 15/11/2024 14:30
- "Discussed in management meeting. Insurer (Old Mutual) has been problematic with claim delays recently. This is third similar complaint in 2 months. May need to review our insurer relationships. Recommend we escalate this immediately to Old Mutual senior management and consider interim financial assistance to client."
- [Edit] [Delete]

**Note 3:**
- By: Sarah Naidoo
- Date: 26/11/2024 16:00
- "Met with client today. Very emotional. Explained full situation and escalation process. Client appreciated transparency. Offered interim loan facility (R20,000) which client declined but was grateful for offer. Client understands Ombudsman may be next step."
- [Edit] [Delete]

**Note 4:**
- By: Sarah Naidoo
- Date: 03/12/2024 15:00
- "Insurer finally providing substantive response. Medical underwriter requesting additional medical records from hospital. This should have been requested 4 weeks ago. Preparing for potential Ombudsman referral if not resolved by 6-week deadline (17/12)."
- [Edit] [Delete]

**Note 5:**
- By: Johan Smit
- Date: 10/12/2024 11:00
- "Spoke to Old Mutual Claims Manager today. Advised they will prioritize this claim and aim to provide decision by 15/12. If positive outcome, recommend we offer R10,000 compensation for delay and distress. If declined, immediate Ombudsman referral."
- [Edit] [Delete]

**Add New Note:**
- Rich text editor
- [Save Note] [Cancel]
- Notification options: ☐ Notify compliance officer ☐ Notify handler

**Tab 8: Escalation**

**Escalation History and Options:**

**Current Escalation Level: Level 2 - Key Individual Involved**

**Escalation Levels:**
1. Level 0: Handler (Compliance Officer) - Initial handling
2. ✅ Level 1: Compliance Officer Review - Escalated 08/11/2024
3. ✅ Level 2: Key Individual Involvement - Escalated 15/11/2024
4. ⏰ Level 3: FSP Owner Review - Not yet escalated
5. ⏰ Level 4: Ombudsman Referral - Prepared if needed

**Escalation Triggers:**
- ✅ Client expressed dissatisfaction
- ✅ Financial urgency identified
- ✅ 2-week deadline passed without resolution
- ⏰ 6-week deadline approaching (5 days)
- ✅ Third party (insurer) non-responsive

**Escalation Actions Taken:**

**Escalation 1: To Compliance Officer**
- Date: 08/11/2024
- By: System (Auto - per policy)
- Reason: Complaint received
- Action: Full investigation initiated
- Outcome: Investigation ongoing

**Escalation 2: To Key Individual**
- Date: 15/11/2024
- By: Sarah Naidoo
- Reason: Insurer non-responsive, client vulnerable
- Action: Management meeting, insurer escalation
- Outcome: Insurer engaged at senior level

**Next Escalation Options:**

**Option 1: Escalate to FSP Owner**
- Trigger: If no resolution by 16/12/2024 (1 day before 6-week deadline)
- Purpose: Final internal review before Ombudsman
- Action: FSP Owner will contact insurer CEO
- [Escalate Now] button

**Option 2: Refer to Ombudsman**
- Trigger: If no resolution by 6-week deadline (17/12/2024)
- Available: ⏰ In 5 days
- Client consent: ✅ Obtained
- Documentation: ✅ Complete file ready
- [Prepare Ombudsman Referral] button

**Escalation Communication:**
- Client notified of escalations: ✅ Yes
- Client updated on progress: ✅ Weekly
- Representative notified: ✅ Yes
- Timeline communicated: ✅ Yes

**Tab 9: Audit Trail**

**Complete audit log of all actions:**

| Timestamp | User | Action | Details | IP Address |
|-----------|------|--------|---------|------------|
| 05/11/2024 14:30 | Client | Complaint Submitted | Email received | Client Device |
| 05/11/2024 14:35 | System | Case Created | CMP-2024-007 | System |
| 06/11/2024 09:15 | System | Email Sent | Acknowledgment | System |
| 06/11/2024 09:30 | Sarah Naidoo | Representative Notified | Email sent | 196.201.x.x |
| 08/11/2024 10:00 | Sarah Naidoo | Status Changed | Received → In Progress | 196.201.x.x |
| 10/11/2024 11:30 | Sarah Naidoo | Call Logged | Client contact | 196.201.x.x |
| 10/11/2024 16:45 | Sarah Naidoo | Document Uploaded | Representative response | 196.201.x.x |
| 12/11/2024 09:00 | Sarah Naidoo | Third Party Contact | Insurer contacted | 196.201.x.x |
| 15/11/2024 14:00 | Johan Smit | Case Accessed | Viewed details | 196.201.x.x |
| 15/11/2024 14:30 | Sarah Naidoo | Escalation | Escalated to KI | 196.201.x.x |
| ... | ... | ... | ... | ... |

**Export Audit Trail:**
- [Export to PDF] [Export to Excel]

---

## 5. COMPLAINTS CALENDAR TAB

### Calendar View

**Calendar Display:**
- Month view (default)
- Week view
- Day view
- List view

**Calendar Legend:**
- 🔴 6-week deadlines
- 🟠 Follow-up dates
- 🔵 Scheduled meetings/calls
- 🟢 Completed milestones
- 🟣 Ombudsman dates

**December 2024 Calendar Example:**

**Key Dates Highlighted:**
- 17/12/2024: 🔴 CMP-2024-007 - 6-week deadline
- 20/12/2024: 🟠 CMP-2024-008 - Follow up with client
- 22/12/2024: 🔵 CMP-2024-009 - Client meeting scheduled

**Click on date:**
- Shows all complaints with activities on that date
- Quick actions available
- Add new event/reminder

### Deadline Tracker

**Upcoming Deadlines Table:**

**Within 7 Days:**
| Reference | Client | Type | Date | Days | Status | Action |
|-----------|--------|------|------|------|--------|--------|
| CMP-2024-007 | Johan van Zyl | 6-Week | 17/12/2024 | 5 | In Progress | [Review] |

**Within 30 Days:**
| Reference | Client | Type | Date | Days | Status | Action |
|-----------|--------|------|------|------|--------|--------|
| CMP-2024-009 | Thabo Mokoena | 6-Week | 16/01/2025 | 32 | In Progress | [View] |

**6-Month Deadlines:**
| Reference | Client | Type | Date | Days | Status | Action |
|-----------|--------|------|------|------|--------|--------|
| CMP-2024-007 | Johan van Zyl | 6-Month | 05/05/2025 | 142 | In Progress | [View] |

**No Overdue Deadlines:** ✅

### Scheduled Activities

**This Week:**
- 17/12/2024: CMP-2024-007 - 6-week deadline
- 18/12/2024: CMP-2024-008 - Send closure confirmation
- 20/12/2024: Team meeting - Complaints review

**Next Week:**
- 22/12/2024: CMP-2024-009 - Client meeting
- 24/12/2024: Weekly updates due

**Reminders:**
- 📧 Weekly update emails: Every Monday 10:00
- 🔔 Deadline alerts: 7 days, 3 days, 1 day before
- 📊 Monthly report: Last day of month

### Add Calendar Event

**Quick Add Form:**
- Complaint Reference (dropdown)
- Event Type: Meeting | Call | Deadline | Follow-up | Other
- Date & Time
- Duration
- Attendees (if meeting/call)
- Description
- Reminder settings
- [Add to Calendar]

---

## 6. ANALYSIS & TRENDS TAB

### Overview Statistics

**Year-to-Date Summary (2024):**
- Total Complaints: 8
- Resolved: 6 (75%)
- Active: 2 (25%)
- Escalated to Ombudsman: 0 (0%)
- Average Resolution Time: 18 days
- Compliance Rate: 100% (all within 6 weeks)

**Comparison to Previous Year:**
- 2023: 10 complaints (↓ 20%)
- 2022: 15 complaints (↓ 47% from 2022)
- Trend: ✅ Improving

### Complaints by Category (Charts)

**Chart 1: Category Breakdown (Donut Chart)**
- Claims Issues: 3 (38%)
- Service Quality: 3 (38%)
- Product Issues: 1 (12%)
- Communication: 1 (12%)

**Chart 2: Sub-category Detail (Bar Chart)**
- Claim Delayed: 2
- Claim Rejected: 1
- Poor Communication: 2
- Unresponsive Representative: 1
- Policy Query: 1
- Mis-selling: 1

**Chart 3: Trend Over Time (Line Chart)**
- Monthly complaints over 24 months
- Shows seasonal patterns
- Trend line showing decrease

### Resolution Analysis

**Chart 4: Resolution Time Distribution (Histogram)**
- X-axis: Days to resolution
- Y-axis: Number of complaints
- Buckets: 0-7 days, 8-14 days, 15-21 days, 22-28 days, 29-42 days
- Target line: 42 days (6 weeks)
- Most complaints: 15-21 days bucket

**Chart 5: Resolution Methods (Pie Chart)**
- Direct resolution: 4 (67%)
- Compensation offered: 1 (17%)
- Policy change: 1 (17%)
- Ombudsman referral: 0 (0%)

**Table: Resolution Effectiveness**
| Method | Count | Avg Time | Client Satisfaction | Cost to FSP |
|--------|-------|----------|---------------------|-------------|
| Direct resolution | 4 | 12 days | 95% | R0 |
| Compensation | 1 | 28 days | 90% | R5,000 |
| Policy change | 1 | 35 days | 100% | R0 |

### Representative Analysis

**Chart 6: Complaints by Representative (Bar Chart)**
- Shows which representatives have most complaints
- Color-coded by resolution status
- Helps identify training needs

**Representative Performance Table:**
| Representative | Complaints | Resolved | Avg Time | Satisfaction | Training Needed |
|----------------|------------|----------|----------|--------------|-----------------|
| Sarah Naidoo | 3 | 2 | 15 days | 93% | ❌ No |
| Thabo Mokoena | 2 | 2 | 20 days | 95% | ❌ No |
| Pieter Botha | 2 | 1 | 25 days | 85% | ⚠️ Communication |
| Johan Smit | 1 | 1 | 10 days | 100% | ❌ No |

**Insights:**
- Pieter Botha: 2 communication-related complaints - recommend training
- Overall: Team performing well, no systemic issues
- Recommendation: Quarterly refresher on client communication

### Financial Impact Analysis

**Chart 7: Financial Impact (Stacked Bar)**
- By category showing financial loss reported
- Total financial impact: R205,000
- Resolved amounts: R155,000 (paid out)
- Outstanding: R50,000 (pending claim)

**Cost of Complaints:**
- Direct costs (compensation paid): R5,000
- Indirect costs (staff time, resources): Estimated R15,000
- Total cost: R20,000 for 8 complaints
- Average cost per complaint: R2,500

### Client Satisfaction

**Chart 8: Satisfaction Ratings (Bar Chart)**
- Collected post-resolution
- 1-5 star scale
- Average: 4.3 stars
- Distribution:
  - 5 stars: 4 complaints (67%)
  - 4 stars: 1 complaint (17%)
  - 3 stars: 1 complaint (17%)
  - 1-2 stars: 0 complaints (0%)

**Satisfaction Factors:**
- Communication quality: 4.5 stars
- Resolution time: 4.2 stars
- Outcome fairness: 4.3 stars
- Overall experience: 4.3 stars

### Root Cause Analysis

**Primary Root Causes Identified:**
1. **Third Party Delays (40%):** Insurer/underwriter delays beyond FSP control
2. **Communication Gaps (30%):** Representative not updating clients proactively
3. **Process Issues (20%):** Internal process improvements needed
4. **Product Issues (10%):** Product design or suitability concerns

**Corrective Actions Implemented:**
- Enhanced insurer escalation protocols
- Weekly client update requirement
- Process improvements for claims tracking
- Additional product training

**Preventive Measures:**
- Proactive client communication policy
- Regular representative training
- Improved insurer relationship management
- Early warning system for potential issues

### Compliance Metrics

**FAIS Act Compliance:**
- 48-hour acknowledgment: 100% (8/8)
- 6-week resolution rate: 100% (8/8)
- 6-month closure rate: 100% (8/8)
- Record retention: 100%
- Ombudsman notification: N/A (no escalations)

**Industry Benchmarks:**
- FSP performance: Above average
- Complaint rate: Below industry average
- Resolution time: Better than industry average (18 days vs. 28 days)
- Escalation rate: Below industry average (0% vs. 5%)

### Predictive Analytics

**Forecast for Next 12 Months:**
- Expected complaints: 7-9 (based on trend)
- High-risk period: December-January (year-end claims)
- Low-risk period: June-August
- Recommendation: Additional staff during high-risk period

### Reports Available

**Standard Reports:**
1. **Monthly Complaints Summary**
   - All complaints in month
   - Status breakdown
   - Compliance metrics
   - [Generate]

2. **Quarterly Analysis Report**
   - Trend analysis
   - Root cause analysis
   - Recommendations
   - [Generate]

3. **Annual FSCA Report**
   - Full year summary
   - Compliance certification
   - Statistical analysis
   - [Generate]

4. **Representative Performance Report**
   - Per-representative metrics
   - Training needs
   - Commendations
   - [Generate]

5. **Root Cause Analysis Report**
   - Detailed root cause breakdown
   - Corrective actions
   - Effectiveness measures
   - [Generate]

**Custom Report Builder:**
- Select metrics
- Date range
- Filters
- Charts/tables
- Export format
- [Build Report]

---

## 7. OMBUDSMAN CASES TAB

### Overview

**Purpose:**
"Track complaints that have been escalated to the relevant Ombudsman (FAIS Ombud, OSTI, etc.)"

**Stats Cards:**

**Card 1: Total Escalated**
- Number: 0
- Subtitle: "Current year"
- Status: Success (green)

**Card 2: Active with Ombudsman**
- Number: 0
- Subtitle: "Pending determination"

**Card 3: Ombudsman Rulings**
- Number: 0
- Subtitle: "Determinations received"

**Card 4: Ruling in FSP Favor**
- Number: N/A
- Subtitle: "Of rulings received"

### When No Cases Exist

**Empty State Display:**
- Icon: Scale (large)
- Message: "No complaints have been escalated to Ombudsman"
- Subtext: "This indicates effective internal resolution processes"
- Status: ✅ Excellent compliance performance

### Ombudsman Referral Process

**When to Refer:**
- Client requests escalation
- 6-week deadline reached without resolution
- Internal processes exhausted
- Deadlock between FSP and client
- Client rejects resolution offer

**Referral Checklist:**
- ☐ Client notified of right to refer
- ☐ 6-week period completed
- ☐ All reasonable attempts at resolution made
- ☐ Complete complaint file prepared
- ☐ Supporting documentation gathered
- ☐ Internal position documented
- ☐ FSP response to complaint prepared

**Prepare Ombudsman Referral:**
- Select complaint: (dropdown)
- Ombudsman: FAIS Ombud | OSTI | Other
- Referral reason: (dropdown)
- FSP position: (textarea)
- Supporting documents: (upload)
- [Submit Referral]

### Ombudsman Case Management (If Cases Exist)

**Case List Table:**

| Ombudsman Ref | Our Ref | Client | Date Referred | Date Received | Status | Determination | Actions |
|---------------|---------|--------|---------------|---------------|--------|---------------|---------|
| FAIS-2024-123 | CMP-2024-005 | J. Smith | 15/03/2024 | 20/03/2024 | Under Review | Pending | [View] |

**Case Detail:**
- Complete timeline
- Ombudsman communications
- Submissions made
- Evidence provided
- Determination when received
- Compliance with determination
- Costs awarded (if any)

### Ombudsman Information Resources

**FAIS Ombud:**
- Phone: 012 762 5000
- Email: info@faisombud.co.za
- Website: www.faisombud.co.za
- Portal: Online submission available
- Processing time: 4-6 months typically

**OSTI (Short-term):**
- Phone: 011 726 8900
- Email: info@osti.co.za
- Website: www.osti.co.za

**LTIO (Long-term):**
- Phone: 021 657 5000
- Email: info@ombud.co.za
- Website: www.ombud.co.za

**Client Rights:**
- Information sheet for clients
- Ombudsman brochures
- Contact details
- Process explanation
- Downloadable PDFs

---

## 8. REPORTS TAB

### Report Types (Selection Cards)

**Report 1: Complaints Summary**
- Icon: Chart-bar
- Description: "Comprehensive overview of all complaints for selected period"
- Options:
  - Date range: This Month | This Quarter | This Year | Custom
  - Include: Statistics, charts, analysis
  - Format: PDF | Excel
- [Generate Report]

**Report 2: Compliance Certificate**
- Icon: Award
- Description: "Certificate of FAIS Act Section 26 compliance"
- Options:
  - Period: Monthly | Quarterly | Annual
  - Include: Compliance metrics, attestation
  - Format: PDF
- [Generate Certificate]

**Report 3: Individual Complaint Report**
- Icon: File-text
- Description: "Detailed report for specific complaint"
- Options:
  - Select complaint: (dropdown)
  - Include: All tabs, documents, communications
  - Format: PDF
- [Generate Report]

**Report 4: Representative Performance**
- Icon: Person-lines
- Description: "Complaints by representative with performance metrics"
- Options:
  - Date range
  - Select representatives: All | Specific
  - Include: Resolution times, satisfaction ratings
  - Format: PDF | Excel
- [Generate Report]

**Report 5: Root Cause Analysis**
- Icon: Search
- Description: "Deep dive into complaint causes and trends"
- Options:
  - Date range
  - Category filter
  - Include: Charts, recommendations
  - Format: PDF | PowerPoint
- [Generate Report]

**Report 6: Ombudsman Cases**
- Icon: Scale
- Description: "Summary of all Ombudsman escalations and outcomes"
- Options:
  - Date range
  - Status: All | Active | Completed
  - Format: PDF | Excel
- [Generate Report]

**Report 7: FSCA Submission Report**
- Icon: Building
- Description: "Annual complaints report for FSCA submission"
- Options:
  - Year: 2024
  - Include: All required FSCA data points
  - Format: PDF (FSCA template)
- [Generate Report]

**Report 8: Client Satisfaction Report**
- Icon: Star
- Description: "Analysis of client satisfaction ratings and feedback"
- Options:
  - Date range
  - Rating breakdown
  - Include: Comments, trends
  - Format: PDF | Excel
- [Generate Report]

**Report 9: Financial Impact Report**
- Icon: Currency-dollar
- Description: "Financial analysis of complaints and resolutions"
- Options:
  - Date range
  - Include: Costs, compensation, losses
  - Format: PDF | Excel
- [Generate Report]

**Report 10: Custom Report Builder**
- Icon: Sliders
- Description: "Build your own custom report"
- Options:
  - Select data fields
  - Choose visualizations
  - Apply filters
  - Set format
- [Build Report]

### Report Generation Interface

**After selecting report type:**

**Report Configuration:**

**Report: Complaints Summary**

**1. Report Period:**
- ⭕ This Month (Dec 2024)
- ⭕ This Quarter (Q4 2024)
- ⭕ This Year (2024)
- ⭕ Last 12 Months
- ⭕ Custom Range (date pickers)

**2. Include:**
- ☑ Executive Summary
- ☑ Statistics Overview
- ☑ Complaints by Category (chart)
- ☑ Complaints by Status (chart)
- ☑ Resolution Time Analysis (chart)
- ☑ Representative Performance (chart)
- ☑ Compliance Metrics
- ☑ Individual Complaint Details (table)
- ☐ Full Complaint Histories (very long)
- ☑ Root Cause Analysis
- ☑ Recommendations

**3. Format:**
- ⭕ PDF (recommended for presentation)
- ⭕ Excel (for data analysis)
- ⭕ PowerPoint (for presentations)
- ⭕ Word (for editing)

**4. Recipient/Distribution:**
- Email to: (comma-separated)
- CC: (optional)
- Subject: "Complaints Summary Report - December 2024"
- Message: (textarea)
- ☐ Save to document library
- ☐ Schedule recurring (monthly, quarterly)

**5. Branding:**
- ☑ Include FSP logo
- ☑ Include FSP details
- ☑ Include compliance officer signature
- ☐ Mark as confidential

**Preview:**
- [Preview Report] button
- Opens in new window

**Actions:**
- [Generate Report] (primary)
- [Save Configuration] (for future use)
- [Schedule Recurring]
- [Cancel]

### Report Preview & Download

**After generation:**

**Report Generated Successfully** ✅

**Report Details:**
- Title: Complaints Summary Report - December 2024
- Generated: 15/12/2024 15:30
- Generated by: Sarah Naidoo
- Format: PDF
- Size: 2.4 MB
- Pages: 12

**Preview:**
- PDF viewer embedded
- Scroll through pages
- Zoom controls

**Actions:**
- [Download] (primary)
- [Email]
- [Print]
- [Save to Library]
- [Generate Again] (with different options)

### Report History

**Table of Previously Generated Reports:**

| Report Name | Type | Generated Date | Generated By | Format | Actions |
|-------------|------|----------------|--------------|--------|---------|
| Complaints Summary Dec 2024 | Summary | 15/12/2024 | S. Naidoo | PDF | [Download] [Email] [Delete] |
| Q4 2024 Analysis | Root Cause | 01/12/2024 | S. Naidoo | PDF | [Download] |
| Annual FSCA Report 2024 | FSCA Submission | 15/11/2024 | J. Smit | PDF | [Download] |
| Rep Performance Nov 2024 | Performance | 30/11/2024 | S. Naidoo | Excel | [Download] |

**Filters:**
- Report type
- Date range
- Generated by

**Storage:**
- Total reports: 45
- Storage used: 125 MB
- Auto-archive after: 12 months

---

## TECHNICAL FEATURES

### Form Validation
- Real-time validation
- Required field indicators
- Format validation (email, phone, date)
- Character count for text areas
- File upload validation (size, type)
- Duplicate detection
- Save as draft at any step

### Deadline Management
- Automatic calculation:
  - 48-hour acknowledgment
  - 6-week resolution deadline
  - 6-month closure deadline
- Calendar integration
- Automated reminders:
  - 7 days before
  - 3 days before
  - 1 day before
  - On deadline day
- Overdue alerts
- Escalation triggers

### Workflow Automation
- Auto-assignment rules
- Status progression rules
- Email templates:
  - Acknowledgment (48 hours)
  - Weekly updates
  - Request for information
  - Resolution offer
  - Case closed
  - Escalation notices
- Automated weekly updates
- Notification system:
  - Email
  - SMS (optional)
  - In-app alerts
- Task generation
- Reminder scheduling

### Communication Management
- Email integration
- Email templates
- Send from system
- Track opens/reads
- Archive all communications
- Call logging
- SMS logging
- Meeting scheduling
- Document attachments

### Document Handling
- Upload multiple files
- Drag & drop
- File preview
- Version control
- Document categories
- Access control
- 5-year retention
- Secure storage
- Download/share options

### Search & Filter
- Advanced search:
  - Reference number
  - Client name
  - Representative
  - Category
  - Status
  - Date range
  - Keywords in description
  - Financial impact range
- Multi-criteria filtering
- Save search filters
- Quick filters
- Real-time search
- Search within documents

### Analytics & Charts
- Use Chart.js for visualizations
- Interactive charts
- Drill-down capability
- Export chart data
- Custom date ranges
- Trend analysis
- Predictive analytics
- Benchmarking

### Role-Based Access
**FSP Owner/Principal:**
- Full access to all complaints
- View, edit, delete any complaint
- Assign handlers
- Approve escalations
- View all reports

**Key Individual:**
- Full access to supervised representatives' complaints
- View, edit complaints
- Assign to team members
- Escalate to owner
- View team reports

**Compliance Officer:**
- Full access to all complaints
- Create, edit, resolve complaints
- Verification authority
- Generate reports
- Conduct analysis
- FSCA submissions

**Representative:**
- View complaints involving them
- View complaints they logged
- Add notes/responses
- Cannot delete
- Limited reporting

**Admin Staff:**
- View all complaints (read-only)
- Can log new complaints
- Upload documents
- Generate basic reports
- Cannot resolve or edit

### Notifications & Alerts
- Email notifications:
  - New complaint assigned
  - Deadline approaching
  - Client communication
  - Status change
  - Resolution offered
  - Case closed
- In-app notifications
- SMS alerts (critical deadlines)
- Daily digest emails
- Weekly summaries
- Badge counters on tabs
- Sound alerts (optional)

### Audit Trail
- Complete activity log
- Who, what, when
- IP address tracking
- Before/after values
- Document access log
- Communication log
- Status change history
- Export audit trail

### Integration Points
- Client management system
- Representative management
- Document management
- Calendar system
- Email system
- SMS gateway
- Reporting engine

### Mobile Support
- Responsive design
- Mobile-optimized forms
- Touch-friendly interfaces
- Mobile document upload
- Camera integration
- Offline viewing
- Push notifications

### Security
- Role-based access control
- Data encryption
- Secure document storage
- Audit trails
- Access logging
- Session management
- Two-factor authentication (optional)

### Performance
- Lazy loading
- Pagination
- Caching
- Background processing
- Optimized searches
- Fast report generation

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- Text resizing

---

## SAMPLE DATA

**Current Date:** 15/12/2024

**Complaints Summary:**
- Total All-Time: 34
- This Year (2024): 8
- Active: 2
- Resolved: 6
- Closed: 32
- Escalated to Ombudsman: 0

**Active Complaints:**

**1. CMP-2024-007**
- Client: Johan van Zyl (7803125678901)
- Representative: Sarah Naidoo
- Category: Claims Issues - Claim Delayed
- Priority: High
- Received: 05/11/2024
- Status: In Progress
- 6-Week Deadline: 17/12/2024 (5 days)
- Financial Impact: R150,000
- Handler: Sarah Naidoo (Compliance Officer)

**2. CMP-2024-008**
- Client: Mary Johnson (8905126789012)
- Representative: Thabo Mokoena
- Category: Service Quality - Poor Communication
- Priority: Standard
- Received: 03/12/2024
- Status: Resolved (awaiting closure)
- 6-Week Deadline: 14/01/2025
- Financial Impact: None
- Handler: Thabo Mokoena

**Recent Closed Complaints:**

**3. CMP-2024-006**
- Client: Sipho Ndlovu
- Category: Claims - Claim Amount Disputed
- Received: 15/10/2024
- Closed: 05/11/2024
- Resolution Time: 21 days
- Outcome: Partial settlement agreed

**4. CMP-2024-005**
- Client: Lerato Dlamini
- Category: Product - Unsuitable Product
- Received: 01/09/2024
- Closed: 30/09/2024
- Resolution Time: 29 days
- Outcome: Policy replaced with suitable product

**Compliance Metrics:**
- 48-hour acknowledgment: 100% (8/8)
- 6-week resolution: 100% (8/8)
- Average resolution time: 18 days
- Client satisfaction: 4.3/5 stars
- Ombudsman escalations: 0

**Team:**
- Sarah Naidoo (Compliance Officer): 3 complaints handled
- Thabo Mokoena (Representative): 2 complaints
- Pieter Botha (Representative): 2 complaints
- Johan Smit (Key Individual): 1 complaint

**Categories (2024):**
- Claims Issues: 3 (38%)
- Service Quality: 3 (38%)
- Product Issues: 1 (12%)
- Communication: 1 (12%)

---

## FILE STRUCTURE

```
complaints-management/
├── index.html
├── css/
│   ├── complaints-styles.css
│   ├── calendar.css
│   ├── timeline.css
│   ├── charts.css
│   └── responsive.css
├── js/
│   ├── complaints-dashboard.js
│   ├── log-complaint.js
│   ├── active-complaints.js
│   ├── complaint-detail.js
│   ├── calendar.js
│   ├── analysis.js
│   ├── ombudsman.js
│   ├── reports.js
│   ├── deadline-calculator.js
│   ├── workflow-automation.js
│   ├── charts.js
│   └── data.js
└── assets/
    ├── email-templates/
    │   ├── acknowledgment.html
    │   ├── weekly-update.html
    │   ├── resolution-offer.html
    │   ├── case-closed.html
    │   └── ombudsman-info.html
    └── sample-documents/
```

Generate a complete, production-ready Complaints Management system that handles the full complaint lifecycle from logging to resolution, with strict FAIS Act Section 26 compliance, comprehensive deadline tracking, robust workflow automation, and detailed reporting. The system should meet all South African regulatory requirements and be immediately usable for managing client complaints in a financial services environment.
