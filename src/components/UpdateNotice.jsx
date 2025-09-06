import React, { useState, useEffect } from 'react'
import { useI18n } from '../context/I18nContext'
import { XMarkIcon, SparklesIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import ChangelogModal from './ChangelogModal'
import { UPDATE_CONFIG, shouldShowUpdateNotice, markVersionAsSeen, dismissUpdateNotice } from '../config/updateConfig'

const UpdateNotice = () => {
  const { t, locale } = useI18n()
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  const [showChangelog, setShowChangelog] = useState(false)

  // Check if user should see the update notice
  useEffect(() => {
    if (shouldShowUpdateNotice()) {
      // Show notice after a short delay
      const timer = setTimeout(() => {
        setIsVisible(true)
        // Mark as seen immediately when shown
        markVersionAsSeen()
      }, UPDATE_CONFIG.showDelay)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    dismissUpdateNotice()
  }

  const handleViewDetails = () => {
    setShowChangelog(true)
  }

  if (!isVisible || isDismissed) {
    return null
  }

  // Get updates from config
  const updates = UPDATE_CONFIG.mainUpdates.map(update => ({
    type: update.type,
    icon: update.type === 'feature' ? SparklesIcon : 
          update.type === 'improvement' ? CheckCircleIcon : 
          update.type === 'fix' ? ExclamationTriangleIcon : InformationCircleIcon,
    title: update.title[locale] || update.title.en,
    description: update.description[locale] || update.description.en
  }))

  const getUpdateIcon = (type) => {
    switch (type) {
      case 'feature':
        return 'text-blue-500'
      case 'improvement':
        return 'text-green-500'
      case 'fix':
        return 'text-orange-500'
      default:
        return 'text-gray-500'
    }
  }

  const getUpdateBadge = (type) => {
    switch (type) {
      case 'feature':
        return locale === 'pt' ? 'NOVO' : 'NEW'
      case 'improvement':
        return locale === 'pt' ? 'MELHORIA' : 'IMPROVED'
      case 'fix':
        return locale === 'pt' ? 'CORRIGIDO' : 'FIXED'
      default:
        return ''
    }
  }

  return (
    <>
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-2xl w-full mx-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6" />
                <div>
                  <h3 className="font-semibold text-lg">
                    {locale === 'pt' ? 'Atualizações Recentes!' : 'Recent Updates!'}
                  </h3>
                  <p className="text-blue-100 text-sm">
                    {UPDATE_CONFIG.quickSummary[locale] || UPDATE_CONFIG.quickSummary.en}
                  </p>
                </div>
              </div>
              <button
                onClick={handleDismiss}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-4">
              {updates.map((update, index) => {
                const IconComponent = update.icon
                return (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`flex-shrink-0 ${getUpdateIcon(update.type)}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">
                          {update.title}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          update.type === 'feature' 
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            : update.type === 'improvement'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                        }`}>
                          {getUpdateBadge(update.type)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {update.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={handleViewDetails}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors duration-200"
              >
                {locale === 'pt' ? 'Ver detalhes completos' : 'View full details'}
              </button>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                >
                  {locale === 'pt' ? 'Mais tarde' : 'Later'}
                </button>
                <button
                  onClick={handleDismiss}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                  {locale === 'pt' ? 'Entendi!' : 'Got it!'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Changelog Modal */}
      <ChangelogModal 
        isOpen={showChangelog} 
        onClose={() => setShowChangelog(false)} 
      />
    </>
  )
}

export default UpdateNotice
