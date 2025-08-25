import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkTableStructure() {
  try {
    console.log('🔍 Checking table structure...')
    
    // Get a sample profile to see the structure
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1)
      .single()

    if (profileError) {
      console.error('❌ Error getting profile:', profileError)
      return
    }

    console.log('📋 Profile structure:')
    console.log(Object.keys(profile))
    console.log('📋 Sample profile data:')
    console.log(profile)

    // Try to add account_type column if it doesn't exist
    console.log('\n🔧 Adding account_type column...')
    
    // First, let's try to update with account_type to see the exact error
    const { data: updateTest, error: updateError } = await supabase
      .from('profiles')
      .update({ 
        account_type: 'free',
        updated_at: new Date().toISOString() 
      })
      .eq('id', profile.id)
      .select()

    if (updateError) {
      console.error('❌ Update error:', updateError)
      
      // If account_type column doesn't exist, we need to add it via SQL
      if (updateError.message.includes('account_type')) {
        console.log('\n📝 You need to run this SQL in your Supabase dashboard:')
        console.log(`
          ALTER TABLE profiles 
          ADD COLUMN IF NOT EXISTS account_type TEXT DEFAULT 'free';
        `)
        console.log('\n🔗 Go to: https://supabase.com/dashboard/project/hhuubsjhxzmfhfioxjuz/sql')
        console.log('📝 Run the SQL command above')
      }
    } else {
      console.log('✅ account_type column exists and update successful!')
      console.log('Updated profile:', updateTest)
    }
    
  } catch (error) {
    console.error('❌ Error checking table structure:', error)
  }
}

checkTableStructure()
