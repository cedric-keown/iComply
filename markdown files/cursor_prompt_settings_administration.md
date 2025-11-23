# CURSOR PROMPT: SETTINGS & ADMINISTRATION MODULE
============================================================

Create a fully functional, realistic HTML mockup for the Settings & Administration module of a South African FAIS broker compliance portal. This module provides comprehensive system configuration, user management, FSP settings, notification preferences, security controls, and system administration tools.

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
- **Access:** Full access to all settings and administration functions
- **Settings:** All FSP settings, user management, billing, integrations
- **Actions:** Create, edit, delete users, modify system settings, configure integrations
- **Security:** Full security controls, audit log access

### Key Individual
- **Access:** Limited to personal settings and supervised team settings
- **Settings:** Personal profile, notification preferences
- **Actions:** View team settings, cannot modify system-wide settings
- **Security:** View own activity log only

### Compliance Officer
- **Access:** Compliance-related settings and configurations
- **Settings:** Compliance thresholds, alert rules, FSCA contact details
- **Actions:** Configure compliance alerts, manage compliance workflows
- **Security:** View compliance audit logs

### Representative
- **Access:** Personal settings only
- **Settings:** Personal profile, password, notification preferences
- **Actions:** Update own profile, change password, manage notifications
- **Security:** View own activity log only

### Admin Staff
- **Access:** Operational settings and basic user management
- **Settings:** Document templates, email templates, basic system settings
- **Actions:** Manage templates, configure operational workflows
- **Security:** Limited audit log access

---

## MODULE STRUCTURE

### Navigation Tabs (Top of page)
- General Settings (default view)
- User Management
- FSP Configuration
- Notifications & Alerts
- Security & Access
- Integrations
- System Maintenance
- Audit Logs

---

## SECTION 1: GENERAL SETTINGS

### Page Header
**Title:** General Settings
**Subtitle:** Configure basic system preferences and defaults
**Current Date Context:** 23 November 2024

---

### Subsection 1.1: FSP Information

