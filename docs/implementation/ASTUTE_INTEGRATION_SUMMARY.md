# Astute FSE API Integration - Implementation Summary

## ✅ Implementation Complete

The Astute FSE API integration has been successfully implemented in the iComply Supabase database.

---

## 📊 Database Schema

### Base Tables Created
- ✅ `fsps` - Financial Service Providers
- ✅ `users` - System users
- ✅ `representatives` - FSP representatives

### Astute Integration Tables Created
- ✅ `astute_credentials` - API credentials per FSP
- ✅ `astute_verifications` - All verification results
- ✅ `representative_fsp_history` - Historical FSP employment data
- ✅ `astute_sync_logs` - Daily sync tracking
- ✅ `astute_api_usage` - API usage and rate limiting

### Security
- ✅ Row Level Security (RLS) enabled on all tables
- ✅ RLS policies optimized for performance
- ✅ Function search_path secured
- ✅ Foreign key indexes added

---

## 🚀 Edge Functions Deployed

All 6 Edge Functions are **ACTIVE** and ready to use:

1. ✅ **verify-representative** - Verify representative against FSCA register
2. ✅ **check-debarment** - Check debarment status
3. ✅ **batch-verify-representatives** - Batch verification for multiple reps
4. ✅ **sync-daily-updates** - Daily sync from Astute (cron job)
5. ✅ **validate-dofa** - Validate Date of First Appointment
6. ✅ **get-representative-history** - Get employment history

---

## 🔗 API Endpoints

**Base URL:** `https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/`

### 1. Verify Representative
```
POST /verify-representative
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "representativeId": "uuid",
  "idNumber": "8706155800084",
  "surname": "Naidoo",
  "includeHistory": true,
  "verificationType": "onboarding"
}
```

### 2. Check Debarment
```
POST /check-debarment
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "representativeId": "uuid",
  "idNumber": "8706155800084",
  "surname": "Naidoo"
}
```

### 3. Batch Verify Representatives
```
POST /batch-verify-representatives
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "checkAll": true,
  "checkType": "debarment" | "full_verification"
}
```

### 4. Sync Daily Updates (Cron)
```
POST /sync-daily-updates
X-Cron-Secret: <CRON_SECRET>
Content-Type: application/json
```

### 5. Validate DOFA
```
POST /validate-dofa
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "representativeId": "uuid",
  "idNumber": "8706155800084",
  "claimedCategories": ["I", "IIA"]
}
```

### 6. Get Representative History
```
POST /get-representative-history
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

Body:
{
  "representativeId": "uuid",
  "idNumber": "8706155800084"
}
```

---

## 🔧 Helper Functions

### Database Functions
- ✅ `increment_astute_usage()` - Track API usage
- ✅ `increment_astute_usage_batch()` - Track batch operations
- ✅ `get_representative_verification_status()` - Get latest verification
- ✅ `get_fsps_needing_debarment_check()` - Find FSPs needing checks
- ✅ `update_representative_verification_stats()` - Auto-update rep stats (trigger)

---

## ⚙️ Configuration Required

### Environment Variables (Set in Supabase Dashboard)

1. **ASTUTE_API_URL** - Astute FSE API base URL
   - Default: `https://api.astutefse.com/v2`
   - Set via: Supabase Dashboard → Edge Functions → Settings → Secrets

2. **CRON_SECRET** - Secret for daily sync cron job
   - Generate a secure random string
   - Set via: Supabase Dashboard → Edge Functions → Settings → Secrets

3. **SUPABASE_URL** - Already configured automatically
4. **SUPABASE_SERVICE_ROLE_KEY** - Already configured automatically

### Setting Environment Variables

```bash
# Using Supabase CLI (if installed)
supabase secrets set ASTUTE_API_URL=https://api.astutefse.com/v2
supabase secrets set CRON_SECRET=your-secure-random-string
```

Or via Supabase Dashboard:
1. Go to Project Settings → Edge Functions
2. Add secrets for each function

---

## 📝 Next Steps

### 1. Configure Astute Credentials
Insert FSP credentials into `astute_credentials` table:

```sql
INSERT INTO astute_credentials (
  fsp_id,
  api_key,
  username,
  password_hash,
  subscription_status,
  subscription_start_date,
  subscription_end_date
) VALUES (
  '<fsp-uuid>',
  '<astute-api-key>',
  '<astute-username>',
  '<astute-password>', -- TODO: Encrypt before storing
  'active',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '1 year'
);
```

### 2. Set Up Daily Sync Cron Job

Configure in Supabase Dashboard → Database → Cron Jobs:

```sql
-- Daily sync at 2 AM SAST
SELECT cron.schedule(
  'astute-daily-sync',
  '0 2 * * *', -- 2 AM daily
  $$
  SELECT net.http_post(
    url := 'https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/sync-daily-updates',
    headers := jsonb_build_object(
      'X-Cron-Secret', '<YOUR_CRON_SECRET>',
      'Content-Type', 'application/json'
    )
  ) AS request_id;
  $$
);
```

### 3. Test Integration

Test each endpoint using curl or Postman:

```bash
# Example: Verify Representative
curl -X POST 'https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/verify-representative' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "representativeId": "uuid-here",
    "idNumber": "8706155800084",
    "surname": "Naidoo",
    "includeHistory": true,
    "verificationType": "onboarding"
  }'
```

---

## 🔒 Security Notes

1. **Password Encryption**: Currently passwords are stored as plain text. Implement encryption before production:
   - Use Supabase Vault for secrets
   - Or implement encryption in Edge Functions

2. **API Keys**: Store Astute API keys securely
   - Consider using Supabase Vault
   - Never commit to version control

3. **Cron Secret**: Generate a strong random secret for daily sync

4. **RLS Policies**: All tables have RLS enabled with optimized policies

---

## 📈 Monitoring

### View Logs
```bash
# Using Supabase CLI
supabase functions logs verify-representative
supabase functions logs sync-daily-updates --tail
```

### Monitor Usage
Query `astute_api_usage` table to track API calls per FSP.

### Check Sync Status
Query `astute_sync_logs` table to monitor daily syncs.

---

## 🐛 Troubleshooting

### Common Issues

1. **"Astute credentials not configured"**
   - Ensure credentials exist in `astute_credentials` table
   - Check `subscription_status` is 'active'

2. **"Unauthorized" errors**
   - Verify JWT token is valid
   - Check user has `fsp_id` set in `users` table

3. **"Astute API error"**
   - Verify API credentials are correct
   - Check Astute API status
   - Review function logs for details

---

## 📚 Documentation

- **Astute FSE API Docs**: Contact Astute for official API documentation
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **RLS Policies**: https://supabase.com/docs/guides/database/postgres/row-level-security

---

## ✅ Implementation Checklist

- [x] Database schema created
- [x] RLS policies configured
- [x] Helper functions created
- [x] All 6 Edge Functions deployed
- [x] Security optimizations applied
- [x] Indexes added for performance
- [ ] Astute API credentials configured (manual step)
- [ ] Daily sync cron job configured (manual step)
- [ ] Password encryption implemented (TODO)
- [ ] Testing completed (manual step)

---

**Implementation Date:** 24 November 2024  
**Project:** iComply  
**Status:** ✅ Ready for Configuration and Testing

