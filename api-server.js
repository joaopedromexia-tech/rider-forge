import express from 'express'
import Stripe from 'stripe'
import cors from 'cors'
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

// Load environment variables
dotenv.config()

const app = express()
const port = 3001

// Middleware
app.use(cors())

// Special middleware for webhook to preserve raw body
app.use('/api/webhook-stripe', express.raw({ type: 'application/json' }))
app.use(express.json())

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

// Initialize Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

// Debug: Check if environment variables are loaded
console.log('Environment check:', {
  hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
  stripeKeyPrefix: process.env.STRIPE_SECRET_KEY ? process.env.STRIPE_SECRET_KEY.substring(0, 7) + '...' : 'NOT_SET'
})

// API Routes
app.post('/api/create-checkout-session', async (req, res) => {
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

// Webhook endpoint
app.post('/api/webhook-stripe', async (req, res) => {
  const sig = req.headers['stripe-signature']
  let event

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).json({ error: 'Webhook signature verification failed' })
  }

  try {
    console.log('Webhook received:', event.type)
    
    switch (event.type) {
      case 'customer.subscription.created':
        await handleSubscriptionCreated(event.data.object)
        break
      
      case 'customer.subscription.updated':
        await handleSubscriptionUpdated(event.data.object)
        break
      
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object)
        break
      
      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    res.status(200).json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Webhook handlers
async function handleSubscriptionCreated(subscription) {
  const userId = subscription.metadata.user_id
  
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  try {
    console.log('Creating subscription for user:', userId)
    
    // Criar ou atualizar subscrição na base de dados
    const { error } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: subscription.id,
        stripe_customer_id: subscription.customer,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      })

    if (error) throw error

    // Atualizar o perfil do usuário para Pro
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        account_type: 'pro',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (profileError) {
      console.error('Error updating user profile to pro:', profileError)
    }

    console.log(`✅ Subscription created and user upgraded to Pro: ${userId}`)
  } catch (error) {
    console.error('Error creating subscription:', error)
  }
}

async function handleSubscriptionUpdated(subscription) {
  const userId = subscription.metadata.user_id
  
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  try {
    // Atualizar subscrição na base de dados
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) throw error
    console.log(`Subscription updated for user ${userId}`)
  } catch (error) {
    console.error('Error updating subscription:', error)
  }
}

async function handleSubscriptionDeleted(subscription) {
  try {
    // Marcar subscrição como cancelada na base de dados
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)

    if (error) throw error

    // Obter o user_id da subscrição
    const { data: subData, error: subError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (subError) {
      console.error('Error getting subscription user_id:', subError)
      return
    }

    // Atualizar o perfil do usuário para Free
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        account_type: 'free',
        updated_at: new Date().toISOString()
      })
      .eq('id', subData.user_id)

    if (profileError) {
      console.error('Error updating user profile to free:', profileError)
    }

    console.log(`Subscription deleted and user downgraded to Free: ${subData.user_id}`)
  } catch (error) {
    console.error('Error deleting subscription:', error)
  }
}

async function handlePaymentSucceeded(invoice) {
  try {
    console.log('Payment succeeded for subscription:', invoice.subscription)
    
    // Atualizar status de pagamento se necessário
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active'
      })
      .eq('stripe_subscription_id', invoice.subscription)

    if (error) throw error

    // Obter o user_id da subscrição
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('user_id')
      .eq('stripe_subscription_id', invoice.subscription)
      .single()

    if (subError) {
      console.error('Error getting subscription user_id:', subError)
      return
    }

    // Atualizar o perfil do usuário para Pro
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        account_type: 'pro',
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.user_id)

    if (profileError) {
      console.error('Error updating user profile to pro:', profileError)
    }

    console.log(`✅ Payment succeeded and user upgraded to Pro: ${subscription.user_id}`)
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(invoice) {
  try {
    // Marcar subscrição como past_due
    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'past_due'
      })
      .eq('stripe_subscription_id', invoice.subscription)

    if (error) throw error
    console.log(`Payment failed for subscription: ${invoice.subscription}`)
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

app.listen(port, () => {
  console.log(`📡 API Server running at http://localhost:${port}`)
  console.log(`🔗 Proxied from Vite at http://localhost:5173/api`)
})
