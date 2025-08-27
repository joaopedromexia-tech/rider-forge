import { useState, useEffect } from 'react'
import { getEquipmentByCategory } from '../../data/equipmentLibrary.js'
import { useRider } from '../../context/RiderContext'
import { useI18n } from '../../context/I18nContext'
import SearchableDropdown from '../SearchableDropdown'

function Consolas({ data, onChange }) {
  const { t } = useI18n()
  const { isPro } = useRider()
  const [showSuggestions, setShowSuggestions] = useState(false)
  
  const [formData, setFormData] = useState({
    foh: {
      consolaPreferida: {
        marca: '',
        modelo: '',
        observacoes: '',
        supplier: 'promoter'
      },
      outrasConsolas: [],
      novaConsola: {
        marca: '',
        modelo: '',
        observacoes: '',
        supplier: 'promoter'
      }
    },
    mon: {
      consolaPreferida: {
        marca: '',
        modelo: '',
        observacoes: '',
        supplier: 'promoter'
      },
      outrasConsolas: [],
      novaConsola: {
        marca: '',
        modelo: '',
        observacoes: '',
        supplier: 'promoter'
      }
    }
  })

  // Get all console equipment (including Pro for dropdown display)
  const consoleEquipment = getEquipmentByCategory('console', true) // Always include Pro for SearchableDropdown

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }))
    }
  }, [data])


  const handleFOHChange = (field, value) => {
    const newData = {
      ...formData,
      foh: {
        ...formData.foh,
        [field]: value
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleMONChange = (field, value) => {
    const newData = {
      ...formData,
      mon: {
        ...formData.mon,
        [field]: value
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleFOHConsolaPreferidaChange = (field, value) => {
    const newData = {
      ...formData,
      foh: {
        ...formData.foh,
        consolaPreferida: {
          ...formData.foh.consolaPreferida,
          [field]: value
        }
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleMONConsolaPreferidaChange = (field, value) => {
    const newData = {
      ...formData,
      mon: {
        ...formData.mon,
        consolaPreferida: {
          ...formData.mon.consolaPreferida,
          [field]: value
        }
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleFOHNovaConsolaChange = (field, value) => {
    const newData = {
      ...formData,
      foh: {
        ...formData.foh,
        novaConsola: {
          ...formData.foh.novaConsola,
          [field]: value
        }
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleMONNovaConsolaChange = (field, value) => {
    const newData = {
      ...formData,
      mon: {
        ...formData.mon,
        novaConsola: {
          ...formData.mon.novaConsola,
          [field]: value
        }
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const addFOHOutraConsola = () => {
    if (formData.foh.novaConsola.marca.trim() && formData.foh.novaConsola.modelo.trim()) {
      const newData = {
        ...formData,
        foh: {
          ...formData.foh,
          outrasConsolas: [...formData.foh.outrasConsolas, { ...formData.foh.novaConsola }],
          novaConsola: {
            marca: '',
            modelo: '',
            observacoes: '',
            supplier: 'promoter'
          }
        }
      }
      setFormData(newData)
      onChange(newData)
    }
  }

  const addMONOutraConsola = () => {
    if (formData.mon.novaConsola.marca.trim() && formData.mon.novaConsola.modelo.trim()) {
      const newData = {
        ...formData,
        mon: {
          ...formData.mon,
          outrasConsolas: [...formData.mon.outrasConsolas, { ...formData.mon.novaConsola }],
          novaConsola: {
            marca: '',
            modelo: '',
            observacoes: '',
            supplier: 'promoter'
          }
        }
      }
      setFormData(newData)
      onChange(newData)
    }
  }

  const removeFOHOutraConsola = (index) => {
    const newData = {
      ...formData,
      foh: {
        ...formData.foh,
        outrasConsolas: formData.foh.outrasConsolas.filter((_, i) => i !== index)
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const removeMONOutraConsola = (index) => {
    const newData = {
      ...formData,
      mon: {
        ...formData.mon,
        outrasConsolas: formData.mon.outrasConsolas.filter((_, i) => i !== index)
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  // Validação de compatibilidade entre consolas
  const getCompatibilityStatus = () => {
    const fohConsole = formData.foh.consolaPreferida
    const monConsole = formData.mon.consolaPreferida
    
    const hasFOH = fohConsole.marca && fohConsole.modelo
    const hasMON = monConsole.marca && monConsole.modelo
    
    if (!hasFOH && !hasMON) {
      return { status: 'warning', message: t('tab.consoles.status.none') }
    }
    
    if (hasFOH && !hasMON) {
      return { status: 'info', message: t('tab.consoles.status.onlyFOH') }
    }
    
    if (!hasFOH && hasMON) {
      return { status: 'info', message: t('tab.consoles.status.onlyMON') }
    }
    
    // Verificar se são da mesma marca (recomendado)
    if (fohConsole.marca === monConsole.marca) {
      return { status: 'success', message: t('tab.consoles.status.compatible') }
    }
    
    return { status: 'warning', message: t('tab.consoles.status.differentBrands') }
  }

  // Sugestões de configuração baseadas na consola FOH
  const getFOHSuggestions = () => {
    const fohConsole = formData.foh.consolaPreferida
    if (!fohConsole.marca) return []
    
    const suggestions = []

    const brand = fohConsole.marca
    const makeName = (model) => `${brand} ${model} ${t('tab.consoles.sugg.forMon')}`
    const sameFamily = t('tab.consoles.sugg.sameFamily', { brand })

    if (brand.toLowerCase().includes('midas')) {
      suggestions.push({ name: makeName('Pro Series'), reason: sameFamily })
      suggestions.push({ name: makeName('HD96'), reason: sameFamily })
      suggestions.push({ name: makeName('M32'), reason: sameFamily })
    } else if (brand.toLowerCase().includes('yamaha')) {
      suggestions.push({ name: makeName('CL5'), reason: sameFamily })
      suggestions.push({ name: makeName('DM7'), reason: sameFamily })
      suggestions.push({ name: makeName('QL5'), reason: sameFamily })
    } else if (brand.toLowerCase().includes('allen')) {
      suggestions.push({ name: makeName('dLive'), reason: sameFamily })
      suggestions.push({ name: makeName('Avantis'), reason: sameFamily })
      suggestions.push({ name: makeName('SQ7'), reason: sameFamily })
    } else if (brand.toLowerCase().includes('digico')) {
      suggestions.push({ name: makeName('SD12'), reason: sameFamily })
      suggestions.push({ name: makeName('SD7'), reason: sameFamily })
      suggestions.push({ name: makeName('SD9'), reason: sameFamily })
    } else if (brand.toLowerCase().includes('behringer')) {
      suggestions.push({ name: makeName('X32'), reason: sameFamily })
      suggestions.push({ name: makeName('Wing'), reason: sameFamily })
    } else if (brand.toLowerCase().includes('soundcraft')) {
      suggestions.push({ name: makeName('Vi3000'), reason: sameFamily })
      suggestions.push({ name: makeName('Si Expression'), reason: sameFamily })
    }

    return suggestions
  }

  const compatibilityStatus = getCompatibilityStatus()
  const fohSuggestions = getFOHSuggestions()


  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('tab.consoles.title')}</h2>
        <p className="text-gray-400">{t('tab.consoles.subtitle')}</p>
      </div>

      {/* Progresso e Validação */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-400 font-semibold">{t('tab.consoles.progress.title')}</h4>
              <span className="text-blue-400 font-bold">{Math.round((((formData.foh?.consolaPreferida?.marca && formData.foh?.consolaPreferida?.modelo) ? 1 : 0) + ((formData.mon?.consolaPreferida?.marca && formData.mon?.consolaPreferida?.modelo) ? 1 : 0)) / 2 * 100)}%</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.round((((formData.foh?.consolaPreferida?.marca && formData.foh?.consolaPreferida?.modelo) ? 1 : 0) + ((formData.mon?.consolaPreferida?.marca && formData.mon?.consolaPreferida?.modelo) ? 1 : 0)) / 2 * 100)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>{t('tab.consoles.progress.configured')}</strong> {((formData.foh?.consolaPreferida?.marca && formData.foh?.consolaPreferida?.modelo) ? 1 : 0) + ((formData.mon?.consolaPreferida?.marca && formData.mon?.consolaPreferida?.modelo) ? 1 : 0)}/2
                </p>
                <div className="flex gap-1">
                                      <div className={`w-3 h-3 rounded-full ${(formData.foh?.consolaPreferida?.marca && formData.foh?.consolaPreferida?.modelo) ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.consoles.foh.short')}></div>
                    <div className={`w-3 h-3 rounded-full ${(formData.mon?.consolaPreferida?.marca && formData.mon?.consolaPreferida?.modelo) ? 'bg-green-500' : 'bg-gray-500'}`} title={t('tab.consoles.mon.short')}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status e Sugestões */}
      <div className="space-y-4 mb-6">
        {/* Status de Compatibilidade */}
        <div className={`border rounded-lg p-4 ${
          compatibilityStatus.status === 'success' ? 'bg-green-500/10 border-green-500/20' :
          compatibilityStatus.status === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
          'bg-blue-500/10 border-blue-500/20'
        }`}>
          <div className="flex items-center gap-3">
            <svg className={`w-5 h-5 ${
              compatibilityStatus.status === 'success' ? 'text-green-400' :
              compatibilityStatus.status === 'warning' ? 'text-yellow-400' :
              'text-blue-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className={`font-semibold mb-1 ${
                compatibilityStatus.status === 'success' ? 'text-green-400' :
                compatibilityStatus.status === 'warning' ? 'text-yellow-400' :
                'text-blue-400'
              }`}>
                {t('tab.consoles.status.title')}
              </h4>
              <p className="text-gray-300 text-sm">{compatibilityStatus.message}</p>
            </div>
          </div>
        </div>

        {/* Sugestões de Consolas */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-purple-400 font-semibold">{t('tab.consoles.sugg.title')}</h4>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg className={`w-4 h-4 transition-transform ${showSuggestions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showSuggestions ? t('common.hide') : t('common.show')}
            </button>
          </div>
          {showSuggestions && (
            <div className="space-y-2">
              <p className="text-gray-300 text-sm mb-3">
                {t('tab.consoles.sugg.explainer')}
              </p>
              {fohSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    const [marca, modelo] = suggestion.name.split(' para MON')[0].split(' ')
                    const newData = {
                      ...formData,
                      mon: {
                        ...formData.mon,
                        consolaPreferida: {
                          ...formData.mon.consolaPreferida,
                          marca: marca,
                          modelo: modelo
                        }
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  }}
                  className="block w-full text-left p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                >
                  <div className="text-purple-300 font-medium">{suggestion.name}</div>
                  <div className="text-gray-400 text-xs mt-1">{suggestion.reason}</div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* FOH Section */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          FOH (Front of House)
                      <span className="text-gray-400 text-sm font-normal">{t('tab.consoles.foh.subtitle')}</span>
        </h3>

        {/* FOH Consola Preferida */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-200 mb-4">{t('tab.consoles.preferred')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('common.console')}</label>
              <SearchableDropdown
                options={consoleEquipment}
                value={formData.foh.consolaPreferida.marca && formData.foh.consolaPreferida.modelo ? 
                  `${formData.foh.consolaPreferida.marca} — ${formData.foh.consolaPreferida.modelo}` : ''}
                onChange={(option) => {
                  if (option) {
                    // Atualizar marca e modelo numa única operação
                    const newData = {
                      ...formData,
                      foh: {
                        ...formData.foh,
                        consolaPreferida: {
                          ...formData.foh.consolaPreferida,
                          marca: option.marca,
                          modelo: option.modelo
                        }
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  } else {
                    // Limpar marca e modelo numa única operação
                    const newData = {
                      ...formData,
                      foh: {
                        ...formData.foh,
                        consolaPreferida: {
                          ...formData.foh.consolaPreferida,
                          marca: '',
                          modelo: ''
                        }
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  }
                }}
                placeholder={t('common.selectConsole')}
                searchPlaceholder={t('common.searchConsoles')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">{t('supplier.label')}</label>
              <select
                value={formData.foh.consolaPreferida.supplier}
                onChange={(e) => handleFOHConsolaPreferidaChange('supplier', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              >
                <option value="promoter">{t('supplier.promoter')}</option>
                <option value="band">{t('supplier.band')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
              <input
                type="text"
                value={formData.foh.consolaPreferida.observacoes}
                onChange={(e) => handleFOHConsolaPreferidaChange('observacoes', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                placeholder="ex: Versão, configuração de cartões"
              />
            </div>
          </div>
        </div>

        {/* FOH Outras Consolas */}
        <div>
          <h4 className="text-lg font-medium text-gray-200 mb-4">{t('tab.consoles.accepted')}</h4>
          
          {/* Form to add new FOH console */}
          <div className="bg-dark-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Consola</label>
                <SearchableDropdown
                  options={consoleEquipment}
                  value={formData.foh.novaConsola.marca && formData.foh.novaConsola.modelo ? 
                    `${formData.foh.novaConsola.marca} — ${formData.foh.novaConsola.modelo}` : ''}
                  onChange={(option) => {
                    if (option) {
                      // Atualizar marca e modelo numa única operação
                      const newData = {
                        ...formData,
                        foh: {
                          ...formData.foh,
                          novaConsola: {
                            ...formData.foh.novaConsola,
                            marca: option.marca,
                            modelo: option.modelo
                          }
                        }
                      }
                      setFormData(newData)
                      onChange(newData)
                    } else {
                      // Limpar marca e modelo numa única operação
                      const newData = {
                        ...formData,
                        foh: {
                          ...formData.foh,
                          novaConsola: {
                            ...formData.foh.novaConsola,
                            marca: '',
                            modelo: ''
                          }
                        }
                      }
                      setFormData(newData)
                      onChange(newData)
                    }
                  }}
                  placeholder={t('common.selectConsole')}
                  searchPlaceholder={t('common.searchConsoles')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
                <input
                  type="text"
                  value={formData.foh.novaConsola.observacoes}
                  onChange={(e) => handleFOHNovaConsolaChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="ex: Versão, configuração"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addFOHOutraConsola}
                  disabled={!formData.foh.novaConsola.marca || !formData.foh.novaConsola.modelo}
                  className="w-full px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('common.add')}
                </button>
              </div>
            </div>
          </div>
          
          {/* List of added FOH consoles */}
          {formData.foh.outrasConsolas.length > 0 && (
            <div className="space-y-2">
              {formData.foh.outrasConsolas.map((consola, index) => (
                <div key={index} className="flex items-center justify-between bg-dark-700 rounded-lg px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-200 font-medium">{consola.marca} {consola.modelo}</span>
                      {consola.observacoes && (
                        <span className="text-gray-400 text-sm">({consola.observacoes})</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeFOHOutraConsola(index)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 ml-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MON Section */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-green mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          MON (Monitor)
          <span className="text-gray-400 text-sm font-normal">{t('tab.consoles.mon.subtitle')}</span>
        </h3>

        {/* MON Consola Preferida */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-200 mb-4">{t('tab.consoles.preferred')}</h4>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Consola</label>
              <SearchableDropdown
                options={consoleEquipment}
                value={formData.mon.consolaPreferida.marca && formData.mon.consolaPreferida.modelo ? 
                  `${formData.mon.consolaPreferida.marca} — ${formData.mon.consolaPreferida.modelo}` : ''}
                onChange={(option) => {
                  if (option) {
                    // Atualizar marca e modelo numa única operação
                    const newData = {
                      ...formData,
                      mon: {
                        ...formData.mon,
                        consolaPreferida: {
                          ...formData.mon.consolaPreferida,
                          marca: option.marca,
                          modelo: option.modelo
                        }
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  } else {
                    // Limpar marca e modelo numa única operação
                    const newData = {
                      ...formData,
                      mon: {
                        ...formData.mon,
                        consolaPreferida: {
                          ...formData.mon.consolaPreferida,
                          marca: '',
                          modelo: ''
                        }
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  }
                }}
                                  placeholder={t('common.selectConsole')}
                  searchPlaceholder={t('common.searchConsoles')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
              <select
                value={formData.mon.consolaPreferida.supplier}
                onChange={(e) => handleMONConsolaPreferidaChange('supplier', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200"
              >
                <option value="promoter">{t('supplier.promoter')}</option>
                <option value="band">{t('supplier.band')}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
              <input
                type="text"
                value={formData.mon.consolaPreferida.observacoes}
                onChange={(e) => handleMONConsolaPreferidaChange('observacoes', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200"
                placeholder="ex: Versão, configuração de cartões"
              />
            </div>
          </div>
        </div>

        {/* MON Outras Consolas */}
        <div>
          <h4 className="text-lg font-medium text-gray-200 mb-4">{t('tab.consoles.accepted')}</h4>
          
          {/* Form to add new MON console */}
          <div className="bg-dark-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Consola</label>
                <SearchableDropdown
                  options={consoleEquipment}
                  value={formData.mon.novaConsola.marca && formData.mon.novaConsola.modelo ? 
                    `${formData.mon.novaConsola.marca} — ${formData.mon.novaConsola.modelo}` : ''}
                  onChange={(option) => {
                    if (option) {
                      // Atualizar marca e modelo numa única operação
                      const newData = {
                        ...formData,
                        mon: {
                          ...formData.mon,
                          novaConsola: {
                            ...formData.mon.novaConsola,
                            marca: option.marca,
                            modelo: option.modelo
                          }
                        }
                      }
                      setFormData(newData)
                      onChange(newData)
                    } else {
                      // Limpar marca e modelo numa única operação
                      const newData = {
                        ...formData,
                        mon: {
                          ...formData.mon,
                          novaConsola: {
                            ...formData.mon.novaConsola,
                            marca: '',
                            modelo: ''
                          }
                        }
                      }
                      setFormData(newData)
                      onChange(newData)
                    }
                  }}
                  placeholder={t('common.selectConsole')}
                  searchPlaceholder={t('common.searchConsoles')}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
                <input
                  type="text"
                  value={formData.mon.novaConsola.observacoes}
                  onChange={(e) => handleMONNovaConsolaChange('observacoes', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200"
                  placeholder="ex: Versão, configuração"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addMONOutraConsola}
                  disabled={!formData.mon.novaConsola.marca || !formData.mon.novaConsola.modelo}
                  className="w-full px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-accent-green/80 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  {t('common.add')}
                </button>
              </div>
            </div>
          </div>
          
          {/* List of added MON consoles */}
          {formData.mon.outrasConsolas.length > 0 && (
            <div className="space-y-2">
              {formData.mon.outrasConsolas.map((consola, index) => (
                <div key={index} className="flex items-center justify-between bg-dark-700 rounded-lg px-4 py-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <span className="text-gray-200 font-medium">{consola.marca} {consola.modelo}</span>
                      {consola.observacoes && (
                        <span className="text-gray-400 text-sm">({consola.observacoes})</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => removeMONOutraConsola(index)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200 ml-4"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Consolas
