import React from 'react'
import { useProgressiveLoading } from '../hooks/useProgressiveLoading'
import ProgressiveLoadingIndicator from './ProgressiveLoadingIndicator'
import ProgressiveContentWrapper from './ProgressiveContentWrapper'

/**
 * Test component to demonstrate progressive loading
 */
function ProgressiveLoadingTest() {
  const { 
    canShowContent, 
    canShowAuthUI, 
    isAuthLoading, 
    isInitializing,
    user,
    hasAccount,
    isPro 
  } = useProgressiveLoading()

  return (
    <div className="p-8 bg-dark-900 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Progressive Loading Test</h1>
        
        {/* Status Display */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Loading States</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Content Ready:</span>
                <span className={canShowContent ? 'text-green-400' : 'text-red-400'}>
                  {canShowContent ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Auth UI Ready:</span>
                <span className={canShowAuthUI ? 'text-green-400' : 'text-red-400'}>
                  {canShowAuthUI ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Auth Loading:</span>
                <span className={isAuthLoading ? 'text-yellow-400' : 'text-green-400'}>
                  {isAuthLoading ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Initializing:</span>
                <span className={isInitializing ? 'text-yellow-400' : 'text-green-400'}>
                  {isInitializing ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-200 mb-4">Auth State</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">User:</span>
                <span className={user ? 'text-green-400' : 'text-gray-400'}>
                  {user ? user.email : 'None'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Has Account:</span>
                <span className={hasAccount ? 'text-green-400' : 'text-red-400'}>
                  {hasAccount ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Is Pro:</span>
                <span className={isPro ? 'text-green-400' : 'text-red-400'}>
                  {isPro ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Progressive Content Demo */}
        <div className="card mb-8">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Progressive Content Demo</h3>
          
          <ProgressiveContentWrapper
            showLoadingIndicator={true}
            loadingPosition="top"
            authDependentContent={
              <div className="mt-4 p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Auth-dependent content is now visible!
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  This content only appears after authentication is loaded.
                </p>
              </div>
            }
            loadingFallback={
              <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  ⏳ Auth is still loading...
                </p>
                <p className="text-gray-400 text-xs mt-2">
                  This fallback content is shown while auth loads.
                </p>
              </div>
            }
          >
            <div className="p-4 bg-blue-900/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-400 text-sm">
                🚀 This content appears immediately!
              </p>
              <p className="text-gray-400 text-xs mt-2">
                This content is shown right away, regardless of auth state.
              </p>
            </div>
          </ProgressiveContentWrapper>
        </div>

        {/* Loading Indicators Demo */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-200 mb-4">Loading Indicators</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <ProgressiveLoadingIndicator size="xs" />
              <p className="text-xs text-gray-400 mt-2">Extra Small</p>
            </div>
            <div className="text-center">
              <ProgressiveLoadingIndicator size="sm" />
              <p className="text-xs text-gray-400 mt-2">Small</p>
            </div>
            <div className="text-center">
              <ProgressiveLoadingIndicator size="md" />
              <p className="text-xs text-gray-400 mt-2">Medium</p>
            </div>
            <div className="text-center">
              <ProgressiveLoadingIndicator size="lg" />
              <p className="text-xs text-gray-400 mt-2">Large</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressiveLoadingTest
