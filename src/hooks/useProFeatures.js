import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { PRO_CONFIG } from '../config/proConfig'

// Exportar as funcionalidades Pro da configuração
export const PRO_FEATURES = PRO_CONFIG.PRO_FEATURES

export function useProFeatures() {
  const { isPro } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(null)

  // Verificar se uma funcionalidade está disponível
  const isFeatureAvailable = (featureId) => {
    if (isPro) return true
    
    // Lista de funcionalidades que requerem Pro
    const proFeatures = Object.values(PRO_FEATURES).map(f => f.id)
    
    return !proFeatures.includes(featureId)
  }

  // Tentar usar uma funcionalidade Pro
  const useProFeature = (featureId, callback) => {
    if (isFeatureAvailable(featureId)) {
      return callback()
    } else {
      const feature = Object.values(PRO_FEATURES).find(f => f.id === featureId)
      setCurrentFeature(feature)
      setShowUpgradeModal(true)
      return false
    }
  }

  // Verificar se pode salvar mais riders
  const canSaveMoreRiders = () => {
    return useProFeature(PRO_FEATURES.UNLIMITED_RIDERS.id, () => true)
  }

  // Verificar se pode usar equipamentos Pro
  const canUseProEquipment = () => {
    return useProFeature(PRO_FEATURES.PRO_EQUIPMENT.id, () => true)
  }

  // Verificar se pode customizar PDF
  const canCustomizePDF = () => {
    return useProFeature(PRO_FEATURES.CUSTOM_PDF.id, () => true)
  }

  // Verificar se pode usar histórico de versões
  const canUseVersionHistory = () => {
    return useProFeature(PRO_FEATURES.VERSION_HISTORY.id, () => true)
  }

  // Verificar se pode usar exportação avançada
  const canUseAdvancedExport = () => {
    return useProFeature(PRO_FEATURES.ADVANCED_EXPORT.id, () => true)
  }

  // Fechar modal de upgrade
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false)
    setCurrentFeature(null)
  }

  return {
    isPro,
    showUpgradeModal,
    currentFeature,
    isFeatureAvailable,
    useProFeature,
    canSaveMoreRiders,
    canUseProEquipment,
    canCustomizePDF,
    canUseVersionHistory,
    canUseAdvancedExport,
    closeUpgradeModal,
    PRO_FEATURES
  }
}
