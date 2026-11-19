import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    }})
  }

  try {
    const { email, name, status, course } = await req.json()
    
    // REPLACE THIS WITH YOUR RESEND API KEY
    const RESEND_API_KEY = 're_S79r4EUL_LQ1tBoMTwTrxHbvsjbMfSE9v'; 

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'IVY STONE <onboarding@resend.dev>', // Change this if you verified your own domain
        to: [email],
        subject: `Application Status Update: ${status.toUpperCase()}`,
        html: `
          <h2>Hello ${name},</h2>
          <p>Your application status for <strong>${course}</strong> has been updated.</p>
          <p>New Status: <strong>${status.toUpperCase()}</strong></p>
          <p>Please log in to your student portal to view more details or upload requested documents.</p>
          <br>
          <p>Best regards,</p>
          <p><strong>IVY STONE Training Centre</strong></p>
        `
      })
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})