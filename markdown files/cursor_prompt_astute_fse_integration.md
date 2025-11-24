# CURSOR PROMPT: ASTUTE FSE API INTEGRATION
## Supabase Edge Functions for FAIS Compliance Verification

> **Purpose:** Complete Astute FSE API integration for representative verification, debarment checking, DOFA validation, and daily compliance monitoring using Supabase Edge Functions (Deno runtime).

---

## SYSTEM OVERVIEW

### What is Astute FSE?
Astute FSE is South Africa's leading financial services data exchange platform, providing:
- Real-time FSP and Representative verification against FSCA register
- Daily debarment list updates
- DOFA (Date of First Appointment) tracking
- Regulatory Examination (RE) status verification
- Historical FSP employment data
- Class of Business (COB) authorization verification

### Integration Architecture

```
┌─────────────────────────────────────────────────────────┐
│              iComply Frontend (React)                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓ (RPC Calls)
┌─────────────────────────────────────────────────────────┐
│           Supabase Edge Functions (Deno)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 1. verify-representative                         │   │
│  │ 2. check-debarment                               │   │
│  │ 3. validate-dofa                                 │   │
│  │ 4. sync-daily-updates                            │   │
│  │ 5. get-representative-history                    │   │
│  │ 6. verify-fsp-license                            │   │
│  │ 7. batch-verify-representatives                  │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓ (HTTPS API Calls)
┌─────────────────────────────────────────────────────────┐
│              Astute FSE API Gateway                      │
│  • Authentication: API Key + FSP Credentials             │
│  • Rate Limiting: Managed by Astute                      │
│  • Response Format: JSON                                 │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓ (Data flows from FSCA)
┌─────────────────────────────────────────────────────────┐
│         FSCA Representative Register Database            │
└─────────────────────────────────────────────────────────┘
```

---

## SUPABASE DATABASE SCHEMA

### Required Tables

```sql
-- ============================================
-- ASTUTE INTEGRATION TABLES
-- ============================================

-- Store Astute API credentials per FSP
CREATE TABLE astute_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fsp_id UUID REFERENCES fsps(id) ON DELETE CASCADE,
  api_key TEXT NOT NULL, -- Encrypted
  username TEXT NOT NULL,
  password_hash TEXT NOT NULL, -- Encrypted
  subscription_status TEXT DEFAULT 'active', -- 'active', 'suspended', 'expired'
  subscription_start_date DATE,
  subscription_end_date DATE,
  rep_count INTEGER DEFAULT 0,
  monthly_cap DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id),
  
  CONSTRAINT valid_subscription_status CHECK (subscription_status IN ('active', 'suspended', 'expired'))
);

-- Store all verification results
CREATE TABLE astute_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_id UUID REFERENCES representatives(id) ON DELETE CASCADE,
  verification_type TEXT NOT NULL, -- 'onboarding', 'debarment', 'dofa', 'periodic', 'manual'
  verification_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Verification results
  status TEXT NOT NULL, -- 'clear', 'debarred', 'invalid', 'not_found', 'error'
  is_debarred BOOLEAN DEFAULT FALSE,
  debarment_date DATE,
  debarment_reason TEXT,
  debarring_fsp TEXT,
  
  -- Representative data from Astute
  fsp_number TEXT,
  fsp_name TEXT,
  representative_number TEXT,
  dofa DATE, -- Date of First Appointment
  categories TEXT[], -- ['I', 'IIA', 'IIB', 'IIIA']
  sub_categories TEXT[], -- ['1.1', '1.3', '1.20']
  
  -- RE Exam data
  re5_status TEXT, -- 'passed', 'pending', 'failed', 'expired'
  re5_date DATE,
  re1_status TEXT,
  re1_date DATE,
  
  -- Raw API response
  raw_response JSONB,
  
  -- Metadata
  requested_by UUID REFERENCES users(id),
  verification_source TEXT DEFAULT 'astute_api', -- 'astute_api', 'manual', 'batch'
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_status CHECK (status IN ('clear', 'debarred', 'invalid', 'not_found', 'error')),
  CONSTRAINT valid_verification_type CHECK (verification_type IN ('onboarding', 'debarment', 'dofa', 'periodic', 'manual'))
);

-- Index for quick lookups
CREATE INDEX idx_astute_verifications_rep ON astute_verifications(representative_id);
CREATE INDEX idx_astute_verifications_date ON astute_verifications(verification_date DESC);
CREATE INDEX idx_astute_verifications_status ON astute_verifications(status);
CREATE INDEX idx_astute_verifications_debarred ON astute_verifications(is_debarred) WHERE is_debarred = TRUE;

-- Store historical FSP employment data
CREATE TABLE representative_fsp_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  representative_id UUID REFERENCES representatives(id) ON DELETE CASCADE,
  
  -- Previous FSP details
  previous_fsp_number TEXT NOT NULL,
  previous_fsp_name TEXT,
  employment_start_date DATE,
  employment_end_date DATE,
  position TEXT,
  categories TEXT[],
  reason_for_leaving TEXT,
  
  -- Source
  data_source TEXT DEFAULT 'astute', -- 'astute', 'manual', 'representative'
  verified BOOLEAN DEFAULT FALSE,
  verified_date TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES users(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_rep_history_rep_id ON representative_fsp_history(representative_id);

-- Daily sync tracking
CREATE TABLE astute_sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fsp_id UUID REFERENCES fsps(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- 'daily_update', 'debarment_check', 'batch_verification'
  sync_date DATE DEFAULT CURRENT_DATE,
  
  -- Sync results
  status TEXT NOT NULL, -- 'success', 'partial', 'failed'
  reps_checked INTEGER DEFAULT 0,
  reps_updated INTEGER DEFAULT 0,
  new_debarments INTEGER DEFAULT 0,
  errors_count INTEGER DEFAULT 0,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_seconds INTEGER,
  
  -- Details
  error_log JSONB,
  summary JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_sync_status CHECK (status IN ('success', 'partial', 'failed')),
  CONSTRAINT valid_sync_type CHECK (sync_type IN ('daily_update', 'debarment_check', 'batch_verification'))
);

CREATE INDEX idx_sync_logs_date ON astute_sync_logs(sync_date DESC);
CREATE INDEX idx_sync_logs_fsp ON astute_sync_logs(fsp_id);

-- API rate limiting and usage tracking
CREATE TABLE astute_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fsp_id UUID REFERENCES fsps(id) ON DELETE CASCADE,
  usage_date DATE DEFAULT CURRENT_DATE,
  
  -- Usage metrics
  total_calls INTEGER DEFAULT 0,
  verification_calls INTEGER DEFAULT 0,
  debarment_calls INTEGER DEFAULT 0,
  dofa_calls INTEGER DEFAULT 0,
  
  -- Cost tracking (if applicable)
  estimated_cost DECIMAL(10,2),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(fsp_id, usage_date)
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

ALTER TABLE astute_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE astute_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE representative_fsp_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE astute_sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE astute_api_usage ENABLE ROW LEVEL SECURITY;

-- Policies for astute_credentials
CREATE POLICY "FSP can view own credentials"
  ON astute_credentials FOR SELECT
  TO authenticated
  USING (
    fsp_id IN (
      SELECT fsp_id FROM users WHERE id = auth.uid()
    )
  );

CREATE POLICY "System can manage credentials"
  ON astute_credentials FOR ALL
  TO service_role
  USING (true);

-- Policies for astute_verifications
CREATE POLICY "Users can view verifications for own FSP reps"
  ON astute_verifications FOR SELECT
  TO authenticated
  USING (
    representative_id IN (
      SELECT r.id FROM representatives r
      INNER JOIN users u ON u.fsp_id = r.fsp_id
      WHERE u.id = auth.uid()
    )
  );

CREATE POLICY "Service role full access to verifications"
  ON astute_verifications FOR ALL
  TO service_role
  USING (true);

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(data TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Use pgcrypto extension for encryption
  RETURN encode(
    encrypt(
      data::bytea,
      current_setting('app.encryption_key')::bytea,
      'aes'
    ),
    'base64'
  );
END;
$$;

-- Function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(encrypted_data TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN convert_from(
    decrypt(
      decode(encrypted_data, 'base64'),
      current_setting('app.encryption_key')::bytea,
      'aes'
    ),
    'utf8'
  );
END;
$$;

-- Function to update verification statistics
CREATE OR REPLACE FUNCTION update_representative_verification_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE representatives
  SET 
    last_verified_date = NEW.verification_date,
    is_debarred = NEW.is_debarred,
    updated_at = NOW()
  WHERE id = NEW.representative_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_verification_stats
  AFTER INSERT ON astute_verifications
  FOR EACH ROW
  EXECUTE FUNCTION update_representative_verification_stats();
```

