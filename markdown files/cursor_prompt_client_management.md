# CURSOR PROMPT: CLIENT MANAGEMENT MODULE

Create a fully functional, realistic HTML mockup for the Client Management module of a South African FAIS broker compliance portal. This module serves as the foundation for FICA verification workflows, managing client profiles, representative assignments, policy tracking, and client lifecycle management with strict data isolation and privacy controls.

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
- South African locale (dates: DD/MM/YYYY, currency: ZAR, ID numbers)

## MODULE STRUCTURE

### Top Navigation Tabs
- Client Dashboard (default)
- Client Directory
- Add New Client
- FICA Status Overview
- Representative Assignments
- Client Transfers
- Reports

---

## 1. CLIENT DASHBOARD

### Hero Section: Client Statistics (4 Cards)

**Current Date Context:** 15 December 2024

**Card 1: Total Clients**
- Large number: 487
- Icon: Users
- Label: "Total Clients"
- Breakdown:
  - Active: 462
  - Dormant: 18
  - Closed: 7
- [View All]
- Status: Success (green)

**Card 2: FICA Compliance**
- Large number: 95%
- Icon: Shield-check
- Label: "FICA Compliant"
- Details: 463 of 487 verified
- Non-compliant: 24 clients
- Status: Success (green badge)
- [View Non-Compliant]

**Card 3: New Clients (This Month)**
- Large number: 12
- Icon: User-plus
- Label: "New Clients"
- Subtitle: "December 2024"
- Trend: ↑ +20% vs last month
- Status: Info (blue)
- [View Recent]

**Card 4: Pending FICA Verifications**
- Large number: 18
- Icon: Clock
- Label: "Pending Verification"
- Details:
  - <30 days: 12 clients
  - >30 days: 6 clients
- Status: Warning (amber)
- [Review Pending]

### Client Compliance Status

**FICA Compliance Overview Card:**
- Overall Status: ✅ COMPLIANT (95% verified)
- Total Clients: 487
- FICA Verified: 463 (95%)
- Pending Verification: 18 (4%)
- Non-Compliant: 6 (1%)
- High-Risk Clients: 3 (flagged for review)
- Last Audit: 30/11/2024

**POPIA Compliance Status:**
- Consent Forms: 485/487 (99.6%)
- Privacy Notices Sent: 487/487 (100%)
- Data Retention: All compliant
- Access Requests: 3 (all resolved)

### Clients by Status (Visual Cards)

**Active Clients (462)**
- Count: 462
- Color: Success (green)
- Icon: Check-circle
- Description: "Currently serviced clients"
- [View Active]

**Dormant Clients (18)**
- Count: 18
- Color: Warning (amber)
- Icon: Pause-circle
- Description: "No activity >12 months"
- [Review Dormant]

**Closed Clients (7)**
- Count: 7
- Color: Info (blue)
- Icon: X-circle
- Description: "Relationship terminated"
- [View Closed]

### Clients by Representative

**Distribution Table:**

| Representative | Active Clients | Pending FICA | Avg Portfolio Value | Status |
|----------------|----------------|--------------|---------------------|--------|
| Thandiwe Mkhize | 87 | 2 | R2.4M | ✅ |
| Johan van Zyl | 72 | 3 | R1.9M | ✅ |
| Linda Zwane | 68 | 1 | R2.1M | ✅ |
| Peter Williams | 64 | 4 | R1.8M | ⚠️ |
| Sarah Naidoo | 58 | 3 | R1.6M | ✅ |
| Michael Chen | 42 | 2 | R1.2M | ✅ |
| Amanda Botha | 38 | 1 | R1.4M | ✅ |
| Sipho Dlamini | 33 | 2 | R980K | ✅ |

**[View Full Distribution]** [Rebalance Portfolios]

### Recent Client Activity

**Last 10 Client Actions:**

| Date | Client | Action | Representative | Status |
|------|--------|--------|----------------|--------|
| 15/12/2024 | John Ndlovu | FICA verification completed | Linda Zwane | ✅ |
| 15/12/2024 | Sarah Thompson | New client onboarded | Thandiwe Mkhize | ✅ |
| 14/12/2024 | Michael Botha | Policy update | Johan van Zyl | ✅ |
| 14/12/2024 | Lerato Mokwena | FICA verification started | Peter Williams | ⏳ |
| 13/12/2024 | David Chen | Representative transfer | System | ✅ |
| 13/12/2024 | Nomsa Dube | Contact details updated | Sarah Naidoo | ✅ |
| 12/12/2024 | Andrew Smith | FICA documents uploaded | Michael Chen | ⏳ |
| 12/12/2024 | Thandi Nkosi | Client reactivated | Amanda Botha | ✅ |
| 11/12/2024 | James Williams | New client onboarded | Sipho Dlamini | ✅ |
| 11/12/2024 | Mary Johnson | Annual review completed | Thandiwe Mkhize | ✅ |

