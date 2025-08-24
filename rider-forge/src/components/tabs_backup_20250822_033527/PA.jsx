import { useState, useEffect } from 'react'
import { useRider } from '../../context/RiderContext'
import SearchableDropdown from '../SearchableDropdown'
import { getEquipmentByCategory } from '../../data/equipmentLibrary'

function PA({ data, onChange }) {
  const { isPro } = useRider()
  
  // Obter equipamentos de PA da biblioteca
  const paEquipment = getEquipmentByCategory('pa', true) // Incluir todos os equipamentos

  // Processadores de Sistema - FREE/PRO
  const SYSTEM_PROCESSORS = {
    FREE: [
      { marca: 'Lake', modelo: 'LM44', isPro: false },
      { marca: 'Lake', modelo: 'LM26', isPro: false },
      { marca: 'XTA', modelo: 'DP448', isPro: false },
      { marca: 'XTA', modelo: 'DP226', isPro: false },
      { marca: 'BSS', modelo: 'Soundweb London', isPro: false },
      { marca: 'BSS', modelo: 'BLU-100', isPro: false },
      { marca: 'L-Acoustics', modelo: 'P1', isPro: false },
      { marca: 'Meyer Sound', modelo: 'Galileo 616', isPro: false }
    ],
    PRO: [
      { marca: 'Lake', modelo: 'LM44', isPro: true },
      { marca: 'Lake', modelo: 'LM26', isPro: true },
      { marca: 'Lake', modelo: 'LM32', isPro: true },
      { marca: 'Lake', modelo: 'LM16', isPro: true },
      { marca: 'XTA', modelo: 'DP448', isPro: true },
      { marca: 'XTA', modelo: 'DP226', isPro: true },
      { marca: 'XTA', modelo: 'DP424', isPro: true },
      { marca: 'XTA', modelo: 'DP200', isPro: true },
      { marca: 'BSS', modelo: 'Soundweb London', isPro: true },
      { marca: 'BSS', modelo: 'BLU-100', isPro: true },
      { marca: 'BSS', modelo: 'BLU-50', isPro: true },
      { marca: 'BSS', modelo: 'BLU-32', isPro: true },
      { marca: 'BSS', modelo: 'BLU-16', isPro: true },
      { marca: 'Symetrix', modelo: 'Radius 12x8', isPro: true },
      { marca: 'Symetrix', modelo: 'Radius 8x8', isPro: true },
      { marca: 'Symetrix', modelo: 'Radius 4x4', isPro: true },
      { marca: 'Symetrix', modelo: 'Prism 8x8', isPro: true },
      { marca: 'Symetrix', modelo: 'Prism 4x4', isPro: true },
      { marca: 'dbx', modelo: 'Driverack PA2', isPro: true },
      { marca: 'dbx', modelo: 'Driverack VENU360', isPro: true },
      { marca: 'dbx', modelo: 'Driverack 4820', isPro: true },
      { marca: 'dbx', modelo: 'Driverack 4800', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 4.24M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 4.8SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 3.6CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 2.24M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 2.8SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 1.24M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 1.8SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 1.6CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 1.2CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 1.1CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 1.0CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.8CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.6CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.4CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.2CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.1CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.0CL', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.8SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.6SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.4SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.2SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.1SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.0SP', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.8M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.6M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.4M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.2M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.1M', isPro: true },
      { marca: 'Ashly', modelo: 'Protea 0.0M', isPro: true },
      { marca: 'L-Acoustics', modelo: 'P1', isPro: true },
      { marca: 'Meyer Sound', modelo: 'Galileo 616', isPro: true }
    ]
  }

  const [formData, setFormData] = useState({
    // Requisitos Gerais - Redesenhado
    generalRequirements: {
      // Especificações de Performance
      performance: {
        splAtFOH: '110',
        splUnit: 'dB(A)',
        uniformity: '±3',
        uniformityUnit: 'dB',
        frequencyResponse: {
          low: '40',
          high: '16000',
          unit: 'Hz'
        },
        phaseAlignment: true, // Padrão de qualidade
        noiseFree: true // Padrão de qualidade
      },
      
      // Configuração do Sistema
      systemConfig: {
        lineArrayRequired: true, // Obrigatório por defeito
        suspensionRequired: true, // Obrigatório por defeito
        towerMounting: true // Imprescindível por defeito
      },
      
      // Cobertura e Distribuição
      coverage: {
        audienceDepth: '',
        audienceWidth: '',
        delayZones: 0,
        coverageNotes: ''
      },
      
      // Processamento e Controle
      processing: {
        systemProcessor: '',
        roomTuning: true, // Essencial por defeito
        measurementSystem: '',
        processingNotes: ''
      }
    },
    
    // Sistema principal - lista de marcas/modelos aceites
    mainSystem: {
      acceptedSystems: [],
      newBrand: '',
      newModel: ''
    },
    
    // Subwoofers
    subwoofers: {
      required: true,
      mountingTypes: {
        arcDelay: false,
        cardioide: false,
        endFire: false
      },
      crossoverFrequency: 80,
      crossoverEnabled: false,
      notes: ''
    },
    
    // Front Fill
    frontFillRequired: true,
    frontFillCoverage: '5m',
    frontFillNotes: '',
    
    // Out Fill - Removido
    // Sistema Delay - Removido
    
    // Rigging
    riggingNotes: '',
    
    // Observações gerais
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

  const handleNestedChange = (section, subsection, field, value) => {
    const newData = {
      ...formData,
      [section]: {
        ...formData[section],
        [subsection]: {
          ...formData[section][subsection],
          [field]: value
        }
      }
    }
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

  const handleConditionChange = (conditionType, field, value) => {
    let newData
    if (conditionType === 'mountingTypes') {
      // Para tipos de montagem de subs, acessar através de subwoofers
      // Quando um tipo é selecionado, desmarcar os outros
      newData = {
        ...formData,
        subwoofers: {
          ...formData.subwoofers,
          mountingTypes: {
            arcDelay: field === 'arcDelay' ? value : false,
            cardioide: field === 'cardioide' ? value : false,
            endFire: field === 'endFire' ? value : false
          }
        }
      }
    } else {
      // Para outras condições (outFillConditions, delayConditions)
      newData = {
        ...formData,
        [conditionType]: {
          ...formData[conditionType],
          [field]: value
        }
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const addMainSystem = () => {
    if (formData.mainSystem.newBrand.trim() && formData.mainSystem.newModel.trim()) {
      const newSystem = `${formData.mainSystem.newBrand} ${formData.mainSystem.newModel}`
      const updatedSystems = [...formData.mainSystem.acceptedSystems, newSystem]
      
      const newData = {
        ...formData,
        mainSystem: {
          ...formData.mainSystem,
          acceptedSystems: updatedSystems,
          newBrand: '',
          newModel: ''
        }
      }
      setFormData(newData)
      onChange(newData)
    }
  }



  const removeMainSystem = (index) => {
    const updatedSystems = formData.mainSystem.acceptedSystems.filter((_, i) => i !== index)
    const newData = {
      ...formData,
      mainSystem: {
        ...formData.mainSystem,
        acceptedSystems: updatedSystems
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  // Helper para aplicar o estilo visual dos cards baseado no estado
  const getCardStyle = (isSelected, colorClass) => {
    const baseClass = `bg-gradient-to-r border rounded-lg p-3 transition-all duration-200`
    const selectedClass = `${colorClass}/20 border-${colorClass}/40`
    const unselectedClass = `${colorClass}/10 border-${colorClass}/20`
    return `${baseClass} ${isSelected ? selectedClass : unselectedClass}`
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">PA - Sistema de Som</h2>
        <p className="text-gray-400">Especificações do sistema de som principal</p>
      </div>

      {/* Requisitos Gerais - Redesenhado */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Requisitos Gerais
        </h3>
        
        {/* Instruções Claras */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h4 className="text-blue-400 font-semibold mb-2">Como usar esta seção:</h4>
              <div className="text-gray-300 text-sm space-y-1 mb-3">
                <p>• <strong>Marque TODAS as opções</strong> que são requisitos para o seu evento</p>
                <p>• <strong>OBRIGATÓRIO</strong> = Deve estar presente (vermelho)</p>
                <p>• <strong>IMPRESCINDÍVEL</strong> = Criticamente importante (laranja)</p>
                <p>• <strong>ESSENCIAL</strong> = Altamente recomendado (laranja)</p>
                <p>• <strong>QUALIDADE</strong> = Padrão profissional (verde)</p>
              </div>
              
              {/* Botões de Ação Rápida */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    const newData = {
                      ...formData,
                      generalRequirements: {
                        ...formData.generalRequirements,
                        systemConfig: {
                          lineArrayRequired: true,
                          suspensionRequired: true,
                          towerMounting: true
                        },
                        performance: {
                          ...formData.generalRequirements.performance,
                          phaseAlignment: true,
                          noiseFree: true
                        },
                        processing: {
                          ...formData.generalRequirements.processing,
                          roomTuning: true
                        }
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  }}
                  className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  ✓ Selecionar Padrão Profissional
                </button>
                
                <button
                  onClick={() => {
                    const newData = {
                      ...formData,
                      generalRequirements: {
                        ...formData.generalRequirements,
                        systemConfig: {
                          lineArrayRequired: false,
                          suspensionRequired: false,
                          towerMounting: false
                        },
                        performance: {
                          ...formData.generalRequirements.performance,
                          phaseAlignment: false,
                          noiseFree: false
                        },
                        processing: {
                          ...formData.generalRequirements.processing,
                          roomTuning: false
                        }
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  }}
                  className="px-3 py-1.5 bg-gray-600 hover:bg-gray-700 text-white text-xs font-medium rounded-lg transition-colors"
                >
                  ✗ Limpar Todas as Opções
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Especificações de Performance */}
          <div className="space-y-6">
            <div className="bg-dark-750 rounded-lg p-4 border border-dark-600">
              <h4 className="text-lg font-medium text-accent-green mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Especificações de Performance
              </h4>
              
              <div className="space-y-4">
                {/* SPL e Uniformidade */}
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded">NÍVEIS</span>
                    <span className="text-gray-100 font-medium">Especificações de Nível</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">SPL na Regie</label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={formData.generalRequirements.performance.splAtFOH}
                          onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'splAtFOH', e.target.value)}
                          className="flex-1 px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="110"
                        />
                        <select
                          value={formData.generalRequirements.performance.splUnit}
                          onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'splUnit', e.target.value)}
                          className="px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="dB(A)">dB(A)</option>
                          <option value="dB(C)">dB(C)</option>
                          <option value="dB(Z)">dB(Z)</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Uniformidade</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={formData.generalRequirements.performance.uniformity}
                          onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'uniformity', e.target.value)}
                          className="flex-1 px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="±3"
                        />
                        <select
                          value={formData.generalRequirements.performance.uniformityUnit}
                          onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'uniformityUnit', e.target.value)}
                          className="px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="dB">dB</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resposta em Frequência */}
                <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-green-400 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded">FREQUÊNCIA</span>
                    <span className="text-gray-100 font-medium">Resposta em Frequência</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={formData.generalRequirements.performance.frequencyResponse.low}
                      onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'frequencyResponse', {
                        ...formData.generalRequirements.performance.frequencyResponse,
                        low: e.target.value
                      })}
                      className="w-20 px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="40"
                    />
                    <span className="text-gray-400 text-sm">Hz -</span>
                    <input
                      type="number"
                      value={formData.generalRequirements.performance.frequencyResponse.high}
                      onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'frequencyResponse', {
                        ...formData.generalRequirements.performance.frequencyResponse,
                        high: e.target.value
                      })}
                      className="w-20 px-3 py-2 bg-dark-700 border border-green-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="16000"
                    />
                    <span className="text-gray-400 text-sm">Hz</span>
                  </div>
                </div>

                {/* Checkboxes de Performance */}
                <div className="space-y-3">
                  {/* Sistemas Alinhados em Fase */}
                  <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="phaseAlignment"
                        checked={formData.generalRequirements.performance.phaseAlignment}
                        onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'phaseAlignment', e.target.checked)}
                        className="w-4 h-4 text-green-500 bg-dark-700 border-green-500/50 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-green-400 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded">QUALIDADE</span>
                          <span className="text-gray-100 font-medium">Sistemas Alinhados em Fase</span>
                        </div>
                        <p className="text-gray-400 text-sm">Todos os sistemas devem estar alinhados em fase para evitar cancelamentos</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Sistemas Isentos de Ruído */}
                  <div className="bg-gradient-to-r from-green-500/10 to-green-600/10 border border-green-500/20 rounded-lg p-3">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="noiseFree"
                        checked={formData.generalRequirements.performance.noiseFree}
                        onChange={(e) => handleNestedChange('generalRequirements', 'performance', 'noiseFree', e.target.checked)}
                        className="w-4 h-4 text-green-500 bg-dark-700 border-green-500/50 rounded focus:ring-green-500 focus:ring-2"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-green-400 text-xs font-semibold bg-green-500/20 px-2 py-1 rounded">QUALIDADE</span>
                          <span className="text-gray-100 font-medium">Sistemas Isentos de Ruído</span>
                        </div>
                        <p className="text-gray-400 text-sm">Sistemas devem estar livres de ruído de fundo e interferências</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Cobertura e Distribuição */}
            <div className="bg-dark-750 rounded-lg p-4 border border-dark-600">
              <h4 className="text-lg font-medium text-purple-400 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                Cobertura e Distribuição
              </h4>
              
              <div className="space-y-4">
                {/* Dimensões da Audiência */}
                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-purple-400 text-xs font-semibold bg-purple-500/20 px-2 py-1 rounded">DIMENSÕES</span>
                    <span className="text-gray-100 font-medium">Área de Cobertura</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Profundidade (m)</label>
                      <input
                        type="text"
                        value={formData.generalRequirements.coverage.audienceDepth}
                        onChange={(e) => handleNestedChange('generalRequirements', 'coverage', 'audienceDepth', e.target.value)}
                        className="w-full px-3 py-2 bg-dark-700 border border-purple-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        placeholder="ex: 50"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Largura (m)</label>
                      <input
                        type="text"
                        value={formData.generalRequirements.coverage.audienceWidth}
                        onChange={(e) => handleNestedChange('generalRequirements', 'coverage', 'audienceWidth', e.target.value)}
                        className="w-full px-3 py-2 bg-dark-700 border border-purple-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                        placeholder="ex: 30"
                      />
                    </div>
                  </div>
                </div>

                {/* Zonas de Delay */}
                <div className="bg-gradient-to-r from-purple-500/10 to-purple-600/10 border border-purple-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-purple-400 text-xs font-semibold bg-purple-500/20 px-2 py-1 rounded">DELAY</span>
                    <span className="text-gray-100 font-medium">Zonas de Delay</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Número de Zonas</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.generalRequirements.coverage.delayZones}
                      onChange={(e) => handleNestedChange('generalRequirements', 'coverage', 'delayZones', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 bg-dark-700 border border-purple-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Configuração do Sistema */}
          <div className="bg-dark-750 rounded-lg p-4 border border-dark-600">
            <h4 className="text-lg font-medium text-accent-blue mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              Configuração do Sistema
            </h4>
            
            <div className="space-y-4">
              {/* Sistema Line Array - Obrigatório */}
              <div className={`bg-gradient-to-r ${formData.generalRequirements.systemConfig.lineArrayRequired ? 'from-red-500/20 to-red-600/20 border-red-500/40' : 'from-red-500/10 to-red-600/10 border-red-500/20'} border rounded-lg p-3 transition-all duration-200`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="lineArrayRequired"
                    checked={formData.generalRequirements.systemConfig.lineArrayRequired}
                    onChange={(e) => handleNestedChange('generalRequirements', 'systemConfig', 'lineArrayRequired', e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-dark-700 border-red-500/50 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-400 text-xs font-semibold bg-red-500/20 px-2 py-1 rounded">OBRIGATÓRIO</span>
                      <span className="text-gray-100 font-medium">Sistema Line Array</span>
                      {formData.generalRequirements.systemConfig.lineArrayRequired && (
                        <span className="text-green-400 text-xs">✓ Selecionado</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">Sistema de som deve ser do tipo Line Array para cobertura uniforme</p>
                  </div>
                </div>
              </div>
              
              {/* Sistema Suspenso - Obrigatório */}
              <div className={`bg-gradient-to-r ${formData.generalRequirements.systemConfig.suspensionRequired ? 'from-red-500/20 to-red-600/20 border-red-500/40' : 'from-red-500/10 to-red-600/10 border-red-500/20'} border rounded-lg p-3 transition-all duration-200`}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="suspensionRequired"
                    checked={formData.generalRequirements.systemConfig.suspensionRequired}
                    onChange={(e) => handleNestedChange('generalRequirements', 'systemConfig', 'suspensionRequired', e.target.checked)}
                    className="w-4 h-4 text-red-500 bg-dark-700 border-red-500/50 rounded focus:ring-red-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-400 text-xs font-semibold bg-red-500/20 px-2 py-1 rounded">OBRIGATÓRIO</span>
                      <span className="text-gray-100 font-medium">Sistema Suspenso</span>
                      {formData.generalRequirements.systemConfig.suspensionRequired && (
                        <span className="text-green-400 text-xs">✓ Selecionado</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">Sistema deve estar sempre suspenso, nunca no chão</p>
                  </div>
                </div>
              </div>
              
              {/* Montagem em Torres - Imprescindível */}
              <div className={getCardStyle(formData.generalRequirements.systemConfig.towerMounting, 'orange-500')}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="towerMounting"
                    checked={formData.generalRequirements.systemConfig.towerMounting}
                    onChange={(e) => handleNestedChange('generalRequirements', 'systemConfig', 'towerMounting', e.target.checked)}
                    className="w-4 h-4 text-orange-500 bg-dark-700 border-orange-500/50 rounded focus:ring-orange-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-orange-400 text-xs font-semibold bg-orange-500/20 px-2 py-1 rounded">IMPRESCINDÍVEL</span>
                      <span className="text-gray-100 font-medium">Montagem em Torres Layer</span>
                      {formData.generalRequirements.systemConfig.towerMounting && (
                        <span className="text-green-400 text-xs">✓ Selecionado</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">Sistema deve ser montado em torres layer para posicionamento ideal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Processamento e Controle */}
          <div className="bg-dark-750 rounded-lg p-4 border border-dark-600">
            <h4 className="text-lg font-medium text-orange-400 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Processamento e Controle
            </h4>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Processador de Sistema</label>
                <SearchableDropdown
                  options={[...SYSTEM_PROCESSORS.FREE, ...SYSTEM_PROCESSORS.PRO]}
                  value={formData.generalRequirements.processing.systemProcessor}
                  onChange={(option) => {
                    if (option) {
                      handleNestedChange('generalRequirements', 'processing', 'systemProcessor', `${option.marca} ${option.modelo}`)
                    } else {
                      handleNestedChange('generalRequirements', 'processing', 'systemProcessor', '')
                    }
                  }}
                  placeholder="Selecionar processador..."
                  searchPlaceholder="Pesquisar processador..."
                  className="w-full"
                />
              </div>

              <div className="space-y-3">
                {/* PA Calibrado e Alinhado */}
                <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="roomTuning"
                      checked={formData.generalRequirements.processing.roomTuning}
                      onChange={(e) => handleNestedChange('generalRequirements', 'processing', 'roomTuning', e.target.checked)}
                      className="w-4 h-4 text-orange-500 bg-dark-700 border-orange-500/50 rounded focus:ring-orange-500 focus:ring-2"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-orange-400 text-xs font-semibold bg-orange-500/20 px-2 py-1 rounded">ESSENCIAL</span>
                        <span className="text-gray-100 font-medium">PA Calibrado e Alinhado</span>
                      </div>
                      <p className="text-gray-400 text-sm">Sistema deve estar devidamente calibrado e alinhado para o espaço</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-orange-400 text-xs font-semibold bg-orange-500/20 px-2 py-1 rounded">MEDIÇÃO</span>
                  <span className="text-gray-100 font-medium">Sistema de Medição</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Software de Medição</label>
                  <input
                    type="text"
                    value={formData.generalRequirements.processing.measurementSystem}
                    onChange={(e) => handleNestedChange('generalRequirements', 'processing', 'measurementSystem', e.target.value)}
                    className="w-full px-3 py-2 bg-dark-700 border border-orange-500/30 rounded-lg text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                    placeholder="ex: SMAART, SIM, EASERA"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sistema Principal */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          </svg>
          Sistema Principal (LineArray) - Marcas e Modelos Aceites
          <span className="text-red-400 text-sm">*</span>
        </h3>
        
        <div className="space-y-4">
          {/* Lista de sistemas aceites */}
          {formData.mainSystem.acceptedSystems.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">Sistemas Aceites:</label>
              <div className="space-y-2">
                {formData.mainSystem.acceptedSystems.map((system, index) => (
                  <div key={index} className="flex items-center justify-between bg-dark-700 rounded-lg px-3 py-2">
                    <span className="text-gray-100">{system}</span>
                    <button
                      onClick={() => removeMainSystem(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Adicionar novo sistema */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Sistema de PA</label>
              <SearchableDropdown
                options={paEquipment}
                value={formData.mainSystem.newBrand && formData.mainSystem.newModel ? 
                  `${formData.mainSystem.newBrand} ${formData.mainSystem.newModel}` : ''}
                onChange={(option) => {
                  if (option) {
                    // Atualizar marca e modelo numa única operação
                    const newData = {
                      ...formData,
                      mainSystem: {
                        ...formData.mainSystem,
                        newBrand: option.marca,
                        newModel: option.modelo
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  } else {
                    // Limpar marca e modelo numa única operação
                    const newData = {
                      ...formData,
                      mainSystem: {
                        ...formData.mainSystem,
                        newBrand: '',
                        newModel: ''
                      }
                    }
                    setFormData(newData)
                    onChange(newData)
                  }
                }}
                placeholder="Selecionar sistema de PA..."
                searchPlaceholder="Pesquisar sistema..."
                className="w-full"
              />
            </div>
            <div>
              <button
                onClick={addMainSystem}
                disabled={!formData.mainSystem.newBrand.trim() || !formData.mainSystem.newModel.trim()}
                className="w-full px-4 py-2 bg-accent-blue text-white rounded-lg hover:bg-accent-blue/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Subwoofers */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="subwoofersRequired"
            checked={formData.subwoofers.required}
            onChange={(e) => handleSystemChange('subwoofers', 'required', e.target.checked)}
            className="w-4 h-4 text-accent-green bg-dark-700 border-dark-600 rounded focus:ring-accent-green focus:ring-2"
          />
          <h3 className="text-xl font-semibold text-accent-green flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            Subwoofers
          </h3>
        </div>
        
        {formData.subwoofers.required && (
          <div className="space-y-4">
            {/* Tipos de montagem */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">Tipo de Montagem Preferido:</label>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="arcDelay"
                    name="mountingType"
                    checked={formData.subwoofers.mountingTypes.arcDelay}
                    onChange={() => handleConditionChange('mountingTypes', 'arcDelay', true)}
                    className="w-4 h-4 text-accent-green bg-dark-700 border-dark-600 focus:ring-accent-green focus:ring-2"
                  />
                  <label htmlFor="arcDelay" className="text-gray-300">Arc Delay</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="cardioide"
                    name="mountingType"
                    checked={formData.subwoofers.mountingTypes.cardioide}
                    onChange={() => handleConditionChange('mountingTypes', 'cardioide', true)}
                    className="w-4 h-4 text-accent-green bg-dark-700 border-dark-600 focus:ring-accent-green focus:ring-2"
                  />
                  <label htmlFor="cardioide" className="text-gray-300">Cardioide</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    id="endFire"
                    name="mountingType"
                    checked={formData.subwoofers.mountingTypes.endFire}
                    onChange={() => handleConditionChange('mountingTypes', 'endFire', true)}
                    className="w-4 h-4 text-accent-green bg-dark-700 border-dark-600 focus:ring-accent-green focus:ring-2"
                  />
                  <label htmlFor="endFire" className="text-gray-300">End Fire</label>
                </div>
              </div>
            </div>

            {/* Crossover Frequency */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <input
                  type="checkbox"
                  id="crossoverEnabled"
                  checked={formData.subwoofers.crossoverEnabled}
                  onChange={(e) => handleSystemChange('subwoofers', 'crossoverEnabled', e.target.checked)}
                  className="w-4 h-4 text-accent-green bg-dark-700 border-dark-600 rounded focus:ring-accent-green focus:ring-2"
                />
                <label htmlFor="crossoverEnabled" className="text-gray-300">Definir frequência de crossover</label>
              </div>
              
              {formData.subwoofers.crossoverEnabled && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>60 Hz</span>
                    <span>{formData.subwoofers.crossoverFrequency} Hz</span>
                    <span>100 Hz</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    value={formData.subwoofers.crossoverFrequency}
                    onChange={(e) => handleSystemChange('subwoofers', 'crossoverFrequency', parseInt(e.target.value))}
                    className="w-full h-2 bg-dark-600 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              )}
            </div>

            {/* Observações */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
              <textarea
                value={formData.subwoofers.notes}
                onChange={(e) => handleSystemChange('subwoofers', 'notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Observações sobre subwoofers..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Front Fill */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="flex items-center gap-3 mb-4">
          <input
            type="checkbox"
            id="frontFillRequired"
            checked={formData.frontFillRequired}
            onChange={(e) => handleChange('frontFillRequired', e.target.checked)}
            className="w-4 h-4 text-purple-400 bg-dark-700 border-dark-600 rounded focus:ring-purple-400 focus:ring-2"
          />
          <h3 className="text-xl font-semibold text-purple-400 flex items-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Sistema In/Front-Fill
          </h3>
        </div>
        
        {formData.frontFillRequired && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Cobertura a partir da primeira linha de público</label>
              <input
                type="text"
                value={formData.frontFillCoverage}
                onChange={(e) => handleChange('frontFillCoverage', e.target.value)}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200"
                placeholder="ex: 5m"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
              <textarea
                value={formData.frontFillNotes}
                onChange={(e) => handleChange('frontFillNotes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Observações sobre front fill..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Rigging */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Requisitos de Rigging
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Notas Importantes</label>
          <textarea
            value={formData.riggingNotes}
            onChange={(e) => handleChange('riggingNotes', e.target.value)}
            rows={4}
            className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200 resize-none"
            placeholder="Notas importantes sobre rigging, pontos de fixação, capacidades de carga, etc..."
          />
        </div>
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
          placeholder="Observações adicionais sobre o sistema PA, configurações especiais, requisitos técnicos, etc."
        />
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          border: 2px solid #1e40af;
        }

        select {
          z-index: 10;
          position: relative;
        }

        select option {
          background-color: #374151;
          color: #f3f4f6;
        }
      `}</style>
    </div>
  )
}

export default PA
