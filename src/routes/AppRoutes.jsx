import React from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { useProgressiveLoading } from '../hooks/useProgressiveLoading'

// Importar componentes diretamente para performance máxima
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
import ProgressiveLoadingTest from '../components/ProgressiveLoadingTest'
import UpdateNoticeTest from '../components/UpdateNoticeTest'
import BugReportButton from '../components/BugReportButton'
import KeyboardNavigation from '../components/KeyboardNavigation'
import ScrollToTop from '../components/ScrollToTop'
import SharedRiderViewer from '../components/SharedRiderViewer'
import TechnicalRiderEN from '../components/landing/TechnicalRiderEN'
import TechnicalRiderPT from '../components/landing/TechnicalRiderPT'
import StagePlotCreator from '../components/StagePlotCreator'

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

// Componente para verificar autenticação com progressive loading
function ProtectedRoute({ children, requireAuth = false }) {
  const { canShowContent, canShowAuthUI, user, hasAccount } = useProgressiveLoading()
  
  // Show content immediately if not requiring auth
  if (!requireAuth) {
    return children
  }
  
  // Show loading only if we can't show content yet
  if (!canShowContent) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  // If auth UI is not ready yet, show a minimal loading state
  if (!canShowAuthUI) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400 text-sm">Verificando autenticação...</p>
        </div>
      </div>
    )
  }
  
  // Check authentication requirements
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
        <Route path="/en" element={<HomePage />} />
        <Route path="/en/" element={<HomePage />} />
        <Route path="/pt" element={<HomePage />} />
        <Route path="/pt/" element={<HomePage />} />
        
        {/* Riders Dashboard - requer autenticação */}
        <Route 
          path="/riders" 
          element={
            <ProtectedRoute requireAuth={true}>
              <MyRiders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pt/riders" 
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
        <Route 
          path="/pt/riders/:riderId" 
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
        <Route 
          path="/pt/riders/new" 
          element={<NewRiderRedirect />} 
        />
        {/* New Rider com tab específico - público (sem autenticação) */}
        <Route 
          path="/riders/new/:tab" 
          element={<RiderForm />} 
        />
        <Route 
          path="/pt/riders/new/:tab" 
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
        <Route 
          path="/pt/riders/:riderId/:tab" 
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
        <Route 
          path="/pt/riders/:riderId/pdf" 
          element={
            <ProtectedRoute requireAuth={true}>
              <PDFPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Stage Plot Creator - público (sem autenticação) */}
        <Route path="/stage-plot-creator" element={<StagePlotCreator />} />
        <Route path="/pt/stage-plot-creator" element={<StagePlotCreator />} />

        {/* Pricing */}
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/pt/pricing" element={<PricingPage />} />

        {/* Landing Pages - Technical Rider */}
        <Route path="/technical-rider" element={<TechnicalRiderEN />} />
        <Route path="/pt/rider-tecnico" element={<TechnicalRiderPT />} />
        
        {/* Pro Subscription */}
        <Route path="/pro-subscription" element={<ProSubscriptionPage />} />
        <Route path="/pt/pro-subscription" element={<ProSubscriptionPage />} />
        
        {/* Subscription Management - requer autenticação */}
        <Route 
          path="/subscription-management" 
          element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/pt/subscription-management" 
          element={
            <ProtectedRoute requireAuth={true}>
              <SubscriptionManagementPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Support */}
        <Route path="/support" element={<SupportPage />} />
        <Route path="/pt/support" element={<SupportPage />} />
        
        {/* Terms & Privacy */}
        <Route path="/terms-privacy" element={<PrivacyTermsPage />} />
        <Route path="/pt/terms-privacy" element={<PrivacyTermsPage />} />
        
        {/* FAQ */}
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/pt/faq" element={<FAQPage />} />
        
        {/* Progressive Loading Test */}
        <Route path="/progressive-test" element={<ProgressiveLoadingTest />} />
        
        {/* Update Notice Test */}
        <Route path="/update-test" element={<UpdateNoticeTest />} />
        
        {/* Short Links - Links curtos para partilha */}
        <Route path="/s/:shortId" element={<SharedRiderViewer />} />
        
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
