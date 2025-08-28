import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'
import { useFeedback } from '../hooks/useFeedback'
import ProStatusBadge from './ProStatusBadge'
import { redirectToSubscriptionPortal } from '../utils/subscription'

/**
 * UserMenu - Menu do usuário
 * 
 * IMPORTANTE: Este componente deve aparecer para TODOS os usuários autenticados,
 * independentemente de serem free ou pro. Apenas usuários não autenticados
 * verão o badge "FREE" simples.
 */
function UserMenu({ className = '' }) {
  const { user, isPro, signOut, subscription, hasAccount, loading } = useAuth()
  const { t } = useI18n()
  const { showSuccess, showError } = useFeedback()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoadingPortal, setIsLoadingPortal] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User'
  const userEmail = user?.email || ''

  // Debug: Log para verificar o estado do usuário
  useEffect(() => {
    console.log('UserMenu Debug:', {
      user: !!user,
      hasAccount,
      isPro,
      loading,
      userEmail: user?.email
    })
  }, [user, hasAccount, isPro, loading])

  // Fechar menu quando clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fechar menu com Escape
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut()
      setIsOpen(false)
      showSuccess(t('userMenu.logoutSuccess') || 'Logout realizado com sucesso!')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const handleSubscriptionManagement = async () => {
    try {
      setIsLoadingPortal(true)
      
      // Check if user has a subscription
      if (!subscription) {
        showError(t('userMenu.noSubscription'))
        return
      }
      
      if (!subscription.stripe_customer_id) {
        showError(t('userMenu.customerIdNotFound'))
        return
      }

      // Redirect to Stripe customer portal where user can manage subscription
      // including canceling, updating payment methods, viewing invoices, etc.
      await redirectToSubscriptionPortal(
        subscription.stripe_customer_id,
        window.location.href
      )
    } catch (error) {
      console.error('Erro ao abrir portal de subscrição:', error)
      showError(t('userMenu.portalError') + ': ' + error.message)
    } finally {
      setIsLoadingPortal(false)
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // Mostrar loading enquanto carrega dados do usuário
  if (loading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 border border-dark-600/50 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-blue"></div>
        <span className="text-sm text-gray-400">Carregando...</span>
      </div>
    )
  }

  // Se não há usuário autenticado, mostrar badge FREE
  if (!user) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium shadow-sm bg-gray-100 text-gray-700 border border-gray-300 ${className}`}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <span>FREE</span>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Botão do Menu */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-dark-700/50 hover:bg-dark-600/70 border border-dark-600/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:ring-opacity-50"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-accent-blue to-accent-green flex items-center justify-center text-white font-semibold text-sm">
          {displayName.charAt(0).toUpperCase()}
        </div>
        
        {/* Nome do usuário */}
        <div className="hidden lg:block text-left">
          <div className="text-sm font-medium text-gray-200">{displayName}</div>
          <div className="text-xs text-gray-400">{userEmail}</div>
        </div>
        
        {/* Badge Pro */}
        <ProStatusBadge />
        
        {/* Ícone de dropdown */}
        <svg 
          className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-64 lg:w-64 sm:w-56 bg-dark-800/95 backdrop-blur-md border border-dark-600/50 rounded-xl shadow-2xl z-50 animate-fade-in"
        >
          {/* Header do Menu */}
          <div className="px-4 py-3 border-b border-dark-600/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-accent-blue to-accent-green flex items-center justify-center text-white font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-200 truncate">{displayName}</div>
                <div className="text-xs text-gray-400 truncate" title={userEmail}>{userEmail}</div>
              </div>
            </div>
          </div>

          {/* Opções do Menu */}
          <div className="py-2">
            {/* Status da Conta */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('userMenu.accountStatus')}</span>
                <ProStatusBadge />
              </div>
              <div className="mt-1 text-xs text-gray-500">
                {isPro ? t('userMenu.accessComplete') : t('userMenu.accessLimited')}
              </div>
              
              {/* Informações da Subscrição - apenas para usuários Pro */}
              {isPro && subscription && (
                <div className="mt-2 pt-2 border-t border-dark-600/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{t('userMenu.subscription')}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      subscription.status === 'active' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {subscription.status === 'active' ? t('userMenu.subscriptionActive') : subscription.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Separador */}
            <div className="border-t border-dark-600/30 my-2"></div>

            {/* Upgrade para Pro - apenas para usuários não-Pro */}
            {!isPro && (
              <button
                onClick={() => {
                  setIsOpen(false)
                  window.location.href = '/pro-subscription'
                }}
                className="w-full px-4 py-2 text-left text-sm text-accent-green hover:bg-accent-green/10 transition-colors duration-200 flex items-center gap-3"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('userMenu.upgradeToPro')}
              </button>
            )}

            {/* Gestão de Subscrição - permite cancelar, alterar plano, etc. */}
            {isPro && subscription && (
              <button
                onClick={handleSubscriptionManagement}
                disabled={isLoadingPortal}
                className={`w-full px-4 py-2 text-left text-sm text-accent-blue hover:bg-accent-blue/10 transition-colors duration-200 flex items-center gap-3 ${
                  isLoadingPortal ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoadingPortal ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-blue"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
                {isLoadingPortal ? t('userMenu.loadingPortal') : t('userMenu.manageSubscription')}
              </button>
            )}

            {/* Dashboard */}
            <button
              onClick={() => {
                setIsOpen(false)
                window.location.href = '/riders'
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-dark-700/50 transition-colors duration-200 flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t('userMenu.dashboard')}
            </button>

            {/* Ajuda */}
            <button
              onClick={() => {
                setIsOpen(false)
                window.open('https://riderforge.help', '_blank')
              }}
              className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-dark-700/50 transition-colors duration-200 flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('userMenu.help')}
            </button>

            {/* Separador */}
            <div className="border-t border-dark-600/30 my-2"></div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-900/20 transition-colors duration-200 flex items-center gap-3"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {t('userMenu.logout')}
            </button>
            
            {/* Status da Sessão */}
            <div className="px-4 py-2 text-xs text-gray-500">
              {t('userMenu.sessionActive')}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserMenu
