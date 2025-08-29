// Free vs Pro system configuration
export const PRO_CONFIG = {
  // Free version limits
  FREE_LIMITS: {
    maxRiders: 2,
    maxStorageMB: 5
  },

  // Pro features
  PRO_FEATURES: {
    UNLIMITED_RIDERS: {
      id: 'unlimited_riders',
      title: 'Unlimited Riders',
      description: 'Save as many riders as you want without limitations'
    },
    PRO_EQUIPMENT: {
      id: 'pro_equipments',
      title: 'Pro Library',
      description: 'Access to premium professional equipment'
    },
    CUSTOM_PDF: {
      id: 'custom_pdf',
      title: 'Customizable PDF',
      description: 'Customize colors, logo and footer of PDFs'
    },
    VERSION_HISTORY: {
      id: 'version_history',
      title: 'Version History',
      description: 'Version control and change history'
    },

  },

  // System messages
  MESSAGES: {
    FREE_LIMIT_REACHED: 'Free version limit reached. Maximum {limit} riders.',
    STORAGE_LIMIT_REACHED: 'Free storage limit reached. Maximum {limit}MB.',
    PRO_FEATURE_LOCKED: 'This feature is available in Rider Forge Pro',
    UPGRADE_TO_PRO: 'Upgrade to Pro',
    CONTINUE_FREE: 'Continue Free'
  },

  // UI configuration
  UI: {
    PRO_BADGE_COLORS: {
      background: 'bg-gradient-to-r from-accent-green to-accent-blue',
      text: 'text-white'
    },
    LOCK_ICON: '🔒',
    PRO_ICON: '✓'
  }
}

// Function to check if a feature is available
export const isFeatureAvailable = (featureId, isPro) => {
  if (isPro) return true
  
  const proFeatures = Object.values(PRO_CONFIG.PRO_FEATURES).map(f => f.id)
  return !proFeatures.includes(featureId)
}

// Function to get limit message
export const getLimitMessage = (type, limit) => {
  const messages = {
    riders: PRO_CONFIG.MESSAGES.FREE_LIMIT_REACHED.replace('{limit}', limit),
    storage: PRO_CONFIG.MESSAGES.STORAGE_LIMIT_REACHED.replace('{limit}', limit)
  }
  return messages[type] || ''
}

