import { useState, useEffect } from 'react'
import { useRider } from '../context/RiderContext'
import { useI18n } from '../context/I18nContext'
import Modal from './Modal'

function SaveRiderModal({ isOpen, riderData, onSave, onClose }) {
  const { saveRider, updateRider, savedRiders, canSaveMoreRiders, canSaveBySize, FREE_LIMITS } = useRider()
  const { t, locale } = useI18n()
  const [riderName, setRiderName] = useState('')
  const [selectedRiderId, setSelectedRiderId] = useState('')
  const [saveMode, setSaveMode] = useState('new') // 'new' or 'overwrite'
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setRiderName('')
      setSelectedRiderId('')
      setSaveMode('new')
      setError('')
    }
  }, [isOpen])

  const handleSave = async () => {
    if (saveMode === 'new' && !riderName.trim()) {
      setError(t('saveModal.error.nameRequired'))
      return
    }

    if (saveMode === 'overwrite' && !selectedRiderId) {
      setError(t('saveModal.error.selectRider'))
      return
    }

    // Verificar limites apenas para novos riders
    if (saveMode === 'new') {
      if (!canSaveMoreRiders()) {
        setError(t('saveModal.error.freeLimitRiders', { max: FREE_LIMITS.maxRiders }))
        return
      }

      if (!canSaveBySize(riderData)) {
        setError(t('saveModal.error.freeLimitStorage', { max: FREE_LIMITS.maxStorageMB }))
        return
      }
    }

    setIsSaving(true)
    setError('')

    try {
      const payload = saveMode === 'new'
        ? { mode: 'new', riderName: riderName.trim() }
        : { mode: 'overwrite', riderId: selectedRiderId }

      onSave(payload)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isSaving) {
      handleSave()
    }
  }

  if (!isOpen) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-dark-800 rounded-lg shadow-xl max-w-md w-full border border-dark-700">
        {/* Header */}
        <div className="p-6 border-b border-dark-700">
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            {saveMode === 'new' ? t('saveModal.title.new') : t('saveModal.title.overwrite')}
          </h2>
          <p className="text-gray-400 text-sm">
            {saveMode === 'new' ? t('saveModal.subtitle.new') : t('saveModal.subtitle.overwrite')}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Modo de Salvamento */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              {t('saveModal.mode.label')}
            </label>
            <div className="space-y-2">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="saveMode"
                  value="new"
                  checked={saveMode === 'new'}
                  onChange={(e) => setSaveMode(e.target.value)}
                  className="mr-3 text-accent-blue focus:ring-accent-blue"
                />
                <span className="text-gray-200">{t('saveModal.mode.new')}</span>
              </label>
              {savedRiders.length > 0 && (
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="saveMode"
                    value="overwrite"
                    checked={saveMode === 'overwrite'}
                    onChange={(e) => setSaveMode(e.target.value)}
                    className="mr-3 text-accent-blue focus:ring-accent-blue"
                  />
                  <span className="text-gray-200">{t('saveModal.mode.overwrite')}</span>
                </label>
              )}
            </div>
          </div>

          {/* Nome do Rider - apenas para novos */}
          {saveMode === 'new' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('saveModal.riderName')} *
              </label>
              <input
                type="text"
                value={riderName}
                onChange={(e) => setRiderName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('saveModal.riderName.placeholder')}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                autoFocus
              />
            </div>
          )}

          {/* Seleção de Rider para Overwrite */}
          {saveMode === 'overwrite' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                {t('saveModal.selectToOverwrite')} *
              </label>
              <select
                value={selectedRiderId}
                onChange={(e) => setSelectedRiderId(e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                autoFocus
              >
                <option value="">{t('saveModal.selectPlaceholder')}</option>
                {savedRiders.map((rider) => (
                  <option key={rider.id} value={rider.id}>
                    {rider.name} ({new Date(rider.updatedAt).toLocaleDateString(locale)})
                  </option>
                ))}
              </select>
              {selectedRiderId && (
                <p className="mt-2 text-xs text-yellow-400">
                  ⚠️ {t('saveModal.warningOverwrite')}
                </p>
              )}
            </div>
          )}

          {/* Informações de Limite - apenas para novos riders */}
          {saveMode === 'new' && (
            <div className="bg-dark-700 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {t('saveModal.storage.title')}
              </div>
              <div className="space-y-1 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>{t('saveModal.storage.riderLimit')}:</span>
                  <span className={canSaveMoreRiders() ? 'text-green-400' : 'text-red-400'}>
                    {canSaveMoreRiders() ? t('common.available') : t('common.limitReached')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>{t('saveModal.storage.storageLimit')}:</span>
                  <span className={canSaveBySize(riderData) ? 'text-green-400' : 'text-red-400'}>
                    {canSaveBySize(riderData) ? t('common.available') : t('common.limitReached')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <svg className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-sm text-red-300">{error}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-dark-700 flex gap-3">
          <button
            onClick={onClose}
            disabled={isSaving}
            className="flex-1 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || (saveMode === 'new' && !riderName.trim()) || (saveMode === 'overwrite' && !selectedRiderId)}
            className="flex-1 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSaving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {saveMode === 'new' ? t('common.saving') : t('common.replacing')}
              </>
            ) : (
              saveMode === 'new' ? t('saveModal.cta.saveNew') : t('saveModal.cta.overwrite')
            )}
          </button>
        </div>
      </div>
    </Modal>
  )
}

export default SaveRiderModal