**[View All Activity]** [Export Log]

---

## 2. CLIENT DIRECTORY

### Search & Filter Panel

**Search Bar:**
- "Search by name, ID number, policy number, or representative..."
- Auto-complete suggestions
- Advanced search toggle

**Filter Options:**

**Status Filter:**
- [ ] Active (462)
- [ ] Dormant (18)
- [ ] Closed (7)
- [ ] All (487)

**FICA Status Filter:**
- [ ] Verified (463)
- [ ] Pending (18)
- [ ] Non-compliant (6)
- [ ] All

**Representative Filter:**
- [ ] All Representatives
- [ ] My Clients Only (for Representatives)
- [Dropdown] Select specific representative

**Risk Category:**
- [ ] Low Risk (410)
- [ ] Medium Risk (65)
- [ ] High Risk (12)

**Date Range:**
- Onboarded: [Date picker] to [Date picker]
- Last Activity: [Date picker] to [Date picker]

**Sort Options:**
- Name (A-Z / Z-A)
- Date Onboarded (Newest / Oldest)
- Last Activity (Most recent / Oldest)
- Portfolio Value (High to Low / Low to High)

**[Apply Filters]** [Clear Filters] [Save Filter Preset]

### Client List (Table View)

**Client Table (Sortable, Paginated):**

| Client Name | ID Number | FICA Status | Representative | Risk | Policies | Last Activity | Actions |
|-------------|-----------|-------------|----------------|------|----------|---------------|---------|
| John Ndlovu | 8506225... | ✅ Verified | Linda Zwane | Low | 3 | 15/12/2024 | [View] [Edit] |
| Sarah Thompson | 9203188... | ✅ Verified | Thandiwe Mkhize | Low | 2 | 15/12/2024 | [View] [Edit] |
| Michael Botha | 7809145... | ✅ Verified | Johan van Zyl | Medium | 5 | 14/12/2024 | [View] [Edit] |
| Lerato Mokwena | 8812097... | ⏳ Pending | Peter Williams | Low | 1 | 14/12/2024 | [View] [Edit] |
| David Chen | 8511223... | ✅ Verified | Michael Chen | Low | 4 | 13/12/2024 | [View] [Edit] |
| Nomsa Dube | 9405112... | ✅ Verified | Sarah Naidoo | Low | 2 | 13/12/2024 | [View] [Edit] |
| Andrew Smith | 7603198... | ⏳ Pending | Michael Chen | Medium | 3 | 12/12/2024 | [View] [Edit] |
| Thandi Nkosi | 9108076... | ✅ Verified | Amanda Botha | Low | 2 | 12/12/2024 | [View] [Edit] |

**Pagination:**
Showing 1-8 of 487 clients
[Previous] Page 1 of 61 [Next]
Items per page: [Dropdown: 8 / 25 / 50 / 100]

**Bulk Actions:**
- [ ] Select all visible
- [ ] Select verified only
- [Export Selected] (PDF, Excel, CSV)
- [Send Communications]
- [Generate Reports]

### Card View (Alternative Layout)

**Toggle:** [Table View] | **[Card View]**

**Client Cards (Grid - 3 columns on desktop, 1 on mobile):**

**Example Card 1:**
```
[Profile Icon: JN]
John Ndlovu
ID: 8506225... | Age: 39

Representative: Linda Zwane
FICA: ✅ Verified | Risk: Low
Policies: 3 active
Portfolio Value: R1.2M

Last Activity: 15/12/2024
Last Contact: 10/12/2024

[View Profile] [Contact] [Documents]
```

**Example Card 2:**
```
[Profile Icon: ST]
Sarah Thompson
ID: 9203188... | Age: 32

Representative: Thandiwe Mkhize
FICA: ✅ Verified | Risk: Low
Policies: 2 active
Portfolio Value: R850K

Last Activity: 15/12/2024
Last Contact: 08/12/2024

[View Profile] [Contact] [Documents]
```

---

## 3. ADD NEW CLIENT

### Client Onboarding Form

**Step 1: Personal Information**

**Basic Details:**
- Title: [Dropdown: Mr / Mrs / Ms / Dr / Prof / Other]
- First Name: [Text field] *Required
- Middle Name(s): [Text field]
- Surname: [Text field] *Required
- Preferred Name: [Text field]
- Date of Birth: [Date picker DD/MM/YYYY] *Required
- SA ID Number: [Text field - auto-validate] *Required
- Gender: [Dropdown: Male / Female / Other / Prefer not to say]
- Nationality: [Dropdown: South African / Other] *Required
- Marital Status: [Dropdown: Single / Married in community / Married out of community / Divorced / Widowed]

