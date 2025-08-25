import React, { useEffect, useState, useCallback } from 'react'
import { pdf } from '@react-pdf/renderer'
import RiderPDF from '../pdf/RiderPDF'

function PDFPreview({ isOpen, onClose, riderData, riderName, exportOptions, onExport }) {
  const [pdfUrl, setPdfUrl] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isRegenerating, setIsRegenerating] = useState(false)

  // Gerar preview do PDF quando o modal abrir
  useEffect(() => {
    if (isOpen && riderData) {
      generatePreview()
    }
  }, [isOpen, riderData, exportOptions?.includeStagePlot, exportOptions?.customFooter])

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
        throw new Error('Nenhum dado disponível para gerar o PDF')
      }
      
      const instance = pdf(
        <RiderPDF 
          rider={sanitizedRiderData} 
          language="pt" 
          proBranding={{}} 
          options={exportOptions || {}} 
        />
      )
      
      const blob = await instance.toBlob()
      const url = URL.createObjectURL(blob)
      setPdfUrl(url)
      
      // Calcular informações do PDF
      const sizeInMB = (blob.size / (1024 * 1024)).toFixed(2)
      setPdfInfo({
        size: sizeInMB,
        pages: 'Estimado: 1-3 páginas',
        generatedAt: new Date().toLocaleTimeString('pt-PT')
      })
    } catch (err) {
      setError(err.message || 'Erro ao gerar PDF')
    } finally {
      setIsLoading(false)
      setIsRegenerating(false)
    }
  }, [riderData, exportOptions])

  const generatePreview = useCallback(async () => {
    if (pdfUrl) {
      setIsRegenerating(true)
    } else {
      setIsLoading(true)
    }
    setError(null)
    
    try {
      generatePDFBlob()
    } catch (err) {
      setError(err.message || 'Erro ao gerar preview do PDF')
    }
  }, [pdfUrl, exportOptions, generatePDFBlob])

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
              <h3 className="text-xl font-bold text-gray-100">Preview do PDF</h3>
              <p className="text-gray-400 text-sm">
                {riderName || 'Rider Técnico'} - Visualização antes da exportação
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={generatePreview}
                disabled={isLoading}
                className="px-3 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors duration-200 disabled:opacity-50"
                title="Regenerar preview"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors duration-200"
              >
                Exportar PDF
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
                  <p className="text-gray-400 mb-2">A gerar preview do PDF...</p>
                  <p className="text-gray-500 text-sm">Isto pode demorar alguns segundos</p>
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
                  <p className="text-red-400 font-medium mb-2">Erro ao gerar preview</p>
                  <p className="text-gray-400 text-sm">{error}</p>
                  <button
                    onClick={generatePreview}
                    className="mt-4 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors duration-200"
                  >
                    Tentar novamente
                  </button>
                </div>
              </div>
            )}

            {pdfUrl && !isLoading && !error && (
              <div className="relative h-full">
                {isRegenerating && (
                  <div className="absolute top-2 right-2 z-10 bg-yellow-500 text-white px-3 py-1 rounded-full text-xs flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                    A regenerar...
                  </div>
                )}
                <div className="h-full bg-white rounded-lg overflow-hidden border border-dark-600">
                  <div className="bg-gray-100 px-4 py-2 border-b border-gray-300 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Preview do PDF</span>
                    {pdfInfo && (
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>Tamanho: {pdfInfo.size} MB</span>
                        <span>•</span>
                        <span>{pdfInfo.pages}</span>
                        <span>•</span>
                        <span>Gerado: {pdfInfo.generatedAt}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(pdfUrl, '_blank')}
                      className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                      title="Abrir em nova aba"
                    >
                      Abrir
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

    </>
  )
}

export default PDFPreview
