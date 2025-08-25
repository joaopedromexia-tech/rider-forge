import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function fixUserStatus() {
  try {
    console.log('🔧 Fixing user status to PRO...')
    
    // Replace with your actual user ID
    const userId = 'bef8d58e-fd7a-4351-b321-d9697e2e6087' // From the logs
    
    console.log('User ID:', userId)
    
    // Update user profile to PRO
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        account_type: 'pro',
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select()

    if (profileError) {
      console.error('❌ Error updating profile:', profileError)
      return
    }

    console.log('✅ Profile updated:', profileData)

    // Create subscription record
    const { data: subscriptionData, error: subscriptionError } = await supabase
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: 'sub_manual_fix', // Placeholder
        stripe_customer_id: 'cus_Svj6I53qOWQeK0', // From the logs
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
        cancel_at_period_end: false
      })
      .select()

    if (subscriptionError) {
      console.error('❌ Error creating subscription:', subscriptionError)
      return
    }

    console.log('✅ Subscription created:', subscriptionData)
    console.log('🎉 User status fixed to PRO!')
    
  } catch (error) {
    console.error('❌ Error fixing user status:', error)
  }
}

fixUserStatus()