**If Married:**
- Spouse Name: [Text field]
- Spouse ID Number: [Text field]
- Marriage Date: [Date picker]
- Matrimonial Regime: [Dropdown]

**[Next: Contact Details]** [Save Draft] [Cancel]

---

**Step 2: Contact Information**

**Residential Address:**
- Street Address: [Text field] *Required
- Suburb: [Text field]
- City: [Text field] *Required
- Province: [Dropdown: Select province] *Required
- Postal Code: [Text field - numeric, 4 digits] *Required
- Country: [Dropdown: Default South Africa]

**Postal Address:**
- [ ] Same as residential address
- If different:
  - Postal Address: [Text field]
  - City: [Text field]
  - Postal Code: [Text field]

**Contact Details:**
- Mobile Number: [Text field +27] *Required
- Alternative Number: [Text field +27]
- Email Address: [Text field - validate email] *Required
- Preferred Contact Method: [Dropdown: Mobile / Email / Phone / SMS]

**[Previous]** [Next: Employment & Financial] [Save Draft]

---

**Step 3: Employment & Financial Information**

**Employment Details:**
- Employment Status: [Dropdown: Employed / Self-employed / Unemployed / Retired] *Required
- If Employed/Self-employed:
  - Employer Name: [Text field]
  - Occupation: [Text field]
  - Industry: [Dropdown]
  - Years Employed: [Numeric field]
  - Monthly Income: [Currency field ZAR]

**Financial Information:**
- Estimated Annual Income: [Currency ZAR] *Required
- Source of Funds: [Dropdown: Salary / Business / Investment / Inheritance / Other] *Required
- If Other: [Text field - specify]

**Tax Information:**
- Tax Number: [Text field]
- Tax Resident: [Dropdown: Yes / No] *Required
- If No:
  - Country of Tax Residence: [Text field]
  - Tax Number (Foreign): [Text field]

**[Previous]** [Next: Banking Details] [Save Draft]

---

**Step 4: Banking Details**

**Primary Bank Account:**
- Bank Name: [Dropdown: Select SA bank] *Required
- Account Type: [Dropdown: Cheque / Savings / Transmission] *Required
- Account Number: [Text field - numeric] *Required
- Branch Code: [Text field - auto-populate from bank]
- Account Holder: [Text field] *Required
- [ ] I am the account holder

**Proof of Banking:**
- Upload: [File upload button] (PDF, JPG, PNG - max 5MB)
- Requirements: Bank statement or confirmation letter (not older than 3 months)

**[Previous]** [Next: Representative Assignment] [Save Draft]

---

**Step 5: Representative Assignment & Risk Profile**

**Representative Assignment:**
- Assigned Representative: [Dropdown: Select representative] *Required
- Reason for Assignment: [Text area]
- Branch: [Dropdown: Auto-populated from representative]

**Risk Profile:**
- Risk Category: [Auto-calculated, can override]
  - Low Risk
  - Medium Risk
  - High Risk
- Risk Factors:
  - [ ] Politically Exposed Person (PEP)
  - [ ] High-value transactions expected
  - [ ] Foreign national
  - [ ] Complex ownership structures
  - [ ] Cash-intensive business

**Client Source:**
- How client found us: [Dropdown: Referral / Website / Walk-in / Marketing / Existing client / Other]
- If Referral: [Text field - referrer name]

**[Previous]** [Next: POPIA Consent] [Save Draft]

---

**Step 6: POPIA Consent & Privacy**

**Personal Information Protection:**

**POPIA Notice:**
```
PROTECTION OF PERSONAL INFORMATION ACT (POPIA) NOTICE

CustomApp Financial Services (Pty) Ltd is committed to protecting your personal 
information in accordance with POPIA (Act 4 of 2013).

We collect and process your personal information for the following purposes:
• Providing financial advisory services
• FICA verification and compliance
• Policy administration
• Regulatory reporting
• Communication about products and services

Your personal information will be:
• Stored securely for minimum 5 years
• Shared only with authorized parties (insurers, FSCA)
• Protected against unauthorized access
• Deleted or anonymized when no longer required

Your Rights:
• Access your personal information
• Request corrections
• Object to processing
• Lodge complaints with the Information Regulator

[View Full POPIA Policy]
```

**Consent Checkboxes:**
- [ ] I consent to CustomApp collecting and processing my personal information for the purposes stated above *Required
- [ ] I consent to receiving marketing communications (can withdraw anytime)
- [ ] I consent to electronic communications for policy administration
- [ ] I acknowledge receiving the POPIA information notice

**Consent Documentation:**
- Consent Date: [Auto: 15/12/2024]
- Consent Method: Electronic
- IP Address: [Auto-captured]
- User Agent: [Auto-captured]

**[Previous]** [Review & Submit]

---

**Step 7: Review & Submit**

**Review Client Details:**

**Personal Information:**
- Name: [Display submitted data]
- ID Number: [Display]
- Date of Birth: [Display] | Age: [Calculated]
- [Edit Section]

**Contact Information:**
- Address: [Display]
- Mobile: [Display]
- Email: [Display]
- [Edit Section]

**Employment & Financial:**
- Employment Status: [Display]
- Monthly Income: [Display]
- [Edit Section]

**Banking Details:**
- Bank: [Display]
- Account Number: [Display - masked]
- [Edit Section]

**Representative Assignment:**
- Representative: [Display]
- Risk Category: [Display]
- [Edit Section]

**POPIA Consent:**
- Consent Status: ✅ Granted
- Consent Date: 15/12/2024
- [Edit Section]

**Required Documents Checklist:**
- [x] ID Document copy (uploaded)
- [x] Proof of residence (uploaded)
- [x] Bank confirmation (uploaded)
- [ ] Additional documents (optional)

**[Previous]** **[Submit Client Profile]** [Save as Draft]

---

**Submission Confirmation:**

```
✅ CLIENT SUCCESSFULLY CREATED

Client Reference: CLT-2024-488
Name: Sarah Thompson
ID Number: 9203188...
Assigned Representative: Thandiwe Mkhize

Next Steps:
1. ⏳ FICA verification initiated (in progress)
2. 📧 Welcome email sent to client
3. 📋 Documents uploaded to secure portal
4. 🔔 Representative notified

[View Client Profile] [Add Another Client] [Return to Dashboard]
```

---

## 4. CLIENT PROFILE VIEW

### Selected Client: Sarah Thompson

**Client Header Card:**
```
[Profile Photo/Icon: ST]

Sarah Thompson
Client ID: CLT-2024-488
ID Number: 9203188... | Age: 32 | Female

Status: ✅ Active
FICA Status: ✅ Verified (10/12/2024)
Risk Category: Low Risk
Member Since: 15/12/2024

Assigned Representative: Thandiwe Mkhize
Branch: Cape Town
Last Contact: 15/12/2024

[Edit Client] [Contact Client] [Transfer Client] [Generate Report] [View Documents]
```

### Client Details Tabs

**Tab 1: Overview (Default)**

**Personal Information Section:**
```
PERSONAL DETAILS
Full Name: Ms Sarah Jane Thompson
Preferred Name: Sarah
Date of Birth: 18/03/1992 (Age: 32)
ID Number: 9203188... [View Full]
Gender: Female
Nationality: South African
Marital Status: Single

[Edit Section]
```

**Contact Information Section:**
```
CONTACT DETAILS
Residential Address:
123 Main Street, Newlands
Cape Town, Western Cape
7700, South Africa

Mobile: +27 82 555 1234
Email: sarah.thompson@email.com
Preferred Contact: Email

[Edit Section] [Send Email] [Call Client]
```

**Employment & Financial Section:**
```
EMPLOYMENT & FINANCIAL
Employment Status: Employed
Employer: ABC Corporation (Pty) Ltd
Occupation: Marketing Manager
Industry: Marketing & Advertising
Years Employed: 5 years
Monthly Income: R45,000

Annual Income: R540,000
Source of Funds: Salary
Tax Number: 9203188... [View Full]
Tax Resident: Yes (South Africa)

[Edit Section]
```

**Banking Details Section:**
```
BANKING INFORMATION
Bank: Standard Bank
Account Type: Cheque Account
Account Number: ****5678 [Show Full]
Branch Code: 051001
Account Holder: Sarah Jane Thompson
Proof of Banking: ✅ Verified (15/12/2024)

[Edit Section] [View Bank Statement]
```

**Representative & Risk Section:**
```
REPRESENTATIVE ASSIGNMENT
Primary Representative: Thandiwe Mkhize
FSP Number: 12345
Branch: Cape Town
Assignment Date: 15/12/2024
Assignment Reason: New client onboarding

Risk Profile: Low Risk
Risk Factors:
✅ Standard risk profile
✅ Verified income source
✅ SA citizen, tax resident
❌ No PEP flags
❌ No high-risk indicators

Last Risk Assessment: 15/12/2024

[Reassign Representative] [Update Risk Profile]
```

---

**Tab 2: Policies & Products**

**Active Policies (2):**

**Policy 1:**
```
Life Insurance Policy
Policy Number: LI-2024-001234
Provider: Old Mutual
Type: Term Life Insurance
Cover Amount: R2,000,000
Monthly Premium: R850
Start Date: 15/12/2024
Renewal Date: 15/12/2025
Status: ✅ Active

[View Policy Details] [View Documents]
```

**Policy 2:**
```
Retirement Annuity
Policy Number: RA-2024-005678
Provider: Allan Gray
Type: Retirement Annuity
Investment Value: R125,000
Monthly Contribution: R5,000
Start Date: 15/12/2024
Maturity Date: 18/03/2057 (Age 65)
Status: ✅ Active

[View Policy Details] [View Documents]
```

