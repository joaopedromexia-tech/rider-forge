import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function setupDatabase() {
  try {
    console.log('🔧 Setting up database...')
    
    // Check if profiles table exists and has account_type column
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)

    if (profilesError) {
      console.error('❌ Error checking profiles table:', profilesError)
      return
    }

    console.log('✅ Profiles table exists')
    
    // Try to update a profile to see if account_type column exists
    const { data: testUpdate, error: testError } = await supabase
      .from('profiles')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', 'bef8d58e-fd7a-4351-b321-d9697e2e6087')
      .select()

    if (testError) {
      console.error('❌ Error testing profile update:', testError)
      
      // If account_type column doesn't exist, we need to add it
      if (testError.message.includes('account_type')) {
        console.log('📝 Need to add account_type column to profiles table')
        console.log('Please run this SQL in your Supabase dashboard:')
        console.log(`
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'free';
        `)
        return
      }
    }

    // Check if subscriptions table exists
    const { data: subscriptions, error: subscriptionsError } = await supabase
      .from('subscriptions')
      .select('*')
      .limit(1)

    if (subscriptionsError) {
      console.error('❌ Error checking subscriptions table:', subscriptionsError)
      console.log('📝 Need to create subscriptions table')
      console.log('Please run this SQL in your Supabase dashboard:')
      console.log(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
          stripe_subscription_id TEXT UNIQUE,
          stripe_customer_id TEXT,
          status TEXT DEFAULT 'active',
          current_period_start TIMESTAMP WITH TIME ZONE,
          current_period_end TIMESTAMP WITH TIME ZONE,
          cancel_at_period_end BOOLEAN DEFAULT FALSE,
          canceled_at TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)
      return
    }

    console.log('✅ Subscriptions table exists')
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
  }
}

setupDatabase()
