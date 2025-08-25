import { useState } from 'react'
import { I18nProvider } from './context/I18nContext'
import { EquipmentProvider } from './context/EquipmentContext'
import { UnitsProvider } from './context/UnitsContext'
import { RiderProvider } from './context/RiderContext'
import RiderForm from './components/RiderForm'
import MyRiders from './components/MyRiders'
import PDFPreview from './components/PDFPreview'
import DemoButton from './components/DemoButton'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [editingRiderId, setEditingRiderId] = useState(null)

  const handleNavigateToForm = (riderId = null) => {
    setEditingRiderId(riderId)
    setCurrentView('form')
  }

  const handleBackToHome = () => {
    setCurrentView('home')
    setEditingRiderId(null)
  }

  const handleNavigateToMyRiders = () => {
    setCurrentView('riders')
  }

  const handleNavigateToPreview = (riderId) => {
    setEditingRiderId(riderId)
    setCurrentView('preview')
  }

  return (
    <I18nProvider>
      <EquipmentProvider>
        <UnitsProvider>
          <RiderProvider>
            <div className="App">
              {currentView === 'home' && (
                <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-6xl font-bold text-gradient mb-4">
                      Rider Forge
                    </h1>
                    <p className="text-xl text-gray-300 mb-12">
                      Crie riders técnicos profissionais com facilidade
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
                      <button
                        onClick={() => handleNavigateToForm()}
                        className="btn-primary text-lg py-4 px-6"
                      >
                        <span>📝 Criar Novo Rider</span>
                      </button>
                      
                      <button
                        onClick={handleNavigateToMyRiders}
                        className="btn-secondary text-lg py-4 px-6"
                      >
                        <span>📁 Os Meus Riders</span>
                      </button>
                      
                      <div className="flex justify-center">
                        <DemoButton onNavigateToForm={handleNavigateToForm} />
                      </div>
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
                  onEdit={handleNavigateToForm}
                  onPreview={handleNavigateToPreview}
                />
              )}
              
              {currentView === 'preview' && (
                <PDFPreview 
                  riderId={editingRiderId}
                  onBack={() => setCurrentView('riders')}
                />
              )}
            </div>
          </RiderProvider>
        </UnitsProvider>
      </EquipmentProvider>
    </I18nProvider>
  )
}

export default App
