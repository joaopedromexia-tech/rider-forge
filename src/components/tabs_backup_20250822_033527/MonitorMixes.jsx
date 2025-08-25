import { useState, useEffect, useCallback } from 'react'
import { useEquipment } from '../../context/EquipmentContext'
import FilterBar from '../FilterBar'

function MonitorMixes({ data, onChange }) {
  const { isPro, getFilteredEquipment, updateFilters } = useEquipment()
  const [formData, setFormData] = useState({
    mixes: []
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
    { value: 'iem', label: 'IEM (In-Ear Monitor)' },
    { value: 'wedge', label: 'Wedge Monitor' },
    { value: 'sidefill', label: 'Side Fill' }
  ]

  const formatoOptions = [
    { value: 'mono', label: 'Mono' },
    { value: 'stereo', label: 'Stereo' }
  ]

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
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Monitor Mixes</h2>
        <p className="text-gray-400">Configurações específicas de monitor para cada artista</p>
      </div>

      {/* Barra de Filtros */}
      <FilterBar 
        isPro={isPro}
        onFiltersChange={handleFiltersChange}
        className="mb-6"
      />

      {/* Lista de Mixes */}
      <div className="space-y-6">
        {formData.mixes.map((mix, index) => (
          <div key={mix.id} className="bg-dark-800 rounded-lg p-6 border border-dark-700">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-accent-blue">
                Mix {getMixNumber(index, mix.formato)}
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
                  Instrumento/Músico
                </label>
                <input
                  type="text"
                  value={mix.instrumentoMusico || ''}
                  onChange={(e) => updateMix(index, 'instrumentoMusico', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="ex: Vocalista, Guitarra, Bateria"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tipo de Mix
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
                  Formato
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
          Adicionar Mix
        </button>
      </div>

      {/* Mensagem quando não há mixes */}
      {formData.mixes.length === 0 && (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          <p className="text-gray-500">Nenhum mix configurado</p>
          <p className="text-gray-600 text-sm">Adicione mixes específicos para cada artista</p>
        </div>
      )}
    </div>
  )
}

export default MonitorMixes
