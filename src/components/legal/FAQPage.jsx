import React, { useState } from 'react'

import { useI18n } from '../../context/I18nContext'

const FAQPage = ({ onBack }) => {
  const { t } = useI18n()
  const [openItems, setOpenItems] = useState(new Set())

  const toggleItem = (index) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  const faqData = [
    {
      question: t('faq.questions.q1'),
      answer: t('faq.answers.a1')
    },
    {
      question: t('faq.questions.q2'),
      answer: t('faq.answers.a2')
    },
    {
      question: t('faq.questions.q3'),
      answer: t('faq.answers.a3')
    },
    {
      question: t('faq.questions.q4'),
      answer: t('faq.answers.a4')
    },
    {
      question: t('faq.questions.q5'),
      answer: t('faq.answers.a5')
    },
    {
      question: t('faq.questions.q6'),
      answer: t('faq.answers.a6')
    },
    {
      question: t('faq.questions.q7'),
      answer: t('faq.answers.a7')
    },
    {
      question: t('faq.questions.q8'),
      answer: t('faq.answers.a8')
    },
    {
      question: t('faq.questions.q9'),
      answer: t('faq.answers.a9')
    },
    {
      question: t('faq.questions.q10'),
      answer: t('faq.answers.a10')
    },
    {
      question: t('faq.questions.q11'),
      answer: t('faq.answers.a11')
    },
    {
      question: t('faq.questions.q12'),
      answer: t('faq.answers.a12')
    },
    {
      question: t('faq.questions.q13'),
      answer: t('faq.answers.a13')
    },
    {
      question: t('faq.questions.q14'),
      answer: t('faq.answers.a14')
    },
    {
      question: t('faq.questions.q15'),
      answer: t('faq.answers.a15')
    }
  ]

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
                {t('faq.title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('faq.description')}
              </p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder={t('faq.search')}
                className="w-full px-4 py-3 pl-12 bg-dark-800 border border-dark-700 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* FAQ Items */}
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="card">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 rounded-xl"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-100 pr-4">
                      {item.question}
                    </h3>
                    <svg 
                      className={`w-6 h-6 text-gray-400 transition-transform duration-200 flex-shrink-0 ${
                        openItems.has(index) ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  {openItems.has(index) && (
                    <div className="mt-4 pt-4 border-t border-dark-700">
                      <p className="text-gray-300 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Contact Section */}
          <div className="mt-12 card bg-gradient-to-r from-blue-600/10 to-indigo-600/10 border border-blue-500/30">
            <div className="text-center p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-3">
                {t('faq.contactTitle')}
              </h3>
              <p className="text-gray-300 mb-6">
                {t('faq.contactDesc')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="btn-primary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {t('faq.sendEmail')}
                </button>
                <button className="btn-secondary">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  {t('faq.reportBug')}
                </button>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card text-center p-4">
              <h4 className="font-semibold text-gray-100 mb-2">Planos e Preços</h4>
              <p className="text-sm text-gray-400 mb-3">Compare os planos Free e Pro</p>
              <button className="text-accent-blue hover:text-accent-blue/80 text-sm font-medium">
                Ver Preços →
              </button>
            </div>
            
            <div className="card text-center p-4">
              <h4 className="font-semibold text-gray-100 mb-2">Termos de Utilização</h4>
              <p className="text-sm text-gray-400 mb-3">Leia os nossos termos legais</p>
              <button className="text-accent-blue hover:text-accent-blue/80 text-sm font-medium">
                Ler Termos →
              </button>
            </div>
            
            <div className="card text-center p-4">
              <h4 className="font-semibold text-gray-100 mb-2">Política de Privacidade</h4>
              <p className="text-sm text-gray-400 mb-3">Como protegemos os seus dados</p>
              <button className="text-accent-blue hover:text-accent-blue/80 text-sm font-medium">
                Ler Política →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FAQPage
