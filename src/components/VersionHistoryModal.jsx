import React, { useState, useEffect } from 'react'
import { useI18n } from '../context/I18nContext'
import { getRiderVersions } from '../utils/storage'
import { useFeedback } from '../hooks/useFeedback'

const VersionHistoryModal = ({ isOpen, onClose, riderId, onRestoreVersion, currentData }) => {
  const { t, locale } = useI18n()
  const { showSuccess, showError } = useFeedback()
  const [versions, setVersions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false)
  const [comparingVersions, setComparingVersions] = useState(false)
  const [compareWith, setCompareWith] = useState(null)

  // Carregar versões quando o modal abrir
  useEffect(() => {
    if (isOpen && riderId) {
      loadVersions()
    }
  }, [isOpen, riderId])

  const loadVersions = async () => {
    setLoading(true)
    try {
      const riderVersions = await getRiderVersions(riderId)
      setVersions(riderVersions)
    } catch (error) {
      console.error('Erro ao carregar versões:', error)
      showError(t('versionHistory.loadError'))
    } finally {
      setLoading(false)
    }
  }

  const handleRestoreVersion = (version) => {
    setSelectedVersion(version)
    setShowRestoreConfirm(true)
  }

  const confirmRestore = () => {
    if (selectedVersion && onRestoreVersion) {
      onRestoreVersion(selectedVersion.data)
      showSuccess(t('versionHistory.restoreSuccess'))
      setShowRestoreConfirm(false)
      setSelectedVersion(null)
      onClose()
    }
  }

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getVersionSummary = (data) => {
    const dadosGerais = data['dados-gerais'] || {}
    return {
      artista: dadosGerais.artista || 'Sem artista',
      versao: dadosGerais.versaoRider || 'N/A',
      ano: dadosGerais.anoTour || 'N/A',
      sections: Object.keys(data).length
    }
  }

  const compareVersions = (version1, version2) => {
    if (!version1 || !version2) return null

    const changes = []
    const allKeys = new Set([...Object.keys(version1), ...Object.keys(version2)])

    allKeys.forEach(key => {
      const v1Data = version1[key] || {}
      const v2Data = version2[key] || {}

      if (JSON.stringify(v1Data) !== JSON.stringify(v2Data)) {
        changes.push({
          section: key,
          hasChanges: true
        })
      }
    })

    return changes
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{t('versionHistory.title')}</h2>
              <p className="text-blue-100 mt-1">{t('versionHistory.viewAndRestore')}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-blue-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">{t('versionHistory.loading')}</span>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">{t('versionHistory.noVersions')}</h3>
              <p className="text-gray-500">{t('versionHistory.versionsWillBeCreated')}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Current Version */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-green-800">{t('versionHistory.currentVersion')}</h3>
                    <p className="text-sm text-green-600">{t('versionHistory.lastModified')} {formatDate(new Date().toISOString())}</p>
                  </div>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {t('versionHistory.current')}
                  </span>
                </div>
              </div>

              {/* Version List */}
              <div className="space-y-3">
                {versions.map((version, index) => {
                  const summary = getVersionSummary(version.data)
                  const isLatest = index === 0
                  
                  return (
                    <div
                      key={version.key}
                      className={`border rounded-lg p-4 transition-all hover:shadow-md ${
                        isLatest ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-semibold text-gray-800">
                              {summary.artista} v{summary.versao} {summary.ano}
                            </h4>
                            {isLatest && (
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                                {t('versionHistory.latest')}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(version.timestamp)} • {summary.sections} {t('versionHistory.sections')}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setCompareWith(version)
                              setComparingVersions(true)
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            {t('versionHistory.compare')}
                          </button>
                          
                          {!isLatest && (
                            <button
                              onClick={() => handleRestoreVersion(version)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            >
                              {t('versionHistory.restore')}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {versions.length} {locale === 'pt' ? `versão${versions.length !== 1 ? 'ões' : ''} encontrada${versions.length !== 1 ? 's' : ''}` : `version${versions.length !== 1 ? 's' : ''} found`}
            </p>
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
            >
              {t('versionHistory.close')}
            </button>
          </div>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {showRestoreConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center">
              <svg className="w-12 h-12 text-yellow-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('versionHistory.confirmRestore')}</h3>
              <p className="text-gray-600 mb-6">
                {t('versionHistory.confirmRestoreMessage')}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowRestoreConfirm(false)}
                  className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {t('versionHistory.cancel')}
                </button>
                <button
                  onClick={confirmRestore}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('versionHistory.restore')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Comparison Modal */}
      {comparingVersions && compareWith && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white p-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold">{t('versionHistory.versionComparison')}</h3>
                <button
                  onClick={() => {
                    setComparingVersions(false)
                    setCompareWith(null)
                  }}
                  className="text-white hover:text-purple-100 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <VersionComparison 
                currentVersion={currentData}
                previousVersion={compareWith.data}
                onClose={() => {
                  setComparingVersions(false)
                  setCompareWith(null)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Componente para comparação de versões
const VersionComparison = ({ currentVersion, previousVersion, onClose }) => {
  const { t, locale } = useI18n()

  const getSectionChanges = () => {
    const changes = []
    const allSections = new Set([
      ...Object.keys(currentVersion || {}),
      ...Object.keys(previousVersion || {})
    ])

    allSections.forEach(section => {
      const current = currentVersion?.[section] || {}
      const previous = previousVersion?.[section] || {}
      
      if (JSON.stringify(current) !== JSON.stringify(previous)) {
        changes.push({
          section,
          hasChanges: true,
          current,
          previous
        })
      }
    })

    return changes
  }

  const formatSectionName = (section) => {
    const names = {
      'dados-gerais': 'Dados Gerais',
      'pa': 'PA',
      'consolas': 'Consolas',
      'sistemas-escuta': 'Sistemas de Escuta',
      'equipamento-auxiliar': 'Equipamento Auxiliar',
      'input-list': 'Input List',
      'monitor-mixes': 'Monitor Mixes',
      'observacoes-finais': 'Observações Finais'
    }
    return names[section] || section
  }

  const changes = getSectionChanges()

  return (
    <div>
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 mb-2">{t('versionHistory.changesSummary')}</h4>
        <p className="text-gray-600">
          {changes.length} {locale === 'pt' ? `seção${changes.length !== 1 ? 'ões' : ''} foram modificada${changes.length !== 1 ? 's' : ''}` : `section${changes.length !== 1 ? 's' : ''} were modified`}
        </p>
      </div>

      {changes.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-gray-500">{t('versionHistory.noChanges')}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {changes.map((change, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3">
                {formatSectionName(change.section)}
              </h5>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                <p className="text-sm text-yellow-800">
                  {t('versionHistory.sectionChanged')}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          {t('versionHistory.close')}
        </button>
      </div>
    </div>
  )
}

export default VersionHistoryModal