**[Add New Policy]**

**Policy Summary:**
- Total Policies: 2
- Total Monthly Premiums: R5,850
- Total Cover: R2,000,000
- Total Investment Value: R125,000

---

**Tab 3: FICA Verification**

**FICA Status: ✅ VERIFIED**

**Verification Details:**
```
FICA COMPLIANCE STATUS

Verification Level: Enhanced Due Diligence
Verification Date: 10/12/2024
Verified By: Linda Zwane (FICA Officer)
Next Review: 10/12/2025 (Annual)
Status: ✅ Compliant

Customer Due Diligence (CDD) Completed:
✅ Identity Verification (ID document)
✅ Address Verification (Proof of residence)
✅ Banking Details Verification
✅ Source of Funds Verification
✅ Risk Assessment Completed

Risk Rating: Low Risk
PEP Status: Not a PEP
Sanctions Check: Clear
Adverse Media: Clear

[View FICA Report] [Update Verification] [Generate Certificate]
```

**Required Documents Status:**
```
FICA DOCUMENTS CHECKLIST

✅ Certified ID Copy
   Document: SA_ID_9203188.pdf
   Upload Date: 15/12/2024
   Certified By: Thandiwe Mkhize
   Certification Date: 15/12/2024

✅ Proof of Residence
   Document: Utility_Bill_Nov2024.pdf
   Upload Date: 15/12/2024
   Issue Date: 15/11/2024
   Validity: ✅ Current (<3 months)

✅ Bank Confirmation
   Document: Bank_Statement_Nov2024.pdf
   Upload Date: 15/12/2024
   Statement Date: 30/11/2024
   Validity: ✅ Current (<3 months)

✅ Source of Funds Declaration
   Document: Employment_Letter.pdf
   Upload Date: 15/12/2024
   Employer: ABC Corporation (Pty) Ltd

[Upload Additional Document] [Download All Documents]
```

**Verification Timeline:**
```
15/12/2024 - Client profile created
15/12/2024 - Documents uploaded by representative
15/12/2024 - Initial verification checks performed
10/12/2024 - Enhanced due diligence completed
10/12/2024 - FICA verification approved
```

---

**Tab 4: Communications**

**Communication History (Last 50):**

**Filter:** [All Types] [Date Range: Last 30 days]

| Date | Type | Subject | Sent By | Status | Actions |
|------|------|---------|---------|--------|---------|
| 15/12/2024 | Email | Welcome to CustomApp FS | System | ✅ Delivered | [View] |
| 15/12/2024 | SMS | FICA verification started | System | ✅ Delivered | [View] |
| 15/12/2024 | Email | Document upload request | Thandiwe Mkhize | ✅ Opened | [View] |
| 14/12/2024 | Phone | Policy consultation | Thandiwe Mkhize | ✅ Completed | [Notes] |
| 13/12/2024 | Email | Policy quotation | Thandiwe Mkhize | ✅ Opened | [View] |

**[Send New Communication]** [Schedule Follow-up] [Export Log]

**Quick Actions:**
- [Send Email]
- [Send SMS]
- [Schedule Call]
- [Log Meeting]
- [Send Document Request]

---

**Tab 5: Documents**

**Document Library:**

**Filter:** [All Documents] [Sort by: Date (Newest)]

**FICA Documents (4):**
- SA_ID_9203188.pdf (Certified) - 15/12/2024 [Download] [View]
- Utility_Bill_Nov2024.pdf - 15/12/2024 [Download] [View]
- Bank_Statement_Nov2024.pdf - 15/12/2024 [Download] [View]
- Employment_Letter.pdf - 15/12/2024 [Download] [View]

**Policy Documents (6):**
- Life_Policy_LI001234.pdf - 15/12/2024 [Download] [View]
- Policy_Schedule_LI001234.pdf - 15/12/2024 [Download] [View]
- RA_Agreement_RA005678.pdf - 15/12/2024 [Download] [View]
- Investment_Strategy_RA005678.pdf - 15/12/2024 [Download] [View]

**Client Communications (3):**
- Welcome_Letter.pdf - 15/12/2024 [Download] [View]
- Quotation_15Dec2024.pdf - 13/12/2024 [Download] [View]

**[Upload Document]** [Create Folder] [Export All]

---

**Tab 6: Activity Log**

**Complete Activity History:**

