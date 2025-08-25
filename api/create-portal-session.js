import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { customerId, returnUrl } = req.body

    if (!customerId) {
      return res.status(400).json({ error: 'Missing customer ID' })
    }

    // Criar portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl || process.env.VERCEL_URL + '/dashboard',
    })

    res.status(200).json({ id: session.url })
  } catch (error) {
    console.error('Error creating portal session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