**Form Layout:**
```
┌──────────────────────────────────────────────────────────┐
│ FSP INFORMATION                                          │
│                                                          │
│ FSP Name: *                                              │
│ [Bright Future Financial Services (Pty) Ltd________]    │
│                                                          │
│ FSP License Number: *                                    │
│ [FSP12345______________________________________]          │
│                                                          │
│ Registration Number:                                     │
│ [2015/123456/07________________________________]          │
│                                                          │
│ VAT Number:                                              │
│ [4123456789________________________________________]      │
│                                                          │
│ Primary Business Address: *                              │
│ Street: [123 Main Street_________________________]       │
│ Suburb: [Cape Town CBD_________________________]         │
│ City: [Cape Town____________________________]            │
│ Province: [Western Cape ▼]                               │
│ Postal Code: [8001__]                                    │
│                                                          │
│ Postal Address:                                          │
│ ☑️ Same as business address                             │
│ ☐ Different postal address                              │
│                                                          │
│ Contact Details:                                         │
│ Phone: [+27 21 123 4567______________________]           │
│ Fax: [+27 21 123 4568__________________________]         │
│ Email: [info@brightfuture.co.za______________]           │
│ Website: [www.brightfuture.co.za______________]          │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 1.2: Regional & Localization Settings

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ REGIONAL & LOCALIZATION                                  │
│                                                          │
│ Time Zone: *                                             │
│ [Africa/Johannesburg (SAST, UTC+2) ▼]                   │
│                                                          │
│ Date Format: *                                           │
│ ● DD/MM/YYYY (e.g., 23/11/2024)                         │
│ ○ MM/DD/YYYY (e.g., 11/23/2024)                         │
│ ○ YYYY-MM-DD (e.g., 2024-11-23)                         │
│                                                          │
│ Time Format: *                                           │
│ ● 24-hour (e.g., 15:30)                                 │
│ ○ 12-hour (e.g., 3:30 PM)                               │
│                                                          │
│ Currency: *                                              │
│ [ZAR (South African Rand) ▼]                            │
│                                                          │
│ Currency Display:                                        │
│ ● R 1,234.56                                             │
│ ○ ZAR 1,234.56                                           │
│ ○ 1,234.56 ZAR                                           │
│                                                          │
│ Number Format:                                           │
│ Decimal Separator: [. ▼]                                │
│ Thousands Separator: [, ▼]                              │
│                                                          │
│ Language:                                                │
│ [English (South Africa) ▼]                              │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 1.3: Business Hours & Working Days

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ BUSINESS HOURS & WORKING DAYS                            │
│                                                          │
│ Standard Working Days:                                   │
│ ☑️ Monday    ☑️ Tuesday    ☑️ Wednesday                  │
│ ☑️ Thursday  ☑️ Friday     ☐ Saturday                    │
│ ☐ Sunday                                                 │
│                                                          │
│ Business Hours:                                          │
│ Monday - Friday:                                         │
│   Start: [08:00] End: [17:00]                           │
│                                                          │
│ ☐ Custom hours for specific days                        │
│                                                          │
│ Public Holidays:                                         │
│ ● Use South African public holidays                     │
│ ○ Custom holiday calendar                                │
│                                                          │
│ Upcoming Public Holidays (2024/2025):                    │
│ • 16 December 2024 - Day of Reconciliation              │
│ • 25 December 2024 - Christmas Day                       │
│ • 26 December 2024 - Day of Goodwill                     │
│ • 1 January 2025 - New Year's Day                       │
│ • 21 March 2025 - Human Rights Day                      │
│ • 18 April 2025 - Good Friday                           │
│ • 21 April 2025 - Family Day                            │
│ • 27 April 2025 - Freedom Day                           │
│ • 1 May 2025 - Workers' Day                             │
│                                                          │
│ [Manage Custom Holidays]                                 │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 1.4: Compliance Cycle Settings

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ COMPLIANCE CYCLE SETTINGS                                │
│                                                          │
│ CPD Cycle Period:                                        │
│ Start Date: [1 June ▼]                                  │
│ End Date: [31 May ▼]                                    │
│                                                          │
│ Current CPD Cycle:                                       │
│ 1 June 2024 - 31 May 2025                               │
│ Status: In Progress (175 days elapsed, 188 remaining)   │
│                                                          │
│ Required CPD Hours (FSCA Board Notice 194 of 2017):     │
│ Total Hours: [18] per representative per cycle          │
│ Technical CPD: [14] hours                               │
│ Ethics & Practice: [3] hours (minimum)                  │
│                                                          │
│ Fit & Proper Review Frequency:                          │
│ ● Annual Review                                          │
│ ○ Biannual Review                                        │
│ ○ Custom Frequency                                       │
│                                                          │
│ Next F&P Review Due: 1 June 2025                        │
│                                                          │
│ FICA Review Requirements:                                │
│ Individual Clients: Review every [5] years              │
│ Corporate Clients: Review every [3] years               │
│ High-Risk Clients: Review every [1] year(s)             │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 2: USER MANAGEMENT

### Page Header
**Title:** User Management
**Subtitle:** Manage users, roles, and access permissions

**Quick Actions:**
- ➕ Add New User
- 📊 View User Activity
- 🔐 Reset Passwords
- 📧 Send Invitations

---

### User List Table

**Filter Bar:**
- Search: "Search by name or email..."
- Role Filter: [All Roles ▼]
- Status Filter: [All Statuses ▼]
- Sort by: [Name (A-Z) ▼]

**Table Columns:**
1. User Name
2. Email Address
3. Role
4. Status
5. Last Login
6. Created Date
7. Actions

### Sample User Rows

**Row 1: FSP Owner**
```
John van Zyl               | john.vanzyl@brightfuture.co.za    | FSP Owner/Principal | ✅ Active  | 23/11/2024 14:30 | 15/01/2022 | ✏️ 🔐 👁️
Principal                  |                                   | Full Access         | Online     | Today            | 2y 10m ago | Edit Reset View
```

**Row 2: Key Individual**
```
Thandi Dlamini             | thandi.dlamini@brightfuture.co.za | Key Individual      | ✅ Active  | 23/11/2024 08:15 | 20/03/2022 | ✏️ 🔐 👁️
Key Individual             |                                   | Supervisor          | Offline    | Today            | 2y 8m ago  | Edit Reset View
```

**Row 3: Compliance Officer**
```
Lindiwe Mbatha             | lindiwe.mbatha@brightfuture.co.za | Compliance Officer  | ✅ Active  | 23/11/2024 09:00 | 10/02/2022 | ✏️ 🔐 👁️
Compliance Officer         |                                   | Full Compliance     | Offline    | Today            | 2y 9m ago  | Edit Reset View
```

**Row 4: Representative**
```
Thabo Maluleke             | thabo.maluleke@brightfuture.co.za | Representative      | ✅ Active  | 22/11/2024 16:45 | 05/06/2023 | ✏️ 🔐 👁️
Representative             |                                   | Limited Access      | Offline    | Yesterday        | 1y 5m ago  | Edit Reset View
```

**Row 5: Admin Staff**
```
Sarah Naidoo               | sarah.naidoo@brightfuture.co.za   | Admin Staff         | ✅ Active  | 23/11/2024 07:30 | 12/08/2023 | ✏️ 🔐 👁️
Admin                      |                                   | Operational         | Offline    | Today            | 1y 3m ago  | Edit Reset View
```

**Row 6: Inactive User**
```
Peter Botha                | peter.botha@brightfuture.co.za    | Representative      | ⏸️ Inactive | 15/08/2024      | 18/04/2023 | ✏️ ✅ 🗑️
(Resigned)                 |                                   | Deactivated         | N/A        | 3 months ago     | 1y 7m ago  | Edit Reactivate Delete
```

---

### Add New User Modal

**Modal Title:** Add New User
**Close Button:** ✕ (top right)

**Form:**
```
┌──────────────────────────────────────────────────────────┐
│ USER DETAILS                                             │
│                                                          │
│ First Name: *                                            │
│ [_____________________________________________]           │
│                                                          │
│ Last Name: *                                             │
│ [_____________________________________________]           │
│                                                          │
│ Email Address: *                                         │
│ [_____________________________________________]           │
│ (This will be the username)                              │
│                                                          │
│ Mobile Number:                                           │
│ [+27 _________________________________________]           │
│                                                          │
│ Role: *                                                  │
│ [Select Role ▼]                                         │
│ Options:                                                 │
│ • FSP Owner/Principal                                    │
│ • Key Individual                                         │
│ • Compliance Officer                                     │
│ • Representative                                         │
│ • Admin Staff                                            │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ REPRESENTATIVE-SPECIFIC (if Representative role):        │
│                                                          │
│ FSP Representative Number:                               │
│ [FSP12345-TR-___________________________]                │
│                                                          │
│ Supervised By (Key Individual):                          │
│ [Select Supervisor ▼]                                   │
│                                                          │
│ Category of Advice:                                      │
│ ☐ Class 1 - Long-term Insurance                         │
│ ☐ Class 2 - Short-term Insurance                        │
│ ☐ Class 3 - Retail Pension Benefits                     │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ ACCESS SETTINGS                                          │
│                                                          │
│ Status:                                                  │
│ ● Active (Send welcome email with login details)        │
│ ○ Pending (Create account, user activates later)        │
│                                                          │
│ Send Welcome Email:                                      │
│ ☑️ Yes, send account setup instructions                 │
│                                                          │
│ Require Password Change on First Login:                 │
│ ☑️ Yes, force password change                           │
│                                                          │
│ [Cancel] [Create User]                                   │
└──────────────────────────────────────────────────────────┘
```

---

### Edit User Permissions Modal

**Modal Title:** Edit Permissions - [User Name]
**Close Button:** ✕ (top right)

**Permission Matrix:**
```
┌──────────────────────────────────────────────────────────┐
│ ROLE-BASED PERMISSIONS                                   │
│                                                          │
│ Current Role: Representative                             │
│ [Change Role ▼]                                         │
│                                                          │
│ Module Access:                                           │
│                                                          │
│ ☑️ My CPD Dashboard                  Full Access         │
│ ☑️ Upload CPD Activities             Full Access         │
│ ☑️ My Fit & Proper Status            View Only           │
│ ☑️ My FICA Clients                   Full Access         │
│ ☑️ My Documents                      Full Access         │
│ ☐ Team Compliance Matrix             No Access           │
│ ☐ Executive Dashboard                No Access           │
│ ☐ Reports & Analytics                Limited (Personal)  │
│ ☑️ Personal Settings                 Full Access         │
│                                                          │
│ Advanced Permissions:                                    │
│ ☐ Can create reports                                     │
│ ☐ Can export data                                        │
│ ☐ Can access audit logs                                  │
│ ☐ Can manage users                                       │
│ ☐ Can modify system settings                             │
│                                                          │
│ Data Isolation:                                          │
│ ☑️ Can only view own data                               │
│ ☐ Can view team data (if supervised)                    │
│ ☐ Can view all FSP data                                 │
│                                                          │
│ [Cancel] [Save Permissions]                              │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 3: FSP CONFIGURATION

### Page Header
**Title:** FSP Configuration
**Subtitle:** Configure FSP-specific settings and compliance parameters

---

### Subsection 3.1: License & Authorization Details

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ LICENSE & AUTHORIZATION                                  │
│                                                          │
│ FSP License Details:                                     │
│ License Number: [FSP12345__________________]             │
│ Issue Date: [15/03/2015]                                │
│ Status: ✅ Active                                        │
│                                                          │
│ Categories of Advice Authorized:                         │
│ ☑️ Category I - Long-term Insurance                     │
│   Subcategories: I-A1, I-A2, I-B1, I-B2, I-C            │
│                                                          │
│ ☑️ Category II - Short-term Insurance                   │
│   Subcategories: II-A1, II-A2, II-B1, II-B2             │
│                                                          │
│ ☑️ Category III - Retail Pension Benefits               │
│   Subcategories: III-A, III-B                           │
│                                                          │
│ ☐ Category IV - Financial Products                      │
│ ☐ Category V - Securities & Instruments                 │
│                                                          │
│ FSCA Contact Details:                                    │
│ Primary Contact: [Lindiwe Mbatha (Compliance Officer)▼] │
│ Email: [compliance@brightfuture.co.za_______]            │
│ Phone: [+27 21 123 4567__________________]               │
│                                                          │
│ Annual License Fee:                                      │
│ Amount: R [15,000.00]                                    │
│ Payment Date: [31 March] annually                        │
│ Next Payment Due: 31 March 2025                          │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 3.2: Key Individuals & Compliance Officer

**Management Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ KEY INDIVIDUALS & COMPLIANCE OFFICER                     │
│                                                          │
│ Principal / FSP Owner:                                   │
│ Name: John van Zyl                                       │
│ ID Number: 7105145123084                                 │
│ FSP Number: FSP12345-P-001                              │
│ Email: john.vanzyl@brightfuture.co.za                   │
│ Phone: +27 82 123 4567                                   │
│ Appointed: 15 March 2015                                 │
│ Status: ✅ Active                                        │
│ [Edit Details]                                           │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Key Individuals:                                         │
│                                                          │
│ 1. Thandi Dlamini                                        │
│    FSP Number: FSP12345-KI-001                          │
│    Supervises: 18 representatives                        │
│    Categories: I, II, III                                │
│    Status: ✅ Active                                     │
│    [Edit] [View Team]                                    │
│                                                          │
│ 2. Pieter van Rensburg                                   │
│    FSP Number: FSP12345-KI-002                          │
│    Supervises: 18 representatives                        │
│    Categories: I, II                                     │
│    Status: ✅ Active                                     │
│    [Edit] [View Team]                                    │
│                                                          │
│ [+ Add Key Individual]                                   │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Compliance Officer (Section 17):                         │
│ Name: Lindiwe Mbatha                                     │
│ FSP Number: FSP12345-CO-001                             │
│ Appointed: 10 February 2022                              │
│ Qualification: Bachelor of Commerce (Law)                │
│ Experience: 8 years compliance management                │
│ Status: ✅ Active                                        │
│ [Edit Details]                                           │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 3.3: Compliance Thresholds & Alert Rules

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ COMPLIANCE THRESHOLDS & ALERT RULES                      │
│                                                          │
│ CPD Compliance Alerts:                                   │
│                                                          │
│ Send alert when representative falls below:              │
│ Critical: [50]% completion                               │
│ Warning: [70]% completion                                │
│                                                          │
│ Alert Timing:                                            │
│ First alert: [180] days before deadline                 │
│ Follow-up alerts: Every [30] days                        │
│ Final urgent alert: [30] days before deadline           │
│                                                          │
│ Ethics Hours Alert:                                      │
│ ☑️ Alert if ethics hours below minimum (3 hours)        │
│ Alert at: [90] days before deadline                     │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Fit & Proper Alerts:                                     │
│                                                          │
│ Qualification Expiry Alerts:                             │
│ First notification: [90] days before expiry             │
│ Follow-up: [60] days before expiry                      │
│ Urgent: [30] days before expiry                         │
│ Final: [7] days before expiry                           │
│                                                          │
│ RE Exam Renewal Alerts:                                  │
│ ☑️ Enable automatic RE Exam expiry tracking             │
│ Alert timing: Same as qualification alerts               │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ FICA Compliance Alerts:                                  │
│                                                          │
│ Verification Overdue Alerts:                             │
│ First alert: [7] days after due date                    │
│ Escalation: [14] days overdue                           │
│ Critical: [30] days overdue                             │
│                                                          │
│ Review Due Alerts:                                       │
│ Standard clients: [60] days before review due           │
│ High-risk clients: [90] days before review due          │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Document Management Alerts:                              │
│                                                          │
│ Retention Period Alerts:                                 │
│ ☑️ Alert before document retention period expires       │
│ Alert at: [30] days before                              │
│                                                          │
│ Missing Document Alerts:                                 │
│ ☑️ Alert for incomplete client files                    │
│ Check frequency: [Weekly]                                │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Complaint Management Alerts:                             │
│                                                          │
│ Resolution Timeline Alerts:                              │
│ Standard: [30] days to resolution                        │
│ Alert at: [20] days (before deadline)                   │
│ Escalation: [35] days (overdue)                         │
│                                                          │
│ [Cancel] [Save Changes] [Test Alert System]              │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 4: NOTIFICATIONS & ALERTS

### Page Header
**Title:** Notifications & Alerts
**Subtitle:** Configure how and when users receive notifications

---

### Subsection 4.1: Email Notification Settings

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ EMAIL NOTIFICATION SETTINGS                              │
│                                                          │
│ SMTP Configuration:                                      │
│ SMTP Server: [smtp.gmail.com__________________]          │
│ Port: [587]  Encryption: [TLS ▼]                        │
│ Username: [notifications@brightfuture.co.za__]           │
│ Password: [••••••••••••]  [Change]                       │
│                                                          │
│ ☑️ Test Email Configuration  [Send Test Email]          │
│                                                          │
│ From Address:                                            │
│ Name: [Bright Future Compliance System____]              │
│ Email: [compliance@brightfuture.co.za_____]              │
│                                                          │
│ Reply-To Address:                                        │
│ [compliance@brightfuture.co.za_______________]           │
│                                                          │
│ Email Signature:                                         │
│ ┌──────────────────────────────────────────────┐        │
│ │ Best regards,                                │        │
│ │ Compliance Team                              │        │
│ │ Bright Future Financial Services (Pty) Ltd   │        │
│ │ FSP12345                                     │        │
│ │                                              │        │
│ │ Tel: +27 21 123 4567                         │        │
│ │ Email: compliance@brightfuture.co.za         │        │
│ │ www.brightfuture.co.za                       │        │
│ └──────────────────────────────────────────────┘        │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 4.2: Notification Preferences by Role

