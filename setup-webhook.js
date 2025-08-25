import Stripe from 'stripe'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

async function setupWebhook() {
  try {
    console.log('🔧 Setting up Stripe webhook...')
    
    // Create webhook endpoint
    const webhook = await stripe.webhookEndpoints.create({
      url: 'https://your-domain.com/api/webhook-stripe', // Replace with your actual domain
      enabled_events: [
        'customer.subscription.created',
        'customer.subscription.updated',
        'customer.subscription.deleted',
        'invoice.payment_succeeded',
        'invoice.payment_failed'
      ],
    })

    console.log('✅ Webhook created successfully!')
    console.log('Webhook ID:', webhook.id)
    console.log('Webhook Secret:', webhook.secret)
    console.log('Webhook URL:', webhook.url)
    
    console.log('\n📝 Add this to your .env file:')
    console.log(`STRIPE_WEBHOOK_SECRET=${webhook.secret}`)
    
  } catch (error) {
    console.error('❌ Error setting up webhook:', error.message)
  }
}

setupWebhook()
