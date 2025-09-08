// Google AdSense Configuration
export const ADSENSE_CONFIG = {
  // Your Google AdSense Publisher ID
  CLIENT_ID: 'ca-pub-8989918672180030',
  
  // Ad Slots - Replace these with your actual ad slot IDs from Google AdSense
  AD_SLOTS: {
    HEADER_BANNER: '1234567890', // Replace with your actual header banner ad slot
    SIDEBAR_BANNER: '1234567891', // Replace with your actual sidebar banner ad slot
    FOOTER_BANNER: '1234567892', // Replace with your actual footer banner ad slot
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
  return ADSENSE_CONFIG.AD_SLOTS[type] || '1234567890'
}

// Helper function to get client ID
export const getClientId = () => {
  return ADSENSE_CONFIG.CLIENT_ID
}
