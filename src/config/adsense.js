// Google AdSense Configuration
const env = (key, fallback) => {
  try {
    return import.meta?.env?.[key] || fallback
  } catch {
    return fallback
  }
}

export const ADSENSE_CONFIG = {
  // Google AdSense Publisher ID
  CLIENT_ID: env('VITE_ADSENSE_CLIENT_ID', 'ca-pub-8989918672180030'),

  // Ad Slots (overridable via env vars)
  AD_SLOTS: {
    HEADER_BANNER: env('VITE_ADSENSE_SLOT_HEADER', '1234567890'),
    SIDEBAR_BANNER: env('VITE_ADSENSE_SLOT_SIDEBAR', '1234567891'),
    FOOTER_BANNER: env('VITE_ADSENSE_SLOT_FOOTER', '1234567892'),
  },

  // Ad Formats
  AD_FORMATS: {
    AUTO: 'auto',
    BANNER: 'banner',
    RECTANGLE: 'rectangle',
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal'
  },

  // Ad Sizes
  AD_SIZES: {
    HEADER: { width: 728, height: 90 },
    SIDEBAR: { width: 300, height: 250 },
    FOOTER: { width: 728, height: 90 }
  }
}

// Helper function to get ad slot
export const getAdSlot = (type) => {
  return ADSENSE_CONFIG.AD_SLOTS[type] || ADSENSE_CONFIG.AD_SLOTS.HEADER_BANNER
}

// Helper function to get client ID
export const getClientId = () => {
  return ADSENSE_CONFIG.CLIENT_ID
}
