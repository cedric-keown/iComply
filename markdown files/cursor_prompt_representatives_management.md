# CURSOR PROMPT: REPRESENTATIVES MANAGEMENT MODULE

Create a fully functional, realistic HTML mockup for the Representatives Management module of a South African FAIS broker compliance portal. This module handles representative registration, profile management, licensing, Fit & Proper status, CPD compliance, supervision structure, debarment checking, and comprehensive reporting as per FAIS Act requirements.

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
- Representatives Dashboard (default)
- Representative Directory
- Add New Representative
- Supervision Structure
- Compliance Overview
- Debarment Register
- Reports

---

## 1. REPRESENTATIVES DASHBOARD

### Hero Section: Overview Statistics (4 Cards)

**Card 1: Total Representatives**
- Large number: 12
- Icon: Users
- Subtitle: "Active representatives"
- Breakdown: 
  - Active: 12
  - Suspended: 0
  - Terminated: 0
- [View All] link

**Card 2: Compliance Status**
- Large number: 92%
- Icon: Shield-check
- Subtitle: "Fully compliant"
- Status: Success (green)
- Details: 11 of 12 compliant
- [View Issues] link

**Card 3: CPD Due Soon**
- Large number: 3
- Icon: Clock
- Subtitle: "Deadline May 31st"
- Days remaining: 167 days
- Status: Info (blue)
- [Review CPD] link

**Card 4: Fit & Proper Renewals**
- Large number: 2
- Icon: Award
- Subtitle: "Due this quarter"
- Status: Warning (amber)
- [Review F&P] link

### Regulatory Compliance Summary

**FAIS Act Compliance Card:**
- Overall Status: ⚠️ ATTENTION REQUIRED (amber badge)
- Representatives Compliant: 11/12 (92%)
- All Fit & Proper: ✅ Current
- All CPD Current: ⚠️ 1 representative behind
- All FICA Verified: ✅ Compliant
- Debarment Checks: ✅ All clear
- Last FSCA Update: 30/11/2024

**Regulatory Requirements Display:**
- 📋 Fit & Proper: All reps must maintain F&P status
- 🎓 CPD: 30 hours annually (20 general + 10 specific)
- 🔍 FICA: All reps must be verified
- 👤 Supervision: Key Individual per FSP category
- 🚫 Debarment: Monthly checks required
- 📝 Record Retention: 5 years post-termination

### Representatives by Status (Visual Cards)

**Status Breakdown:**

**Active (12)**
- Count: 12
- Color: Success (green)
- Icon: Check-circle
- Description: "Currently licensed and compliant"
- Action: [View Active Reps]

**Probation (0)**
- Count: 0
- Color: Warning (amber)
- Icon: Alert-circle
- Description: "New representatives under supervision"

**Non-Compliant (1)**
- Count: 1
- Color: Danger (red)
- Icon: X-circle
- Description: "Compliance issues requiring attention"
- Representative: Pieter Botha (CPD behind)
- Action: [Resolve Issues]

**Suspended (0)**
- Count: 0
- Color: Grey
- Icon: Pause-circle
- Description: "Temporarily suspended from duties"

**Terminated (3)**
- Count: 3
- Color: Dark grey
- Icon: Archive
- Description: "No longer with FSP (historical records)"
- Action: [View Historical]

### Compliance Matrix (Interactive Table)

**Quick View Matrix:**

| Representative | F&P Status | CPD Status | FICA | Debarment | Overall | Actions |
|----------------|------------|------------|------|-----------|---------|---------|
| Sarah Naidoo | ✅ Current | ✅ 32/30hrs | ✅ Verified | ✅ Clear | ✅ Compliant | [View] |
| Thabo Mokoena | ✅ Current | ✅ 30/30hrs | ✅ Verified | ✅ Clear | ✅ Compliant | [View] |
| Johan Smit (KI) | ✅ Current | ✅ 35/30hrs | ✅ Verified | ✅ Clear | ✅ Compliant | [View] |
| Pieter Botha | ✅ Current | ⚠️ 18/30hrs | ✅ Verified | ✅ Clear | ⚠️ Non-Compliant | [Resolve] |
| ... | ... | ... | ... | ... | ... | ... |

**Legend:**
- ✅ Compliant/Current
- ⚠️ Warning/Due Soon
- ❌ Non-Compliant/Overdue
- 🔄 In Progress
- ⏰ Pending

**Filter Options:**
- Show: All | Compliant Only | Issues Only
- Sort by: Name | Compliance Status | CPD Progress | Join Date

### Supervision Structure Overview

**Organizational Hierarchy Card:**

**FSP Owner/Principal:**
- Name: David Anderson
- License: FSP-12345
- Supervises: All representatives (12)
- Status: ✅ Active

**Key Individuals (2):**

**KI 1: Johan Smit**
- Categories: I, IIA, IIB, IIIA
- Direct Reports: 6 representatives
- Status: ✅ Compliant
- [View Team]

**KI 2: Sarah Naidoo**
- Categories: I, IIA
- Direct Reports: 6 representatives
- Status: ✅ Compliant
- [View Team]

**Visual Org Chart:**
- Interactive hierarchy diagram
- Click to expand teams
- Color-coded by compliance status
- [View Full Structure]

### Recent Activity Feed

**Activity List (Last 10 activities):**

**Activity 1:**
- Icon: 🎓 (blue)
- "CPD activity completed"
- Details: "Sarah Naidoo completed 'FAIS Compliance Update' (5 hours)"
- Time: 2 days ago
- [View CPD Details]

**Activity 2:**
- Icon: ⚠️ (amber)
- "CPD deadline approaching"
- Details: "Pieter Botha needs 12 more CPD hours before May 31st"
- Time: 3 days ago
- [Send Reminder]

**Activity 3:**
- Icon: ✅ (green)
- "Fit & Proper verification completed"
- Details: "Lerato Dlamini - Credit check passed"
- Time: 5 days ago
- [View F&P Record]

**Activity 4:**
- Icon: 👤 (blue)
- "New representative added"
- Details: "Zanele Mthembu joined as Category I representative"
- Time: 1 week ago
- [View Profile]

**Activity 5:**
- Icon: 🔍 (blue)
- "Debarment check completed"
- Details: "Monthly debarment check - all representatives clear"
- Time: 1 week ago
- [View Report]

**Activity 6:**
- Icon: 📝 (orange)
- "FICA verification updated"
- Details: "Thabo Mokoena - Address verification completed"
- Time: 2 weeks ago

**Activity 7:**
- Icon: 🏆 (green)
- "Performance milestone"
- Details: "Sarah Naidoo achieved 100% client satisfaction (Q4)"
- Time: 2 weeks ago

**Activity 8:**
- Icon: 📋 (blue)
- "Supervision review completed"
- Details: "Johan Smit - Quarterly team review"
- Time: 3 weeks ago

### Quick Actions Panel
- [Primary Button] Add New Representative
- [Secondary Button] Run Debarment Check
- [Secondary Button] View Compliance Report
- [Link] CPD Dashboard
- [Link] Fit & Proper Overview

### Alerts & Warnings

**Alert Cards:**

**Alert 1:** (Warning - Amber)
- Icon: Clock
- Title: "CPD Deadline Approaching"
- Message: "Pieter Botha needs 12 CPD hours before May 31st (167 days remaining)"
- Action: [Send Reminder] [View CPD Plan] [Dismiss]

**Alert 2:** (Info - Blue)
- Icon: Calendar
- Title: "Quarterly Supervision Reviews Due"
- Message: "Q1 2025 supervision reviews due by 31/01/2025"
- Representatives: 12 reviews pending
- Action: [Schedule Reviews] [View Requirements]

**Alert 3:** (Success - Green)
- Icon: Check-circle
- Title: "Debarment Check Complete"
- Message: "Monthly debarment check completed - all representatives clear"
- Date: 01/12/2024
- Action: [View Report]

### Performance Metrics

**Chart 1: Representatives by Category (Donut Chart)**
- Category I: 8 (67%)
- Category IIA: 6 (50%)
- Category IIB: 4 (33%)
- Category IIIA: 2 (17%)
- Note: Representatives can have multiple categories

**Chart 2: CPD Compliance Trend (Line Chart)**
- Last 12 months
- Shows percentage of team compliant each month
- Target line at 100%
- Current: 92%

**Chart 3: Average CPD Hours per Rep (Bar Chart)**
- Horizontal bars showing each rep's hours
- Target line at 30 hours
- Color-coded: Green (complete), Amber (progress), Red (behind)

**Chart 4: New Reps vs. Terminations (Line Chart)**
- 12-month trend
- New joiners: 4
- Terminations: 1
- Net growth: +3

### Licensing Summary

**FSP License Details:**
- FSP Number: FSP-12345
- License Holder: Anderson Financial Services
- Categories Authorized:
  - ✅ Category I - Advice/Intermediary Services
  - ✅ Category IIA - Long-term Insurance (A & B)
  - ✅ Category IIB - Short-term Insurance (Personal & Commercial)
  - ✅ Category IIIA - Health Service Benefits
- Status: ✅ Active
- Expiry: 31/03/2025
- [View Full License] [Renew]

**Representative Categories Utilization:**
- Cat I: 8 of 12 reps (67%)
- Cat IIA: 6 of 12 reps (50%)
- Cat IIB: 4 of 12 reps (33%)
- Cat IIIA: 2 of 12 reps (17%)

---

## 2. REPRESENTATIVE DIRECTORY TAB

### Filter & Search Controls

**Filters:**

**Status Filter:**
- ☐ Active (12)
- ☐ Probation (0)
- ☐ Non-Compliant (1)
- ☐ Suspended (0)
- ☐ Terminated (3)

**Category Filter:**
- ☐ Category I
- ☐ Category IIA
- ☐ Category IIB
- ☐ Category IIIA

**Compliance Filter:**
- ☐ Fully Compliant
- ☐ CPD Issues
- ☐ Fit & Proper Issues
- ☐ FICA Issues
- ☐ Multiple Issues

**Supervisor Filter:**
- All Supervisors
- Johan Smit (KI)
- Sarah Naidoo (KI)
- Direct to Owner
- Unsupervised

**Employment Type:**
- ☐ Full-Time
- ☐ Part-Time
- ☐ Independent Contractor
- ☐ Tied Agent

**Location:**
- All Offices
- Cape Town - Head Office
- Johannesburg Branch
- Durban Branch
- Remote

**Date Range:**
- Join Date From: (date picker)
- Join Date To: (date picker)
- Quick filters: This Year | Last Year | Last 2 Years | All Time

**Sort By:**
- Name (A-Z)
- Name (Z-A)
- Join Date (Newest)
- Join Date (Oldest)
- Compliance Status
- CPD Progress
- Performance Rating

**Search:**
- Search by: Name, ID Number, FSP Number, Email, Phone
- Real-time search
- Advanced search options

**View Options:**
- [Card View] | [Table View] | [Grid View]
- Toggle button
- Items per page: 10 | 25 | 50 | 100

**Bulk Actions:**
- Select All | Select None
- [Send Communication]
- [Export Selected]
- [Run Compliance Check]
- [Schedule Training]

### Representative Cards (Card View - Default)

**Card Structure for Each Representative:**

---

**Card 1: Sarah Naidoo**

**Header Section:**
- Profile Photo (circular, 80px)
- Name: Sarah Naidoo
- Title/Role: Senior Financial Advisor & Compliance Officer
- Status Badge: ✅ ACTIVE (green)
- Compliance Badge: ✅ COMPLIANT (green)

**Contact Information:**
- 📧 sarah.naidoo@customapp.co.za
- 📱 +27 82 345 6789
- 📍 Cape Town - Head Office

**Key Details:**
- FSP Number: REP-12345-001
- ID Number: 8706155800084
- Join Date: 15/03/2018
- Years with FSP: 6.8 years
- Supervisor: Johan Smit (KI)

**Categories & License Classes:**
- Category I: Advice & Intermediary
- Category IIA: Long-term Insurance (A, B)
- Status: ✅ All current

**Compliance Overview:**
- Fit & Proper: ✅ Current (expires 15/03/2025)
- CPD Status: ✅ 32/30 hours (107%)
- FICA: ✅ Verified (last check 01/10/2024)
- Debarment: ✅ Clear (last check 01/12/2024)

**Performance Metrics:**
- Client Satisfaction: 4.8/5.0 ⭐⭐⭐⭐⭐
- Active Clients: 127
- Policies Sold (YTD): 45
- Complaints: 0
- Commendations: 3

**Quick Actions:**
- [View Full Profile]
- [Send Message]
- [Schedule Meeting]
- [View Clients]
- [More ⋯]

---

**Card 2: Thabo Mokoena**

**Header:**
- Profile Photo
- Name: Thabo Mokoena
- Title: Financial Advisor
- Status: ✅ ACTIVE
- Compliance: ✅ COMPLIANT

**Contact:**
- 📧 thabo.mokoena@customapp.co.za
- 📱 +27 83 456 7890
- 📍 Johannesburg Branch

**Key Details:**
- FSP Number: REP-12345-002
- ID Number: 8905126789012
- Join Date: 01/06/2019
- Years with FSP: 5.5 years
- Supervisor: Johan Smit (KI)

**Categories:**
- Category I: Advice & Intermediary
- Category IIA: Long-term Insurance (A)

**Compliance:**
- Fit & Proper: ✅ Current
- CPD: ✅ 30/30 hours (100%)
- FICA: ✅ Verified
- Debarment: ✅ Clear

