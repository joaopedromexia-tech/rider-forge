import React, { Suspense, useState, useEffect } from 'react'

// Faster loading component with skeleton
const LoadingSpinner = ({ message = "Carregando...", fast = false }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      {fast ? (
        // Fast loading - just a small spinner
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
      ) : (
        // Regular loading - larger spinner
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      )}
      <p className={`text-gray-600 ${fast ? 'text-xs' : 'text-sm'}`}>{message}</p>
    </div>
  </div>
)

// Skeleton loading for better perceived performance
const SkeletonLoader = ({ message = "Carregando..." }) => (
  <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800">
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header skeleton */}
      <div className="animate-pulse">
        <div className="h-8 bg-dark-800 rounded-lg mb-4 w-1/3"></div>
        <div className="h-4 bg-dark-800 rounded mb-2 w-2/3"></div>
        <div className="h-4 bg-dark-800 rounded mb-6 w-1/2"></div>
      </div>
      
      {/* Content skeleton */}
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-dark-800 rounded-lg"></div>
        <div className="h-24 bg-dark-800 rounded-lg"></div>
        <div className="h-40 bg-dark-800 rounded-lg"></div>
      </div>
      
      <div className="text-center mt-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  </div>
)

// Error boundary component
const ErrorFallback = ({ error, retry }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <div className="text-red-500 text-4xl mb-4">⚠️</div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">Erro ao carregar</h2>
      <p className="text-gray-600 text-sm mb-4">
        Ocorreu um erro ao carregar este componente. Tente novamente.
      </p>
      <button
        onClick={retry}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
      >
        Tentar novamente
      </button>
    </div>
  </div>
)

// Lazy loader with error boundary and retry functionality
const LazyLoader = ({ 
  component: LazyComponent, 
  loadingMessage = "Carregando...",
  fallback: CustomFallback,
  preload = false,
  fast = false
}) => {
  const [hasError, setHasError] = useState(false)
  const [key, setKey] = useState(0)

  const retry = () => {
    setHasError(false)
    setKey(prev => prev + 1)
  }

  if (hasError) {
    return <ErrorFallback error={hasError} retry={retry} />
  }

  // Use skeleton loader for better perceived performance
  const LoadingComponent = fast ? LoadingSpinner : SkeletonLoader

  return (
    <Suspense fallback={<LoadingComponent message={loadingMessage} fast={fast} />}>
      <ErrorBoundary onError={() => setHasError(true)}>
        <LazyComponent key={key} />
      </ErrorBoundary>
    </Suspense>
  )
}

// Error boundary class component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in lazy loaded component:', error, errorInfo)
    this.props.onError?.(error)
  }

  render() {
    if (this.state.hasError) {
      return null // Let the parent handle the error display
    }

    return this.props.children
  }
}

export default LazyLoader