---

## ASTUTE API SPECIFICATION

### Base Configuration

```typescript
// Astute API Configuration
const ASTUTE_CONFIG = {
  baseUrl: 'https://api.astutefse.com/v2', // Confirm actual URL with Astute
  timeout: 30000, // 30 seconds
  retryAttempts: 3,
  retryDelay: 1000, // 1 second
  
  endpoints: {
    verifyRepresentative: '/compliance/verify-representative',
    checkDebarment: '/compliance/check-debarment',
    getRepHistory: '/compliance/representative-history',
    validateDOFA: '/compliance/validate-dofa',
    verifyFSP: '/compliance/verify-fsp',
    getDailyUpdates: '/compliance/daily-updates',
  },
  
  // Rate limiting (confirm with Astute)
  rateLimit: {
    requestsPerMinute: 60,
    requestsPerHour: 1000,
  }
};
```

### Authentication

```typescript
// Astute uses API Key + FSP Credentials
interface AstuteAuthHeaders {
  'X-API-Key': string;
  'X-FSP-Number': string;
  'X-FSP-Username': string;
  'X-FSP-Password': string;
  'Content-Type': 'application/json';
}
```

### Request/Response Formats

```typescript
// Verify Representative Request
interface VerifyRepresentativeRequest {
  idNumber: string; // SA ID Number (13 digits)
  surname?: string; // For additional verification
  fspNumber?: string; // Optional: specific FSP to check
  includeHistory?: boolean; // Include employment history
  includeDebarment?: boolean; // Include debarment check
}

// Verify Representative Response
interface VerifyRepresentativeResponse {
  success: boolean;
  timestamp: string;
  data: {
    representative: {
      idNumber: string;
      fullNames: string;
      surname: string;
      dateOfBirth: string; // YYYY-MM-DD
      
      // Current FSP
      currentFSP: {
        fspNumber: string;
        fspName: string;
        representativeNumber: string;
        status: 'active' | 'inactive' | 'suspended';
        appointmentDate: string; // YYYY-MM-DD
        dofa: string; // Date of First Appointment (YYYY-MM-DD)
        
        // Authorizations
        categories: string[]; // ['I', 'IIA', 'IIB']
        subCategories: string[]; // ['1.1', '1.3', '1.20']
        
        // Supervision
        supervisor: {
          name: string;
          fspNumber: string;
        } | null;
      } | null;
      
      // Qualifications
      qualifications: {
        re5: {
          status: 'passed' | 'pending' | 'failed' | 'not_required';
          dateObtained: string | null;
          expiryDate: string | null;
        };
        re1: {
          status: 'passed' | 'pending' | 'failed' | 'not_required';
          dateObtained: string | null;
        };
        cob: {
          category: string;
          status: 'current' | 'expired';
          dateObtained: string | null;
          expiryDate: string | null;
        }[];
      };
      
      // Debarment
      debarment: {
        isDebarred: boolean;
        debarmentDate: string | null;
        debarringFSP: string | null;
        debarmentReason: string | null;
        referenceNumber: string | null;
      };
      
      // Employment History (if requested)
      employmentHistory?: {
        fspNumber: string;
        fspName: string;
        startDate: string;
        endDate: string | null;
        categories: string[];
        position: string;
      }[];
    } | null;
  };
  errors?: {
    code: string;
    message: string;
  }[];
}

// Debarment Check Request
interface DebarmentCheckRequest {
  idNumber: string;
  surname?: string;
  includeReason?: boolean;
}

// Debarment Check Response
interface DebarmentCheckResponse {
  success: boolean;
  timestamp: string;
  data: {
    idNumber: string;
    isDebarred: boolean;
    debarmentDetails: {
      debarmentDate: string;
      debarringFSP: string;
      fspNumber: string;
      reason: string;
      referenceNumber: string;
      contactDetails: {
        phone: string;
        email: string;
      };
    } | null;
    checkDate: string;
    certificateUrl?: string; // URL to downloadable certificate
  };
}

// Daily Updates Response
interface DailyUpdatesResponse {
  success: boolean;
  timestamp: string;
  updateDate: string; // YYYY-MM-DD
  data: {
    newDebarments: {
      idNumber: string;
      fullNames: string;
      surname: string;
      debarmentDate: string;
      debarringFSP: string;
      reason: string;
    }[];
    representativeChanges: {
      idNumber: string;
      representativeNumber: string;
      changeType: 'status' | 'category' | 'termination' | 'appointment';
      oldValue: string;
      newValue: string;
      effectiveDate: string;
      fspNumber: string;
    }[];
    fspChanges: {
      fspNumber: string;
      changeType: 'status' | 'license_update' | 'category_change';
      oldValue: string;
      newValue: string;
      effectiveDate: string;
    }[];
  };
}
```

