# Astute FSE Integration - Quick Setup Guide

## ✅ Completed Automatically

1. ✅ Sample FSP created
2. ✅ Astute credentials template created
3. ✅ Daily sync cron job created (disabled)
4. ✅ Database settings table created for cron secret

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Update Astute Credentials

Run this SQL in Supabase SQL Editor:

```sql
-- Update with your actual Astute credentials
UPDATE astute_credentials
SET 
  api_key = 'YOUR_ACTUAL_ASTUTE_API_KEY',
  username = 'YOUR_ACTUAL_ASTUTE_USERNAME',
  password_hash = 'YOUR_ACTUAL_ASTUTE_PASSWORD', -- TODO: Encrypt before production
  updated_at = NOW()
WHERE fsp_id = (
  SELECT id FROM fsps 
  WHERE business_name = 'Sample FSP for Astute Integration'
  LIMIT 1
);
```

**Or via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/editor
2. Open `astute_credentials` table
3. Edit the row and update: `api_key`, `username`, `password_hash`

---

### Step 2: Set Environment Variables

#### 2.1 Set ASTUTE_API_URL (for all Edge Functions)

**Via Supabase Dashboard:**
1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/functions
2. For **each** of these functions, click on it and go to "Settings" → "Secrets":
   - `verify-representative`
   - `check-debarment`
   - `batch-verify-representatives`
   - `sync-daily-updates`
   - `validate-dofa`
   - `get-representative-history`
3. Add secret:
   - **Key:** `ASTUTE_API_URL`
   - **Value:** `https://api.astutefse.com/v2` (confirm actual URL with Astute)

#### 2.2 Set CRON_SECRET (for sync-daily-updates only)

**Option A: Via Database (Recommended)**
```sql
-- Generate a secure secret first (run in terminal):
-- openssl rand -hex 32

-- Then update in database:
UPDATE app_settings
SET 
  value = 'YOUR_GENERATED_SECRET_HERE', -- Paste the generated secret
  updated_at = NOW()
WHERE key = 'cron_secret';
```

**Option B: Via Edge Function Secret**
1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/functions/sync-daily-updates
2. Go to "Settings" → "Secrets"
3. Add secret:
   - **Key:** `CRON_SECRET`
   - **Value:** Generate with `openssl rand -hex 32`

**Note:** The cron job uses the database setting. If you prefer to use Edge Function secret, you'll need to update the cron job command.

---

### Step 3: Verify Setup

#### Check Astute Credentials
```sql
SELECT 
  id,
  fsp_id,
  subscription_status,
  subscription_start_date,
  subscription_end_date,
  CASE 
    WHEN api_key = 'YOUR_ASTUTE_API_KEY_HERE' THEN '⚠️ NOT CONFIGURED'
    ELSE '✅ Configured'
  END as config_status
FROM astute_credentials;
```

#### Check Cron Job
```sql
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  CASE 
    WHEN schedule = '0 0 1 1 *' THEN '⚠️ DISABLED (Jan 1)'
    WHEN schedule = '0 2 * * *' THEN '✅ ENABLED (Daily 2 AM)'
    ELSE '❓ Other schedule'
  END as status
FROM cron.job 
WHERE jobname = 'astute-daily-sync';
```

#### Check Cron Secret
```sql
SELECT 
  key,
  CASE 
    WHEN value = 'CHANGE_THIS_TO_YOUR_SECURE_SECRET' THEN '⚠️ NOT CONFIGURED'
    ELSE '✅ Configured'
  END as config_status,
  updated_at
FROM app_settings
WHERE key = 'cron_secret';
```

---

## 🔄 Enable Daily Sync (When Ready)

Once everything is configured and tested, enable the daily sync:

```sql
-- Enable daily sync at 2 AM SAST
SELECT cron.alter_job(
  'astute-daily-sync',
  schedule := '0 2 * * *'  -- 2 AM daily
);
```

**To disable again:**
```sql
SELECT cron.alter_job(
  'astute-daily-sync',
  schedule := '0 0 1 1 *'  -- Back to Jan 1 (disabled)
);
```

---

## 📋 Setup Checklist

- [ ] Updated `astute_credentials` table with real API credentials
- [ ] Set `ASTUTE_API_URL` secret for all 6 Edge Functions
- [ ] Set `CRON_SECRET` in `app_settings` table (or Edge Function secret)
- [ ] Tested at least one Edge Function endpoint
- [ ] Verified cron job exists and is disabled
- [ ] Ready to enable daily sync when needed

---

## 🧪 Quick Test

Test the verify-representative function:

```bash
# Replace YOUR_JWT_TOKEN with a valid Supabase JWT
curl -X POST 'https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/verify-representative' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "representativeId": "test-uuid",
    "idNumber": "8706155800084",
    "surname": "Test",
    "includeHistory": true,
    "verificationType": "onboarding"
  }'
```

---

## 📚 Full Documentation

See `ASTUTE_SETUP_INSTRUCTIONS.md` for detailed documentation.

---

**Status:** Ready for credential configuration  
**Last Updated:** 24 November 2024

