import { useState } from 'react'
import { I18nProvider } from './context/I18nContext'
import { EquipmentProvider } from './context/EquipmentContext'
import { UnitsProvider } from './context/UnitsContext'
import { RiderProvider } from './context/RiderContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import RiderForm from './components/RiderForm'
import MyRiders from './components/MyRiders'
import PDFPreview from './components/PDFPreview'
import DemoButton from './components/DemoButton'
import LoginModal from './components/auth/LoginModal'

// Componente interno que usa o contexto de autenticação
function AppContent() {
  const [currentView, setCurrentView] = useState('home')
  const [editingRiderId, setEditingRiderId] = useState(null)
  const [showLoginModal, setShowLoginModal] = useState(false)
  
  const { user, hasAccount, loading: authLoading } = useAuth()

  const handleNavigateToForm = (riderId = null) => {
    setEditingRiderId(riderId)
    setCurrentView('form')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setEditingRiderId(null)
  }

  const handleNavigateToMyRiders = () => {
    // Verificar se o utilizador tem conta criada
    if (!user) {
      setShowLoginModal(true)
      return
    }
    
    if (!hasAccount) {
      setShowLoginModal(true)
      return
    }
    
    setCurrentView('riders')
  }

  const handleNavigateToPreview = (riderId) => {
    setEditingRiderId(riderId)
    setCurrentView('preview')
  }

  // Se ainda está a carregar, mostrar loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="App">
      {currentView === 'home' && (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-4">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center py-12 mb-8">
              <h1 className="text-5xl sm:text-7xl font-bold text-gradient mb-6">
                Rider Forge
              </h1>
              <p className="text-xl sm:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Crie riders técnicos profissionais com facilidade e precisão
              </p>
            </div>
            
            {/* Main Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
              {/* Criar Novo Rider */}
              <div className="card hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-accent-blue/20">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-accent-blue to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">Criar Novo Rider</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Comece do zero e crie um rider técnico personalizado para o seu evento
                  </p>
                  <button
                    onClick={() => handleNavigateToForm()}
                    className="btn-primary w-full text-lg py-4"
                  >
                    <span>Começar Agora</span>
                  </button>
                </div>
              </div>

              {/* Os Meus Riders */}
              <div className={`card transition-all duration-300 ${
                user && hasAccount 
                  ? 'hover:scale-105 hover:shadow-2xl hover:shadow-accent-green/20' 
                  : 'opacity-80 cursor-pointer hover:scale-102 hover:shadow-xl hover:shadow-yellow-500/10'
              }`}>
                <div className="text-center p-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg ${
                    user && hasAccount 
                      ? 'bg-gradient-to-r from-accent-green to-green-500' 
                      : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                  }`}>
                    {user && hasAccount ? (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    ) : (
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">Dashboard</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    {user && hasAccount 
                      ? 'Aceda ao seu dashboard para gerir riders e ver estatísticas'
                      : 'Guarde e organize todos os seus riders numa conta gratuita'
                    }
                  </p>
                  {user && hasAccount ? (
                    <button
                      onClick={handleNavigateToMyRiders}
                      className="w-full text-lg py-4 btn-secondary"
                    >
                      <span>Abrir Dashboard</span>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full text-lg py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
                      >
                        <span>🔑 Fazer Login</span>
                      </button>
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="w-full text-lg py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-semibold rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200"
                      >
                        <span>✨ Criar Conta Grátis</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Mensagem de incentivo */}
                  {(!user || !hasAccount) && (
                    <div className="mt-4 p-3 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                      <p className="text-sm text-yellow-200 font-medium">
                        ✨ Conta gratuita • Riders ilimitados • Sincronização automática
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Demo */}
              <div className="card hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="text-center p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-100 mb-4">Rider Demo</h3>
                  <p className="text-gray-400 mb-6 leading-relaxed">
                    Explore um exemplo completo de rider técnico profissional
                  </p>
                  <div className="w-full">
                    <DemoButton onNavigateToForm={handleNavigateToForm} />
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center text-gray-500 text-sm">
              <p>Ferramenta profissional para criação de riders técnicos</p>
            </div>
          </div>
        </div>
      )}
      
      {currentView === 'form' && (
        <RiderForm 
          onBack={handleBackToHome}
          editingRiderId={editingRiderId}
        />
      )}
      
      {currentView === 'riders' && (
        <MyRiders 
          onBack={handleBackToHome}
          onEditRider={handleNavigateToForm}
          onPreview={handleNavigateToPreview}
        />
      )}
      
      {currentView === 'preview' && (
        <PDFPreview 
          riderId={editingRiderId}
          onBack={() => setCurrentView('riders')}
        />
      )}

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </div>
  )
}

// Componente principal que envolve tudo com os providers
function App() {
  return (
    <AuthProvider>
      <I18nProvider>
        <EquipmentProvider>
          <UnitsProvider>
            <RiderProvider>
              <AppContent />
            </RiderProvider>
          </UnitsProvider>
        </EquipmentProvider>
      </I18nProvider>
    </AuthProvider>
  )
}

export default App
