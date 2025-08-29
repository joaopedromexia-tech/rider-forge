import React from 'react'
import { useProgressiveLoading } from '../hooks/useProgressiveLoading'

/**
 * ProgressiveLoadingIndicator - Shows minimal loading state for auth-dependent UI
 * Used in header/navigation areas where we want to show content immediately
 * but indicate that auth is still loading
 */
function ProgressiveLoadingIndicator({ 
  className = '',
  showText = false,
  size = 'sm',
  variant = 'default'
}) {
  const { canShowAuthUI } = useProgressiveLoading()

  // Don't show anything if auth UI is ready
  if (canShowAuthUI) {
    return null
  }

  const sizeClasses = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  }

  const variantClasses = {
    default: 'border-accent-blue',
    subtle: 'border-gray-400',
    white: 'border-white'
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div 
        className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${variantClasses[variant]}`}
        aria-label="Carregando autenticação"
      />
      {showText && (
        <span className="text-xs text-gray-400">...</span>
      )}
    </div>
  )
}

export default ProgressiveLoadingIndicator
