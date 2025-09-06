import React from 'react'
import { useI18n } from '../context/I18nContext'
import { XMarkIcon, SparklesIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, BugAntIcon } from '@heroicons/react/24/outline'

const ChangelogModal = ({ isOpen, onClose }) => {
  const { locale } = useI18n()

  if (!isOpen) return null

  const changelog = [
    {
      version: '1.0.0',
      date: 'December 2024',
      type: 'major',
      updates: [
        {
          type: 'feature',
          icon: SparklesIcon,
          title: locale === 'pt' ? 'Editor de Stage Plot' : 'Stage Plot Editor',
          description: locale === 'pt' 
            ? 'Crie diagramas de palco profissionais com equipamentos interativos. Arraste e solte equipamentos, configure posições e exporte como PNG.'
            : 'Create professional stage diagrams with interactive equipment. Drag and drop equipment, configure positions, and export as PNG.',
          details: locale === 'pt' 
            ? ['Editor visual intuitivo', 'Biblioteca de equipamentos', 'Exportação PNG', 'Limites por usuário (Free: 2, Pro: ilimitado)']
            : ['Intuitive visual editor', 'Equipment library', 'PNG export', 'User limits (Free: 2, Pro: unlimited)']
        },
        {
          type: 'improvement',
          icon: CheckCircleIcon,
          title: locale === 'pt' ? 'Performance Otimizada' : 'Performance Optimized',
          description: locale === 'pt'
            ? 'Carregamento 91% mais rápido com code splitting inteligente e lazy loading otimizado.'
            : '91% faster loading with intelligent code splitting and optimized lazy loading.',
          details: locale === 'pt'
            ? ['Bundle inicial reduzido de 2.4MB para 207KB', 'Carregamento progressivo', 'Preload inteligente', 'Loading states otimizados']
            : ['Initial bundle reduced from 2.4MB to 207KB', 'Progressive loading', 'Smart preloading', 'Optimized loading states']
        },
        {
          type: 'feature',
          icon: InformationCircleIcon,
          title: locale === 'pt' ? 'Importação de PDFs' : 'PDF Import',
          description: locale === 'pt'
            ? 'Importe riders técnicos a partir de arquivos PDF com processamento automático de texto.'
            : 'Import technical riders from PDF files with automatic text processing.',
          details: locale === 'pt'
            ? ['Processamento automático de PDFs', 'Preview antes da importação', 'Reconhecimento de seções', 'Validação de dados']
            : ['Automatic PDF processing', 'Preview before import', 'Section recognition', 'Data validation']
        },
        {
          type: 'improvement',
          icon: CheckCircleIcon,
          title: locale === 'pt' ? 'Interface Melhorada' : 'Enhanced Interface',
          description: locale === 'pt'
            ? 'Nova interface mais intuitiva, responsiva e acessível.'
            : 'New more intuitive, responsive, and accessible interface.',
          details: locale === 'pt'
            ? ['Design moderno', 'Melhor responsividade', 'Navegação por teclado', 'Suporte a temas']
            : ['Modern design', 'Better responsiveness', 'Keyboard navigation', 'Theme support']
        },
        {
          type: 'fix',
          icon: BugAntIcon,
          title: locale === 'pt' ? 'Correções de Bugs' : 'Bug Fixes',
          description: locale === 'pt'
            ? 'Múltiplas correções para melhorar a estabilidade e experiência do usuário.'
            : 'Multiple fixes to improve stability and user experience.',
          details: locale === 'pt'
            ? ['Correção de problemas de carregamento', 'Melhor tratamento de erros', 'Correção de problemas de autenticação', 'Otimização de memória']
            : ['Fixed loading issues', 'Better error handling', 'Fixed authentication problems', 'Memory optimization']
        }
      ]
    }
  ]

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
        
        {/* Modal */}
        <div className="relative bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SparklesIcon className="w-6 h-6" />
                <div>
                  <h2 className="font-semibold text-xl">
                    {locale === 'pt' ? 'Histórico de Atualizações' : 'Update History'}
                  </h2>
                  <p className="text-blue-100 text-sm">
                    {locale === 'pt' 
                      ? 'Veja todas as melhorias e novas funcionalidades'
                      : 'See all improvements and new features'
                    }
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 transition-colors duration-200"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            {changelog.map((version, versionIndex) => (
              <div key={versionIndex} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    v{version.version}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {version.date}
                  </span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs font-medium rounded-full">
                    {locale === 'pt' ? 'ATUALIZAÇÃO PRINCIPAL' : 'MAJOR UPDATE'}
                  </span>
                </div>

                <div className="space-y-6">
                  {version.updates.map((update, updateIndex) => {
                    const IconComponent = update.icon
                    return (
                      <div key={updateIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <div className={`flex-shrink-0 ${getUpdateIcon(update.type)}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
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
                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                              {update.description}
                            </p>
                            {update.details && (
                              <ul className="space-y-1">
                                {update.details.map((detail, detailIndex) => (
                                  <li key={detailIndex} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    {detail}
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {locale === 'pt' 
                  ? 'Obrigado por usar o Rider Forge!'
                  : 'Thank you for using Rider Forge!'
                }
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
              >
                {locale === 'pt' ? 'Fechar' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChangelogModal
