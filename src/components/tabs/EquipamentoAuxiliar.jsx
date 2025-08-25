import { useState, useEffect } from 'react'
import { useRider } from '../../context/RiderContext'
import SearchableDropdown from '../SearchableDropdown'
import { getEquipmentByCategory } from '../../data/equipmentLibrary'

function EquipamentoAuxiliar({ data, onChange }) {
  const { isPro } = useRider()
  const [showQuickConfig, setShowQuickConfig] = useState(false)
  const [formData, setFormData] = useState({
    talkbacks: {
      quantidade: '',
      modelo: '',
      observacoes: '',
      supplier: 'promoter'
    },
    intercom: {
      quantidade: '',
      modelo: '',
      observacoes: '',
      supplier: 'promoter'
    },
    comunicacaoFohMon: {
      tipo: '',
      observacoes: '',
      supplier: 'promoter'
    },
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

  // Validação de comunicação
  const getCommunicationStatus = () => {
    const hasTalkbacks = parseInt(formData.talkbacks.quantidade) > 0
    const hasIntercom = parseInt(formData.intercom.quantidade) > 0
    const hasFOHMonCom = formData.comunicacaoFohMon.tipo.trim().length > 0
    
    const totalCommunication = [hasTalkbacks, hasIntercom, hasFOHMonCom].filter(Boolean).length
    
    return {
      hasTalkbacks,
      hasIntercom,
      hasFOHMonCom,
      totalCommunication,
      isComplete: totalCommunication >= 2,
      status: totalCommunication === 0 ? 'none' : 
              totalCommunication === 1 ? 'partial' : 
              totalCommunication >= 2 ? 'complete' : 'none'
    }
  }

  // Sugestões de configuração baseadas no tipo de banda
  const getBandTypeSuggestions = () => {
    const suggestions = {
      banda: {
        talkbacks: 4,
        intercom: 2,
        fohMonCom: 'Sistema dedicado',
        description: 'Banda completa - comunicação entre FOH e palco'
      },
      duo: {
        talkbacks: 2,
        intercom: 0,
        fohMonCom: 'Rádio portátil',
        description: 'Duo acústico - comunicação simples'
      },
      solo: {
        talkbacks: 1,
        intercom: 0,
        fohMonCom: 'Rádio portátil',
        description: 'Artista solo - comunicação básica'
      },
      grande: {
        talkbacks: 6,
        intercom: 4,
        fohMonCom: 'Sistema profissional',
        description: 'Banda grande - comunicação completa'
      }
    }
    return suggestions
  }

  // Função para aplicar configuração de banda
  const applyBandConfig = (bandType) => {
    const config = getBandTypeSuggestions()[bandType]
    if (!config) return
    
    const newData = {
      ...formData,
      talkbacks: {
        ...formData.talkbacks,
        quantidade: config.talkbacks.toString()
      },
      intercom: {
        ...formData.intercom,
        quantidade: config.intercom.toString()
      },
      comunicacaoFohMon: {
        ...formData.comunicacaoFohMon,
        tipo: config.fohMonCom
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  // Verificar compatibilidade com sistemas de escuta
  const checkEscutaCompatibility = () => {
    // Esta função seria conectada ao contexto de SistemasEscuta
    const hasIEMs = false // Seria verificado no contexto real
    const hasWedges = false // Seria verificado no contexto real
    
    return {
      hasIEMs,
      hasWedges,
      needsTalkbacks: hasIEMs || hasWedges,
      recommendation: hasIEMs ? 'Talkbacks essenciais para comunicação com músicos em IEMs' : 
                     hasWedges ? 'Talkbacks recomendados para comunicação com músicos em wedges' : 
                     'Talkbacks opcionais para comunicação básica'
    }
  }

  const communicationStatus = getCommunicationStatus()
  const bandTypeSuggestions = getBandTypeSuggestions()
  const escutaCompatibility = checkEscutaCompatibility()

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Equipamento Auxiliar</h2>
        <p className="text-gray-400">Equipamentos de apoio e comunicação</p>
      </div>

      {/* Progresso e Validação */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-400 font-semibold">Progresso da Comunicação</h4>
              <span className="text-blue-400 font-bold">{Math.round(((communicationStatus.hasTalkbacks?1:0)+(communicationStatus.hasIntercom?1:0)+(communicationStatus.hasFOHMonCom?1:0))/3*100)}%</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.round(((communicationStatus.hasTalkbacks?1:0)+(communicationStatus.hasIntercom?1:0)+(communicationStatus.hasFOHMonCom?1:0))/3*100)}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>Sistemas de Comunicação:</strong> {[communicationStatus.hasTalkbacks, communicationStatus.hasIntercom, communicationStatus.hasFOHMonCom].filter(Boolean).length}/3
                </p>
                <div className="flex gap-1">
                  <div className={`w-3 h-3 rounded-full ${communicationStatus.hasTalkbacks ? 'bg-green-500' : 'bg-gray-500'}`} title="Talkbacks"></div>
                  <div className={`w-3 h-3 rounded-full ${communicationStatus.hasIntercom ? 'bg-green-500' : 'bg-gray-500'}`} title="Intercom"></div>
                  <div className={`w-3 h-3 rounded-full ${communicationStatus.hasFOHMonCom ? 'bg-green-500' : 'bg-gray-500'}`} title="FOH-MON"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Status e Sugestões */}
      <div className="space-y-4 mb-6">
        {/* Status de Comunicação */}
        <div className={`border rounded-lg p-4 ${
          communicationStatus.status === 'complete' ? 'bg-green-500/10 border-green-500/20' :
          communicationStatus.status === 'partial' ? 'bg-yellow-500/10 border-yellow-500/20' :
          'bg-blue-500/10 border-blue-500/20'
        }`}>
          <div className="flex items-center justify-between mb-3">
            <h4 className={`font-semibold ${
              communicationStatus.status === 'complete' ? 'text-green-400' :
              communicationStatus.status === 'partial' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              Status de Comunicação
            </h4>
            <span className={`font-bold ${
              communicationStatus.status === 'complete' ? 'text-green-400' :
              communicationStatus.status === 'partial' ? 'text-yellow-400' :
              'text-blue-400'
            }`}>
              {communicationStatus.totalCommunication}/3 sistemas
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${communicationStatus.hasTalkbacks ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">Talkbacks</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${communicationStatus.hasIntercom ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">Intercom</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${communicationStatus.hasFOHMonCom ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              <span className="text-gray-300">FOH-MON</span>
            </div>
          </div>
        </div>

        {/* Sugestões de Banda */}
        <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-purple-400 font-semibold">Configurações Rápidas por Tipo de Banda</h4>
            <button
              onClick={() => setShowQuickConfig(!showQuickConfig)}
              className="px-3 py-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-lg transition-colors text-sm flex items-center gap-2"
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
                  className="text-left p-3 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg transition-colors"
                >
                  <div className="text-purple-300 font-medium capitalize">{type}</div>
                  <div className="text-gray-300 text-sm">{config.description}</div>
                  <div className="text-gray-400 text-xs mt-1">
                    Talkbacks: {config.talkbacks} | Intercom: {config.intercom}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recomendação de Compatibilidade */}
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="text-orange-400 font-semibold">Recomendação</h4>
              <p className="text-gray-300 text-sm">{escutaCompatibility.recommendation}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Talkbacks */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Talkbacks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
            <input
              type="number"
              value={formData.talkbacks.quantidade}
              onChange={(e) => handleSystemChange('talkbacks', 'quantidade', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="ex: 4"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.talkbacks.supplier}
              onChange={(e) => handleSystemChange('talkbacks', 'supplier', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            >
              <option value="promoter">Fornecido pelo Promotor</option>
              <option value="band">Fornecido pela Banda</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
            <input
              type="text"
              value={formData.talkbacks.modelo}
              onChange={(e) => handleSystemChange('talkbacks', 'modelo', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="ex: Clear-Com RS-701"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
            <input
              type="text"
              value={formData.talkbacks.observacoes}
              onChange={(e) => handleSystemChange('talkbacks', 'observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Observações"
            />
          </div>
        </div>
      </div>

      {/* Intercom */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-green mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Intercom
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Quantidade</label>
            <input
              type="number"
              value={formData.intercom.quantidade}
              onChange={(e) => handleSystemChange('intercom', 'quantidade', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="ex: 8"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.intercom.supplier}
              onChange={(e) => handleSystemChange('intercom', 'supplier', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            >
              <option value="promoter">Fornecido pelo Promotor</option>
              <option value="band">Fornecido pela Banda</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
            <input
              type="text"
              value={formData.intercom.modelo}
              onChange={(e) => handleSystemChange('intercom', 'modelo', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="ex: Clear-Com Eclipse"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Observações</label>
            <input
              type="text"
              value={formData.intercom.observacoes}
              onChange={(e) => handleSystemChange('intercom', 'observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Observações"
            />
          </div>
        </div>
      </div>

      {/* Comunicação FOH ↔ MON */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Comunicação
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tipo de Comunicação</label>
            <select
              value={formData.comunicacaoFohMon.tipo}
              onChange={(e) => handleSystemChange('comunicacaoFohMon', 'tipo', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            >
              <option value="">Selecionar tipo</option>
              <option value="dedicated-line">Linha dedicada</option>
              <option value="intercom-channel">Canal intercom</option>
              <option value="wireless">Sem fios</option>
              <option value="network">Rede</option>
              <option value="other">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.comunicacaoFohMon.supplier}
              onChange={(e) => handleSystemChange('comunicacaoFohMon', 'supplier', e.target.value)}
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
              value={formData.comunicacaoFohMon.observacoes}
              onChange={(e) => handleSystemChange('comunicacaoFohMon', 'observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Observações"
            />
          </div>
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
          placeholder="Observações adicionais sobre equipamento auxiliar..."
        />
      </div>
    </div>
  )
}

export default EquipamentoAuxiliar
