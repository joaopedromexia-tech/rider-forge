import { useState, useEffect } from 'react'

function ObservacoesFinais({ data, onChange }) {
  const [formData, setFormData] = useState({
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

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Observações Finais</h2>
        <p className="text-gray-400">Notas adicionais e observações importantes para o rider técnico</p>
      </div>

      {/* Campo de Observações */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-accent-blue">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <h3 className="text-xl font-semibold">Observações Gerais</h3>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Notas Adicionais
            </label>
            <textarea
              value={formData.observacoes}
              onChange={(e) => handleChange('observacoes', e.target.value)}
              rows={12}
              className="w-full px-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Adicione aqui qualquer informação adicional, requisitos especiais, horários, catering, alojamento, etc."
            />
          </div>

          {/* Sugestões de Conteúdo */}
          <div className="bg-dark-700 rounded-lg p-4 border border-dark-600">
            <h4 className="text-sm font-medium text-gray-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Sugestões de Conteúdo
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-400">
              <div className="space-y-2">
                <p className="font-medium text-gray-300">Requisitos Especiais:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Horários de setup e soundcheck</li>
                  <li>• Requisitos de energia elétrica</li>
                  <li>• Acesso e logística</li>
                  <li>• Equipamentos específicos do artista</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-medium text-gray-300">Configurações:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Configurações de PA específicas</li>
                  <li>• Presets de consola</li>
                  <li>• Configurações de IEM</li>
                  <li>• Notas sobre o repertório</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contador de Caracteres */}
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>
              {formData.observacoes.length} caracteres
            </span>
            <span>
              {Math.ceil(formData.observacoes.length / 50)} linhas estimadas
            </span>
          </div>
        </div>
      </div>

      {/* Informações Adicionais */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-lg font-semibold text-gray-100 mb-4 flex items-center gap-2">
          <svg className="w-5 h-5 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Dicas para Observações Eficazes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
          <div className="space-y-2">
            <p className="font-medium text-gray-300">Seja Específico</p>
            <p className="text-xs">Inclua detalhes técnicos específicos, marcas e modelos de equipamentos quando relevante.</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-300">Organize por Prioridade</p>
            <p className="text-xs">Mencione primeiro os requisitos mais críticos e depois os secundários.</p>
          </div>
          <div className="space-y-2">
            <p className="font-medium text-gray-300">Inclua Contexto</p>
            <p className="text-xs">Explique o porquê de certos requisitos para facilitar a compreensão da equipa técnica.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ObservacoesFinais
