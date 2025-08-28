import { useState } from 'react'
import { Analytics } from '@vercel/analytics/react'

import { I18nProvider, useI18n } from './context/I18nContext'
import { EquipmentProvider } from './context/EquipmentContext'
import { UnitsProvider } from './context/UnitsContext'
import { RiderProvider } from './context/RiderContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import RiderForm from './components/RiderForm'
import MyRiders from './components/MyRiders'
import PDFPreview from './components/PDFPreview'
import ProSubscriptionPage from './components/ProSubscriptionPage'
import PricingPage from './components/pricing/PricingPage'
import SubscriptionManagementPage from './components/subscription/SubscriptionManagementPage'
import FAQPage from './components/legal/FAQPage'
import PrivacyTermsPage from './components/legal/PrivacyTermsPage'
import DemoButton from './components/DemoButton'
import LoginModal from './components/auth/LoginModal'
import BugReportButton from './components/BugReportButton'
import ProStatusBadge from './components/ProStatusBadge'


// Componente interno que usa o contexto de autenticação
function AppContent() {
  const [currentView, setCurrentView] = useState('home')
  const [editingRiderId, setEditingRiderId] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const { t, locale, setLocale } = useI18n()
  
  const { user, hasAccount, isPro, loading: authLoading } = useAuth()

  // Verificações de segurança para evitar erros durante carregamento
  const isProUser = Boolean(isPro)
  const hasUser = Boolean(user)
  const hasUserAccount = Boolean(hasAccount)



  const handleNavigateToForm = (riderId = null) => {
    setEditingRiderId(riderId)
    setCurrentView('form')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setEditingRiderId(null)
  }

  const handleNavigateToMyRiders = () => {
    // Verificar se o utilizador tem conta criada
    if (!hasUser) {
      setShowLoginModal(true)
      return
    }
    
    if (!hasUserAccount) {
      setShowLoginModal(true)
      return
    }
    
    setCurrentView('riders')
  }

  const handleNavigateToPreview = (riderId) => {
    setEditingRiderId(riderId)
    setCurrentView('preview')
  }

  const handleNavigateToProSubscription = () => {
    setCurrentView('pro-subscription')
  }

  const handleNavigateToPricing = () => {
    setCurrentView('pricing')
  }

  const handleNavigateToSubscriptionManagement = () => {
    setCurrentView('subscription-management')
  }

  const handleNavigateToFAQ = () => {
    setCurrentView('faq')
  }

  const handleNavigateToPrivacyTerms = () => {
    setCurrentView('privacy-terms')
  }

  // Se ainda está a carregar, mostrar loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="App">
      {currentView === 'home' && (
        <>
          <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
            {/* Header */}
            <div className="text-center mb-12 sm:mb-16 lg:mb-20">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-gradient mb-4 sm:mb-6 leading-[1.1] pb-2">{t('app.title')}</h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed px-4">{t('app.subtitle')}</p>
              <div className="mt-4 flex items-center justify-center gap-4">
                <select value={locale} onChange={(e) => setLocale(e.target.value)} className="px-3 py-2 bg-dark-800 border border-dark-700 rounded-lg text-gray-200">
                  <option value="pt">PT</option>
                  <option value="en">EN</option>
                </select>
                {!isProUser && (
                  <button 
                    onClick={handleNavigateToPricing}
                    className="transition-transform hover:scale-105"
                  >
                    <ProStatusBadge />
                  </button>
                )}
                {isProUser && (
                  <div className="transition-transform hover:scale-105">
                    <ProStatusBadge />
                  </div>
                )}
              </div>
            </div>
            
            {/* Main Action Buttons */}
            <div className={`grid grid-cols-1 ${import.meta.env.VITE_SHOW_DEMO === 'true' ? 'lg:grid-cols-3' : 'lg:grid-cols-2'} gap-6 sm:gap-8 max-w-6xl mx-auto mb-12 sm:mb-16`}>
              {/* Criar Novo Rider */}
              <div className="card hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-blue/20">
                <div className="text-center p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-accent-blue to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">{t('home.createNew.title')}</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{t('home.createNew.desc')}</p>
                  <button
                    onClick={() => handleNavigateToForm()}
                    className="btn-primary w-full text-lg py-4"
                  >
                    <span>{t('home.createNew.cta')}</span>
                  </button>
                </div>
              </div>

              {/* Os Meus Riders */}
              <div className={`card transition-all duration-300 ${
                hasUser && hasUserAccount 
                  ? 'hover:scale-105 hover:shadow-2xl hover:shadow-accent-green/20' 
                  : 'opacity-80 cursor-pointer hover:scale-102 hover:shadow-xl hover:shadow-yellow-500/10'
              }`}>
                <div className="text-center p-6 sm:p-8">
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg ${
                    hasUser && hasUserAccount 
                      ? 'bg-gradient-to-r from-accent-green to-green-500' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}>
                    {hasUser && hasUserAccount ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">{t('home.dashboard.title')}</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {hasUser && hasUserAccount ? t('home.dashboard.desc.hasAccount') : t('home.dashboard.desc.noAccount')}
                  </p>
                  {hasUser && hasUserAccount ? (
                    <button
                      onClick={handleNavigateToMyRiders}
                      className="w-full text-lg py-4 btn-secondary"
                    >
                      <span>{t('home.dashboard.open')}</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full text-lg py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <span>🔑 {t('home.login')}</span>
                      </button>
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full text-lg py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
                        style={{ position: 'relative', zIndex: 10 }}
                      >
                        <span>✨ {t('home.signup')}</span>
                      </button>
                    </div>
                  )}
                  

                </div>
              </div>

              {/* Demo */}
              {import.meta.env.VITE_SHOW_DEMO === 'true' && (
              <div className="card hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="text-center p-6 sm:p-8">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 sm:mb-4">{t('home.demo.title')}</h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">{t('home.demo.desc')}</p>
                  <div className="w-full">
                    <DemoButton onNavigateToForm={handleNavigateToForm} />
                  </div>
                </div>
              </div>
              )}
            </div>

            {/* Botão de Pricing - Oculto para usuários Pro */}
            {!isProUser && (
              <div className="mt-12 sm:mt-16 mb-8">
                <div className="bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30 rounded-2xl p-6 sm:p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{t('home.pricing.title')}</h2>
                    <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">{t('home.pricing.desc')}</p>
                    <button
                      onClick={handleNavigateToPricing}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold px-12 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-xl text-lg transform hover:scale-105"
                    >
                      <svg className="w-6 h-6 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      {t('home.pricing.cta')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Botão de Upgrade para Pro no fundo da página */}
            {hasUser && hasUserAccount && !isProUser && (
              <div className="mt-12 sm:mt-16 mb-8">
                <div className="bg-gradient-to-r from-accent-green/10 to-accent-blue/10 border border-accent-green/30 rounded-2xl p-6 sm:p-8 text-center">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">{t('home.pro.title')}</h2>
                    <p className="text-lg sm:text-xl text-gray-300 mb-6 sm:mb-8 leading-relaxed">{t('home.pro.desc')}</p>
                    <button
                      onClick={handleNavigateToProSubscription}
                      className="bg-gradient-to-r from-accent-green to-accent-blue text-white font-semibold px-12 py-4 rounded-xl hover:from-accent-green/90 hover:to-accent-blue/90 transition-all duration-300 shadow-xl text-lg transform hover:scale-105"
                    >
                      <svg className="w-6 h-6 inline mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {t('home.pro.cta')}
                    </button>
                    <p className="text-sm text-gray-400 mt-4">{t('home.pro.perks')}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Footer Info */}
            <div className="text-center text-gray-500 text-sm mt-8 sm:mt-12">
              <p className="mb-4">{t('home.footer')}</p>
              
              {/* Footer Links */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <button
                  onClick={handleNavigateToFAQ}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  FAQ
                </button>
                <button
                  onClick={handleNavigateToPrivacyTerms}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Termos & Privacidade
                </button>
                <button
                  onClick={() => setShowLoginModal(true)}
                  className="text-gray-400 hover:text-gray-300 transition-colors"
                >
                  Suporte
                </button>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
      
      {currentView === 'form' && (
        <RiderForm 
          onBack={handleBackToHome}
          editingRiderId={editingRiderId}
          onNavigateToProSubscription={handleNavigateToProSubscription}
        />
      )}
      
      {currentView === 'riders' && (
        <MyRiders 
          onBack={handleBackToHome}
          onEditRider={handleNavigateToForm}
          onPreview={handleNavigateToPreview}
          onNavigateToProSubscription={handleNavigateToProSubscription}
        />
      )}
      
      {currentView === 'preview' && (
        <PDFPreview 
          riderId={editingRiderId}
          onBack={() => setCurrentView('riders')}
        />
      )}

      {currentView === 'pro-subscription' && (
        <ProSubscriptionPage 
          onBack={handleBackToHome}
        />
      )}

      {currentView === 'pricing' && (
        <PricingPage 
          onBack={handleBackToHome}
          onNavigateToSubscriptionManagement={handleNavigateToSubscriptionManagement}
        />
      )}

      {currentView === 'subscription-management' && (
        <SubscriptionManagementPage 
          onBack={handleBackToHome}
        />
      )}

      {currentView === 'faq' && (
        <FAQPage 
          onBack={handleBackToHome}
        />
      )}

      {currentView === 'privacy-terms' && (
        <PrivacyTermsPage 
          onBack={handleBackToHome}
        />
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
      
      {/* Bug Report Button - Floating */}
      <BugReportButton 
        position="bottom-right"
        showLabel={false}
      />
      
      {/* Vercel Analytics */}
      <Analytics />
    </div>
  )
}

// Componente principal que envolve tudo com os providers
function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <EquipmentProvider>
          <UnitsProvider>
            <RiderProvider>
              <AppContent />
            </RiderProvider>
          </UnitsProvider>
        </EquipmentProvider>
      </I18nProvider>
    </AuthProvider>
  )
}

export default App
