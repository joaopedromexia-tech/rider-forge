import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'

import { I18nProvider } from './context/I18nContext'
import { EquipmentProvider } from './context/EquipmentContext'
import { UnitsProvider } from './context/UnitsContext'
import { RiderProvider } from './context/RiderContext'
import { StagePlotProvider } from './context/StagePlotContext'
import { AuthProvider } from './context/AuthContext'
import AppRoutes from './routes/AppRoutes'

// Componente principal que usa o router
function AppContent() {
  return (
    <div className="App">
      <AppRoutes />
      
      {/* Vercel Analytics */}
      <Analytics />
      
      {/* Vercel Speed Insights */}
      <SpeedInsights />
    </div>
  )
}

// Componente principal que envolve tudo com os providers
function App() {
  return (
    <Router>
      <AuthProvider>
        <I18nProvider defaultLocale="en">
          <EquipmentProvider>
            <UnitsProvider>
              <RiderProvider>
                <StagePlotProvider>
                  <AppContent />
                </StagePlotProvider>
              </RiderProvider>
            </UnitsProvider>
          </EquipmentProvider>
        </I18nProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
