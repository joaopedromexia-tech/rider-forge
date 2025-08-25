import React, { createContext, useContext, useEffect, useState } from 'react'

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
  const [loading, setLoading] = useState(false) // Começa como false para não bloquear

  // Verificar se o utilizador é Pro (mock para teste)
  const isPro = () => {
    return false // Começa como Free
  }

  // Sign in com provider (mock para teste)
  const signInWithProvider = async (provider) => {
    console.log('Sign in with provider:', provider)
    // Mock user para teste
    const mockUser = {
      id: 'test-user-id',
      email: 'test@example.com',
      user_metadata: {
        full_name: 'Utilizador de Teste'
      }
    }
    setUser(mockUser)
    setProfile({
      id: mockUser.id,
      full_name: mockUser.user_metadata.full_name,
      email: mockUser.email
    })
  }

  // Sign out (mock para teste)
  const signOut = async () => {
    setUser(null)
    setProfile(null)
    setSubscription(null)
  }

  // Atualizar perfil (mock para teste)
  const updateProfile = async (updates) => {
    if (profile) {
      const updatedProfile = { ...profile, ...updates }
      setProfile(updatedProfile)
      return { data: updatedProfile, error: null }
    }
    return { data: null, error: new Error('No user logged in') }
  }

  // Atualizar subscrição (mock para teste)
  const updateSubscription = (newSubscription) => {
    setSubscription(newSubscription)
  }

  const value = {
    user,
    profile,
    subscription,
    loading,
    hasAccount: !!profile, // Se tem perfil, tem conta
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
