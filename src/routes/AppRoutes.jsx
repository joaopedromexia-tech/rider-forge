import React from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useI18n } from '../context/I18nContext'

// Importar componentes existentes
import HomePage from '../components/HomePage'
import MyRiders from '../components/MyRiders'
import RiderForm from '../components/RiderForm'
import PDFPage from '../components/PDFPage'
import ProSubscriptionPage from '../components/ProSubscriptionPage'
import PricingPage from '../components/pricing/PricingPage'
import SubscriptionManagementPage from '../components/subscription/SubscriptionManagementPage'
import FAQPage from '../components/legal/FAQPage'
import PrivacyTermsPage from '../components/legal/PrivacyTermsPage'
import SupportPage from '../components/legal/SupportPage'
import BugReportButton from '../components/BugReportButton'
import KeyboardNavigation from '../components/KeyboardNavigation'
import ScrollToTop from '../components/ScrollToTop'

// Componente para redirecionar /riders/:id para o último tab visitado
function RiderRedirect() {
  const { riderId } = useParams()
  // Ler último tab visitado do localStorage
  let lastTab = 'dados-gerais'
  try {
    const stored = localStorage.getItem(`riderForge_lastTab_${riderId}`)
    if (stored) lastTab = stored
  } catch {}
  return <Navigate to={`/riders/${riderId}/${lastTab}`} replace />
}

// Componente para redirecionar /riders/new para o primeiro tab
function NewRiderRedirect() {
  return <Navigate to="/riders/new/dados-gerais" replace />
}

// Componente para verificar autenticação
function ProtectedRoute({ children, requireAuth = false }) {
  const { user, hasAccount, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (requireAuth && (!user || !hasAccount)) {
    // Redirecionar para home se não autenticado
    return <Navigate to="/" replace />
  }
  
  return children
}

function AppRoutes() {
  return (
    <>
      {/* Componente para fazer scroll para o topo em mudanças de rota */}
      <ScrollToTop />
      
      <Routes>
        {/* Home */}
        <Route path="/" element={<HomePage />} />
        
        {/* Riders Dashboard - requer autenticação */}
        <Route 
          path="/riders" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MyRiders />
            </ProtectedRoute>
          } 
        />
        
        {/* Rider Editor - requer autenticação */}
        <Route 
          path="/riders/:riderId" 
          element={
            <ProtectedRoute requireAuth={true}>
              <RiderRedirect />
            </ProtectedRoute>
          } 
        />
        
        {/* New Rider - público (sem autenticação) */}
        <Route 
          path="/riders/new" 
          element={<NewRiderRedirect />} 
        />
        {/* New Rider com tab específico - público (sem autenticação) */}
        <Route 
          path="/riders/new/:tab" 
          element={<RiderForm />} 
        />
        
        {/* Rider Editor com tab específico - requer autenticação */}
        <Route 
          path="/riders/:riderId/:tab" 
          element={
            <ProtectedRoute requireAuth={true}>
              <RiderForm />
            </ProtectedRoute>
          } 
        />
        
        {/* PDF Preview - requer autenticação */}
        <Route 
          path="/riders/:riderId/pdf" 
          element={
            <ProtectedRoute requireAuth={true}>
              <PDFPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Pricing */}
        <Route path="/pricing" element={<PricingPage />} />
        
        {/* Pro Subscription */}
        <Route path="/pro-subscription" element={<ProSubscriptionPage />} />
        
        {/* Subscription Management - requer autenticação */}
        <Route 
          path="/subscription-management" 
          element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionManagementPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Support */}
        <Route path="/support" element={<SupportPage />} />
        
        {/* Terms & Privacy */}
        <Route path="/terms-privacy" element={<PrivacyTermsPage />} />
        
        {/* FAQ */}
        <Route path="/faq" element={<FAQPage />} />
        
        {/* 404 - redirecionar para home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      
      {/* Bug Report Button - Floating */}
      <BugReportButton 
        position="bottom-right"
        showLabel={false}
      />
      
      {/* Keyboard Navigation */}
      <KeyboardNavigation />
    </>
  )
}

export default AppRoutes
