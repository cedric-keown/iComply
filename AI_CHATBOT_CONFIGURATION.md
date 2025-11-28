# AI Chatbot Configuration Guide

## Supabase Project Configuration

**Project ID:** `mdpblurdxwdbsxnmuhyb`  
**Project URL:** `https://mdpblurdxwdbsxnmuhyb.supabase.co`  
**Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcGJsdXJkeHdkYnN4bm11aHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTA5ODUsImV4cCI6MjA3OTQ2Njk4NX0.qwiO10chWrUKxNIwppMNfGxUwjspkq0skbaC6JxhEBo`

---

## Database Tables

### chatbot_interactions
- Stores all chatbot conversations
- Foreign key: `user_id` → `auth.users(id)`
- Indexes: user_id, module, created_at

### chatbot_feedback
- Stores user feedback on responses
- Foreign key: `interaction_id` → `chatbot_interactions(id)`
- Foreign key: `user_id` → `auth.users(id)`

---

## Configuration Steps

### 1. Update app.js Configuration

Update `/Users/cedrickeown/Documents/GitHub/iComply/js/app.js`:

```javascript
config: {
    supabaseUrl: 'https://mdpblurdxwdbsxnmuhyb.supabase.co',
    supabaseAnonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1kcGJsdXJkeHdkYnN4bm11aHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4OTA5ODUsImV4cCI6MjA3OTQ2Njk4NX0.qwiO10chWrUKxNIwppMNfGxUwjspkq0skbaC6JxhEBo',
    apiBaseUrl: '/api',
    version: '1.0.0'
}
```

### 2. Deploy Edge Function

The chatbot Edge Function needs to be deployed:

```bash
cd /Users/cedrickeown/Documents/GitHub/iComply
supabase functions deploy chatbot
```

**Edge Function Path:** `supabase/functions/chatbot/index.ts`  
**Endpoint:** `https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/chatbot`

### 3. Configure OpenAI API Key

Add OpenAI API key to Supabase Edge Function secrets:

```bash
supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
```

Or set in Supabase Dashboard:
- Go to Project Settings → Edge Functions → Secrets
- Add `OPENAI_API_KEY` with your OpenAI API key

### 4. Test Configuration

1. Open browser console
2. Navigate to iComply application
3. Click chatbot button
4. Send test message: "Hello"
5. Check console for errors
6. Verify response appears

---

## Frontend Integration

### Files Location
- **CSS:** `modules/ai-chatbot/css/chatbot-styles.css`
- **Main JS:** `modules/ai-chatbot/js/chatbot.js`
- **Service:** `modules/ai-chatbot/js/chatbot-service.js`
- **Context:** `modules/ai-chatbot/js/chatbot-context.js`

### Initialization

The chatbot is initialized in `index.html`:

```javascript
// Initialize Chatbot
if (typeof _chatbot !== 'undefined') {
    _chatbot.init();
} else {
    console.warn('Chatbot module not available');
}
```

---

## Testing Checklist

- [x] Database tables created
- [x] Test data inserted
- [x] Queries tested
- [x] Foreign keys verified
- [ ] Supabase configuration updated in app.js
- [ ] Edge Function deployed
- [ ] OpenAI API key configured
- [ ] Frontend integration tested
- [ ] RLS policies added (recommended)

---

## API Endpoints

### Chatbot Edge Function
- **URL:** `https://mdpblurdxwdbsxnmuhyb.supabase.co/functions/v1/chatbot`
- **Method:** POST
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {anon_key}`
  - `apikey: {anon_key}`

### Request Body
```json
{
  "message": "User's question",
  "context": {
    "module": "clients-fica",
    "page": "verification",
    "userRole": "compliance_officer"
  },
  "userId": "user-uuid"
}
```

### Response
```json
{
  "response": "AI-generated response",
  "usage": {
    "tokens": 245,
    "cost": 0.0120
  },
  "context": {
    "module": "clients-fica"
  }
}
```

---

## Troubleshooting

### Issue: "User not authenticated"
**Solution:** Ensure user is logged in and session is valid

### Issue: "Supabase configuration not found"
**Solution:** Check `app.js` has correct Supabase URL and anon key

### Issue: "Edge Function not found"
**Solution:** Deploy Edge Function using `supabase functions deploy chatbot`

### Issue: "OpenAI API error"
**Solution:** Verify OpenAI API key is set in Supabase secrets

---

## Security Notes

1. **RLS Policies:** Add Row Level Security policies to restrict access:
   - Users can only view their own interactions
   - Admins can view all interactions

2. **Rate Limiting:** Edge Function includes rate limiting (10 requests/minute per user)

3. **API Keys:** Never expose OpenAI API key in frontend code

---

**Last Updated:** November 28, 2025

