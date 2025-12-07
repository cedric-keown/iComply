# User-Representative Linking - Debug Guide

## 🔍 **Troubleshooting Representative Link Saving**

### Status: Debugging Active
### Date: December 6, 2025

---

## 🚨 **Issue Reported**

"Editing user profile is not saving linked rep"

---

## 🔧 **Debugging Steps**

### **Step 1: Check Browser Console**

When you edit a user and save, check the browser console for:

```javascript
// Expected console output:
Form submission - Representative link: {
    isEditMode: true,
    userId: "8bc581b7-6963-4ac0-9371-b5abb6520864",
    selectedRepId: "77e5eeb2-1556-4aae-9e6a-aba7f0fc7d8e",
    currentLink: null
}

User profile updated, now updating representative link...

// Should show one of:
✅ Using Supabase client for rep link update
✅ Cleared existing rep link for user: ...
✅ Created new rep link: ...

// OR:
⚠️ Supabase client not available
```

### **Step 2: Verify Supabase Client**

In browser console, run:
```javascript
// Check if Supabase client exists
console.log('window.supabase:', typeof window.supabase);
console.log('window._supabase:', typeof window._supabase);

// One of these should be 'object', not 'undefined'
```

### **Step 3: Manual Test**

If Supabase client is available, test directly:
```javascript
// Test update (replace with actual IDs)
const result = await window._supabase
    .from('representatives')
    .update({ user_profile_id: 'USER_PROFILE_ID_HERE' })
    .eq('id', 'REP_ID_HERE')
    .select();

console.log('Manual test result:', result);
```

---

## ✅ **Solutions**

### **Solution 1: Use Supabase MCP (Recommended)**

If the browser client isn't working, I can update representatives directly via Supabase MCP:

```javascript
// Run via Supabase MCP:
mcp_supabase_execute_sql({
    project_id: 'mdpblurdxwdbsxnmuhyb',
    query: `
        UPDATE representatives 
        SET user_profile_id = 'USER_PROFILE_ID',
            updated_at = NOW()
        WHERE id = 'REPRESENTATIVE_ID';
    `
});
```

### **Solution 2: Add Database Function**

Create a dedicated function for linking:

```sql
CREATE OR REPLACE FUNCTION link_user_to_representative(
    p_user_profile_id UUID,
    p_representative_id UUID
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Clear old link for this user
    UPDATE representatives 
    SET user_profile_id = NULL 
    WHERE user_profile_id = p_user_profile_id;
    
    -- Clear old link for this representative
    UPDATE representatives
    SET user_profile_id = NULL
    WHERE id = p_representative_id AND user_profile_id IS NOT NULL;
    
    -- Create new link (if rep ID provided)
    IF p_representative_id IS NOT NULL THEN
        UPDATE representatives
        SET user_profile_id = p_user_profile_id,
            updated_at = NOW()
        WHERE id = p_representative_id;
    END IF;
    
    RETURN json_build_object('success', true, 'message', 'Link updated');
END;
$$;
```

### **Solution 3: Check Supabase Initialization**

Ensure the Supabase client is initialized in `settings_administration.html`:

```html
<!-- Check if this exists in the HTML file -->
<script>
    // Initialize Supabase
    if (typeof window.supabase !== 'undefined') {
        window._supabase = window.supabase.createClient(
            'YOUR_SUPABASE_URL',
            'YOUR_SUPABASE_ANON_KEY'
        );
    }
</script>
```

---

## 🧪 **Testing Procedure**

### **Test 1: Verify Current State**

Run in browser console:
```javascript
// Check what's available
console.log({
    supabase: typeof window.supabase,
    _supabase: typeof window._supabase,
    dataFunctions: typeof dataFunctions,
    authService: typeof authService
});
```

### **Test 2: Check Current Links**

Run via Supabase MCP or SQL Editor:
```sql
SELECT 
    up.first_name || ' ' || up.last_name as user_name,
    up.email,
    r.first_name || ' ' || r.surname as rep_name,
    r.representative_number,
    r.user_profile_id
FROM user_profiles up
LEFT JOIN representatives r ON r.user_profile_id = up.id
WHERE up.email = 'cedric@customapp.co.za';
```

### **Test 3: Manual Link (If Needed)**

If automated linking fails, use manual SQL:
```sql
-- Link Cedric to REP-0011
UPDATE representatives
SET user_profile_id = '8bc581b7-6963-4ac0-9371-b5abb6520864',
    updated_at = NOW()
WHERE representative_number = 'REP-0011';
```

---

## 💡 **Quick Fix Options**

### **Option A: Use Supabase MCP (Immediate)**

I can link users right now using the Supabase MCP tools:

```
Tell me which users to link and I'll do it via MCP immediately
```

### **Option B: Add Database Function (Permanent)**

I can create a proper database function for linking:

```
This will work from any page, no Supabase client needed
```

### **Option C: Fix Supabase Client (Root Cause)**

Ensure Supabase client is properly initialized in settings page:

```
Check HTML file includes Supabase initialization
```

---

## 🎯 **Recommended Action**

### **Immediate Fix:**

Let me link users for you via Supabase MCP right now. Just tell me:
1. User email
2. Representative number or name

I'll execute the SQL immediately.

### **Permanent Fix:**

Create a database function `link_user_to_representative()` that:
- Works from any page
- Doesn't require Supabase client
- Can be called via dataFunctions.callFunction()
- Provides reliable linking

---

## 📝 **Debug Checklist**

When testing linking:

- [ ] Open browser console (F12)
- [ ] Navigate to Settings → User Management
- [ ] Click Edit on a user
- [ ] Select representative from dropdown
- [ ] Click Save
- [ ] Watch console for messages
- [ ] Check for errors
- [ ] Verify link in database
- [ ] Refresh user table
- [ ] Check "Linked Representative" column updated

---

## 🆘 **If Still Not Working**

Run this diagnostic:

```javascript
// In browser console:
console.log('Diagnostic Info:', {
    page: window.location.pathname,
    supabase: typeof window.supabase,
    _supabase: typeof window._supabase,
    authService: typeof authService,
    dataFunctions: typeof dataFunctions,
    updateRepresentativeLink: typeof updateRepresentativeLink
});
```

Send me the output and I'll provide specific fix.

---

## ✅ **Workaround (Always Works)**

While debugging, you can always link via Supabase MCP:

```
Just tell me: "Link user X to representative Y"
And I'll execute the SQL via MCP immediately
```

---

**Status:** Ready to debug and fix!

