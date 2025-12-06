# Astute FSE Integration - Setup Instructions

## ✅ Completed Steps

1. ✅ Database schema created
2. ✅ Edge Functions deployed
3. ✅ Sample FSP and Astute credentials template created
4. ✅ Daily sync cron job created (currently disabled)

---

## 📋 Remaining Setup Steps

### Step 1: Update Astute Credentials

The Astute credentials table has been created with placeholder values. Update them with your actual Astute FSE API credentials:

**Option A: Via Supabase Dashboard**
1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/editor
2. Navigate to `astute_credentials` table
3. Find the entry for your FSP
4. Update the following fields:
   - `api_key` - Your Astute API key
   - `username` - Your Astute username
   - `password_hash` - Your Astute password (⚠️ Encrypt before production)

**Option B: Via SQL**
```sql
UPDATE astute_credentials
SET 
  api_key = 'YOUR_ACTUAL_API_KEY',
  username = 'YOUR_ACTUAL_USERNAME',
  password_hash = 'YOUR_ACTUAL_PASSWORD', -- TODO: Encrypt before production
  updated_at = NOW()
WHERE fsp_id = (
  SELECT id FROM fsps WHERE business_name = 'Sample FSP for Astute Integration'
);
```

**⚠️ Security Note:** Before production, implement password encryption. Consider using:
- Supabase Vault for secrets
- PostgreSQL's `pgcrypto` extension for encryption
- Or encrypt in Edge Functions before storing

---

### Step 2: Set Environment Variables

Environment variables need to be set for each Edge Function in Supabase Dashboard.

#### 2.1 Set ASTUTE_API_URL

**For each Edge Function** (verify-representative, check-debarment, batch-verify-representatives, sync-daily-updates, validate-dofa, get-representative-history):

1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/functions
2. Click on each function name
3. Go to "Settings" tab
4. Under "Secrets", add:
   - **Key:** `ASTUTE_API_URL`
   - **Value:** `https://api.astutefse.com/v2` (or confirm actual URL with Astute)

#### 2.2 Set CRON_SECRET

**For sync-daily-updates function only:**

1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/functions/sync-daily-updates
2. Go to "Settings" tab
3. Under "Secrets", add:
   - **Key:** `CRON_SECRET`
   - **Value:** Generate a secure random string (e.g., use: `openssl rand -hex 32`)

**Generate a secure secret:**
```bash
# On Mac/Linux
openssl rand -hex 32

# Or use an online generator
# Store this securely - you'll need it for the cron job
```

#### 2.3 Alternative: Set via Supabase CLI

If you have Supabase CLI installed:

```bash
# Set ASTUTE_API_URL for all functions
supabase secrets set ASTUTE_API_URL=https://api.astutefse.com/v2

# Set CRON_SECRET for sync-daily-updates
supabase secrets set CRON_SECRET=your-generated-secret-here
```

**Note:** The `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are automatically available to all Edge Functions - no need to set these manually.

---

### Step 3: Verify Cron Job Status

The daily sync cron job has been created but is **currently disabled** (scheduled for Jan 1 at midnight, effectively disabled).

**Check cron job status:**
```sql
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  command
FROM cron.job 
WHERE jobname = 'astute-daily-sync';
```

**Current Status:** 
- Schedule: `0 0 1 1 *` (Jan 1 at midnight - effectively disabled)
- Active: `true` (but won't run until Jan 1)

---

### Step 4: Enable Cron Job (When Ready)

When you're ready to enable the daily sync, run this SQL:

```sql
-- Enable daily sync at 2 AM SAST (South African Standard Time)
SELECT cron.alter_job(
  'astute-daily-sync',
  schedule := '0 2 * * *'  -- 2 AM daily
);
```

**To disable again:**
```sql
-- Disable daily sync (change back to Jan 1)
SELECT cron.alter_job(
  'astute-daily-sync',
  schedule := '0 0 1 1 *'  -- Jan 1 at midnight
);
```

**Alternative schedules:**
- `0 2 * * *` - Daily at 2 AM
- `0 3 * * 1` - Every Monday at 3 AM
- `0 */6 * * *` - Every 6 hours
- `0 2 1 * *` - First day of month at 2 AM

---

## 🧪 Testing the Integration

### Test 1: Verify Representative

```bash
curl -X POST 'https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/verify-representative' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "representativeId": "representative-uuid-here",
    "idNumber": "8706155800084",
    "surname": "Naidoo",
    "includeHistory": true,
    "verificationType": "onboarding"
  }'
