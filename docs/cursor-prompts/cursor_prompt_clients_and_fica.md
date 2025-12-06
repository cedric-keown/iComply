# CURSOR PROMPT: CLIENTS & FICA MANAGEMENT MODULE

Create a fully functional, realistic HTML mockup for the Clients & FICA Management module of a South African FAIS broker compliance portal. This comprehensive module combines client portfolio management with FICA (Financial Intelligence Centre Act) verification, risk assessment, ongoing monitoring, and compliance tracking as required by FICA Act 38 of 2001.

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
- South African locale (ID format, phone +27, currency ZAR, dates DD/MM/YYYY)

## MODULE STRUCTURE

### Top Navigation Tabs
- Client Dashboard (default)
- Client Portfolio
- Add New Client
- FICA Verification
- Risk Assessment
- Reviews & Monitoring
- Reports & Analytics

### Role-Based Access Control

**FSP Owner/Principal:**
- Full access to all clients
- View, add, edit, delete clients
- Assign/transfer clients
- Access all reports
- Approve high-risk classifications

**Key Individual:**
- Access to supervised representatives' clients only
- View, add, edit (limited)
- Cannot delete or transfer clients outside team
- Team reports only

**Compliance Officer:**
- View all clients (read-only for personal data)
- Full access to FICA verification workflows
- Conduct risk assessments
- Approve EDD requirements
- Generate compliance reports

**Representative:**
- View own clients only
- Add new clients (requires approval)
- Update client information (limited fields)
- Conduct FICA verifications for own clients
- View own client reports

**Admin Staff:**
- View all clients (read-only)
- Upload documents
- Basic reporting
- Cannot conduct verifications

---

## 1. CLIENT DASHBOARD

### Hero Section: Client Portfolio Metrics (4 Cards)

**Card 1: Total Clients**
- Large number: 248
- Icon: Users
- Trend: +12 this month (↑ 5%)
- Subtitle: "Active client base"
- Status: Success (green)
- Link: "View All"

**Card 2: FICA Compliance**
- Large donut chart: 95% compliant
- Center number: 235 / 248
- Label: "Clients FICA Verified"
- Status: ✓ Good Compliance (green)
- Subtitle: "13 pending verification"
- Link: "View Pending"

**Card 3: High-Risk Clients**
- Large number: 8
- Icon: Alert-triangle
- Percentage: 3% of portfolio
- Label: "Requiring EDD"
- Badge: Amber warning
- Link: "View Details"

**Card 4: Reviews Due**
- Large number: 12
- Icon: Calendar-clock
- Breakdown:
  - Due this month: 7
  - Overdue: 5 (red badge)
- Label: "FICA Reviews"
- Link: "Review Schedule"

### Client Breakdown Charts

**By Representative (Horizontal Bar Chart):**
- Sarah Naidoo: 85 clients
- Thabo Mokoena: 72 clients
- Pieter Vermeulen: 54 clients
- Johan Smith: 37 clients
- Total: 248 clients

**By Risk Level (Donut Chart):**
- Low Risk (SDD): 180 clients (73%) - Green
- Standard Risk (CDD): 48 clients (19%) - Blue
- High Risk (EDD): 8 clients (3%) - Red
- Not Yet Classified: 12 clients (5%) - Grey

**By Product Type (Stacked Bar Chart):**
- Long-term Insurance: 165 clients
- Investments: 98 clients
- Short-term Insurance: 72 clients
- Pension Funds: 45 clients
- (Clients may have multiple products)

**By Client Type:**
- Individual (Retail): 220 clients (89%)
- Corporate: 18 clients (7%)
- Trust/Estate: 10 clients (4%)

**By Status:**
- Active: 235 clients (95%)
- Pending Activation: 8 clients (3%)
- Inactive: 5 clients (2%)

### Recent Client Activity Feed

**Activity List (Last 10 activities):**

**Activity 1:**
- Icon: ✓ (green checkmark)
- "New client onboarded"
- Details: "Nomsa Khumalo - FICA verification complete"
- Representative: Sarah Naidoo
- Time: 2 hours ago
- Action: [View Profile]

**Activity 2:**
- Icon: 📄 (document)
- "FICA review completed"
- Details: "Johan van Zyl - Annual review passed"
- Representative: Thabo Mokoena
- Time: 5 hours ago
- Action: [View Review]

**Activity 3:**
- Icon: ⚠️ (warning)
- "Risk level upgraded"
- Details: "Mary Johnson - Standard to High Risk (EDD required)"
- System: Automated Risk Assessment
- Time: 1 day ago
- Action: [Review Risk]

**Activity 4:**
- Icon: 🔄 (transfer)
- "Client transferred"
- Details: "Pieter Nel transferred from Johan Smith to Sarah Naidoo"
- User: FSP Owner
- Time: 2 days ago

**Activity 5:**
- Icon: 📨 (email)
- "Review reminder sent"
- Details: "12 clients sent FICA review reminders"
- System: Automated
- Time: 3 days ago

### FICA Compliance Overview

**Compliance Status Card:**
- Overall Status: ✅ COMPLIANT (green badge)
- Verification Rate: 95% (235/248)
- Average Verification Time: 2.5 days
- Last FSCA Audit: 30/06/2024 - PASSED

**Regulatory Deadlines:**
- Initial Verification: Within 30 days of account opening
- Low Risk Review: 5 years
- Standard Risk Review: 1 year
- High Risk Review: Quarterly (3 months)
- Record Retention: 5 years minimum

### Quick Actions Panel
- [Primary Button] Add New Client
- [Secondary Button] Verify Client
- [Secondary Button] Bulk Upload Clients
- [Secondary Button] Run Risk Screening
- [Link] Generate Compliance Report
- [Link] View Overdue Reviews

### Critical Alerts

**Alert 1:** (Critical - Red)
- Icon: Exclamation-circle
- Title: "5 FICA Reviews Overdue"
- Message: "Immediate action required to maintain compliance"
- Client list preview: M. van der Merwe (30 days), P. Botha (15 days)...
- Action: [View All Overdue] [Send Reminders]

**Alert 2:** (Warning - Amber)
- Icon: Clock
- Title: "7 Reviews Due This Month"
- Message: "Schedule reviews before month end"
- Action: [View Schedule] [Assign Reviews]

**Alert 3:** (Info - Blue)
- Icon: Shield-check
- Title: "PEP Screening Update Available"
- Message: "New PEP list released - run screening recommended"
- Last screening: 5 days ago
- Action: [Run Bulk Screening] [View Details]

---

## 2. CLIENT PORTFOLIO TAB

### Portfolio Overview Stats (Summary Cards)

**Card Row 1:**
- Total Clients: 248
- Active: 235
- New This Month: 12
- Average Portfolio Value: R2.4M

**Card Row 2:**
- Total AUM: R595M
- Monthly Premiums: R3.2M
- Policies: 487
- Average Age: 42 years

### View Options
- **Toggle:** [List View] | [Grid View] | [Table View]
- **Layout:** Compact | Comfortable | Detailed

### Filter & Search Controls

**Search Bar:**
- Placeholder: "Search by name, ID number, policy number, or phone"
- Real-time search
- Advanced search link

**Filters Panel (Collapsible):**

**Client Status:**
- ☐ Active (235)
- ☐ Pending (8)
- ☐ Inactive (5)

**FICA Status:**
- ☐ Verified (235)
- ☐ Pending Verification (8)
- ☐ Incomplete (5)
- ☐ Reviews Overdue (5)

**Risk Level:**
- ☐ Low (SDD) (180)
- ☐ Standard (CDD) (48)
- ☐ High (EDD) (8)
- ☐ Not Assessed (12)

**Representative:**
- ☐ All Representatives
- ☐ Sarah Naidoo (85)
- ☐ Thabo Mokoena (72)
- ☐ Pieter Vermeulen (54)
- ☐ Johan Smith (37)
- ☐ Unassigned (0)

**Product Type:**
- ☐ Long-term Insurance
- ☐ Investments
- ☐ Short-term Insurance
- ☐ Pension Funds

**Client Type:**
- ☐ Individual
- ☐ Corporate
- ☐ Trust/Estate

**Date Filters:**
- Onboarded: [Date range picker]
- Last FICA Review: [Date range picker]
- Next Review Due: [Date range picker]

**Actions:**
- [Apply Filters] [Clear All] [Save Filter Set]

**Sort By:**
- Client Name (A-Z | Z-A)
- Date Added (Newest | Oldest)
- Next Review Date (Soonest | Latest)
- Portfolio Value (High | Low)
- Risk Level (High | Low)

### LIST VIEW Layout

**Client List Items (Expandable Cards):**

**Client Item 1:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Avatar] Thabo Johannes Mokoena                    ✓ FICA ✓    │
│          ID: 8506155800083                         📱 +27 82... │
│                                                                  │
│ Representative: Sarah Naidoo     │ Risk: Medium (CDD)            │
│ Products: LT Insurance, Invest   │ Last Review: 15/11/2024       │
│ Portfolio Value: R1.2M           │ Next Review: 15/11/2025       │
│                                                                  │
│ [View Profile] [FICA Review] [Documents] [More ▼]               │
└─────────────────────────────────────────────────────────────────┘
```

**Expanded View includes:**
- Contact details
- Policy numbers
- FICA compliance status
- Recent activity
- Quick actions

**Client Item 2:**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Avatar] Lerato Dlamini                            ⚠️ EDD      │
│          ID: 9205086789012                         📱 +27 83... │
│                                                                  │
│ Representative: Thabo Mokoena    │ Risk: High (EDD) 🚩 PEP      │
│ Products: LT Insurance           │ Last Review: 01/11/2024       │
│ Portfolio Value: R4.5M           │ Next Review: 01/02/2025 ⚠️    │
│                                                                  │
│ [View Profile] [EDD Review] [Screening] [More ▼]                │
└─────────────────────────────────────────────────────────────────┘
```

