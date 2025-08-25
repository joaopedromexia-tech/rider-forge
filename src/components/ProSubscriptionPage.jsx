import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useStripeCheckout } from '../config/stripe'
import { useFeedback } from '../hooks/useFeedback'
import LoginModal from './auth/LoginModal'
import ProStatusBadge from './ProStatusBadge'

const ProSubscriptionPage = ({ onBack }) => {
  const { user, isPro, subscription, loading: authLoading } = useAuth()
  const { redirectToCheckout } = useStripeCheckout()
  const { showSuccess, showError } = useFeedback()
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('annual')
  const [hoveredFeature, setHoveredFeature] = useState(null)

  // Verificações de segurança para evitar erros durante carregamento
  const isProUser = Boolean(isPro)
  const hasUser = Boolean(user)
  const hasSubscription = Boolean(subscription)

  const plans = {
    annual: {
      id: 'annual',
      name: 'Anual',
      price: '€3.99',
      period: 'ano',
      originalPrice: '€47.88',
      savings: '€43.89',
      popular: true,
      features: [
        'Riders ilimitados',
        'Biblioteca Pro de equipamentos',
        'PDF customizável com logo',
        'Histórico de versões',
        'Exportação avançada (CSV, Excel)',
        'Armazenamento ilimitado',
        'Suporte prioritário',
        'Acesso antecipado a novas funcionalidades'
      ]
    }
  }

  const features = [
    {
      icon: '🎯',
      title: 'Riders Ilimitados',
      description: 'Crie quantos riders quiser sem limitações. Ideal para produtores que trabalham com múltiplos artistas.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: '🎛️',
      title: 'Biblioteca Pro',
      description: 'Acesso a equipamentos profissionais premium, incluindo marcas de topo e modelos exclusivos.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: '🎨',
      title: 'PDF Customizável',
      description: 'Personalize os seus PDFs com logo, cores da marca e rodapé personalizado para uma apresentação profissional.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: '⏰',
      title: 'Histórico de Versões',
      description: 'Controle de versões completo. Volte atrás a qualquer momento e veja o histórico de alterações.',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: '📊',
      title: 'Exportação Avançada',
      description: 'Exporte para múltiplos formatos: PDF, CSV, Excel. Integre facilmente com outros sistemas.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: '☁️',
      title: 'Armazenamento Ilimitado',
      description: 'Guarde todos os seus riders sem preocupações com espaço. Backup automático e sincronização.',
      color: 'from-indigo-500 to-purple-500'
    }
  ]

  const handleUpgrade = async () => {
    if (!hasUser) {
      setShowLoginModal(true)
      return
    }

    setLoading(true)
    try {
      await redirectToCheckout(
        import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID,
        user.id,
        user.email
      )
    } catch (error) {
      console.error('Error redirecting to checkout:', error)
      showError('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleManageSubscription = async () => {
    if (hasSubscription && subscription?.customer_id) {
      try {
        window.open(`/api/create-portal-session?customer_id=${subscription.customer_id}`, '_blank')
      } catch (error) {
        console.error('Error opening portal:', error)
        showError('Erro ao abrir portal de gestão.')
      }
    }
  }

  // Loading state durante carregamento da autenticação
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
      {/* Header com navegação */}
      <div className="sticky top-0 z-40 bg-dark-950/95 backdrop-blur-md border-b border-dark-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="hidden sm:inline">Voltar</span>
            </button>
            
            {isProUser && (
              <ProStatusBadge />
            )}
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-blue/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-green/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/3 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Content */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-green/10 border border-accent-green/30 rounded-full text-accent-green text-sm font-medium mb-6">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Plano Mais Popular</span>
            </div>
            
            <h1 className="text-5xl sm:text-7xl font-bold text-gradient mb-6 leading-tight">
              Rider Forge Pro
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Potencialize a sua produção musical com ferramentas profissionais. 
              Crie riders ilimitados, aceda a equipamentos premium e personalize 
              os seus documentos como nunca antes.
            </p>
            
            {isProUser && (
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-accent-green/20 border border-accent-green/30 rounded-full text-accent-green animate-pulse">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-semibold">Plano Pro Ativo</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Free Plan */}
          <div className="bg-dark-800/50 backdrop-blur-sm rounded-3xl p-8 border border-dark-700 hover:border-dark-600 transition-all duration-300">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-2">Free</h3>
              <div className="text-4xl font-bold text-gray-100 mb-2">€0</div>
              <p className="text-gray-400">Para sempre</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Até 2 riders
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Biblioteca básica de equipamentos
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Exportação PDF básica
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                5MB de armazenamento
              </li>
              <li className="flex items-center text-gray-500">
                <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                PDF customizável
              </li>
              <li className="flex items-center text-gray-500">
                <svg className="w-5 h-5 text-gray-500 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Histórico de versões
              </li>
            </ul>

            <button
              onClick={onBack}
              className="w-full btn-secondary"
            >
              Continuar Free
            </button>
          </div>

          {/* Pro Plan */}
          <div className="relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
              <span className="bg-gradient-to-r from-accent-green to-accent-blue text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                Mais Popular
              </span>
            </div>
            
            <div className="bg-gradient-to-br from-accent-blue/10 to-accent-green/10 backdrop-blur-sm rounded-3xl p-8 border-2 border-accent-blue/30 relative overflow-hidden hover:border-accent-blue/50 transition-all duration-300">
              {/* Background Pattern */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/5 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-green/5 rounded-full blur-2xl"></div>
              </div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="text-4xl font-bold text-white">{plans[selectedPlan].price}</div>
                    <div className="text-gray-300">/{plans[selectedPlan].period}</div>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className="text-gray-400 line-through">{plans[selectedPlan].originalPrice}</span>
                    <span className="text-accent-green font-semibold">Poupe {plans[selectedPlan].savings}</span>
                  </div>
                  <div className="text-sm text-gray-300 mt-2">
                    Apenas €0.33 por mês!
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plans[selectedPlan].features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-100">
                      <svg className="w-5 h-5 text-accent-green mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {isProUser ? (
                  <button
                    onClick={handleManageSubscription}
                    className="w-full btn-primary"
                  >
                    Gerir Subscrição
                  </button>
                ) : (
                  <button
                    onClick={handleUpgrade}
                    disabled={loading}
                    className="w-full btn-primary flex items-center justify-center gap-2 transform hover:scale-105 transition-all duration-200"
                  >
                    {loading ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        A processar...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Upgrade para Pro
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Por que escolher o Rider Forge Pro?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Descubra como o Rider Forge Pro pode transformar a sua produção musical
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700 hover:border-dark-600 transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                  hoveredFeature === index ? 'ring-2 ring-accent-blue/50' : ''
                }`}
                onMouseEnter={() => setHoveredFeature(index)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 text-2xl`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Perguntas Frequentes
            </h2>
            <p className="text-gray-300">
              Tudo o que precisa de saber sobre o Rider Forge Pro
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700 hover:border-dark-600 transition-all duration-300">
              <h3 className="font-semibold text-white mb-2">
                É uma subscrição anual?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Sim, o Rider Forge Pro é uma subscrição anual de apenas €3.99. Isso significa que paga apenas uma vez por ano, 
                o que equivale a apenas €0.33 por mês!
              </p>
            </div>

            <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700 hover:border-dark-600 transition-all duration-300">
              <h3 className="font-semibold text-white mb-2">
                Os meus riders ficam guardados se cancelar?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Sim, todos os seus riders ficam guardados. Se cancelar, poderá continuar a aceder aos seus riders existentes, 
                mas não poderá criar novos riders (limite de 2 na versão Free).
              </p>
            </div>

            <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700 hover:border-dark-600 transition-all duration-300">
              <h3 className="font-semibold text-white mb-2">
                Que métodos de pagamento aceitam?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Aceitamos todos os principais cartões de crédito e débito, incluindo Visa, Mastercard, American Express 
                e outros métodos de pagamento seguros através do Stripe.
              </p>
            </div>

            <div className="bg-dark-800/30 backdrop-blur-sm rounded-2xl p-6 border border-dark-700 hover:border-dark-600 transition-all duration-300">
              <h3 className="font-semibold text-white mb-2">
                Posso cancelar a qualquer momento?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Sim, pode cancelar a sua subscrição a qualquer momento através do portal de gestão. 
                Continuará a ter acesso às funcionalidades Pro até ao final do período de faturação.
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

export default ProSubscriptionPage
