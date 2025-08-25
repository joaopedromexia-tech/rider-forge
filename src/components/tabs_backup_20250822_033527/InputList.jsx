import { useState, useEffect, useCallback, useMemo } from 'react'
import { useEquipment } from '../../context/EquipmentContext'
import SearchableDropdown from '../SearchableDropdown'
import FilterBar from '../FilterBar'
import { STAND_OPTIONS } from '../../data/equipmentLibrary'

function InputList({ data, onChange }) {
  const { isPro, getFilteredEquipment, updateFilters } = useEquipment()
  const [formData, setFormData] = useState({
    inputs: []
  })

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
      phantom: false
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
      phantom: false
    }))
    
    const newData = {
      ...formData,
      inputs: [...formData.inputs, ...newInputs]
    }
    setFormData(newData)
    onChange(newData)
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

  // Obter equipamentos filtrados (agora inclui todos os equipamentos)
  const microphones = getFilteredEquipment('mic')
  const diBoxes = getFilteredEquipment('di')

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Lista de Inputs</h2>
        <p className="text-gray-400">Configure os inputs da consola de som</p>
      </div>

      {/* Instruções Claras */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-blue-400 font-semibold mb-2">Como configurar os inputs:</h4>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• <strong>Fonte</strong> = O que está conectado (ex: vocal, guitarra, teclado)</p>
              <p>• <strong>Microfone/DI</strong> = Equipamento específico usado</p>
              <p>• <strong>Stand</strong> = Tipo de suporte (se aplicável)</p>
              <p>• <strong>Phantom</strong> = Alimentação phantom power (apenas para mics condensador)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <FilterBar 
        onFiltersChange={updateFilters}
      />

      {/* Ações Rápidas */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-green mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Ações Rápidas
        </h3>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={addInput}
            className="px-4 py-2 bg-accent-blue hover:bg-accent-blue/80 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Adicionar Input
          </button>
          
          <button
            onClick={() => addMultipleInputs(4)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            +4 Inputs
          </button>
          
          <button
            onClick={() => addMultipleInputs(8)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            +8 Inputs
          </button>
          
          <button
            onClick={() => addMultipleInputs(16)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            +16 Inputs
          </button>
        </div>
      </div>

      {/* Lista de Inputs */}
      <div className="bg-dark-800 rounded-lg border border-dark-700 overflow-hidden">
        <div className="bg-dark-900/50 px-6 py-4 border-b border-dark-700">
          <h3 className="text-xl font-semibold text-accent-blue flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Lista de Inputs
            <span className="text-gray-400 text-sm font-normal">({formData.inputs.length} inputs configurados)</span>
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-900/30">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  Canal
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  Fonte
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  Micro/DI
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  Stand
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  Phantom
                </th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-300 border-b border-dark-700">
                  Ações
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
                      <input
                        type="text"
                        value={input.fonte}
                        onChange={(e) => updateInput(input.id, 'fonte', e.target.value)}
                        placeholder="Ex: Kick, Snare, Vocal..."
                        className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                      />
                      {/* Tooltip para sugerir DI */}
                      {(() => {
                        const sourceLower = input.fonte.toLowerCase()
                        const needsDI = ['teclado', 'teclados', 'acústica', 'acústicas', 'track', 'tracks', 'playback'].some(term => sourceLower.includes(term))
                        
                        return needsDI ? (
                          <div className="absolute bottom-full left-0 mb-2 px-2 py-1 bg-blue-500 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                            Considere usar DI para esta fonte
                            <div className="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-500"></div>
                          </div>
                        ) : null
                      })()}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <SearchableDropdown
                      options={[...microphones, ...diBoxes]}
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
                      placeholder="Selecionar micro/DI..."
                      searchPlaceholder="Pesquisar equipamento..."
                      className="table-cell-dropdown"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      value={input.stand}
                      onChange={(e) => updateInput(input.id, 'stand', e.target.value)}
                      className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded text-gray-100 text-sm focus:outline-none focus:ring-1 focus:ring-accent-blue focus:border-transparent"
                    >
                      <option value="">Selecionar stand</option>
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
                      <span className="ml-2 text-sm text-gray-300">48V</span>
                    </label>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => removeInput(input.id)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200"
                      title="Remover input"
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

      {/* Botão Adicionar Input no final */}
      <div className="text-center">
        <button
          onClick={addInput}
          className="btn-secondary flex items-center gap-2 mx-auto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Adicionar Input
        </button>
      </div>
    </div>
  )
}

export default InputList