**Client Item 3:** (Pending Verification)
```
┌─────────────────────────────────────────────────────────────────┐
│ [Avatar] Mary Johnson (Foreign)                    ⏳ Pending  │
│          Passport: B1234567                        📱 +27 84... │
│                                                                  │
│ Representative: Sarah Naidoo     │ Risk: High (EDD) - Pending   │
│ Products: None assigned yet      │ Days in Queue: 10 days        │
│ Status: Awaiting documents       │ Missing: Proof of residence   │
│                                                                  │
│ [Complete FICA] [Request Docs] [Assign Rep] [More ▼]            │
└─────────────────────────────────────────────────────────────────┘
```

**Bulk Actions (when items selected):**
- [Assign to Representative] [Transfer] [Export Selected] [Send Reminder] [More Actions ▼]

### GRID VIEW Layout

**Client Cards (3-4 columns on desktop, responsive):**

**Card 1:**
```
┌──────────────────────────────┐
│    [Large Avatar/Photo]      │
│   Thabo Mokoena              │
│   850615****083              │
├──────────────────────────────┤
│ Rep: Sarah Naidoo            │
│ Risk: Medium (CDD)           │
│ Value: R1.2M                 │
│ ✓ FICA Compliant             │
│ Next Review: 15/11/2025      │
├──────────────────────────────┤
│ [View] [Review] [Documents]  │
└──────────────────────────────┘
```

**Card 2:** (High Risk Client)
```
┌──────────────────────────────┐
│    [Large Avatar/Photo]      │
│   Lerato Dlamini             │
│   920508****012              │
│   🚩 PEP                      │
├──────────────────────────────┤
│ Rep: Thabo Mokoena           │
│ Risk: High (EDD)             │
│ Value: R4.5M                 │
│ ⚠️ EDD Required               │
│ Next Review: 01/02/2025      │
├──────────────────────────────┤
│ [View] [EDD] [Screening]     │
└──────────────────────────────┘
```

### TABLE VIEW Layout

**Full Data Table:**

**Columns:**
| ☐ | Photo | Name | ID Number | Representative | Risk Level | FICA Status | Portfolio | Next Review | Actions |

**Sample Rows:**

Row 1:
- ☐ | [Photo] | Thabo Mokoena | 850615****083 | Sarah Naidoo | Medium (CDD) | ✓ Verified | R1.2M | 15/11/2025 | [⋯]

Row 2:
- ☐ | [Photo] | Lerato Dlamini 🚩 | 920508****012 | Thabo Mokoena | High (EDD) | ⚠️ Review Due | R4.5M | 01/02/2025 | [⋯]

Row 3:
- ☐ | [Photo] | Johan van Zyl | 780312****901 | Pieter Vermeulen | Medium (CDD) | ✓ Verified | R850K | 20/03/2025 | [⋯]

**Table Features:**
- Sortable columns
- Resizable columns
- Column show/hide
- Sticky header on scroll
- Row selection
- Inline editing (limited fields)
- Bulk actions toolbar
- Export to Excel/CSV
- Print view

**Pagination:**
- Showing 1-50 of 248
- << Previous | 1 | 2 | 3 | 4 | 5 | Next >>
- Items per page: 50 ▼ (25, 50, 100, All)

---

## 3. ADD NEW CLIENT TAB

### Client Type Selection (First Step - Large Cards)

**Card 1: Individual Client (Natural Person)**
- Icon: User
- Description: "South African citizen or resident with ID document"
- Most common option
- [Select] button

**Card 2: Foreign Individual**
- Icon: Globe
- Description: "Individual client without SA ID (passport required)"
- [Select] button

**Card 3: Corporate Client**
- Icon: Building
- Description: "Company, close corporation, trust, or partnership"
- [Select] button

### Individual Client Form (Step-by-step Wizard)

**Progress Indicator:**
```
1. Basic Details → 2. Contact Info → 3. Identity → 4. Address → 5. Financial → 6. Risk Assessment → 7. Review
```

---

#### STEP 1: BASIC DETAILS

**Form Fields:**

**Personal Information:**

1. **Title** (dropdown) - REQUIRED
   - Mr | Mrs | Ms | Miss | Dr | Prof | Rev | Other

2. **First Name** (text) - REQUIRED
   - Validation: Letters only, min 2 characters
   - Placeholder: "First name"

3. **Middle Name(s)** (text) - Optional
   - Multiple middle names allowed

4. **Surname** (text) - REQUIRED
   - Validation: Letters only, min 2 characters

5. **Preferred Name** (text) - Optional
   - How client prefers to be addressed

6. **Date of Birth** (date picker) - REQUIRED
   - Format: DD/MM/YYYY
   - Auto-calculate age
   - Validation: Must be 18+ years old
   - Display calculated age

7. **Gender** (dropdown)
   - Male | Female | Other | Prefer not to say

8. **Nationality** (dropdown with search) - REQUIRED
   - South African (default)
   - Searchable country list
   - Multiple nationalities option

9. **Country of Birth** (dropdown) - REQUIRED
   - Searchable country list

10. **Marital Status** (dropdown)
    - Single | Married (COP/ANC) | Divorced | Widowed | Life Partner

11. **Number of Dependants** (number)
    - Min: 0, Max: 20

**Employment Information:**

12. **Employment Status** (dropdown) - REQUIRED
    - Employed | Self-Employed | Business Owner | Retired | Unemployed | Student

13. **Occupation** (text) - REQUIRED
    - Free text with autocomplete suggestions

14. **Employer Name** (text) - If employed
    - Optional for self-employed

15. **Industry** (dropdown)
    - List of SA industry sectors

16. **Years in Current Role** (number)
    - Decimal allowed (e.g., 2.5 years)

**Tax Information:**

17. **Tax Number** (text) - REQUIRED
    - Format: 10 digits
    - Validation: SA tax number format
    - Real-time format checking

18. **Country of Tax Residence** (dropdown) - REQUIRED
    - Default: South Africa
    - Multiple tax residencies possible
    - Add another country [+]

**Buttons:**
- [Primary] Next: Contact Information
- [Secondary] Save as Draft
- [Link] Cancel

**Auto-save indicator:**
- "Last saved: 2 minutes ago" (updates in real-time)

---

#### STEP 2: CONTACT INFORMATION

**Primary Contact Details:**

1. **Mobile Number** (text with format) - REQUIRED
   - Format: +27 XX XXX XXXX
   - Real-time validation
   - Country code selector
   - Default: +27 (South Africa)

2. **Alternative Number** (text) - Optional
   - Same format as mobile

3. **Email Address** (email) - REQUIRED
   - Email format validation
   - Check for duplicates in system
   - Verification email sent on save

4. **Alternative Email** (email) - Optional
   - For backup communication

**Communication Preferences:**

5. **Preferred Contact Method** (radio buttons)
   - ○ Mobile Phone
   - ○ Email
   - ○ WhatsApp
   - ○ SMS
   - ○ Phone Call

6. **Best Time to Contact** (checkboxes)
   - ☐ Morning (08:00-12:00)
   - ☐ Afternoon (12:00-17:00)
   - ☐ Evening (17:00-20:00)

7. **Language Preference** (dropdown)
   - English | Afrikaans | Zulu | Xhosa | Other SA languages

**Emergency Contact:**

8. **Emergency Contact Name** (text) - Optional but recommended
9. **Relationship** (dropdown): Spouse | Child | Parent | Sibling | Friend | Other
10. **Emergency Contact Number** (text with format)

**Marketing Consent:**

11. **Communication Opt-ins** (checkboxes)
    - ☐ I consent to receive marketing communications
    - ☐ I consent to receive product updates
    - ☐ I consent to receive educational content
    - Text: "You can unsubscribe at any time"

**Buttons:**
- [Primary] Next: Identity Verification
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 3: IDENTITY VERIFICATION

**Instructions Panel:**
"Upload a clear, legible copy of the client's South African ID document. Both sides must be visible. We accept green bar-coded ID or smart ID card."

**ID Document Upload Section:**

**Upload Zone 1: ID Front Side** - REQUIRED
- Large drag & drop zone
- [Click to Browse] button
- Accepted formats: PDF, JPG, PNG
- Max size: 5MB
- Preview thumbnail after upload
- OCR extraction indicator
- [Replace] [Remove] buttons

**Upload Zone 2: ID Back Side** - REQUIRED
- Same features as front side

**Document Quality Check (Automated):**
After upload, system performs checks:
- ✓ Image is clear and legible
- ✓ All corners visible
- ✓ No obvious tampering
- ✓ Sufficient resolution
- ⚠️ Warning if quality issues detected

**ID Number Capture & Validation:**

1. **SA ID Number** (text) - REQUIRED
   - Format: 13 digits in boxes: [X][X][X][X][X][X][X][X][X][X][X][X][X]
   - Real-time validation:
     * ✓ Valid format (13 digits)
     * ✓ Valid checksum (Luhn algorithm)
     * ✓ Date of birth matches
     * ✓ Gender code matches
     * ⚠️ Duplicate check in system
   
2. **Auto-extracted Information Display:**
   - Date of Birth: [Extracted from ID]
   - Gender: [Extracted from ID]
   - SA Citizen: [Yes/No from ID]
   - Comparison with Step 1 data
   - Highlight any mismatches in amber

**Manual Verification Checklist:**
User must confirm:
- ☐ ID document is clear and legible
- ☐ All corners of ID are visible
- ☐ No tampering or alterations visible
- ☐ ID is valid (not expired for smart cards)
- ☐ Photo matches client (if known)
- ☐ ID number matches barcode/chip

**Additional Identity Documents (Optional but recommended):**

