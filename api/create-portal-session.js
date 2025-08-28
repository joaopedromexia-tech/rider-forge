import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // Add CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return res.status(500).json({ error: 'Missing STRIPE_SECRET_KEY environment variable' })
    }

    const { customerId, returnUrl } = req.body

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer ID' })
    }

    // Criar portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: (() => {
        if (returnUrl && typeof returnUrl === 'string') return returnUrl
        const proto = req.headers['x-forwarded-proto'] || 'https'
        const host = req.headers.host || process.env.VERCEL_URL || ''
        const origin = host.startsWith('http') ? host : `${proto}://${host}`
        return `${origin}`
      })(),
    })

    res.status(200).json({ id: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    
    // Provide more specific error messages
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ 
        error: 'Invalid customer ID or Stripe configuration issue',
        details: error.message 
      })
    }
    
    if (error.type === 'StripeAuthenticationError') {
      return res.status(500).json({ 
        error: 'Stripe authentication failed. Please check your API keys.',
        details: error.message 
      })
    }
    
    res.status(500).json({ 
      error: 'Failed to create portal session',
      details: error && (error.message || String(error))
    })
  }
}