**Configuration Table:**
```
┌──────────────────────────────────────────────────────────┐
│ NOTIFICATION PREFERENCES BY ROLE                         │
│                                                          │
│ Configure default notification settings for each role   │
│                                                          │
│ Notification Type          │ FSP Owner │ KI  │ CO │ Rep │
│────────────────────────────┼───────────┼─────┼────┼─────│
│ CPD Deadline Approaching   │ Email+App │Email│Both│Both │
│ CPD Activity Verified      │ App       │Email│App │Both │
│ F&P Expiry Warning         │ Both      │Email│Both│Both │
│ FICA Verification Overdue  │ Email     │Email│Both│Both │
│ New Complaint Lodged       │ Both      │Email│Both│App  │
│ Complaint Resolved         │ App       │App  │Both│Both │
│ Document Uploaded          │ -         │-    │App │App  │
│ Report Generated           │ Email     │Email│Email│-    │
│ System Maintenance         │ Both      │Email│Email│App  │
│ Security Alert             │ Both      │Email│Both│Email│
│                                                          │
│ Legend:                                                  │
│ • Email = Email notification only                        │
│ • App = In-app notification only                         │
│ • Both = Email + In-app notification                     │
│ • - = No notification                                    │
│                                                          │
│ Users can override these defaults in personal settings  │
│                                                          │
│ [Customize by Role] [Save Changes]                       │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 4.3: Alert Escalation Rules

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ ALERT ESCALATION RULES                                   │
│                                                          │
│ Define escalation paths for critical alerts             │
│                                                          │
│ Escalation Level 1: Representative                       │
│ Timing: Immediate                                        │
│ Recipients: ☑️ Representative                            │
│             ☐ Key Individual                             │
│             ☐ Compliance Officer                         │
│                                                          │
│ Escalation Level 2: Key Individual                       │
│ Timing: [7] days after Level 1 with no action          │
│ Recipients: ☑️ Representative                            │
│             ☑️ Key Individual (Supervisor)               │
│             ☐ Compliance Officer                         │
│                                                          │
│ Escalation Level 3: Compliance Officer                   │
│ Timing: [14] days after Level 2 with no action         │
│ Recipients: ☑️ Representative                            │
│             ☑️ Key Individual                            │
│             ☑️ Compliance Officer                        │
│                                                          │
│ Escalation Level 4: FSP Owner/Principal                  │
│ Timing: [21] days after Level 3 with no action         │
│ Recipients: ☑️ All above                                 │
│             ☑️ FSP Owner/Principal                       │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Critical Alerts (Immediate Escalation):                  │
│ ☑️ CPD deadline < 30 days and <50% complete             │
│ ☑️ RE Exam expired                                       │
│ ☑️ Qualification expired                                 │
│ ☑️ FICA verification >30 days overdue                   │
│ ☑️ New complaint lodged                                  │
│ ☑️ FSCA inspection notice received                      │
│                                                          │
│ Send to: ☑️ FSP Owner  ☑️ Compliance Officer            │
│                                                          │
│ [Cancel] [Save Escalation Rules]                         │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 5: SECURITY & ACCESS

### Page Header
**Title:** Security & Access Control
**Subtitle:** Manage security settings and access controls

---

### Subsection 5.1: Password Policy

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ PASSWORD POLICY                                          │
│                                                          │
│ Password Requirements:                                   │
│                                                          │
│ Minimum Length: [8] characters                          │
│ Maximum Length: [32] characters                         │
│                                                          │
│ Complexity Requirements:                                 │
│ ☑️ Must contain uppercase letters (A-Z)                 │
│ ☑️ Must contain lowercase letters (a-z)                 │
│ ☑️ Must contain numbers (0-9)                           │
│ ☑️ Must contain special characters (!@#$%^&*)           │
│ ☐ Must not contain username                             │
│ ☐ Must not contain FSP name                             │
│                                                          │
│ Password History:                                        │
│ Prevent reuse of last [5] passwords                     │
│                                                          │
│ Password Expiration:                                     │
│ ● Passwords expire after: [90] days                     │
│ ○ Passwords never expire                                 │
│                                                          │
│ Expiration Warning:                                      │
│ Warn users [14] days before password expires            │
│                                                          │
│ Force Password Change:                                   │
│ ☑️ On first login                                       │
│ ☑️ After admin password reset                           │
│ ☑️ After [3] failed login attempts                      │
│                                                          │
│ [Cancel] [Save Policy]                                   │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 5.2: Two-Factor Authentication (2FA)

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ TWO-FACTOR AUTHENTICATION (2FA)                          │
│                                                          │
│ 2FA Status: ✅ Enabled                                   │
│                                                          │
│ Enforcement Policy:                                      │
│ ● Required for all users                                │
│ ○ Required for admin roles only                          │
│ ○ Optional (user choice)                                 │
│ ○ Disabled                                               │
│                                                          │
│ 2FA Methods Allowed:                                     │
│ ☑️ Authenticator App (Google Authenticator, etc.)       │
│ ☑️ SMS to registered mobile number                       │
│ ☑️ Email verification code                               │
│ ☐ Hardware security keys (FIDO2/U2F)                    │
│                                                          │
│ Grace Period for New Users:                              │
│ Allow [7] days to set up 2FA after account creation    │
│                                                          │
│ Backup Codes:                                            │
│ ☑️ Generate 10 backup codes per user                    │
│ ☑️ Expire backup codes after [365] days                 │
│                                                          │
│ Current Status by Role:                                  │
│ • FSP Owners: 100% enrolled (2/2)                       │
│ • Key Individuals: 100% enrolled (2/2)                  │
│ • Compliance Officer: 100% enrolled (1/1)               │
│ • Representatives: 89% enrolled (32/36)                 │
│ • Admin Staff: 75% enrolled (3/4)                       │
│                                                          │
│ [View Enrollment Status] [Send Setup Reminders]          │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 5.3: Session Management

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ SESSION MANAGEMENT                                       │
│                                                          │
│ Session Timeout:                                         │
│ Idle Timeout: [30] minutes of inactivity               │
│ Absolute Timeout: [8] hours (max session length)        │
│                                                          │
│ Timeout Warning:                                         │
│ ☑️ Show warning [2] minutes before timeout              │
│ ☑️ Allow user to extend session                         │
│                                                          │
│ Concurrent Sessions:                                     │
│ Maximum concurrent sessions per user: [3]                │
│                                                          │
│ ☑️ Force logout of oldest session when limit reached    │
│ ☐ Prevent new login when limit reached                  │
│                                                          │
│ Session Security:                                        │
│ ☑️ Invalidate sessions on password change               │
│ ☑️ Log all session creation/termination                 │
│ ☑️ Track IP addresses and devices                       │
│                                                          │
│ Remember Me:                                             │
│ ● Allow "Remember Me" for [30] days                     │
│ ○ Disable "Remember Me" feature                          │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 5.4: IP Address Restrictions

**Configuration Panel:**
```
┌──────────────────────────────────────────────────────────┐
│ IP ADDRESS RESTRICTIONS                                  │
│                                                          │
│ IP Whitelisting:                                         │
│ ● Disabled (Allow access from any IP)                   │
│ ○ Enabled (Restrict to whitelisted IPs only)            │
│                                                          │
│ Whitelisted IP Addresses:                                │
│ [+ Add IP Address]                                       │
│                                                          │
│ No IP restrictions currently configured                  │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Geolocation Restrictions:                                │
│ ☑️ Alert on login from new country                      │
│ ☑️ Require additional verification for foreign IPs      │
│                                                          │
│ Allowed Countries:                                       │
│ ☑️ South Africa                                         │
│ ☐ Other countries (requires justification)              │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Failed Login Attempts:                                   │
│ Lock account after [5] failed attempts                   │
│ Lock duration: [30] minutes                             │
│                                                          │
│ ☑️ Notify user of failed login attempts                 │
│ ☑️ Notify admin of suspicious activity                  │
│                                                          │
│ [Cancel] [Save Changes]                                  │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 6: INTEGRATIONS

### Page Header
**Title:** Integrations
**Subtitle:** Connect with external services and platforms

---

### Available Integrations

**Integration 1: Email Service**
```
┌──────────────────────────────────────────────────────────┐
│ 📧 EMAIL SERVICE INTEGRATION                             │
│                                                          │
│ Status: ✅ Connected                                     │
│ Provider: Gmail (Google Workspace)                       │
│ Connected Account: compliance@brightfuture.co.za         │
│ Last Sync: 23/11/2024 15:30                             │
│                                                          │
│ Features:                                                │
│ • Send notification emails                               │
│ • Schedule report delivery                               │
│ • Bulk email reminders                                   │
│                                                          │
│ Usage This Month:                                        │
│ • Emails Sent: 1,247                                     │
│ • Delivery Rate: 99.8%                                   │
│ • Bounce Rate: 0.2%                                      │
│                                                          │
│ [Configure] [Test Connection] [Disconnect]               │
└──────────────────────────────────────────────────────────┘
```

**Integration 2: SMS Service**
```
┌──────────────────────────────────────────────────────────┐
│ 📱 SMS SERVICE INTEGRATION                               │
│                                                          │
│ Status: ⚠️ Not Connected                                │
│ Recommended Provider: Clickatell / Twilio                │
│                                                          │
│ Features (when connected):                               │
│ • Send SMS notifications                                 │
│ • Two-factor authentication codes                        │
│ • Critical alert notifications                           │
│ • Appointment reminders                                  │
│                                                          │
│ Pricing:                                                 │
│ • Estimated: R0.35 per SMS                              │
│ • Monthly volume estimate: ~500 SMS                      │
│ • Estimated monthly cost: R175                           │
│                                                          │
│ [Connect SMS Service] [Learn More]                       │
└──────────────────────────────────────────────────────────┘
```

**Integration 3: Cloud Storage**
```
┌──────────────────────────────────────────────────────────┐
│ ☁️ CLOUD STORAGE INTEGRATION                             │
│                                                          │
│ Status: ✅ Connected                                     │
│ Provider: Google Drive                                   │
│ Connected Account: admin@brightfuture.co.za              │
│ Last Sync: 23/11/2024 14:00                             │
│                                                          │
│ Features:                                                │
│ • Automatic document backup                              │
│ • Report archive storage                                 │
│ • Shared document access                                 │
│                                                          │
│ Storage Usage:                                           │
│ • Used: 2.4 GB / 15 GB (16%)                            │
│ • Documents: 3,847 files                                 │
│ • Last Backup: 23/11/2024 02:00 (Success)               │
│                                                          │
│ Backup Schedule: Daily at 02:00                          │
│                                                          │
│ [Configure] [Test Connection] [Manage Backups]           │
└──────────────────────────────────────────────────────────┘
```

**Integration 4: Calendar Sync**
```
┌──────────────────────────────────────────────────────────┐
│ 📅 CALENDAR SYNC                                         │
│                                                          │
│ Status: ⚠️ Not Connected                                │
│ Supported Providers: Google Calendar, Outlook            │
│                                                          │
│ Features (when connected):                               │
│ • Sync CPD deadlines to calendar                         │
│ • Sync F&P renewal dates                                 │
│ • Sync FICA review dates                                 │
│ • Sync audit schedules                                   │
│ • Sync internal meetings                                 │
│                                                          │
│ Benefits:                                                │
│ • Never miss important compliance deadlines              │
│ • Integrate with personal/work calendar                  │
│ • Automatic reminders                                    │
│                                                          │
│ [Connect Calendar] [Learn More]                          │
└──────────────────────────────────────────────────────────┘
```

