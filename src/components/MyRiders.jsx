import { useState, useRef } from 'react'
import { useRider } from '../context/RiderContext'
import { useAuth } from '../context/AuthContext'
import { useProFeatures } from '../hooks/useProFeatures'
import { useFeedback } from '../hooks/useFeedback'
import { useI18n } from '../context/I18nContext'
import ProUpgradeModal from './ProUpgradeModal'
import SaveProgressModal from './SaveProgressModal'
import ProStatusBadge from './ProStatusBadge'
import NewPDFExport from './NewPDFExport'
import LoginModal from './auth/LoginModal'
import Modal from './Modal'
import { encodeObjectToBase64 } from '../utils/base64'
import { PRO_CONFIG } from '../config/proConfig'

function MyRiders({ onBack, onEditRider, onNavigateToProSubscription }) {
  const { 
    savedRiders, 
    deleteRider, 
    duplicateRider, 
    exportRider, 
    importRider,
    getStats,
    getRiderById,
    isPro,
    setIsPro
  } = useRider()
  
  const { user, hasAccount, loading: authLoading } = useAuth()
  const { showSuccess, showError } = useFeedback()
  const { t, locale } = useI18n()
  
  const {
    showUpgradeModal,
    showSaveProgressModal,
    currentFeature,
    closeUpgradeModal,
    closeSaveProgressModal,
    executePendingProAction,
    useProFeature,
    useProFeatureWithSave,
    PRO_FEATURES
  } = useProFeatures()
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)
  const [showImportModal, setShowImportModal] = useState(false)
  const [importError, setImportError] = useState('')
  const [importSuccess, setImportSuccess] = useState('')
  const [showNewPDFModal, setShowNewPDFModal] = useState(false)
  const [exportRiderPayload, setExportRiderPayload] = useState({ name: '', data: {} })
  const [shareLink, setShareLink] = useState('')
  const [showLoginModal, setShowLoginModal] = useState(false)
  const fileInputRef = useRef(null)
  
  const stats = getStats()
  const { FREE_LIMITS } = PRO_CONFIG

  const handleDelete = (id) => {
    deleteRider(id)
    setShowDeleteConfirm(null)
    showSuccess(t('riders.delete.success'))
  }

  const handleDuplicate = (id) => {
    const success = useProFeature(PRO_FEATURES.UNLIMITED_RIDERS.id, () => {
      try {
        duplicateRider(id)
        showSuccess(t('riders.duplicate.success'))
        return true
      } catch (error) {
        showError(t('riders.duplicate.error', { message: error.message }))
        return false
      }
    })
    
    if (!success) {
      // Modal já foi mostrado pelo hook
      return
    }
  }

  const handleExport = (id) => {
    try {
      const rider = getRiderById(id)
      if (!rider) {
        showError(t('riders.export.notFound'))
        return
      }

      // Gerar link de partilha
      const riderData = encodeObjectToBase64(rider.data)
      const shareUrl = `${window.location.origin}/rider/${rider.id}?data=${riderData}`
      setShareLink(shareUrl)
      setExportRiderPayload({ name: rider.name, data: rider.data })
      setShowNewPDFModal(true)
    } catch (error) {
      showError(t('riders.export.error', { message: error.message }))
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    setImportError('')
    setImportSuccess('')

    try {
      await importRider(file)
      setImportSuccess('Rider importado com sucesso!')
      setShowImportModal(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      setImportError(error.message)
    }
  }

  const handleNavigateToMyRiders = () => {
    if (!user) {
      setShowLoginModal(true)
      return
    }
    
    if (!hasAccount) {
      setShowLoginModal(true)
      return
    }
  }

  // Se ainda está a carregar, mostrar loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Se o utilizador não tem conta, mostrar tela de criação de conta
  if (!user || !hasAccount) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center py-12 mb-8">
            <h1 className="text-5xl sm:text-7xl font-bold text-gradient mb-6">
              {t('riders.header.dashboard')}
            </h1>
            <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {!user 
                ? t('riders.auth.loginToAccess')
                : t('riders.auth.createAccountToAccess')
              }
            </p>
          </div>
          
          {/* Call to Action */}
          <div className="max-w-md mx-auto">
            <div className="card text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-accent-green to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-100 mb-4">
                {!user ? t('riders.auth.loginRequired') : t('riders.auth.accountRequired')}
              </h3>
              <p className="text-gray-400 mb-6">
                {!user 
                  ? t('riders.auth.loginExplanation')
                  : t('riders.auth.accountExplanation')
                }
              </p>
              <button
                onClick={() => setShowLoginModal(true)}
                className="btn-primary w-full text-lg py-4"
              >
                <span>{!user ? t('auth.login.cta') : t('auth.signup.cta')}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Login Modal */}
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => setShowLoginModal(false)} 
        />
      </div>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(locale, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getEquipmentIcon = (category) => {
    const icons = {
      'dados-gerais': '📋',
      'pa': '🔊',
          'consolas': '🎛️',
      'sistemas-escuta': '🎧',
      'equipamento-auxiliar': '🔧',
      'input-list': '📝',
      'monitor-mixes': '🎚️',
      'observacoes-finais': '📝'
    }
    return icons[category] || '📄'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-4">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="btn-secondary flex items-center gap-2 w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {t('common.back')}
          </button>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-gradient text-center">{t('riders.header.dashboard')}</h1>
          
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center">
            {/* Badge de Status */}
            <ProStatusBadge />
            
            {/* Botão de Upgrade para Pro */}
            {!isPro && (
              <button
                onClick={() => {
                  // Navegar para página de subscrição usando a função do App
                  if (onNavigateToProSubscription) {
                    onNavigateToProSubscription()
                  }
                }}
                className="btn-primary flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="hidden sm:inline">{t('pro.upgradeCta')}</span>
              </button>
            )}
            
            <div className="relative">
              <button
                disabled
                className="btn-secondary flex items-center gap-2 opacity-50 cursor-not-allowed"
                title={t('common.soon.unavailableTooltip')}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="hidden sm:inline">{t('common.import')}</span>
              </button>
              
              {/* Badge de "Em breve" */}
              <div className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-1.5 py-0.5 rounded-full font-medium">
                {t('common.comingSoon')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="card">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent-blue">{stats.totalRiders}</div>
              <div className="text-sm text-gray-400">{t('riders.stats.saved')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent-green">{stats.totalSize}MB</div>
              <div className="text-sm text-gray-400">{t('riders.stats.storage')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stats.maxRiders}</div>
              <div className="text-sm text-gray-400">{t('riders.stats.ridersLimit')}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">{stats.maxStorage}</div>
              <div className="text-sm text-gray-400">{t('riders.stats.storageLimit')}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Aviso de Limite de Riders */}
      {!isPro && savedRiders.length >= FREE_LIMITS.maxRiders && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-500 mb-1">
                  {t('riders.limit.title')}
                </h3>
                <p className="text-gray-300 mb-3">
                  {t('riders.limit.description', { max: FREE_LIMITS.maxRiders })}
                </p>
                <button
                  onClick={onNavigateToProSubscription}
                  className="bg-gradient-to-r from-accent-green to-accent-blue text-white font-semibold px-6 py-2 rounded-lg hover:from-accent-green/90 hover:to-accent-blue/90 transition-all duration-200"
                >
                  <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('pro.upgradeCtaWithPrice')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Riders Grid */}
      <div className="max-w-7xl mx-auto">
        {savedRiders.length === 0 ? (
          <div className="card text-center py-12">
            <div className="w-16 h-16 bg-dark-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-100 mb-2">{t('riders.empty.title')}</h3>
            <p className="text-gray-400 mb-6">{t('riders.empty.subtitle')}</p>
            <button
              onClick={onBack}
              className="btn-primary"
            >
              {t('riders.empty.cta')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {savedRiders.map((rider, index) => (
              <div 
                key={rider.id} 
                className="card-hover group animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Thumbnail */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-3">
                    {rider.data?.['dados-gerais']?.imagemCapa?.data ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={rider.data['dados-gerais'].imagemCapa.data}
                          alt={t('riders.card.coverAlt')}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-br from-accent-blue to-accent-green rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-sm">RF</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-100 truncate">{rider.name}</h3>
                      <p className="text-sm text-gray-400">{formatDate(rider.updatedAt)}</p>
                    </div>
                  </div>
                  
                                  {/* Rider Info */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">{t('riders.card.artist')}:</span>
                    <span className="text-gray-200 font-medium">{rider.thumbnail?.artista || t('riders.card.noArtist')}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">{t('riders.card.lastChange')}:</span>
                    <span className="text-gray-200 font-medium">{formatDate(rider.updatedAt)}</span>
                  </div>
                </div>
                </div>



                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onEditRider(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span className="hidden sm:inline">{t('common.edit')}</span>
                  </button>
                  
                  <button
                    onClick={() => handleExport(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="hidden sm:inline">{t('common.export')}</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2H8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span className="hidden sm:inline">{t('common.duplicate')}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(rider.id)}
                    className="btn-action text-sm py-3 flex items-center justify-center gap-2 text-red-400 hover:text-red-300"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    <span className="hidden sm:inline">{t('common.delete')}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!showDeleteConfirm} onClose={() => setShowDeleteConfirm(null)}>
        <div className="bg-dark-800 rounded-lg shadow-xl max-w-md w-full border border-dark-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {t('riders.delete.title')}
            </h3>
            <p className="text-gray-400 mb-6">
              {t('riders.delete.description')}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                {t('common.delete')}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 btn-secondary"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Import Modal */}
      <Modal isOpen={showImportModal} onClose={() => {
        setShowImportModal(false)
        setImportError('')
        setImportSuccess('')
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      }}>
        <div className="bg-dark-800 rounded-lg shadow-xl max-w-md w-full border border-dark-700">
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">
              {t('riders.import.title')}
            </h3>
            
            {importError && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg text-red-300 text-sm">
                {importError}
              </div>
            )}
            
            {importSuccess && (
              <div className="mb-4 p-3 bg-green-900/50 border border-green-700 rounded-lg text-green-300 text-sm">
                {importSuccess}
              </div>
            )}
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('riders.import.selectJson')}
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImport}
                className="w-full p-3 border border-dark-600 rounded-lg bg-dark-700 text-gray-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-accent-blue file:text-white hover:file:bg-accent-blue/80"
              />
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowImportModal(false)
                  setImportError('')
                  setImportSuccess('')
                  if (fileInputRef.current) {
                    fileInputRef.current.value = ''
                  }
                }}
                className="flex-1 btn-secondary"
              >
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal 
        isOpen={showUpgradeModal} 
        onClose={closeUpgradeModal}
        feature={currentFeature}
        onNavigateToSubscription={() => {
          window.location.href = '/pro-subscription'
        }}
      />

      {/* Save Progress Modal */}
      <SaveProgressModal
        isOpen={showSaveProgressModal}
        onClose={closeSaveProgressModal}
        onSave={async () => {
          // Lógica para salvar progresso (aqui seria salvar o rider atual)
          showSuccess(t('riders.progress.saved'))
          return true
        }}
        onContinueWithoutSaving={() => {
          executePendingProAction()
        }}
        featureName={currentFeature?.title || t('pro.feature')}
      />

      {/* PDF Export Modal */}
      <NewPDFExport
        isOpen={showNewPDFModal}
        onClose={() => setShowNewPDFModal(false)}
        riderName={exportRiderPayload.name}
        riderData={exportRiderPayload.data}
        shareLink={shareLink}
      />
    </div>
  )
}

export default MyRiders
