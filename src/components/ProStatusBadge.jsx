import { useRider } from '../context/RiderContext'

function ProStatusBadge({ className = '', variant = 'status' }) {
  const { isPro } = useRider()

  // Variante para selo Pro em opções bloqueadas
  if (variant === 'lock') {
    return (
      <div className={`inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-accent-green to-accent-blue rounded-full text-white text-xs font-medium shadow-sm ${className}`}>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <span>PRO</span>
      </div>
    )
  }

  // Variante padrão para status do usuário
  if (!isPro) return null

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-accent-green to-accent-blue rounded-full text-white text-sm font-medium shadow-lg ${className}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>PRO</span>
    </div>
  )
}

export default ProStatusBadge

