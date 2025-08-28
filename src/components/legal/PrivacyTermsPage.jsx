import React, { useState } from 'react'

import { useI18n } from '../../context/I18nContext'

const PrivacyTermsPage = ({ onBack }) => {
  const { t } = useI18n()
  const [activeTab, setActiveTab] = useState('privacy')

  const privacyContent = {
    title: "Política de Privacidade",
    lastUpdated: "Última atualização: 15 de Janeiro de 2025",
    sections: [
      {
        title: "1. Informações que Recolhemos",
        content: `
          <p>Recolhemos informações que nos fornece diretamente, como quando cria uma conta, utiliza os nossos serviços ou contacta-nos:</p>
          <ul>
            <li><strong>Informações da conta:</strong> Nome, email, e informações de perfil</li>
            <li><strong>Conteúdo do utilizador:</strong> Riders técnicos que cria e guarda</li>
            <li><strong>Informações de utilização:</strong> Como utiliza a nossa aplicação</li>
            <li><strong>Informações técnicas:</strong> Tipo de dispositivo, navegador, endereço IP</li>
          </ul>
        `
      },
      {
        title: "2. Como Utilizamos as Suas Informações",
        content: `
          <p>Utilizamos as suas informações para:</p>
          <ul>
            <li>Fornecer e melhorar os nossos serviços</li>
            <li>Processar pagamentos e gerir subscrições</li>
            <li>Comunicar consigo sobre a sua conta e serviços</li>
            <li>Enviar atualizações e notificações importantes</li>
            <li>Prevenir fraudes e garantir a segurança</li>
            <li>Cumprir obrigações legais</li>
          </ul>
        `
      },
      {
        title: "3. Partilha de Informações",
        content: `
          <p>Não vendemos, alugamos ou partilhamos as suas informações pessoais com terceiros, exceto:</p>
          <ul>
            <li><strong>Prestadores de serviços:</strong> Processadores de pagamento (Stripe) e serviços de hospedagem</li>
            <li><strong>Conformidade legal:</strong> Quando exigido por lei ou para proteger direitos</li>
            <li><strong>Consentimento:</strong> Quando nos autoriza explicitamente</li>
          </ul>
        `
      },
      {
        title: "4. Segurança dos Dados",
        content: `
          <p>Implementamos medidas de segurança técnicas e organizacionais para proteger as suas informações:</p>
          <ul>
            <li>Encriptação de dados em trânsito e em repouso</li>
            <li>Controlos de acesso rigorosos</li>
            <li>Monitorização contínua de segurança</li>
            <li>Backups regulares e seguros</li>
          </ul>
        `
      },
      {
        title: "5. Os Seus Direitos",
        content: `
          <p>Tem os seguintes direitos relativamente aos seus dados pessoais:</p>
          <ul>
            <li><strong>Acesso:</strong> Solicitar uma cópia dos seus dados</li>
            <li><strong>Retificação:</strong> Corrigir dados inexatos</li>
            <li><strong>Eliminação:</strong> Solicitar a eliminação dos seus dados</li>
            <li><strong>Portabilidade:</strong> Receber os seus dados num formato estruturado</li>
            <li><strong>Oposição:</strong> Opor-se ao processamento dos seus dados</li>
          </ul>
        `
      },
      {
        title: "6. Cookies e Tecnologias Similares",
        content: `
          <p>Utilizamos cookies e tecnologias similares para:</p>
          <ul>
            <li>Manter a sua sessão ativa</li>
            <li>Lembrar as suas preferências</li>
            <li>Analisar a utilização da aplicação</li>
            <li>Melhorar a experiência do utilizador</li>
          </ul>
          <p>Pode controlar o uso de cookies através das configurações do seu navegador.</p>
        `
      },
      {
        title: "7. Retenção de Dados",
        content: `
          <p>Conservamos as suas informações durante o tempo necessário para:</p>
          <ul>
            <li>Fornecer os nossos serviços</li>
            <li>Cumprir obrigações legais</li>
            <li>Resolver disputas</li>
            <li>Fazer cumprir os nossos acordos</li>
          </ul>
          <p>Quando já não precisarmos das suas informações, eliminamo-las de forma segura.</p>
        `
      },
      {
        title: "8. Transferências Internacionais",
        content: `
          <p>Os seus dados podem ser processados em países fora da sua residência. Garantimos que essas transferências são protegidas por:</p>
          <ul>
            <li>Decisões de adequação da Comissão Europeia</li>
            <li>Cláusulas contratuais padrão</li>
            <li>Outras garantias adequadas</li>
          </ul>
        `
      },
      {
        title: "9. Alterações a Esta Política",
        content: `
          <p>Podemos atualizar esta política periodicamente. Notificaremos sobre alterações significativas através de:</p>
          <ul>
            <li>Email para a sua conta registada</li>
            <li>Notificação na aplicação</li>
            <li>Atualização da data "Última atualização"</li>
          </ul>
        `
      },
      {
        title: "10. Contacto",
        content: `
          <p>Para questões sobre esta política de privacidade, contacte-nos:</p>
          <ul>
            <li><strong>Email:</strong> privacy@riderforge.app</li>
            <li><strong>Endereço:</strong> [Endereço da empresa]</li>
            <li><strong>Formulário:</strong> Através da aplicação</li>
          </ul>
        `
      }
    ]
  }

  const termsContent = {
    title: "Termos de Utilização",
    lastUpdated: "Última atualização: 15 de Janeiro de 2025",
    sections: [
      {
        title: "1. Aceitação dos Termos",
        content: `
          <p>Ao aceder e utilizar o Rider Forge, aceita estar vinculado a estes Termos de Utilização. Se não concordar com qualquer parte destes termos, não deve utilizar os nossos serviços.</p>
        `
      },
      {
        title: "2. Descrição do Serviço",
        content: `
          <p>O Rider Forge é uma plataforma online que permite aos utilizadores:</p>
          <ul>
            <li>Criar e editar riders técnicos</li>
            <li>Armazenar e organizar riders</li>
            <li>Exportar riders em formato PDF</li>
            <li>Partilhar riders com outros utilizadores</li>
            <li>Aceder a bibliotecas de equipamentos</li>
          </ul>
        `
      },
      {
        title: "3. Criação de Conta",
        content: `
          <p>Para utilizar certas funcionalidades, deve criar uma conta:</p>
          <ul>
            <li>Forneça informações precisas e atualizadas</li>
            <li>Mantenha a confidencialidade das suas credenciais</li>
            <li>Notifique-nos imediatamente sobre uso não autorizado</li>
            <li>É responsável por todas as atividades na sua conta</li>
          </ul>
        `
      },
      {
        title: "4. Utilização Aceitável",
        content: `
          <p>Compromete-se a utilizar o serviço apenas para fins legais e aceitáveis:</p>
          <ul>
            <li>Não utilizar para atividades ilegais ou fraudulentas</li>
            <li>Não tentar aceder a sistemas ou dados não autorizados</li>
            <li>Não interferir com o funcionamento do serviço</li>
            <li>Não violar direitos de propriedade intelectual</li>
            <li>Não criar conteúdo ofensivo ou prejudicial</li>
          </ul>
        `
      },
      {
        title: "5. Conteúdo do Utilizador",
        content: `
          <p>Relativamente ao conteúdo que cria e carrega:</p>
          <ul>
            <li>Mantém a propriedade do seu conteúdo</li>
            <li>Concede-nos licença para processar e armazenar o conteúdo</li>
            <li>Garante que tem direitos sobre o conteúdo partilhado</li>
            <li>É responsável pela precisão e legalidade do conteúdo</li>
          </ul>
        `
      },
      {
        title: "6. Propriedade Intelectual",
        content: `
          <p>A plataforma e o seu conteúdo são protegidos por direitos autorais:</p>
          <ul>
            <li>O software e design são propriedade nossa</li>
            <li>As bibliotecas de equipamentos são licenciadas</li>
            <li>Não pode copiar, modificar ou distribuir sem autorização</li>
            <li>Pode utilizar o serviço para fins pessoais e comerciais legítimos</li>
          </ul>
        `
      },
      {
        title: "7. Subscrições e Pagamentos",
        content: `
          <p>Para funcionalidades Pro:</p>
          <ul>
            <li>Os preços são cobrados antecipadamente</li>
            <li>As subscrições renovam automaticamente</li>
            <li>Pode cancelar a qualquer momento</li>
            <li>Reembolsos são processados conforme a nossa política</li>
            <li>Utilizamos Stripe para processamento de pagamentos</li>
          </ul>
        `
      },
      {
        title: "8. Limitação de Responsabilidade",
        content: `
          <p>Na máxima extensão permitida por lei:</p>
          <ul>
            <li>Não somos responsáveis por danos indiretos ou consequenciais</li>
            <li>A nossa responsabilidade total é limitada ao valor pago</li>
            <li>Não garantimos disponibilidade contínua do serviço</li>
            <li>O serviço é fornecido "como está"</li>
          </ul>
        `
      },
      {
        title: "9. Indemnização",
        content: `
          <p>Concorda em indemnizar-nos contra:</p>
          <ul>
            <li>Utilização inadequada do serviço</li>
            <li>Violação destes termos</li>
            <li>Conteúdo que viole direitos de terceiros</li>
            <li>Danos causados pela sua utilização</li>
          </ul>
        `
      },
      {
        title: "10. Rescisão",
        content: `
          <p>Podemos rescindir ou suspender o acesso:</p>
          <ul>
            <li>Por violação destes termos</li>
            <li>Por atividade fraudulenta ou ilegal</li>
            <li>Por não pagamento de subscrições</li>
            <li>Com notificação prévia quando apropriado</li>
          </ul>
        `
      },
      {
        title: "11. Lei Aplicável",
        content: `
          <p>Estes termos são regidos pela legislação portuguesa. Qualquer disputa será resolvida nos tribunais portugueses.</p>
        `
      },
      {
        title: "12. Alterações aos Termos",
        content: `
          <p>Podemos modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação. O uso continuado constitui aceitação dos novos termos.</p>
        `
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
                {t('legal.title')}
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                {t('legal.description')}
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
                                 {t('legal.privacy')}
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
                 {t('legal.terms')}
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
                {t('legal.contactTitle')}
              </h3>
              <p className="text-gray-300 mb-6">
                {t('legal.contactDesc')}
              </p>
              <button className="btn-primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('legal.contactSupport')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default PrivacyTermsPage
