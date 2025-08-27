import React, { useState } from 'react'
import { useI18n } from '../context/I18nContext'
import BugReportModal from './BugReportModal.jsx'

const BugReportButton = ({ 
  position = 'bottom-right', 
  className = '',
  showLabel = false,
  variant = 'floating' // 'floating' | 'inline'
}) => {
  const { t } = useI18n()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4'
  }

  const baseClasses = variant === 'floating' 
    ? `fixed ${positionClasses[position]} z-40`
    : ''

  const buttonClasses = variant === 'floating'
    ? 'bg-red-500 hover:bg-red-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105'
    : 'bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors'

  return (
    <>
      <div className={`${baseClasses} ${className}`}>
        <button
          onClick={() => setIsModalOpen(true)}
          className={buttonClasses}
          title={t('bugReport.reportBug')}
          aria-label={t('bugReport.reportBug')}
        >
          <div className="flex items-center gap-2">
            <svg 
              className="w-5 h-5" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
              />
            </svg>
            {showLabel && (
              <span className="text-sm font-medium">
                {t('bugReport.reportBug')}
              </span>
            )}
          </div>
        </button>
      </div>

      <BugReportModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  )
}

export default BugReportButton
