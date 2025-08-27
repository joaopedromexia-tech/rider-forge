import { useState, useEffect, useCallback } from 'react'
import { useEquipment } from '../../context/EquipmentContext'
import FilterBar from '../FilterBar'
import { useI18n } from '../../context/I18nContext'

function MonitorMixes({ data, onChange, allData = {} }) {
  const { isPro, getFilteredEquipment, updateFilters } = useEquipment()
  const { t } = useI18n()
  const [formData, setFormData] = useState({
    mixes: []
  })
  const [showCommonMixes, setShowCommonMixes] = useState(false)

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

  const addMix = () => {
    const newMix = {
      id: Date.now().toString(),
      instrumentoMusico: '',
      tipo: 'iem', // Default to IEM
      formato: 'stereo', // Default to stereo
      canais: []
    }
    const newData = {
      ...formData,
      mixes: [...formData.mixes, newMix]
    }
    setFormData(newData)
    onChange(newData)
  }

  const removeMix = (index) => {
    const newData = {
      ...formData,
      mixes: formData.mixes.filter((_, i) => i !== index)
    }
    setFormData(newData)
    onChange(newData)
  }

  const updateMix = (index, field, value) => {
    const newData = {
      ...formData,
      mixes: formData.mixes.map((mix, i) => 
        i === index ? { ...mix, [field]: value } : mix
      )
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleFiltersChange = useCallback((filters) => {
    updateFilters(filters)
  }, [updateFilters])

  const tipoOptions = [
    { value: 'iem', label: t('tab.monitor.type.iem') },
    { value: 'wedge', label: t('tab.monitor.type.wedge') },
    { value: 'sidefill', label: t('tab.monitor.type.sidefill') }
  ]

  const formatoOptions = [
    { value: 'mono', label: t('tab.monitor.format.mono') },
    { value: 'stereo', label: t('tab.monitor.format.stereo') }
  ]

  // Validação de compatibilidade com inputs e sistemas de escuta
  const getMixValidation = () => {
    const totalMixes = formData.mixes.length
    const iemMixes = formData.mixes.filter(mix => mix.tipo === 'iem').length
    const wedgeMixes = formData.mixes.filter(mix => mix.tipo === 'wedge').length
    const sidefillMixes = formData.mixes.filter(mix => mix.tipo === 'sidefill').length
    
    const totalChannels = formData.mixes.reduce((sum, mix) => {
      return sum + (mix.formato === 'stereo' ? 2 : 1)
    }, 0)
    
    return {
      totalMixes,
      iemMixes,
      wedgeMixes,
      sidefillMixes,
      totalChannels,
      hasMixes: totalMixes > 0,
      hasIEMs: iemMixes > 0,
      hasWedges: wedgeMixes > 0,
      hasSidefills: sidefillMixes > 0
    }
  }

  // Sugestões de mixes baseadas em instrumentos musicais
  const getCommonMixSuggestions = () => {
    const suggestions = [
      {
        instrumentoMusico: t('tab.monitor.sugg.leadVocal'),
        tipo: 'iem',
        formato: 'stereo',
        canais: [t('channel.vocal'), t('channel.click'), t('channel.backVocal'), t('channel.guitar')]
      },
      {
        instrumentoMusico: t('tab.monitor.sugg.guitar'),
        tipo: 'iem',
        formato: 'stereo',
        canais: [t('channel.guitar'), t('channel.click'), t('channel.bass'), t('channel.vocal')]
      },
      {
        instrumentoMusico: t('tab.monitor.sugg.bass'),
        tipo: 'iem',
        formato: 'stereo',
        canais: [t('channel.bass'), t('channel.click'), t('channel.drums'), t('channel.guitar')]
      },
      {
        instrumentoMusico: t('tab.monitor.sugg.drums'),
        tipo: 'wedge',
        formato: 'stereo',
        canais: [t('channel.drums'), t('channel.click'), t('channel.bass'), t('channel.vocal')]
      },
      {
        instrumentoMusico: t('tab.monitor.sugg.keyboard'),
        tipo: 'iem',
        formato: 'stereo',
        canais: [t('channel.keyboard'), t('channel.click'), t('channel.vocal'), t('channel.guitar')]
      },
      {
        instrumentoMusico: t('tab.monitor.sugg.backVocal'),
        tipo: 'iem',
        formato: 'stereo',
        canais: [t('channel.backVocal'), t('channel.click'), t('tab.monitor.sugg.leadVocal'), t('channel.guitar')]
      },
      {
        instrumentoMusico: t('tab.monitor.sugg.percussion'),
        tipo: 'iem',
        formato: 'stereo',
        canais: [t('channel.percussion'), t('channel.click'), t('channel.drums'), t('channel.bass')]
      },
      {
        instrumentoMusico: t('tab.monitor.sugg.saxophone'),
        tipo: 'iem',
        formato: 'stereo',
        canais: [t('channel.saxophone'), t('channel.click'), t('channel.bass'), t('channel.drums')]
      }
    ]
    return suggestions
  }

  // Função para adicionar mix sugerida
  const addSuggestedMix = (suggestion) => {
    const newMix = {
      id: Date.now().toString(),
      instrumentoMusico: suggestion.instrumentoMusico,
      tipo: suggestion.tipo,
      formato: suggestion.formato,
      canais: suggestion.canais
    }
    const newData = {
      ...formData,
      mixes: [...formData.mixes, newMix]
    }
    setFormData(newData)
    onChange(newData)
  }

  // Verificar compatibilidade com sistemas de escuta
  const checkEscutaCompatibility = () => {
    // Conectar com SistemasEscuta
    const iemsQty = parseInt(allData['sistemas-escuta']?.iems?.quantidade || '0') || 0
    const wedgesQty = parseInt(allData['sistemas-escuta']?.wedges?.quantidade || '0') || 0
    const sidefillsQty = parseInt(allData['sistemas-escuta']?.sideFills?.quantidade || '0') || 0

    const hasIEMs = iemsQty > 0
    const hasWedges = wedgesQty > 0
    const hasSidefills = sidefillsQty > 0

    const mixValidation = getMixValidation()

    return {
      hasIEMs,
      hasWedges,
      hasSidefills,
      needsIEMs: mixValidation.hasIEMs && !hasIEMs,
      needsWedges: mixValidation.hasWedges && !hasWedges,
      needsSidefills: mixValidation.hasSidefills && !hasSidefills,
      isCompatible:
        (!mixValidation.hasIEMs || hasIEMs) &&
        (!mixValidation.hasWedges || hasWedges) &&
        (!mixValidation.hasSidefills || hasSidefills)
    }
  }

  const mixValidation = getMixValidation()
  const commonMixSuggestions = getCommonMixSuggestions()
  const escutaCompatibility = checkEscutaCompatibility()

  const getMixNumber = (index, formato) => {
    let channelNumber = 1
    
    // Calcula o número do canal baseado nas mixes anteriores
    for (let i = 0; i < index; i++) {
      const previousMix = formData.mixes[i]
      if (previousMix.formato === 'stereo') {
        channelNumber += 2 // Stereo usa 2 canais
      } else {
        channelNumber += 1 // Mono usa 1 canal
      }
    }
    
    if (formato === 'stereo') {
      const channel1 = channelNumber
      const channel2 = channelNumber + 1
      return `${channel1}/${channel2}`
    }
    return `${channelNumber}`
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('tab.monitor.title')}</h2>
        <p className="text-gray-400">{t('tab.monitor.subtitle')}</p>
      </div>

      {/* Progresso e Validação */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-400 font-semibold">{t('tab.monitor.progress.title')}</h4>
              <span className="text-blue-400 font-bold">{mixValidation.totalMixes === 0 ? 0 : Math.round((formData.mixes.filter(m => (m?.instrumentoMusico||'').trim() && m?.tipo && m?.formato).length / mixValidation.totalMixes) * 100)}%</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${mixValidation.totalMixes === 0 ? 0 : Math.round((formData.mixes.filter(m => (m?.instrumentoMusico||'').trim() && m?.tipo && m?.formato).length / mixValidation.totalMixes) * 100)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>{t('tab.monitor.progress.completed')}</strong> {formData.mixes.filter(m => (m?.instrumentoMusico||'').trim() && m?.tipo && m?.formato).length}/{mixValidation.totalMixes}
                </p>
                <div className="flex gap-1">
                  <div className={`w-3 h-3 rounded-full ${mixValidation.hasIEMs ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.listen.iems')}></div>
                  <div className={`w-3 h-3 rounded-full ${mixValidation.hasWedges ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.listen.wedges')}></div>
                  <div className={`w-3 h-3 rounded-full ${mixValidation.hasSidefills ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.listen.sidefills')}></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500" title={t('tab.monitor.channels')}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status e Sugestões */}
      <div className="space-y-4 mb-4">
        {/* Status dos Mixes */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-blue-400 font-semibold">{t('tab.monitor.status.title')}</h4>
            <span className="text-blue-400 font-bold">{mixValidation.totalMixes} {t('tab.monitor.status.mixes')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${mixValidation.hasIEMs ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{t('tab.listen.iems')}: {mixValidation.iemMixes}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${mixValidation.hasWedges ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{t('tab.listen.wedges')}: {mixValidation.wedgeMixes}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${mixValidation.hasSidefills ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">{t('tab.listen.sidefills')}: {mixValidation.sidefillMixes}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span className="text-gray-300">{t('tab.monitor.channels')}: {mixValidation.totalChannels}</span>
            </div>
          </div>
        </div>

        {/* Sugestões de Mixes Comuns */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-green-400 font-semibold">{t('tab.monitor.quick.title')}</h4>
            <button
              onClick={() => setShowCommonMixes(!showCommonMixes)}
              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg className={`w-4 h-4 transition-transform ${showCommonMixes ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showCommonMixes ? t('common.hide') : t('common.show')}
            </button>
          </div>
          {showCommonMixes && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonMixSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => addSuggestedMix(suggestion)}
                  className="text-left p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <div className="text-green-300 font-medium">{suggestion.instrumentoMusico}</div>
                  <div className="text-gray-300 text-sm capitalize">{t(`tab.monitor.type.${suggestion.tipo}`)} • {t(`tab.monitor.format.${suggestion.formato}`)}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    {suggestion.canais.slice(0, 2).join(', ')}
                    {suggestion.canais.length > 2 && '...'}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alertas de Compatibilidade */}
        {!escutaCompatibility.isCompatible && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-yellow-400 font-semibold">{t('tab.monitor.compat.title')}</h4>
                <p className="text-gray-300 text-sm">
                  {escutaCompatibility.needsIEMs && t('tab.monitor.compat.needsIems')}<br/>
                  {escutaCompatibility.needsWedges && t('tab.monitor.compat.needsWedges')}<br/>
                  {escutaCompatibility.needsSidefills && t('tab.monitor.compat.needsSidefills')}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Barra de Filtros */}
      <FilterBar 
        isPro={isPro}
        onFiltersChange={handleFiltersChange}
        className="mb-6"
      />

      {/* Lista de Mixes */}
      <div className="space-y-4">
        {formData.mixes.map((mix, index) => (
          <div key={mix.id} className="bg-dark-800/50 rounded-lg p-6 border border-dark-700/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-accent-blue">
                {t('tab.monitor.mix.label')} {getMixNumber(index, mix.formato)}
              </h3>
              <button
                onClick={() => removeMix(index)}
                className="text-red-400 hover:text-red-300 transition-colors duration-200"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('tab.monitor.instrument')}
                </label>
                <input
                  type="text"
                  value={mix.instrumentoMusico || ''}
                  onChange={(e) => updateMix(index, 'instrumentoMusico', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder={t('tab.monitor.instrument.placeholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('tab.monitor.type.title')}
                </label>
                <select
                  value={mix.tipo || 'iem'}
                  onChange={(e) => updateMix(index, 'tipo', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                >
                  {tipoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('tab.monitor.format.title')}
                </label>
                <select
                  value={mix.formato || 'stereo'}
                  onChange={(e) => updateMix(index, 'formato', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                >
                  {formatoOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}

        {/* Botão Adicionar Mix */}
        <button
          onClick={addMix}
          className="w-full p-4 border-2 border-dashed border-dark-600 rounded-lg text-gray-400 hover:text-gray-300 hover:border-dark-500 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {t('tab.monitor.add')}
        </button>
      </div>

      {/* Mensagem quando não há mixes */}
      {formData.mixes.length === 0 && (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-gray-500">{t('tab.monitor.none')}</p>
          <p className="text-gray-600 text-sm">{t('tab.monitor.none.cta')}</p>
        </div>
      )}
    </div>
  )
}

export default MonitorMixes
