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
import { GlobalFeedbackProvider } from './context/GlobalFeedbackContext'
import AppRoutes from './routes/AppRoutes'
import UpdateNotice from './components/UpdateNotice'

// Componente principal que usa o router
function AppContent() {
  return (
    <div className="App">
      <AppRoutes />
      
      {/* Update Notice */}
      <UpdateNotice />
      
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
          <GlobalFeedbackProvider>
            <EquipmentProvider>
              <UnitsProvider>
                <RiderProvider>
                  <StagePlotProvider>
                    <AppContent />
                  </StagePlotProvider>
                </RiderProvider>
              </UnitsProvider>
            </EquipmentProvider>
          </GlobalFeedbackProvider>
        </I18nProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
