import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { I18nProvider } from './context/I18nContext'
import { RiderProvider } from './context/RiderContext'
import Dashboard from './components/dashboard/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'

// Componente principal da aplicação
const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <I18nProvider>
            <RiderProvider>
              <div className="App">
                <Routes>
                  {/* Rota principal - redireciona para dashboard */}
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  
                  {/* Dashboard */}
                  <Route path="/dashboard" element={<Dashboard />} />
                  
                  {/* Rota 404 */}
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </div>
            </RiderProvider>
          </I18nProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