**Upload Additional Documents:**
- Driver's License (both sides)
- Passport (photo and signature pages)
- Bank Statement (for proof of banking)
- Other supporting documents

Each with:
- Upload zone
- Preview
- Document type selector
- Document number field
- Issue date / Expiry date fields

**Buttons:**
- [Primary] Next: Address Details
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 4: ADDRESS DETAILS

**Residential Address:**

**Address Type** (radio buttons):
- ○ Residential (where client lives)
- ○ Business
- ○ Postal (if different from residential)

1. **Unit/Flat Number** (text) - Optional
   - Apartment, unit, or flat number

2. **Complex/Building Name** (text) - Optional

3. **Street Number** (text) - REQUIRED

4. **Street Name** (text) - REQUIRED

5. **Suburb** (text with autocomplete) - REQUIRED
   - Auto-suggest based on South African suburbs

6. **City/Town** (text with autocomplete) - REQUIRED

7. **Province** (dropdown) - REQUIRED
   - Western Cape
   - Eastern Cape
   - Northern Cape
   - Free State
   - KwaZulu-Natal
   - North West
   - Gauteng
   - Mpumalanga
   - Limpopo

8. **Postal Code** (text) - REQUIRED
   - Format: 4 digits
   - Validation: SA postal code format
   - Auto-suggest based on suburb

9. **Country** (dropdown) - REQUIRED
   - Default: South Africa

**Address Duration:**
10. **How long at this address?** (number + dropdown)
    - Years: [__] Months: [__]
    - Used for risk assessment

**Previous Address (If less than 3 years at current address):**
- Checkbox: "I have lived at current address for less than 3 years"
- If checked, show fields for previous address
- Same fields as above

**Postal Address:**
11. **Checkbox:** ☐ Postal address is same as residential address
    - If unchecked, show separate postal address fields

**Proof of Residence Upload:**

**Instructions:**
"Upload proof of residence not older than 3 months. Accepted documents: Municipal rates, Utility bill (water/electricity), Bank statement, Lease agreement."

**Upload Zone:**
- Drag & drop area
- [Click to Browse] button
- Accepted: PDF, JPG, PNG - Max 5MB
- Preview after upload

**Document Details:**
- Document Type (dropdown): Municipal Account | Utility Bill | Bank Statement | Lease Agreement | Other
- Document Date (date picker) - Must be within 3 months
- Auto-validation: ⚠️ Warning if older than 3 months

**Address Verification:**
- Manual check: Address on document matches entered address
- ☐ Address on document matches residential address entered

**Buttons:**
- [Primary] Next: Financial Information
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 5: FINANCIAL INFORMATION

**Instructions:**
"This information helps us understand your client's financial profile and assess appropriate risk levels as per FICA requirements."

**Income Information:**

1. **Annual Gross Income** (currency) - REQUIRED
   - Format: ZAR with thousand separators
   - Range selector:
     * < R100,000
     * R100,000 - R250,000
     * R250,000 - R500,000
     * R500,000 - R1,000,000
     * R1,000,000 - R5,000,000
     * > R5,000,000
   - Or enter exact amount: R [________]

2. **Primary Source of Income** (dropdown) - REQUIRED
   - Employment Salary
   - Business Income
   - Investment Income
   - Rental Income
   - Pension/Annuity
   - Inheritance
   - Gift
   - Other (specify)

3. **Secondary Source(s) of Income** (multi-select)
   - Same options as primary
   - Add multiple sources [+]

**Source of Funds Documentation:**

4. **Upload Proof of Income** - REQUIRED
   - Payslip (most recent)
   - Bank statement (showing salary/income)
   - Financial statements (for business owners)
   - Tax return
   
   **Upload Zone:**
   - Multiple file upload
   - Preview thumbnails

**Asset Information:**

5. **Estimated Total Assets** (currency)
   - Range selector or exact amount
   - Includes: Property, Investments, Savings

6. **Asset Breakdown** (optional but recommended):
   - Property Value: R [________]
   - Investment Portfolio: R [________]
   - Savings/Cash: R [________]
   - Other Assets: R [________]

**Liabilities:**

7. **Estimated Total Liabilities** (currency)
   - Bonds, loans, credit cards, etc.

8. **Monthly Debt Repayments** (currency)
   - Used for affordability calculations

**Banking Information:**

9. **Bank Name** (dropdown with search) - REQUIRED
   - All SA banks listed
   - International banks option

10. **Account Type** (dropdown)
    - Cheque/Current Account
    - Savings Account
    - Transmission Account
    - Foreign Currency Account

11. **Branch Name/Code** (text)

12. **Account Number** (text)
    - Masked display: ****1234
    - Verification field: Re-enter account number

13. **Account Holder Name** (text)
    - Must match client name
    - ⚠️ Warning if different

**Proof of Banking:**
- Upload bank statement or confirmation letter
- Must show: Account number, Account holder name, Bank details

**Expected Transaction Profile:**

14. **Expected Monthly Investment/Premium** (currency)
    - Range or exact amount

15. **Expected Transaction Frequency**
    - Monthly | Quarterly | Annually | Ad-hoc | Lump sum only

16. **Expected Account Activity**
    - Low (< R50,000 p.a.)
    - Medium (R50,000 - R200,000 p.a.)
    - High (> R200,000 p.a.)

**Purpose of Relationship:**

17. **Primary Investment Objective** (checkboxes - multi-select)
    - ☐ Wealth Accumulation
    - ☐ Retirement Planning
    - ☐ Protection/Risk Cover
    - ☐ Tax Planning
    - ☐ Estate Planning
    - ☐ Education Funding
    - ☐ Other: [specify]

**Foreign Financial Interests:**

18. **Do you have foreign bank accounts?** (radio)
    - ○ Yes ○ No
    - If yes: List countries and approximate values

19. **Do you have foreign assets/investments?** (radio)
    - ○ Yes ○ No
    - If yes: List countries and types

20. **Do you conduct regular foreign transactions?** (radio)
    - ○ Yes ○ No
    - If yes: Explain nature and frequency

**Buttons:**
- [Primary] Next: Risk Assessment
- [Secondary] Back
- [Secondary] Save as Draft
- [Link] Cancel

---

#### STEP 6: RISK ASSESSMENT

**Instructions:**
"This risk assessment determines the level of due diligence required according to FICA regulations. Answer all questions truthfully."

**Automated Risk Scoring Display:**
```
┌──────────────────────────────────────────┐
│  Current Risk Score: 35/100              │
│  Risk Level: LOW (SDD)                   │
│  Progress: ████████░░ 80% Complete       │
└──────────────────────────────────────────┘
```

**Risk Factors Assessment:**

**1. Geographic Risk:**

Q1: **Is the client a SA resident?**
- ○ Yes (0 points)
- ○ No - Foreign resident (15 points)

Q2: **Does client have ties to high-risk jurisdictions?**
- ○ No (0 points)
- ○ Yes - Business interests (10 points)
- ○ Yes - Residential ties (15 points)
- ○ Yes - Multiple jurisdictions (20 points)

High-risk jurisdictions list available [Info icon]

**2. Product/Service Risk:**

Q3: **Which products will the client use?** (Multi-select)
- ☐ Long-term Insurance - Life (Low risk: 5 points)
- ☐ Long-term Insurance - Investment (Medium: 10 points)
- ☐ Investment Products (Medium: 10 points)
- ☐ Offshore Investments (High: 20 points)
- ☐ Derivatives (High: 25 points)

Q4: **Expected transaction volume?**
- ○ Low (< R50k p.a.) - 5 points
- ○ Medium (R50k - R200k p.a.) - 10 points
- ○ High (R200k - R1M p.a.) - 15 points
- ○ Very High (> R1M p.a.) - 25 points

**3. Customer Risk:**

Q5: **Is the client a Politically Exposed Person (PEP)?**
- ○ No (0 points)
- ○ Domestic PEP (25 points)
- ○ Foreign PEP (35 points)
- ○ Family member of PEP (20 points)
- ○ Close associate of PEP (15 points)

[What is a PEP?] information tooltip

Q6: **Does client hold or has held prominent public position?**
- ○ No (0 points)
- ○ Yes - Please specify: [text field] (20 points)

Q7: **Client's occupation classified as high-risk?**
- ○ No (0 points)
- ○ Cash-intensive business (15 points)
- ○ Arms/defense trading (25 points)
- ○ Precious metals/stones (20 points)
- ○ Money remittance (25 points)
- ○ Cryptocurrency (20 points)
- ○ Other high-risk: [specify] (15 points)

**4. Transaction/Delivery Channel Risk:**

Q8: **How will business be conducted?**
- ○ Face-to-face (0 points)
- ○ Remote (phone/email) within SA (5 points)
- ○ Remote from abroad (15 points)
- ○ Through intermediary (10 points)

Q9: **Payment methods?**
- ○ Bank transfer/debit order (0 points)
- ○ Credit card (5 points)
- ○ Cash payments (20 points)
- ○ Cryptocurrency (25 points)
- ○ Third-party payments (15 points)

**5. Additional Risk Factors:**

Q10: **Complexity of client structure?**
- ○ Simple - Individual (0 points)
- ○ Moderate - Trust beneficiary (10 points)
- ○ Complex - Multiple entities (20 points)
- ○ Very complex - Offshore structures (30 points)

Q11: **Source of wealth transparency?**
- ○ Clear and documented (0 points)
- ○ Partially unclear (10 points)
- ○ Unclear/Undocumented (25 points)

Q12: **Any adverse media/negative information?**
- ○ No (0 points)
- ○ Minor concerns (10 points)
- ○ Significant concerns (30 points)

**Real-time Risk Calculation Display:**

