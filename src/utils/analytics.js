export function trackEvent(eventName, params = {}) {
  try {
    // Basic console-based analytics; integrate with your provider later
    console.log('[analytics]', eventName, params)
    if (window?.va) {
      // Vercel Analytics if available
      window.va(eventName, params)
    }
  } catch (_) {}
}





