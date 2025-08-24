function ProUpgradeModal({ isOpen, onClose, feature }) {

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
                // Aqui seria a lógica para upgrade
                alert('Upgrade em breve!')
                onClose()
              }}
              className="flex-1 btn-primary"
            >
              Upgrade para Pro
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProUpgradeModal

