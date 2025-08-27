import React, { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import RiderPDF from '../pdf/RiderPDF'
import PDFPreview from './PDFPreview'
import { useI18n } from '../context/I18nContext'

function NewPDFExport({ isOpen, onClose, riderData, riderName }) {
  const { t, locale } = useI18n()
  const [isPreparing, setIsPreparing] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [exportOptions, setExportOptions] = useState({ 
    includeStagePlot: true, 
    customFooter: '',
    colorTheme: 'default'
  })

  useEffect(() => {
    try {
      const stored = localStorage.getItem('riderForge_exportOptions_new')
      if (stored) setExportOptions(prev => ({ ...prev, ...JSON.parse(stored) }))
    } catch {}
  }, [])

  useEffect(() => {
    try { localStorage.setItem('riderForge_exportOptions_new', JSON.stringify(exportOptions)) } catch {}
  }, [exportOptions])

  // Only default theme
  const colorThemes = [
    { value: 'default', label: t('pdf.export.theme.default.label'), description: t('pdf.export.theme.default.desc') }
  ]
  const themesToShow = colorThemes

  // Ensure selected theme is always "default"
  useEffect(() => {
    if (exportOptions.colorTheme !== 'default') {
      setExportOptions(o => ({ ...o, colorTheme: 'default' }))
    }
  }, [exportOptions.colorTheme])

  // Ensure consistent hook order: only now can we return
  if (!isOpen) return null

  const filenameBase = (riderName || (locale === 'en' ? 'technical_rider' : 'rider_tecnico'))
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
  const filename = `${filenameBase}_${locale}.pdf`

  const handlePreview = () => setShowPreview(true)

  const handleGenerateAndDownload = async () => {
    if (isPreparing) return
    generatePDF()
  }

  const generatePDF = async () => {
    setIsPreparing(true)
    try {
      const sanitizedRiderData = JSON.parse(JSON.stringify(riderData || {}))
      if (!sanitizedRiderData || Object.keys(sanitizedRiderData).length === 0) {
        throw new Error(t('pdf.error.noData'))
      }
      const instance = pdf(
        <RiderPDF 
          rider={sanitizedRiderData} 
          language={locale} 
          proBranding={{}} 
          options={exportOptions} 
        />
      )
      const blob = await instance.toBlob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.rel = 'noopener noreferrer'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      alert(t('pdf.error.generate'))
    } finally {
      setIsPreparing(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-dark-800 rounded-lg p-6 max-w-lg w-full mx-4 border border-dark-700 max-h-[90vh] overflow-y-auto">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-100 mb-2">{t('pdf.export.title')}</h3>
            <p className="text-gray-400">{t('pdf.export.subtitle')}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-dark-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-300">{t('pdf.export.options')}</h4>
              <label className="flex items-center gap-2 text-sm text-gray-300">
                <input
                  type="checkbox"
                  checked={exportOptions.includeStagePlot}
                  onChange={(e) => setExportOptions(o => ({ ...o, includeStagePlot: e.target.checked }))}
                  className="w-4 h-4"
                />
                {t('pdf.export.includeStagePlot')}
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">{t('pdf.export.customFooter')}</label>
                <input
                  type="text"
                  value={exportOptions.customFooter}
                  onChange={(e) => setExportOptions(o => ({ ...o, customFooter: e.target.value }))}
                  className="w-full px-3 py-2 bg-dark-800 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500"
                  placeholder={t('pdf.export.customFooter.placeholder')}
                />
              </div>
            </div>

            {/* Seletor de Tema de Cores */}
            <div className="bg-dark-700 rounded-lg p-4 space-y-3">
              <h4 className="text-sm font-medium text-gray-300">{t('pdf.export.theme')}</h4>
              <div className="space-y-2">
                {themesToShow.map((theme) => (
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
                      </div>
                      <p className="text-xs text-gray-400">{theme.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-dark-700 text-gray-300 rounded-lg hover:bg-dark-600 transition-colors duration-200">{t('pdf.export.cancel')}</button>
            <button type="button" onClick={handlePreview} className="flex-1 px-4 py-2 bg-dark-600 text-gray-300 rounded-lg hover:bg-dark-500 transition-colors duration-200 flex items-center justify-center gap-2">{t('pdf.export.preview')}</button>
            <button type="button" onClick={handleGenerateAndDownload} disabled={isPreparing} className="flex-1 px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer select-none" style={{ cursor: isPreparing ? 'not-allowed' : 'pointer', userSelect: 'none' }}>
              {isPreparing ? t('pdf.export.prepare') : t('pdf.export.cta')}
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      <PDFPreview isOpen={showPreview} onClose={() => setShowPreview(false)} riderData={riderData} riderName={riderName} exportOptions={exportOptions} onExport={handleGenerateAndDownload} />
    </>
  )
}

export default NewPDFExport


