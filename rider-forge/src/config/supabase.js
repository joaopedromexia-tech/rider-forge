import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configurações de autenticação
export const AUTH_CONFIG = {
  providers: ['google', 'github'],
  redirectTo: `${window.location.origin}/dashboard`,
  cookieOptions: {
    name: 'rider-forge-auth',
    lifetime: 60 * 60 * 8, // 8 hours
    domain: window.location.hostname,
    sameSite: 'lax',
    path: '/'
  }
}

// Funções de autenticação
export const auth = {
  // Sign in com OAuth
  signInWithProvider: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: AUTH_CONFIG.redirectTo
      }
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Listen to auth changes
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Funções de database
export const database = {
  // Riders
  riders: {
    // Get user riders
    getUserRiders: async (userId) => {
      const { data, error } = await supabase
        .from('riders')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    // Create rider
    createRider: async (riderData, userId) => {
      const { data, error } = await supabase
        .from('riders')
        .insert([{ ...riderData, user_id: userId }])
        .select()
      return { data, error }
    },

    // Update rider
    updateRider: async (riderId, updates, userId) => {
      const { data, error } = await supabase
        .from('riders')
        .update(updates)
        .eq('id', riderId)
        .eq('user_id', userId)
        .select()
      return { data, error }
    },

    // Delete rider
    deleteRider: async (riderId, userId) => {
      const { error } = await supabase
        .from('riders')
        .delete()
        .eq('id', riderId)
        .eq('user_id', userId)
      return { error }
    }
  },

  // User profiles
  profiles: {
    // Get user profile
    getUserProfile: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    // Update user profile
    updateUserProfile: async (userId, updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
      return { data, error }
    }
  },

  // Subscriptions
  subscriptions: {
    // Get user subscription
    getUserSubscription: async (userId) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single()
      return { data, error }
    },

    // Create subscription
    createSubscription: async (subscriptionData) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert([subscriptionData])
        .select()
      return { data, error }
    }
  }
}

// Storage functions
export const storage = {
  // Upload PDF
  uploadPDF: async (file, userId, riderId) => {
    const fileName = `${userId}/${riderId}/${Date.now()}_rider.pdf`
    const { data, error } = await supabase.storage
      .from('riders')
      .upload(fileName, file, {
        contentType: 'application/pdf',
        cacheControl: '3600'
      })
    return { data, error }
  },

  // Get PDF URL
  getPDFUrl: async (filePath) => {
    const { data } = supabase.storage
      .from('riders')
      .getPublicUrl(filePath)
    return data.publicUrl
  }
}
