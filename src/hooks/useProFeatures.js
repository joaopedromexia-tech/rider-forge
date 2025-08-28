import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRider } from '../context/RiderContext'
import { PRO_CONFIG } from '../config/proConfig'

// Exportar as funcionalidades Pro da configuração
export const PRO_FEATURES = PRO_CONFIG.PRO_FEATURES

export function useProFeatures() {
  const { isPro, hasAccount } = useAuth()
  const { savedRiders } = useRider()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showSaveProgressModal, setShowSaveProgressModal] = useState(false)
  const [currentFeature, setCurrentFeature] = useState(null)
  const [pendingProAction, setPendingProAction] = useState(null)

  // Verificar se uma funcionalidade está disponível
  const isFeatureAvailable = (featureId) => {
    if (isPro) return true
    
    // Lista de funcionalidades que requerem Pro
    const proFeatures = Object.values(PRO_FEATURES).map(f => f.id)
    
    return !proFeatures.includes(featureId)
  }

  // Verificar se pode salvar mais riders (lógica especial para usuários gratuitos com conta)
  const canSaveMoreRiders = () => {
    // Se é Pro, pode salvar ilimitadamente
    if (isPro) return true
    
    // Se não tem conta, não pode salvar
    if (!hasAccount) return false
    
    // Para usuários gratuitos com conta, verificar se ainda não atingiu o limite
    const currentRiderCount = savedRiders.length
    const maxRiders = PRO_CONFIG.FREE_LIMITS.maxRiders
    
    return currentRiderCount < maxRiders
  }

  // Tentar usar uma funcionalidade Pro
  const useProFeature = (featureId, callback) => {
    // Lógica especial para UNLIMITED_RIDERS
    if (featureId === PRO_FEATURES.UNLIMITED_RIDERS.id) {
      if (canSaveMoreRiders()) {
        return callback()
      } else {
        const feature = PRO_FEATURES.UNLIMITED_RIDERS
        setCurrentFeature(feature)
        setShowUpgradeModal(true)
        return false
      }
    }
    
    // Para outras funcionalidades, usar lógica padrão
    if (isFeatureAvailable(featureId)) {
      return callback()
    } else {
      const feature = Object.values(PRO_FEATURES).find(f => f.id === featureId)
      setCurrentFeature(feature)
      setShowUpgradeModal(true)
      return false
    }
  }

  // Tentar usar uma funcionalidade Pro com opção de salvar progresso
  const useProFeatureWithSave = (featureId, callback, hasUnsavedChanges = false) => {
    // Lógica especial para UNLIMITED_RIDERS
    if (featureId === PRO_FEATURES.UNLIMITED_RIDERS.id) {
      if (canSaveMoreRiders()) {
        return callback()
      } else {
        const feature = PRO_FEATURES.UNLIMITED_RIDERS
        
        if (hasUnsavedChanges) {
          setCurrentFeature(feature)
          setPendingProAction(callback)
          setShowSaveProgressModal(true)
          return false
        } else {
          setCurrentFeature(feature)
          setShowUpgradeModal(true)
          return false
        }
      }
    }
    
    // Para outras funcionalidades, usar lógica padrão
    if (isFeatureAvailable(featureId)) {
      return callback()
    } else {
      const feature = Object.values(PRO_FEATURES).find(f => f.id === featureId)
      
      if (hasUnsavedChanges) {
        setCurrentFeature(feature)
        setPendingProAction(callback)
        setShowSaveProgressModal(true)
        return false
      } else {
        setCurrentFeature(feature)
        setShowUpgradeModal(true)
        return false
      }
    }
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

  // Fechar modal de upgrade
  const closeUpgradeModal = () => {
    setShowUpgradeModal(false)
    setCurrentFeature(null)
  }

  // Fechar modal de salvar progresso
  const closeSaveProgressModal = () => {
    setShowSaveProgressModal(false)
    setCurrentFeature(null)
    setPendingProAction(null)
  }

  // Executar ação Pro após salvar progresso
  const executePendingProAction = () => {
    if (pendingProAction) {
      pendingProAction()
    }
    closeSaveProgressModal()
  }

  return {
    isPro,
    showUpgradeModal,
    showSaveProgressModal,
    currentFeature,
    pendingProAction,
    isFeatureAvailable,
    useProFeature,
    useProFeatureWithSave,
    canSaveMoreRiders,
    canUseProEquipment,
    canCustomizePDF,
    canUseVersionHistory,

    closeUpgradeModal,
    closeSaveProgressModal,
    executePendingProAction,
    PRO_FEATURES
  }
}
