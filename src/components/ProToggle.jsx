import { useState } from 'react'
import { useRider } from '../context/RiderContext'
import { useFeedback } from '../hooks/useFeedback'
import ProComparison from './ProComparison'

function ProToggle({ className = '', showFeedback = true }) {
  const { isPro, setIsPro } = useRider()
  const { showSuccess } = useFeedback()
  const [showComparison, setShowComparison] = useState(false)

  const handleToggle = (newProState) => {
    setIsPro(newProState)
    
    if (showFeedback) {
      if (newProState) {
        showSuccess('Modo Pro ativado! Acesso a funcionalidades premium.')
      } else {
        showSuccess('Modo Free ativado. Algumas funcionalidades estão limitadas.')
      }
    }
  }

  return (
    <>
      <div className={`flex items-center gap-2 bg-dark-800/80 backdrop-blur-sm rounded-xl p-1 border border-dark-700/50 ${className}`}>
        <button
          onClick={() => handleToggle(false)}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative
            ${!isPro 
              ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25' 
              : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
            }
          `}
          title="Modo Free - Limitações aplicadas"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            FREE
          </span>
          {!isPro && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-blue rounded-full animate-pulse"></div>
          )}
        </button>
        
        <button
          onClick={() => handleToggle(true)}
          className={`
            px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 relative
            ${isPro 
              ? 'bg-accent-green text-white shadow-lg shadow-accent-green/25' 
              : 'text-gray-400 hover:text-gray-200 hover:bg-dark-700/50'
            }
          `}
          title="Modo Pro - Funcionalidades ilimitadas"
        >
          <span className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            PRO
          </span>
          {isPro && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-accent-green rounded-full animate-pulse"></div>
          )}
        </button>

        {/* Botão de Comparação */}
        <button
          onClick={() => setShowComparison(true)}
          className="px-3 py-2 text-gray-400 hover:text-gray-200 hover:bg-dark-700/50 rounded-lg transition-all duration-300"
          title="Ver comparação de planos"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>

      {/* Modal de Comparação */}
      <ProComparison 
        isOpen={showComparison}
        onClose={() => setShowComparison(false)}
      />
    </>
  )
}

export default ProToggle
