import { useState } from 'react'
import { useFeedback } from '../hooks/useFeedback'

function SaveProgressModal({ isOpen, onClose, onSave, onContinueWithoutSaving, featureName }) {
  const [isSaving, setIsSaving] = useState(false)
  const { showSuccess, showError } = useFeedback()

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onSave()
      showSuccess('Progresso guardado com sucesso!')
      onClose()
    } catch (error) {
      showError('Erro ao guardar progresso: ' + error.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleContinueWithoutSaving = () => {
    onContinueWithoutSaving()
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="card max-w-md w-full relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-blue/10 rounded-full blur-2xl"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-green/10 rounded-full blur-2xl"></div>
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-accent-blue to-accent-green rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gradient mb-2">Guardar Progresso?</h3>
            <p className="text-gray-400">
              Para aceder a <span className="text-accent-blue font-semibold">{featureName}</span>, 
              recomendamos guardar o seu progresso atual.
            </p>
          </div>

          {/* Warning */}
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-500">Atenção</h4>
                <p className="text-sm text-gray-300">
                  Se não guardar, poderá perder as alterações não guardadas.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  A guardar...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                  </svg>
                  Guardar e Continuar
                </>
              )}
            </button>
            
            <button
              onClick={handleContinueWithoutSaving}
              className="btn-secondary"
            >
              Continuar sem Guardar
            </button>
            
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-300 text-sm py-2"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SaveProgressModal
