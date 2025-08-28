import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useRider } from '../context/RiderContext'
import { useI18n } from '../context/I18nContext'
import { useAuth } from '../context/AuthContext'
import { useProFeatures } from '../hooks/useProFeatures'
import ProUpgradeModal from './ProUpgradeModal'
import NewPDFExport from './NewPDFExport'
import ProStatusBadge from './ProStatusBadge'
import LoginModal from './auth/LoginModal'
import Breadcrumbs from './Breadcrumbs'
import { pdf } from '@react-pdf/renderer'
import RiderPDF from '../pdf/RiderPDF'
import Modal from './Modal'

function PDFPage() {
  const navigate = useNavigate()
  const { riderId } = useParams()
  const { t, locale } = useI18n()
  const { user, hasAccount } = useAuth()
  const { getRiderByIdWithSync, forceSyncState } = useRider()
  const [rider, setRider] = useState(null)
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [showNewPDFModal, setShowNewPDFModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [exportRiderPayload, setExportRiderPayload] = useState({ name: '', data: {} })
  const [shareLink, setShareLink] = useState('')

  const {
    isPro,
    showUpgradeModal,
    currentFeature,
    closeUpgradeModal,
    useProFeature,
    PRO_FEATURES
  } = useProFeatures()

  // Carregar rider
  useEffect(() => {
    const loadRider = async () => {
      try {
        forceSyncState()
        const riderData = getRiderByIdWithSync(riderId)
        if (riderData) {
          setRider(riderData)
          generatePDF(riderData.data)
        } else {
          setError('Rider não encontrado')
        }
      } catch (err) {
        setError('Erro ao carregar rider')
      } finally {
        setIsLoading(false)
      }
    }

    if (riderId) {
      loadRider()
    }
  }, [riderId, getRiderByIdWithSync, forceSyncState])

  const generatePDF = async (riderData) => {
    try {
      setIsLoading(true)
      setError(null)

      // Ensure riderData is properly structured and sanitized
      const sanitizedRiderData = JSON.parse(JSON.stringify(riderData || {}))
      
      // Validate that we have at least some data
      if (!sanitizedRiderData || Object.keys(sanitizedRiderData).length === 0) {
        throw new Error(t('pdf.error.noData'))
      }
      
      const instance = pdf(
        <RiderPDF 
          rider={sanitizedRiderData} 
          language={locale} 
          proBranding={{}} 
          options={{}} 
        />
      )
      
      const blob = await instance.toBlob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
      
      // Calculate PDF information
      const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2)
      const estimated = locale === 'en' ? 'Estimated: 1–3 pages' : 'Estimado: 1–3 páginas'
      setPdfInfo({
        size: sizeInMB,
        pages: estimated,
        generatedAt: new Date().toLocaleTimeString(locale)
      })
    } catch (err) {
      setError(err.message || t('pdf.error.generate'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToRiders = () => {
    navigate('/riders')
  }

  const handleBackToEditor = () => {
    navigate(`/riders/${riderId}/dados-gerais`)
  }

  const handleExport = () => {
    if (!rider) return

    try {
      // Gerar link de partilha
      const riderData = JSON.stringify(rider.data)
      const shareUrl = `${window.location.origin}/rider/${rider.id}?data=${encodeURIComponent(riderData)}`
      setShareLink(shareUrl)
      setExportRiderPayload({ name: rider.name, data: rider.data })
      setShowNewPDFModal(true)
    } catch (error) {
      setError('Erro ao preparar exportação')
    }
  }

  const handleNavigateToProSubscription = () => {
    navigate('/pro-subscription')
  }

  // Cleanup PDF URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl)
      }
    }
  }, [pdfUrl])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
          <p className="text-gray-400">{t('pdf.preview.generating')}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-red-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-red-400 font-medium mb-2">{t('pdf.preview.errorTitle')}</div>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleBackToRiders}
                className="btn-secondary"
              >
                {t('common.back')}
              </button>
              <button
                onClick={() => generatePDF(rider?.data)}
                className="btn-primary"
              >
                {t('pdf.preview.tryAgain')}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-dark-950/95 backdrop-blur-md border-b border-dark-800/50">
          <div className="max-w-7xl mx-auto px-4 py-2">
            <Breadcrumbs />
          </div>
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Botão Voltar */}
              <div className="flex items-center justify-between lg:justify-start">
                <button
                  onClick={handleBackToEditor}
                  className="btn-secondary flex items-center gap-2 px-4 py-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  <span className="hidden sm:inline">{t('common.back')}</span>
                </button>
                
                {/* Badge de Status - visível apenas em mobile */}
                <div className="lg:hidden">
                  <ProStatusBadge />
                </div>
              </div>
              
              {/* Título */}
              <div className="flex flex-col items-center gap-3 flex-1">
                <h1 className="text-2xl lg:text-3xl font-bold text-gradient text-center">{t('pdf.preview.title')}</h1>
                {rider && (
                  <p className="text-gray-400 text-center">{rider.name}</p>
                )}
              </div>
              
              {/* Botões de Ação */}
              <div className="flex items-center gap-2 lg:gap-3">
                {/* Badge de Status - visível apenas em desktop */}
                <div className="hidden lg:block">
                  <ProStatusBadge />
                </div>
                
                {/* Botão de Upgrade para Pro */}
                {!isPro && (
                  <button
                    onClick={handleNavigateToProSubscription}
                    className="btn-primary flex items-center gap-2 px-3 py-2 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="hidden sm:inline">{t('common.upgradePro')}</span>
                  </button>
                )}
                
                {/* Export Button */}
                <button
                  onClick={handleExport}
                  className="btn-secondary flex items-center gap-2 px-3 py-2 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="hidden sm:inline">{t('common.export')}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PDF Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {pdfUrl && (
            <div className="bg-white rounded-lg overflow-hidden border border-dark-600 shadow-xl">
              <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-600">{t('pdf.preview.title')}</span>
                  {pdfInfo && (
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span>{t('pdf.preview.size')}: {pdfInfo.size} MB</span>
                      <span>•</span>
                      <span>{pdfInfo.pages}</span>
                      <span>•</span>
                      <span>{t('pdf.preview.generatedAt')}: {pdfInfo.generatedAt}</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.open(pdfUrl, '_blank')}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    title={t('pdf.preview.openNewTab')}
                  >
                    {t('pdf.preview.open')}
                  </button>
                </div>
              </div>
              <div className="h-[800px]">
                <iframe
                  src={pdfUrl}
                  className="w-full h-full"
                  title="PDF Preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PDF Export Modal */}
      <NewPDFExport
        isOpen={showNewPDFModal}
        onClose={() => setShowNewPDFModal(false)}
        riderName={exportRiderPayload.name}
        riderData={exportRiderPayload.data}
        shareLink={shareLink}
      />

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={closeUpgradeModal}
        feature={currentFeature}
        onNavigateToSubscription={handleNavigateToProSubscription}
      />

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </>
  )
}

export default PDFPage
