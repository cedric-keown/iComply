# AI Chatbot Implementation Guide for iComply

## Overview

This guide outlines how to effectively implement an AI chatbot into the iComply compliance management system. The chatbot will provide context-aware assistance for compliance-related queries, help users navigate the system, and answer questions about FICA, CPD, Fit & Proper, and other compliance modules.

## Table of Contents

1. [Architecture Options](#architecture-options)
2. [Recommended Implementation](#recommended-implementation)
3. [Integration Points](#integration-points)
4. [Technical Implementation](#technical-implementation)
5. [Context Awareness](#context-awareness)
6. [Security & Privacy](#security--privacy)
7. [Deployment Options](#deployment-options)

---

## Architecture Options

### Option 1: Floating Widget (Recommended)
- **Pros**: Always accessible, non-intrusive, works across all modules
- **Cons**: Takes up screen space
- **Best for**: General help and quick questions

### Option 2: Embedded Component
- **Pros**: Integrated into specific pages, contextual
- **Cons**: Only available on specific pages
- **Best for**: Module-specific help (e.g., CPD guidance, FICA questions)

### Option 3: Modal/Overlay
- **Pros**: Full-screen experience, focused interaction
- **Cons**: Blocks other content
- **Best for**: Complex queries requiring detailed responses

### Option 4: Hybrid Approach (Recommended)
- Combine floating widget (always available) with embedded components (context-specific)
- Use modal for complex interactions

---

## Recommended Implementation

### Phase 1: Core Chatbot Widget
1. **Floating Chat Button**
   - Position: Bottom-right corner
   - Icon: Chat bubble with badge for unread messages
   - Animation: Subtle pulse when new suggestions available
   - Z-index: 1050 (above Bootstrap modals)

2. **Chat Window**
   - Slide-up panel (mobile-friendly)
   - Collapsible header with minimize/maximize
   - Message history with timestamps
   - Typing indicators
   - Quick action buttons for common queries

3. **Integration with Existing Help Menu**
   - Add "Ask AI Assistant" option to help dropdown
   - Link to open chatbot

### Phase 2: Context-Aware Features
1. **Module Detection**
   - Detect current module/page
   - Provide module-specific suggestions
   - Pre-load relevant context

2. **Smart Suggestions**
   - Based on current page: "How do I add a new representative?"
   - Based on user role: "What are my CPD requirements?"
   - Based on alerts: "How do I resolve this FICA alert?"

3. **Data-Aware Responses**
   - Reference actual user data (with privacy controls)
   - "You have 3 overdue FICA reviews"
   - "Your CPD progress is 75% complete"

### Phase 3: Advanced Features
1. **Document Analysis**
   - Upload compliance documents for analysis
   - Extract key information
   - Answer questions about document content

2. **Workflow Guidance**
   - Step-by-step instructions for complex tasks
   - Interactive tutorials
   - Link to relevant forms/modules

3. **Compliance Query Engine**
   - Answer questions about FSCA regulations
   - Explain compliance requirements
   - Provide deadline calculations

---

## Integration Points

### 1. Navigation Bar Integration
```html
<!-- Add to existing help dropdown -->
<li><a class="dropdown-item" href="#" id="openChatbot">
    <i class="fas fa-robot me-2"></i>Ask AI Assistant
</a></li>
```

### 2. Module-Specific Integration
- **CPD Module**: "How do I log CPD hours?"
- **FICA Module**: "What documents are required for FICA verification?"
- **Complaints Module**: "How do I log a new complaint?"
- **Representatives Module**: "What are the Fit & Proper requirements?"

### 3. Alert Integration
- When user clicks on an alert, suggest: "Need help with this alert? Ask the AI assistant"
- Pre-populate chatbot with alert context

### 4. Form Assistance
- Help icons next to complex form fields
- "What should I enter here?" button
- Context-aware field explanations

---

## Technical Implementation

### Architecture Stack

#### Option A: OpenAI API (Recommended for MVP)
- **Service**: OpenAI GPT-4 or GPT-3.5-turbo
- **Cost**: Pay-per-use, ~$0.002 per 1K tokens
- **Setup Time**: 1-2 hours
- **Pros**: Easy integration, high quality, fast
- **Cons**: Requires API key, data sent to OpenAI

#### Option B: Anthropic Claude API
- **Service**: Claude 3 (Sonnet or Haiku)
- **Cost**: Similar to OpenAI
- **Pros**: Excellent for long context, safety-focused
- **Cons**: Similar to OpenAI

#### Option C: Self-Hosted (Advanced)
- **Service**: Llama 2/3, Mistral, or similar
- **Cost**: Infrastructure costs
- **Pros**: Full control, data privacy
- **Cons**: Complex setup, requires ML expertise

#### Option D: Supabase Edge Functions + AI
- **Service**: Supabase Edge Functions with AI SDK
- **Cost**: Supabase usage + AI API costs
- **Pros**: Integrated with existing stack, serverless
- **Cons**: Requires Edge Function setup

### Recommended: Supabase Edge Function + OpenAI

**Why?**
- Already using Supabase
- Server-side API key management
- Can add rate limiting and logging
- Easy to switch AI providers later

---

## Implementation Steps

### Step 1: Create Chatbot Module Structure

```
modules/ai-chatbot/
├── css/
│   └── chatbot-styles.css
├── html/
│   └── chatbot-widget.html
└── js/
    ├── chatbot.js
    ├── chatbot-service.js
    └── chatbot-context.js
```

### Step 2: Create Supabase Edge Function

**File**: `supabase/functions/chatbot/index.ts`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY')

serve(async (req) => {
  try {
    const { message, context, userId } = await req.json()

    // Get user context from Supabase if needed
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    
    // Build system prompt with compliance context
    const systemPrompt = `You are an AI assistant for iComply, a compliance management system for financial services providers in South Africa.

Your role is to help users with:
- Compliance questions (FICA, CPD, Fit & Proper, etc.)
- Navigation and how-to questions
- Understanding compliance requirements
- Troubleshooting common issues

Current context:
- Module: ${context?.module || 'General'}
- User Role: ${context?.role || 'Unknown'}

Always be helpful, accurate, and reference specific features when possible. If you don't know something, suggest contacting support.`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500
      })
    })

    const data = await response.json()
    
    // Log interaction to Supabase
    await supabase.from('chatbot_interactions').insert({
      user_id: userId,
      message: message,
      response: data.choices[0].message.content,
      context: context,
      created_at: new Date().toISOString()
    })

    return new Response(
      JSON.stringify({ 
        response: data.choices[0].message.content,
        usage: data.usage
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
```

### Step 3: Database Schema

**File**: `supabase/migrations/create_chatbot_tables.sql`

```sql
-- Chatbot interactions log
CREATE TABLE IF NOT EXISTS chatbot_interactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    context JSONB,
    module VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms INTEGER
);

-- Chatbot feedback
CREATE TABLE IF NOT EXISTS chatbot_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    interaction_id UUID REFERENCES chatbot_interactions(id),
    user_id UUID REFERENCES auth.users(id),
    helpful BOOLEAN,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE chatbot_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_feedback ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own interactions"
    ON chatbot_interactions FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interactions"
    ON chatbot_interactions FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
    ON chatbot_feedback FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own feedback"
    ON chatbot_feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);
```

### Step 4: Frontend Implementation

See implementation files in the next section.

---

## Context Awareness

### Context Detection

The chatbot should detect:
1. **Current Module**: Which page/module the user is on
2. **User Role**: Admin, Compliance Officer, Representative, etc.
3. **Recent Actions**: What the user was doing
4. **Active Alerts**: Relevant alerts or notifications
5. **Data State**: Current form data, selected items, etc.

### Context Injection Examples

```javascript
// Example: User is on CPD module
const context = {
  module: 'cpd',
  page: 'cpd-dashboard',
  userRole: 'representative',
  cpdProgress: 75,
  cycleEndDate: '2024-12-31',
  recentActivity: 'viewed-cpd-requirements'
}

// Example: User clicked on an alert
const context = {
  module: 'alerts',
  alertType: 'fica-review-overdue',
  alertId: '123',
  alertPriority: 'high',
  relatedModule: 'clients-fica'
}
```

---

## Security & Privacy

### Data Privacy
1. **No PII in AI Requests**: Strip personal information before sending to AI
2. **User Consent**: Optional feature, users can disable
3. **Data Retention**: Auto-delete interactions after 90 days (configurable)
4. **Audit Logging**: Log all interactions for compliance

### API Security
1. **Rate Limiting**: Max 20 requests per user per minute
2. **Authentication**: Require valid Supabase session
3. **Input Validation**: Sanitize all user inputs
4. **Error Handling**: Don't expose API keys or internal errors

### Compliance Considerations
1. **POPIA Compliance**: User data handling
2. **Audit Trail**: All interactions logged
3. **Access Control**: Respect RBAC permissions
4. **Data Minimization**: Only send necessary context

---

## Deployment Options

### Option 1: Supabase Edge Functions (Recommended)
- **Deploy**: `supabase functions deploy chatbot`
- **Environment Variables**: Set in Supabase dashboard
- **Scaling**: Automatic
- **Cost**: Supabase usage + AI API costs

### Option 2: AWS Lambda
- **Deploy**: Serverless framework or AWS CLI
- **Scaling**: Automatic
- **Cost**: Pay per request

### Option 3: Express.js Backend
- **Deploy**: Traditional server (Heroku, Railway, etc.)
- **Scaling**: Manual
- **Cost**: Server costs

---

## Cost Estimation

### OpenAI GPT-3.5-turbo
- **Input**: $0.0015 per 1K tokens
- **Output**: $0.002 per 1K tokens
- **Average conversation**: ~500 tokens
- **Cost per conversation**: ~$0.001
- **1,000 conversations/month**: ~$1
- **10,000 conversations/month**: ~$10

### Anthropic Claude Haiku
- **Input**: $0.25 per 1M tokens
- **Output**: $1.25 per 1M tokens
- **Similar pricing to OpenAI**

---

## Success Metrics

### Key Performance Indicators
1. **Usage Rate**: % of users who interact with chatbot
2. **Resolution Rate**: % of queries resolved without escalation
3. **User Satisfaction**: Feedback scores
4. **Response Time**: Average response time
5. **Cost per Interaction**: Total cost / number of interactions

### A/B Testing
- Test different AI models
- Test different UI placements
- Test different prompt engineering approaches

---

## Next Steps

1. **Phase 1 (Week 1-2)**: Basic chatbot widget with OpenAI integration
2. **Phase 2 (Week 3-4)**: Context awareness and module-specific help
3. **Phase 3 (Week 5-6)**: Advanced features (document analysis, workflows)
4. **Phase 4 (Ongoing)**: Optimization, feedback loops, improvements

---

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Anthropic Claude API](https://docs.anthropic.com/claude/reference/getting-started-with-the-api)
- [AI Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)