**Integration 5: Accounting Software**
```
┌──────────────────────────────────────────────────────────┐
│ 💰 ACCOUNTING SOFTWARE INTEGRATION                       │
│                                                          │
│ Status: ⚠️ Not Connected                                │
│ Supported: Xero, QuickBooks, Sage                        │
│                                                          │
│ Features (when connected):                               │
│ • Sync representative commission data                    │
│ • Track CPD provider payments                            │
│ • Monitor compliance costs                               │
│ • Export financial reports                               │
│                                                          │
│ Benefits:                                                │
│ • Streamlined financial reporting                        │
│ • Automated reconciliation                               │
│ • Better cost tracking                                   │
│                                                          │
│ [Connect Accounting Software] [Learn More]               │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 7: SYSTEM MAINTENANCE

### Page Header
**Title:** System Maintenance
**Subtitle:** Manage system health, backups, and maintenance tasks

---

### Subsection 7.1: System Health Dashboard

**Health Status Cards:**
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ SYSTEM      │ DATABASE    │ STORAGE     │ PERFORMANCE │
│ STATUS      │ STATUS      │ USAGE       │             │
│             │             │             │             │
│   ✅         │   ✅         │   ⚠️         │   ✅         │
│ HEALTHY     │ HEALTHY     │ 76% USED    │ GOOD        │
│             │             │             │             │
│ Uptime:     │ Connections:│ 8.4 GB /    │ Avg Load:   │
│ 99.98%      │ 24/100      │ 11 GB       │ 0.4         │
│ Last 30 days│ Active      │ (2.6 GB free)│ Response:   │
│             │             │             │ 245ms       │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

---

### Subsection 7.2: Backup Management

**Backup Configuration:**
```
┌──────────────────────────────────────────────────────────┐
│ BACKUP MANAGEMENT                                        │
│                                                          │
│ Automatic Backups:                                       │
│ ☑️ Enabled                                              │
│ Schedule: Daily at [02:00]                              │
│ Retention: Keep [30] daily backups                       │
│            Keep [12] monthly backups                     │
│                                                          │
│ Backup Locations:                                        │
│ ☑️ Local server (primary)                               │
│ ☑️ Cloud storage (Google Drive)                         │
│ ☐ External FTP server                                   │
│                                                          │
│ What to Backup:                                          │
│ ☑️ Database (complete)                                  │
│ ☑️ Document files                                       │
│ ☑️ System configurations                                │
│ ☑️ User data                                            │
│                                                          │
│ Recent Backups:                                          │
│ ┌──────────────────────────────────────────────────┐    │
│ │ Date/Time           Size    Status   Actions    │    │
│ ├──────────────────────────────────────────────────┤    │
│ │ 23/11/2024 02:00   2.4 GB   ✅ Success  💾 ↻ ✅  │    │
│ │ 22/11/2024 02:00   2.3 GB   ✅ Success  💾 ↻ ✅  │    │
│ │ 21/11/2024 02:00   2.3 GB   ✅ Success  💾 ↻ ✅  │    │
│ │ 20/11/2024 02:00   2.2 GB   ✅ Success  💾 ↻ ✅  │    │
│ │ 19/11/2024 02:00   2.2 GB   ✅ Success  💾 ↻ ✅  │    │
│ └──────────────────────────────────────────────────┘    │
│                                                          │
│ [Backup Now] [Restore from Backup] [Download Backup]    │
│                                                          │
│ [Cancel] [Save Backup Settings]                          │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 7.3: Data Retention Policy

**Retention Configuration:**
```
┌──────────────────────────────────────────────────────────┐
│ DATA RETENTION POLICY                                    │
│                                                          │
│ Compliance Documents (FAIS Act requirement: 5 years):    │
│ Retention Period: [5] years after representative leaves │
│ Auto-Archive After: [5] years                           │
│ Auto-Delete After: [Never] (Manual review required)      │
│                                                          │
│ CPD Records:                                             │
│ Retention Period: [5] years after CPD cycle ends        │
│ Auto-Archive After: [2] years                           │
│                                                          │
│ FICA Documentation:                                      │
│ Retention Period: [5] years after client relationship   │
│                     ends                                 │
│ Auto-Archive After: [5] years                           │
│                                                          │
│ Complaints Records (TCF requirements):                   │
│ Retention Period: [5] years after complaint resolution  │
│ Auto-Archive After: [2] years                           │
│                                                          │
│ Internal Audit Reports:                                  │
│ Retention Period: [7] years                             │
│ Auto-Archive After: [3] years                           │
│                                                          │
│ Email & Communications:                                  │
│ Retention Period: [3] years                             │
│ Auto-Archive After: [1] year                            │
│ Auto-Delete After: [3] years                            │
│                                                          │
│ System Logs:                                             │
│ Retention Period: [1] year                              │
│ Auto-Archive After: [90] days                           │
│ Auto-Delete After: [1] year                             │
│                                                          │
│ ☑️ Require confirmation before deleting archived data   │
│                                                          │
│ [Cancel] [Save Retention Policy]                         │
└──────────────────────────────────────────────────────────┘
```

---

### Subsection 7.4: System Maintenance Windows

**Maintenance Schedule:**
```
┌──────────────────────────────────────────────────────────┐
│ SYSTEM MAINTENANCE WINDOWS                               │
│                                                          │
│ Planned Maintenance:                                     │
│ ● Weekly (Sundays 02:00 - 04:00)                        │
│ ○ Monthly (First Sunday 02:00 - 06:00)                  │
│ ○ Custom schedule                                        │
│                                                          │
│ Maintenance Tasks:                                       │
│ ☑️ Database optimization                                │
│ ☑️ Clear temporary files                                │
│ ☑️ Update security patches                              │
│ ☑️ Check disk space                                     │
│ ☑️ Verify backups                                       │
│                                                          │
│ User Notification:                                       │
│ ☑️ Send maintenance notification [24] hours in advance  │
│ ☑️ Display maintenance banner during maintenance        │
│                                                          │
│ Upcoming Maintenance:                                    │
│ Next: Sunday, 24 November 2024, 02:00 - 04:00          │
│                                                          │
│ Last Maintenance:                                        │
│ Date: Sunday, 17 November 2024, 02:00 - 03:45          │
│ Status: ✅ Completed successfully                        │
│ Duration: 1h 45m                                         │
│ Tasks Completed: 5/5                                     │
│                                                          │
│ [Cancel] [Save Maintenance Schedule]                     │
└──────────────────────────────────────────────────────────┘
```

---

## SECTION 8: AUDIT LOGS

### Page Header
**Title:** Audit Logs
**Subtitle:** Complete audit trail of system activities

**Quick Filters:**
- Date Range: [Last 30 days ▼]
- User: [All Users ▼]
- Action Type: [All Actions ▼]
- Module: [All Modules ▼]

---

### Audit Log Table

**Table Columns:**
1. Timestamp
2. User
3. Action
4. Module
5. Details
6. IP Address
7. Status
8. View

### Sample Audit Log Entries