---

## EDGE FUNCTION 1: VERIFY REPRESENTATIVE

### File: `supabase/functions/verify-representative/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ASTUTE_API_URL = Deno.env.get('ASTUTE_API_URL') || 'https://api.astutefse.com/v2';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface VerifyRepRequest {
  representativeId: string;
  idNumber: string;
  surname?: string;
  includeHistory?: boolean;
  verificationType?: 'onboarding' | 'periodic' | 'manual';
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    // 1. Parse request
    const { representativeId, idNumber, surname, includeHistory = true, verificationType = 'manual' }: VerifyRepRequest = await req.json();

    // 2. Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // 3. Get JWT from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    // 4. Verify user and get FSP context
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // 5. Get user's FSP ID
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('fsp_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.fsp_id) {
      throw new Error('User FSP not found');
    }

    const fspId = userData.fsp_id;

    // 6. Get Astute credentials for this FSP
    const { data: credentials, error: credError } = await supabase
      .from('astute_credentials')
      .select('api_key, username, password_hash, subscription_status')
      .eq('fsp_id', fspId)
      .single();

    if (credError || !credentials) {
      throw new Error('Astute credentials not configured for this FSP');
    }

    if (credentials.subscription_status !== 'active') {
      throw new Error('Astute subscription is not active');
    }

    // 7. Decrypt password (implement proper decryption)
    const password = credentials.password_hash; // TODO: Decrypt

    // 8. Call Astute API
    console.log(`Calling Astute API for ID: ${idNumber}`);
    
    const astuteResponse = await fetch(`${ASTUTE_API_URL}/compliance/verify-representative`, {
      method: 'POST',
      headers: {
        'X-API-Key': credentials.api_key,
        'X-FSP-Username': credentials.username,
        'X-FSP-Password': password,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idNumber,
        surname,
        includeHistory,
        includeDebarment: true,
      }),
    });

    if (!astuteResponse.ok) {
      const errorText = await astuteResponse.text();
      console.error('Astute API error:', errorText);
      throw new Error(`Astute API error: ${astuteResponse.status} - ${errorText}`);
    }

    const astuteData = await astuteResponse.json();

    // 9. Store verification result in database
    const verificationStatus = astuteData.data?.representative?.debarment?.isDebarred 
      ? 'debarred' 
      : astuteData.data?.representative 
      ? 'clear' 
      : 'not_found';

    const { data: verificationRecord, error: insertError } = await supabase
      .from('astute_verifications')
      .insert({
        representative_id: representativeId,
        verification_type: verificationType,
        verification_date: new Date().toISOString(),
        status: verificationStatus,
        is_debarred: astuteData.data?.representative?.debarment?.isDebarred || false,
        debarment_date: astuteData.data?.representative?.debarment?.debarmentDate || null,
        debarment_reason: astuteData.data?.representative?.debarment?.debarmentReason || null,
        debarring_fsp: astuteData.data?.representative?.debarment?.debarringFSP || null,
        fsp_number: astuteData.data?.representative?.currentFSP?.fspNumber || null,
        fsp_name: astuteData.data?.representative?.currentFSP?.fspName || null,
        representative_number: astuteData.data?.representative?.currentFSP?.representativeNumber || null,
        dofa: astuteData.data?.representative?.currentFSP?.dofa || null,
        categories: astuteData.data?.representative?.currentFSP?.categories || [],
        sub_categories: astuteData.data?.representative?.currentFSP?.subCategories || [],
        re5_status: astuteData.data?.representative?.qualifications?.re5?.status || null,
        re5_date: astuteData.data?.representative?.qualifications?.re5?.dateObtained || null,
        re1_status: astuteData.data?.representative?.qualifications?.re1?.status || null,
        re1_date: astuteData.data?.representative?.qualifications?.re1?.dateObtained || null,
        raw_response: astuteData,
        requested_by: user.id,
        verification_source: 'astute_api',
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing verification:', insertError);
      throw insertError;
    }

    // 10. Store employment history if available
    if (astuteData.data?.representative?.employmentHistory && astuteData.data.representative.employmentHistory.length > 0) {
      const historyRecords = astuteData.data.representative.employmentHistory.map((history: any) => ({
        representative_id: representativeId,
        previous_fsp_number: history.fspNumber,
        previous_fsp_name: history.fspName,
        employment_start_date: history.startDate,
        employment_end_date: history.endDate,
        position: history.position,
        categories: history.categories,
        data_source: 'astute',
        verified: true,
        verified_date: new Date().toISOString(),
        verified_by: user.id,
      }));

      await supabase
        .from('representative_fsp_history')
        .upsert(historyRecords, { 
          onConflict: 'representative_id,previous_fsp_number,employment_start_date',
          ignoreDuplicates: false 
        });
    }

    // 11. Update API usage tracking
    await supabase.rpc('increment_astute_usage', {
      p_fsp_id: fspId,
      p_call_type: 'verification',
    });

    // 12. Return response
    return new Response(
      JSON.stringify({
        success: true,
        verificationId: verificationRecord.id,
        status: verificationStatus,
        isDebarred: astuteData.data?.representative?.debarment?.isDebarred || false,
        representative: astuteData.data?.representative || null,
        verificationDate: verificationRecord.verification_date,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Error in verify-representative:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
```

---

## EDGE FUNCTION 2: CHECK DEBARMENT

### File: `supabase/functions/check-debarment/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ASTUTE_API_URL = Deno.env.get('ASTUTE_API_URL') || 'https://api.astutefse.com/v2';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface CheckDebarmentRequest {
  representativeId?: string;
  idNumber: string;
  surname?: string;
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { representativeId, idNumber, surname }: CheckDebarmentRequest = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Auth validation
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get FSP and credentials
    const { data: userData } = await supabase
      .from('users')
      .select('fsp_id')
      .eq('id', user.id)
      .single();

    const { data: credentials } = await supabase
      .from('astute_credentials')
      .select('api_key, username, password_hash')
      .eq('fsp_id', userData!.fsp_id)
      .single();

    if (!credentials) {
      throw new Error('Astute credentials not configured');
    }

    // Call Astute API for debarment check
    const astuteResponse = await fetch(`${ASTUTE_API_URL}/compliance/check-debarment`, {
      method: 'POST',
      headers: {
        'X-API-Key': credentials.api_key,
        'X-FSP-Username': credentials.username,
        'X-FSP-Password': credentials.password_hash, // TODO: Decrypt
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idNumber,
        surname,
        includeReason: true,
      }),
    });

    if (!astuteResponse.ok) {
      throw new Error(`Astute API error: ${astuteResponse.status}`);
    }

    const astuteData = await astuteResponse.json();

    // Store debarment check result
    if (representativeId) {
      await supabase
        .from('astute_verifications')
        .insert({
          representative_id: representativeId,
          verification_type: 'debarment',
          status: astuteData.data.isDebarred ? 'debarred' : 'clear',
          is_debarred: astuteData.data.isDebarred,
          debarment_date: astuteData.data.debarmentDetails?.debarmentDate || null,
          debarment_reason: astuteData.data.debarmentDetails?.reason || null,
          debarring_fsp: astuteData.data.debarmentDetails?.debarringFSP || null,
          raw_response: astuteData,
          requested_by: user.id,
          verification_source: 'astute_api',
        });
    }

    // Update usage tracking
    await supabase.rpc('increment_astute_usage', {
      p_fsp_id: userData!.fsp_id,
      p_call_type: 'debarment',
    });

    return new Response(
      JSON.stringify({
        success: true,
        isDebarred: astuteData.data.isDebarred,
        debarmentDetails: astuteData.data.debarmentDetails || null,
        checkDate: astuteData.data.checkDate,
        certificateUrl: astuteData.data.certificateUrl || null,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Error in check-debarment:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
```

---

## EDGE FUNCTION 3: BATCH VERIFY REPRESENTATIVES

### File: `supabase/functions/batch-verify-representatives/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ASTUTE_API_URL = Deno.env.get('ASTUTE_API_URL') || 'https://api.astutefse.com/v2';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface BatchVerifyRequest {
  representativeIds?: string[]; // Optional: specific reps
  checkAll?: boolean; // Check all active reps for FSP
  checkType: 'debarment' | 'full_verification';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { representativeIds, checkAll = false, checkType }: BatchVerifyRequest = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    // Get FSP
    const { data: userData } = await supabase
      .from('users')
      .select('fsp_id')
      .eq('id', user.id)
      .single();

    const fspId = userData!.fsp_id;

    // Get representatives to check
    let repsToCheck;
    if (checkAll) {
      const { data: allReps } = await supabase
        .from('representatives')
        .select('id, id_number, surname')
        .eq('fsp_id', fspId)
        .eq('status', 'active');
      
      repsToCheck = allReps || [];
    } else {
      const { data: specificReps } = await supabase
        .from('representatives')
        .select('id, id_number, surname')
        .in('id', representativeIds || []);
      
      repsToCheck = specificReps || [];
    }

    console.log(`Batch verification: ${repsToCheck.length} representatives`);

    // Get Astute credentials
    const { data: credentials } = await supabase
      .from('astute_credentials')
      .select('*')
      .eq('fsp_id', fspId)
      .single();

    if (!credentials) {
      throw new Error('Astute credentials not configured');
    }

    // Initialize sync log
    const syncLogData = {
      fsp_id: fspId,
      sync_type: 'batch_verification',
      sync_date: new Date().toISOString().split('T')[0],
      status: 'success',
      reps_checked: 0,
      reps_updated: 0,
      new_debarments: 0,
      errors_count: 0,
      started_at: new Date().toISOString(),
      error_log: { errors: [] },
      summary: {},
    };

    const results = [];
    let newDebarments = 0;
    let errorsCount = 0;

    // Process each representative
    for (const rep of repsToCheck) {
      try {
        // Rate limiting: wait 100ms between requests
        await new Promise(resolve => setTimeout(resolve, 100));

        const endpoint = checkType === 'debarment' 
          ? '/compliance/check-debarment'
          : '/compliance/verify-representative';

        const astuteResponse = await fetch(`${ASTUTE_API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'X-API-Key': credentials.api_key,
            'X-FSP-Username': credentials.username,
            'X-FSP-Password': credentials.password_hash, // TODO: Decrypt
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            idNumber: rep.id_number,
            surname: rep.surname,
            includeHistory: checkType === 'full_verification',
            includeDebarment: true,
          }),
        });

        if (!astuteResponse.ok) {
          throw new Error(`API error: ${astuteResponse.status}`);
        }

        const astuteData = await astuteResponse.json();

        // Determine status
        let status = 'clear';
        let isDebarred = false;

        if (checkType === 'debarment') {
          isDebarred = astuteData.data?.isDebarred || false;
          status = isDebarred ? 'debarred' : 'clear';
        } else {
          isDebarred = astuteData.data?.representative?.debarment?.isDebarred || false;
          status = isDebarred ? 'debarred' : astuteData.data?.representative ? 'clear' : 'not_found';
        }

        // Store verification
        await supabase
          .from('astute_verifications')
          .insert({
            representative_id: rep.id,
            verification_type: 'periodic',
            status,
            is_debarred: isDebarred,
            debarment_date: checkType === 'debarment' 
              ? astuteData.data?.debarmentDetails?.debarmentDate 
              : astuteData.data?.representative?.debarment?.debarmentDate,
            debarment_reason: checkType === 'debarment'
              ? astuteData.data?.debarmentDetails?.reason
              : astuteData.data?.representative?.debarment?.debarmentReason,
            debarring_fsp: checkType === 'debarment'
              ? astuteData.data?.debarmentDetails?.debarringFSP
              : astuteData.data?.representative?.debarment?.debarringFSP,
            raw_response: astuteData,
            requested_by: user.id,
            verification_source: 'astute_api',
          });

        if (isDebarred) {
          newDebarments++;
          
          // Update representative status
          await supabase
            .from('representatives')
            .update({ 
              status: 'debarred',
              is_debarred: true,
              updated_at: new Date().toISOString(),
            })
            .eq('id', rep.id);
        }

        results.push({
          representativeId: rep.id,
          status,
          isDebarred,
          success: true,
        });

        syncLogData.reps_checked++;
        syncLogData.reps_updated++;

      } catch (error) {
        console.error(`Error checking rep ${rep.id}:`, error);
        errorsCount++;
        
        (syncLogData.error_log.errors as any[]).push({
          representativeId: rep.id,
          error: error.message,
        });

        results.push({
          representativeId: rep.id,
          success: false,
          error: error.message,
        });
      }
    }

    // Update sync log
    syncLogData.new_debarments = newDebarments;
    syncLogData.errors_count = errorsCount;
    syncLogData.status = errorsCount === 0 ? 'success' : errorsCount < repsToCheck.length ? 'partial' : 'failed';
    
    const completedAt = new Date();
    const durationSeconds = Math.floor((completedAt.getTime() - new Date(syncLogData.started_at).getTime()) / 1000);

    await supabase
      .from('astute_sync_logs')
      .insert({
        ...syncLogData,
        completed_at: completedAt.toISOString(),
        duration_seconds: durationSeconds,
        summary: {
          totalChecked: repsToCheck.length,
          successful: syncLogData.reps_checked,
          newDebarments,
          errors: errorsCount,
        },
      });

    // Update usage
    await supabase.rpc('increment_astute_usage_batch', {
      p_fsp_id: fspId,
      p_call_count: syncLogData.reps_checked,
      p_call_type: checkType,
    });

    return new Response(
      JSON.stringify({
        success: true,
        summary: {
          totalChecked: repsToCheck.length,
          successful: syncLogData.reps_checked,
          newDebarments,
          errors: errorsCount,
        },
        results,
        durationSeconds,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Error in batch-verify-representatives:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
```

---

## EDGE FUNCTION 4: SYNC DAILY UPDATES (CRON JOB)

### File: `supabase/functions/sync-daily-updates/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ASTUTE_API_URL = Deno.env.get('ASTUTE_API_URL') || 'https://api.astutefse.com/v2';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CRON_SECRET = Deno.env.get('CRON_SECRET')!;

/**
 * This function should be called daily via Supabase Cron or external scheduler
 * to fetch daily updates from Astute and update local database
 */
serve(async (req) => {
  try {
    // Verify cron secret
    const cronSecret = req.headers.get('X-Cron-Secret');
    if (cronSecret !== CRON_SECRET) {
      throw new Error('Unauthorized - Invalid cron secret');
    }

    console.log('Starting daily sync from Astute...');

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get all FSPs with active Astute subscriptions
    const { data: fspsWithAstute, error: fspError } = await supabase
      .from('astute_credentials')
      .select('fsp_id, api_key, username, password_hash')
      .eq('subscription_status', 'active');

    if (fspError || !fspsWithAstute || fspsWithAstute.length === 0) {
      console.log('No active Astute subscriptions found');
      return new Response(
        JSON.stringify({ success: true, message: 'No FSPs to sync' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${fspsWithAstute.length} FSPs`);

    const results = [];

    // Process each FSP
    for (const fspCredentials of fspsWithAstute) {
      try {
        console.log(`Processing FSP: ${fspCredentials.fsp_id}`);

        // Call Astute API for daily updates
        const astuteResponse = await fetch(`${ASTUTE_API_URL}/compliance/daily-updates`, {
          method: 'POST',
          headers: {
            'X-API-Key': fspCredentials.api_key,
            'X-FSP-Username': fspCredentials.username,
            'X-FSP-Password': fspCredentials.password_hash, // TODO: Decrypt
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updateDate: new Date().toISOString().split('T')[0], // Today's date YYYY-MM-DD
          }),
        });

        if (!astuteResponse.ok) {
          throw new Error(`Astute API error: ${astuteResponse.status}`);
        }

        const updates = await astuteResponse.json();

        let newDebarments = 0;
        let repsUpdated = 0;

        // Process new debarments
        if (updates.data.newDebarments && updates.data.newDebarments.length > 0) {
          for (const debarment of updates.data.newDebarments) {
            // Find representative by ID number
            const { data: rep } = await supabase
              .from('representatives')
              .select('id')
              .eq('fsp_id', fspCredentials.fsp_id)
              .eq('id_number', debarment.idNumber)
              .single();

            if (rep) {
              // Create verification record
              await supabase
                .from('astute_verifications')
                .insert({
                  representative_id: rep.id,
                  verification_type: 'periodic',
                  status: 'debarred',
                  is_debarred: true,
                  debarment_date: debarment.debarmentDate,
                  debarment_reason: debarment.reason,
                  debarring_fsp: debarment.debarringFSP,
                  raw_response: { debarment },
                  verification_source: 'astute_api',
                });

              // Update representative status
              await supabase
                .from('representatives')
                .update({
                  status: 'debarred',
                  is_debarred: true,
                  updated_at: new Date().toISOString(),
                })
                .eq('id', rep.id);

              newDebarments++;
              repsUpdated++;

              // Create critical alert
              await supabase
                .from('alerts')
                .insert({
                  fsp_id: fspCredentials.fsp_id,
                  representative_id: rep.id,
                  priority: 'critical',
                  category: 'fit_proper',
                  title: `Representative Debarred: ${debarment.fullNames} ${debarment.surname}`,
                  description: `Representative has been debarred by ${debarment.debarringFSP}. Reason: ${debarment.reason}. Immediate action required.`,
                  status: 'open',
                  created_at: new Date().toISOString(),
                });
            }
          }
        }

        // Process representative changes
        if (updates.data.representativeChanges && updates.data.representativeChanges.length > 0) {
          for (const change of updates.data.representativeChanges) {
            const { data: rep } = await supabase
              .from('representatives')
              .select('id')
              .eq('representative_number', change.representativeNumber)
              .single();

            if (rep) {
              // Log the change (you can expand this to update specific fields)
              console.log(`Representative change detected: ${change.changeType} for ${change.representativeNumber}`);
              
              // Create medium priority alert
              await supabase
                .from('alerts')
                .insert({
                  fsp_id: fspCredentials.fsp_id,
                  representative_id: rep.id,
                  priority: 'medium',
                  category: 'general',
                  title: `Representative Update: ${change.changeType}`,
                  description: `Change detected via Astute: ${change.changeType}. Old value: ${change.oldValue}, New value: ${change.newValue}. Effective: ${change.effectiveDate}`,
                  status: 'open',
                  created_at: new Date().toISOString(),
                });

              repsUpdated++;
            }
          }
        }

        // Create sync log
        await supabase
          .from('astute_sync_logs')
          .insert({
            fsp_id: fspCredentials.fsp_id,
            sync_type: 'daily_update',
            sync_date: new Date().toISOString().split('T')[0],
            status: 'success',
            reps_checked: updates.data.newDebarments.length + updates.data.representativeChanges.length,
            reps_updated: repsUpdated,
            new_debarments: newDebarments,
            errors_count: 0,
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            summary: {
              newDebarments: updates.data.newDebarments.length,
              representativeChanges: updates.data.representativeChanges.length,
              fspChanges: updates.data.fspChanges?.length || 0,
            },
          });

        results.push({
          fspId: fspCredentials.fsp_id,
          success: true,
          newDebarments,
          repsUpdated,
        });

        console.log(`Completed FSP ${fspCredentials.fsp_id}: ${newDebarments} new debarments, ${repsUpdated} updates`);

      } catch (error) {
        console.error(`Error processing FSP ${fspCredentials.fsp_id}:`, error);
        
        // Log failed sync
        await supabase
          .from('astute_sync_logs')
          .insert({
            fsp_id: fspCredentials.fsp_id,
            sync_type: 'daily_update',
            sync_date: new Date().toISOString().split('T')[0],
            status: 'failed',
            errors_count: 1,
            error_log: { error: error.message },
            started_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
          });

        results.push({
          fspId: fspCredentials.fsp_id,
          success: false,
          error: error.message,
        });
      }
    }

    console.log('Daily sync completed');

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        results,
        summary: {
          totalFSPs: fspsWithAstute.length,
          successful: results.filter(r => r.success).length,
          failed: results.filter(r => !r.success).length,
          totalNewDebarments: results.reduce((sum, r) => sum + (r.newDebarments || 0), 0),
          totalUpdates: results.reduce((sum, r) => sum + (r.repsUpdated || 0), 0),
        },
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error('Error in sync-daily-updates:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
        timestamp: new Date().toISOString(),
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
```

---

## EDGE FUNCTION 5: VALIDATE DOFA

### File: `supabase/functions/validate-dofa/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ASTUTE_API_URL = Deno.env.get('ASTUTE_API_URL') || 'https://api.astutefse.com/v2';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface ValidateDOFARequest {
  representativeId: string;
  idNumber: string;
  claimedCategories: string[]; // Categories rep claims to be authorized for
}

/**
 * Validates Date of First Appointment (DOFA) to determine if representative
 * needs to complete Fit & Proper requirements or can use exemptions
 */
serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { representativeId, idNumber, claimedCategories }: ValidateDOFARequest = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Get FSP
    const { data: userData } = await supabase
      .from('users')
      .select('fsp_id')
      .eq('id', user.id)
      .single();

    // Get credentials
    const { data: credentials } = await supabase
      .from('astute_credentials')
      .select('*')
      .eq('fsp_id', userData!.fsp_id)
      .single();

    if (!credentials) {
      throw new Error('Astute credentials not configured');
    }

    // Call Astute to validate DOFA
    const astuteResponse = await fetch(`${ASTUTE_API_URL}/compliance/validate-dofa`, {
      method: 'POST',
      headers: {
        'X-API-Key': credentials.api_key,
        'X-FSP-Username': credentials.username,
        'X-FSP-Password': credentials.password_hash, // TODO: Decrypt
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idNumber,
        categories: claimedCategories,
      }),
    });

    if (!astuteResponse.ok) {
      throw new Error(`Astute API error: ${astuteResponse.status}`);
    }

    const astuteData = await astuteResponse.json();

    // DOFA Validation Logic
    const dofaDate = astuteData.data?.dofa ? new Date(astuteData.data.dofa) : null;
    const currentDate = new Date();
    
    // Calculate years since DOFA
    let yearsSinceDofa = 0;
    if (dofaDate) {
      yearsSinceDofa = (currentDate.getTime() - dofaDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    }

    // Determine Fit & Proper requirements based on DOFA
    // Before 1 Jan 2015: May use experience exemptions
    // After 1 Jan 2015: Must complete RE5/RE1 within specified timeframes
    const cutoffDate = new Date('2015-01-01');
    const useExperienceExemption = dofaDate && dofaDate < cutoffDate;

    // Determine required qualifications per category
    const requirementsPerCategory = claimedCategories.map(category => {
      let requiredQualification = 'RE5'; // Default
      
      if (category.startsWith('II')) {
        requiredQualification = 'RE1 or RE5';
      } else if (category === 'IIIA') {
        requiredQualification = 'RE5';
      }

      return {
        category,
        requiredQualification,
        canUseExperience: useExperienceExemption && yearsSinceDofa >= 5, // 5+ years experience
        yearsRequired: useExperienceExemption ? 5 : 0,
      };
    });

    // Store validation result
    await supabase
      .from('astute_verifications')
      .insert({
        representative_id: representativeId,
        verification_type: 'dofa',
        status: 'clear',
        dofa: dofaDate?.toISOString().split('T')[0],
        categories: claimedCategories,
        raw_response: {
          ...astuteData,
          validationResult: {
            useExperienceExemption,
            yearsSinceDofa: Math.floor(yearsSinceDofa),
            requirementsPerCategory,
          },
        },
        requested_by: user.id,
        verification_source: 'astute_api',
      });

    // Update usage
    await supabase.rpc('increment_astute_usage', {
      p_fsp_id: userData!.fsp_id,
      p_call_type: 'dofa',
    });

    return new Response(
      JSON.stringify({
        success: true,
        dofa: dofaDate?.toISOString().split('T')[0] || null,
        yearsSinceDofa: Math.floor(yearsSinceDofa),
        useExperienceExemption,
        requirementsPerCategory,
        validationMessage: useExperienceExemption 
          ? `Representative can use experience exemption (DOFA: ${dofaDate?.toISOString().split('T')[0]}, ${Math.floor(yearsSinceDofa)} years experience)`
          : `Representative must complete required RE exams (DOFA: ${dofaDate?.toISOString().split('T')[0] || 'Not found'})`,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Error in validate-dofa:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
```

---

## EDGE FUNCTION 6: GET REPRESENTATIVE HISTORY

### File: `supabase/functions/get-representative-history/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ASTUTE_API_URL = Deno.env.get('ASTUTE_API_URL') || 'https://api.astutefse.com/v2';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

interface GetHistoryRequest {
  representativeId: string;
  idNumber: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  try {
    const { representativeId, idNumber }: GetHistoryRequest = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Auth
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    
    if (!user) {
      throw new Error('Unauthorized');
    }

    // Get FSP and credentials
    const { data: userData } = await supabase
      .from('users')
      .select('fsp_id')
      .eq('id', user.id)
      .single();

    const { data: credentials } = await supabase
      .from('astute_credentials')
      .select('*')
      .eq('fsp_id', userData!.fsp_id)
      .single();

    if (!credentials) {
      throw new Error('Astute credentials not configured');
    }

    // Call Astute API
    const astuteResponse = await fetch(`${ASTUTE_API_URL}/compliance/representative-history`, {
      method: 'POST',
      headers: {
        'X-API-Key': credentials.api_key,
        'X-FSP-Username': credentials.username,
        'X-FSP-Password': credentials.password_hash, // TODO: Decrypt
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        idNumber,
      }),
    });

    if (!astuteResponse.ok) {
      throw new Error(`Astute API error: ${astuteResponse.status}`);
    }

    const astuteData = await astuteResponse.json();

    // Store employment history
    if (astuteData.data?.employmentHistory && astuteData.data.employmentHistory.length > 0) {
      const historyRecords = astuteData.data.employmentHistory.map((history: any) => ({
        representative_id: representativeId,
        previous_fsp_number: history.fspNumber,
        previous_fsp_name: history.fspName,
        employment_start_date: history.startDate,
        employment_end_date: history.endDate,
        position: history.position,
        categories: history.categories,
        data_source: 'astute',
        verified: true,
        verified_date: new Date().toISOString(),
        verified_by: user.id,
      }));

      await supabase
        .from('representative_fsp_history')
        .upsert(historyRecords, {
          onConflict: 'representative_id,previous_fsp_number,employment_start_date',
          ignoreDuplicates: false,
        });
    }

    // Update usage
    await supabase.rpc('increment_astute_usage', {
      p_fsp_id: userData!.fsp_id,
      p_call_type: 'history',
    });

    return new Response(
      JSON.stringify({
        success: true,
        employmentHistory: astuteData.data?.employmentHistory || [],
        totalPositions: astuteData.data?.employmentHistory?.length || 0,
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );

  } catch (error) {
    console.error('Error in get-representative-history:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Internal server error',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
});
```

---

## SUPABASE RPC FUNCTIONS

### File: Add to Supabase SQL Editor

```sql
-- ============================================
-- HELPER RPC FUNCTIONS FOR ASTUTE INTEGRATION
-- ============================================

-- Function to increment API usage tracking
CREATE OR REPLACE FUNCTION increment_astute_usage(
  p_fsp_id UUID,
  p_call_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO astute_api_usage (
    fsp_id,
    usage_date,
    total_calls,
    verification_calls,
    debarment_calls,
    dofa_calls
  )
  VALUES (
    p_fsp_id,
    CURRENT_DATE,
    CASE WHEN p_call_type = 'verification' THEN 1 ELSE 0 END,
    CASE WHEN p_call_type = 'verification' THEN 1 ELSE 0 END,
    CASE WHEN p_call_type = 'debarment' THEN 1 ELSE 0 END,
    CASE WHEN p_call_type = 'dofa' THEN 1 ELSE 0 END
  )
  ON CONFLICT (fsp_id, usage_date)
  DO UPDATE SET
    total_calls = astute_api_usage.total_calls + 1,
    verification_calls = astute_api_usage.verification_calls + 
      CASE WHEN p_call_type = 'verification' THEN 1 ELSE 0 END,
    debarment_calls = astute_api_usage.debarment_calls + 
      CASE WHEN p_call_type = 'debarment' THEN 1 ELSE 0 END,
    dofa_calls = astute_api_usage.dofa_calls + 
      CASE WHEN p_call_type = 'dofa' THEN 1 ELSE 0 END,
    updated_at = NOW();
END;
$$;

-- Function to increment usage for batch operations
CREATE OR REPLACE FUNCTION increment_astute_usage_batch(
  p_fsp_id UUID,
  p_call_count INTEGER,
  p_call_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO astute_api_usage (
    fsp_id,
    usage_date,
    total_calls,
    verification_calls,
    debarment_calls
  )
  VALUES (
    p_fsp_id,
    CURRENT_DATE,
    p_call_count,
    CASE WHEN p_call_type = 'verification' OR p_call_type = 'full_verification' THEN p_call_count ELSE 0 END,
    CASE WHEN p_call_type = 'debarment' THEN p_call_count ELSE 0 END
  )
  ON CONFLICT (fsp_id, usage_date)
  DO UPDATE SET
    total_calls = astute_api_usage.total_calls + p_call_count,
    verification_calls = astute_api_usage.verification_calls + 
      CASE WHEN p_call_type = 'verification' OR p_call_type = 'full_verification' THEN p_call_count ELSE 0 END,
    debarment_calls = astute_api_usage.debarment_calls + 
      CASE WHEN p_call_type = 'debarment' THEN p_call_count ELSE 0 END,
    updated_at = NOW();
END;
$$;

-- Function to get representative verification status
CREATE OR REPLACE FUNCTION get_representative_verification_status(
  p_representative_id UUID
)
RETURNS TABLE (
  last_verified_date TIMESTAMP WITH TIME ZONE,
  is_debarred BOOLEAN,
  verification_status TEXT,
  days_since_last_check INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    av.verification_date,
    av.is_debarred,
    av.status,
    EXTRACT(DAY FROM NOW() - av.verification_date)::INTEGER
  FROM astute_verifications av
  WHERE av.representative_id = p_representative_id
  ORDER BY av.verification_date DESC
  LIMIT 1;
END;
$$;

-- Function to get FSPs needing monthly debarment check
CREATE OR REPLACE FUNCTION get_fsps_needing_debarment_check()
RETURNS TABLE (
  fsp_id UUID,
  fsp_name TEXT,
  last_check_date DATE,
  days_since_check INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    f.id,
    f.business_name,
    COALESCE(MAX(asl.sync_date), '2020-01-01'::DATE) as last_check,
    EXTRACT(DAY FROM CURRENT_DATE - COALESCE(MAX(asl.sync_date), '2020-01-01'::DATE))::INTEGER as days
  FROM fsps f
  INNER JOIN astute_credentials ac ON ac.fsp_id = f.id
  LEFT JOIN astute_sync_logs asl ON asl.fsp_id = f.id AND asl.sync_type = 'debarment_check'
  WHERE ac.subscription_status = 'active'
  GROUP BY f.id, f.business_name
  HAVING EXTRACT(DAY FROM CURRENT_DATE - COALESCE(MAX(asl.sync_date), '2020-01-01'::DATE)) >= 30
  ORDER BY days DESC;
END;
$$;
```

---

## ENVIRONMENT VARIABLES

### File: `.env` (for local development)

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Astute FSE API
ASTUTE_API_URL=https://api.astutefse.com/v2
ASTUTE_API_KEY=your-api-key-from-astute

# Security
CRON_SECRET=your-random-secret-for-cron-jobs
ENCRYPTION_KEY=your-32-byte-encryption-key

# Optional: Rate Limiting
RATE_LIMIT_REQUESTS_PER_MINUTE=60
RATE_LIMIT_REQUESTS_PER_HOUR=1000
```

---

## DEPLOYMENT CHECKLIST

### Pre-Deployment

- [ ] **Database Schema**: Run all SQL migrations in Supabase SQL Editor
- [ ] **RLS Policies**: Verify Row Level Security policies are enabled
- [ ] **Environment Variables**: Set all required env vars in Supabase dashboard
- [ ] **Astute Credentials**: Obtain API keys from Astute FSE
- [ ] **Encryption**: Set up encryption key for sensitive data
- [ ] **CORS**: Configure allowed origins

### Edge Functions Deployment

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Deploy all functions
supabase functions deploy verify-representative
supabase functions deploy check-debarment
supabase functions deploy batch-verify-representatives
supabase functions deploy sync-daily-updates
supabase functions deploy validate-dofa
supabase functions deploy get-representative-history

# Set environment variables (do this for each function)
supabase secrets set ASTUTE_API_URL=https://api.astutefse.com/v2
supabase secrets set CRON_SECRET=your-secret
```

### Post-Deployment

- [ ] **Test Each Function**: Use Postman/curl to test all endpoints
- [ ] **Set Up Cron**: Configure daily sync cron job in Supabase
- [ ] **Monitor Logs**: Check function logs for errors
- [ ] **Test Webhooks**: If Astute provides webhooks, configure them
- [ ] **Alert System**: Set up alerts for failed syncs

---

## TESTING SCENARIOS

### Test 1: Verify Representative (Success)

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/verify-representative' \
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

**Expected Response:**
```json
{
  "success": true,
  "verificationId": "uuid",
  "status": "clear",
  "isDebarred": false,
  "representative": {
    "idNumber": "8706155800084",
    "fullNames": "Sarah",
    "surname": "Naidoo",
    "currentFSP": {
      "fspNumber": "12345",
      "fspName": "Example FSP",
      "status": "active",
      "dofa": "2015-03-15"
    }
  }
}
```

### Test 2: Check Debarment (Debarred)

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/check-debarment' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "representativeId": "uuid-here",
    "idNumber": "7501015800082",
    "surname": "Smith"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "isDebarred": true,
  "debarmentDetails": {
    "debarmentDate": "2023-05-15",
    "debarringFSP": "ABC Financial Services",
    "reason": "Non-compliance with FAIS Act",
    "referenceNumber": "DEB-2023-0123"
  }
}
```

### Test 3: Batch Verification

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/batch-verify-representatives' \
  -H 'Authorization: Bearer YOUR_JWT_TOKEN' \
  -H 'Content-Type: application/json' \
  -d '{
    "checkAll": true,
    "checkType": "debarment"
  }'
```

### Test 4: Daily Sync (Cron)

```bash
curl -X POST 'https://your-project.supabase.co/functions/v1/sync-daily-updates' \
  -H 'X-Cron-Secret: your-cron-secret' \
  -H 'Content-Type: application/json'
```

---

## MONITORING AND MAINTENANCE

### Logging

All edge functions include comprehensive logging:
```typescript
console.log(`Processing representative: ${repId}`);
console.error('Astute API error:', error);
```

View logs:
```bash
supabase functions logs verify-representative
supabase functions logs sync-daily-updates --tail
```

### Performance Monitoring

Monitor in Supabase Dashboard:
- Function invocation count
- Average execution time
- Error rate
- API usage per FSP

### Alerts

Set up alerts for:
1. **Failed Daily Syncs**: If sync-daily-updates fails
2. **High Error Rate**: If > 5% of verifications fail
3. **API Quota**: When approaching Astute usage limits
4. **New Debarments**: Immediate notification on debarment detection

---

## ERROR HANDLING

All functions implement:

1. **Retry Logic**: 3 attempts with exponential backoff
2. **Detailed Error Logs**: Store in database
3. **Graceful Degradation**: Continue on partial failures
4. **User-Friendly Messages**: Return actionable errors

Example error response:
```json
{
  "success": false,
  "error": "Astute API temporarily unavailable",
  "code": "ASTUTE_API_ERROR",
  "retryable": true,
  "timestamp": "2024-11-24T10:30:00Z"
}
```

---

## SECURITY CONSIDERATIONS

1. **Credential Encryption**: All Astute passwords encrypted at rest
2. **RLS Policies**: Strict row-level security on all tables
3. **JWT Verification**: All functions verify user authentication
4. **Rate Limiting**: Prevent abuse
5. **Audit Logging**: Track all API calls
6. **HTTPS Only**: All communication over TLS
7. **Secret Management**: Use Supabase Vault for secrets

---

## COST OPTIMIZATION

1. **Caching**: Cache verification results for 24 hours
2. **Batch Operations**: Group multiple checks
3. **Incremental Sync**: Only fetch new updates
4. **Rate Limiting**: Respect Astute API limits
5. **Usage Monitoring**: Track and optimize API calls

---

## SUCCESS CRITERIA

Astute integration is complete when:

- âœ… All 6 edge functions deployed and tested
- âœ… Database schema created with RLS policies
- âœ… Daily sync cron job running successfully
- âœ… Representative verification working on onboarding
- âœ… Debarment checks automated monthly
- âœ… DOFA validation integrated into Fit & Proper workflow
- âœ… Employment history automatically populated
- âœ… Error handling and retry logic tested
- âœ… Usage tracking and monitoring in place
- âœ… Documentation complete

---

## NEXT STEPS

After completing this integration:

1. **FSCA Direct API**: Implement representative register submissions
2. **Webhook Handling**: If Astute offers push notifications
3. **Advanced Analytics**: Dashboard for verification trends
4. **Predictive Alerts**: ML-based compliance risk scoring
5. **Mobile App**: Native mobile support for verifications

---

**END OF CURSOR PROMPT**

Generated: 24 November 2024  
Integration: Astute FSE API  
Technology: Supabase Edge Functions (Deno)  
Estimated Effort: 60-80 hours development + testing  
Complexity: HIGH (external API, security, daily automation)