```
┌─────────────────────────────────────────────────┐
│ RISK BREAKDOWN                                  │
├─────────────────────────────────────────────────┤
│ Geographic Risk:        15 points (15%)         │
│ Product/Service Risk:   10 points (10%)         │
│ Customer Risk:           0 points (0%)          │
│ Channel Risk:            5 points (5%)          │
│ Additional Factors:      5 points (5%)          │
├─────────────────────────────────────────────────┤
│ TOTAL SCORE:            35 / 100                │
├─────────────────────────────────────────────────┤
│ RISK CLASSIFICATION:    LOW RISK (SDD)          │
│                                                  │
│ Due Diligence Required: Simplified (SDD)        │
│ Review Frequency:       5 years                 │
│ Enhanced Monitoring:    Not required            │
└─────────────────────────────────────────────────┘
```

**Risk Classification Bands:**
- 0-25 points: LOW RISK (SDD) - Simplified Due Diligence
- 26-50 points: STANDARD RISK (CDD) - Customer Due Diligence
- 51-75 points: HIGH RISK (EDD) - Enhanced Due Diligence
- 76-100 points: VERY HIGH RISK (EDD) - Requires senior approval

**Additional Documentation Requirements (if EDD):**

If score > 50 points, show additional requirements:
- Additional fields appear
- Enhanced document requirements
- Senior management approval required
- More detailed source of wealth documentation
- References required
- Enhanced ongoing monitoring consent

**Risk Mitigation Notes:**
- Text area for compliance officer notes
- Document mitigation measures
- Explain risk acceptance rationale

**Buttons:**
- [Primary] Next: Review & Submit
- [Secondary] Back
- [Secondary] Recalculate Risk
- [Secondary] Save Assessment
- [Link] Cancel

---

#### STEP 7: REVIEW & SUBMIT

**Complete Client Profile Summary**

**Section 1: Personal Information**
```
┌───────────────────────────────────────────────┐
│ PERSONAL DETAILS                  [Edit Step 1]│
├───────────────────────────────────────────────┤
│ Name:        Mr Thabo Johannes Mokoena        │
│ Date of Birth: 15/06/1985 (39 years old)     │
│ ID Number:   850615****083                    │
│ Gender:      Male                             │
│ Nationality: South African                    │
│ Marital:     Married (ANC)                    │
│ Dependants:  2                                │
│                                               │
│ Occupation:  Financial Manager                │
│ Employer:    ABC Corporation (Pty) Ltd        │
│ Tax Number:  9********1                       │
└───────────────────────────────────────────────┘
```

**Section 2: Contact Information**
```
┌───────────────────────────────────────────────┐
│ CONTACT DETAILS                   [Edit Step 2]│
├───────────────────────────────────────────────┤
│ Mobile:      +27 82 555 1234                  │
│ Email:       thabo.mokoena@email.com          │
│ Alt Email:   t.mokoena@work.co.za             │
│                                               │
│ Preferred:   Mobile Phone / Email             │
│ Best Time:   Afternoon (12:00-17:00)          │
│ Language:    English                          │
│                                               │
│ Emergency:   Nomsa Mokoena (Spouse)           │
│              +27 83 555 5678                  │
└───────────────────────────────────────────────┘
```

**Section 3: Identity Documents**
```
┌───────────────────────────────────────────────┐
│ IDENTITY VERIFICATION             [Edit Step 3]│
├───────────────────────────────────────────────┤
│ SA ID:       ✓ Verified - 850615****083       │
│              Front: ID_Front.pdf (1.2 MB)     │
│              Back:  ID_Back.pdf (1.1 MB)      │
│                                               │
│ Validation:  ✓ Valid format                   │
│              ✓ Valid checksum                 │
│              ✓ Matches DoB and gender         │
│              ✓ No duplicates found            │
│                                               │
│ Additional:  Driver_License.pdf (850 KB)      │
└───────────────────────────────────────────────┘
```

**Section 4: Address**
```
┌───────────────────────────────────────────────┐
│ RESIDENTIAL ADDRESS               [Edit Step 4]│
├───────────────────────────────────────────────┤
│ 45 Mountain View Road                         │
│ Rondebosch                                    │
│ Cape Town, 7700                               │
│ Western Cape, South Africa                    │
│                                               │
│ Duration:    3 years, 6 months                │
│ Proof:       ✓ Municipal_Bill.pdf (1.5 MB)    │
│              Date: 10/11/2024 (Valid)         │
│                                               │
│ Postal:      Same as residential              │
└───────────────────────────────────────────────┘
```

**Section 5: Financial Profile**
```
┌───────────────────────────────────────────────┐
│ FINANCIAL INFORMATION             [Edit Step 5]│
├───────────────────────────────────────────────┤
│ Annual Income: R450,000                       │
│ Source:        Employment Salary              │
│ Proof:         ✓ Payslip_Nov2024.pdf          │
│                                               │
│ Banking:       Standard Bank                  │
│ Account:       Cheque - ****1234              │
│ Proof:         ✓ Bank_Statement.pdf           │
│                                               │
│ Expected:      R3,500/month (Investments)     │
│ Frequency:     Monthly debit order            │
│                                               │
│ Foreign:       No foreign accounts            │
└───────────────────────────────────────────────┘
```

**Section 6: Risk Assessment**
```
┌───────────────────────────────────────────────┐
│ RISK ASSESSMENT                   [Edit Step 6]│
├───────────────────────────────────────────────┤
│ Risk Score:     35 / 100                      │
│ Classification: LOW RISK (SDD)                │
│                                               │
│ Geographic:     Low (SA resident)             │
│ Product:        Low (Life insurance)          │
│ Customer:       Low (No PEP, standard occ)    │
│ Channel:        Low (Face-to-face)            │
│                                               │
│ Due Diligence:  Simplified (SDD)              │
│ Review Period:  5 years (Next: 15/12/2029)    │
│ Monitoring:     Standard                      │
└───────────────────────────────────────────────┘
```

**Section 7: Screening Results**

Automated screening runs on submit:
```
┌───────────────────────────────────────────────┐
│ SCREENING STATUS                  [View Details]│
├───────────────────────────────────────────────┤
│ PEP Screening:       ✓ Clear (No matches)     │
│ Sanctions:           ✓ Clear (No matches)     │
│ Adverse Media:       ✓ Clear (No concerns)    │
│ Debarment:           ✓ Clear (Not listed)     │
│                                               │
│ Overall:             ✓ PASSED                 │
│ Last screened:       15/12/2024 11:45         │
└───────────────────────────────────────────────┘
```

**Section 8: Compliance Checklist**

Automated validation:
```
┌───────────────────────────────────────────────┐
│ FICA COMPLIANCE CHECKLIST                     │
├───────────────────────────────────────────────┤
│ ✓ Personal details captured and verified     │
│ ✓ ID document uploaded and validated         │
│ ✓ Proof of residence (< 3 months old)        │
│ ✓ Tax number validated                       │
│ ✓ Financial information documented           │
│ ✓ Source of funds verified                   │
│ ✓ Banking details confirmed                  │
│ ✓ Risk assessment completed                  │
│ ✓ Screening passed (No red flags)            │
│ ✓ All mandatory fields completed             │
│ ✓ All required documents uploaded            │
│                                               │
│ Status: ✓ READY FOR SUBMISSION                │
└───────────────────────────────────────────────┘
```

**Assignment & Notes:**

1. **Assign to Representative** (dropdown) - REQUIRED
   - Select primary representative
   - Auto-assigns to current user if rep
   - Must have appropriate authorizations

2. **Secondary Representative** (dropdown) - Optional
   - For servicing backup

3. **Product(s) to Apply For** (checkboxes)
   - ☐ Long-term Insurance
   - ☐ Investment Products
   - ☐ Pension/Retirement Annuity
   - ☐ Short-term Insurance
   - Initial product consultation

4. **Internal Notes** (textarea) - Optional
   - Notes for compliance/internal use
   - Not visible to client
   - 500 character limit

5. **Client Onboarding Notes** (textarea) - Optional
   - Client-facing notes
   - 500 character limit

**Compliance Officer Review (if required):**

For EDD clients or company policy:
- Checkbox: ☐ Send to Compliance Officer for approval
- Auto-checked if risk score > 50
- Compliance Officer: [Select from list]
- Priority: Normal | High | Urgent

**Final Verification:**

**Verified By:**
- Name: Sarah Naidoo (Compliance Officer)
- Date: 15/12/2024
- Time: 11:45

**Declaration:**
☐ I confirm that all information provided is accurate and complete
☐ I have verified the client's identity documents
☐ I have conducted the required due diligence
☐ I understand this client profile will be submitted for approval

**Action Buttons:**

**Primary Actions:**
- [Large Primary Button] Submit Client for Approval
- [Secondary Button] Save as Draft
- [Secondary Button] Print Summary
- [Secondary Button] Export to PDF

**Secondary Actions:**
- [Link] Back to Edit
- [Link] Start Over
- [Link] Cancel Onboarding

**Submission Confirmation Modal:**

After clicking Submit:
```
┌───────────────────────────────────────────────┐
│           CLIENT SUCCESSFULLY CREATED         │
├───────────────────────────────────────────────┤
│                                               │
│  ✓ Client Reference: CLT-2024-00248           │
│  ✓ FICA Status: Verified and Compliant       │
│  ✓ Risk Level: Low (SDD)                      │
│  ✓ Assigned to: Sarah Naidoo                  │
│  ✓ Next Review Date: 15/12/2029               │
│                                               │
│  Welcome email sent to:                       │
│  thabo.mokoena@email.com                      │
│                                               │
│  [View Client Profile]                        │
│  [Create Client Document]                     │
│  [Add Another Client]                         │
│  [Return to Dashboard]                        │
│                                               │
└───────────────────────────────────────────────┘
```

---

## 4. FICA VERIFICATION TAB

