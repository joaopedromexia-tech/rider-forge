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
      const contentType = response.headers.get('content-type') || ''
      let errorBody = null
      let rawText = ''
      if (contentType.includes('application/json')) {
        errorBody = await response.json().catch(() => ({}))
      } else {
        rawText = await response.text().catch(() => '')
      }
      console.error('Portal session API error:', {
        status: response.status,
        statusText: response.statusText,
        contentType,
        body: errorBody || rawText
      })
      const message = (errorBody && (errorBody.error || errorBody.message)) || rawText || 'Failed to create portal session'
      throw new Error(message)
    }

    const { id: portalUrl } = await response.json()
    return portalUrl
  } catch (error) {
    console.error('Error creating portal session:', error)
    throw new Error(error.message || 'Erro ao abrir portal de subscrição')
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
