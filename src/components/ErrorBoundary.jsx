import React from 'react'
import { useAuth } from '../context/AuthContext'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isAuthError: false 
    }
  }

  static getDerivedStateFromError(error) {
    // Check if this is an authentication-related error
    const isAuthError = error?.message?.includes('auth') || 
                       error?.message?.includes('Supabase') ||
                       error?.message?.includes('authentication') ||
                       error?.code === 'AUTH_ERROR'
    
    return { 
      hasError: true, 
      isAuthError 
    }
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    })
    
    // Log error for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    // You could send error to an error reporting service here
    // reportErrorToService(error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ 
      hasError: false, 
      error: null, 
      errorInfo: null,
      isAuthError: false 
    })
  }

  handleGoToDashboard = () => {
    window.location.href = '/dashboard'
  }

  render() {
    if (this.state.hasError) {
      // Authentication error fallback
      if (this.state.isAuthError) {
        return (
          <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-4">
            <div className="bg-dark-800 rounded-xl shadow-2xl border border-dark-700 p-8 max-w-md w-full text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2">
                  Erro de Autenticação
                </h2>
                <p className="text-gray-400 text-sm">
                  Ocorreu um problema com a autenticação. Pode continuar a usar a aplicação em modo local.
                </p>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={this.handleGoToDashboard}
                  className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Continuar em Modo Local
                </button>
                <button
                  onClick={this.handleRetry}
                  className="w-full bg-dark-700 hover:bg-dark-600 text-gray-300 px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  Tentar Novamente
                </button>
              </div>
              
              <div className="mt-6 pt-4 border-t border-dark-700">
                <p className="text-xs text-gray-500">
                  Se o problema persistir, tente recarregar a página ou contacte o suporte.
                </p>
              </div>
            </div>
          </div>
        )
      }

      // General error fallback
      return (
        <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-xl shadow-2xl border border-dark-700 p-8 max-w-md w-full text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-100 mb-2">
                Algo correu mal
              </h2>
              <p className="text-gray-400 text-sm">
                Ocorreu um erro inesperado. Pode tentar novamente ou voltar ao dashboard.
              </p>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={this.handleGoToDashboard}
                className="w-full bg-accent-blue hover:bg-accent-blue/80 text-white px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Voltar ao Dashboard
              </button>
              <button
                onClick={this.handleRetry}
                className="w-full bg-dark-700 hover:bg-dark-600 text-gray-300 px-4 py-3 rounded-lg font-medium transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && (
              <details className="mt-6 pt-4 border-t border-dark-700 text-left">
                <summary className="text-sm text-gray-400 cursor-pointer hover:text-gray-300">
                  Detalhes do Erro (Desenvolvimento)
                </summary>
                <div className="mt-2 p-3 bg-dark-900 rounded text-xs text-gray-400 overflow-auto max-h-32">
                  <pre>{this.state.error && this.state.error.toString()}</pre>
                  <pre>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                </div>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