| Date/Time | Action | User | Details | IP Address |
|-----------|--------|------|---------|------------|
| 15/12/2024 15:30 | Client created | Thandiwe Mkhize | New client onboarded | 196.xxx.xxx.xxx |
| 15/12/2024 15:32 | Documents uploaded | Thandiwe Mkhize | 4 documents added | 196.xxx.xxx.xxx |
| 15/12/2024 15:35 | FICA initiated | System | Verification started | System |
| 15/12/2024 15:40 | Welcome email sent | System | Email delivered | System |
| 15/12/2024 15:45 | Policy added | Thandiwe Mkhize | Life Insurance LI-001234 | 196.xxx.xxx.xxx |
| 15/12/2024 15:50 | Policy added | Thandiwe Mkhize | Retirement Annuity RA-005678 | 196.xxx.xxx.xxx |
| 10/12/2024 14:20 | FICA approved | Linda Zwane | Verification complete | 196.xxx.xxx.xxx |
| 10/12/2024 14:25 | Email sent | Linda Zwane | FICA approval notification | System |

**[Export Activity Log]** [Print Log]

---

## 5. FICA STATUS OVERVIEW

### FICA Compliance Dashboard

**FSP-Wide FICA Status:**

**Summary Cards:**

**Card 1: Verified Clients**
- Count: 463
- Percentage: 95%
- Status: ✅ Compliant
- Trend: ↑ +2% vs last month

**Card 2: Pending Verification**
- Count: 18
- Status: ⏳ In Progress
- <30 days: 12 clients
- >30 days: 6 clients
- [Review Pending]

**Card 3: Non-Compliant**
- Count: 6
- Status: 🚨 Critical
- Action required
- [View Non-Compliant]

**Card 4: Due for Review**
- Count: 34
- Status: ℹ️ Info
- Annual reviews due within 90 days
- [Schedule Reviews]

### FICA Status by Representative

**Representative Performance Table:**

| Representative | Total Clients | Verified | Pending | Non-Compliant | Compliance % |
|----------------|---------------|----------|---------|---------------|--------------|
| Thandiwe Mkhize | 87 | 85 | 2 | 0 | 98% ✅ |
| Johan van Zyl | 72 | 69 | 3 | 0 | 96% ✅ |
| Linda Zwane | 68 | 66 | 1 | 1 | 97% ✅ |
| Peter Williams | 64 | 59 | 4 | 1 | 92% ⚠️ |
| Sarah Naidoo | 58 | 55 | 3 | 0 | 95% ✅ |
| Michael Chen | 42 | 40 | 2 | 0 | 95% ✅ |
| Amanda Botha | 38 | 37 | 1 | 0 | 97% ✅ |
| Sipho Dlamini | 33 | 31 | 2 | 0 | 94% ✅ |

### Pending Verifications (18)

**High Priority (>30 days overdue - 6 clients):**

| Client Name | ID Number | Representative | Days Pending | Risk | Actions |
|-------------|-----------|----------------|--------------|------|---------|
| Andrew Smith | 7603198... | Michael Chen | 45 days | Medium | [Expedite] [View] |
| Patrick Jones | 8209145... | Peter Williams | 38 days | Low | [Follow-up] [View] |
| Lerato Khumalo | 9105223... | Peter Williams | 35 days | Low | [Follow-up] [View] |
| David Brown | 7812087... | Linda Zwane | 34 days | Medium | [Expedite] [View] |
| Susan Davies | 8906114... | Peter Williams | 32 days | Low | [Follow-up] [View] |
| Mark Taylor | 7704156... | Sarah Naidoo | 31 days | Low | [Follow-up] [View] |

**Standard Priority (<30 days - 12 clients):**
- [View Full List]

**[Assign FICA Officer]** [Bulk Follow-up] [Generate Report]

### Non-Compliant Clients (6)

**Critical Issues:**

| Client Name | ID Number | Representative | Issue | Days Open | Actions |
|-------------|-----------|----------------|-------|-----------|---------|
| James Wilson | 8104129... | Peter Williams | Missing proof of residence | 15 days | [Resolve] |
| Mary Stevens | 9208076... | Linda Zwane | ID document expired | 8 days | [Update] |
| Robert Green | 7910234... | Peter Williams | Bank details unverified | 12 days | [Verify] |
| Lisa Martin | 8812165... | Sarah Naidoo | Incomplete documentation | 10 days | [Complete] |
| Thomas White | 7607198... | Michael Chen | Address verification failed | 18 days | [Re-verify] |
| Helen Clark | 9103087... | Amanda Botha | Source of funds unclear | 6 days | [Clarify] |

**[Escalate All]** [Assign Resources] [Generate Report]

---

## 6. REPRESENTATIVE ASSIGNMENTS

### Assignment Overview

**Current Distribution:**
- Total Active Clients: 462
- Total Representatives: 8
- Average Clients per Rep: 58
- Recommended Max: 75 clients/rep
- Status: ✅ Balanced

### Representative Portfolio View

**Filter:** [All Representatives] [Sort by: Client Count]

**Representative Cards:**