(For existing clients requiring FICA update/review)

### Verification Queue Overview

**Stats Cards:**

**Card 1: Pending Verifications**
- Number: 13
- Icon: Clock
- Types:
  - New clients: 5
  - Updates required: 3
  - Annual reviews: 5
- Status: Requires attention

**Card 2: In Progress**
- Number: 4
- Icon: Spinner
- Average time in queue: 2 days
- Assigned to team members

**Card 3: Completed Today**
- Number: 7
- Icon: Check-circle
- Success rate: 100%

**Card 4: Overdue**
- Number: 2
- Icon: Alert-triangle
- Requires immediate action
- Escalation level: High

### Filter & Sort Panel

**Status Filter:**
- ☐ Awaiting Documents (5)
- ☐ Ready for Review (8)
- ☐ In Progress (4)
- ☐ Pending Approval (2)

**Risk Level:**
- ☐ High Risk (EDD) (1)
- ☐ Standard (CDD) (9)
- ☐ Low (SDD) (3)

**Assigned To:**
- ☐ Me (6)
- ☐ Unassigned (4)
- ☐ Team members

**Sort By:**
- Date Submitted (Newest/Oldest)
- Priority (High to Low)
- Client Name (A-Z)
- Days in Queue

### Verification Queue List

**List Item Structure:**

**Item 1: Ready for Review**
```
┌──────────────────────────────────────────────────────┐
│ ⭐ Priority: HIGH                                     │
│ CLT-2024-00245 | Johan van Zyl                       │
│ 780312****901                                        │
├──────────────────────────────────────────────────────┤
│ Status: ✓ Ready for Review                           │
│ Risk: Medium (CDD)                                   │
│ Progress: ████████████████████ 100%                  │
│ Documents: All received ✓                            │
│ Days in Queue: 3 days                                │
│ Assigned to: You (Sarah Naidoo)                      │
├──────────────────────────────────────────────────────┤
│ [Review Now] [View Documents] [Assign] [More ▼]      │
└──────────────────────────────────────────────────────┘
```

**Item 2: Awaiting Documents**
```
┌──────────────────────────────────────────────────────┐
│ Priority: Standard                                   │
│ CLT-2024-00246 | Mary Johnson (Foreign)              │
│ Passport: B1234567                                   │
├──────────────────────────────────────────────────────┤
│ Status: ⏳ Awaiting Documents                         │
│ Risk: High (EDD) - Cross-border                      │
│ Progress: ██████████░░░░░░░░░░ 50%                   │
│ Missing: Proof of residence, Bank statement          │
│ Days in Queue: 10 days ⚠️                             │
│ Assigned to: Unassigned                              │
├──────────────────────────────────────────────────────┤
│ [Request Docs] [Assign to Me] [Contact Client]       │
└──────────────────────────────────────────────────────┘
```

**Item 3: In Progress**
```
┌──────────────────────────────────────────────────────┐
│ Priority: Standard                                   │
│ CLT-2024-00247 | Sipho Ndlovu                        │
│ 850714****123                                        │
├──────────────────────────────────────────────────────┤
│ Status: 🔄 In Progress                                │
│ Risk: Low (SDD)                                      │
│ Progress: ███████████████░░░░░ 75%                   │
│ Last Activity: 2 hours ago                           │
│ Days in Queue: 1 day                                 │
│ Assigned to: Thabo Mokoena                           │
├──────────────────────────────────────────────────────┤
│ [View Progress] [Take Over] [View Documents]         │
└──────────────────────────────────────────────────────┘
```

### Bulk Actions

When selecting multiple items:
- [Assign to Representative]
- [Send Reminder]
- [Request Documents]
- [Export Selected]
- [Generate Report]

### Quick Actions Panel
- [Primary] Start New Verification
- [Secondary] Assign Unassigned
- [Secondary] Bulk Send Reminders
- [Link] View Completed

---

## 5. RISK ASSESSMENT TAB

### Risk Distribution Dashboard

**Visual Overview:**

**Large Donut Chart: Clients by Risk Level**
```
┌─────────────────────────────────────┐
│                                     │
│         ╱───────────╲               │
│       ╱   235/248    ╲              │
│      │   COMPLIANT   │              │
│       ╲             ╱               │
│         ╲─────────╱                 │
│                                     │
│  ▇ Low (SDD): 180 (73%)             │
│  ▇ Standard (CDD): 48 (19%)         │
│  ▇ High (EDD): 8 (3%)               │
│  ▇ Not Assessed: 12 (5%)            │
│                                     │
└─────────────────────────────────────┘
```

**Risk Metrics Cards:**

**Card 1: Average Risk Score**
- Score: 28.5 / 100
- Trend: ↓ 3 points (improving)
- Status: Low Risk Portfolio
- Last assessment: 15/12/2024

**Card 2: EDD Clients**
- Count: 8 clients (3%)
- Requiring enhanced monitoring
- All reviews up to date: ✓
- Action: [View All EDD]

**Card 3: Risk Reviews Due**
- This month: 12 reviews
- Overdue: 2 reviews ⚠️
- Upcoming 90 days: 45 reviews
- Action: [View Schedule]

**Card 4: Risk Alerts**
- Active alerts: 3
- New this week: 1
- Requiring action: 2
- Action: [View Alerts]

### Risk Factor Analysis

**Interactive Charts:**

**By Geographic Risk (Bar Chart):**
- SA only: 220 clients (89%)
- Cross-border (low risk): 15 clients (6%)
- Cross-border (high risk): 8 clients (3%)
- Multiple jurisdictions: 5 clients (2%)

**By Transaction Volume (Horizontal Bar):**
- Low (< R50k): 180 clients (73%)
- Medium (R50k-R200k): 48 clients (19%)
- High (R200k-R1M): 15 clients (6%)
- Very High (> R1M): 5 clients (2%)

**By Occupation Type:**
- Standard: 225 clients (91%)
- Cash-intensive: 12 clients (5%)
- Other high-risk: 11 clients (4%)

**By Source of Wealth:**
- Employment: 190 clients (77%)
- Business: 35 clients (14%)
- Investment income: 15 clients (6%)
- Other: 8 clients (3%)

### High-Risk Clients Section

**EDD Clients Table:**

**Table Columns:**
| Client Name | Risk Score | PEP Status | Risk Factors | EDD Status | Last Review | Next Review | Actions |

**Sample Row 1:**
- Lerato Dlamini
- 82/100 (High)
- 🚩 Yes - Domestic PEP
- PEP, High transactions, Foreign ties
- ✓ Complete (All EDD docs)
- 01/11/2024
- 01/02/2025 (60 days)
- [View Profile] [Review EDD] [Download Report]

**Sample Row 2:**
- Mary Johnson
- 75/100 (High)
- No PEP
- Cross-border, Multiple jurisdictions
- ⚠️ Incomplete (Awaiting docs)
- Never
- Pending completion
- [Complete EDD] [Request Docs] [Contact]

**Risk Factor Tags:**
- 🚩 PEP (Politically Exposed Person)
- 🚩 High Transaction Volume
- 🚩 Cross-border Activities
- 🚩 Cash-Intensive Business
- 🚩 Complex Ownership
- 🚩 Adverse Media
- 🚩 Multiple Jurisdictions
- 🚩 Foreign Accounts

### Risk Assessment Tools

**Tool Panel:**

**1. Conduct Manual Risk Assessment**
- Button: [+ Assess Client Risk]
- Opens comprehensive risk questionnaire
- Real-time scoring
- Generates detailed report
- Save and track changes

**2. Bulk Risk Re-assessment**
- Select criteria for bulk reassessment
- Choose clients by:
  * Last assessment date
  * Risk level
  * Representative
  * Product type
- [Run Bulk Assessment]
- Queue for review

**3. Risk Monitoring Dashboard**
- Real-time alerts
- Trigger-based notifications
- Automatic escalations
- Compliance officer dashboard

**4. Risk Reports Generator**
- Risk distribution report
- EDD compliance report
- Risk trend analysis
- Comparative benchmarking

### Risk Matrix Visualization

**Interactive 2D Matrix:**

**Axes:**
- X-axis: Transaction Volume (Low → High)
- Y-axis: Geographic Risk (Low → High)

**Matrix Cells:**
Each cell displays:
- Number of clients
- Recommended DD level
- Click to see client list

**Example Cell (High/High):**
```
┌────────────────────┐
│  3 Clients         │
│  EDD Required      │
│  [View Clients]    │
└────────────────────┘
```

### Risk Alerts & Triggers

**Active Alerts Panel:**

**Alert 1: Risk Level Change**
```
┌─────────────────────────────────────────────┐
│ ⚠️ RISK LEVEL UPGRADED                      │
├─────────────────────────────────────────────┤
│ Client: Sipho Ndlovu                        │
│ Previous: Low Risk (25 points)              │
│ Current: Standard Risk (45 points)          │
│ Reason: Transaction volume increased        │
│ Trigger Date: 10/12/2024                    │
│ Action Required: Upgrade to CDD             │
├─────────────────────────────────────────────┤
│ [Review Client] [Conduct CDD] [Dismiss]     │
└─────────────────────────────────────────────┘
```

**Alert 2: EDD Review Overdue**
```
┌─────────────────────────────────────────────┐
│ 🚨 OVERDUE EDD REVIEW                       │
├─────────────────────────────────────────────┤
│ Client: Lerato Dlamini                      │
│ Risk: High (EDD)                            │
│ Last Review: 3 months ago                   │
│ Required Frequency: Quarterly               │
│ Days Overdue: 15 days                       │
│ Priority: CRITICAL                          │
├─────────────────────────────────────────────┤
│ [Schedule Review] [Conduct Now] [Escalate]  │
└─────────────────────────────────────────────┘
```