**Performance:**
- Client Satisfaction: 4.6/5.0
- Active Clients: 98
- Policies Sold: 38
- Complaints: 1 (resolved)

**Actions:**
- [View Profile] [Message] [More ⋯]

---

**Card 3: Pieter Botha**

**Header:**
- Profile Photo
- Name: Pieter Botha
- Title: Financial Advisor
- Status: ✅ ACTIVE
- Compliance: ⚠️ NON-COMPLIANT (amber)

**Contact:**
- 📧 pieter.botha@customapp.co.za
- 📱 +27 84 567 8901
- 📍 Cape Town - Head Office

**Key Details:**
- FSP Number: REP-12345-003
- ID Number: 7803125678901
- Join Date: 10/09/2020
- Years with FSP: 4.3 years
- Supervisor: Sarah Naidoo (KI)

**Categories:**
- Category I: Advice & Intermediary
- Category IIB: Short-term Insurance

**Compliance:**
- Fit & Proper: ✅ Current
- CPD: ⚠️ 18/30 hours (60%) - BEHIND
- FICA: ✅ Verified
- Debarment: ✅ Clear

**Compliance Alert:**
- 🚨 CPD Requirement: Needs 12 more hours before May 31st
- Days Remaining: 167 days
- Action: [Create CPD Plan] [Send Reminder]

**Performance:**
- Client Satisfaction: 4.2/5.0
- Active Clients: 76
- Policies Sold: 28
- Complaints: 2 (1 resolved, 1 open)

**Actions:**
- [View Profile] [Resolve CPD] [More ⋯]

---

**Card 4: Johan Smit (Key Individual)**

**Header:**
- Profile Photo with KI badge
- Name: Johan Smit
- Title: Key Individual & Branch Manager
- Status: ✅ ACTIVE
- Compliance: ✅ COMPLIANT
- Special Badge: 🏅 KEY INDIVIDUAL

**Contact:**
- 📧 johan.smit@customapp.co.za
- 📱 +27 82 234 5678
- 📍 Cape Town - Head Office

**Key Details:**
- FSP Number: REP-12345-KI1
- ID Number: 7509105678903
- Join Date: 01/01/2015
- Years with FSP: 9.0 years
- Role: Key Individual
- Supervises: 6 representatives

**Categories:**
- Category I: Advice & Intermediary
- Category IIA: Long-term Insurance (A, B)
- Category IIB: Short-term Insurance
- Category IIIA: Health Service Benefits

**Compliance:**
- Fit & Proper: ✅ Current (KI requirements)
- CPD: ✅ 35/30 hours (117%)
- FICA: ✅ Verified
- Debarment: ✅ Clear
- KI Qualifications: ✅ Current

**Leadership Metrics:**
- Team Size: 6 representatives
- Team Compliance: 83% (5/6 compliant)
- Team Performance: 4.5/5.0 average
- Supervision Reviews: ✅ Up to date

**Performance:**
- Client Satisfaction: 4.9/5.0
- Active Clients: 156
- Policies Sold: 62

**Actions:**
- [View Profile] [View Team] [Supervision Report] [More ⋯]

---

### Table View (Alternative)

**Comprehensive Table with Sortable Columns:**

| Photo | Name | FSP # | Categories | Status | F&P | CPD | FICA | Compliance | Supervisor | Actions |
|-------|------|-------|------------|--------|-----|-----|------|------------|------------|---------|
| [img] | Sarah Naidoo | REP-001 | I, IIA | ✅ Active | ✅ | 32/30 | ✅ | ✅ Compliant | Johan Smit | [👁️] [✏️] [💬] |
| [img] | Thabo Mokoena | REP-002 | I, IIA | ✅ Active | ✅ | 30/30 | ✅ | ✅ Compliant | Johan Smit | [👁️] [✏️] [💬] |
| [img] | Pieter Botha | REP-003 | I, IIB | ✅ Active | ✅ | 18/30 | ✅ | ⚠️ CPD Behind | Sarah Naidoo | [👁️] [⚠️] [💬] |
| [img] | Johan Smit (KI) | REP-KI1 | I, IIA, IIB, IIIA | ✅ Active | ✅ | 35/30 | ✅ | ✅ Compliant | Owner | [👁️] [👥] [✏️] |

**Column Options:**
- Click column header to sort
- Right-click for column options
- Show/hide columns
- Export visible columns

**Pagination:**
- Showing 1-10 of 12 active representatives
- Page: [1] [2] [Next]

### Grid View (Alternative)

**Compact Grid Layout:**
- 3-4 cards per row
- Smaller cards with essential info
- Photo, name, status, compliance
- Quick action buttons
- Good for overview of large teams

---

## 3. ADD NEW REPRESENTATIVE TAB

### New Representative Type Selection (First Step - Cards)

**Choose Representative Type:**

**Option 1: Individual Representative**
- Icon: Person
- Description: "Standard representative employed by the FSP"
- Most common
- [Select] button

**Option 2: Key Individual**
- Icon: Award
- Description: "Key Individual with supervisory responsibilities"
- Requires additional qualifications
- [Select] button

**Option 3: Compliance Officer**
- Icon: Shield-check
- Description: "Dedicated compliance officer role"
- Specific FAIS requirements
- [Select] button

**Option 4: Independent Contractor**
- Icon: Briefcase
- Description: "Contract-based representative"
- Different agreement terms
- [Select] button

### Representative Registration Form (Multi-step Wizard)

**Progress Indicator:**
1. Personal Information
2. Contact & Address
3. Employment Details
4. Categories & Licenses
5. Qualifications
6. Fit & Proper
7. FICA Verification
8. Supervision & Access
9. Review & Submit

---

#### STEP 1: PERSONAL INFORMATION

**Form Fields:**

**Basic Details:**

1. Title (dropdown) - REQUIRED
   - Mr
   - Mrs
   - Ms
   - Dr
   - Prof
   - Rev
   - Other

2. First Name (text) - REQUIRED
   - Validation: Letters only, no numbers

3. Middle Name(s) (text)
   - Optional

4. Last Name (text) - REQUIRED
   - Validation: Letters only

5. Preferred Name (text)
   - "What should we call you?"
   - Optional

6. Date of Birth (date picker) - REQUIRED
   - Format: DD/MM/YYYY
   - Must be 18+ years old
   - Auto-calculate age

**Age Display:**
- Current Age: [calculated] years
- Minimum: 18 years
- Must meet FAIS age requirements

**Identification:**

7. ID Type (radio) - REQUIRED
   - ⭕ South African ID Number
   - ⭕ Passport Number (non-SA citizens)

8. ID/Passport Number (text) - REQUIRED
   - If SA ID: Validate Luhn algorithm
   - Extract: Date of Birth, Gender
   - Auto-populate DOB if matches
   - Check for duplicates in system
   - Format: 13 digits for SA ID

9. Gender (radio) - REQUIRED
   - ⭕ Male
   - ⭕ Female
   - ⭕ Other
   - ⭕ Prefer not to say
   - Note: Auto-detected from SA ID if applicable

10. Nationality (dropdown) - REQUIRED
    - South African
    - Other (specify)
    - If non-SA: Work permit requirements

11. Home Language (dropdown)
    - English
    - Afrikaans
    - isiZulu
    - isiXhosa
    - Other SA languages
    - Other

12. Other Languages (multi-select)
    - Helpful for client matching

**Profile Photo:**
- Upload area
- Drag & drop or click to upload
- Accepted: JPG, PNG
- Max size: 2MB
- Recommended: Professional headshot, 500x500px
- Preview thumbnail
- [Upload Photo] [Remove]

**Buttons:**
- [Primary] Next: Contact & Address
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 2: CONTACT & ADDRESS

**Contact Information:**

1. Primary Email (email) - REQUIRED
   - Will be used for system login
   - Format validation
   - Check for duplicates
   - Example: representative@customapp.co.za

2. Alternative Email (email)
   - Optional backup email

3. Primary Mobile (text) - REQUIRED
   - Format: +27 XX XXX XXXX
   - Validation: SA mobile format
   - Used for 2FA and SMS alerts

4. Alternative Phone (text)
   - Optional landline/alternative

5. WhatsApp Number (text)
   - If different from primary mobile
   - Used for client communication

6. Emergency Contact Name (text) - REQUIRED
   - Full name

7. Emergency Contact Number (text) - REQUIRED
   - Format: +27 XX XXX XXXX

8. Emergency Contact Relationship (text)
   - E.g., Spouse, Parent, Sibling

**Physical Address:**

9. Street Address (text) - REQUIRED
   - House/unit number and street name

10. Suburb (text) - REQUIRED

11. City (text) - REQUIRED

12. Province (dropdown) - REQUIRED
    - Western Cape
    - Gauteng
    - KwaZulu-Natal
    - Eastern Cape
    - Free State
    - Limpopo
    - Mpumalanga
    - North West
    - Northern Cape

13. Postal Code (text) - REQUIRED
    - Format: 4 digits

14. Country (dropdown)
    - Default: South Africa

**Postal Address:**
- ☐ Same as physical address (checkbox)
- If different, show same fields as above

**Buttons:**
- [Primary] Next: Employment Details
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 3: EMPLOYMENT DETAILS

**Employment Information:**

1. Start Date (date picker) - REQUIRED
   - Format: DD/MM/YYYY
   - Cannot be future date
   - Auto-calculate tenure

**Tenure Display:**
- Time with FSP: [calculated]

2. Employment Type (radio) - REQUIRED
   - ⭕ Full-Time Employee
   - ⭕ Part-Time Employee
   - ⭕ Independent Contractor
   - ⭕ Tied Agent
   - ⭕ Temporary/Probation

3. Employment Status (radio) - REQUIRED
   - ⭕ Active
   - ⭕ Probation (if new)
   - ⭕ Suspended (with reason)
   - ⭕ Terminated (with date)

**If Probation selected:**
- Probation End Date: (date picker)
- Probation Review Date: (date picker)
- Probation Supervisor: (dropdown)

4. Job Title (text) - REQUIRED
   - E.g., Financial Advisor, Senior Advisor, Branch Manager

5. Department (dropdown)
   - Sales & Advisory
   - Compliance
   - Operations
   - Management
   - Other

6. Office Location (dropdown) - REQUIRED
   - Cape Town - Head Office
   - Johannesburg Branch
   - Durban Branch
   - Remote/Work from Home
   - Other

7. Work Station/Desk Number (text)
   - Optional

8. Employee Number (text)
   - Internal reference
   - Auto-generated option available
   - Format: EMP-XXXX

**FSP Representative Number:**

