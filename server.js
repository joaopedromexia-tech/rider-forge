import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import Stripe from 'stripe'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(express.static(join(__dirname, 'dist')))

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// API Routes
app.post('/api/create-checkout-session', async (req, res) => {
  // Adicionar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { priceId, userId, customerEmail, successUrl, cancelUrl } = req.body

    console.log('Received request:', { priceId, userId, customerEmail, successUrl, cancelUrl, timestamp: new Date().toISOString() })

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

    console.log('Customer:', customer.id)

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

    console.log('Session created:', session.id)
    res.status(200).json({ id: session.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

app.post('/api/create-portal-session', async (req, res) => {
  // Adicionar CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
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
})

// Serve the Vite app for all other routes
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`)
  console.log(`📡 API available at http://localhost:${port}/api`)
})