**Alert 3: PEP Screening Hit**
```
┌─────────────────────────────────────────────┐
│ 🚩 NEW PEP MATCH IDENTIFIED                 │
├─────────────────────────────────────────────┤
│ Client: Johan van der Merwe                 │
│ Match Type: Possible PEP                    │
│ Source: Updated PEP database                │
│ Confidence: 85% match                       │
│ Current Risk: Standard (CDD)                │
│ Action: Review and upgrade to EDD if valid  │
├─────────────────────────────────────────────┤
│ [Review Match] [Upgrade Risk] [False +]     │
└─────────────────────────────────────────────┘
```

### Risk Mitigation Tracking

**For High-Risk Clients:**

**Mitigation Measures Table:**
| Client | Risk Factor | Mitigation Implemented | Status | Date | Review Date |

**Sample Row:**
- Lerato Dlamini
- PEP Status
- Enhanced monitoring, Quarterly reviews, Source of wealth verified
- ✓ Active
- 01/11/2024
- 01/02/2025

**Document Tracking:**
- Track additional EDD documentation
- Monitor compliance with mitigation plan
- Approval workflow for high-risk acceptance

---

## 6. REVIEWS & MONITORING TAB

### Review Schedule Dashboard

**Overview Metrics:**

**Card 1: This Month**
- Reviews due: 12
- Completed: 5 (42%)
- In progress: 2
- Not started: 5
- Status: On track

**Card 2: Overdue**
- Count: 5 reviews
- High risk: 2 (Critical)
- Standard: 3 (Important)
- Average delay: 18 days
- Status: Action required

**Card 3: Next 90 Days**
- Scheduled: 45 reviews
- High risk (EDD): 6
- Standard (CDD): 25
- Low risk (SDD): 14
- Status: Plan ahead

**Card 4: Compliance Rate**
- On-time reviews: 95%
- Target: 98%
- Trend: ↑ Improving
- Status: Good

### Review Calendar

**Monthly Calendar View:**

```
December 2024
─────────────────────────────────────────
Mon  Tue  Wed  Thu  Fri  Sat  Sun
                         1    2    3
 4    5    6    7    8    9   10
11   12   13   14   15   16   17
18   19●  20●● 21   22●  23   24
25   26   27   28   29   30   31
─────────────────────────────────────────
● = Reviews scheduled
●● = Multiple reviews
```

**Legend:**
- 🟢 Completed
- 🔵 Scheduled
- 🟡 Due soon (< 7 days)
- 🔴 Overdue

**Calendar Controls:**
- [Today] [← Previous Month] [Next Month →]
- [Week View] [Month View] [List View]
- [Export Schedule]

**Upcoming Reviews (Next 7 Days):**

**Review 1:**
- Date: 19/12/2024
- Client: Johan Smit
- Type: Annual CDD Review
- Risk: Standard
- Assigned: Sarah Naidoo
- Status: Scheduled
- [Start Review] [Reschedule] [View Client]

**Review 2:**
- Date: 20/12/2024
- Client: Mary Johnson
- Type: Quarterly EDD Review
- Risk: High
- Assigned: Compliance Officer
- Status: Documents ready
- [Start Review] [View Documents]

**Review 3:**
- Date: 22/12/2024
- Client: Thandi Nkosi
- Type: Document Renewal
- Risk: Low
- Assigned: Thabo Mokoena
- Status: Pending contact
- [Contact Client] [Postpone]

### Review Types & Frequencies

**Automatic Scheduling Rules:**

**Low Risk (SDD):**
- Frequency: Every 5 years
- Documents: Basic ID and address verification
- Approval: Representative level
- Monitoring: Minimal

**Standard Risk (CDD):**
- Frequency: Annually
- Documents: ID, address, financial update
- Approval: Compliance Officer
- Monitoring: Standard

**High Risk (EDD):**
- Frequency: Quarterly (every 3 months)
- Documents: Full EDD documentation refresh
- Approval: Senior Management
- Monitoring: Enhanced, continuous

**Trigger-Based Reviews:**
- Transaction pattern changes
- Address changes
- Product additions
- Risk factor changes
- Regulatory updates

### Conduct Review Workflow

**Review Process Steps:**

**Step 1: Review Preparation**
- Pull client file
- Review last assessment
- Check for changes
- Gather required documents
- Pre-populate form with existing data

**Step 2: Client Contact**
- Send review notification
- Request updated documents
- Schedule call/meeting (if needed)
- Confirm client details

**Step 3: Document Verification**
- ID document (check expiry)
- Proof of address (< 3 months)
- Financial information (update if changed)
- Bank statement (recent)
- Additional EDD docs (if applicable)

**Step 4: Information Update**
- Review personal details
- Update contact information
- Verify address
- Update employment/income
- Review product holdings

**Step 5: Risk Re-assessment**
- Re-run risk scoring
- Check for PEP status changes
- Screen against updated lists
- Assess transaction patterns
- Update risk level if needed

**Step 6: Compliance Check**
- Verify all documents current
- Check screening results
- Review mitigation measures (if EDD)
- Confirm regulatory compliance
- Document findings

**Step 7: Approval & Sign-off**
- Representative review
- Compliance Officer approval (if needed)
- Senior Management (for EDD)
- Document approval in system
- Set next review date

**Review Form (Simplified Example):**

```
┌──────────────────────────────────────────────┐
│ ANNUAL FICA REVIEW                           │
├──────────────────────────────────────────────┤
│ Client: Thabo Mokoena                        │
│ Client Ref: CLT-2024-00248                   │
│ Review Type: Annual CDD Review               │
│ Risk Level: Standard (CDD)                   │
│ Last Review: 15/12/2023                      │
│ Review Due: 15/12/2024                       │
├──────────────────────────────────────────────┤
│                                              │
│ 1. CLIENT CONFIRMATION                       │
│ ☐ Client contacted and responsive            │
│ Contact date: [___________]                  │
│ Contact method: [Dropdown]                   │
│                                              │
│ 2. DOCUMENT VERIFICATION                     │
│ ☐ ID document valid (not expired)            │
│ ☐ Proof of address (< 3 months old)          │
│ ☐ Bank statement (recent)                    │
│ ☐ Financial information updated              │
│                                              │
│ 3. INFORMATION UPDATE                        │
│ ☐ No changes to personal details             │
│ ☐ Address unchanged                          │
│ ☐ Employment unchanged                       │
│ ☐ Income/financial status unchanged          │
│ If changes: [Document changes]               │
│                                              │
│ 4. RISK RE-ASSESSMENT                        │
│ Previous Risk Score: 35                      │
│ New Risk Score: [Auto-calculated]            │
│ Risk Level: [Standard]                       │
│ ☐ No risk level change                       │
│ ☐ Risk level changed (explain)               │
│                                              │
│ 5. SCREENING RESULTS                         │
│ ☐ PEP screening: Clear                       │
│ ☐ Sanctions screening: Clear                 │
│ ☐ Adverse media: Clear                       │
│                                              │
│ 6. COMPLIANCE FINDINGS                       │
│ ☐ All documentation current and valid        │
│ ☐ No red flags identified                    │
│ ☐ Client remains compliant                   │
│                                              │
│ 7. REVIEWER NOTES                            │
│ [Text area for additional notes]             │
│                                              │
│ 8. NEXT REVIEW                               │
│ Next review date: 15/12/2025                 │
│ Review type: Annual CDD                      │
│ Reminder date: 15/11/2025                    │
│                                              │
├──────────────────────────────────────────────┤
│ Reviewed by: Sarah Naidoo                    │
│ Review date: 15/12/2024                      │
│ Time: 14:30                                  │
│                                              │
│ [Complete Review] [Save Draft] [Cancel]      │
└──────────────────────────────────────────────┘
```

### Monitoring & Alerts

**Ongoing Monitoring Dashboard:**

**Automated Monitoring:**
- Transaction pattern analysis
- Unusual activity alerts
- Document expiry warnings
- Risk trigger monitoring
- Regulatory updates

**Alert Types:**

**1. Document Expiry Alerts**
- 90 days before expiry: Info
- 30 days before: Warning
- Expired: Critical

**2. Transaction Alerts**
- Large transactions (threshold-based)
- Unusual patterns
- Cross-border activity
- Cash transactions

**3. Risk Change Alerts**
- Automatic risk re-calculation triggers
- PEP status changes
- Sanctions list matches
- Adverse media

**4. Review Reminders**
- 30 days before due date
- 7 days before
- On due date
- Overdue escalation

### Review Reports

**Report Types:**

**1. Review Completion Report**
- Reviews completed in period
- By representative
- By risk level
- Compliance rate

**2. Overdue Reviews Report**
- List of overdue reviews
- Days overdue
- Priority level
- Assigned officers

**3. Risk Level Changes**
- Clients with changed risk levels
- Upgrade/downgrade reasons
- Impact analysis

**4. FSCA Compliance Report**
- Overall FICA compliance status
- Review completion rates
- Risk distribution
- Remediation actions

---

## 7. REPORTS & ANALYTICS TAB

### Report Categories

**Report Type Selector (Cards):**

### CLIENT REPORTS

**Report 1: Client Portfolio Summary**
- Icon: Users
- Description: "Complete overview of client base"
- Includes:
  * Total clients breakdown
  * By representative
  * By risk level
  * By product type
  * Portfolio values
- Options:
  * Date range
  * Filter by criteria
  * Include charts
- Format: PDF | Excel
- [Generate Report]

**Report 2: Individual Client Report**
- Icon: User
- Description: "Comprehensive report for single client"
- Select client: [Dropdown]
- Includes:
  * Personal details
  * FICA compliance status
  * Documents
  * Risk assessment
  * Review history
  * Screening results
  * Transaction summary
- Format: PDF (Official)
- [Generate Report]

### FICA COMPLIANCE REPORTS