**Rep 1: Thandiwe Mkhize**
```
Thandiwe Mkhize
FSP: 12345 | Key Individual

Clients: 87 (18.8% of total)
Portfolio Value: R2.4M
Compliance: 98% FICA verified

Status: ⚠️ High capacity (recommended max: 75)
Performance: ⭐⭐⭐⭐⭐ Excellent

[View Clients] [Rebalance] [Performance Report]
```

**Rep 2: Johan van Zyl**
```
Johan van Zyl
FSP: 45678 | Representative

Clients: 72 (15.6% of total)
Portfolio Value: R1.9M
Compliance: 96% FICA verified

Status: ✅ Optimal capacity
Performance: ⭐⭐⭐⭐⭐ Excellent

[View Clients] [Add Clients] [Performance Report]
```

*[6 more representative cards displayed]*

### Client Transfer Management

**Pending Transfers: 0**

**Recent Transfers (Last 30 Days):**

| Date | Client | From Rep | To Rep | Reason | Status |
|------|--------|----------|--------|--------|--------|
| 13/12/2024 | David Chen | Sarah Naidoo | Michael Chen | Portfolio rebalancing | ✅ Complete |
| 05/12/2024 | Lisa Kruger | Amanda Botha | Thandiwe Mkhize | Client request | ✅ Complete |
| 28/11/2024 | John Meyer | Sipho Dlamini | Johan van Zyl | Representative leaving | ✅ Complete |

**[Initiate Transfer]** [View Transfer History]

### Portfolio Rebalancing Tool

**Rebalancing Recommendations:**

```
⚠️ REBALANCING RECOMMENDED

Thandiwe Mkhize: 87 clients (16% above recommended)
Recommendation: Transfer 12 clients to less busy representatives

Suggested Transfers:
• 5 clients → Johan van Zyl (capacity available: 3)
• 4 clients → Linda Zwane (capacity available: 7)
• 3 clients → Michael Chen (capacity available: 33)

Expected Outcome:
• More balanced workload
• Improved service quality
• Better compliance monitoring

[View Detailed Plan] [Execute Rebalancing] [Customize Plan]
```

---

## 7. CLIENT TRANSFERS

### Initiate Client Transfer

**Transfer Request Form:**

**Client Selection:**
- Select Client: [Dropdown/Search]
- Current Representative: [Auto-populated]
- Current Branch: [Auto-populated]

**Transfer Details:**
- Transfer To: [Dropdown: Select representative] *Required
- Transfer Type: [Dropdown: Permanent / Temporary]
- If Temporary: Return Date [Date picker]
- Reason for Transfer: [Dropdown: Client request / Portfolio rebalancing / Representative leaving / Branch transfer / Other] *Required
- Additional Notes: [Text area]

**Client Notification:**
- [ ] Notify client of transfer (Email/SMS)
- [ ] Schedule handover meeting

**Effective Date:**
- Transfer Date: [Date picker] *Required
- Immediate transfer: [ ] Yes / [ ] No

**[Submit Transfer Request]** [Save Draft] [Cancel]

**Transfer Approval Workflow:**
1. Transfer requested by: [User]
2. Approval required from: FSP Owner / Compliance Officer
3. Client notification: Automatic
4. Handover period: 7 days (configurable)
5. Transfer completion: Automatic on effective date

### Transfer History & Reports

**Transfer Statistics:**
- Total Transfers (YTD): 23
- Average Transfer Time: 5 days
- Client Satisfaction: 92%
- Common Reasons:
  - Portfolio rebalancing: 12 (52%)
  - Client request: 6 (26%)
  - Representative leaving: 3 (13%)
  - Other: 2 (9%)

---

## 8. REPORTS

### Pre-Built Reports

**Report 1: Client Portfolio Summary**
- Description: Complete client portfolio overview
- Includes: Demographics, FICA status, representatives, values
- Format: PDF, Excel
- [Generate] [Schedule] [Customize]

**Report 2: FICA Compliance Report**
- Description: FICA verification status and compliance metrics
- Includes: Verified, pending, non-compliant, trends
- Format: PDF, Excel
- [Generate] [Schedule]

**Report 3: Representative Performance Report**
- Description: Client management performance by representative
- Includes: Client count, FICA compliance, portfolio values
- Format: PDF, PowerPoint
- [Generate] [Schedule]

**Report 4: New Client Onboarding Report**
- Description: New clients added in date range
- Includes: Demographics, representative, FICA status
- Format: Excel, PDF
- [Generate] [Schedule]

**Report 5: Dormant & Closed Clients**
- Description: Inactive client analysis
- Includes: Dormancy reasons, reactivation opportunities
- Format: Excel
- [Generate]

**Report 6: Client Communications Log**
- Description: All client communications in date range
- Includes: Emails, calls, meetings, documents
- Format: Excel, PDF
- [Generate]

### Custom Report Builder

**[Same structure as other modules]**

---

## ROLE-BASED ACCESS CONTROL

