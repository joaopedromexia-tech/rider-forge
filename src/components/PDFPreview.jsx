import React, { useEffect, useState, useCallback } from 'react'
import { pdf } from '@react-pdf/renderer'
import RiderPDF from '../pdf/RiderPDF'
import { useProFeatures } from '../hooks/useProFeatures'
import ProUpgradeModal from './ProUpgradeModal'
import { useI18n } from '../context/I18nContext'

function PDFPreview({ isOpen, onClose, riderData, riderName, exportOptions, onExport }) {
  const { t, locale } = useI18n()
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isRegenerating, setIsRegenerating] = useState(false)

  const {
    isPro,
    showUpgradeModal,
    currentFeature,
    closeUpgradeModal,
    useProFeature,
    PRO_FEATURES
  } = useProFeatures()

  // Gerar preview do PDF quando o modal abrir
  useEffect(() => {
    if (isOpen && riderData) {
      generatePreview()
    }
  }, [isOpen, riderData, exportOptions?.colorTheme, exportOptions?.includeStagePlot, exportOptions?.customFooter])

  // Cleanup PDF URL when modal closes
  useEffect(() => {
    if (!isOpen && pdfUrl) {
      URL.revokeObjectURL(pdfUrl)
      setPdfUrl(null)
    }
  }, [isOpen, pdfUrl])

  const generatePDFBlob = useCallback(async () => {
    try {
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
          options={exportOptions || {}} 
        />
      )
      
      const blob = await instance.toBlob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
      
      // Calcular informações do PDF
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
      setIsRegenerating(false)
    }
  }, [riderData, exportOptions, locale, t])

  const generatePreview = useCallback(async () => {
    if (pdfUrl) {
      setIsRegenerating(true)
    } else {
      setIsLoading(true)
    }
    setError(null)
    
    try {
      // Verificar se o tema selecionado requer Pro
      const colorThemes = [
        { value: 'default', label: 'Padrão', description: 'Tema clássico preto e branco' },
        { value: 'professional', label: 'Profissional', description: 'Azul e cinza elegante', pro: true },
        { value: 'modern', label: 'Moderno', description: 'Azul ciano contemporâneo', pro: true },
        { value: 'elegant', label: 'Elegante', description: 'Roxo e cinza sofisticado', pro: true },
        { value: 'dark', label: 'Escuro', description: 'Tema escuro para ecrãs', pro: true }
      ]
      
      const selectedTheme = colorThemes.find(theme => theme.value === exportOptions?.colorTheme)
      if (selectedTheme?.pro && !isPro) {
        // Para preview, vamos permitir mesmo sem Pro, mas com limitação
        generatePDFBlob()
      } else {
        generatePDFBlob()
      }
    } catch (err) {
      setError(err.message || t('pdf.error.generate'))
    }
  }, [pdfUrl, exportOptions, isPro, generatePDFBlob, t])

  const handleExport = () => {
    if (onExport) {
      onExport()
    }
    onClose()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-lg w-full max-w-6xl h-[90vh] flex flex-col border border-dark-700">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-dark-700">
            <div>
              <h3 className="text-xl font-bold text-gray-100">{t('pdf.preview.title')}</h3>
              <p className="text-gray-400 text-sm">
                {riderName || t('pdf.preview.fallbackName')} - {t('pdf.preview.subtitle')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={generatePreview}
                disabled={isLoading}
                className="px-3 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors duration-200 disabled:opacity-50"
                title={t('pdf.preview.regenerate')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors duration-200"
              >
                {t('pdf.preview.exportPdf')}
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-hidden">
            {isLoading && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-blue mx-auto mb-4"></div>
                  <p className="text-gray-400 mb-2">{t('pdf.preview.generating')}</p>
                  <p className="text-gray-500 text-sm">{t('pdf.preview.mayTakeAWhile')}</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-red-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div className="text-red-400 font-medium mb-2">{t('pdf.preview.errorTitle')}</div>
                  <p className="text-gray-400 text-sm">{error}</p>
                  <button
                    onClick={generatePreview}
                    className="mt-4 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors duration-200"
                  >
                    {t('pdf.preview.tryAgain')}
                  </button>
                </div>
              </div>
            )}

            {pdfUrl && !isLoading && !error && (
              <div className="relative h-full">
                {isRegenerating && (
                  <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    {t('pdf.preview.regenerating')}
                  </div>
                )}
                <div className="h-full bg-white rounded-lg overflow-hidden border border-dark-600">
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
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title={t('pdf.preview.openNewTab')}
                    >
                      {t('pdf.preview.open')}
                    </button>
                  </div>
                </div>
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
      </div>

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={closeUpgradeModal}
        feature={currentFeature}
      />
    </>
  )
}

export default PDFPreview
