# Alerts Seed Data

This directory contains seed data files for populating the `alerts` table with realistic test data.

## Files

### 1. `seed_alerts_data.sql`
Basic seed data file with placeholder UUIDs. Use this if you want to manually replace UUIDs or if you don't have representatives/clients in your database yet.

**Usage:**
```sql
-- Run this file in your Supabase SQL editor or via psql
\i supabase/migrations/seed_alerts_data.sql
```

**Note:** You'll need to replace `gen_random_uuid()` calls with actual UUIDs from your `representatives` and `clients` tables where applicable.

### 2. `seed_alerts_with_real_data.sql` (Recommended)
Advanced seed data file that automatically links to existing representatives and clients in your database. This is the recommended file to use.

**Usage:**
```sql
-- Run this file in your Supabase SQL editor or via psql
\i supabase/migrations/seed_alerts_with_real_data.sql
```

**Features:**
- Automatically finds and links to actual representatives
- Automatically finds and links to actual clients
- Gracefully handles cases where no representatives/clients exist
- Uses DO blocks to safely handle missing data

## What Gets Created

Both files create **25 realistic alerts** with the following distribution:

### By Priority
- **Critical:** 4 alerts (expired licenses, FSCA notices, insurance issues)
- **High:** 6 alerts (expiring certificates, overdue reviews, complaints)
- **Medium:** 7 alerts (quarterly reviews, training, policy updates)
- **Low:** 4 alerts (reminders, maintenance notices)

### By Status
- **Active:** 19 alerts (requiring action)
- **Acknowledged:** 2 alerts (in progress)
- **Resolved:** 2 alerts (completed)

### By Entity Type
- **fit-proper:** 3 alerts (RE5 certificates, licenses)
- **fica:** 4 alerts (FICA reviews, risk assessments)
- **cpd:** 4 alerts (CPD hours, training)
- **complaints:** 2 alerts (client complaints, FSCA notices)
- **insurance:** 1 alert (PI insurance)
- **documents:** 3 alerts (license renewals, policy reviews)
- **compliance:** 4 alerts (quarterly reviews, inspections)
- **training:** 2 alerts (compliance training)
- **internal-audit:** 1 alert (audit findings)
- **system:** 2 alerts (maintenance, newsletters)

### By Time
- **Overdue:** 2 alerts (past due dates)
- **Upcoming:** 15 alerts (due in future)
- **Recent (today):** 4 alerts (created within last 5 hours)
- **Historical:** 4 alerts (older alerts, some resolved)

## Alert Examples

### Critical Alerts
- RE5 Certificate Expired (2 days ago)
- FSCA Compliance Notice (response required in 48 hours)
- Professional Indemnity Insurance Expired

### High Priority Alerts
- RE5 Expiring in 15 Days
- 45 FICA Reviews Overdue
- CPD Hours Shortfall
- Client Complaint 5 Days Overdue

### Medium Priority Alerts
- Quarterly Compliance Review Due
- CPD Activity Documentation Pending
- FICA Risk Assessment Update Required
- Annual Compliance Training Due

### Low Priority Alerts
- CPD Activity Reminder for Q1 2025
- Document Archive Review Due
- Scheduled System Maintenance

## Customization

To customize the alerts for your specific needs:

1. **Modify Representative Selection:**
   ```sql
   -- In seed_alerts_with_real_data.sql, change:
   SELECT id INTO v_rep_id FROM representatives WHERE status = 'active' LIMIT 1;
   
   -- To target specific representatives:
   SELECT id INTO v_rep_id FROM representatives WHERE fscar_number = 'FSP12345';
   ```

2. **Adjust Dates:**
   ```sql
   -- Change time intervals to match your needs:
   NOW() - INTERVAL '2 days'  -- 2 days ago
   NOW() + INTERVAL '15 days' -- 15 days from now
   ```

3. **Add More Alerts:**
   - Copy an existing INSERT statement
   - Modify the title, message, priority, and dates
   - Adjust entity_type to match your needs

## Verification

After running the seed data, verify the alerts were created:

```sql
-- Count alerts by priority
SELECT priority, COUNT(*) as count 
FROM alerts 
GROUP BY priority 
ORDER BY 
  CASE priority 
    WHEN 'critical' THEN 1 
    WHEN 'high' THEN 2 
    WHEN 'medium' THEN 3 
    WHEN 'low' THEN 4 
  END;

-- Count alerts by status
SELECT status, COUNT(*) as count 
FROM alerts 
GROUP BY status;

-- Count alerts by entity type
SELECT entity_type, COUNT(*) as count 
FROM alerts 
GROUP BY entity_type 
ORDER BY count DESC;

-- View recent alerts
SELECT 
  alert_title,
  priority,
  status,
  created_at,
  due_date
FROM alerts 
ORDER BY created_at DESC 
LIMIT 10;
```

## Cleanup

To remove all seed data alerts:

```sql
-- WARNING: This will delete ALL alerts, not just seed data
-- Use with caution in production!

DELETE FROM alerts;
```

Or to remove only seed data (if you mark them somehow):

```sql
-- If you add a marker to seed data alerts, you can delete only those
-- For example, if all seed alerts have a specific pattern in the title:
DELETE FROM alerts 
WHERE alert_title LIKE '%RE5%' 
   OR alert_title LIKE '%FICA%'
   OR alert_title LIKE '%CPD%';
```

## Integration with Application

Once the seed data is loaded:

1. **Header Badge:** The alerts badge in the header will automatically show the count of active alerts
2. **Alerts Dashboard:** Navigate to Alerts & Notifications to see all alerts
3. **Filtering:** Use the filters to view alerts by priority, status, or category
4. **Details:** Click on any alert to view full details

## Notes

- All dates use `NOW()` relative timestamps, so they will be current when you run the script
- Some alerts reference specific dates (like December 31, 2024 for CPD deadlines)
- The script uses `gen_random_uuid()` for entity_id where no specific entity is referenced
- Representative and client IDs are only linked when actual records exist in the database

## Troubleshooting

**Issue:** No alerts appear after running the script
- Check that the `alerts` table exists
- Verify you have the necessary permissions
- Check for SQL errors in the execution log

**Issue:** Alerts don't link to representatives/clients
- Ensure you have representatives and clients in your database
- The script will still create alerts without links if no data exists
- Check that representative/client status is 'active'

**Issue:** Dates seem incorrect
- Remember that `NOW()` is evaluated when the script runs
- Adjust intervals if you want different time ranges
- Some alerts use fixed dates (like year-end deadlines)

