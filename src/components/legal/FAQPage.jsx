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
      question: "O que é o Rider Forge?",
      answer: "O Rider Forge é uma ferramenta profissional para criação de riders técnicos. Permite aos músicos, técnicos de som e produtores criarem riders técnicos detalhados e profissionais de forma fácil e intuitiva."
    },
    {
      question: "O que é um rider técnico?",
      answer: "Um rider técnico é um documento que especifica todos os requisitos técnicos para uma performance musical, incluindo equipamento de som, iluminação, requisitos de palco, e outras especificações técnicas necessárias para o evento."
    },
    {
      question: "Posso usar o Rider Forge gratuitamente?",
      answer: "Sim! O Rider Forge oferece um plano gratuito que permite criar até 2 riders com funcionalidades básicas. Para funcionalidades avançadas como riders ilimitados, biblioteca Pro de equipamentos e histórico de versões, recomendamos o upgrade para o plano Pro."
    },
    {
      question: "Quais são as diferenças entre o plano Free e Pro?",
      answer: "O plano Free inclui: até 2 riders, biblioteca básica de equipamentos, exportação PDF básica e 5MB de armazenamento. O plano Pro inclui: riders ilimitados, biblioteca Pro de equipamentos, PDF customizável, histórico de versões e armazenamento ilimitado."
    },
    {
      question: "Como posso exportar os meus riders?",
      answer: "Pode exportar os seus riders em formato PDF. No plano Free, a exportação é básica. No plano Pro, pode customizar completamente o layout e design do PDF exportado."
    },
    {
      question: "Os meus dados estão seguros?",
      answer: "Sim, a segurança dos seus dados é uma prioridade. Utilizamos encriptação de ponta a ponta e seguimos as melhores práticas de segurança. Os seus riders são armazenados de forma segura e privada."
    },
    {
      question: "Posso partilhar os meus riders?",
      answer: "Sim! Pode partilhar os seus riders através de links gerados automaticamente. Estes links permitem que outros vejam o rider sem precisarem de uma conta no Rider Forge."
    },
    {
      question: "Como funciona o histórico de versões?",
      answer: "O histórico de versões (disponível no plano Pro) guarda automaticamente todas as alterações feitas aos seus riders. Pode ver e restaurar versões anteriores a qualquer momento."
    },
    {
      question: "Posso importar riders existentes?",
      answer: "Atualmente, o Rider Forge não suporta importação direta de riders existentes. No entanto, pode criar novos riders baseados em templates ou copiar informações de riders existentes."
    },
    {
      question: "Como posso cancelar a minha subscrição Pro?",
      answer: "Pode cancelar a sua subscrição Pro a qualquer momento através da página de gestão de subscrição. Após o cancelamento, continuará a ter acesso às funcionalidades Pro até ao final do período atual."
    },
    {
      question: "O Rider Forge funciona em dispositivos móveis?",
      answer: "Sim! O Rider Forge é uma aplicação web responsiva que funciona em computadores, tablets e smartphones. A interface adapta-se automaticamente ao tamanho do ecrã."
    },
    {
      question: "Preciso de uma conta para usar o Rider Forge?",
      answer: "Pode criar riders sem conta, mas para guardar e gerir os seus riders, precisará de criar uma conta gratuita. A conta também permite sincronizar os seus riders entre dispositivos."
    },
    {
      question: "Que tipos de equipamento estão incluídos na biblioteca?",
      answer: "A biblioteca inclui equipamentos de som profissionais como consolas, microfones, monitores, sistemas de PA, equipamento de iluminação e muito mais. A biblioteca Pro inclui equipamentos mais avançados e especializados."
    },
    {
      question: "Posso adicionar equipamentos personalizados?",
      answer: "Sim! Pode adicionar equipamentos personalizados que não estão na biblioteca. Estes equipamentos ficam guardados na sua conta e podem ser reutilizados em outros riders."
    },
    {
      question: "Como posso obter suporte técnico?",
      answer: "Pode contactar-nos através do botão de reporte de bugs na aplicação ou enviar um email para o nosso suporte. Respondemos a todas as questões em 24-48 horas."
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