**Row 1: Recent Activity**
```
23/11/2024 15:45:32 | Lindiwe Mbatha        | Viewed Report         | Reports & Analytics | CPD Compliance Summary | 102.168.1.45 | ✅ Success | 👁️
Today 15:45         | Compliance Officer    | report_view           |                     |                        | Cape Town    |            | View
```

**Row 2: Configuration Change**
```
23/11/2024 14:30:18 | John van Zyl          | Updated Settings      | System Settings     | Changed CPD threshold  | 102.168.1.12 | ✅ Success | 👁️
Today 14:30         | FSP Owner             | settings_update       |                     | from 60% to 70%        | Cape Town    |            | View
```

**Row 3: User Login**
```
23/11/2024 08:15:47 | Thabo Maluleke        | User Login            | Authentication      | Successful login       | 102.168.1.89 | ✅ Success | 👁️
Today 08:15         | Representative        | user_login            |                     | (2FA verified)         | Cape Town    |            | View
```

**Row 4: Failed Login Attempt**
```
22/11/2024 23:45:12 | peter.botha@...       | Failed Login          | Authentication      | Invalid password       | 41.185.23.45 | ❌ Failed  | 👁️
Yesterday 23:45     | Unknown               | login_failed          |                     | (Attempt 3/5)          | Johannesburg |            | View
```

**Row 5: Document Upload**
```
22/11/2024 16:20:34 | Sarah van der Merwe   | Uploaded Document     | Document Management | CPD Certificate.pdf    | 102.168.1.67 | ✅ Success | 👁️
Yesterday 16:20     | Representative        | document_upload       |                     | File size: 245 KB      | Cape Town    |            | View
```

**Row 6: Data Export**
```
22/11/2024 14:10:22 | Lindiwe Mbatha        | Exported Data         | Reports & Analytics | Representative List    | 102.168.1.45 | ✅ Success | 👁️
Yesterday 14:10     | Compliance Officer    | data_export           |                     | Format: Excel, 36 rows | Cape Town    |            | View
```

**Row 7: User Created**
```
20/11/2024 10:05:18 | John van Zyl          | Created User          | User Management     | New Representative     | 102.168.1.12 | ✅ Success | 👁️
3 days ago          | FSP Owner             | user_create           |                     | Daniel Fourie          | Cape Town    |            | View
```

**Row 8: Security Alert**
```
18/11/2024 03:22:41 | System                | Security Alert        | Security            | Login from new country | 185.234.56.78| ⚠️ Warning | 👁️
5 days ago          | Automated             | security_alert        |                     | Location: Netherlands  | Amsterdam    |            | View
```

---

### Audit Log Detail Modal

**Modal Title:** Audit Log Detail
**Close Button:** ✕ (top right)

**Modal Content:**
```
┌──────────────────────────────────────────────────────────┐
│ AUDIT LOG ENTRY DETAILS                                  │
│                                                          │
│ Timestamp: 23 November 2024, 14:30:18                   │
│ User: John van Zyl (FSP Owner)                          │
│ Action: settings_update                                  │
│ Module: System Settings                                  │
│ Status: ✅ Success                                       │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Session Information:                                     │
│ Session ID: sess_a1b2c3d4e5f6                           │
│ IP Address: 102.168.1.12                                │
│ Location: Cape Town, Western Cape, South Africa         │
│ Device: Chrome 119.0 on Windows 10                      │
│ User Agent: Mozilla/5.0 (Windows NT 10.0; Win64...)     │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Action Details:                                          │
│ Setting Changed: CPD Compliance Threshold                │
│ Previous Value: 60%                                      │
│ New Value: 70%                                           │
│ Reason: "Increase compliance standards for 2025 cycle"  │
│                                                          │
│ Affected Records: 36 representatives                     │
│ Impact: Alert thresholds updated                         │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Security Context:                                        │
│ 2FA Status: Verified                                     │
│ Permission Level: Full Access (FSP Owner)                │
│ Authorization: Valid                                     │
│                                                          │
│ ─────────────────────────────────────────────            │
│                                                          │
│ Additional Metadata:                                     │
│ Request ID: req_xyz789                                   │
│ Processing Time: 124ms                                   │
│ API Endpoint: /api/settings/update                       │
│ Response Code: 200 OK                                    │
│                                                          │
│ [Export Entry] [Flag for Review] [Close]                │
└──────────────────────────────────────────────────────────┘
```

---

### Audit Log Export

**Export Options:**
```
┌──────────────────────────────────────────────────────────┐
│ EXPORT AUDIT LOGS                                        │
│                                                          │
│ Date Range:                                              │
│ From: [01/11/2024] To: [23/11/2024]                     │
│                                                          │
│ Filters:                                                 │
│ Users: [All Users ▼]                                    │
│ Actions: [All Actions ▼]                                │
│ Modules: [All Modules ▼]                                │
│ Status: [All Statuses ▼]                                │
│                                                          │
│ Format:                                                  │
│ ● CSV (Comma-separated values)                          │
│ ○ Excel (Spreadsheet)                                    │
│ ○ PDF (Report format)                                    │
│                                                          │
│ Include:                                                 │
│ ☑️ User details                                         │
│ ☑️ IP addresses                                         │
│ ☑️ Action details                                       │
│ ☑️ Session information                                  │
│ ☐ Device/browser details                                │
│                                                          │
│ [Cancel] [Export]                                        │
└──────────────────────────────────────────────────────────┘
```

---

## RESPONSIVE DESIGN NOTES

### Desktop (1200px+)
- Full-width forms with multi-column layouts
- Side-by-side configuration panels
- Expandable sections for complex settings
- Full audit log table with all columns

### Tablet (768px - 1199px)
- Single-column forms with collapsible sections
- Stacked configuration panels
- Simplified audit log (priority columns only)
- Touch-friendly controls

### Mobile (< 768px)
- Single-column layout throughout
- Accordion-style sections
- Mobile-optimized forms (large inputs)
- Minimal audit log (name, action, time)
- Swipe gestures for navigation
- Bottom-fixed action buttons

---

## ACCESSIBILITY FEATURES

- High contrast mode for all settings panels
- Screen reader friendly form labels
- Keyboard navigation (Tab, Enter, Esc, Arrow keys)
- ARIA labels for all form controls
- Focus indicators on all inputs
- Error messages with clear instructions
- Confirmation dialogs for destructive actions

---

## PERFORMANCE CONSIDERATIONS

