import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

/**
 * Hook for progressive loading - shows content immediately while auth loads in background
 * @returns {Object} Progressive loading state
 */
export const useProgressiveLoading = () => {
  const { user, loading: authLoading, hasAccount, isPro } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)
  const [showAuthUI, setShowAuthUI] = useState(false)

  useEffect(() => {
    // Mark as initialized after a short delay to show content immediately
    const timer = setTimeout(() => {
      setIsInitialized(true)
    }, 100) // Very short delay to ensure smooth transition

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Show auth UI after auth loading is complete
    if (!authLoading) {
      setShowAuthUI(true)
    }
  }, [authLoading])

  return {
    // Content can be shown immediately
    canShowContent: isInitialized,
    
    // Auth UI should only show after auth is loaded
    canShowAuthUI: showAuthUI,
    
    // Auth state (may be undefined initially)
    user: showAuthUI ? user : null,
    hasAccount: showAuthUI ? hasAccount : false,
    isPro: showAuthUI ? isPro : false,
    
    // Loading states
    isAuthLoading: authLoading,
    isInitializing: !isInitialized,
    
    // Convenience methods
    isAuthenticated: showAuthUI && !!user,
    needsAccount: showAuthUI && user && !hasAccount,
    isProUser: showAuthUI && isPro
  }
}
