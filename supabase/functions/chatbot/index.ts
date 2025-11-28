// AI Chatbot Edge Function
// Handles chatbot requests and integrates with OpenAI/Anthropic

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

// Rate limiting (simple in-memory store - use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()
const RATE_LIMIT = 20 // requests per minute
const RATE_LIMIT_WINDOW = 60000 // 1 minute in milliseconds

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    })
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client
    const supabaseUrl = SUPABASE_URL || 'https://mdpblurdxwdbsxnmuhyb.supabase.co'
    const supabase = createClient(
      supabaseUrl,
      SUPABASE_SERVICE_ROLE_KEY || authHeader.replace('Bearer ', '')
    )

    // Verify user session
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Rate limiting
    const userKey = user.id
    const now = Date.now()
    const userLimit = rateLimitMap.get(userKey)

    if (userLimit) {
      if (now < userLimit.resetTime) {
        if (userLimit.count >= RATE_LIMIT) {
          return new Response(
            JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
            { status: 429, headers: { 'Content-Type': 'application/json' } }
          )
        }
        userLimit.count++
      } else {
        rateLimitMap.set(userKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
      }
    } else {
      rateLimitMap.set(userKey, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    }

    // Parse request body
    const { message, context, userId } = await req.json()

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'Message is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Validate message length
    if (message.length > 2000) {
      return new Response(
        JSON.stringify({ error: 'Message too long (max 2000 characters)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Build system prompt with compliance context
    const systemPrompt = buildSystemPrompt(context, user)

    // Call OpenAI API
    const startTime = Date.now()
    let aiResponse
    let usage

    try {
      if (!OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured')
      }

      const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message.trim() }
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          frequency_penalty: 0,
          presence_penalty: 0
        })
      })

      if (!openaiResponse.ok) {
        const errorData = await openaiResponse.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `OpenAI API error: ${openaiResponse.status}`)
      }

      const openaiData = await openaiResponse.json()
      aiResponse = openaiData.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
      usage = openaiData.usage

    } catch (aiError) {
      console.error('AI API error:', aiError)
      
      // Fallback response if AI fails
      aiResponse = `I apologize, but I'm having trouble processing your request right now. Please try again in a moment, or contact support if the issue persists.

Error: ${aiError.message}`
    }

    const responseTime = Date.now() - startTime

    // Log interaction to Supabase
    try {
      const { error: logError } = await supabase
        .from('chatbot_interactions')
        .insert({
          user_id: user.id,
          message: message.trim(),
          response: aiResponse,
          context: context || {},
          module: context?.module || null,
          response_time_ms: responseTime,
          usage: usage || null,
          created_at: new Date().toISOString()
        })

      if (logError) {
        console.error('Failed to log interaction:', logError)
      }
    } catch (logError) {
      console.error('Logging error:', logError)
      // Don't fail the request if logging fails
    }

    // Return response
    return new Response(
      JSON.stringify({
        response: aiResponse,
        usage: usage,
        responseTime: responseTime
      }),
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )

  } catch (error) {
    console.error('Chatbot function error:', error)
    return new Response(
      JSON.stringify({ error: error.message || 'Internal server error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  }
})

/**
 * Build system prompt with compliance context
 */
function buildSystemPrompt(context: any, user: any): string {
  const module = context?.module || 'General'
  const userRole = context?.userRole || 'User'
  
  const moduleContexts: Record<string, string> = {
    'cpd': `You're helping with CPD (Continuing Professional Development) management. Users need to log CPD hours, track progress, and understand requirements.`,
    'fica': `You're helping with FICA (Financial Intelligence Centre Act) compliance. This involves client verification, risk assessment, and document management.`,
    'clients-fica': `You're helping with client FICA verification and compliance. Users need to verify client identities, assess risk, and manage documentation.`,
    'representatives': `You're helping with representative management. This includes Fit & Proper requirements, supervision structures, and compliance tracking.`,
    'complaints': `You're helping with complaints management. Users need to log, track, and resolve client complaints according to regulatory requirements.`,
    'alerts': `You're helping with alerts and notifications. Users need to understand and resolve compliance alerts.`,
    'executive-dashboard': `You're helping with executive dashboard and reporting. Users need to understand compliance metrics and health scores.`,
  }

  const moduleContext = moduleContexts[module] || 'You're helping with general compliance management tasks.'

  return `You are an AI assistant for iComply, a compliance management system for financial services providers in South Africa.

Your role is to help users with:
- Compliance questions (FICA, CPD, Fit & Proper, etc.)
- Navigation and how-to questions
- Understanding compliance requirements and regulations
- Troubleshooting common issues
- Step-by-step guidance for complex tasks

Current context:
- Module: ${module}
- User Role: ${userRole}
${moduleContext}

Guidelines:
1. Be helpful, accurate, and professional
2. Reference specific features and modules when relevant
3. Provide step-by-step instructions when appropriate
4. If you don't know something, suggest contacting support
5. Keep responses concise but complete
6. Use South African terminology and regulations (FSCA, POPIA, etc.)
7. Don't make up specific dates, deadlines, or requirements - refer users to official sources when uncertain

Always prioritize accuracy and user safety in compliance matters.`
}

