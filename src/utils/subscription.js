// Utility functions for subscription management

/**
 * Opens the Stripe customer portal for subscription management
 * @param {string} customerId - The Stripe customer ID
 * @param {string} returnUrl - URL to return to after portal session
 * @returns {Promise<string>} The portal URL
 */
export const openSubscriptionPortal = async (customerId, returnUrl = window.location.href) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    const { id: portalUrl } = await response.json()
    return portalUrl
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw new Error('Erro ao abrir portal de subscrição')
  }
}

/**
 * Redirects user to subscription portal
 * @param {string} customerId - The Stripe customer ID
 * @param {string} returnUrl - URL to return to after portal session
 */
export const redirectToSubscriptionPortal = async (customerId, returnUrl) => {
  try {
    const portalUrl = await openSubscriptionPortal(customerId, returnUrl)
    window.location.href = portalUrl
  } catch (error) {
    console.error('Error redirecting to portal:', error)
    throw error
  }
}
