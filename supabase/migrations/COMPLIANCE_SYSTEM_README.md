# Compliance Tracking System - Implementation Guide

## Overview

This document describes the comprehensive compliance tracking system implemented for iComply. The system tracks four key compliance areas:

1. **CPD (Continuing Professional Development)** - Training hours and ethics requirements
2. **Fit & Proper** - Qualifications, certifications, and background checks  
3. **FICA/KYC** - Client verification and documentation
4. **Document Management** - Representative documents and renewals

## Database Schema

### Tables Created

#### CPD Tracking
- `cpd_records` - Individual CPD activities and hours
- `cpd_requirements` - Annual requirements per representative

#### Fit & Proper
- `representative_qualifications` - RE5, RE1, degrees, certificates
- `background_checks` - Criminal, credit, regulatory checks

#### FICA/KYC
- `client_fica_records` - Client verification records
- `fica_documents` - Supporting documentation

#### Document Management
- `representative_documents` - Contracts, mandates, compliance docs

## Database Functions

### Compliance Calculation Functions

#### `calculate_cpd_compliance(p_representative_id, p_year)`
Calculates CPD compliance for a representative:
- Sums approved CPD hours and ethics hours
- Compares against requirements (default: 18 hours, 3 ethics)
- Returns status: `completed`, `in_progress`, or `behind`
- Includes percentage completion

#### `calculate_fp_compliance(p_representative_id)`
Calculates Fit & Proper compliance:
- Checks for valid RE5 and RE1 qualifications
- Counts expired and expiring qualifications
- Returns status: `compliant`, `warning`, or `non_compliant`
- Includes expiry dates and issue counts

#### `calculate_fica_compliance(p_representative_id)`
Calculates FICA/KYC compliance:
- Counts total, verified, expired, and pending clients
- Calculates verification percentage
- Returns status: `current`, `warning`, or `critical`
- Flags if > 5 clients have expired verifications

#### `calculate_document_compliance(p_representative_id)`
Calculates document compliance:
- Counts current, expired, and expiring documents
- Calculates compliance percentage
- Returns status: `current`, `warning`, or `expired`
- Alerts for documents expiring within 30 days

### Comprehensive Compliance

#### `get_representative_compliance(p_representative_id, p_year)`
**Master function** that calculates overall compliance:
- Calls all four compliance calculation functions
- Calculates weighted overall score:
  - CPD: 30%
  - Fit & Proper: 30%
  - FICA: 25%
  - Documents: 15%
- Determines overall status:
  - **Compliant**: Score ≥ 80, CPD and F&P compliant
  - **At Risk**: Score ≥ 60
  - **Non-Compliant**: Score < 60
- Returns comprehensive JSON with all compliance data

#### `get_all_representatives_compliance(p_year)`
Calculates compliance for all active representatives, ordered by score (lowest first for attention prioritization).

### CRUD Functions

#### CPD
- `create_cpd_record()` - Add CPD activity
- `get_cpd_records(representative_id, year)` - Retrieve CPD records

#### Fit & Proper
- `create_qualification()` - Add qualification/certification
- `get_qualifications(representative_id)` - Retrieve qualifications

#### FICA
- `create_fica_record()` - Add client verification
- `get_fica_records(representative_id)` - Retrieve FICA records

#### Documents
- `create_document()` - Add representative document
- `get_documents(representative_id)` - Retrieve documents

## Frontend Integration

### Data Functions (js/data-functions.js)

New functions added to `dataFunctions` object:

```javascript
// CPD
dataFunctions.createCPDRecord(data, token)
dataFunctions.getCPDRecords(representativeId, year, token)
dataFunctions.calculateCPDCompliance(representativeId, year, token)

// Fit & Proper
dataFunctions.createQualification(data, token)
dataFunctions.getQualifications(representativeId, token)
dataFunctions.calculateFPCompliance(representativeId, token)

// FICA
dataFunctions.createFICARecord(data, token)
dataFunctions.getFICARecords(representativeId, token)
dataFunctions.calculateFICACompliance(representativeId, token)

// Documents
dataFunctions.createDocument(data, token)
dataFunctions.getDocuments(representativeId, token)
dataFunctions.calculateDocumentCompliance(representativeId, token)

// Comprehensive Compliance
dataFunctions.getRepresentativeCompliance(representativeId, year, token)
dataFunctions.getAllRepresentativesCompliance(year, token)
```

### Updated Modules

#### Compliance Overview (`modules/representatives/js/compliance-overview.js`)
- Loads representatives and calculates comprehensive compliance
- Displays compliance matrix with real-time calculations
- Shows F&P, CPD, FICA, and overall status badges
- Color-codes rows by compliance status

#### Team Compliance Matrix (`modules/team-compliance/js/team-compliance.js`)
- Retrieves detailed compliance data for each representative
- Displays CPD hours, FICA status, document status
- Shows F&P qualification details with expiry dates
- Calculates and displays overall compliance scores

#### Representatives Dashboard (`modules/representatives/js/representatives-dashboard.js`)
- Aggregates compliance statistics across all representatives
- Shows counts of compliant, at-risk, and non-compliant reps
- Displays compliance percentage and status indicators
- Updates FAIS Act Compliance section with real data

