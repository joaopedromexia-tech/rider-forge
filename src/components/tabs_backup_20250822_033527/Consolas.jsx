import { useState, useEffect } from 'react'
import { getEquipmentByCategory } from '../../data/equipmentLibrary.js'
import { useRider } from '../../context/RiderContext'
import SearchableDropdown from '../SearchableDropdown'

function Consolas({ data, onChange }) {
  const { isPro } = useRider()
  
  const [formData, setFormData] = useState({
    foh: {
      consolaPreferida: {
        marca: '',
        modelo: '',
        observacoes: ''
      },
      outrasConsolas: [],
      novaConsola: {
        marca: '',
        modelo: '',
        observacoes: ''
      }
    },
    mon: {
      consolaPreferida: {
        marca: '',
        modelo: '',
        observacoes: ''
      },
      outrasConsolas: [],
      novaConsola: {
        marca: '',
        modelo: '',
        observacoes: ''
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
            observacoes: ''
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
            observacoes: ''
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



  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Consolas</h2>
        <p className="text-gray-400">Configure as consolas de som para FOH e Monitor</p>
      </div>

      {/* Instruções Claras */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <h4 className="text-blue-400 font-semibold mb-2">Como configurar as consolas:</h4>
            <div className="text-gray-300 text-sm space-y-1">
              <p>• <strong>Consola Preferida</strong> = A consola principal que deseja usar</p>
              <p>• <strong>Outras Consolas</strong> = Consolas alternativas aceites</p>
              <p>• <strong>FOH</strong> = Front of House (consola principal da sala)</p>
              <p>• <strong>MON</strong> = Monitor (consola para monitores de palco)</p>
            </div>
          </div>
        </div>
      </div>

      {/* FOH Section */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          FOH (Front of House)
          <span className="text-gray-400 text-sm font-normal">Consola Principal da Sala</span>
        </h3>

        {/* FOH Consola Preferida */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-200 mb-4">Consola Preferida</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Consola</label>
              <SearchableDropdown
                options={consoleEquipment}
                value={formData.foh.consolaPreferida.marca && formData.foh.consolaPreferida.modelo ? 
                  `${formData.foh.consolaPreferida.marca} ${formData.foh.consolaPreferida.modelo}` : ''}
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
                placeholder="Selecionar consola..."
                searchPlaceholder="Pesquisar consolas..."
              />
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
          <h4 className="text-lg font-medium text-gray-200 mb-4">Outras Consolas Aceites</h4>
          
          {/* Form to add new FOH console */}
          <div className="bg-dark-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Consola</label>
                <SearchableDropdown
                  options={consoleEquipment}
                  value={formData.foh.novaConsola.marca && formData.foh.novaConsola.modelo ? 
                    `${formData.foh.novaConsola.marca} ${formData.foh.novaConsola.modelo}` : ''}
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
                  placeholder="Selecionar consola..."
                  searchPlaceholder="Pesquisar consolas..."
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
                  Adicionar
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
          <span className="text-gray-400 text-sm font-normal">Consola para Monitores de Palco</span>
        </h3>

        {/* MON Consola Preferida */}
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-200 mb-4">Consola Preferida</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">Consola</label>
              <SearchableDropdown
                options={consoleEquipment}
                value={formData.mon.consolaPreferida.marca && formData.mon.consolaPreferida.modelo ? 
                  `${formData.mon.consolaPreferida.marca} ${formData.mon.consolaPreferida.modelo}` : ''}
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
                placeholder="Selecionar consola..."
                searchPlaceholder="Pesquisar consolas..."
              />
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
          <h4 className="text-lg font-medium text-gray-200 mb-4">Outras Consolas Aceites</h4>
          
          {/* Form to add new MON console */}
          <div className="bg-dark-700 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">Consola</label>
                <SearchableDropdown
                  options={consoleEquipment}
                  value={formData.mon.novaConsola.marca && formData.mon.novaConsola.modelo ? 
                    `${formData.mon.novaConsola.marca} ${formData.mon.novaConsola.modelo}` : ''}
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
                  placeholder="Selecionar consola..."
                  searchPlaceholder="Pesquisar consolas..."
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
                  Adicionar
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
