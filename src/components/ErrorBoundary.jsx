import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, reportSubmitted: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error: error,
      errorInfo: errorInfo
    })

    // Tentar enviar reporte automático do erro
    this.submitErrorReport(error, errorInfo)
  }

  submitErrorReport = async (error, errorInfo) => {
    try {
      // Importar dinamicamente para evitar problemas de SSR
      const { supabase } = await import('../config/supabase.js')
      
      const bugReport = {
        title: `Erro automático: ${error.message || 'Erro desconhecido'}`,
        description: `
Erro capturado automaticamente pelo ErrorBoundary:

**Erro:** ${error.message || 'Erro desconhecido'}
**Stack:** ${error.stack || 'N/A'}
**Component Stack:** ${errorInfo.componentStack || 'N/A'}
**URL:** ${window.location.href}
**Timestamp:** ${new Date().toISOString()}
**User Agent:** ${navigator.userAgent}

Este erro foi capturado automaticamente pelo sistema de reporte de bugs.
        `.trim(),
        severity: 'high',
        user_id: null, // Será preenchido se o user estiver logado
        browser_info: {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          screenResolution: `${screen.width}x${screen.height}`,
          windowSize: `${window.innerWidth}x${window.innerHeight}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        },
        app_version: '1.0.0',
        page_url: window.location.href,
        user_agent: navigator.userAgent
      }

      const { error: supabaseError } = await supabase
        .from('bug_reports')
        .insert([bugReport])

      if (!supabaseError) {
        this.setState({ reportSubmitted: true })
      }
    } catch (reportError) {
      console.error('Erro ao enviar reporte automático:', reportError)
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="text-center">
              <div className="text-red-500 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Algo correu mal
              </h1>
              <p className="text-gray-600 mb-4">
                Ocorreu um erro inesperado. Por favor, recarregue a página.
              </p>
              
              {this.state.reportSubmitted && (
                <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
                  <p className="text-sm text-green-800">
                    ✅ Erro reportado automaticamente. Obrigado!
                  </p>
                </div>
              )}
              
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Recarregar Página
              </button>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-gray-500">
                    Detalhes do erro (desenvolvimento)
                  </summary>
                  <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                    {this.state.error && this.state.error.toString()}
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
