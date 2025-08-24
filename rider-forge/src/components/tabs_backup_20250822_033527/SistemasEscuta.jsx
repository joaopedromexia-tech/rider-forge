import { useState, useEffect } from 'react'
import SearchableDropdown from '../SearchableDropdown'
import { getEquipmentByCategory } from '../../data/equipmentLibrary'

function SistemasEscuta({ data, onChange }) {
  const [formData, setFormData] = useState({
    iems: {
      quantidade: '',
      modeloPreferido: '',
      observacoes: ''
    },
    sideFills: {
      quantidade: '',
      modelo: '',
      observacoes: ''
    },
    wedges: {
      quantidade: '',
      modelo: '',
      observacoes: ''
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
      observacoes: ''
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

  // Obter equipamentos por categoria (agora inclui todos os equipamentos)
  const getEquipmentOptions = (category) => {
    return getEquipmentByCategory(category, true) // Sempre incluir Pro
  }

  const iemOptions = getEquipmentOptions('iem')
  const sideFillOptions = getEquipmentOptions('sidefill')
  const wedgeOptions = getEquipmentOptions('wedge')

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Sistemas de Escuta</h2>
        <p className="text-gray-400">Configuração dos sistemas de monitor e IEM</p>
      </div>

      {/* IEMs */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          IEMs
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  handleSystemChange('iems', 'modeloPreferido', `${option.marca} ${option.modelo}`)
                } else {
                  handleSystemChange('iems', 'modeloPreferido', '')
                }
              }}
              placeholder="Selecionar modelo IEM..."
              searchPlaceholder="Pesquisar IEM..."
            />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  handleSystemChange('sideFills', 'modelo', `${option.marca} ${option.modelo}`)
                } else {
                  handleSystemChange('sideFills', 'modelo', '')
                }
              }}
              placeholder="Selecionar modelo Side Fill..."
              searchPlaceholder="Pesquisar Side Fill..."
            />
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  handleSystemChange('wedges', 'modelo', `${option.marca} ${option.modelo}`)
                } else {
                  handleSystemChange('wedges', 'modelo', '')
                }
              }}
              placeholder="Selecionar modelo Wedge..."
              searchPlaceholder="Pesquisar Wedge..."
            />
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