**Report 3: FICA Compliance Summary**
- Icon: Shield-check
- Description: "Overall FICA compliance status"
- Includes:
  * Verification rate
  * Compliance by risk level
  * Pending verifications
  * Overdue reviews
  * Document status
- Period: [Date range]
- Include: ☐ Executive summary ☐ Charts ☐ Details
- Format: PDF | Excel
- [Generate Report]

**Report 4: FICA Review Schedule**
- Icon: Calendar
- Description: "Upcoming and overdue reviews"
- Time period: [Dropdown: This month | Quarter | Year | Custom]
- Filter by:
  * Risk level
  * Representative
  * Status (Due/Overdue/Complete)
- Include: ☐ Only overdue ☐ Next 90 days
- Format: PDF | Excel
- [Generate Report]

**Report 5: FSCA Compliance Certificate**
- Icon: Award
- Description: "Official compliance certificate for FSCA"
- Auto-generated quarterly
- Includes:
  * FSP details
  * Compliance metrics
  * Verification rates
  * Risk management
  * Compliance officer sign-off
- Format: PDF (Official, watermarked)
- [Generate Certificate]

### RISK REPORTS

**Report 6: Risk Assessment Report**
- Icon: Alert-triangle
- Description: "Risk distribution and analysis"
- Includes:
  * Risk level distribution
  * Risk factor analysis
  * High-risk clients detail
  * EDD compliance status
  * Risk trends
- Period: [Date range]
- Breakdown by: ☐ Rep ☐ Product ☐ Geography
- Format: PDF | Excel
- [Generate Report]

**Report 7: High-Risk (EDD) Clients Report**
- Icon: Shield-alert
- Description: "Detailed report on all EDD clients"
- Includes:
  * Client details
  * Risk scores and factors
  * EDD documentation status
  * Review compliance
  * Mitigation measures
  * Monitoring notes
- Filter: ☐ PEP only ☐ All high-risk
- Format: PDF | Excel
- [Generate Report]

### SCREENING REPORTS

**Report 8: Screening Results Report**
- Icon: Search
- Description: "PEP, sanctions, adverse media screening"
- Screening type:
  * ☐ PEP Screening
  * ☐ Sanctions Lists
  * ☐ Adverse Media
  * ☐ All
- Period: [Date range]
- Results: ☐ All ☐ Matches only ☐ Under investigation
- Format: PDF | Excel
- [Generate Report]

**Report 9: PEP Client Report**
- Icon: Shield
- Description: "All PEP clients and monitoring status"
- Includes:
  * PEP client list
  * PEP status (Domestic/Foreign/Associate)
  * Positions held
  * EDD compliance
  * Monitoring frequency
  * Last review dates
- Format: PDF | Excel
- [Generate Report]

### COMPLIANCE & AUDIT REPORTS

**Report 10: Audit Trail Report**
- Icon: File-text
- Description: "Complete audit trail for FSCA inspection"
- Period: [Date range]
- Includes:
  * All client activities
  * Document uploads
  * Reviews conducted
  * Risk assessments
  * Screening results
  * Approvals
  * User actions
- Select clients: ☐ All ☐ Selected [Dropdown]
- Format: PDF (Comprehensive)
- [Generate Report]

**Report 11: Non-Compliance Report**
- Icon: X-circle
- Description: "Clients with compliance issues"
- Issue types:
  * ☐ Incomplete FICA
  * ☐ Expired documents
  * ☐ Overdue reviews
  * ☐ Missing information
  * ☐ Failed screening
- Priority: ☐ All ☐ Critical only
- Format: Excel (Action list)
- [Generate Report]

**Report 12: Document Status Report**
- Icon: File
- Description: "Overview of document compliance"
- Includes:
  * Documents by type
  * Expiring soon (< 90 days)
  * Expired documents
  * Missing documents
  * Upload statistics
- Filter by: Client | Rep | Document type
- Format: PDF | Excel
- [Generate Report]

### REPRESENTATIVE REPORTS

**Report 13: Representative Performance**
- Icon: User-check
- Description: "Representative client management metrics"
- Select representative: [Dropdown]
- Includes:
  * Client portfolio size
  * FICA compliance rate
  * Reviews completed on time
  * Document quality
  * Response times
- Period: [Date range]
- Format: PDF
- [Generate Report]

### ANALYTICS & TRENDS

**Report 14: Client Trend Analysis**
- Icon: Trending-up
- Description: "Client base growth and trends"
- Includes:
  * New clients over time
  * Client retention
  * Risk level trends
  * Product adoption
  * Portfolio value growth
- Period: [Date range]
- Charts: ☐ Line graphs ☐ Bar charts ☐ Pie charts
- Format: PDF with charts
- [Generate Report]

### Report Generation Interface

**After Selecting Report Type:**

```
┌──────────────────────────────────────────────┐
│ GENERATE REPORT: FICA Compliance Summary     │
├──────────────────────────────────────────────┤
│                                              │
│ 1. REPORT CONFIGURATION                      │
│                                              │
│ Report Title: [Edit field - pre-filled]      │
│                                              │
│ Date Range:                                  │
│ From: [01/12/2024] To: [15/12/2024]          │
│ Or select: [This Month▼]                     │
│                                              │
│ 2. FILTERS & PARAMETERS                      │
│                                              │
│ Representatives:                             │
│ ☐ All Representatives                        │
│ ☐ Selected: [Multi-select dropdown]          │
│                                              │
│ Risk Levels:                                 │
│ ☑ Low (SDD)                                  │
│ ☑ Standard (CDD)                             │
│ ☑ High (EDD)                                 │
│                                              │
│ Client Status:                               │
│ ☑ Active  ☐ Inactive  ☐ Pending             │
│                                              │
│ 3. INCLUDE OPTIONS                           │
│                                              │
│ ☑ Executive Summary                          │
│ ☑ Detailed Findings                          │
│ ☑ Charts and Graphs                          │
│ ☐ Supporting Documents                       │
│ ☑ Client Details                             │
│ ☐ Compliance Officer Notes                   │
│ ☑ Recommendations                            │
│                                              │
│ 4. FORMAT & DELIVERY                         │
│                                              │
│ Format:                                      │
│ ○ PDF (recommended for distribution)         │
│ ○ Excel (for data analysis)                  │
│ ○ Both formats                               │
│                                              │
│ Page Setup:                                  │
│ Orientation: ○ Portrait  ○ Landscape         │
│ Paper Size: [A4 ▼]                           │
│                                              │
│ Distribution:                                │
│ Email to: [sarah.naidoo@customapp.co.za]     │
│          [Add more recipients]               │
│                                              │
│ ☐ Save to document library                   │
│ ☐ Schedule recurring report                  │
│    Frequency: [Monthly ▼]                    │
│                                              │
│ 5. PREVIEW & GENERATE                        │
│                                              │
│ [Preview section showing report structure]   │
│ Estimated pages: 12                          │
│ Estimated size: 2.4 MB                       │
│ Generation time: ~30 seconds                 │
│                                              │
├──────────────────────────────────────────────┤
│ [Generate Report] [Preview] [Save Config]    │
│ [Reset] [Cancel]                             │
└──────────────────────────────────────────────┘
```

### Report Generation Progress

```
┌──────────────────────────────────────────────┐
│ GENERATING REPORT                            │
├──────────────────────────────────────────────┤
│                                              │
│ ████████████████░░░░░░░░░░░░ 60%             │
│                                              │
│ ✓ Gathering data...                          │
│ ✓ Processing client records...               │
│ ⏳ Generating charts...                       │
│ ⏳ Creating PDF...                            │
│ ⏳ Finalizing report...                       │
│                                              │
│ Please wait, this may take a moment...       │
│                                              │
└──────────────────────────────────────────────┘
```

### Report Completion

```
┌──────────────────────────────────────────────┐
│ ✓ REPORT GENERATED SUCCESSFULLY              │
├──────────────────────────────────────────────┤
│                                              │
│ Report: FICA_Compliance_Summary_Dec2024.pdf  │
│ Size: 2.4 MB                                 │
│ Pages: 12                                    │
│ Generated: 15/12/2024 15:30                  │
│                                              │
│ [View Report] [Download] [Email] [Print]     │
│                                              │
│ [Generate Another] [Return to Dashboard]     │
│                                              │
└──────────────────────────────────────────────┘
```

### Report History

**Table of Previously Generated Reports:**

**Columns:**
| Report Name | Type | Generated By | Date/Time | Format | Size | Status | Actions |

**Sample Rows:**

Row 1:
- FICA Compliance Summary Dec 2024
- Compliance Summary
- Sarah Naidoo
- 15/12/2024 15:30
- PDF
- 2.4 MB
- Available
- [View] [Download] [Email] [Regenerate] [Delete]

Row 2:
- High-Risk Clients Q4 2024
- Risk Report
- Compliance Officer
- 01/12/2024 10:15
- Excel
- 856 KB
- Available
- [View] [Download] [Email] [Delete]

Row 3:
- Client Portfolio Nov 2024
- Client Report
- System (Scheduled)
- 30/11/2024 23:00
- PDF
- 3.1 MB
- Archived
- [View] [Download] [Restore]

**Filters:**
- Report type: [All Types ▼]
- Date range: [Last 30 days ▼]
- Generated by: [All Users ▼]
- Status: [All | Available | Archived]

**Storage Management:**
- Total reports: 145
- Storage used: 125 MB / 1 GB (12%)
- Auto-archive after: 6 months
- [Manage Storage]

### Scheduled Reports

**Recurring Report Configuration:**

