
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

interface PaymentRequest {
  payment_method: string
  payment_id?: string
  amount?: number
  currency?: string
}

serve(async (req) => {
  try {
    // Create a Supabase client with the Auth context of the logged in user
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the session of the user who called the function
    const {
      data: { session },
    } = await supabaseClient.auth.getSession()

    if (!session) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Parse the request body
    const { payment_method, payment_id, amount = 60, currency = 'THB' } = await req.json() as PaymentRequest

    if (!payment_method) {
      return new Response(
        JSON.stringify({ error: 'Payment method is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // In a real application, you would integrate with a payment gateway here
    // For this example, we'll simulate a successful payment

    // Process the payment using our database function
    const { data, error } = await supabaseClient.rpc(
      'process_payment',
      {
        p_user_id: session.user.id,
        p_payment_method: payment_method,
        p_payment_id: payment_id,
        p_amount: amount,
        p_currency: currency
      }
    )

    if (error) {
      console.error('Error processing payment:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to process payment' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment processed successfully',
        subscription: data
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