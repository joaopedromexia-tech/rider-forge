import { useState, useEffect } from 'react'
import { useI18n } from '../../context/I18nContext'
import { useRider } from '../../context/RiderContext'

function ObservacoesFinais({ data, onChange }) {
  const { isPro } = useRider()
  const { t } = useI18n()
  const [showTemplates, setShowTemplates] = useState(false)
  const [formData, setFormData] = useState({
    observacoes: ''
  })

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }))
    }
  }, [data])

  const handleChange = (field, value) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange(newData)
  }

  // Validação de completude das observações
  const getObservationsValidation = () => {
    const text = formData.observacoes.trim()
    const wordCount = text.split(/\s+/).filter(word => word.length > 0).length
    const charCount = text.length
    const lineCount = text.split('\n').length
    
    // Verificar se há informações essenciais
    const hasHorarios = /horário|schedule|setup|soundcheck/i.test(text)
    const hasEnergia = /energia|elétrica|power|voltage/i.test(text)
    const hasAcesso = /acesso|logística|loading|entrada/i.test(text)
    const hasEspecificos = /específico|particular|requisito/i.test(text)
    
    const essentialInfo = [hasHorarios, hasEnergia, hasAcesso, hasEspecificos].filter(Boolean).length
    
    return {
      wordCount,
      charCount,
      lineCount,
      hasHorarios,
      hasEnergia,
      hasAcesso,
      hasEspecificos,
      essentialInfo,
      isComplete: charCount >= 100 && essentialInfo >= 2,
      status: charCount === 0 ? 'empty' : 
              charCount < 50 ? 'minimal' : 
              charCount < 100 ? 'basic' : 
              essentialInfo < 2 ? 'detailed' : 'complete'
    }
  }

  // Sugestões de templates baseadas no tipo de performance musical
  const getTemplateSuggestions = () => {
    const templates = {
      festival: {
        title: t('tab.final.templates.festival.title'),
        content: t('tab.final.templates.festival.content')
      },
      sala: {
        title: t('tab.final.templates.sala.title'),
        content: t('tab.final.templates.sala.content')
      },
      acustico: {
        title: t('tab.final.templates.acustico.title'),
        content: t('tab.final.templates.acustico.content')
      }
    }
    return templates
  }

  // Função para aplicar template
  const applyTemplate = (templateType) => {
    const template = getTemplateSuggestions()[templateType]
    if (!template) return
    
    const newData = {
      ...formData,
      observacoes: template.content
    }
    setFormData(newData)
    onChange(newData)
  }

  // Verificar se há informações críticas faltando
  const getMissingInfo = () => {
    const validation = getObservationsValidation()
    const missing = []
    
    if (!validation.hasHorarios) missing.push(t('tab.final.missing.schedule'))
    if (!validation.hasEnergia) missing.push(t('tab.final.missing.power'))
    if (!validation.hasAcesso) missing.push(t('tab.final.missing.access'))
    if (!validation.hasEspecificos) missing.push(t('tab.final.missing.specifics'))
    
    return missing
  }

  const observationsValidation = getObservationsValidation()
  const templateSuggestions = getTemplateSuggestions()
  const missingInfo = getMissingInfo()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('tab.final.title')}</h2>
        <p className="text-gray-400">{t('tab.final.subtitle')}</p>
      </div>

      {/* Progresso e Validação */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-400 font-semibold">{t('tab.final.progress.title')}</h4>
              <span className="text-blue-400 font-bold">{Math.min(100, Math.round((observationsValidation.charCount/100)*100))}%</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, Math.round((observationsValidation.charCount/100)*100))}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>{t('tab.final.progress.essential')}</strong> {observationsValidation.essentialInfo}/4
                </p>
                <div className="flex gap-1">
                  <div className={`w-3 h-3 rounded-full ${observationsValidation.hasHorarios ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.final.tags.schedule')}></div>
                  <div className={`w-3 h-3 rounded-full ${observationsValidation.hasEnergia ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.final.tags.power')}></div>
                  <div className={`w-3 h-3 rounded-full ${observationsValidation.hasAcesso ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.final.tags.access')}></div>
                  <div className={`w-3 h-3 rounded-full ${observationsValidation.hasEspecificos ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.final.tags.specifics')}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status e Sugestões */}
      <div className="space-y-4 mb-6">
        {/* Status das Observações */}
        <div className={`border rounded-lg p-4 ${
          observationsValidation.status === 'complete' ? 'bg-green-500/10 border-green-500/20' :
          observationsValidation.status === 'detailed' ? 'bg-blue-500/10 border-blue-500/20' :
          observationsValidation.status === 'basic' ? 'bg-yellow-500/10 border-yellow-500/20' :
          'bg-gray-500/10 border-gray-500/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold ${
              observationsValidation.status === 'complete' ? 'text-green-400' :
              observationsValidation.status === 'detailed' ? 'text-blue-400' :
              observationsValidation.status === 'basic' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {t('tab.final.status.title')}
            </h4>
            <span className={`font-bold ${
              observationsValidation.status === 'complete' ? 'text-green-400' :
              observationsValidation.status === 'detailed' ? 'text-blue-400' :
              observationsValidation.status === 'basic' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {observationsValidation.wordCount} {t('tab.final.status.words')}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${observationsValidation.hasHorarios ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{t('tab.final.tags.schedule')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${observationsValidation.hasEnergia ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{t('tab.final.tags.power')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${observationsValidation.hasAcesso ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{t('tab.final.tags.access')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${observationsValidation.hasEspecificos ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{t('tab.final.tags.specifics')}</span>
            </div>
          </div>
        </div>

        {/* Templates de Performance */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-purple-400 font-semibold">{t('tab.final.templates.title')}</h4>
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg className={`w-4 h-4 transition-transform ${showTemplates ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showTemplates ? t('common.hide') : t('common.show')}
            </button>
          </div>
          {showTemplates && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(templateSuggestions).map(([type, template]) => (
                <button
                  key={type}
                  onClick={() => applyTemplate(type)}
                  className="text-left p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                >
                  <div className="text-purple-300 font-medium">{template.title}</div>
                  <div className="text-gray-300 text-sm">{t('tab.final.templates.structured')}</div>
                  <div className="text-gray-400 text-xs mt-1">{t('tab.final.templates.apply')}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Informações Faltando */}
        {missingInfo.length > 0 && (
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-orange-400 font-semibold">{t('tab.final.missing.title')}</h4>
                <p className="text-gray-300 text-sm">{t('tab.final.missing.consider')}: {missingInfo.join(', ')}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Campo de Observações */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent-blue">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="text-xl font-semibold">{t('tab.final.general.title')}</h3>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">{t('tab.final.general.notes')}</label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 resize-none"
              placeholder={t('tab.final.general.placeholder')}
            />
          </div>

          {/* Sugestões de Conteúdo */}
          <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {t('tab.final.suggestions.title')}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="space-y-2">
                <p className="font-medium text-gray-300">{t('tab.final.suggestions.special')}</p>
                <ul className="space-y-1 text-xs">
                  <li>• {t('tab.final.suggestions.items.setup')}</li>
                  <li>• {t('tab.final.suggestions.items.power')}</li>
                  <li>• {t('tab.final.suggestions.items.access')}</li>
                  <li>• {t('tab.final.suggestions.items.artistEquip')}</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-300">{t('tab.final.suggestions.config')}</p>
                <ul className="space-y-1 text-xs">
                  <li>• {t('tab.final.suggestions.items.pa')}</li>
                  <li>• {t('tab.final.suggestions.items.console')}</li>
                  <li>• {t('tab.final.suggestions.items.iem')}</li>
                  <li>• {t('tab.final.suggestions.items.repertoire')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contador de Caracteres */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>{formData.observacoes.length} {t('tab.final.counter.chars')}</span>
            <span>{Math.ceil(formData.observacoes.length / 50)} {t('tab.final.counter.lines')}</span>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {t('tab.final.tips.title')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="space-y-2">
            <p className="font-medium text-gray-300">{t('tab.final.tips.specific.title')}</p>
            <p className="text-xs">{t('tab.final.tips.specific.desc')}</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-300">{t('tab.final.tips.priority.title')}</p>
            <p className="text-xs">{t('tab.final.tips.priority.desc')}</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-300">{t('tab.final.tips.context.title')}</p>
            <p className="text-xs">{t('tab.final.tips.context.desc')}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ObservacoesFinais
