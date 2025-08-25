import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  // Adicionar CORS headers
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
    const { priceId, userId, customerEmail, successUrl, cancelUrl } = req.body

    if (!priceId || !userId || !customerEmail) {
      return res.status(400).json({ error: 'Missing required parameters' })
    }

    // Criar ou recuperar customer
    let customer
    const existingCustomers = await stripe.customers.list({
      email: customerEmail,
      limit: 1
    })

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0]
    } else {
      customer = await stripe.customers.create({
        email: customerEmail,
        metadata: {
          user_id: userId
        }
      })
    }

    // Criar checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId
      },
      subscription_data: {
        metadata: {
          user_id: userId
        }
      }
    })

    res.status(200).json({ id: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
