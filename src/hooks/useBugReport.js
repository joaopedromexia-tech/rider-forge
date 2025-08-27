import { useState } from 'react'
import { supabase } from '../config/supabase.js'
import { useAuth } from '../context/AuthContext.jsx'

export const useBugReport = () => {
  const { user } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const submitBugReport = async (bugData) => {
    setIsSubmitting(true)

    try {
      const bugReport = {
        title: bugData.title.trim(),
        description: bugData.description.trim(),
        severity: bugData.severity || 'medium',
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
        throw new Error('Erro ao enviar reporte')
      }

      return { success: true, data }
    } catch (error) {
      console.error('Erro inesperado:', error)
      throw error
    } finally {
      setIsSubmitting(false)
    }
  }

  const submitErrorReport = async (error, context = {}) => {
    const bugData = {
      title: `Erro automático: ${error.message || 'Erro desconhecido'}`,
      description: `
Erro capturado automaticamente:

**Erro:** ${error.message || 'Erro desconhecido'}
**Stack:** ${error.stack || 'N/A'}
**Contexto:** ${JSON.stringify(context, null, 2)}
**URL:** ${window.location.href}
**Timestamp:** ${new Date().toISOString()}

Este erro foi capturado automaticamente pelo sistema de reporte de bugs.
      `.trim(),
      severity: 'high'
    }

    return submitBugReport(bugData)
  }

  return {
    submitBugReport,
    submitErrorReport,
    isSubmitting
  }
}