## Compliance Scoring Logic

### Weighted Calculation
```
Overall Score = (CPD% × 0.30) + (F&P × 0.30) + (FICA% × 0.25) + (Docs% × 0.15)
```

### Status Determination
- **Compliant**: Overall score ≥ 80 AND CPD compliant AND F&P compliant
- **At Risk**: Overall score ≥ 60 (needs attention)
- **Non-Compliant**: Overall score < 60 (critical)

### Component Status Logic

**CPD:**
- Completed: Hours ≥ required AND ethics ≥ required
- In Progress: 67% ≤ completion < 100%
- Behind: Completion < 67%

**Fit & Proper:**
- Compliant: Has RE5, has RE1, no expired qualifications
- Warning: Has RE5 and RE1 but qualifications expiring within 90 days
- Non-Compliant: Missing RE5/RE1 or expired qualifications

**FICA:**
- Current: All clients verified, no overdue
- Warning: 1-5 clients with expired verifications
- Critical: > 5 clients with expired verifications

**Documents:**
- Current: All documents current, no expired
- Warning: 1-3 expired documents or documents expiring within 30 days
- Expired: > 3 expired documents

## Deployment Instructions

### 1. Run the Migration

```bash
# Navigate to project directory
cd /Users/cedrickeown/Documents/GitHub/iComply

# Apply the migration to Supabase
supabase migration apply compliance_tracking_system.sql
```

Or through Supabase Dashboard:
1. Go to SQL Editor
2. Paste contents of `compliance_tracking_system.sql`
3. Run the migration

### 2. Verify Tables Created

Run this query to verify:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'cpd_records', 'cpd_requirements', 
    'representative_qualifications', 'background_checks',
    'client_fica_records', 'fica_documents',
    'representative_documents'
);
```

### 3. Test Functions

Test the compliance calculation:
```sql
SELECT get_representative_compliance('<representative_id>'::UUID);
```

### 4. Frontend Deployment

The frontend changes are already integrated. Simply deploy the updated files:
- `js/data-functions.js`
- `modules/representatives/js/compliance-overview.js`
- `modules/representatives/js/representatives-dashboard.js`
- `modules/team-compliance/js/team-compliance.js`

## Usage Examples

### Adding CPD Record

```javascript
const cpdRecord = {
    representative_id: repId,
    activity_type: 'course',
    activity_name: 'FAIS Compliance Training 2024',
    provider: 'FSB Training Institute',
    activity_date: '2024-06-15',
    hours_earned: 8,
    ethics_hours: 2,
    verifiable: true
};

const result = await dataFunctions.createCPDRecord(cpdRecord);
```

### Adding Qualification

```javascript
const qualification = {
    representative_id: repId,
    qualification_type: 'RE5',
    qualification_name: 'Regulatory Exam for Representatives',
    issuing_authority: 'FSCA',
    issue_date: '2020-03-15',
    expiry_date: '2025-03-15'
};

const result = await dataFunctions.createQualification(qualification);
```

### Getting Compliance Status

```javascript
const compliance = await dataFunctions.getRepresentativeCompliance(repId);

console.log(compliance.overall_status); // 'compliant', 'at_risk', or 'non_compliant'
console.log(compliance.overall_score); // 0-100
console.log(compliance.cpd.status); // CPD status
console.log(compliance.fit_proper.has_re5); // true/false
console.log(compliance.fica.verified_clients); // count
console.log(compliance.documents.expired_documents); // count
```

## Maintenance

### Periodic Tasks

1. **Update CPD Requirements**
   - Create new `cpd_requirements` records at year start
   - Set due dates (typically December 31)

2. **Check Expiring Qualifications**
   ```sql
   SELECT * FROM representative_qualifications 
   WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
   AND status = 'active';
   ```

3. **Review FICA Expirations**
   ```sql
   SELECT * FROM client_fica_records 
   WHERE expiry_date < CURRENT_DATE 
   AND verification_status = 'verified';
   ```

4. **Document Renewal Reminders**
   ```sql
   SELECT * FROM representative_documents 
   WHERE expiry_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
   AND requires_renewal = true;
   ```

## Future Enhancements

1. **Automated Alerts** - Email/SMS notifications for:
   - Approaching CPD deadlines
   - Qualification expirations
   - FICA review dates
   - Document renewals

2. **Historical Tracking** - Store compliance scores over time for trend analysis

3. **Bulk Import** - CSV import for CPD records and qualifications

4. **Document Storage** - Integration with file storage for verification documents

5. **Reporting** - Scheduled compliance reports for management

6. **Workflow Automation** - Automatic status updates based on dates

## Support

For issues or questions:
1. Check function documentation in SQL file
2. Review frontend console for errors
3. Verify database permissions for functions
4. Check Supabase logs for function execution errors

## Version History

- **v1.0** (Current) - Initial implementation
  - CPD tracking
  - Fit & Proper management
  - FICA verification
  - Document management
  - Comprehensive compliance calculation
  - Frontend integration