```
┌──────────────────────────────────────────────┐
│ SCHEDULED REPORTS                            │
├──────────────────────────────────────────────┤
│                                              │
│ Report 1: Monthly Compliance Report          │
│ Type: FICA Compliance Summary                │
│ Frequency: Monthly (1st of month)            │
│ Recipients: FSP Owner, Compliance Officer    │
│ Last sent: 01/12/2024                        │
│ Next: 01/01/2025                             │
│ Status: ✓ Active                             │
│ [Edit] [Pause] [Delete]                      │
│                                              │
│ ──────────────────────────────────────────   │
│                                              │
│ Report 2: Weekly Review Summary              │
│ Type: Review Schedule Report                 │
│ Frequency: Weekly (Monday 08:00)             │
│ Recipients: All Representatives              │
│ Last sent: 11/12/2024                        │
│ Next: 18/12/2024                             │
│ Status: ✓ Active                             │
│ [Edit] [Pause] [Delete]                      │
│                                              │
│ ──────────────────────────────────────────   │
│                                              │
│ [+ Schedule New Report]                      │
│                                              │
└──────────────────────────────────────────────┘
```

---

## TECHNICAL FEATURES & IMPLEMENTATION DETAILS

### Data Validation & Business Rules

**SA ID Number Validation:**
```javascript
// Implement Luhn algorithm for checksum
// Extract: DOB (digits 1-6), Gender (digit 7), Citizenship (digits 11-12)
// Validate format: YYMMDD SSSS C A Z
// Real-time validation as user types
```

**Risk Scoring Algorithm:**
```javascript
// Weighted scoring system
// Geographic risk: 0-35 points
// Product risk: 0-25 points
// Customer risk: 0-30 points
// Channel risk: 0-10 points
// Total: 0-100 points
// Classification bands: 0-25 (SDD), 26-50 (CDD), 51+ (EDD)
```

**Document Validation:**
```javascript
// Proof of residence: Max 3 months old
// ID documents: Non-expired (smart cards)
// File size: Max 5MB per file
// Formats: PDF, JPG, PNG only
// OCR extraction for ID documents
```

### Role-Based Access Control (RBAC)

**Permission Matrix:**

**FSP Owner/Principal:**
- All clients: Full access (CRUD)
- All reports: Full access
- Risk assessments: View, edit, approve
- Verifications: View, conduct, approve
- EDD approvals: Required for high-risk

**Key Individual:**
- Supervised reps' clients: Full access
- Team reports: Full access
- Own team assessments: View, edit
- Team verifications: View, conduct
- Limited EDD approval

**Compliance Officer:**
- All clients: View only (personal data)
- FICA workflows: Full access
- Risk assessments: Full access
- Verifications: Conduct, approve
- All reports: Generate, view
- EDD: Full access

**Representative:**
- Own clients only: Full access
- Add clients: With approval
- FICA for own clients: Conduct
- Own client reports: Generate
- No bulk operations

**Admin Staff:**
- All clients: Read-only
- Documents: Upload only
- Reports: Basic reports only
- No approval authority

### Notification System

**Email Notifications:**
- New client assigned
- FICA review due (30, 7, 0 days before)
- Document expiring (90, 30, 0 days)
- Risk level change
- Approval required
- Review completed
- Overdue alerts

**In-App Notifications:**
- Badge counters on tabs
- Toast messages for actions
- Alert panels for critical items
- Dashboard notifications
- Real-time updates

**SMS Alerts (Optional):**
- Critical overdue items
- Urgent approvals needed
- High-risk client alerts

### Document Management

**Upload Features:**
- Drag & drop interface
- Multiple file upload
- File preview generation
- OCR for ID extraction
- Version control
- Secure storage
- Access logging
- 5-year retention
- Auto-archive

**Supported Formats:**
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Images: JPG, JPEG, PNG, GIF
- Max size: 5MB per file
- Virus scanning on upload

### Search & Filter

**Advanced Search:**
- Full-text search
- Filter combinations
- Saved searches
- Quick filters
- Sort options
- Export results
- Real-time results

**Search Fields:**
- Name (partial match)
- ID/Passport number
- Phone number
- Email address
- Policy number
- Client reference
- Representative
- Address

### Performance Optimization

**Frontend:**
- Lazy loading for lists
- Pagination (50 items default)
- Cached data where appropriate
- Debounced search
- Optimized images
- Minimal reloads

**Backend (Simulated):**
- Indexed searches
- Background processing for reports
- Async document processing
- Caching for frequent queries

### Responsive Design

**Mobile Optimization:**
- Mobile-first approach
- Touch-friendly controls
- Swipeable cards
- Collapsible sections
- Mobile document upload (camera)
- Responsive tables → cards
- Bottom navigation on mobile

**Breakpoints:**
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Accessibility

**WCAG 2.1 AA Compliance:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Screen reader compatibility
- Focus indicators
- High contrast mode option
- Font size adjustment
- Alt text for images
- Form field labels
- Error announcements

### Security Features

**Data Protection:**
- Encrypted storage
- Masked sensitive data (ID numbers)
- Secure document viewing
- Access logging
- Session management
- Auto-logout (inactivity)
- Password strength requirements
- Two-factor authentication (optional)

**Audit Trail:**
- Complete activity log
- User actions tracked
- IP address logging
- Before/after values for changes
- Document access log
- Export audit trail for compliance

### Integration Points

**Future API Integrations:**
- PEP screening services
- Sanctions list databases
- Credit bureaus
- Deeds Office
- CIPC (company records)
- Email/SMS gateways
- Document signing services

### Sample Data

**Current Date:** 15/12/2024

**Client Statistics:**
- Total Clients: 248
- Active: 235 (95%)
- FICA Verified: 235 (95%)
- Pending: 13 (5%)
- High Risk (EDD): 8 (3%)

**Representatives:**
- Sarah Naidoo: 85 clients
- Thabo Mokoena: 72 clients
- Pieter Vermeulen: 54 clients
- Johan Smith: 37 clients

**Sample Clients:**

**1. Thabo Johannes Mokoena**
- ID: 8506155800083
- Status: ✓ Verified
- Risk: Medium (CDD)
- Products: LT Insurance, Investments
- Portfolio: R1.2M
- Representative: Sarah Naidoo
- Last Review: 15/11/2024
- Next Review: 15/11/2025

**2. Lerato Dlamini**
- ID: 9205086789012
- Status: ✓ Verified
- Risk: High (EDD) - 🚩 PEP
- Position: Deputy Director, Dept of Finance
- Products: LT Insurance
- Portfolio: R4.5M
- Representative: Thabo Mokoena
- Last Review: 01/11/2024
- Next Review: 01/02/2025 (Quarterly)

**3. Johan van Zyl**
- ID: 7803125678901
- Status: ⏳ Pending Review
- Risk: Medium (CDD)
- Documents: Complete, ready for review
- Representative: Pieter Vermeulen
- Days in Queue: 3

**4. Mary Johnson (Foreign)**
- Passport: B1234567 (UK)
- Status: ⏳ Pending Verification
- Risk: High (EDD) - Cross-border
- Missing: Proof of residence
- Representative: Sarah Naidoo
- Days in Queue: 10

**5. Sipho Ndlovu**
- ID: 8507145890123
- Status: 🔄 In Progress (75%)
- Risk: Low (SDD)
- Representative: Thabo Mokoena
- Days in Queue: 1

---

## FILE STRUCTURE

```
clients-fica-module/
├── index.html
├── css/
│   ├── clients-fica.css
│   ├── wizard.css
│   ├── charts.css
│   ├── calendar.css
│   └── responsive.css
├── js/
│   ├── client-dashboard.js
│   ├── client-portfolio.js
│   ├── add-client-wizard.js
│   ├── fica-verification.js
│   ├── risk-assessment.js
│   ├── reviews-monitoring.js
│   ├── reports.js
│   ├── id-validator.js           // SA ID validation
│   ├── risk-calculator.js        // Risk scoring engine
│   ├── screening-simulator.js    // PEP/sanctions simulation
│   ├── charts.js                 // Chart.js integration
│   ├── calendar.js               // Review calendar
│   ├── search-filter.js          // Search & filter logic
│   ├── role-permissions.js       // RBAC implementation
│   └── data.js                   // Sample data
└── assets/
    ├── sample-documents/
    │   ├── ID_samples/
    │   ├── proof-of-residence/
    │   └── financial-docs/
    └── icons/
```

---

## DEVELOPMENT NOTES

### Priority Implementation Order:

1. **Phase 1: Core Client Management**
   - Client dashboard
   - Client portfolio views
   - Basic add client form
   - Search and filter

2. **Phase 2: FICA Verification**
   - Add client wizard (full 7 steps)
   - Document upload
   - Risk assessment calculator
   - Verification queue

3. **Phase 3: Monitoring & Reviews**
   - Review scheduling
   - Review workflows
   - Calendar integration
   - Alerts and notifications

4. **Phase 4: Reporting & Analytics**
   - Report generation
   - Charts and visualizations
   - Export functionality
   - Scheduled reports

5. **Phase 5: Advanced Features**
   - Screening simulation
   - Bulk operations
   - Advanced search
   - Audit trails

### Testing Checklist:

- ✓ SA ID validation algorithm
- ✓ Risk scoring accuracy
- ✓ Role-based access control
- ✓ Document upload and preview
- ✓ Form validations
- ✓ Search and filter
- ✓ Calendar functionality
- ✓ Report generation
- ✓ Mobile responsiveness
- ✓ Accessibility compliance

### Performance Targets:

- Page load: < 2 seconds
- Search results: < 500ms
- Report generation: < 30 seconds
- Document upload: < 5 seconds
- Smooth animations: 60fps

---

Generate a complete, production-ready Clients & FICA Management system that handles the full client lifecycle from onboarding through ongoing compliance monitoring. Include all validations, risk calculations, screening simulations, and South African-specific requirements. The system should be immediately usable for training, user acceptance testing, and demonstration to stakeholders.