- Lazy load audit logs (paginate after 100 entries)
- Cache system settings for 5 minutes
- Debounce form inputs (500ms delay)
- Async configuration validation
- Optimize database queries for audit logs
- Index audit log table for fast searches

---

## INTEGRATION POINTS

### Dependencies (Data Sources):
- User Management System → User accounts, roles
- All Modules → Audit log data
- Email Service → Notification delivery
- Authentication System → Security settings

### Data This Module Provides To:
- All Modules → System configuration
- Authentication → Security policies
- Notifications → Alert rules and preferences
- Audit & Compliance → Complete audit trail

### API Endpoints Used:
```
GET  /api/settings/general              → Get general settings
PUT  /api/settings/general              → Update general settings
GET  /api/settings/fsp                  → Get FSP configuration
PUT  /api/settings/fsp                  → Update FSP config
GET  /api/users                         → List users
POST /api/users                         → Create user
PUT  /api/users/{id}                    → Update user
DELETE /api/users/{id}                  → Delete user
GET  /api/settings/notifications        → Get notification settings
PUT  /api/settings/notifications        → Update notifications
GET  /api/settings/security             → Get security settings
PUT  /api/settings/security             → Update security
GET  /api/integrations                  → List integrations
POST /api/integrations/{type}/connect   → Connect integration
DELETE /api/integrations/{type}         → Disconnect integration
GET  /api/audit-logs                    → Get audit logs
GET  /api/audit-logs/{id}               → Get log details
POST /api/audit-logs/export             → Export logs
GET  /api/system/health                 → System health status
POST /api/system/backup                 → Trigger backup
POST /api/system/restore                → Restore from backup
```

---

## BUSINESS LOGIC & VALIDATION

### Password Strength Validator:
```javascript
function validatePassword(password, policy) {
  const errors = [];
  
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters`);
  }
  
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letters');
  }
  
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letters');
  }
  
  if (policy.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain numbers');
  }
  
  if (policy.requireSpecial && !/[!@#$%^&*]/.test(password)) {
    errors.push('Password must contain special characters');
  }
  
  return {
    valid: errors.length === 0,
    errors: errors
  };
}
```

### Settings Change Audit:
```javascript
function auditSettingChange(user, setting, oldValue, newValue, reason) {
  const logEntry = {
    timestamp: new Date(),
    userId: user.id,
    userName: user.name,
    action: 'settings_update',
    module: 'System Settings',
    details: {
      setting: setting,
      previousValue: oldValue,
      newValue: newValue,
      reason: reason
    },
    ipAddress: user.ipAddress,
    sessionId: user.sessionId,
    status: 'success'
  };
  
  // Log to audit trail
  database.auditLogs.insert(logEntry);
  
  // Notify relevant parties if critical setting
  if (isCriticalSetting(setting)) {
    notifyAdmins('Critical Setting Changed', logEntry);
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
- Registration Number: 2015/123456/07
- VAT Number: 4123456789
- Location: Cape Town, Western Cape, South Africa

**System Statistics:**
- Total Users: 45
- Active Users: 40
- Total Representatives: 36
- System Uptime: 99.98% (last 30 days)
- Database Size: 8.4 GB
- Document Storage: 2.4 GB

---

## TESTING SCENARIOS

### Scenario 1: FSP Owner - Configure System Settings
- Login as FSP Owner
- Navigate to General Settings
- Update FSP information
- Change CPD compliance thresholds
- Configure alert escalation rules
- Verify changes reflected immediately
- Check audit log for changes

### Scenario 2: FSP Owner - Add New Representative
- Navigate to User Management
- Click "Add New User"
- Enter representative details
- Assign to Key Individual supervisor
- Select categories of advice
- Send welcome email
- Verify user appears in user list
- Verify welcome email sent

### Scenario 3: Compliance Officer - Configure Notifications
- Login as Compliance Officer
- Navigate to Notifications & Alerts
- Configure CPD deadline alerts
- Set up escalation rules
- Test email notifications
- Verify alerts sent correctly

### Scenario 4: FSP Owner - Security Configuration
- Navigate to Security & Access
- Update password policy
- Enable 2FA for all users
- Configure session timeout
- View failed login attempts
- Verify security logs

### Scenario 5: System Admin - Backup Management
- Navigate to System Maintenance
- View system health dashboard
- Trigger manual backup
- Verify backup successful
- Download backup file
- Test restore process (staging environment)

---

## REGULATORY COMPLIANCE NOTES

**POPI Act (Protection of Personal Information):**
- Audit logs provide required data processing trail
- User consent tracked for data processing
- Data retention policies configurable per POPI requirements
- Access controls enforce "need to know" principle

**FAIS Act Compliance:**
- FSP license details tracked
- Key Individual appointments documented
- Compliance Officer designation recorded
- System supports Section 17 Compliance Officer functions

**FSCA Supervisory Expectations:**
- Complete audit trail for FSCA inspections
- Security controls demonstrate due diligence
- System configuration supports compliance monitoring
- Regular backups ensure business continuity

---

## ADDITIONAL NOTES FOR CURSOR AI

1. **Use realistic South African data** - FSP numbers, ID numbers, addresses
2. **Current date is 23 November 2024** - all timestamps relative to this
3. **Security is critical** - validate all inputs, encrypt sensitive data
4. **Audit everything** - log all configuration changes
5. **Mobile-responsive** - settings must work on phones and tablets
6. **Role-based access** - strictly enforce who can change what settings
7. **Backup before changes** - critical settings should trigger backup
8. **Confirmation dialogs** - require confirmation for destructive actions
9. **Help text** - provide tooltips and help for complex settings
10. **South African locale** - DD/MM/YYYY dates, +27 phone format

---

## SUCCESS CRITERIA

Settings & Administration module is considered complete when it:
1. ✅ Provides comprehensive system configuration options
2. ✅ Enables full user management (CRUD operations)
3. ✅ Supports FSP-specific compliance settings
4. ✅ Configures notifications and alert rules
5. ✅ Implements robust security controls
6. ✅ Manages external service integrations
7. ✅ Provides system maintenance tools
8. ✅ Maintains complete audit trail
9. ✅ Enforces role-based access to all settings
10. ✅ Supports POPI Act and FAIS Act compliance requirements

---

**END OF CURSOR PROMPT**

Generated: 23 November 2024  
Module: Settings & Administration  
Priority: 3 (Medium)  
Estimated Effort: 10-12 hours development  
Complexity: MEDIUM-HIGH (extensive configuration options)
