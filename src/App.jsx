import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Dashboard from './components/dashboard/Dashboard'
import ErrorBoundary from './components/ErrorBoundary'

// Componente principal da aplicação
const App = () => {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
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
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App
