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
      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  // Carregar subscrição do utilizador
  const loadUserSubscription = async (userId) => {
    try {
      const { data, error } = await database.subscriptions.getUserSubscription(userId)
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows returned
      setSubscription(data)
    } catch (error) {
      console.error('Error loading user subscription:', error)
    }
  }

  // Verificar se o utilizador é Pro
  const isPro = () => {
    return subscription && subscription.status === 'active'
  }

  // Sign in com provider
  const signInWithProvider = async (provider) => {
    try {
      const { error } = await auth.signInWithProvider(provider)
      if (error) throw error
    } catch (error) {
      console.error('Error signing in:', error)
      throw error
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

  useEffect(() => {
    // Listen to auth changes
    const { data: { subscription: authSubscription } } = auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          await loadUserProfile(session.user.id)
          await loadUserSubscription(session.user.id)
        } else {
          setUser(null)
          setProfile(null)
          setSubscription(null)
        }
        setLoading(false)
      }
    )

    // Check current user on mount
    const checkCurrentUser = async () => {
      try {
        const { user: currentUser } = await auth.getCurrentUser()
        if (currentUser) {
          setUser(currentUser)
          await loadUserProfile(currentUser.id)
          await loadUserSubscription(currentUser.id)
        }
      } catch (error) {
        console.error('Error checking current user:', error)
      } finally {
        setLoading(false)
      }
    }

    checkCurrentUser()

    return () => {
      authSubscription?.unsubscribe()
    }
  }, [])

  const value = {
    user,
    profile,
    subscription,
    loading,
    isPro: isPro(),
    signInWithProvider,
    signOut,
    updateProfile,
    updateSubscription
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
