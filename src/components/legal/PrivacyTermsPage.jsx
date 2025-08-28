import React, { useState } from 'react'

import { useI18n } from '../../context/I18nContext'

const PrivacyTermsPage = ({ onBack }) => {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('privacy')

  const privacyContent = {
    title: t('legal.privacy.title'),
    lastUpdated: t('legal.privacy.lastUpdated'),
    sections: [
      {
        title: t('legal.privacy.section1.title'),
        content: `<p>${t('legal.privacy.section1.content')}</p>
          <ul>
            <li>${t('legal.privacy.section1.list1')}</li>
            <li>${t('legal.privacy.section1.list2')}</li>
            <li>${t('legal.privacy.section1.list3')}</li>
            <li>${t('legal.privacy.section1.list4')}</li>
          </ul>`
      },
      {
        title: t('legal.privacy.section2.title'),
        content: `<p>${t('legal.privacy.section2.content')}</p>
          <ul>
            <li>${t('legal.privacy.section2.list1')}</li>
            <li>${t('legal.privacy.section2.list2')}</li>
            <li>${t('legal.privacy.section2.list3')}</li>
            <li>${t('legal.privacy.section2.list4')}</li>
            <li>${t('legal.privacy.section2.list5')}</li>
            <li>${t('legal.privacy.section2.list6')}</li>
          </ul>`
      }
    ]
  }

  const termsContent = {
    title: t('legal.terms.title'),
    lastUpdated: t('legal.terms.lastUpdated'),
    sections: [
      {
        title: t('legal.terms.section1.title'),
        content: `<p>${t('legal.terms.section1.content')}</p>`
      },
      {
        title: t('legal.terms.section2.title'),
        content: `<p>${t('legal.terms.section2.content')}</p>
          <ul>
            <li>${t('legal.terms.section2.list1')}</li>
            <li>${t('legal.terms.section2.list2')}</li>
            <li>${t('legal.terms.section2.list3')}</li>
            <li>${t('legal.terms.section2.list4')}</li>
            <li>${t('legal.terms.section2.list5')}</li>
          </ul>`
      }
    ]
  }

  const renderContent = (content) => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{content.title}</h2>
        <p className="text-gray-400">{content.lastUpdated}</p>
      </div>

      {content.sections.map((section, index) => (
        <div key={index} className="card">
          <h3 className="text-xl font-semibold text-gray-100 mb-4">
            {section.title}
          </h3>
          <div 
            className="text-gray-300 leading-relaxed prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: section.content }}
          />
        </div>
      ))}
    </div>
  )

  return (
    <>

      <div className="min-h-screen bg-gradient-to-br from-dark-950 via-dark-900 to-dark-800 p-4">
        <div className="max-w-4xl mx-auto">
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
                {t('legal.title') || 'Termos de Privacidade e Utilização'}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('legal.description') || 'Informações importantes sobre como utilizamos os seus dados e os termos de utilização da plataforma'}
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mb-8">
            <div className="flex bg-dark-800 rounded-xl p-1 border border-dark-700">
              <button
                onClick={() => setActiveTab('privacy')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'privacy'
                    ? 'bg-accent-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                {t('legal.privacy') || 'Política de Privacidade'}
              </button>
              <button
                onClick={() => setActiveTab('terms')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === 'terms'
                    ? 'bg-accent-blue text-white shadow-lg'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('legal.terms') || 'Termos de Utilização'}
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="mb-8">
            {activeTab === 'privacy' ? renderContent(privacyContent) : renderContent(termsContent)}
          </div>

          {/* Contact Section */}
          <div className="card bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">
                {t('legal.contactTitle') || 'Tem questões sobre os nossos termos?'}
              </h3>
              <p className="text-gray-300 mb-6">
                {t('legal.contactDesc') || 'A nossa equipa jurídica está disponível para esclarecer qualquer dúvida sobre estes documentos.'}
              </p>
              <button className="btn-primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('legal.contactSupport') || 'Contactar Suporte Legal'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyTermsPage
