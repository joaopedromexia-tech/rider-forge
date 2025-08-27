import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

export const stripePromise = loadStripe(stripePublishableKey)

// Configurações dos produtos Stripe
export const STRIPE_CONFIG = {
  PRODUCTS: {
    PRO_ANNUAL: {
      id: 'pro_annual',
      priceId: import.meta.env.VITE_STRIPE_PRO_ANNUAL_PRICE_ID,
      name: 'Rider Forge Pro',
      price: '€3.99/ano',
      features: [
        'Riders Ilimitados',
        'Biblioteca Pro de Equipamentos',
        'PDF Customizável',
        'Histórico de Versões',
      
        'Armazenamento Ilimitado'
      ]
    }
  },

  // URLs de callback
  SUCCESS_URL: `${window.location.origin}/dashboard?success=true`,
  CANCEL_URL: `${window.location.origin}/pricing?canceled=true`,
  PORTAL_URL: `${window.location.origin}/account`
}

// Funções do Stripe
export const stripe = {
  // Criar checkout session
  createCheckoutSession: async (priceId, userId, customerEmail) => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId,
          customerEmail,
          successUrl: STRIPE_CONFIG.SUCCESS_URL,
          cancelUrl: STRIPE_CONFIG.CANCEL_URL
        }),
      })

      const session = await response.json()
      return { session, error: null }
    } catch (error) {
      return { session: null, error }
    }
  },

  // Criar portal de gestão
  createPortalSession: async (customerId) => {
    try {
      const response = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          returnUrl: STRIPE_CONFIG.PORTAL_URL
        }),
      })

      const session = await response.json()
      return { session, error: null }
    } catch (error) {
      return { session: null, error }
    }
  },

  // Verificar status do pagamento
  verifyPayment: async (sessionId) => {
    try {
      const response = await fetch(`/api/verify-payment?session_id=${sessionId}`)
      const result = await response.json()
      return { result, error: null }
    } catch (error) {
      return { result: null, error }
    }
  }
}

// Hook para gestão de checkout
export const useStripeCheckout = () => {
  const redirectToCheckout = async (priceId, userId, customerEmail) => {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    const { session, error } = await stripe.createCheckoutSession(
      priceId,
      userId,
      customerEmail
    )

    if (error) {
      throw error
    }

    const { error: checkoutError } = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (checkoutError) {
      throw checkoutError
    }
  }

  const redirectToPortal = async (customerId) => {
    const stripe = await stripePromise
    if (!stripe) {
      throw new Error('Stripe failed to load')
    }

    const { session, error } = await stripe.createPortalSession(customerId)

    if (error) {
      throw error
    }

    const { error: portalError } = await stripe.redirectToCheckout({
      sessionId: session.id,
    })

    if (portalError) {
      throw portalError
    }
  }

  return {
    redirectToCheckout,
    redirectToPortal
  }
}
