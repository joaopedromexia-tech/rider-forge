import React, { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { STRIPE_CONFIG, useStripeCheckout } from '../../config/stripe'
import LoginModal from '../auth/LoginModal'

const PricingPage = () => {
  const { user, isPro, subscription } = useAuth()
  const { redirectToCheckout } = useStripeCheckout()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha o seu plano
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Comece gratuitamente e faça upgrade quando precisar de mais funcionalidades
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border-2 border-gray-200">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-900 mb-2">€0</div>
              <p className="text-gray-600">Para sempre</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Até 2 riders
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Biblioteca básica de equipamentos
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Exportação PDF básica
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                5MB de armazenamento
              </li>
            </ul>

            <button
              onClick={() => window.location.href = '/dashboard'}
              className="w-full bg-gray-100 text-gray-900 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
            >
              Começar Grátis
            </button>
          </div>

          {/* Pro Plan */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl p-8 text-white relative">
            {isPro && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                  Plano Ativo
                </span>
              </div>
            )}
            
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-2">$9.99</div>
              <p className="text-blue-100">por ano</p>
              <div className="text-sm text-blue-200 mt-2">
                Apenas €0.33 por mês!
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Riders ilimitados
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Biblioteca Pro de equipamentos
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                PDF customizável
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Histórico de versões
              </li>

              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Armazenamento ilimitado
              </li>
            </ul>

            {isPro ? (
              <button
                onClick={handleManageSubscription}
                className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Gerir Subscrição
              </button>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full bg-white text-blue-600 py-3 px-6 rounded-lg font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'A processar...' : 'Upgrade para Pro'}
              </button>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Perguntas Frequentes
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                É uma subscrição anual?
              </h3>
              <p className="text-gray-600">
                Sim, o Rider Forge Pro é uma subscrição anual de apenas €3.99. Isso significa que paga apenas uma vez por ano, o que equivale a apenas €0.33 por mês!
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Os meus riders ficam guardados se cancelar?
              </h3>
              <p className="text-gray-600">
                Sim, todos os seus riders ficam guardados. Se cancelar, poderá continuar a aceder aos seus riders existentes, mas não poderá criar novos riders (limite de 2 na versão Free).
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Que métodos de pagamento aceitam?
              </h3>
              <p className="text-gray-600">
                Aceitamos todos os principais cartões de crédito e débito, incluindo Visa, Mastercard, American Express e outros métodos de pagamento seguros através do Stripe.
              </p>
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
