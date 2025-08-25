// Configurações do sistema Free vs Pro
export const PRO_CONFIG = {
  // Limites da versão Free
  FREE_LIMITS: {
    maxRiders: 2,
    maxStorageMB: 10
  },

  // Funcionalidades Pro
  PRO_FEATURES: {
    UNLIMITED_RIDERS: {
      id: 'unlimited_riders',
      title: 'Riders Ilimitados',
      description: 'Salve quantos riders quiser sem limitações'
    },
    PRO_EQUIPMENT: {
      id: 'pro_equipments',
      title: 'Biblioteca Pro',
      description: 'Acesso a equipamentos profissionais premium'
    },
    CUSTOM_PDF: {
      id: 'custom_pdf',
      title: 'PDF Customizável',
      description: 'Personalize cores, logo e rodapé dos PDFs'
    },
    VERSION_HISTORY: {
      id: 'version_history',
      title: 'Histórico de Versões',
      description: 'Controle de versões e histórico de alterações'
    },
    ADVANCED_EXPORT: {
      id: 'advanced_export',
      title: 'Exportação Avançada',
      description: 'Formatos de exportação adicionais'
    }
  },

  // Mensagens do sistema
  MESSAGES: {
    FREE_LIMIT_REACHED: 'Limite da versão Free atingido. Máximo {limit} riders.',
    STORAGE_LIMIT_REACHED: 'Limite de armazenamento da versão Free atingido. Máximo {limit}MB.',
    PRO_FEATURE_LOCKED: 'Esta função está disponível no Rider Forge Pro',
    UPGRADE_TO_PRO: 'Upgrade para Pro',
    CONTINUE_FREE: 'Continuar Free'
  },

  // Configurações de UI
  UI: {
    PRO_BADGE_COLORS: {
      background: 'bg-gradient-to-r from-accent-green to-accent-blue',
      text: 'text-white'
    },
    LOCK_ICON: '🔒',
    PRO_ICON: '✓'
  }
}

// Função para verificar se uma funcionalidade está disponível
export const isFeatureAvailable = (featureId, isPro) => {
  if (isPro) return true
  
  const proFeatures = Object.values(PRO_CONFIG.PRO_FEATURES).map(f => f.id)
  return !proFeatures.includes(featureId)
}

// Função para obter mensagem de limite
export const getLimitMessage = (type, limit) => {
  const messages = {
    riders: PRO_CONFIG.MESSAGES.FREE_LIMIT_REACHED.replace('{limit}', limit),
    storage: PRO_CONFIG.MESSAGES.STORAGE_LIMIT_REACHED.replace('{limit}', limit)
  }
  return messages[type] || ''
}

