import { corsHeaders } from '../_shared/cors.ts'

interface GitHubWebhookPayload {
  action?: string
  ref?: string
  repository: {
    name: string
    full_name: string
  }
  pusher?: {
    name: string
  }
  sender: {
    login: string
  }
  pull_request?: {
    head: {
      ref: string
    }
    base: {
      ref: string
    }
    merged?: boolean
  }
  commits?: Array<{
    author: {
      name: string
    }
  }>
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const payload: GitHubWebhookPayload = await req.json()
    const eventType = req.headers.get('X-GitHub-Event')
    
    console.log('Received webhook:', { eventType, action: payload.action })

    let eventData = null

    // Handle different GitHub events
    switch (eventType) {
      case 'push':
        eventData = {
          action_type: 'push',
          author: payload.pusher?.name || payload.sender.login,
          to_branch: payload.ref?.replace('refs/heads/', '') || 'unknown',
          timestamp: new Date().toISOString(),
          repository: payload.repository.name
        }
        break

      case 'pull_request':
        if (payload.action === 'opened' || payload.action === 'synchronize') {
          eventData = {
            action_type: 'pull_request',
            author: payload.sender.login,
            from_branch: payload.pull_request?.head.ref || 'unknown',
            to_branch: payload.pull_request?.base.ref || 'unknown',
            timestamp: new Date().toISOString(),
            repository: payload.repository.name
          }
        } else if (payload.action === 'closed' && payload.pull_request?.merged) {
          eventData = {
            action_type: 'merge',
            author: payload.sender.login,
            from_branch: payload.pull_request?.head.ref || 'unknown',
            to_branch: payload.pull_request?.base.ref || 'unknown',
            timestamp: new Date().toISOString(),
            repository: payload.repository.name
          }
        }
        break

      default:
        console.log('Unhandled event type:', eventType)
        return new Response(
          JSON.stringify({ message: 'Event type not supported' }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
    }

    // Store the event if we have valid data
    if (eventData) {
      const { createClient } = await import('npm:@supabase/supabase-js@2')
      
      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )

      const { error } = await supabase
        .from('github_events')
        .insert([eventData])

      if (error) {
        console.error('Database error:', error)
        return new Response(
          JSON.stringify({ error: 'Failed to store event' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }

      console.log('Event stored successfully:', eventData)
    }

    return new Response(
      JSON.stringify({ message: 'Webhook received successfully' }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})