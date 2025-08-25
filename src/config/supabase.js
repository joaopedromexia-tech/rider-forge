import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Se não tiver configuração do Supabase, criar um cliente mock
let supabase = null
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey)
} else {
  console.warn('⚠️ Supabase não configurado. Usando modo local.')
  // Cliente mock para desenvolvimento local
  supabase = {
    auth: {
      signInWithOAuth: () => Promise.resolve({ data: null, error: { message: 'Supabase não configurado' } }),
      signOut: () => Promise.resolve({ error: null }),
      getUser: () => Promise.resolve({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => ({ eq: () => ({ order: () => Promise.resolve({ data: [], error: null }) }) }),
      insert: () => ({ select: () => Promise.resolve({ data: [], error: null }) }),
      update: () => ({ eq: () => ({ select: () => Promise.resolve({ data: [], error: null }) }) }),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) })
    }),
    storage: {
      from: () => ({
        upload: () => Promise.resolve({ data: null, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: '' } })
      })
    }
  }
}

export { supabase }

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
  // Sign up com email/password
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })
    return { data, error }
  },

  // Sign in com email/password
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign in com OAuth (mantido para futuro)
  signInWithProvider: async (provider) => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: AUTH_CONFIG.redirectTo
      }
    })
    return { data, error }
  },

  // Reset password
  resetPassword: async (email) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
    return { data, error }
  },

  // Update password
  updatePassword: async (password) => {
    const { data, error } = await supabase.auth.updateUser({
      password
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
