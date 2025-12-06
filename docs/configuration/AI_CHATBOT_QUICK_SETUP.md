# AI Chatbot Quick Setup Guide

This guide will help you quickly set up the AI chatbot in your iComply application.

## Prerequisites

1. **OpenAI API Key** (or Anthropic Claude API key)
   - Sign up at https://platform.openai.com/
   - Create an API key in your account settings
   - Keep this key secure - you'll need it for the Edge Function

2. **Supabase Project**
   - Your existing Supabase project
   - Access to Supabase dashboard for environment variables

## Setup Steps

### Step 1: Run Database Migration

Run the migration to create the chatbot tables:

```bash
# Using Supabase CLI
supabase db push

# Or manually run the SQL file in Supabase SQL Editor
# File: supabase/migrations/create_chatbot_tables.sql
```

### Step 2: Deploy Edge Function

1. **Install Supabase CLI** (if not already installed):
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**:
   ```bash
   supabase login
   ```

3. **Link your project**:
   ```bash
   supabase link --project-ref your-project-ref
   ```

4. **Set Environment Variables**:
   ```bash
   # Set OpenAI API key
   supabase secrets set OPENAI_API_KEY=your-openai-api-key-here
   
   # Optional: Set custom Supabase URL (if different)
   # supabase secrets set SUPABASE_URL=https://your-project.supabase.co
   ```

5. **Deploy the Edge Function**:
   ```bash
   supabase functions deploy chatbot
   ```

### Step 3: Verify Files Are in Place

Ensure these files exist:
- ✅ `modules/ai-chatbot/css/chatbot-styles.css`
- ✅ `modules/ai-chatbot/js/chatbot.js`
- ✅ `modules/ai-chatbot/js/chatbot-service.js`
- ✅ `modules/ai-chatbot/js/chatbot-context.js`
- ✅ `supabase/functions/chatbot/index.ts`
- ✅ `supabase/migrations/create_chatbot_tables.sql`

### Step 4: Update Configuration (if needed)

If your Supabase URL or configuration is different, update:

**File**: `modules/ai-chatbot/js/chatbot-service.js`
- Line 6: Update `API_ENDPOINT` if your Edge Function path is different

**File**: `js/app.js` or your Supabase config
- Ensure `supabaseUrl` and `supabaseAnonKey` are correctly set

### Step 5: Test the Integration

1. **Open your application** in a browser
2. **Look for the chatbot button** in the bottom-right corner
3. **Click the help menu** (question mark icon) and select "Ask AI Assistant"
4. **Try a test message**: "How do I add a new representative?"

## Troubleshooting

### Chatbot button not appearing

- Check browser console for JavaScript errors
- Verify all script files are loading (check Network tab)
- Ensure CSS file is loaded correctly

### "Unauthorized" error

- Verify user is logged in
- Check that Supabase auth is working
- Verify Edge Function has correct authentication setup

### "Rate limit exceeded" error

- This is normal - the function limits to 20 requests per minute per user
- Wait a minute and try again
- Adjust `RATE_LIMIT` in `supabase/functions/chatbot/index.ts` if needed

### "OPENAI_API_KEY not configured" error

- Verify environment variable is set: `supabase secrets list`
- Redeploy the function: `supabase functions deploy chatbot`
- Check Supabase dashboard → Edge Functions → chatbot → Settings → Secrets

### Messages not saving to database

- Check RLS policies are correct
- Verify `chatbot_interactions` table exists
- Check Supabase logs for errors

## Cost Estimation

### OpenAI GPT-3.5-turbo
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Average conversation**: ~500 tokens
- **Cost per conversation**: ~$0.001
- **1,000 conversations/month**: ~$1
- **10,000 conversations/month**: ~$10

### Monitoring Costs

Check your OpenAI usage dashboard regularly:
https://platform.openai.com/usage

## Next Steps

1. **Customize System Prompt**: Edit `buildSystemPrompt()` in `supabase/functions/chatbot/index.ts`
2. **Add Module-Specific Context**: Enhance `chatbot-context.js` with more context detection
3. **Implement Feedback Loop**: Use feedback data to improve responses
4. **Add Analytics**: Track usage, satisfaction, and common questions

## Alternative: Use Anthropic Claude

To switch to Claude instead of OpenAI:

1. **Update Edge Function** (`supabase/functions/chatbot/index.ts`):
   - Change `ANTHROPIC_API_KEY` environment variable
   - Replace OpenAI API call with Claude API call
   - Update system prompt format

2. **Set Environment Variable**:
   ```bash
   supabase secrets set ANTHROPIC_API_KEY=your-anthropic-key
   ```

3. **Update API Call**:
   ```typescript
   const response = await fetch('https://api.anthropic.com/v1/messages', {
     method: 'POST',
     headers: {
       'x-api-key': ANTHROPIC_API_KEY,
       'anthropic-version': '2023-06-01',
       'Content-Type': 'application/json',
     },
     body: JSON.stringify({
       model: 'claude-3-haiku-20240307',
       max_tokens: 500,
       messages: [
         { role: 'user', content: message }
       ],
       system: systemPrompt
     })
   });
   ```

## Security Notes

1. **Never commit API keys** to version control
2. **Use environment variables** for all secrets
3. **Enable rate limiting** (already implemented)
4. **Review RLS policies** regularly
5. **Monitor usage** for unusual patterns
6. **Sanitize user inputs** (already implemented)

## Support

For issues or questions:
1. Check the main implementation guide: `AI_CHATBOT_IMPLEMENTATION_GUIDE.md`
2. Review Supabase Edge Functions documentation
3. Check OpenAI API documentation for API-specific issues

