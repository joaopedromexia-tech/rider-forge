import React, { useState } from 'react'
import { supabase } from '../config/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useTranslation } from 'react-i18next'

const BugReportModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation()
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium'
  })
  const [submitStatus, setSubmitStatus] = useState(null)

  const getBrowserInfo = () => {
    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      screenResolution: `${screen.width}x${screen.height}`,
      windowSize: `${window.innerWidth}x${window.innerHeight}`,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  }

  const getAppVersion = () => {
    // Podes adicionar uma versão da app no package.json ou usar uma constante
    return '1.0.0'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const bugReport = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        severity: formData.severity,
        user_id: user?.id || null,
        browser_info: getBrowserInfo(),
        app_version: getAppVersion(),
        page_url: window.location.href,
        user_agent: navigator.userAgent
      }

      const { data, error } = await supabase
        .from('bug_reports')
        .insert([bugReport])
        .select()

      if (error) {
        console.error('Erro ao enviar bug report:', error)
        setSubmitStatus({ type: 'error', message: t('bugReport.error') })
      } else {
        setSubmitStatus({ type: 'success', message: t('bugReport.success') })
        setFormData({ title: '', description: '', severity: 'medium' })
        
        // Fechar modal após 2 segundos
        setTimeout(() => {
          onClose()
          setSubmitStatus(null)
        }, 2000)
      }
    } catch (error) {
      console.error('Erro inesperado:', error)
      setSubmitStatus({ type: 'error', message: t('bugReport.unexpectedError') })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            🐛 {t('bugReport.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isSubmitting}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Status Message */}
          {submitStatus && (
            <div className={`p-3 rounded-md ${
              submitStatus.type === 'success' 
                ? 'bg-green-50 text-green-800 border border-green-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {submitStatus.message}
            </div>
          )}

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              {t('bugReport.titleLabel')} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              maxLength={100}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('bugReport.titlePlaceholder')}
              disabled={isSubmitting}
            />
          </div>

          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-1">
              {t('bugReport.severityLabel')}
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="low">{t('bugReport.severityLow')}</option>
              <option value="medium">{t('bugReport.severityMedium')}</option>
              <option value="high">{t('bugReport.severityHigh')}</option>
              <option value="critical">{t('bugReport.severityCritical')}</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              {t('bugReport.descriptionLabel')} *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              rows={4}
              maxLength={1000}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder={t('bugReport.descriptionPlaceholder')}
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.description.length}/1000 {t('bugReport.characters')}
            </div>
          </div>

          {/* User Info */}
          {user && (
            <div className="bg-blue-50 p-3 rounded-md">
              <p className="text-sm text-blue-800">
                {t('bugReport.loggedInAs')}: <span className="font-medium">{user.email}</span>
              </p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !formData.title.trim() || !formData.description.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('common.sending')}
                </span>
              ) : (
                t('bugReport.submit')
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BugReportModal
