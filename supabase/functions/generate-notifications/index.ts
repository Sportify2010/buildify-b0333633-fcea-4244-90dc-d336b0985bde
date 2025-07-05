
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

serve(async (req) => {
  try {
    // This function should be triggered by a cron job
    // It will generate notifications for upcoming events
    
    // Create a Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )
    
    // Call the database function to generate notifications
    const { error } = await supabaseClient.rpc('generate_event_notifications')
    
    if (error) {
      console.error('Error generating notifications:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to generate notifications' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notifications generated successfully' 
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})