9. FSP Representative Number - REQUIRED
   - Format: REP-[FSP#]-[XXX]
   - Auto-generated based on FSP number
   - Example: REP-12345-015
   - Unique identifier for FAIS purposes
   - [Auto-Generate] button

**Commission Structure:**

10. Commission Type (radio)
    - ⭕ Commission-Based
    - ⭕ Salary Only
    - ⭕ Salary + Commission
    - ⭕ Fee-Based

11. Commission Rate (%)
    - If applicable
    - Default rate or custom

12. Commission Split (if applicable)
    - % to Representative
    - % to FSP
    - Total must equal 100%

**Banking Details (for Commission Payments):**

13. Bank Name (dropdown)
    - ABSA
    - Standard Bank
    - FNB
    - Nedbank
    - Capitec
    - Other SA banks

14. Account Type (dropdown)
    - Current/Cheque
    - Savings

15. Account Number (text)
    - Validation: Numbers only

16. Branch Code (text)
    - 6 digits

**Contract Details:**

17. Contract Type (dropdown)
    - Permanent
    - Fixed-Term Contract
    - Temporary
    - Internship
    - Other

18. Contract Start Date (date)
    - Usually same as start date

19. Contract End Date (date)
    - If fixed-term contract

20. Upload Employment Contract (file upload)
    - Signed contract document
    - PDF, max 5MB
    - [Upload] [View] [Remove]

**Buttons:**
- [Primary] Next: Categories & Licenses
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 4: CATEGORIES & LICENSES

**FAIS Categories & Product Classes:**

**Important Notice:**
"Representative can only provide advice/services in categories for which they are qualified and the FSP is licensed."

**FSP Licensed Categories (Display Only):**
- ✅ Category I - Advice/Intermediary Services
- ✅ Category IIA - Long-term Insurance
- ✅ Category IIB - Short-term Insurance
- ✅ Category IIIA - Health Service Benefits

---

**Select Representative Categories:**

**Category I - Advice and Intermediary Services** (checkbox)
- ☐ Authorized for Category I
- If checked, show sub-categories:

**Category I Sub-categories:**
- ☐ Securities & Instruments (shares, bonds, etc.)
- ☐ Participatory Interests (unit trusts, hedge funds)
- ☐ Pension Fund Benefits
- ☐ Friendly Society Benefits
- ☐ Long-term Insurance Policies (Category A)
- ☐ Short-term Insurance Policies (Personal Lines)
- ☐ Short-term Insurance Policies (Commercial Lines)
- ☐ Health Service Benefits
- ☐ Structured Deposits
- ☐ Retail Bonds
- ☐ Forex Investment Business

**Category IIA - Long-term Insurance** (checkbox)
- ☐ Authorized for Category IIA
- If checked, show sub-classes:

**Category IIA Sub-classes:**
- ☐ Class A: Life/Disability/Severe Illness Insurance
- ☐ Class B: Fund Benefits (Retirement Annuities, etc.)
- ☐ Class C: Life Policy Funds

**Category IIB - Short-term Insurance** (checkbox)
- ☐ Authorized for Category IIB
- If checked, show sub-classes:

**Category IIB Sub-classes:**
- ☐ Personal Lines (Motor, Household, Personal Liability)
- ☐ Commercial Lines (Business Insurance, Professional Indemnity)

**Category IIIA - Health Service Benefits** (checkbox)
- ☐ Authorized for Category IIIA
- Medical aid/health insurance advice

**Category IIIB - Pension Benefit Fund Services** (checkbox)
- ☐ Authorized for Category IIIB
- Pension fund administration services

**Limitations or Restrictions:**
- Any specific limitations on representative's scope
- Textarea for details
- E.g., "May only advise on policies up to R500,000 sum assured"

**Product Authorization:**

**Approved Product Providers:**
- Select insurers/providers representative can sell:

**Long-term Insurers:**
- ☐ Old Mutual
- ☐ Sanlam
- ☐ Liberty
- ☐ Discovery Life
- ☐ Metropolitan
- ☐ Other (specify)

**Short-term Insurers:**
- ☐ Santam
- ☐ Outsurance
- ☐ Discovery Insure
- ☐ Hollard
- ☐ Other (specify)

**Investment Houses:**
- ☐ Allan Gray
- ☐ Coronation
- ☐ Investec
- ☐ Nedgroup
- ☐ Other (specify)

**Special Authorization:**

1. Discretionary FSP (DFI) Status
   - ☐ Authorized for Discretionary Financial Services
   - Requires additional qualifications

2. Hedge Fund Authorization
   - ☐ Authorized to advise on Hedge Funds
   - Requires qualification

3. Crypto Asset Authorization
   - ☐ Authorized for Crypto Asset Advice (if FSP licensed)

**License Validation:**

**Automatic Checks:**
- ✅ Representative categories subset of FSP license
- ✅ Product authorization matches FSP agreements
- ⚠️ Warning if categories require additional qualifications

**Buttons:**
- [Primary] Next: Qualifications
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 5: QUALIFICATIONS

**Educational Qualifications:**

**Highest Level of Education:**

1. Qualification Level (dropdown) - REQUIRED
   - Matric/Grade 12
   - Certificate
   - Diploma
   - Bachelor's Degree
   - Honours Degree
   - Master's Degree
   - Doctorate
   - Other

2. Field of Study (text)
   - E.g., Business, Finance, Economics

3. Institution (text)
   - University/College name

4. Year Completed (dropdown)
   - Years from 1980 to current

**FAIS-Recognized Qualifications:**

"Select all FAIS-recognized qualifications held by representative:"

**Regulatory Exam Qualifications (RE1-RE5):**

**RE1 - Regulatory Exams - Part 1** (checkbox)
- ☐ RE1 Passed
- Pass Date: (date picker)
- Certificate Upload: [Upload PDF]
- Certificate Number: (text)

**RE5 - Regulatory Exam - Part 5** (checkbox)
- ☐ RE5 Passed - REQUIRED for Category I
- Pass Date: (date picker)
- Certificate Upload: [Upload PDF]
- Certificate Number: (text)
- Expiry: None (lifetime qualification)

**Additional Regulatory Exams:**
- ☐ RE2 (Long-term Insurance)
- ☐ RE3 (Short-term Insurance - Personal)
- ☐ RE4 (Short-term Insurance - Commercial)

**For each selected:**
- Pass Date
- Certificate Upload
- Certificate Number

**Professional Designations:**

**CFP® (Certified Financial Planner):**
- ☐ CFP® Certified
- Certificate Number: (text)
- Issue Date: (date)
- Expiry Date: (date)
- Upload Certificate: [Upload]
- Annual Renewal: ☐ Current

**Other Professional Designations:**
- ☐ CFA (Chartered Financial Analyst)
- ☐ CLU (Chartered Life Underwriter)
- ☐ ChFC (Chartered Financial Consultant)
- ☐ FPI Professional
- ☐ Other (specify)

**For each designation:**
- Certificate number
- Issue/expiry dates
- Upload certificate
- Renewal status

**Industry Qualifications:**

**FAIS-Recognized Qualifications:**
- ☐ Certificate in Financial Planning (CFP Level 1)
- ☐ Higher Certificate in Financial Planning
- ☐ Advanced Diploma in Financial Planning
- ☐ Bachelor of Commerce (Finance/Economics)
- ☐ Post-Graduate Diploma in Financial Planning
- ☐ Other SAQA-registered qualification

**For each qualification:**
- Institution
- Year completed
- Certificate upload
- Qualification code (SAQA)

**Key Individual Requirements (if applicable):**

"Additional requirements for Key Individual status:"

**KI Experience:**
- ☐ Minimum 5 years industry experience - REQUIRED
- Years of Experience: (number input)
- Industry sectors: (textarea)

**KI Qualifications:**
- ☐ RE1 & RE5 (minimum) - REQUIRED
- ☐ Additional category-specific qualifications
- ☐ Management/Leadership qualification (preferred)

**Fit & Proper - Qualifications Component:**
- ☑ All required qualifications obtained
- ☑ Qualifications are current and verified
- ☑ No fraudulent qualifications detected

**Upload Qualification Documents:**

**Document Upload Area:**
- Drag & drop multiple files
- Accepted: PDF, JPG, PNG
- Max 5MB per file
- Upload all certificates, transcripts

**Documents to Upload:**
- RE5 Certificate (required)
- Other RE certificates
- Professional designation certificates
- Academic transcripts
- Training completion certificates

**Document List:**
- Each file shows: Filename, Size, Type
- [Preview] [Download] [Remove] buttons

**Validation Checks:**
- ✅ RE5 certificate uploaded (required for Cat I)
- ⚠️ Certificate for Category IIA required
- ✅ All documents legible and valid

**Buttons:**
- [Primary] Next: Fit & Proper
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 6: FIT & PROPER VERIFICATION

**FAIS Act Section 13 - Fit & Proper Requirements:**

"All representatives must meet Fit & Proper requirements under the FAIS Act. This includes qualifications (already captured), integrity, and financial soundness."

**Integrity Requirements:**

**1. Criminal Record Check**

**Has the representative ever been convicted of:**
- ☐ Fraud, theft, or dishonesty
- ☐ Money laundering
- ☐ Any financial crime
- ☐ Any crime involving violence
- ☐ Any other criminal offense

If YES to any:
- Details of Conviction: (textarea)
- Date of Conviction: (date)
- Sentence: (textarea)
- Upload Court Documents: [Upload]
- Rehabilitation Status: (textarea)

**2. Debarment Status**

**Debarment Check:**
- Run debarment check: [Check Now] button
- Status: ✅ Clear / ❌ Debarred
- Last Check Date: (auto-populated)
- Check Source: FSCA Public Register

**If Debarred:**
- Cannot proceed with registration
- Show debarment details
- Provide appeals process info

**3. Previous FSP Employment**

**Has representative worked for other FSPs?**
- ⭕ No
- ⭕ Yes (provide details)

If YES:

**Previous FSP 1:**
- FSP Name: (text)
- FSP Number: (text)
- Employment Period: From (date) To (date)
- Position: (text)
- Reason for Leaving: (dropdown + text)
  - Resigned
  - Dismissed
  - Mutual Separation
  - Restructuring
  - Other
- Reference Contact: (name, phone, email)
- ☐ Permission to contact for reference

**[Add Another FSP]** button (can add multiple)

**4. Disciplinary History**

**Has representative ever been subject to:**
- ☐ FSP internal disciplinary action
- ☐ FSCA enforcement action
- ☐ Ombudsman adverse finding
- ☐ Professional body disciplinary action
- ☐ Suspension or restriction of license

If YES to any:
- Details: (textarea)
- Date: (date)
- Outcome: (textarea)
- Upload Supporting Documents: [Upload]

**5. Insolvency/Sequestration**

**Has representative ever:**
- ☐ Been declared insolvent
- ☐ Been sequestrated
- ☐ Been subject to administration order
- ☐ Had a business liquidated

If YES:
- Details: (textarea)
- Date: (date)
- Current Status: (textarea)
- Rehabilitation Date: (date, if applicable)
- Upload Documents: [Upload]

**Financial Soundness:**

**Credit Check:**
- Credit check consent: ☑ I consent to a credit check
- [Run Credit Check] button
- Status: ⏳ Pending / ✅ Clear / ⚠️ Issues Found
- Credit Score: (display when available)
- Date Checked: (auto)

**If Credit Issues Found:**
- Details of Issues: (display from credit report)
- Explanation from Representative: (textarea)
- Remedial Actions: (textarea)
- Supporting Documents: [Upload]

**Judgment/Default History:**
- Any outstanding judgments: ⭕ No / ⭕ Yes
- Any debt review/administration: ⭕ No / ⭕ Yes

If YES:
- Details and explanations required

**Financial Disclosure:**

**Does representative have:**
- ☐ Outstanding tax obligations (SARS)
- ☐ Unpaid maintenance/child support
- ☐ Material financial obligations that may impair independence

If checked:
- Explanation required
- Remedial plan

**Professional Indemnity Insurance:**

**Is representative covered by PI insurance?**
- ⭕ Covered by FSP's policy (standard)
- ⭕ Has own PI policy
- ⭕ No coverage

If own policy:
- Insurer: (text)
- Policy Number: (text)
- Coverage Amount: R______.00
- Expiry Date: (date)
- Upload Policy Schedule: [Upload]

**Fit & Proper Declaration:**

**Representative Declaration:**
"I hereby declare that:"
- ☑ All information provided is true and accurate
- ☑ I have disclosed all material facts
- ☑ I meet the Fit & Proper requirements
- ☑ I will notify the FSP of any changes affecting my F&P status
- ☑ I understand that false declarations may result in dismissal
- ☑ I consent to ongoing monitoring and verification

**Signature:**
- Representative Name: (typed)
- Date: (auto-filled)
- Digital Signature: (if available)

**Compliance Officer Verification:**
- Reviewed by: (dropdown - compliance officer)
- Review Date: (date)
- Status: ☑ Approved / ☐ Rejected / ☐ Further Investigation
- Notes: (textarea)
- CO Signature: (typed name)

**Fit & Proper Status:**
- Overall F&P Status: ⏳ Pending / ✅ Approved / ❌ Rejected
- Valid From: (date, when approved)
- Review Date: (annual review date)
- Next Verification: (date)

**Document Uploads for F&P:**
- Police Clearance Certificate (if available)
- Credit Report (auto-attached when checked)
- Reference Letters
- Court Documents (if applicable)
- Debarment Check Results (auto-attached)
- Other Supporting Documents

**Buttons:**
- [Primary] Next: FICA Verification
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 7: FICA VERIFICATION

**Financial Intelligence Centre Act (FICA) Compliance:**

"All representatives must be verified under FICA requirements. This is separate from client FICA."

**FICA Verification Status:**
- Current Status: ⏳ Not Verified
- Will become: ✅ Verified (upon completion)

**Identity Verification:**

**1. ID/Passport Verification**
- ID Number Already Captured: 8706155800084
- ✅ Luhn algorithm validated
- Need: Physical verification

**Upload ID Document:**
- Front of ID: [Upload] (required)
- Back of ID: [Upload] (if applicable)
- Passport Bio Page: [Upload] (if passport holder)

**Acceptable Documents:**
- SA ID Book/Card (both sides)
- Valid Passport
- Temporary ID
- Asylum Seeker Permit

**Document Requirements:**
- Clear, legible image
- All corners visible
- No glare or obstruction
- PDF or high-quality JPG
- Max 2MB per file

**Verification Method:**
- ⭕ Physical ID sighted (in person)
- ⭕ Certified copy received
- ⭕ Digital verification (HANIS/DHA)
- ⭕ Video verification with ID

**Verified By:** (dropdown - compliance officer)
**Verification Date:** (date)
**Verification Notes:** (textarea)

**2. Proof of Address Verification**

**Required: Proof of address not older than 3 months**

**Upload Proof of Address:**
- [Upload Document] (required)

**Acceptable Documents:**
- Municipal rates/utility bill
- Bank statement
- Lease agreement
- Retail account statement
- Insurance policy document
- Affidavit (if living with family)

**Document Requirements:**
- Must show representative's name
- Must show residential address
- Must be dated within last 3 months
- Clear and legible

**Address from Document:**
- Auto-extract address or manual entry
- Compare to address in Step 2
- ✅ Matches / ⚠️ Mismatch

**Verification:**
- Verified By: (dropdown)
- Verification Date: (date)
- Status: ✅ Verified / ⏳ Pending / ❌ Rejected

**3. Financial Information Verification**

**Tax Verification:**
- Tax Reference Number: (text)
- Income Tax Registration: ☑ Registered
- Upload Tax Clearance: [Upload] (optional but recommended)

**4. Source of Income Verification**

**Primary Income Source:**
- ⭕ Employment by this FSP
- ⭕ Commissions from this FSP
- ⭕ Other sources (requires additional disclosure)

If other sources:
- Details of Income: (textarea)
- Supporting Documents: [Upload]

**5. PEP (Politically Exposed Person) Check**

**Is representative a PEP or related to a PEP?**
- ⭕ No
- ⭕ Yes - Representative is PEP
- ⭕ Yes - Related to PEP

**PEP Definition:**
"Prominent public official or family member/close associate of such official"

If YES:
- Nature of Position/Relationship: (textarea)
- Name of PEP: (text)
- Position/Title: (text)
- Additional Due Diligence Required: ☑

**Enhanced Due Diligence (if PEP):**
- Source of Wealth Declaration: [Upload]
- Additional References: [Upload]
- Compliance Officer Approval: Required

**6. Sanctions Screening**

**Check against sanctions lists:**
- [Run Sanctions Check] button
- Status: ⏳ Pending / ✅ Clear / ❌ Match Found
- Lists Checked:
  - UN Sanctions List
  - EU Sanctions List
  - OFAC (US) List
  - Local/FIC Lists

**Result:**
- ✅ No matches found / ❌ Match found
- Date Checked: (auto)
- Checked By: System
- Next Check: (6 months from now)

**7. Adverse Media Check**

**Check for negative news/media:**
- [Run Media Check] button
- Status: ⏳ Pending / ✅ Clear / ⚠️ Items Found
- Date Checked: (auto)

If items found:
- Summary: (auto-populated)
- Compliance Officer Review Required

**FICA Documentation Summary:**

**Documents Uploaded:**
- ✅ ID Document (front)
- ✅ ID Document (back)
- ✅ Proof of Address (utility bill)
- ☐ Tax Clearance (optional)
- ☐ Additional documents

**Verification Checklist:**
- ✅ Identity verified
- ✅ Address verified
- ✅ No debarment
- ✅ No sanctions match
- ✅ No adverse media
- ☐ PEP check (if applicable)
- ✅ All documents uploaded and verified

**FICA Risk Rating:**
- Risk Level: ⚪ Low / ⚪ Medium / ⚪ High
- Based on: PEP status, source of income, verification results
- Review Frequency: Annual / 6-Monthly / Quarterly

**Compliance Officer Sign-Off:**

**FICA Verification Complete:**
- Verified By: (dropdown - compliance officer)
- Verification Date: (date)
- Status: ✅ FICA Compliant
- Valid Until: (date - 5 years)
- Next Review: (date - annually)

**Notes:** (textarea for any special notes)

**Buttons:**
- [Primary] Next: Supervision & Access
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 8: SUPERVISION & ACCESS

**Supervision Structure:**

**Supervisory Requirements:**

"Under FAIS Act, all representatives must be supervised by a Key Individual (KI) appropriate to their license categories."

**1. Assign Supervisor (Key Individual)**

**Select Supervisor:** (dropdown) - REQUIRED
- Johan Smit (KI) - Categories I, IIA, IIB, IIIA
- Sarah Naidoo (KI) - Categories I, IIA
- Direct to FSP Owner/Principal
- Other KI (if applicable)

**Supervisor Details (auto-populated when selected):**
- Name: Johan Smit
- FSP Number: REP-12345-KI1
- Categories: I, IIA, IIB, IIIA
- Current Supervisees: 6 representatives
- Status: ✅ Active and compliant

**Supervision Plan:**
- Review Frequency: (dropdown)
  - Weekly
  - Bi-weekly
  - Monthly (standard)
  - Quarterly
  - As needed

- Review Method: (checkboxes)
  - ☑ File Reviews
  - ☑ Client Interaction Monitoring
  - ☑ Performance Reviews
  - ☑ Compliance Checks
  - ☑ Training/Coaching Sessions

**First Supervision Meeting:**
- Schedule Date: (date picker)
- Time: (time picker)
- Location: (dropdown - office locations or "Virtual")

**2. Probation Period (if applicable)**

**Is representative on probation?**
- ⭕ No
- ⭕ Yes

If YES:
- Probation Duration: (dropdown - 3/6/12 months)
- Probation Start: (date - usually start date)
- Probation End: (auto-calculated)
- Additional Supervision: ☑ Enhanced monitoring required
- Probation Review Dates: (multiple dates)

**Probation Requirements:**
- Weekly supervision meetings
- Enhanced file reviews
- Client feedback collection
- Performance assessments
- Training completion

**System Access:**

**3. User Account Setup**

**Login Credentials:**
- Username: (auto-generated from email)
  - Example: sarah.naidoo@customapp.co.za
- Temporary Password: (auto-generated)
  - Will be sent via email
  - Must change on first login
- Two-Factor Authentication: ☑ Required

**4. Access Level/Role** (radio) - REQUIRED

**Select Role:**
- ⭕ Representative (Standard)
  - Access own clients, policies, commission
  - Limited system access
  - Cannot access other reps' data

- ⭕ Key Individual
  - Access supervised reps' data
  - Team management functions
  - Compliance oversight
  - Reporting access

- ⭕ Compliance Officer
  - Full compliance module access
  - All representatives' data
  - Verification authority
  - Reporting access

- ⭕ Admin Staff
  - Administrative functions
  - View-only access to most areas
  - No financial data access

**Role Permissions Summary (auto-displayed based on selection):**

**Representative Access:**
- ✅ Own client list
- ✅ Own policies
- ✅ Own commission statements
- ✅ Own CPD records
- ✅ Own Fit & Proper status
- ✅ Document upload (own files)
- ❌ Other representatives' data
- ❌ Financial reports
- ❌ Compliance verification

**5. Module Access**

**Grant access to modules:** (checkboxes)
- ☑ Dashboard (always on)
- ☑ Clients Management
- ☑ Policies
- ☑ Commission Tracking
- ☑ CPD Management (own)
- ☑ Fit & Proper (own records)
- ☑ FICA (own clients)
- ☑ Document Management (own docs)
- ☐ Complaints (view only, if complaints handler)
- ☐ Representatives (if KI/Compliance Officer)
- ☐ Reports (limited access)

**6. Additional Permissions**

**Specific Permissions:** (checkboxes)
- ☑ View own commission
- ☐ View team commission (if KI)
- ☑ Download own reports
- ☐ Generate team reports (if KI)
- ☑ Submit CPD activities
- ☐ Approve CPD activities (if KI/CO)
- ☑ Upload client documents
- ☐ Delete documents (with approval)
- ☑ View client policies
- ☐ Initiate new policies (requires approval)
- ☐ Access financial analytics
- ☐ Manage users (admin only)

**7. Email Notifications**

**Configure email alerts:** (checkboxes)
- ☑ Daily activity summary
- ☑ Client inquiries/messages
- ☑ Policy updates
- ☑ Commission statements
- ☑ CPD deadline reminders
- ☑ Compliance alerts
- ☑ System announcements
- ☑ Training opportunities
- ☐ Weekly digest (optional)

**8. Mobile App Access**

**Grant mobile app access:**
- ☑ Enable mobile app login
- Devices: Smartphone & Tablet
- Features:
  - ☑ Client contact info
  - ☑ Policy lookup
  - ☑ Document upload
  - ☑ Commission view
  - ☐ Offline mode

**Device Registration:**
- Device will be registered on first login
- Maximum 2 devices per user
- Can be managed in user settings

**9. Initial Training Requirements**

**Onboarding Training:** (checkboxes)
- ☑ System orientation (required)
- ☑ Compliance training (required)
- ☑ TCF principles (required)
- ☑ Product training (required)
- ☑ Sales process training
- ☑ FICA procedures
- ☑ Complaints handling

**Training Schedule:**
- Orientation Date: (date picker)
- Trainer: (dropdown)
- Location: (text/dropdown)
- Estimated Duration: 2 days

**Training Completion Deadline:**
- Must complete within: 30 days of start date
- Track in CPD system

**10. Equipment & Resources**

**IT Equipment Issued:** (checkboxes)
- ☐ Laptop (Asset #: _____)
- ☐ Desktop (Asset #: _____)
- ☐ Mobile Phone (Number: _____)
- ☐ Tablet (Asset #: _____)
- ☐ Access Card/Key (Number: _____)

**Software Licenses:**
- ☑ Microsoft Office 365
- ☑ CRM Access
- ☑ Compliance Portal (this system)
- ☐ Financial Planning Software
- ☐ Other: _____

**Marketing Materials:**
- ☑ Business cards (order quantity: 500)
- ☑ Email signature template
- ☑ Letterhead template
- ☑ Marketing collateral access

**Buttons:**
- [Primary] Next: Review & Submit
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 9: REVIEW & SUBMIT

**Comprehensive Registration Summary:**

**Section 1: Personal Information**
- Name: Sarah Naidoo
- ID Number: 8706155800084
- Date of Birth: 15/06/1987 (37 years)
- Gender: Female
- Nationality: South African
- Photo: [thumbnail]
- [Edit] button

**Section 2: Contact Details**
- Email: sarah.naidoo@customapp.co.za
- Mobile: +27 82 345 6789
- Address: 45 Beach Road, Camps Bay, Cape Town, 8005
- Emergency Contact: John Naidoo (+27 83 234 5678) - Spouse
- [Edit] button

**Section 3: Employment**
- Start Date: 15/03/2018
- Employment Type: Full-Time Employee
- Status: Active
- Job Title: Senior Financial Advisor & Compliance Officer
- Office: Cape Town - Head Office
- FSP Rep Number: REP-12345-001
- Commission: Salary + Commission (40%)
- [Edit] button

**Section 4: Categories & Licenses**
- Category I: ✅ Advice & Intermediary
- Category IIA: ✅ Long-term Insurance (Classes A, B)
- Authorized Products: Old Mutual, Sanlam, Liberty
- Special Authorization: None
- [Edit] button

**Section 5: Qualifications**
- Highest Education: Bachelor of Commerce (Finance)
- RE5: ✅ Passed (Certificate #: RE5-123456)
- RE2: ✅ Passed (Long-term Insurance)
- Professional: CFP® Certified
- Documents: 5 certificates uploaded
- [Edit] button

**Section 6: Fit & Proper**
- Criminal Record: ✅ Clear
- Debarment Status: ✅ Clear
- Credit Check: ✅ Passed (Score: 685)
- Previous FSPs: 1 (Good standing)
- Disciplinary History: None
- Overall F&P Status: ✅ Approved
- Valid Until: 15/03/2025
- [Edit] button

**Section 7: FICA Verification**
- Identity: ✅ Verified (ID sighted)
- Address: ✅ Verified (Utility bill - Nov 2024)
- PEP Status: ✅ Not PEP
- Sanctions: ✅ Clear
- Risk Rating: Low Risk
- FICA Status: ✅ Compliant
- Valid Until: 15/03/2029 (5 years)
- [Edit] button

**Section 8: Supervision & Access**
- Supervisor: Johan Smit (KI)
- Review Frequency: Monthly
- Probation: No
- Role: Representative (Standard)
- System Access: ✅ Configured
- Training: Scheduled 20/03/2018
- [Edit] button

**Registration Checklist:**
- ✅ All personal information complete
- ✅ Contact details verified
- ✅ Employment contract signed
- ✅ FSP number assigned
- ✅ Categories authorized and match qualifications
- ✅ All required qualifications verified
- ✅ Fit & Proper approved
- ✅ FICA compliant
- ✅ Supervisor assigned
- ✅ System access configured
- ✅ Training scheduled

**Compliance Verification:**
- Verified By: David Anderson (FSP Owner)
- Verification Date: 15/03/2018
- Status: ✅ All requirements met
- Representative is authorized to commence duties

**Final Declarations:**

**FSP Owner/Principal Declaration:**
"I declare that I have verified all information provided and confirm that this representative meets all FAIS Act requirements."
- Name: David Anderson
- Position: FSP Owner/Principal
- Date: 15/03/2018
- Signature: (typed name or digital signature)

**Representative Declaration:**
"I declare that all information provided is true and accurate, and I agree to comply with all FSP policies, FAIS Act requirements, and ethical standards."
- Name: Sarah Naidoo
- Date: 15/03/2018
- Signature: (typed name or digital signature)

**Post-Registration Actions:**

**Automatic Actions on Submission:**
- ☑ Create user account
- ☑ Send welcome email with login details
- ☑ Add to representative register
- ☑ Notify supervisor
- ☑ Create CPD tracking record
- ☑ Schedule training sessions
- ☑ Add to debarment monitoring
- ☑ Set up commission tracking
- ☑ Generate ID card/badge
- ☑ Add to org chart
- ☑ Create audit trail

**Manual Actions Required:**
- Order business cards
- Set up workstation
- Schedule orientation
- Assign initial clients (if any)
- Add to team communications

**Buttons:**
- [Primary - Large] Submit Registration
- [Secondary] Save as Draft
- [Secondary] Print Summary
- [Link] Back to Edit
- [Link] Cancel

**After Submission:**

**Success Modal:**
- ✅ Representative Registered Successfully
- FSP Number: REP-12345-001
- Name: Sarah Naidoo
- Status: Active
- System Access: Enabled
- Welcome email sent to: sarah.naidoo@customapp.co.za

**Next Steps:**
1. Representative will receive welcome email with login details
2. First supervision meeting: 22/03/2018
3. Training orientation: 20/03/2018
4. System access: Immediate

**Actions:**
- [View Representative Profile]
- [Send Welcome Message]
- [Print ID Badge]
- [Register Another Representative]
- [Return to Dashboard]

---

## 4. REPRESENTATIVE PROFILE VIEW (Full Detail Page)

**Opens when clicking on a representative:**

### Header Section
- Large Profile Photo (150px circular)
- Full Name: Sarah Naidoo
- Job Title: Senior Financial Advisor & Compliance Officer
- Status Badge: ✅ ACTIVE (green)
- Compliance Badge: ✅ FULLY COMPLIANT (green)
- FSP Number: REP-12345-001
- Quick Actions Dropdown (⋯):
  - Send Email
  - Schedule Meeting
  - View Calendar
  - Generate Report
  - Edit Profile
  - Suspend/Terminate
  - More options

### Key Metrics Bar (Horizontal Cards)

**Card 1: Tenure**
- Icon: Calendar
- Value: 6.8 years
- Start Date: 15/03/2018

**Card 2: Clients**
- Icon: Users
- Value: 127 active
- Growth: ↑ 12 this year

**Card 3: Compliance**
- Icon: Shield-check
- Value: 100%
- Status: All current

**Card 4: Performance**
- Icon: Star
- Value: 4.8/5.0
- Client Satisfaction

**Card 5: CPD**
- Icon: Book
- Value: 32/30 hours
- Status: 107% complete

### Tabs in Profile View

**Tab 1: Overview**

**Personal Information Card:**
- **Full Name:** Sarah Naidoo
- **Preferred Name:** Sarah
- **Date of Birth:** 15/06/1987 (37 years)
- **Gender:** Female
- **ID Number:** 8706155800084
- **Nationality:** South African
- **Home Language:** English
- **Other Languages:** Afrikaans, isiXhosa

**Contact Information Card:**
- **Primary Email:** sarah.naidoo@customapp.co.za
- **Alternative Email:** s.naidoo@gmail.com
- **Mobile:** +27 82 345 6789
- **WhatsApp:** Same as mobile
- **Emergency Contact:** John Naidoo (Spouse) - +27 83 234 5678

**Physical Address:**
- 45 Beach Road
- Camps Bay
- Cape Town, Western Cape, 8005
- South Africa

**Postal Address:**
- Same as physical

**Employment Details Card:**
- **Start Date:** 15/03/2018
- **Tenure:** 6 years, 9 months
- **Employment Type:** Full-Time Employee
- **Status:** Active
- **Job Title:** Senior Financial Advisor & Compliance Officer
- **Department:** Sales & Advisory, Compliance
- **Office Location:** Cape Town - Head Office
- **Employee Number:** EMP-0001
- **FSP Rep Number:** REP-12345-001

**Commission Structure:**
- **Type:** Salary + Commission
- **Commission Rate:** 40% of premiums
- **Commission Split:** 60% FSP / 40% Representative

**Banking Details:**
- **Bank:** Standard Bank
- **Account Type:** Current
- **Account Number:** *****4567
- **Branch Code:** 051001

**Supervision Card:**
- **Supervisor:** Johan Smit (Key Individual)
- **Review Frequency:** Monthly
- **Last Review:** 15/11/2024
- **Next Review:** 15/12/2024
- **Supervision Status:** ✅ Up to date
- [View Supervision History]

**Categories & Authorization Card:**

**Licensed Categories:**
- ✅ Category I - Advice & Intermediary Services
  - Securities & Instruments
  - Participatory Interests
  - Long-term Insurance Policies
  - Short-term Insurance (Personal)
- ✅ Category IIA - Long-term Insurance
  - Class A: Life/Disability/Severe Illness
  - Class B: Fund Benefits

**Authorized Product Providers:**
- Old Mutual, Sanlam, Liberty (Long-term)
- Allan Gray, Coronation (Investments)

**Special Authorizations:**
- None

**Quick Statistics:**
- Active Policies: 387
- Total Premium Under Management: R4,250,000/annum
- YTD Commission: R185,000
- Average Policy Value: R11,000

---

**Tab 2: Qualifications & Fit & Proper**

**Educational Background:**

**Highest Qualification:**
- Qualification: Bachelor of Commerce (Finance)
- Institution: University of Cape Town
- Year Completed: 2010
- Field: Finance & Economics

**FAIS Regulatory Exams:**

**RE5 - Regulatory Exam Part 5:**
- Status: ✅ Passed
- Pass Date: 15/09/2015
- Certificate Number: RE5-123456
- Institution: Moonstone
- Certificate: [View PDF] [Download]

**RE2 - Long-term Insurance:**
- Status: ✅ Passed
- Pass Date: 20/10/2015
- Certificate Number: RE2-123457
- Certificate: [View PDF]

**Professional Designations:**

**CFP® (Certified Financial Planner):**
- Status: ✅ Current
- Certificate Number: CFP-SA-12345
- Issue Date: 01/03/2018
- Expiry Date: 28/02/2025
- Issuing Body: Financial Planning Institute of SA
- Annual Renewal: ✅ Current (renewed Oct 2024)
- Certificate: [View PDF]

**Industry Qualifications:**
- Higher Certificate in Financial Planning - 2014
- Advanced Diploma in Financial Planning - 2016

**Fit & Proper Status:**

**Current F&P Status: ✅ APPROVED & CURRENT**
- Valid From: 15/03/2024
- Valid Until: 15/03/2025
- Next Verification: 15/03/2025
- Annual Review: ✅ Up to date

**Fit & Proper Components:**

**1. Qualifications:**
- ✅ All required qualifications current
- ✅ RE5 valid
- ✅ Category-specific qualifications verified
- ✅ Professional designation current

**2. Integrity:**
- ✅ No criminal record
- ✅ No debarment
- ✅ No disciplinary actions
- ✅ No Ombudsman adverse findings
- ✅ Good standing with previous FSPs

**3. Financial Soundness:**
- ✅ Credit check passed
- Credit Score: 685 (Good)
- ✅ No insolvency/sequestration
- ✅ No judgments or defaults
- ✅ No SARS obligations
- Last Credit Check: 01/10/2024
- Next Credit Check: 01/10/2025

**Debarment Status:**
- Status: ✅ Clear
- Last Check: 01/12/2024
- Next Check: 01/01/2025 (monthly)
- Source: FSCA Public Register
- [View Debarment Certificate]

**Verification History:**

**Annual Verifications:**
- 2024: ✅ Verified (15/03/2024) - All clear
- 2023: ✅ Verified (15/03/2023) - All clear
- 2022: ✅ Verified (15/03/2022) - All clear
- 2021: ✅ Verified (15/03/2021) - All clear
- 2020: ✅ Verified (15/03/2020) - All clear

**Documents:**
- RE5 Certificate.pdf
- RE2 Certificate.pdf
- CFP Certificate.pdf
- Police Clearance (2024).pdf
- Credit Report (Oct 2024).pdf
- Debarment Check (Dec 2024).pdf
- UCT Degree Certificate.pdf

---

**Tab 3: CPD (Continuous Professional Development)**

**CPD Summary Card:**

**Current CPD Year: 2024/2025**
- Period: 01/06/2024 - 31/05/2025
- Deadline: 31/05/2025
- Days Remaining: 167 days

**Progress:**
- Total Required: 30 hours
- Total Completed: 32 hours
- Status: ✅ COMPLIANT (107%)
- Last Activity: 05/12/2024

**Breakdown:**
- General CPD: 22 hours (of 20 required) ✅
- Specific/Technical: 10 hours (of 10 required) ✅

**Progress Bars:**
- Visual progress bars showing completion
- Green when complete, blue when in progress

**CPD Activities Log:**

**Table of Activities:**

| Date | Activity | Provider | Category | Hours | Status | Certificate |
|------|----------|----------|----------|-------|--------|-------------|
| 05/12/2024 | FAIS Compliance Update 2024 | Moonstone | General | 5 | ✅ Verified | [View] |
| 15/11/2024 | Investment Products Masterclass | FPI | Specific | 6 | ✅ Verified | [View] |
| 20/10/2024 | Ethics in Financial Services | FSCA | General | 3 | ✅ Verified | [View] |
| 05/09/2024 | Long-term Insurance Updates | Old Mutual | Specific | 4 | ✅ Verified | [View] |
| 12/08/2024 | TCF Workshop | FPI | General | 4 | ✅ Verified | [View] |
| 10/07/2024 | Tax Planning 2024/25 | SAIT | Specific | 5 | ✅ Verified | [View] |
| 15/06/2024 | Risk Management | Sanlam | General | 5 | ✅ Verified | [View] |

**Actions:**
- [Log New CPD Activity]
- [Upload Certificate]
- [View CPD History]
- [Export CPD Report]

**CPD History (Previous Years):**
- 2023/2024: 30 hours ✅ Compliant
- 2022/2023: 32 hours ✅ Compliant
- 2021/2022: 30 hours ✅ Compliant
- 2020/2021: 28 hours ⚠️ Short (exemption granted - COVID)
- [View All History]

**CPD Plan (Upcoming):**
- No additional activities required (already exceeded)
- Recommended: Continue professional development
- Next suggested: Advanced estate planning course

---

**Tab 4: FICA & Compliance**

**FICA Verification Status:**

**Current FICA Status: ✅ VERIFIED & COMPLIANT**
- Initial Verification: 15/03/2018
- Last Review: 01/10/2024
- Valid Until: 15/03/2029 (5 years from initial)
- Next Review: 01/10/2025 (annual)

**Identity Verification:**
- ID Number: 8706155800084
- Verification Method: Physical ID sighted
- Verified By: David Anderson (FSP Owner)
- Verification Date: 15/03/2018
- Status: ✅ Verified
- Documents: ID_Front.pdf, ID_Back.pdf

**Address Verification:**
- Current Address: 45 Beach Road, Camps Bay, Cape Town, 8005
- Verification Method: Utility bill
- Verified By: David Anderson
- Verification Date: 01/10/2024
- Document Date: September 2024
- Status: ✅ Verified (current)
- Document: Utility_Bill_Sep2024.pdf

**Financial Information:**
- Tax Number: *****8084
- Tax Status: ✅ Registered
- Source of Income: FSP Employment & Commissions
- Status: ✅ Verified

**PEP Status:**
- PEP Classification: ✅ Not a PEP
- Related to PEP: No
- Last Check: 01/10/2024
- Next Check: 01/10/2025

**Sanctions Screening:**
- Status: ✅ Clear - No matches
- Lists Checked: UN, EU, OFAC, FIC
- Last Check: 01/12/2024
- Next Check: 01/01/2025 (monthly)

**Adverse Media:**
- Status: ✅ Clear - No adverse media
- Last Check: 01/10/2024
- Next Check: 01/10/2025

**FICA Risk Rating:**
- Risk Level: 🟢 Low Risk
- Based on: Standard employment, no PEP, clear checks
- Review Frequency: Annual
- Enhanced Due Diligence: Not required

**FICA Documents:**
- SA ID Card (Front).pdf - 15/03/2018
- SA ID Card (Back).pdf - 15/03/2018
- Proof of Address (Utility Bill).pdf - 01/10/2024
- Tax Certificate.pdf - 15/03/2018

**Compliance Overview:**

**Compliance Checklist:**
- ✅ Fit & Proper: Current (expires 15/03/2025)
- ✅ CPD: Compliant (32/30 hours)
- ✅ FICA: Verified (expires 15/03/2029)
- ✅ Debarment: Clear (checked 01/12/2024)
- ✅ PI Insurance: Covered (FSP policy)
- ✅ Supervision: Up to date
- ✅ Training: Current

**Overall Compliance Status: ✅ FULLY COMPLIANT**

**Compliance Alerts:**
- No current compliance issues ✅
- No upcoming deadlines in next 30 days ✅

**Compliance History:**
- Never been non-compliant
- 100% compliance record since joining
- All annual reviews completed on time

---

**Tab 5: Performance & Clients**

**Performance Summary:**

**Client Satisfaction:**
- Overall Rating: 4.8/5.0 ⭐⭐⭐⭐⭐
- Based on: 45 client reviews (last 12 months)
- 5 stars: 35 clients (78%)
- 4 stars: 8 clients (18%)
- 3 stars: 2 clients (4%)
- 2 stars: 0 clients (0%)
- 1 star: 0 clients (0%)

**Client Base:**
- Active Clients: 127
- New Clients (YTD): 12
- Clients Lost: 3 (moved away, competitor)
- Client Retention: 98%

**Sales Performance (YTD 2024):**

**Policies Sold:**
- Total Policies: 45
- Life Insurance: 18
- Retirement Annuities: 12
- Investment Products: 10
- Short-term Insurance: 5

**Premium Under Management:**
- Total Annual Premium: R4,250,000
- Average Policy Premium: R9,444/month
- Growth YTD: ↑ 15%

**Commission Earned:**
- YTD Commission: R185,000
- Average per Month: R15,417
- Growth vs Last Year: ↑ 12%

**Top Products Sold:**
1. Old Mutual Life Cover - 8 policies
2. Sanlam RA - 7 policies
3. Allan Gray Unit Trusts - 6 policies
4. Liberty Disability Cover - 5 policies

**Performance Charts:**

**Chart 1: Monthly Sales Trend**
- Line chart showing policies sold per month
- Shows seasonal patterns
- Comparison to previous year

**Chart 2: Client Growth**
- Bar chart showing new clients vs. lost clients
- Net growth trend

**Chart 3: Product Mix**
- Donut chart showing breakdown by product type

**Client Testimonials:**

**Recent Reviews:**

**Review 1:**
- Client: Mary Johnson
- Date: 05/12/2024
- Rating: 5/5 ⭐⭐⭐⭐⭐
- Comment: "Sarah is exceptional! She explained everything clearly and found the perfect policy for our family. Highly recommend!"

**Review 2:**
- Client: Thabo Mokoena
- Date: 20/11/2024
- Rating: 5/5 ⭐⭐⭐⭐⭐
- Comment: "Very professional and knowledgeable. Always responds quickly to my questions."

**Review 3:**
- Client: Johan van Zyl
- Date: 10/11/2024
- Rating: 4/5 ⭐⭐⭐⭐
- Comment: "Good service, helped me with retirement planning."

**Complaints:**
- Total Complaints (All-Time): 0
- Current Complaints: 0
- Resolved Complaints: 0
- Status: ✅ Excellent record

**Awards & Recognition:**
- Top Performer Q3 2024
- Highest Client Satisfaction 2023
- Best New Business 2022

**Client Distribution:**

**By Age Group:**
- 18-30: 15 clients (12%)
- 31-45: 48 clients (38%)
- 46-60: 42 clients (33%)
- 61+: 22 clients (17%)

**By Product:**
- Life Insurance: 65 clients
- Investments: 42 clients
- Short-term: 35 clients
- Multiple Products: 25 clients

**By Location:**
- Cape Town: 95 clients (75%)
- Stellenbosch: 18 clients (14%)
- Paarl: 10 clients (8%)
- Other: 4 clients (3%)

---

**Tab 6: Commission & Financials**

**Commission Summary (YTD 2024):**

**Overall Commission:**
- Total Earned: R185,000
- Monthly Average: R15,417
- Growth vs 2023: ↑ 12%
- Status: ✅ Above target (R180,000)

**Commission Breakdown:**

**By Product Type:**
- Life Insurance: R78,000 (42%)
- Retirement Annuities: R52,000 (28%)
- Investments: R35,000 (19%)
- Short-term Insurance: R20,000 (11%)

**Commission Type:**
- Initial/Upfront: R95,000 (51%)
- Renewal/Trail: R70,000 (38%)
- Performance Bonus: R20,000 (11%)

**Monthly Commission Table:**

| Month | Policies Sold | Commission Earned | Renewals | Total | Status |
|-------|---------------|-------------------|----------|-------|--------|
| Dec 2024 | 4 | R12,000 | R6,500 | R18,500 | ⏳ Processing |
| Nov 2024 | 5 | R15,000 | R6,200 | R21,200 | ✅ Paid |
| Oct 2024 | 3 | R9,500 | R6,000 | R15,500 | ✅ Paid |
| Sep 2024 | 4 | R13,000 | R5,800 | R18,800 | ✅ Paid |
| Aug 2024 | 3 | R8,500 | R5,500 | R14,000 | ✅ Paid |
| Jul 2024 | 4 | R14,500 | R5,300 | R19,800 | ✅ Paid |
| Jun 2024 | 3 | R10,000 | R5,100 | R15,100 | ✅ Paid |
| May 2024 | 5 | R16,000 | R4,900 | R20,900 | ✅ Paid |
| Apr 2024 | 4 | R12,500 | R4,800 | R17,300 | ✅ Paid |
| Mar 2024 | 3 | R9,000 | R4,500 | R13,500 | ✅ Paid |
| Feb 2024 | 4 | R11,000 | R4,300 | R15,300 | ✅ Paid |
| Jan 2024 | 3 | R9,000 | R4,000 | R13,000 | ✅ Paid |

**Commission Charts:**

**Chart 1: Commission Trend**
- Line chart showing monthly commission over time
- Comparison to previous year
- Target line

**Chart 2: Commission by Product**
- Stacked bar chart showing product mix each month

**Pending Commission:**
- December 2024: R18,500 (processing)
- Expected Payment: 15/01/2025
- Status: ⏳ Awaiting insurer confirmation

**Clawbacks/Adjustments:**
- YTD Clawbacks: R2,500 (policy cancelled)
- Adjustments: -R500 (premium adjustment)
- Net Impact: -R3,000

**Tax Information:**
- Tax Withholding: 25% (PAYE)
- YTD Tax Withheld: R46,250
- IRP5 Available: February each year

**Banking Details:**
- Bank: Standard Bank
- Account: *****4567
- Payment Day: 15th of each month

**Commission Statements:**
- December 2024: [Download PDF]
- November 2024: [Download PDF]
- October 2024: [Download PDF]
- [View All Statements]

---

**Tab 7: Training & Development**

**Training Summary:**

**Onboarding Training:**
- Completed: 20/03/2018
- Duration: 2 days
- Topics: System orientation, compliance, products, sales process
- Status: ✅ Complete

**Mandatory Training (Annual):**

**2024 Training:**
- Compliance Update: ✅ Complete (Jan 2024)
- TCF Refresher: ✅ Complete (Feb 2024)
- FICA Update: ✅ Complete (Mar 2024)
- Product Knowledge: ✅ Complete (Apr 2024)

**Product Training:**

**Completed Courses:**
- Old Mutual Life Products - Advanced (Jun 2024)
- Sanlam Retirement Solutions (Aug 2024)
- Allan Gray Investment Philosophy (Sep 2024)
- Liberty Disability Cover Specialist (Nov 2024)

**Compliance Training:**
- FAIS Act Deep Dive (Jan 2024)
- Anti-Money Laundering (Feb 2024)
- Data Protection (POPIA) (Mar 2024)
- Treating Customers Fairly (Apr 2024)

**Sales & Soft Skills:**
- Advanced Needs Analysis (May 2024)
- Client Communication Excellence (Jul 2024)
- Objection Handling (Sep 2024)
- Closing Techniques (Oct 2024)

**Leadership Development (as Compliance Officer):**
- Team Supervision Skills (Jun 2024)
- Compliance Officer Workshop (Aug 2024)
- Leadership Essentials (Nov 2024)

**Training Calendar (Upcoming):**
- Jan 2025: 2025 Compliance Update (mandatory)
- Feb 2025: New Product Launch Training
- Mar 2025: Advanced Estate Planning
- Apr 2025: Investment Markets Outlook

**Certifications Earned:**
- Old Mutual Accredited Advisor (2022)
- Sanlam Reality Coach (2023)
- Liberty Protection Specialist (2024)

**Training Hours:**
- Total Training Hours (All-Time): 485 hours
- Average per Year: 72 hours
- Above Industry Average: ✅

**Coaching & Mentoring:**
- Currently Mentoring: 2 new representatives
- Mentorship Program: ✅ Active
- Coaching Sessions Completed: 24 (this year)

**Performance Coaching:**
- Last Coaching Session: 01/12/2024
- Coach: Johan Smit (KI)
- Focus Areas: Leadership development, compliance management
- Next Session: 15/01/2025

**Training Feedback:**
- Average Course Rating: 4.7/5.0
- Completion Rate: 100%
- Assessment Pass Rate: 100%

---

**Tab 8: Supervision & Reviews**

**Supervision Details:**

**Current Supervisor:**
- Name: Johan Smit
- Position: Key Individual
- FSP Number: REP-12345-KI1
- Contact: johan.smit@customapp.co.za
- Direct Line: +27 82 234 5678

**Supervision Schedule:**
- Frequency: Monthly
- Review Type: File reviews, performance discussions, compliance checks
- Standard Meeting Time: 3rd Monday of each month, 10:00 AM

**Supervision Reviews (Last 12 Months):**

**Review 1 (Most Recent):**
- Date: 15/11/2024
- Duration: 45 minutes
- Type: Monthly Supervision Meeting

**Areas Reviewed:**
- Client file quality: ✅ Excellent
- Compliance with processes: ✅ Excellent
- Client communication: ✅ Excellent
- Policy documentation: ✅ Excellent
- CPD progress: ✅ On track
- Performance targets: ✅ Exceeded

**Discussion Points:**
- Reviewed Q4 performance - exceeding targets
- Discussed role expansion as Compliance Officer
- Planned 2025 goals and development

**Action Items:**
- Continue current excellent performance
- Lead compliance training for new reps in January
- Consider CFP renewal in Q1

**Supervisor Comments:**
"Sarah continues to demonstrate exceptional performance and compliance. Her dual role as advisor and compliance officer adds tremendous value. Recommend for promotion/recognition."

**Representative Comments:**
"Thank you for the feedback and support. Looking forward to leading the compliance training."

**Status:** ✅ Satisfactory
**Next Review:** 15/12/2024

---

**Review 2:**
- Date: 15/10/2024
- Summary: All areas satisfactory, strong client relationships noted
- Status: ✅ Satisfactory

**Review 3:**
- Date: 15/09/2024
- Summary: Excellent performance, compliance perfect
- Status: ✅ Satisfactory

**[View All Reviews]**

**Supervision Statistics:**
- Total Reviews Conducted: 81 (since joining)
- Satisfactory Reviews: 81 (100%)
- Issues Identified: 0
- Action Items Completed: 100%

**File Reviews:**

**Random File Audits:**
- Frequency: Quarterly
- Last Audit: 01/11/2024
- Files Reviewed: 10 client files
- Findings: All compliant ✅
- Score: 98/100 (Excellent)

**Areas Evaluated:**
- Needs Analysis documentation: 10/10 ✅
- Product suitability: 10/10 ✅
- FICA compliance: 10/10 ✅
- Client communication records: 9/10 ✅
- Policy documentation: 10/10 ✅

**Minor Observations:**
- One file missing dated signature on needs analysis (corrected)

**Performance Reviews:**

**Annual Performance Review 2024:**
- Review Date: 15/03/2024
- Reviewer: Johan Smit (KI) & David Anderson (FSP Owner)
- Overall Rating: 5/5 Outstanding

**Performance Areas:**

**1. Sales Performance: 5/5**
- Exceeded targets by 15%
- Strong new business growth
- Excellent client retention

**2. Client Service: 5/5**
- Client satisfaction: 4.8/5.0
- Zero complaints
- Consistently positive feedback

**3. Compliance: 5/5**
- 100% compliant in all areas
- Proactive compliance management
- Zero issues identified

**4. Teamwork: 5/5**
- Excellent collaboration
- Mentoring new representatives
- Compliance officer role

**5. Professional Development: 5/5**
- CPD exceeded requirements
- Continuous learning
- CFP maintained

**Key Achievements 2024:**
- Top performer Q3
- Zero complaints maintained
- Compliance officer role expansion
- Mentored 2 new reps successfully

**Development Areas:**
- Continue leadership development
- Consider branch management opportunity
- Explore specialist designation (estate planning)

**2025 Goals:**
- Maintain excellent performance
- Lead compliance for team
- Achieve R200,000+ commission
- Complete advanced estate planning course

**Salary Review:**
- Current Salary: (confidential)
- Increase: 8% merit increase awarded
- Bonus: R25,000 performance bonus
- Effective: 01/04/2024

**Historical Performance Ratings:**
- 2024: 5/5 Outstanding
- 2023: 5/5 Outstanding
- 2022: 4/5 Exceeds Expectations
- 2021: 4/5 Exceeds Expectations
- 2020: 4/5 Exceeds Expectations
- 2019: 3/5 Meets Expectations

**Disciplinary History:**
- No disciplinary actions ever recorded ✅
- Clean record throughout employment

---

**Tab 9: Documents**

**Document Library:**

**Categories:**
- Personal Documents (8)
- Qualification Certificates (7)
- Fit & Proper Documents (5)
- FICA Documents (4)
- Employment Contracts (3)
- Compliance Records (12)
- Training Certificates (15)
- Commission Statements (12)
- Supervision Records (24)
- Other (3)

**Personal Documents:**
- SA ID Card (Front).pdf - 15/03/2018
- SA ID Card (Back).pdf - 15/03/2018
- Profile Photo.jpg - 15/03/2018
- CV_Sarah_Naidoo.pdf - 10/03/2018
- Reference_Letter_1.pdf - 10/03/2018
- Reference_Letter_2.pdf - 10/03/2018
- Emergency_Contact_Details.pdf - 15/03/2018
- Banking_Details_Form.pdf - 15/03/2018

**Qualification Certificates:**
- RE5_Certificate.pdf - 15/09/2015
- RE2_Certificate.pdf - 20/10/2015
- CFP_Certificate.pdf - 01/03/2018
- BCom_Degree.pdf - 15/12/2010
- Higher_Cert_Financial_Planning.pdf - 20/06/2014
- Advanced_Diploma_Financial_Planning.pdf - 15/11/2016
- CFP_Renewal_2024.pdf - 15/10/2024

**Fit & Proper Documents:**
- Police_Clearance_2024.pdf - 15/03/2024
- Credit_Report_Oct2024.pdf - 01/10/2024
- Debarment_Check_Dec2024.pdf - 01/12/2024
- F&P_Verification_2024.pdf - 15/03/2024
- Reference_Previous_FSP.pdf - 10/03/2018

**FICA Documents:**
- Proof_of_Address_Sep2024.pdf - 01/10/2024
- Tax_Certificate.pdf - 15/03/2018
- FICA_Verification_Form.pdf - 15/03/2018
- PEP_Declaration.pdf - 15/03/2018

**Employment Contracts:**
- Employment_Contract_2018.pdf - 15/03/2018 (Original)
- Contract_Amendment_2020.pdf - 01/01/2020 (Compliance Officer role)
- Commission_Agreement.pdf - 15/03/2018

**Upload New Document:**
- [📎 Upload Document] button
- Select category: (dropdown)
- Document description: (text)
- Access control: Internal only | Shareable
- Tags: (add tags for search)

**Document Actions:**
- Each document has: [View] [Download] [Share] [Delete] buttons
- Bulk actions: Select multiple → Download all, Delete selected

**Document Search:**
- Search by: Filename, category, date range, keywords
- Filter by: Document type, date range, uploaded by

**Storage:**
- Total Documents: 93
- Storage Used: 145 MB
- Storage Limit: 500 MB per representative

---

**Tab 10: Activity Timeline**

**Complete chronological log of representative's history:**

**Timeline View:**
- Newest first (default)
- Can switch to oldest first
- Filter by activity type

**Activity Log:**

**Activity 1:**
- 🎓 CPD Activity Completed
- Date: 05/12/2024 10:30
- User: Sarah Naidoo
- Details: "Completed 'FAIS Compliance Update 2024' (5 hours)"
- Provider: Moonstone Compliance
- Status: Verified
- [View Certificate]

**Activity 2:**
- 📊 Performance Review
- Date: 01/12/2024 10:00
- User: Johan Smit (Supervisor)
- Details: "Coaching session completed - Excellent performance noted"
- Duration: 45 minutes
- [View Notes]

**Activity 3:**
- 📝 Commission Statement
- Date: 01/12/2024 00:00
- System: Auto
- Details: "November 2024 commission statement generated: R21,200"
- [View Statement]

**Activity 4:**
- 🎓 CPD Activity Completed
- Date: 15/11/2024
- Details: "Completed 'Investment Products Masterclass' (6 hours)"
- Provider: FPI

**Activity 5:**
- 👥 Client Added
- Date: 10/11/2024
- User: Sarah Naidoo
- Details: "New client onboarded: Jane Smith"
- [View Client]

**Activity 6:**
- 📋 File Audit
- Date: 01/11/2024
- User: Johan Smit
- Details: "Quarterly file audit completed - 10 files reviewed, score 98/100"
- [View Audit Report]

**Activity 7:**
- 💰 Policy Sold
- Date: 25/10/2024
- User: Sarah Naidoo
- Details: "Old Mutual Life Cover sold - R5,000/month premium"
- Client: John Doe
- Commission: R2,500 (initial)

**Activity 8:**
- ✅ Fit & Proper Verification
- Date: 15/03/2024
- User: David Anderson
- Details: "Annual F&P verification completed - All clear"
- Status: Approved

**Activity 9:**
- 🔍 Debarment Check
- Date: 01/03/2024
- System: Auto
- Details: "Monthly debarment check - Clear"

**Activity 10:**
- 🎯 Performance Review
- Date: 15/03/2024
- Users: Johan Smit, David Anderson
- Details: "Annual performance review - Rating: 5/5 Outstanding"
- [View Review]

**[Load More Activities]**

**Activity Filters:**
- Type: All | Sales | Compliance | Training | Reviews | System
- Date Range: Last 7 days | Last 30 days | Last year | Custom
- User: All | Sarah Naidoo | Supervisors | System

**Export Timeline:**
- [Export to PDF] - Full activity report
- [Export to Excel] - Data format

---

## 5. SUPERVISION STRUCTURE TAB

**Organizational Hierarchy:**

**Visual Org Chart:**
- Interactive, clickable diagram
- Shows FSP Owner at top
- Key Individuals below
- Representatives under their KI supervisors
- Color-coded by compliance status (green=compliant, amber=issues, red=non-compliant)

**Hierarchy Breakdown:**

**Level 1: FSP Owner/Principal**
- David Anderson
- FSP Number: FSP-12345
- Supervises: All 12 representatives (via Key Individuals)
- Status: ✅ Active
- [View Profile]

**Level 2: Key Individuals (2)**

**KI 1: Johan Smit**
- Categories: I, IIA, IIB, IIIA
- Direct Reports: 6 representatives
- Team Compliance: 83% (5/6 compliant)
- Status: ✅ Compliant
- [View Team] [View Profile]

**Team Members:**
1. Sarah Naidoo - ✅ Compliant
2. Thabo Mokoena - ✅ Compliant
3. Lerato Dlamini - ✅ Compliant
4. Sipho Ndlovu - ✅ Compliant
5. Zanele Mthembu - ✅ Compliant
6. Andile Khumalo - ⚠️ CPD behind

**KI 2: Maria Coetzee**
- Categories: I, IIA
- Direct Reports: 6 representatives
- Team Compliance: 100% (6/6 compliant)
- Status: ✅ Compliant
- [View Team] [View Profile]

**Team Members:**
1. Pieter Botha - ✅ Compliant
2. Jennifer Williams - ✅ Compliant
3. David Nkosi - ✅ Compliant
4. Linda van der Merwe - ✅ Compliant
5. James Mkhize - ✅ Compliant
6. Rachel Adams - ✅ Compliant

**Supervision Matrix:**

**Table View:**

| Representative | Supervisor | Cat I | Cat IIA | Cat IIB | Cat IIIA | Last Review | Next Review | Status |
|----------------|------------|-------|---------|---------|----------|-------------|-------------|--------|
| Sarah Naidoo | Johan Smit | ✅ | ✅ | ❌ | ❌ | 15/11/24 | 15/12/24 | ✅ |
| Thabo Mokoena | Johan Smit | ✅ | ✅ | ❌ | ❌ | 15/11/24 | 15/12/24 | ✅ |
| Pieter Botha | Maria Coetzee | ✅ | ❌ | ✅ | ❌ | 10/11/24 | 10/12/24 | ✅ |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Supervision Requirements:**

**FAIS Act Requirements:**
- Key Individual required for each category
- KI must supervise reps in their authorized categories
- Regular supervision meetings required
- File reviews mandatory
- Documentation of supervision essential

**Current Coverage:**
- Category I: ✅ Covered (Johan Smit, Maria Coetzee)
- Category IIA: ✅ Covered (Johan Smit, Maria Coetzee)
- Category IIB: ✅ Covered (Johan Smit)
- Category IIIA: ✅ Covered (Johan Smit)

**Supervision Schedule:**

**This Month (December 2024):**
- 06/12/24: Pieter Botha - Maria Coetzee (✅ Complete)
- 10/12/24: David Nkosi - Maria Coetzee (✅ Complete)
- 15/12/24: Sarah Naidoo - Johan Smit (⏰ Scheduled)
- 15/12/24: Thabo Mokoena - Johan Smit (⏰ Scheduled)
- 17/12/24: Lerato Dlamini - Johan Smit (⏰ Scheduled)
- 20/12/24: Sipho Ndlovu - Johan Smit (⏰ Scheduled)

**Overdue Reviews:**
- None ✅

**Team Performance:**

**Johan Smit's Team:**
- Average Client Satisfaction: 4.5/5.0
- Total Clients: 567
- YTD Commission: R845,000
- Compliance Rate: 83%

**Maria Coetzee's Team:**
- Average Client Satisfaction: 4.6/5.0
- Total Clients: 523
- YTD Commission: R780,000
- Compliance Rate: 100%

**Reassignment Tool:**
- Change supervisor: Select rep → Select new KI → [Reassign]
- Must match categories
- Notification sent automatically
- Supervision history maintained

---

## 6. COMPLIANCE OVERVIEW TAB

**Compliance Dashboard:**

**Overall Compliance Statistics:**
- Total Representatives: 12
- Fully Compliant: 11 (92%)
- With Issues: 1 (8%)
- Suspended: 0
- Compliance Score: 92%

**Compliance Matrix (Detailed View):**

**Table showing all representatives and all compliance requirements:**

| Rep | F&P | CPD | FICA | Debarment | PI Ins | Supervision | Training | Overall |
|-----|-----|-----|------|-----------|--------|-------------|----------|---------|
| Sarah Naidoo | ✅ | ✅ 32hrs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Compliant |
| Thabo Mokoena | ✅ | ✅ 30hrs | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ Compliant |
| Pieter Botha | ✅ | ⚠️ 18hrs | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ CPD Behind |
| Johan Smit (KI) | ✅ | ✅ 35hrs | ✅ | ✅ | ✅ | N/A | ✅ | ✅ Compliant |
| ... | ... | ... | ... | ... | ... | ... | ... | ... |

**Click column header to sort by that compliance area**

**Compliance Issues (Attention Required):**

**Issue 1:**
- Representative: Pieter Botha
- Issue: CPD Requirements
- Details: 18 of 30 hours complete (60%)
- Deadline: 31/05/2025 (167 days)
- Severity: ⚠️ Medium (time remaining)
- Action: [Create CPD Plan] [Send Reminder] [View Details]

**No other issues** ✅

**Upcoming Deadlines:**

**Within 30 Days:**
- None ✅

**Within 90 Days:**
- 15/03/2025: Sarah Naidoo - F&P renewal (90 days)
- 20/03/2025: Thabo Mokoena - F&P renewal (95 days)

**CPD Deadline:**
- 31/05/2025: All representatives must complete 30 hours (167 days)
- Current team average: 28.5 hours (95%)
- On track: 11 of 12 representatives

**Fit & Proper Status:**

**Current:**
- All Current: 12/12 (100%) ✅
- Expiring This Quarter: 2
- Expiring Next Quarter: 3

**Upcoming F&P Renewals:**
- Q1 2025: 2 representatives
- Q2 2025: 3 representatives
- Q3 2025: 4 representatives
- Q4 2025: 3 representatives

**Debarment Monitoring:**

**Last Check:** 01/12/2024
**Status:** All representatives clear ✅
**Next Check:** 01/01/2025 (monthly)

**Debarment Check History:**
- December 2024: ✅ All clear
- November 2024: ✅ All clear
- October 2024: ✅ All clear
- September 2024: ✅ All clear
- [View All History]

**FICA Compliance:**

**Current FICA Status:**
- All Verified: 12/12 (100%) ✅
- No verifications due this month ✅

**Upcoming FICA Reviews:**
- January 2025: 2 representatives
- February 2025: 1 representative
- March 2025: 3 representatives

**Professional Indemnity Insurance:**

**Coverage Status:**
- All Representatives Covered: ✅
- Coverage Type: FSP Master Policy
- Insurer: Santam Professional Indemnity
- Policy Number: PI-12345678
- Coverage Amount: R10,000,000
- Expiry: 31/03/2025
- Status: ✅ Current

**Training Compliance:**

**Mandatory Training (2024):**
- Completed by All: ✅ 12/12 (100%)
- Compliance Update: ✅ 100%
- TCF Refresher: ✅ 100%
- FICA Update: ✅ 100%
- Product Knowledge: ✅ 100%

**Supervision Compliance:**

**Supervision Status:**
- All Supervised: ✅ 12/12 (100%)
- Reviews Up to Date: ✅ 100%
- No Overdue Reviews: ✅

**Compliance Alerts:**

**Active Alerts:**
- 1 representative behind on CPD (Pieter Botha)

**Recent Alerts (Resolved):**
- None this month ✅

**Compliance Actions:**

**Quick Actions:**
- [Run Full Compliance Check]
- [Generate Compliance Report]
- [Send Bulk Reminder] (CPD deadline)
- [Schedule F&P Renewals]
- [Run Debarment Check]

**Bulk Compliance Operations:**
- Select representatives
- [Check All Compliance]
- [Update FICA]
- [Verify Qualifications]
- [Send Notifications]

---

## 7. DEBARMENT REGISTER TAB

**Debarment Overview:**

**Purpose:**
"The FSCA maintains a register of debarred persons prohibited from being FSP representatives. Regular checking is mandatory."

**Current Status:**
- Representatives Checked: 12/12 (100%)
- All Clear: ✅ 12/12 (100%)
- Debarred: 0
- Last Check: 01/12/2024
- Next Check: 01/01/2025 (monthly)

**Debarment Check Schedule:**

**Automatic Monthly Checks:**
- Frequency: Monthly (1st of each month)
- Method: Automated system check
- Source: FSCA Public Register
- Notification: Compliance Officer notified of results

**Manual Check:**
- [Run Debarment Check Now] button
- Select: All Representatives | Specific Rep
- Status: ⏳ Processing / ✅ Complete

**Check Results:**

**December 2024 Check (01/12/2024):**
- Representatives Checked: 12
- Result: ✅ All Clear
- Time Taken: 2 minutes
- Checked By: System (Automated)
- Verified By: Sarah Naidoo (Compliance Officer)
- [Download Certificate]

**Representative Debarment Status Table:**

| Representative | Last Checked | Status | Certificate | Next Check |
|----------------|--------------|--------|-------------|------------|
| Sarah Naidoo | 01/12/2024 | ✅ Clear | [Download] | 01/01/2025 |
| Thabo Mokoena | 01/12/2024 | ✅ Clear | [Download] | 01/01/2025 |
| Pieter Botha | 01/12/2024 | ✅ Clear | [Download] | 01/01/2025 |
| Johan Smit | 01/12/2024 | ✅ Clear | [Download] | 01/01/2025 |
| Maria Coetzee | 01/12/2024 | ✅ Clear | [Download] | 01/01/2025 |
| ... | ... | ... | ... | ... |

**Debarment Check History:**

**Monthly Checks:**
- December 2024: ✅ All clear (12/12)
- November 2024: ✅ All clear (12/12)
- October 2024: ✅ All clear (12/12)
- September 2024: ✅ All clear (12/12)
- August 2024: ✅ All clear (11/11)
- [View All History]

**What if Debarment Found:**

**Procedure if Match Found:**
1. Immediate notification to FSP Owner
2. Representative suspended pending investigation
3. Verification of match (name, ID number)
4. If confirmed:
   - Immediate termination
   - Client reassignment
   - FSCA notification
   - Legal consultation
5. Documentation of all actions

**Debarment Information:**

**About FSCA Debarment:**
- Debarment prohibits person from being FSP representative
- Reasons: Fraud, dishonesty, non-compliance, regulatory breaches
- Listed on FSCA Public Register
- Permanent unless successfully appealed

**FSCA Resources:**
- FSCA Website: www.fsca.co.za
- Debarment Register: [Direct Link]
- Contact: 0800 110 443
- Email: info@fsca.co.za

**Documentation:**

**Debarment Certificates:**
- Monthly certificates stored
- Available for audit
- 5-year retention
- [Download All Certificates]

**Audit Trail:**
- All checks logged
- Who, when, result
- System-generated
- [View Audit Trail]

---

## 8. REPORTS TAB

### Report Types (Selection Cards)

**Report 1: Representatives Summary**
- Icon: Users
- Description: "Comprehensive overview of all representatives"
- Options:
  - Include: Contact details, categories, compliance status
  - Format: PDF | Excel
- [Generate Report]

**Report 2: Compliance Report**
- Icon: Shield-check
- Description: "Detailed compliance status for all representatives"
- Options:
  - Include: F&P, CPD, FICA, debarment status
  - Group by: Representative | Compliance Area | Supervisor
  - Format: PDF | Excel
- [Generate Report]

**Report 3: Individual Representative Report**
- Icon: User
- Description: "Complete profile for specific representative"
- Options:
  - Select representative: (dropdown)
  - Include: All tabs, documents, history
  - Format: PDF
- [Generate Report]

**Report 4: Supervision Report**
- Icon: Users-cog
- Description: "Supervision structure and review status"
- Options:
  - Group by: Supervisor | Team
  - Include: Org chart, review status, team performance
  - Format: PDF | PowerPoint
- [Generate Report]

**Report 5: CPD Summary Report**
- Icon: Book
- Description: "CPD status for all representatives"
- Options:
  - Current year: 2024/2025
  - Include: Hours breakdown, activities, compliance
  - Format: PDF | Excel
- [Generate Report]

**Report 6: Fit & Proper Report**
- Icon: Award
- Description: "Fit & Proper status and upcoming renewals"
- Options:
  - Include: Current status, renewals, verification history
  - Format: PDF
- [Generate Report]

**Report 7: Debarment Register Report**
- Icon: Shield-alert
- Description: "Debarment check history and certificates"
- Options:
  - Period: Last month | Last quarter | Last year
  - Include: Certificates, audit trail
  - Format: PDF
- [Generate Report]

**Report 8: Performance Report**
- Icon: Chart-bar
- Description: "Sales and performance metrics by representative"
- Options:
  - Period: YTD | Custom range
  - Include: Sales, clients, commission, satisfaction
  - Format: PDF | Excel
- [Generate Report]

**Report 9: Training Report**
- Icon: Graduation-cap
- Description: "Training completion and development activities"
- Options:
  - Period: This year | Custom
  - Include: Completed courses, certifications, hours
  - Format: PDF | Excel
- [Generate Report]

**Report 10: FSCA Submission Report**
- Icon: Building
- Description: "Representatives data for FSCA submissions"
- Options:
  - Period: Annual
  - Include: All FSCA-required data
  - Format: PDF (FSCA template) | Excel
- [Generate Report]

**Report 11: Commission Report**
- Icon: Currency-dollar
- Description: "Commission breakdown by representative"
- Options:
  - Period: Month | Quarter | Year | Custom
  - Include: By product, by rep, totals
  - Format: PDF | Excel
- [Generate Report]

**Report 12: Custom Report Builder**
- Icon: Sliders
- Description: "Build your own custom report"
- Options:
  - Select fields
  - Choose representatives
  - Apply filters
  - Set format
- [Build Report]

### Report Generation Interface

**After selecting report type:**

**Report: Representatives Compliance Report**

**1. Report Period/Scope:**
- ⭕ All Representatives (12)
- ⭕ Select Specific Representatives (multi-select)
- ⭕ By Supervisor:
  - ⭕ Johan Smit's Team
  - ⭕ Maria Coetzee's Team
- ⭕ By Status:
  - ☑ Active
  - ☐ Probation
  - ☐ Suspended
  - ☐ Terminated

**2. Compliance Areas to Include:**
- ☑ Fit & Proper Status
- ☑ CPD Compliance
- ☑ FICA Verification
- ☑ Debarment Status
- ☑ PI Insurance
- ☑ Supervision Status
- ☑ Training Compliance
- ☑ Overall Compliance Score

**3. Report Options:**
- ☑ Include compliance matrix
- ☑ Show upcoming deadlines
- ☑ Include recommendations
- ☑ Show historical trend
- ☑ Include charts/visualizations
- ☐ Include individual details (makes report longer)

**4. Format:**
- ⭕ PDF (presentation format)
- ⭕ Excel (data format)
- ⭕ PowerPoint (slides)

**5. Distribution:**
- Email to: (comma-separated)
- CC: (optional)
- Subject: "Representatives Compliance Report - December 2024"
- Message: (textarea)
- ☑ Save to document library
- ☐ Schedule recurring (monthly)

**6. Branding:**
- ☑ Include FSP logo and details
- ☑ Include compliance officer signature
- ☑ Mark as confidential

**Preview:**
- [Preview Report] button

**Actions:**
- [Generate Report] (primary)
- [Save Configuration]
- [Schedule Recurring]
- [Cancel]

### Report Preview & Download

**Report Generated Successfully** ✅

**Report Details:**
- Title: Representatives Compliance Report - December 2024
- Generated: 15/12/2024 16:00
- Generated by: Sarah Naidoo
- Format: PDF
- Size: 1.8 MB
- Pages: 15

**Preview:**
- PDF viewer embedded
- Page navigation
- Zoom controls

**Actions:**
- [Download] (primary)
- [Email]
- [Print]
- [Save to Library]
- [Generate Again]

### Report History

**Previously Generated Reports:**

| Report Name | Type | Generated Date | Generated By | Format | Actions |
|-------------|------|----------------|--------------|--------|---------|
| Compliance Report Dec 2024 | Compliance | 15/12/2024 | S. Naidoo | PDF | [Download] [Email] |
| Q4 2024 Performance | Performance | 01/12/2024 | J. Smit | Excel | [Download] |
| Annual FSCA Report 2024 | FSCA | 15/11/2024 | D. Anderson | PDF | [Download] |
| CPD Summary Nov 2024 | CPD | 30/11/2024 | S. Naidoo | PDF | [Download] |

---

## TECHNICAL FEATURES

### Data Management
- Multi-tenant architecture (FSP-level isolation)
- PostgreSQL database with Prisma ORM
- Relational data model:
  - Representatives table (core)
  - Qualifications table (one-to-many)
  - FitAndProper table (one-to-one)
  - FICA table (one-to-one)
  - CPD_Activities table (one-to-many)
  - Supervision_Reviews table (one-to-many)
  - Debarment_Checks table (one-to-many)
  - Documents table (one-to-many)

### Role-Based Access Control
**FSP Owner/Principal:**
- Full access to all representatives
- Add, edit, suspend, terminate
- All reports and analytics
- Compliance verification authority
- System configuration

**Key Individual:**
- Access to supervised representatives only
- View/edit supervised reps
- Supervision module access
- Team reports
- Cannot delete representatives

**Compliance Officer:**
- Full access to all representatives
- Verification authority (F&P, FICA)
- Compliance module access
- All reports
- Cannot terminate (requires Owner approval)

**Representative:**
- Own profile only (view/limited edit)
- Own CPD management
- Own documents upload
- Cannot access other reps
- View own performance/commission

**Admin Staff:**
- View all representatives (read-only)
- Export data
- Generate reports
- Cannot edit or verify
- No access to sensitive financial data

### Automation Features
- Automatic CPD deadline reminders (90, 60, 30, 7 days)
- Automatic F&P renewal reminders (90, 60, 30 days)
- Monthly debarment checks (auto-scheduled)
- Annual FICA review reminders
- Quarterly supervision review reminders
- Automatic compliance scoring
- Birthday/anniversary notifications
- Probation end date alerts

### Integration Points
- CPD module (linked)
- Fit & Proper module (linked)
- FICA module (linked)
- Document Management (linked)
- Client Management (for client assignment)
- Commission System (for tracking)
- Training/LMS system
- Email system (notifications)
- FSCA API (debarment checks)
- Credit bureau API (F&P checks)

### Search & Filter
- Advanced search:
  - Name, ID, FSP number, email, phone
  - Categories, status, compliance
  - Supervisor, location, employment type
  - Date ranges, qualifications
- Multi-criteria filtering
- Save search filters
- Quick filters (pre-configured)
- Real-time search results
- Export filtered results

### Validation & Verification
- SA ID number validation (Luhn algorithm)
- Email format validation
- Phone number format (SA +27)
- Date validations (age, tenure)
- Duplicate detection (ID, email, FSP number)
- Category authorization vs FSP license
- Qualification requirements per category
- Supervisor category matching
- Document format and size validation

### Notifications & Alerts
- Email notifications:
  - Registration confirmation
  - Compliance deadlines approaching
  - F&P renewal due
  - CPD hours needed
  - Supervision review scheduled
  - Debarment check results
  - Document updates
  - Profile changes
- In-app notifications
- SMS alerts (critical items)
- Dashboard badge counters
- Daily digest emails
- Weekly team summaries

### Audit Trail
- Complete activity log
- Who, what, when for all actions
- Before/after values for edits
- IP address tracking
- Document access log
- Compliance verification history
- Login/logout tracking
- Export audit trail
- 5-year retention

### Document Management
- Upload multiple files
- Drag & drop interface
- File preview (PDF, images)
- Version control
- Document categories
- Access control per document
- 5-year retention (post-termination)
- Secure encrypted storage
- Download/share options
- Bulk upload capability

### Analytics & Reporting
- Use Chart.js for visualizations
- Interactive charts (drill-down)
- Real-time dashboards
- Custom date ranges
- Trend analysis
- Predictive analytics (CPD completion likelihood)
- Benchmarking (team, industry)
- Export chart data
- Scheduled report generation

### Mobile Support
- Responsive design
- Mobile-optimized forms
- Touch-friendly interfaces
- Mobile document upload
- Camera integration (ID scan)
- Offline viewing (profile, documents)
- Push notifications
- Biometric login option

### Security
- Role-based access control (strict)
- JWT authentication
- Two-factor authentication (optional)
- Data encryption (at rest, in transit)
- Secure document storage
- Audit trails
- Access logging
- Session management
- Password policies
- Account lockout (failed attempts)

### Performance
- Lazy loading (large lists)
- Pagination (configurable page size)
- Caching (frequently accessed data)
- Background processing (reports, checks)
- Optimized database queries
- Image compression (profile photos)
- Async operations (document upload)
- Fast search (indexed fields)

### Accessibility
- ARIA labels
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus indicators
- Text resizing
- Alt text for images
- Accessible forms

---

## SAMPLE DATA

**Current Date:** 15/12/2024

**Representatives Summary:**
- Total: 12 active
- Probation: 0
- Suspended: 0
- Terminated: 3 (historical)
- Compliance Rate: 92% (11/12 compliant)

**Key Individuals:**
- Johan Smit (Categories: I, IIA, IIB, IIIA) - 6 reports
- Maria Coetzee (Categories: I, IIA) - 6 reports

**Sample Representatives:**

**1. Sarah Naidoo**
- FSP #: REP-12345-001
- Role: Senior Financial Advisor & Compliance Officer
- Categories: I, IIA (Classes A, B)
- Status: ✅ Active, Compliant
- Join Date: 15/03/2018 (6.8 years)
- Supervisor: Johan Smit
- CPD: 32/30 hours ✅
- F&P: Current (exp 15/03/2025)
- Clients: 127
- Performance: 4.8/5.0

**2. Thabo Mokoena**
- FSP #: REP-12345-002
- Role: Financial Advisor
- Categories: I, IIA (Class A)
- Status: ✅ Active, Compliant
- Join Date: 01/06/2019 (5.5 years)
- Supervisor: Johan Smit
- CPD: 30/30 hours ✅
- Clients: 98

**3. Pieter Botha**
- FSP #: REP-12345-003
- Role: Financial Advisor
- Categories: I, IIB
- Status: ✅ Active, ⚠️ Non-Compliant (CPD)
- Join Date: 10/09/2020 (4.3 years)
- Supervisor: Maria Coetzee
- CPD: 18/30 hours ⚠️ (needs 12 more)
- Issue: Behind on CPD

**4. Johan Smit (Key Individual)**
- FSP #: REP-12345-KI1
- Role: Key Individual & Branch Manager
- Categories: I, IIA, IIB, IIIA
- Status: ✅ Active, Compliant
- Join Date: 01/01/2015 (9.0 years)
- Supervises: 6 representatives
- CPD: 35/30 hours ✅

**Team Statistics:**
- Average CPD: 28.5 hours (95%)
- Average Client Satisfaction: 4.5/5.0
- Total Clients: 1,090
- YTD Commission: R1,625,000
- Debarment Status: All clear
- F&P Status: All current

---

## FILE STRUCTURE

```
representatives-management/
├── index.html
├── css/
│   ├── representatives-styles.css
│   ├── org-chart.css
│   ├── profile-view.css
│   ├── compliance-matrix.css
│   └── responsive.css
├── js/
│   ├── representatives-dashboard.js
│   ├── representative-directory.js
│   ├── add-representative.js
│   ├── representative-profile.js
│   ├── supervision-structure.js
│   ├── compliance-overview.js
│   ├── debarment-checks.js
│   ├── reports.js
│   ├── validation.js
│   ├── id-validator.js
│   ├── charts.js
│   └── data.js
└── assets/
    └── sample-documents/
```

Generate a complete, production-ready Representatives Management system that handles the full representative lifecycle from registration to management, with strict FAIS Act compliance, comprehensive verification workflows, supervision tracking, and detailed reporting. The system should meet all South African regulatory requirements and FSP Owner vicarious liability management needs.