```

### Test 2: Check Debarment

```bash
curl -X POST 'https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/check-debarment' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "representativeId": "representative-uuid-here",
    "idNumber": "8706155800084",
    "surname": "Naidoo"
  }'
```

### Test 3: Manual Daily Sync (for testing)

```bash
curl -X POST 'https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/sync-daily-updates' \
  -H 'X-Cron-Secret: YOUR_CRON_SECRET' \
  -H 'Content-Type: application/json'
```

---

## 📊 Monitoring

### View API Usage
```sql
SELECT 
  fsp_id,
  usage_date,
  total_calls,
  verification_calls,
  debarment_calls,
  dofa_calls,
  estimated_cost
FROM astute_api_usage
ORDER BY usage_date DESC;
```

### View Sync Logs
```sql
SELECT 
  sync_date,
  sync_type,
  status,
  reps_checked,
  reps_updated,
  new_debarments,
  errors_count,
  duration_seconds
FROM astute_sync_logs
ORDER BY sync_date DESC
LIMIT 10;
```

### View Recent Verifications
```sql
SELECT 
  verification_date,
  verification_type,
  status,
  is_debarred,
  fsp_name,
  representative_number
FROM astute_verifications
ORDER BY verification_date DESC
LIMIT 20;
```

---

## 🔧 Troubleshooting

### Issue: "Astute credentials not configured"
**Solution:** Ensure credentials exist in `astute_credentials` table and `subscription_status` is 'active'

### Issue: "Unauthorized" errors
**Solution:** 
- Verify JWT token is valid
- Check user has `fsp_id` set in `users` table
- Ensure user is authenticated

### Issue: "Astute API error"
**Solution:**
- Verify API credentials are correct
- Check Astute API status
- Review Edge Function logs in Supabase Dashboard

### Issue: Cron job not running
**Solution:**
- Check cron job is active: `SELECT * FROM cron.job WHERE jobname = 'astute-daily-sync';`
- Verify schedule is correct
- Check cron job run history: `SELECT * FROM cron.job_run_details WHERE jobid = (SELECT jobid FROM cron.job WHERE jobname = 'astute-daily-sync');`

---

## 📝 Current Configuration Summary

### Sample FSP Created
- **FSP ID:** `9c72322f-68fc-4ead-a836-0d938c019ef0`
- **Business Name:** Sample FSP for Astute Integration
- **FSP Number:** FSP12345

### Astute Credentials Template
- **Credentials ID:** `5c940ba5-6ad1-433d-89b3-640b86c8f8ed`
- **Status:** Active (but needs real credentials)
- **Subscription End:** 2026-11-24

### Cron Job
- **Job Name:** `astute-daily-sync`
- **Status:** Created but disabled (scheduled for Jan 1)
- **To Enable:** Run the ALTER command in Step 4

---

## ✅ Next Actions

1. **Update Astute Credentials** - Replace placeholder values with real API credentials
2. **Set Environment Variables** - Configure ASTUTE_API_URL and CRON_SECRET in Supabase Dashboard
3. **Test Integration** - Run test API calls to verify everything works
4. **Enable Cron Job** - When ready, enable the daily sync (Step 4)

---

**Last Updated:** 24 November 2024  
**Status:** Ready for credential configuration

