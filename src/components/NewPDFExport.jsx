import React, { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import RiderPDF from '../pdf/RiderPDF'
import { useProFeatures } from '../hooks/useProFeatures'
import ProUpgradeModal from './ProUpgradeModal'
import PDFPreview from './PDFPreview'

function NewPDFExport({ isOpen, onClose, riderData, riderName }) {
  const [isPreparing, setIsPreparing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [exportOptions, setExportOptions] = useState({ 
    includeStagePlot: true, 
    customFooter: '',
    colorTheme: 'default'
  })

  const {
    isPro,
    showUpgradeModal,
    currentFeature,
    closeUpgradeModal,
    useProFeature,
    PRO_FEATURES
  } = useProFeatures()

  // Load/export options like old modal
  useEffect(() => {
    try {
      const stored = localStorage.getItem('riderForge_exportOptions_new')
      if (stored) setExportOptions(prev => ({ ...prev, ...JSON.parse(stored) }))
    } catch {
      // Ignore errors
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('riderForge_exportOptions_new', JSON.stringify(exportOptions))
    } catch {
      // Ignore errors
    }
  }, [exportOptions])

  if (!isOpen) return null
  const filename = `${(riderName || 'rider_tecnico').replace(/[^a-z0-9]/gi, '_').toLowerCase()}_novo.pdf`

  // Temas de cores disponíveis
  const colorThemes = [
    { value: 'default', label: 'Padrão', description: 'Tema clássico preto e branco' },
    { value: 'professional', label: 'Profissional', description: 'Azul e cinza elegante', pro: true },
    { value: 'modern', label: 'Moderno', description: 'Azul ciano contemporâneo', pro: true },
    { value: 'elegant', label: 'Elegante', description: 'Roxo e cinza sofisticado', pro: true },
    { value: 'dark', label: 'Escuro', description: 'Tema escuro para ecrãs', pro: true }
  ]

  const handlePreview = () => {
    setShowPreview(true)
  }

  const handleGenerateAndDownload = async () => {
    if (isPreparing) return
    
    // Verificar se o tema selecionado requer Pro
    const selectedTheme = colorThemes.find(theme => theme.value === exportOptions.colorTheme)
    if (selectedTheme?.pro && !isPro) {
      // Mostrar modal de upgrade Pro
      const success = useProFeature(PRO_FEATURES.CUSTOM_PDF.id, () => {
        generatePDF()
        return true
      })
      if (!success) return
    } else {
      generatePDF()
    }
  }

  const generatePDF = async () => {
    setIsPreparing(true)
    try {
      console.log('🔄 Iniciando geração de PDF...')
      console.log('📊 Dados do rider:', riderData)
      
      // Ensure riderData is properly structured and sanitized
      const sanitizedRiderData = JSON.parse(JSON.stringify(riderData || {}))
      
      // Validate that we have at least some data
      if (!sanitizedRiderData || Object.keys(sanitizedRiderData).length === 0) {
        throw new Error('Nenhum dado disponível para gerar o PDF')
      }

      console.log('✅ Dados sanitizados:', sanitizedRiderData)
      console.log('⚙️ Opções de exportação:', exportOptions)
      
      const instance = pdf(
        <RiderPDF 
          rider={sanitizedRiderData} 
          language="pt" 
          proBranding={{}} 
          options={exportOptions} 
        />
      )
      
      console.log('🏗️ PDF instance criada, gerando blob...')
      const blob = await instance.toBlob()
      console.log('✅ Blob gerado com sucesso, tamanho:', blob.size, 'bytes')
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      console.log('✅ PDF exportado com sucesso:', filename)
      
    } catch (e) {
      console.error('❌ Erro ao gerar PDF (novo):', e)
      console.error('❌ Stack trace:', e.stack)
      // Show user-friendly error message
      alert(`Erro ao gerar PDF: ${e.message || 'Verifique se todos os dados estão preenchidos corretamente.'}`)
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-dark-800 rounded-lg p-6 max-w-lg w-full mx-4 border border-dark-700 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-100 mb-2">Exportar PDF</h3>
            <p className="text-gray-400">Gerar rider técnico em formato PDF</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-dark-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Opções de Exportação</h4>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={exportOptions.includeStagePlot}
                  onChange={(e) => setExportOptions(o => ({ ...o, includeStagePlot: e.target.checked }))}
                  className="w-4 h-4"
                />
                Incluir Stage Plot (se existir)
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Rodapé personalizado (opcional)</label>
                <input
                  type="text"
                  value={exportOptions.customFooter}
                  onChange={(e) => setExportOptions(o => ({ ...o, customFooter: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500"
                  placeholder="Texto de rodapé"
                />
              </div>
            </div>

            {/* Seletor de Tema de Cores */}
            <div className="bg-dark-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-300">Tema de Cores</h4>
              <div className="space-y-2">
                {colorThemes.map((theme) => (
                  <label key={theme.value} className="flex items-center gap-3 p-2 rounded-lg hover:bg-dark-600 cursor-pointer">
                    <input
                      type="radio"
                      name="colorTheme"
                      value={theme.value}
                      checked={exportOptions.colorTheme === theme.value}
                      onChange={(e) => setExportOptions(o => ({ ...o, colorTheme: e.target.value }))}
                      className="w-4 h-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{theme.label}</span>
                        {theme.pro && (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-gradient-to-r from-accent-green to-accent-blue rounded-full text-white text-xs font-medium">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span>PRO</span>
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{theme.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors duration-200"
            >
              Cancelar
            </button>

            <button
              type="button"
              onClick={handlePreview}
              className="flex-1 px-4 py-2 bg-dark-600 text-gray-300 rounded-lg hover:bg-dark-500 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Preview
            </button>

            <button
              type="button"
              onClick={handleGenerateAndDownload}
              disabled={isPreparing}
              className="flex-1 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none"
              style={{ cursor: isPreparing ? 'not-allowed' : 'pointer', userSelect: 'none' }}
            >
              {isPreparing ? 'A preparar…' : 'Exportar PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Pro Upgrade Modal */}
      <ProUpgradeModal
        isOpen={showUpgradeModal}
        onClose={closeUpgradeModal}
        feature={currentFeature}
      />

      {/* PDF Preview Modal */}
      <PDFPreview
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        riderData={riderData}
        riderName={riderName}
        exportOptions={exportOptions}
        onExport={handleGenerateAndDownload}
      />
    </>
  )
}

export default NewPDFExport


