import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, database } from '../config/supabase'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  // Carregar perfil do utilizador
  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await database.profiles.getUserProfile(userId)
      if (error && error.message !== 'Supabase não configurado') throw error
      setProfile(data)
    } catch (error) {
      console.error('Error loading user profile:', error)
      setProfile(null)
    }
  }

  // Carregar subscrição do utilizador
  const loadUserSubscription = async (userId) => {
    try {
      const { data, error } = await database.subscriptions.getUserSubscription(userId)
      if (error && error.code !== 'PGRST116' && error.message !== 'Supabase não configurado') throw error
      setSubscription(data)
    } catch (error) {
      console.error('Error loading user subscription:', error)
      setSubscription(null)
    }
  }

  // Verificar se o utilizador é Pro
  const isPro = () => {
    return (subscription && subscription.status === 'active') || 
           (profile && profile.account_type === 'pro')
  }

  // Verificar se o utilizador tem conta criada
  const userHasAccount = () => {
    return !!profile
  }

  // Sign up com email/password
  const signUp = async (email, password, userData = {}) => {
    try {
      const { data, error } = await auth.signUp(email, password, userData)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error signing up:', error)
      return { data: null, error }
    }
  }

  // Sign in com email/password
  const signIn = async (email, password) => {
    try {
      const { data, error } = await auth.signIn(email, password)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error signing in:', error)
      return { data: null, error }
    }
  }

  // Sign in com provider (mantido para compatibilidade)
  const signInWithProvider = async (provider) => {
    try {
      const { data, error } = await auth.signInWithProvider(provider)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error signing in with provider:', error)
      return { data: null, error }
    }
  }

  // Reset password
  const resetPassword = async (email) => {
    try {
      const { data, error } = await auth.resetPassword(email)
      if (error) throw error
      return { data, error: null }
    } catch (error) {
      console.error('Error resetting password:', error)
      return { data: null, error }
    }
  }

  // Sign out
  const signOut = async () => {
    try {
      const { error } = await auth.signOut()
      if (error) throw error
      setUser(null)
      setProfile(null)
      setSubscription(null)
    } catch (error) {
      console.error('Error signing out:', error)
      throw error
    }
  }

  // Atualizar perfil
  const updateProfile = async (updates) => {
    try {
      const { data, error } = await database.profiles.updateUserProfile(user.id, updates)
      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating profile:', error)
      return { data: null, error }
    }
  }

  // Atualizar subscrição
  const updateSubscription = (newSubscription) => {
    setSubscription(newSubscription)
  }

  // Atualizar tipo de conta
  const updateAccountType = async (accountType) => {
    try {
      const { data, error } = await database.profiles.updateUserProfile(user.id, {
        account_type: accountType
      })
      if (error) throw error
      setProfile(data)
      return { data, error: null }
    } catch (error) {
      console.error('Error updating account type:', error)
      return { data: null, error }
    }
  }

  useEffect(() => {
    console.log('🔍 AuthContext: Iniciando setup...')
    
    // Listen to auth changes
    console.log('🔍 AuthContext: Configurando auth state change listener...')
    const { data: { subscription: authSubscription } } = auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔍 AuthContext: Auth state change event:', event, session ? 'session exists' : 'no session')
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
          await loadUserSubscription(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setSubscription(null)
        }
        console.log('🔍 AuthContext: Setting loading to false')
        setLoading(false)
      }
    )

    // Check current user on mount
    const checkCurrentUser = async () => {
      console.log('🔍 AuthContext: Checking current user...')
      try {
        const { user: currentUser } = await auth.getCurrentUser()
        console.log('🔍 AuthContext: Current user result:', currentUser ? 'user found' : 'no user')
        if (currentUser) {
          setUser(currentUser)
          await loadUserProfile(currentUser.id)
          await loadUserSubscription(currentUser.id)
        }
      } catch (error) {
        console.error('🔍 AuthContext: Error checking current user:', error)
        // Em caso de erro, definir como não autenticado mas continuar
        setUser(null)
        setProfile(null)
        setSubscription(null)
      } finally {
        console.log('🔍 AuthContext: Setting loading to false (finally)')
        setLoading(false)
      }
    }

    checkCurrentUser()

    // Timeout de segurança para garantir que o loading não fica preso
    const safetyTimeout = setTimeout(() => {
      console.log('🔍 AuthContext: Safety timeout triggered - forcing loading to false')
      setLoading(false)
    }, 3000) // 3 segundos

    return () => {
      console.log('🔍 AuthContext: Cleaning up...')
      clearTimeout(safetyTimeout)
      authSubscription?.unsubscribe()
    }
  }, [])

  const value = {
    user,
    profile,
    subscription,
    loading,
    hasAccount: userHasAccount(),
    isPro: isPro(),
    signUp,
    signIn,
    signInWithProvider,
    resetPassword,
    signOut,
    updateProfile,
    updateSubscription,
    updateAccountType
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
