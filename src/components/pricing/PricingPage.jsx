import React, { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { STRIPE_CONFIG, useStripeCheckout } from '../../config/stripe'
import LoginModal from '../auth/LoginModal'
import { useI18n } from '../../context/I18nContext'

const PricingPage = ({ onBack }) => {
  const { user, isPro, subscription } = useAuth()
  const { redirectToCheckout } = useStripeCheckout()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { t } = useI18n()

  // Redirecionar usuários Pro de volta para a página inicial
  useEffect(() => {
    if (isPro && onBack) {
      onBack()
    }
  }, [isPro, onBack])

  const handleUpgrade = async () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }

    setLoading(true)
    try {
      await redirectToCheckout(STRIPE_CONFIG.PRODUCTS.PRO_ANNUAL.priceId, user.id, user.email)
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (subscription?.customer_id) {
      try {
        // Implementar redirecionamento para portal do Stripe
        window.open(`/api/create-portal-session?customer_id=${subscription.customer_id}`, '_blank')
      } catch (error) {
        console.error('Error opening portal:', error)
      }
    }
  }

  const handleProCardClick = () => {
    if (isPro) {
      handleManageSubscription()
    } else {
      handleUpgrade()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        {onBack && (
          <div className="mb-8">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('common.back')}
            </button>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {t('pricing.header.title')}
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto font-medium">
            {t('pricing.header.subtitle')}
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div 
            className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={() => window.location.href = '/dashboard'}
          >
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('pricing.free.title')}</h3>
              <div className="text-4xl font-bold text-gray-800 mb-2">{t('pricing.free.price')}</div>
              <p className="text-gray-700 font-medium">{t('pricing.free.forever')}</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-700 font-medium">
                <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.free.benefit.maxRiders')}
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.free.benefit.basicLib')}
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.free.benefit.basicPdf')}
              </li>
              <li className="flex items-center text-gray-700 font-medium">
                <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.free.benefit.storage')}
              </li>
            </ul>

            <div className="w-full bg-gray-200 text-gray-800 py-3 px-6 rounded-lg font-semibold text-center">
              {t('pricing.free.cta')}
            </div>
          </div>

          {/* Pro Plan */}
          <div 
            className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer"
            onClick={handleProCardClick}
          >
            {isPro && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Plano Ativo
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-white">{t('pricing.pro.title')}</h3>
              <div className="text-4xl font-bold mb-2 text-white">{t('pricing.pro.price')}</div>
              <p className="text-blue-50 font-medium">{t('pricing.pro.perYear')}</p>
              <div className="text-sm text-blue-100 mt-2 font-medium">{t('pricing.pro.perMonthNote')}</div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-white font-medium">
                <svg className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.pro.benefit.unlimited')}
              </li>
              <li className="flex items-center text-white font-medium">
                <svg className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.pro.benefit.proLib')}
              </li>
              <li className="flex items-center text-white font-medium">
                <svg className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.pro.benefit.customPdf')}
              </li>
              <li className="flex items-center text-white font-medium">
                <svg className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.pro.benefit.versionHistory')}
              </li>

              <li className="flex items-center text-white font-medium">
                <svg className="w-5 h-5 text-green-300 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {t('pricing.pro.benefit.unlimitedStorage')}
              </li>
            </ul>

            <div className="w-full bg-white text-blue-700 py-3 px-6 rounded-lg font-semibold text-center">
              {isPro ? t('pricing.pro.manage') : (loading ? t('pricing.pro.processing') : t('pricing.pro.upgrade'))}
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">{t('pricing.faq.title')}</h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">{t('pricing.faq.q1')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('pricing.faq.a1')}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">{t('pricing.faq.q2')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('pricing.faq.a2')}</p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">{t('pricing.faq.q3')}</h3>
              <p className="text-gray-700 leading-relaxed">{t('pricing.faq.a3')}</p>
            </div>
          </div>
        </div>
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  )
}

export default PricingPage
