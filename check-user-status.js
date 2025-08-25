import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
)

async function checkUserStatus() {
  try {
    console.log('🔍 Checking user status...')
    
    const userId = 'bef8d58e-fd7a-4351-b321-d9697e2e6087'
    
    // Check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profileError) {
      console.error('❌ Error getting profile:', profileError)
    } else {
      console.log('📋 Profile:', profile)
    }

    // Check subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (subscriptionError) {
      console.error('❌ Error getting subscription:', subscriptionError)
    } else {
      console.log('💳 Subscription:', subscription)
    }

    // Check if user is PRO
    const isPro = (subscription && subscription.status === 'active') || 
                  (profile && profile.account_type === 'pro')
    
    console.log('🎯 Is PRO:', isPro)
    
  } catch (error) {
    console.error('❌ Error checking user status:', error)
  }
}

checkUserStatus()
