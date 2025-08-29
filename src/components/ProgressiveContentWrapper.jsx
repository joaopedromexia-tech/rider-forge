import React from 'react'
import { useProgressiveLoading } from '../hooks/useProgressiveLoading'
import ProgressiveLoadingIndicator from './ProgressiveLoadingIndicator'

/**
 * ProgressiveContentWrapper - Shows content immediately while auth loads in background
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to show immediately
 * @param {React.ReactNode} props.authDependentContent - Content that depends on auth state
 * @param {React.ReactNode} props.loadingFallback - Fallback content while auth loads
 * @param {boolean} props.showLoadingIndicator - Whether to show loading indicator
 * @param {string} props.loadingPosition - Position of loading indicator ('top', 'bottom', 'inline')
 */
function ProgressiveContentWrapper({ 
  children,
  authDependentContent = null,
  loadingFallback = null,
  showLoadingIndicator = false,
  loadingPosition = 'inline',
  className = ''
}) {
  const { canShowContent, canShowAuthUI } = useProgressiveLoading()

  // If we can't show content yet, show loading
  if (!canShowContent) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-blue"></div>
      </div>
    )
  }

  // Show main content immediately
  const mainContent = (
    <div className={className}>
      {children}
      
      {/* Show auth-dependent content when ready */}
      {canShowAuthUI && authDependentContent}
      
      {/* Show loading fallback while auth is loading */}
      {!canShowAuthUI && loadingFallback}
      
      {/* Show loading indicator if requested */}
      {showLoadingIndicator && !canShowAuthUI && (
        <div className={`flex items-center justify-center ${
          loadingPosition === 'top' ? 'mb-4' : 
          loadingPosition === 'bottom' ? 'mt-4' : 'inline-flex'
        }`}>
          <ProgressiveLoadingIndicator size="sm" showText={true} />
        </div>
      )}
    </div>
  )

  return mainContent
}

export default ProgressiveContentWrapper
