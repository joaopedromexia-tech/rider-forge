import { useState, useEffect } from 'react'
import { useRider } from '../../context/RiderContext'
import SearchableDropdown from '../SearchableDropdown'
import { getEquipmentByCategory } from '../../data/equipmentLibrary'

function SistemasEscuta({ data, onChange, allData = {} }) {
  const { isPro } = useRider()
  const [showQuickConfig, setShowQuickConfig] = useState(false)
  const [formData, setFormData] = useState({
    iems: {
      quantidade: '',
      modeloPreferido: '',
      observacoes: '',
      supplier: 'promoter'
    },
    sideFills: {
      quantidade: '',
      modelo: '',
      observacoes: '',
      supplier: 'promoter'
    },
    wedges: {
      quantidade: '',
      modelo: '',
      observacoes: '',
      supplier: 'promoter'
    },
    subs: [],
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

  const handleSystemChange = (systemType, field, value) => {
    const newData = {
      ...formData,
      [systemType]: {
        ...formData[systemType],
        [field]: value
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const addSub = () => {
    const newSub = {
      id: Date.now(),
      quantidade: '',
      modelo: '',
      paraInstrumento: '',
      observacoes: '',
      supplier: 'promoter'
    }
    const newData = {
      ...formData,
      subs: [...formData.subs, newSub]
    }
    setFormData(newData)
    onChange(newData)
  }

  const removeSub = (subId) => {
    const newData = {
      ...formData,
      subs: formData.subs.filter(sub => sub.id !== subId)
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleSubChange = (subId, field, value) => {
    const newData = {
      ...formData,
      subs: formData.subs.map(sub => 
        sub.id === subId ? { ...sub, [field]: value } : sub
      )
    }
    setFormData(newData)
    onChange(newData)
  }

  // Obter equipamentos por categoria
  const getEquipmentOptions = (category) => {
    return getEquipmentByCategory(category, true)
  }

  const iemOptions = getEquipmentOptions('iem')
  const sideFillOptions = getEquipmentOptions('sidefill')
  const wedgeOptions = getEquipmentOptions('wedge')

  // Validação dos sistemas
  const systemValidation = {
    hasIEMs: parseInt(formData.iems.quantidade) > 0,
    hasSideFills: parseInt(formData.sideFills.quantidade) > 0,
    hasWedges: parseInt(formData.wedges.quantidade) > 0,
    hasSubs: formData.subs.length > 0,
    totalIEMs: parseInt(formData.iems.quantidade) || 0,
    totalSideFills: parseInt(formData.sideFills.quantidade) || 0,
    totalWedges: parseInt(formData.wedges.quantidade) || 0,
    totalSubs: formData.subs.length,
    totalSystems: (parseInt(formData.iems.quantidade) > 0 ? 1 : 0) + 
                  (parseInt(formData.sideFills.quantidade) > 0 ? 1 : 0) + 
                  (parseInt(formData.wedges.quantidade) > 0 ? 1 : 0) + 
                  (formData.subs.length > 0 ? 1 : 0)
  }

  // Verificar se há mixes de monitor necessários
  const monitorMixesStatus = {
    needsMixes: systemValidation.totalIEMs > 0 && allData.monitorMixes?.mixes?.length === 0
  }

  // Sugestões por tipo de banda
  const bandTypeSuggestions = {
    'banda pequena': {
      description: 'Banda com 3-5 músicos',
      iems: '4-6',
      sideFills: '2',
      wedges: '4-6'
    },
    'banda média': {
      description: 'Banda com 6-8 músicos',
      iems: '6-8',
      sideFills: '2-4',
      wedges: '6-8'
    },
    'banda grande': {
      description: 'Banda com 9+ músicos',
      iems: '8-12',
      sideFills: '4',
      wedges: '8-12'
    }
  }

  const applyBandConfig = (type) => {
    const config = bandTypeSuggestions[type]
    if (config) {
      const newData = {
        ...formData,
        iems: { ...formData.iems, quantidade: config.iems.split('-')[0] },
        sideFills: { ...formData.sideFills, quantidade: config.sideFills.split('-')[0] },
        wedges: { ...formData.wedges, quantidade: config.wedges.split('-')[0] }
      }
      setFormData(newData)
      onChange(newData)
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Sistemas de Escuta</h2>
        <p className="text-gray-400">Configuração dos sistemas de monitor e IEM</p>
      </div>

      {/* Progresso e Validação */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-400 font-semibold">Progresso dos Sistemas</h4>
              <span className="text-blue-400 font-bold">{Math.round(((systemValidation.hasIEMs?1:0)+(systemValidation.hasWedges?1:0)+(systemValidation.hasSideFills?1:0)+(systemValidation.hasSubs?1:0))/4*100)}%</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((systemValidation.hasIEMs?1:0)+(systemValidation.hasWedges?1:0)+(systemValidation.hasSideFills?1:0)+(systemValidation.hasSubs?1:0))/4*100)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>Sistemas Configurados:</strong> {[systemValidation.hasIEMs, systemValidation.hasWedges, systemValidation.hasSideFills, systemValidation.hasSubs].filter(Boolean).length}/4
                </p>
                <div className="flex gap-1">
                  <div className={`w-3 h-3 rounded-full ${systemValidation.hasIEMs ? 'bg-green-500' : 'bg-gray-500'}`} title="IEMs"></div>
                  <div className={`w-3 h-3 rounded-full ${systemValidation.hasWedges ? 'bg-green-500' : 'bg-gray-500'}`} title="Wedges"></div>
                  <div className={`w-3 h-3 rounded-full ${systemValidation.hasSideFills ? 'bg-green-500' : 'bg-gray-500'}`} title="Side Fills"></div>
                  <div className={`w-3 h-3 rounded-full ${systemValidation.hasSubs ? 'bg-green-500' : 'bg-gray-500'}`} title="Subs"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status e Sugestões */}
      <div className="space-y-4 mb-6">
        {/* Status dos Sistemas */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-blue-400 font-semibold">Status dos Sistemas</h4>
            <span className="text-blue-400 font-bold">{systemValidation.totalSystems} sistemas configurados</span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemValidation.hasIEMs ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">IEMs: {systemValidation.totalIEMs}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemValidation.hasSideFills ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">Side Fills: {systemValidation.totalSideFills}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemValidation.hasWedges ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">Wedges: {systemValidation.totalWedges}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${systemValidation.hasSubs ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">Subs: {systemValidation.totalSubs}</span>
            </div>
          </div>
        </div>

        {/* Sugestões de Evento */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-green-400 font-semibold">Configurações Rápidas por Tipo de Banda</h4>
            <button
              onClick={() => setShowQuickConfig(!showQuickConfig)}
              className="px-3 py-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <svg className={`w-4 h-4 transition-transform ${showQuickConfig ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              {showQuickConfig ? 'Esconder' : 'Mostrar'}
            </button>
          </div>
          {showQuickConfig && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {Object.entries(bandTypeSuggestions).map(([type, config]) => (
                <button
                  key={type}
                  onClick={() => applyBandConfig(type)}
                  className="text-left p-3 bg-green-500/20 hover:bg-green-500/30 rounded-lg transition-colors"
                >
                  <div className="text-green-300 font-medium capitalize">{type}</div>
                  <div className="text-gray-300 text-sm">{config.description}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    IEMs: {config.iems} | Side Fills: {config.sideFills} | Wedges: {config.wedges}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Alerta de Mixes */}
        {monitorMixesStatus.needsMixes && (
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="text-yellow-400 font-semibold">Mixes de Monitor Necessários</h4>
                <p className="text-gray-300 text-sm">
                  Você configurou {systemValidation.totalIEMs} IEM(s) mas não há mixes de monitor criados. 
                  Configure os mixes na aba "Monitor Mixes".
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* IEMs */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          IEMs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
            <div className="relative group">
              <input
                type="number"
                value={formData.iems.quantidade}
                onChange={(e) => handleSystemChange('iems', 'quantidade', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                placeholder="ex: 8"
                min="0"
              />
              
              {/* Tooltip para IEM sem mix */}
              {parseInt(formData.iems.quantidade) > 0 && (
                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-yellow-500 text-black text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Lembre-se de criar mixes de monitor para os IEMs
                  <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-yellow-500"></div>
                </div>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
            <SearchableDropdown
              options={iemOptions}
              value={formData.iems.modeloPreferido}
              onChange={(option) => {
                if (option) {
                  handleSystemChange('iems', 'modeloPreferido', `${option.marca} — ${option.modelo}`)
                } else {
                  handleSystemChange('iems', 'modeloPreferido', '')
                }
              }}
              placeholder="Selecionar modelo IEM..."
              searchPlaceholder="Pesquisar IEM..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.iems.supplier}
              onChange={(e) => handleSystemChange('iems', 'supplier', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            >
              <option value="promoter">Fornecido pelo Promotor</option>
              <option value="band">Fornecido pela Banda</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
            <input
              type="text"
              value={formData.iems.observacoes}
              onChange={(e) => handleSystemChange('iems', 'observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Configuração e posicionamento"
            />
          </div>
        </div>
      </div>

      {/* Side Fills */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-green mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Side Fills
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
            <input
              type="number"
              value={formData.sideFills.quantidade}
              onChange={(e) => handleSystemChange('sideFills', 'quantidade', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="ex: 2"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
            <SearchableDropdown
              options={sideFillOptions}
              value={formData.sideFills.modelo}
              onChange={(option) => {
                if (option) {
                  handleSystemChange('sideFills', 'modelo', `${option.marca} — ${option.modelo}`)
                } else {
                  handleSystemChange('sideFills', 'modelo', '')
                }
              }}
              placeholder="Selecionar modelo Side Fill..."
              searchPlaceholder="Pesquisar Side Fill..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.sideFills.supplier}
              onChange={(e) => handleSystemChange('sideFills', 'supplier', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                          >
                <option value="promoter">Fornecido pelo Promotor</option>
                <option value="band">Fornecido pela Banda</option>
              </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
            <input
              type="text"
              value={formData.sideFills.observacoes}
              onChange={(e) => handleSystemChange('sideFills', 'observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Posicionamento e configuração"
            />
          </div>
        </div>
      </div>

      {/* Wedges */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Wedges
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
            <input
              type="number"
              value={formData.wedges.quantidade}
              onChange={(e) => handleSystemChange('wedges', 'quantidade', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="ex: 6"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
            <SearchableDropdown
              options={wedgeOptions}
              value={formData.wedges.modelo}
              onChange={(option) => {
                if (option) {
                  handleSystemChange('wedges', 'modelo', `${option.marca} — ${option.modelo}`)
                } else {
                  handleSystemChange('wedges', 'modelo', '')
                }
              }}
              placeholder="Selecionar modelo Wedge..."
              searchPlaceholder="Pesquisar Wedge..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.wedges.supplier}
              onChange={(e) => handleSystemChange('wedges', 'supplier', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            >
              <option value="promoter">Fornecido pelo Promotor</option>
              <option value="band">Fornecido pela Banda</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
            <input
              type="text"
              value={formData.wedges.observacoes}
              onChange={(e) => handleSystemChange('wedges', 'observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Posicionamento e configuração"
            />
          </div>
        </div>
      </div>

      {/* Subs */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            Subs
          </h3>
          <button
            onClick={addSub}
            className="btn-action flex items-center gap-2 px-4 py-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Adicionar Sub
          </button>
        </div>

        {formData.subs.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
            <p>Nenhum sub configurado</p>
            <p className="text-sm">Clique em "Adicionar Sub" para começar</p>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.subs.map((sub, index) => (
              <div key={sub.id} className="bg-dark-700 rounded-lg p-4 border border-dark-600">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-medium text-gray-200">Sub {index + 1}</h4>
                  <button
                    onClick={() => removeSub(sub.id)}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
                    <input
                      type="number"
                      value={sub.quantidade}
                      onChange={(e) => handleSubChange(sub.id, 'quantidade', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      placeholder="ex: 2"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
                    <input
                      type="text"
                      value={sub.modelo}
                      onChange={(e) => handleSubChange(sub.id, 'modelo', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      placeholder="ex: QSC KW181"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Para Instrumento</label>
                    <input
                      type="text"
                      value={sub.paraInstrumento}
                      onChange={(e) => handleSubChange(sub.id, 'paraInstrumento', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      placeholder="ex: Kick, Bass"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
                    <select
                      value={sub.supplier}
                      onChange={(e) => handleSubChange(sub.id, 'supplier', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    >
                      <option value="promoter">Promotor</option>
                      <option value="band">Banda</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
                    <input
                      type="text"
                      value={sub.observacoes}
                      onChange={(e) => handleSubChange(sub.id, 'observacoes', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      placeholder="Posicionamento"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Observações Gerais */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Observações Gerais
        </h3>
        <textarea
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 resize-none"
          placeholder="Informações adicionais sobre sistemas de escuta"
        />
      </div>
    </div>
  )
}

export default SistemasEscuta
