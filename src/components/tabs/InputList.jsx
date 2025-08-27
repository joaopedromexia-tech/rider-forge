import { useState, useEffect, useCallback, useMemo } from 'react'
import { useEquipment } from '../../context/EquipmentContext'
import SearchableDropdown from '../SearchableDropdown'
import FilterBar from '../FilterBar'
import { STAND_OPTIONS } from '../../data/equipmentLibrary'
import { inputsToCSV, csvToInputs } from '../../utils/csv'
import { useI18n } from '../../context/I18nContext'

function InputList({ data, onChange }) {
  const { t } = useI18n()
  const { isPro, getFilteredEquipment, updateFilters } = useEquipment()
  const [formData, setFormData] = useState({
    inputs: []
  })
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  useEffect(() => {
    if (data && data.inputs) {
      // Garantir que os canais estejam numerados corretamente
      const numberedInputs = data.inputs.map((input, index) => ({
        ...input,
        canal: (index + 1).toString()
      }))
      setFormData(prev => ({ ...prev, inputs: numberedInputs }))
    }
  }, [data])

  const addInput = () => {
    const newInput = {
      id: Date.now(),
      canal: (formData.inputs.length + 1).toString(),
      fonte: '',
      microDi: '',
      stand: '',
      phantom: false,
      supplier: false
    }
    const newData = {
      ...formData,
      inputs: [...formData.inputs, newInput]
    }
    setFormData(newData)
    onChange(newData)
  }

  const addMultipleInputs = (count) => {
    const newInputs = Array.from({ length: count }, (_, index) => ({
      id: Date.now() + index,
      canal: (formData.inputs.length + index + 1).toString(),
      fonte: '',
      microDi: '',
      stand: '',
      phantom: false,
      supplier: false
    }))
    
    const newData = {
      ...formData,
      inputs: [...formData.inputs, ...newInputs]
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleExportCSV = () => {
    try {
      const csv = inputsToCSV(formData.inputs)
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'input_list.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (e) {
      // noop
    }
  }

  const handleImportCSV = async (file) => {
    try {
      const text = await file.text()
      const imported = csvToInputs(text)
      const newData = { ...formData, inputs: imported.map((i, idx) => ({ ...i, canal: (idx + 1).toString() })) }
      setFormData(newData)
      onChange(newData)
    } catch (e) {
      // noop
    }
  }

  const removeInput = (id) => {
    const newData = {
      ...formData,
      inputs: formData.inputs.filter(input => input.id !== id)
    }
    // Renumerar os canais após remoção
    const renumberedData = {
      ...newData,
      inputs: newData.inputs.map((input, index) => ({
        ...input,
        canal: (index + 1).toString()
      }))
    }
    setFormData(renumberedData)
    onChange(renumberedData)
  }

  const updateInput = (id, field, value) => {
    const newData = {
      ...formData,
      inputs: formData.inputs.map(input => 
        input.id === id ? { ...input, [field]: value } : input
      )
    }
    setFormData(newData)
    onChange(newData)
  }

  // Obter equipamentos filtrados
  const microphones = getFilteredEquipment('mic')
  const diBoxes = getFilteredEquipment('di')

  // Combinar todos os equipamentos para o dropdown (incluindo XLR apenas uma vez)
  const allEquipment = [...microphones, ...diBoxes, {
    marca: "XLR",
    modelo: "Cabo XLR",
    categoria: "xlr",
    phantom: null,
    notas: t('equipment.xlr.cable')
  }]

  // Validação de capacidade da consola
  const getConsoleCapacity = () => {
    // Esta função seria conectada ao contexto das consolas
    // Por agora, vamos assumir uma capacidade padrão
    return 48 // Capacidade padrão
  }

  const consoleCapacity = getConsoleCapacity()
  const currentInputs = formData.inputs.length
  const isOverCapacity = currentInputs > consoleCapacity

  // Sugestões inteligentes baseadas na fonte
  const getSuggestions = (fonte) => {
    const sourceLower = fonte.toLowerCase()
    const suggestions = {
      microphones: [],
      diBoxes: [],
      stands: []
    }

    // Sugestões baseadas em instrumentos musicais
    if (sourceLower.includes('vocal') || sourceLower.includes('voz') || sourceLower.includes('microfone')) {
      suggestions.microphones = microphones.filter(mic => 
        mic.modelo.toLowerCase().includes('vocal') || 
        mic.modelo.toLowerCase().includes('condenser') ||
        mic.modelo.toLowerCase().includes('dynamic')
      )
    } else if (sourceLower.includes('kick') || sourceLower.includes('bombo') || sourceLower.includes('bateria')) {
      suggestions.microphones = microphones.filter(mic => 
        mic.modelo.toLowerCase().includes('kick') || 
        mic.modelo.toLowerCase().includes('bass') ||
        mic.modelo.toLowerCase().includes('drum')
      )
    } else if (sourceLower.includes('snare') || sourceLower.includes('caixa')) {
      suggestions.microphones = microphones.filter(mic => 
        mic.modelo.toLowerCase().includes('snare') || 
        mic.modelo.toLowerCase().includes('drum') ||
        mic.modelo.toLowerCase().includes('dynamic')
      )
    } else if (sourceLower.includes('guitar') || sourceLower.includes('guitarra') || sourceLower.includes('baixo')) {
      suggestions.diBoxes = diBoxes.filter(di => 
        di.modelo.toLowerCase().includes('guitar') || 
        di.modelo.toLowerCase().includes('instrument') ||
        di.modelo.toLowerCase().includes('passive')
      )
    } else if (sourceLower.includes('teclado') || sourceLower.includes('keyboard') || sourceLower.includes('piano')) {
      suggestions.diBoxes = diBoxes.filter(di => 
        di.modelo.toLowerCase().includes('instrument') || 
        di.modelo.toLowerCase().includes('active') ||
        di.modelo.toLowerCase().includes('keyboard')
      )
    } else if (sourceLower.includes('backing') || sourceLower.includes('playback') || sourceLower.includes('track')) {
      suggestions.diBoxes = diBoxes.filter(di => 
        di.modelo.toLowerCase().includes('line') || 
        di.modelo.toLowerCase().includes('active')
      )
    } else if (sourceLower.includes('violão') || sourceLower.includes('acústica')) {
      suggestions.microphones = microphones.filter(mic => 
        mic.modelo.toLowerCase().includes('condenser') || 
        mic.modelo.toLowerCase().includes('acoustic')
      )
    }

    return suggestions
  }

  // Função para aplicar sugestões automaticamente
  const applySuggestions = (inputId, fonte) => {
    const suggestions = getSuggestions(fonte)
    const input = formData.inputs.find(i => i.id === inputId)
    
    if (input && suggestions.microphones.length > 0) {
      updateInput(inputId, 'microDi', `${suggestions.microphones[0].marca} — ${suggestions.microphones[0].modelo}`)
      // Derivar phantom do equipamento selecionado
      updateInput(inputId, 'phantom', Boolean(suggestions.microphones[0].phantom))
    } else if (input && suggestions.diBoxes.length > 0) {
      updateInput(inputId, 'microDi', `${suggestions.diBoxes[0].marca} — ${suggestions.diBoxes[0].modelo}`)
      // Derivar phantom do equipamento selecionado (DI ativa/passiva)
      updateInput(inputId, 'phantom', Boolean(suggestions.diBoxes[0].phantom))
    }
  }

  // Calcular equipamento fornecido pela banda (apenas os com checkbox selecionada)
  const bandEquipment = formData.inputs.filter(input => input.supplier === true)
  
  // Função para verificar se um equipamento é um microfone
  const isMicrophone = (equipmentName) => {
    if (!equipmentName) return false
    
    // Verificar se contém marcas conhecidas de microfones
    const microphoneBrands = ['Shure', 'Sennheiser', 'Neumann', 'AKG', 'Audix', 'DPA', 'Rode', 'Electro-Voice', 'Telefunken', 'Universal Audio']
    const hasMicrophoneBrand = microphoneBrands.some(brand => equipmentName.includes(brand))
    
    // Verificar se não é DI ou XLR
    const isNotDI = !equipmentName.includes('DI')
    const isNotXLR = !equipmentName.includes('XLR')
    
    return hasMicrophoneBrand && isNotDI && isNotXLR
  }
  
  // Função para verificar se um equipamento é um DI
  const isDI = (equipmentName) => {
    if (!equipmentName) return false
    
    // Verificar se contém "DI" no nome
    const hasDI = equipmentName.includes('DI')
    
    // Verificar se contém marcas conhecidas de DI
    const diBrands = ['Radial', 'Countryman', 'Palmer', 'BSS', 'Whirlwind', 'Pro Co', 'Behringer', 'ART']
    const hasDIBrand = diBrands.some(brand => equipmentName.includes(brand))
    
    return hasDI || hasDIBrand
  }
  
  const bandMicrophones = bandEquipment.filter(input => 
    input.microDi && isMicrophone(input.microDi)
  )
  const bandDIs = bandEquipment.filter(input => 
    input.microDi && isDI(input.microDi)
  )
  const bandXLR = bandEquipment.filter(input => 
    input.microDi && input.microDi.includes('XLR — Cabo XLR')
  )

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">{t('tab.input.title')}</h2>
        <p className="text-gray-400">{t('tab.input.subtitle')}</p>
      </div>

      {/* Progresso e Validação */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-400 font-semibold">{t('tab.input.progress.title')}</h4>
              <span className="text-blue-400 font-bold">{formData.inputs.length === 0 ? 0 : Math.round((formData.inputs.filter(input => (input?.fonte || '').trim() && (input?.microDi || '').trim()).length / formData.inputs.length) * 100)}%</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${formData.inputs.length === 0 ? 0 : Math.round((formData.inputs.filter(input => (input?.fonte || '').trim() && (input?.microDi || '').trim()).length / formData.inputs.length) * 100)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>{t('tab.input.complete')}</strong> {formData.inputs.filter(input => (input?.fonte || '').trim() && (input?.microDi || '').trim()).length}/{formData.inputs.length}
                </p>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500" title={t('tab.input.progress.channels')}></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500" title={t('tab.input.progress.source')}></div>
                  <div className="w-3 h-3 rounded-full bg-blue-500" title={t('tab.input.progress.micdi')}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instruções Claras */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-blue-400 font-semibold mb-2">{t('tab.input.instructions')}</h4>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• <strong>{t('tab.input.instructions.source')}</strong></p>
              <p>• <strong>{t('tab.input.instructions.micdi')}</strong></p>
              <p>• <strong>{t('tab.input.instructions.stand')}</strong></p>
              <p>• <strong>{t('tab.input.instructions.phantom')}</strong></p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar 
        onFiltersChange={updateFilters}
      />

      {/* Ações Rápidas e Status */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-accent-green flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('tab.input.actions.quick')}
          </h3>
          
          {/* Status da Capacidade */}
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOverCapacity 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {t('tab.input.capacity', { current: currentInputs, capacity: consoleCapacity })}
            </div>
            {isOverCapacity && (
              <div className="flex items-center gap-1 text-red-400 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                {t('tab.input.overCapacity')}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={addInput}
            className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            {t('tab.input.add')}
          </button>
          
          <button
            onClick={() => setShowQuickAdd(!showQuickAdd)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className={`w-4 h-4 transition-transform ${showQuickAdd ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
            {t('tab.input.quick.add')} {showQuickAdd ? `(${t('tab.input.quick.add.hide')})` : `(${t('tab.input.quick.add.show')})`}
          </button>
          
          {showQuickAdd && (
            <>
              <button
                onClick={() => addMultipleInputs(4)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {t('tab.input.quick.add4')}
              </button>
              
              <button
                onClick={() => addMultipleInputs(8)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {t('tab.input.quick.add8')}
              </button>
              
              <button
                onClick={() => addMultipleInputs(16)}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                {t('tab.input.quick.add16')}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Lista de Inputs */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
        <div className="bg-dark-900/50 px-6 py-4 border-b border-dark-700">
          <h3 className="text-xl font-semibold text-accent-blue flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            {t('tab.input.title.list')}
            <span className="text-gray-400 text-sm font-normal">{t('tab.input.title.list.detail', { count: formData.inputs.length })}</span>
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-200 rounded-lg border border-dark-600 transition-colors"
            >
              {t('tab.input.exportCsv')}
            </button>
            <label className="px-3 py-2 bg-dark-700 hover:bg-dark-600 text-gray-200 rounded-lg border border-dark-600 transition-colors cursor-pointer">
              {t('tab.input.importCsv')}
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => e.target.files && e.target.files[0] && handleImportCSV(e.target.files[0])}
              />
            </label>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  {t('tab.input.table.channel')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  {t('tab.input.table.source')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  {t('tab.input.table.micDi')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  Stand
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">{t('tab.input.table.phantom')}</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  {t('tab.input.table.bandSupplies')}
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  {t('tab.input.table.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {formData.inputs.map((input, index) => (
                <tr key={input.id} className="hover:bg-dark-700/30 transition-colors duration-200">
                  <td className="px-4 py-3 text-sm text-gray-300 font-medium">
                    {input.canal}
                  </td>
                  <td className="px-4 py-3">
                    <div className="relative group">
                      <div className="relative">
                        <input
                          type="text"
                          value={input.fonte}
                          onChange={(e) => {
                            updateInput(input.id, 'fonte', e.target.value)
                            // Aplicar sugestões automaticamente após um delay
                            setTimeout(() => {
                              if (e.target.value && e.target.value.trim()) {
                                applySuggestions(input.id, e.target.value)
                              }
                            }, 1000)
                          }}
                          placeholder={t('tab.input.placeholder.source')}
                          className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                        />
                        {input.fonte && input.fonte.trim() && (
                          <button
                            onClick={() => applySuggestions(input.id, input.fonte)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-blue-400 hover:text-blue-300 transition-colors"
                            title={t('tab.input.tooltip.applyAuto')}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                          </button>
                        )}
                      </div>
                      {/* Tooltip para sugerir DI */}
                      {(() => {
                        const sourceLower = (input.fonte || '').toLowerCase()
                        const needsDI = ['teclado', 'teclados', 'acústica', 'acústicas', 'track', 'tracks', 'playback'].some(term => sourceLower.includes(term))
                        
                        return needsDI ? (
                          <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-blue-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            {t('tab.input.tooltip.considerDI')}
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                          </div>
                        ) : null
                      })()}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <SearchableDropdown
                      options={allEquipment}
                      value={input.microDi}
                      onChange={(option) => {
                        if (option) {
                          // Atualizar microDi e phantom numa única operação
                          const newInputs = formData.inputs.map(inputItem => {
                            if (inputItem.id === input.id) {
                              const updatedInput = {
                                ...inputItem,
                                microDi: `${option.marca} — ${option.modelo}`
                              }
                              // Auto-preencher phantom se o equipamento tiver essa informação
                              if (option.phantom !== null) {
                                updatedInput.phantom = option.phantom
                              }
                              return updatedInput
                            }
                            return inputItem
                          })
                          
                          const newData = {
                            ...formData,
                            inputs: newInputs
                          }
                          setFormData(newData)
                          onChange(newData)
                        } else {
                          // Limpar microDi numa única operação
                          const newInputs = formData.inputs.map(inputItem => 
                            inputItem.id === input.id 
                              ? { ...inputItem, microDi: '' }
                              : inputItem
                          )
                          
                          const newData = {
                            ...formData,
                            inputs: newInputs
                          }
                          setFormData(newData)
                          onChange(newData)
                        }
                      }}
                      placeholder={t('tab.input.select.micdi')}
                      searchPlaceholder={t('tab.input.search.equipment')}
                      className="table-cell-dropdown"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={input.stand}
                      onChange={(e) => updateInput(input.id, 'stand', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    >
                      <option value="">{t('tab.input.select.stand')}</option>
                      {STAND_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={input.phantom}
                        onChange={(e) => updateInput(input.id, 'phantom', e.target.checked)}
                        className="w-4 h-4 text-accent-blue bg-dark-700 border-dark-600 rounded focus:ring-accent-blue focus:ring-2"
                      />
                      <span className="ml-2 text-sm text-gray-300">{t('tab.input.phantom.voltage')}</span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={input.supplier}
                        onChange={(e) => updateInput(input.id, 'supplier', e.target.checked)}
                        className="w-4 h-4 text-accent-blue bg-dark-700 border-dark-600 rounded focus:ring-accent-blue focus:ring-2"
                        title={t('tab.input.table.bandSupplies')}
                      />
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeInput(input.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title={t('tab.input.remove')}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nota sobre equipamento fornecido pela banda */}
      {bandEquipment.length > 0 && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-yellow-400 font-semibold mb-2">{t('tab.input.bandSupplies.title')}</h4>
              {bandEquipment.length === formData.inputs.length ? (
                <p className="text-gray-300 text-sm">
                  {t('tab.input.bandSupplies.all')}
                </p>
              ) : (
                <div className="text-gray-300 text-sm space-y-1">
                  {(() => {
                    // Função para agrupar equipamentos por nome e contar quantidades
                    const groupEquipment = (equipmentList) => {
                      const grouped = {}
                      equipmentList.forEach(input => {
                        const name = input.microDi
                        grouped[name] = (grouped[name] || 0) + 1
                      })
                      return grouped
                    }
                    
                    const items = []
                    
                    if (bandMicrophones.length > 0) {
                      const groupedMics = groupEquipment(bandMicrophones)
                      const micItems = Object.entries(groupedMics).map(([name, count]) => 
                        count > 1 ? `${count}x "${name}"` : `"${name}"`
                      )
                      items.push(<p key="mics">• <strong>{t('tab.input.bandSupplies.mics')}:</strong> {micItems.join(', ')}</p>)
                    }
                    
                    if (bandDIs.length > 0) {
                      const groupedDIs = groupEquipment(bandDIs)
                      const diItems = Object.entries(groupedDIs).map(([name, count]) => 
                        count > 1 ? `${count}x "${name}"` : `"${name}"`
                      )
                      items.push(<p key="dis">• <strong>{t('tab.input.bandSupplies.dis')}:</strong> {diItems.join(', ')}</p>)
                    }
                    
                    if (bandXLR.length > 0) {
                      items.push(<p key="xlr">• <strong>{t('tab.input.bandSupplies.xlr')}:</strong> {bandXLR.length} {t('tab.input.bandSupplies.units')}</p>)
                    }
                    
                    return items
                  })()}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Botão Adicionar Input no final */}
      <div className="text-center">
        <button
          onClick={addInput}
          className="btn-secondary flex items-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {t('tab.input.add')}
        </button>
      </div>
    </div>
  )
}

export default InputList
