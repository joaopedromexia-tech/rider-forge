import Modal from './Modal'
import { useRider } from '../context/RiderContext'
import { PRO_CONFIG } from '../config/proConfig'

function ProUpgradeModal({ isOpen, onClose, feature, onNavigateToSubscription }) {
  const { savedRiders } = useRider()

  if (!isOpen) return null

  // Verificar se é o limite de riders
  const isRiderLimit = feature?.id === 'unlimited_riders'
  const currentRiderCount = savedRiders.length
  const maxRiders = PRO_CONFIG.FREE_LIMITS.maxRiders

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gradient mb-2">Rider Forge Pro</h3>
            <p className="text-gray-400">Esta função está disponível no Rider Forge Pro</p>
          </div>

          {/* Feature Info */}
          {feature && (
            <div className="mb-6 p-4 bg-dark-800/50 rounded-lg border border-dark-700">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-accent-blue/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-accent-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-100">{feature.title}</h4>
                  <p className="text-sm text-gray-400">{feature.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Limite de Riders Específico */}
          {isRiderLimit && (
            <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <h5 className="font-semibold text-yellow-300 mb-1">Limite de Riders Atingido</h5>
                  <p className="text-sm text-yellow-200">
                    Você já tem {currentRiderCount} riders salvos. Contas gratuitas podem salvar até {maxRiders} riders. 
                    Faça upgrade para Pro para salvar riders ilimitados.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pro Features List */}
          <div className="mb-6 space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 bg-accent-green/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">Riders ilimitados</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 bg-accent-green/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">Biblioteca completa de equipamentos</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 bg-accent-green/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">PDF customizável</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-5 h-5 bg-accent-green/20 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">Histórico de versões</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 btn-secondary"
            >
              Continuar Free
            </button>
            <button
              onClick={() => {
                onClose()
                if (onNavigateToSubscription) {
                  onNavigateToSubscription()
                }
              }}
              className="flex-1 btn-primary flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Upgrade para Pro
            </button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ProUpgradeModal

