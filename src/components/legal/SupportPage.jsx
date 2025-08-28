import React, { useState } from 'react'

import { useI18n } from '../../context/I18nContext'
import BugReportModal from '../BugReportModal'

const SupportPage = ({ onBack }) => {
  const { t } = useI18n()
  const [showBugReportModal, setShowBugReportModal] = useState(false)

  const supportOptions = [
    {
      title: t('support.faq.title'),
      description: t('support.faq.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      action: () => {
        // Navegar para FAQ usando a função onBack para voltar à página inicial
        // e depois navegar para FAQ
        if (onBack) {
          onBack()
          // Simular navegação para FAQ após voltar à página inicial
          setTimeout(() => {
            // Disparar um evento customizado para navegar para FAQ
            const event = new CustomEvent('navigateToFAQ')
            window.dispatchEvent(event)
          }, 100)
        }
      },
      color: "from-blue-500 to-blue-600"
    },
    {
      title: t('support.bug.title'),
      description: t('support.bug.description'),
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      action: () => setShowBugReportModal(true),
      color: "from-yellow-500 to-orange-500"
    }
  ]

  const quickHelp = [
    {
      question: t('support.quickHelp.q1'),
      answer: t('support.quickHelp.a1')
    },
    {
      question: t('support.quickHelp.q2'),
      answer: t('support.quickHelp.a2')
    },
    {
      question: t('support.quickHelp.q3'),
      answer: t('support.quickHelp.a3')
    },
    {
      question: t('support.quickHelp.q4'),
      answer: t('support.quickHelp.a4')
    }
  ]

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={onBack}
              className="btn-secondary flex items-center gap-2 mb-6"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              {t('common.back')}
            </button>
            
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-4">
                {t('support.title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('support.description')}
              </p>
            </div>
          </div>

          {/* Support Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {supportOptions.map((option, index) => (
              <div 
                key={index}
                className="card-hover cursor-pointer group"
                onClick={option.action}
              >
                <div className="p-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${option.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-100 mb-2">
                    {option.title}
                  </h3>
                  <p className="text-gray-400">
                    {option.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Help Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-100 mb-6 text-center">
              {t('support.quickHelp.title')}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quickHelp.map((item, index) => (
                <div key={index} className="card">
                  <h3 className="text-lg font-semibold text-gray-100 mb-3">
                    {item.question}
                  </h3>
                  <p className="text-gray-300 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="card bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">
                {t('support.contactInfo.title')}
              </h3>
              <p className="text-gray-300 mb-6">
                {t('support.contactInfo.description')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.location.href = 'mailto:support@riderforge.app?subject=Suporte Rider Forge'}
                  className="btn-primary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('support.contactInfo.sendEmail')}
                </button>
                <button 
                  onClick={() => setShowBugReportModal(true)}
                  className="btn-secondary"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {t('support.contactInfo.reportBug')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bug Report Modal */}
      <BugReportModal 
        isOpen={showBugReportModal} 
        onClose={() => setShowBugReportModal(false)} 
      />
    </>
  )
}

export default SupportPage
