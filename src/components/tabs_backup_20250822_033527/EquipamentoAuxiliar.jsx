import { useState, useEffect } from 'react'
function EquipamentoAuxiliar({ data, onChange }) {
  const [formData, setFormData] = useState({
    talkbacks: {
      quantidade: '',
      modelo: '',
      observacoes: ''
    },
    intercom: {
      quantidade: '',
      modelo: '',
      observacoes: ''
    },
    comunicacaoFohMon: {
      tipo: '',
      observacoes: ''
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

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Equipamento Auxiliar</h2>
        <p className="text-gray-400">Equipamentos de apoio e comunicação</p>
      </div>

      {/* Talkbacks */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Talkbacks
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
