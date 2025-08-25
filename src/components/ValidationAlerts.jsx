import { useState, useEffect } from 'react'

function ValidationAlerts({ errors, warnings, onClose }) {
  const [visibleErrors, setVisibleErrors] = useState([])
  const [visibleWarnings, setVisibleWarnings] = useState([])

  useEffect(() => {
    setVisibleErrors(errors || [])
    setVisibleWarnings(warnings || [])
  }, [errors, warnings])

  const removeError = (index) => {
    const newErrors = visibleErrors.filter((_, i) => i !== index)
    setVisibleErrors(newErrors)
    if (onClose) onClose('errors', newErrors)
  }

  const removeWarning = (index) => {
    const newWarnings = visibleWarnings.filter((_, i) => i !== index)
    setVisibleWarnings(newWarnings)
    if (onClose) onClose('warnings', newWarnings)
  }

  if ((!visibleErrors || visibleErrors.length === 0) && 
      (!visibleWarnings || visibleWarnings.length === 0)) {
    return null
  }

  return (
    <div className="space-y-3">
      {/* Erros */}
      {visibleErrors && visibleErrors.length > 0 && (
        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-400 mb-2">
                Erros de Validação ({visibleErrors.length})
              </h3>
              <div className="space-y-2">
                {visibleErrors.map((error, index) => (
                  <div key={index} className="flex items-start justify-between gap-2">
                    <p className="text-sm text-red-300">{error}</p>
                    <button
                      onClick={() => removeError(index)}
                      className="flex-shrink-0 text-red-400 hover:text-red-300 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Avisos */}
      {visibleWarnings && visibleWarnings.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-400 mb-2">
                Avisos ({visibleWarnings.length})
              </h3>
              <div className="space-y-2">
                {visibleWarnings.map((warning, index) => (
                  <div key={index} className="flex items-start justify-between gap-2">
                    <p className="text-sm text-yellow-300">{warning}</p>
                    <button
                      onClick={() => removeWarning(index)}
                      className="flex-shrink-0 text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ValidationAlerts

