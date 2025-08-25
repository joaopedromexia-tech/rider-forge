import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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
}

async function handleSubscriptionCreated(subscription) {
  const userId = subscription.metadata.user_id
  
  if (!userId) {
    console.error('No user_id in subscription metadata')
    return
  }

  try {
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

    console.log(`Subscription created and user upgraded to Pro: ${userId}`)
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

    console.log(`Payment succeeded and user upgraded to Pro: ${subscription.user_id}`)
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
