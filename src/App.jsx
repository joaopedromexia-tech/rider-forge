import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { I18nProvider } from './context/I18nContext'
import { EquipmentProvider } from './context/EquipmentContext'
import { UnitsProvider } from './context/UnitsContext'
import { RiderProvider } from './context/RiderContext'
import Dashboard from './components/dashboard/Dashboard'
import PricingPage from './components/pricing/PricingPage'
import ErrorBoundary from './components/ErrorBoundary'
import { useAuth } from './context/AuthContext'

// Componente para rotas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/dashboard" replace />
}

// Componente principal da aplicação
const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <I18nProvider>
            <EquipmentProvider>
              <UnitsProvider>
                <RiderProvider>
                  <div className="App">
                    <Routes>
                      {/* Rota principal - redireciona para dashboard */}
                      <Route path="/" element={<Navigate to="/dashboard" replace />} />
                      
                      {/* Dashboard */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Pricing */}
                      <Route path="/pricing" element={<PricingPage />} />
                      
                      {/* Rota 404 */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </div>
                </RiderProvider>
              </UnitsProvider>
            </EquipmentProvider>
          </I18nProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
