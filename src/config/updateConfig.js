// Update Configuration
// Change the version number here to show the update notice to users

export const UPDATE_CONFIG = {
  // Current version - increment this when you want to show the update notice
  currentVersion: '1.0.0',
  
  // Update notice settings
  showDelay: 2000, // Delay in milliseconds before showing the notice
  
  // Quick summary of what's new (keep it concise)
  quickSummary: {
    en: 'New features and improvements',
    pt: 'Novas funcionalidades e melhorias'
  },
  
  // Main updates to highlight (keep to 3-4 items max)
  mainUpdates: [
    {
      type: 'feature',
      title: {
        en: 'Stage Plot Editor',
        pt: 'Editor de Stage Plot'
      },
      description: {
        en: 'Create professional stage diagrams',
        pt: 'Crie diagramas de palco profissionais'
      }
    },
    {
      type: 'improvement',
      title: {
        en: 'Better Performance',
        pt: 'Performance Melhorada'
      },
      description: {
        en: '91% faster loading',
        pt: 'Carregamento 91% mais rápido'
      }
    },
    {
      type: 'feature',
      title: {
        en: 'PDF Import',
        pt: 'Importação de PDFs'
      },
      description: {
        en: 'Import riders from PDF files',
        pt: 'Importe riders de arquivos PDF'
      }
    },
    {
      type: 'improvement',
      title: {
        en: 'Updated Interface',
        pt: 'Interface Atualizada'
      },
      description: {
        en: 'More modern and responsive design',
        pt: 'Design mais moderno e responsivo'
      }
    }
  ]
}

// Helper function to check if user should see the update notice
export const shouldShowUpdateNotice = () => {
  const dismissedVersion = localStorage.getItem('riderForge_updateNotice_dismissed')
  const lastSeenVersion = localStorage.getItem('riderForge_lastSeenVersion')
  const currentVersion = UPDATE_CONFIG.currentVersion
  
  // Don't show if user has already dismissed this specific version
  if (dismissedVersion === currentVersion) {
    return false
  }
  
  // Show if user hasn't seen this version yet (new version detected)
  if (lastSeenVersion !== currentVersion) {
    return true
  }
  
  // Don't show if user has already seen this version
  return false
}

// Helper function to mark version as seen
export const markVersionAsSeen = () => {
  localStorage.setItem('riderForge_lastSeenVersion', UPDATE_CONFIG.currentVersion)
}

// Helper function to dismiss update notice
export const dismissUpdateNotice = () => {
  localStorage.setItem('riderForge_updateNotice_dismissed', UPDATE_CONFIG.currentVersion)
}