### FSP Owner / Principal
- **Access:** Full access to all clients (across all representatives)
- **Actions:** View all, create, edit, delete, transfer clients, approve transfers, generate all reports
- **Data:** Complete client data, financial information, FICA details

### Key Individual
- **Access:** Full access to supervised representatives' clients
- **Actions:** View, create, edit clients (supervised reps), approve transfers, generate reports
- **Data:** Complete client data for supervised team

### Compliance Officer
- **Access:** Read-only access to all clients (FICA/compliance purposes)
- **Actions:** View all, verify FICA, generate compliance reports
- **Data:** FICA status, compliance data, documents

### Representative
- **Access:** Full access to OWN clients ONLY
- **Actions:** View, create, edit own clients, request transfers (approval required), limited reports
- **Data:** Own clients' data, FICA status, communications
- **Restrictions:** CANNOT view other representatives' clients (strict data isolation)

### Admin Staff
- **Access:** Limited to data entry for assigned representatives
- **Actions:** Create clients, upload documents, update basic info (approval required)
- **Data:** Basic client information only

### FICA Officer
- **Access:** Read-only access to all clients (verification purposes)
- **Actions:** Verify FICA, update verification status, upload documents, generate FICA reports
- **Data:** FICA documents, verification status, risk assessments

---

## API ENDPOINTS

### GET /api/clients
**Returns client list with filters**

### GET /api/clients/:id
**Returns detailed client profile**

### POST /api/clients
**Create new client**

### PUT /api/clients/:id
**Update client details**

### DELETE /api/clients/:id
**Soft delete client (archive)**

### GET /api/clients/:id/fica
**Returns FICA verification details**

### PUT /api/clients/:id/fica
**Update FICA status**

### GET /api/clients/representative/:rep_id
**Returns clients for specific representative**

### POST /api/clients/transfer
**Initiate client transfer**

### GET /api/clients/statistics
**Returns client statistics**

---

## SAMPLE DATA

**[50+ realistic South African client profiles with varied demographics, FICA statuses, representatives, policies]**

---

## VALIDATION RULES

### SA ID Number Validation
- 13 digits
- Valid checksum (Luhn algorithm)
- Date of birth extraction and validation
- Gender identification (digit 7)

### Contact Validation
- Mobile: +27 format, 10 digits after code
- Email: Valid email format, unique per client
- Address: Required fields, SA postal code 4 digits

### Banking Validation
- Account number: Numeric, 9-11 digits
- Branch code: Valid SA branch code
- Proof of banking: <3 months old

### FICA Requirements
- ID copy: Certified, valid
- Proof of residence: <3 months
- Bank statement: <3 months
- Source of funds: Documented

---

## INTEGRATION POINTS

### Depends On:
- **Representatives Management:** Representative assignments
- **User Management:** Access control

### Integrates With:
- **FICA Verification Module:** Client verification
- **Document Management:** Client documents
- **Complaints Management:** Client complaints
- **Reports Module:** Client reports

---

## REGULATORY REFERENCES

- **FICA Act 38 of 2001:** Client verification
- **POPIA Act 4 of 2013:** Personal information protection
- **FAIS Act:** Client suitability, record retention
- **Financial Intelligence Centre:** Risk-based approach

---

## MOBILE RESPONSIVENESS
- Stack cards vertically <768px
- Simplified forms on mobile
- Touch-friendly navigation
- Swipeable client cards

---

## ACCESSIBILITY
- WCAG 2.1 AA compliance
- Screen reader support
- Keyboard navigation
- Clear field labels

---

## PERFORMANCE REQUIREMENTS
- Client list load: <2 seconds
- Search results: <500ms
- Profile load: <1 second
- Document upload: <5 seconds

---

## ERROR HANDLING

**Duplicate Client:**
```
⚠️ Potential Duplicate Client Detected
A client with similar details already exists:
John Ndlovu (ID: 8506225...)
Representative: Linda Zwane

[View Existing Client] [Continue Anyway] [Cancel]
```

**Invalid ID Number:**
```
❌ Invalid ID Number
The ID number entered is not a valid South African ID.
Please check and try again.
[Retry] [Help]
```

---

## TESTING SCENARIOS

1. New client onboarding (complete workflow)
2. FICA verification process
3. Client transfer between representatives
4. Representative access control (data isolation)
5. Bulk client import
6. Document upload and management
7. POPIA consent management

---

## DEPLOYMENT CHECKLIST

- [ ] API endpoints tested
- [ ] SA ID validation implemented
- [ ] Data isolation verified (Representatives)
- [ ] FICA workflow tested
- [ ] POPIA compliance verified
- [ ] Document management integrated
- [ ] Transfer workflows tested
- [ ] Mobile responsiveness confirmed
- [ ] Sample data loaded

---

**END OF CURSOR PROMPT**
