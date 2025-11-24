# Astute FSE Integration - Configuration Status

## ✅ Completed (Automated)

### 1. Astute Credentials Template Created

**Location:** `astute_credentials` table

**Current Entry:**
- **ID:** `5c940ba5-6ad1-433d-89b3-640b86c8f8ed`
- **FSP ID:** `9c72322f-68fc-4ead-a836-0d938c019ef0`
- **Status:** Active (but needs real credentials)
- **Placeholder Values:**
  - `api_key`: `YOUR_ASTUTE_API_KEY_HERE`
  - `username`: `YOUR_ASTUTE_USERNAME_HERE`
  - `password_hash`: `YOUR_ASTUTE_PASSWORD_HERE`

**Action Required:** Update these placeholder values with your actual Astute FSE API credentials.

---

### 2. Daily Sync Cron Job Created (Disabled)

**Status:** ✅ Created but disabled

**Current Configuration:**
- **Job Name:** `astute-daily-sync`
- **Job ID:** `2`
- **Schedule:** `0 0 1 1 *` (Jan 1 at midnight - effectively disabled)
- **Active:** `true` (but won't run until Jan 1)

**To Enable (when ready):**
```sql
SELECT cron.alter_job(
  'astute-daily-sync',
  schedule := '0 2 * * *'  -- 2 AM daily
);
```

**To Disable:**
```sql
SELECT cron.alter_job(
  'astute-daily-sync',
  schedule := '0 0 1 1 *'  -- Back to Jan 1
);
```

---

### 3. Cron Secret Storage Created

**Location:** `app_settings` table

**Current Entry:**
- **Key:** `cron_secret`
- **Value:** `CHANGE_THIS_TO_YOUR_SECURE_SECRET` (placeholder)
- **Description:** Secret key for Astute daily sync cron job

**Action Required:** Update with a secure random secret.

**Generate Secret:**
```bash
openssl rand -hex 32
```

**Update Secret:**
```sql
UPDATE app_settings
SET 
  value = 'YOUR_GENERATED_SECRET_HERE',
  updated_at = NOW()
WHERE key = 'cron_secret';
```

---

## ⚠️ Manual Steps Required

### Step 1: Update Astute Credentials

**Method 1: Via Supabase Dashboard**
1. Navigate to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/editor
2. Open `astute_credentials` table
3. Click on the row to edit
4. Update:
   - `api_key` → Your actual Astute API key
   - `username` → Your actual Astute username
   - `password_hash` → Your actual Astute password

**Method 2: Via SQL**
```sql
UPDATE astute_credentials
SET 
  api_key = 'your-actual-api-key',
  username = 'your-actual-username',
  password_hash = 'your-actual-password',
  updated_at = NOW()
WHERE id = '5c940ba5-6ad1-433d-89b3-640b86c8f8ed';
```

---

### Step 2: Set Environment Variables

Environment variables must be set **for each Edge Function** in the Supabase Dashboard.

#### 2.1 Set ASTUTE_API_URL

**Functions requiring this:**
- `verify-representative`
- `check-debarment`
- `batch-verify-representatives`
- `sync-daily-updates`
- `validate-dofa`
- `get-representative-history`

**Steps for each function:**
1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/functions
2. Click on the function name
3. Click "Settings" tab
4. Scroll to "Secrets" section
5. Click "Add new secret"
6. Enter:
   - **Name:** `ASTUTE_API_URL`
   - **Value:** `https://api.astutefse.com/v2` (confirm actual URL with Astute)
7. Click "Save"

**Repeat for all 6 functions listed above.**

#### 2.2 Set CRON_SECRET (Optional - if using Edge Function secret instead of database)

**For `sync-daily-updates` function only:**

1. Go to: https://supabase.com/dashboard/project/mdpblurdxwdbsxnmuhyb/functions/sync-daily-updates
2. Click "Settings" tab
3. Under "Secrets", add:
   - **Name:** `CRON_SECRET`
   - **Value:** (Generate with `openssl rand -hex 32`)

**Note:** The cron job currently uses the database setting from `app_settings` table. If you prefer to use the Edge Function secret, you'll need to update the cron job command.

---

### Step 3: Update Cron Secret in Database

**Generate a secure secret:**
```bash
openssl rand -hex 32
```

**Update in database:**
```sql
UPDATE app_settings
SET 
  value = 'paste-your-generated-secret-here',
  updated_at = NOW()
WHERE key = 'cron_secret';
```

**Verify:**
```sql
SELECT key, value, updated_at 
FROM app_settings 
WHERE key = 'cron_secret';
```

---

## 📊 Verification Queries

### Check Astute Credentials Status
```sql
SELECT 
  ac.id,
  f.business_name,
  ac.subscription_status,
  CASE 
    WHEN ac.api_key = 'YOUR_ASTUTE_API_KEY_HERE' THEN '❌ Not Configured'
    ELSE '✅ Configured'
  END as credentials_status,
  ac.subscription_start_date,
  ac.subscription_end_date
FROM astute_credentials ac
JOIN fsps f ON f.id = ac.fsp_id;
```

### Check Cron Job Status
```sql
SELECT 
  jobid,
  jobname,
  schedule,
  active,
  CASE 
    WHEN schedule = '0 0 1 1 *' THEN '⚠️ DISABLED'
    WHEN schedule = '0 2 * * *' THEN '✅ ENABLED (Daily 2 AM)'
    ELSE '❓ Other: ' || schedule
  END as status
FROM cron.job 
WHERE jobname = 'astute-daily-sync';
```

### Check Environment Variables Status
**Note:** Environment variables cannot be checked via SQL. Verify manually in Supabase Dashboard:
- Go to each Edge Function → Settings → Secrets
- Verify `ASTUTE_API_URL` is set for all 6 functions
- Verify `CRON_SECRET` is set for `sync-daily-updates` (if using Edge Function secret)

### Check Cron Secret in Database
```sql
SELECT 
  key,
  CASE 
    WHEN value = 'CHANGE_THIS_TO_YOUR_SECURE_SECRET' THEN '❌ Not Configured'
    ELSE '✅ Configured'
  END as status,
  updated_at
FROM app_settings
WHERE key = 'cron_secret';
```

---

## 🎯 Summary

### ✅ What's Done
1. ✅ Sample FSP created (`9c72322f-68fc-4ead-a836-0d938c019ef0`)
2. ✅ Astute credentials template created (needs real values)
3. ✅ Daily sync cron job created and disabled
4. ✅ Cron secret storage table created (needs real value)
5. ✅ All database tables and functions ready

### ⚠️ What Needs Manual Configuration
1. ⚠️ Update `astute_credentials` table with real API credentials
2. ⚠️ Set `ASTUTE_API_URL` environment variable for all 6 Edge Functions
3. ⚠️ Update `cron_secret` in `app_settings` table (or set as Edge Function secret)
4. ⚠️ Test the integration
5. ⚠️ Enable cron job when ready

---

## 🚀 Next Steps

1. **Get Astute API Credentials** from Astute FSE
2. **Update Database** with real credentials
3. **Set Environment Variables** in Supabase Dashboard
4. **Test Integration** with a sample verification
5. **Enable Cron Job** when ready for production

---

**Configuration Date:** 24 November 2024  
**Status:** Ready for credential configuration  
**Project:** iComply (mdpblurdxwdbsxnmuhyb)

