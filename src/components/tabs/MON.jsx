import { useState, useEffect } from 'react'

function MON({ data, onChange }) {
  const [formData, setFormData] = useState({
    consolaPreferida: {
      modelo: '',
      fabricante: '',
      observacoes: '',
      supplier: 'promoter'
    },
    opcoesAceitaveis: [],
    novaOpcao: '',
    inputsMinimos: '',
    outputsMinimos: '',
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

  const handleConsolaChange = (field, value) => {
    const newData = {
      ...formData,
      consolaPreferida: {
        ...formData.consolaPreferida,
        [field]: value
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const addOpcaoAceitavel = () => {
    if (formData.novaOpcao.trim()) {
      const newData = {
        ...formData,
        opcoesAceitaveis: [...formData.opcoesAceitaveis, formData.novaOpcao.trim()],
        novaOpcao: ''
      }
      setFormData(newData)
      onChange(newData)
    }
  }

  const removeOpcaoAceitavel = (index) => {
    const newData = {
      ...formData,
      opcoesAceitaveis: formData.opcoesAceitaveis.filter((_, i) => i !== index)
    }
    setFormData(newData)
    onChange(newData)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addOpcaoAceitavel()
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">MON (Monitor)</h2>
        <p className="text-gray-400">Especificações da consola de monitor</p>
      </div>

      {/* Consola Preferida */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Consola Preferida
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fabricante</label>
            <input
              type="text"
              value={formData.consolaPreferida.fabricante}
              onChange={(e) => handleConsolaChange('fabricante', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duração-200"
              placeholder="ex: Yamaha, DiGiCo, Midas"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
            <input
              type="text"
              value={formData.consolaPreferida.modelo}
              onChange={(e) => handleConsolaChange('modelo', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duração-200"
              placeholder="ex: SD12, Pro2, CL5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.consolaPreferida.supplier}
              onChange={(e) => handleConsolaChange('supplier', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            >
              <option value="promoter">Fornecido pelo Promotor</option>
              <option value="band">Fornecido pela Banda</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
            <input
              type="text"
              value={formData.consolaPreferida.observacoes}
              onChange={(e) => handleConsolaChange('observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duração-200"
              placeholder="ex: Versão, configuração de cartões"
            />
          </div>
        </div>
      </div>

      {/* Opções Aceitáveis */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-green mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Opções Aceitáveis
        </h3>
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={formData.novaOpcao}
              onChange={(e) => handleChange('novaOpcao', e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duração-200"
              placeholder="ex: Outra consola aceitável"
            />
            <button
              onClick={addOpcaoAceitavel}
              className="px-4 py-2 bg-accent-green text-white rounded-lg hover:bg-accent-green/80 transition-colors duração-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Adicionar
            </button>
          </div>

          {formData.opcoesAceitaveis.length > 0 && (
            <div className="space-y-2">
              {formData.opcoesAceitaveis.map((opcao, index) => (
                <div key={index} className="flex items-center justify-between bg-dark-700 rounded-lg px-3 py-2">
                  <span className="text-gray-200">{opcao}</span>
                  <button
                    onClick={() => removeOpcaoAceitavel(index)}
                    className="text-red-400 hover:text-red-300 transition-colors duração-200"
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

      {/* Especificações Técnicas */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-purple-400 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Especificações Técnicas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nº Mínimo de Inputs *
            </label>
            <input
              type="number"
              value={formData.inputsMinimos}
              onChange={(e) => handleChange('inputsMinimos', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duração-200"
              placeholder="ex: 32"
              min="1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nº Mínimo de Outputs *
            </label>
            <input
              type="number"
              value={formData.outputsMinimos}
              onChange={(e) => handleChange('outputsMinimos', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duração-200"
              placeholder="ex: 16"
              min="1"
            />
          </div>
        </div>
      </div>

      {/* Observações */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Observações
        </h3>
        <textarea
          value={formData.observacoes}
          onChange={(e) => handleChange('observacoes', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duração-200 resize-none"
          placeholder="Informações adicionais para MON"
        />
      </div>
    </div>
  )
}

export default MON
