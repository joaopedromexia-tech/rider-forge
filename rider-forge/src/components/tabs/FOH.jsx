import { useState, useEffect } from 'react'
import { getEquipmentByCategory, getBrands } from '../../data/equipmentLibrary.js'

function FOH({ data, onChange }) {
  const [formData, setFormData] = useState({
    consolaPreferida: {
      marca: '',
      modelo: '',
      observacoes: '',
      supplier: 'promoter'
    },
    outrasConsolas: [],
    novaConsola: {
      marca: '',
      modelo: '',
      observacoes: '',
      supplier: 'promoter'
    }
  })

  // Get console brands and models from equipment library
  const consoleEquipment = getEquipmentByCategory('console', true) // Include PRO consoles
  const consoleBrands = [...new Set(consoleEquipment.map(item => item.marca))].sort()

  useEffect(() => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }))
    }
  }, [data])

  const handleConsolaPreferidaChange = (field, value) => {
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

  const handleNovaConsolaChange = (field, value) => {
    const newData = {
      ...formData,
      novaConsola: {
        ...formData.novaConsola,
        [field]: value
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  const addOutraConsola = () => {
    if (formData.novaConsola.marca.trim() && formData.novaConsola.modelo.trim()) {
      const newData = {
        ...formData,
        outrasConsolas: [...formData.outrasConsolas, { ...formData.novaConsola }],
        novaConsola: {
          marca: '',
          modelo: '',
          observacoes: '',
          supplier: 'promoter'
        }
      }
      setFormData(newData)
      onChange(newData)
    }
  }

  const removeOutraConsola = (index) => {
    const newData = {
      ...formData,
      outrasConsolas: formData.outrasConsolas.filter((_, i) => i !== index)
    }
    setFormData(newData)
    onChange(newData)
  }

  const getModelsByBrand = (brand) => {
    return consoleEquipment
      .filter(item => item.marca === brand)
      .map(item => item.modelo)
      .sort()
  }

  return (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">FOH (Front of House)</h2>
        <p className="text-gray-400">Especificações da consola de som principal</p>
      </div>

      {/* Consola Preferida */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-blue mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
          Consola Preferida
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Marca</label>
            <select
              value={formData.consolaPreferida.marca}
              onChange={(e) => handleConsolaPreferidaChange('marca', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
            >
              <option value="">Selecionar marca</option>
              {consoleBrands.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
            <select
              value={formData.consolaPreferida.modelo}
              onChange={(e) => handleConsolaPreferidaChange('modelo', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              disabled={!formData.consolaPreferida.marca}
            >
              <option value="">Selecionar modelo</option>
              {formData.consolaPreferida.marca && getModelsByBrand(formData.consolaPreferida.marca).map(modelo => (
                <option key={modelo} value={modelo}>{modelo}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
            <select
              value={formData.consolaPreferida.supplier}
              onChange={(e) => handleConsolaPreferidaChange('supplier', e.target.value)}
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
              onChange={(e) => handleConsolaPreferidaChange('observacoes', e.target.value)}
              className="w-full px-3 py-2 bg-dark-700 border border-dark-600 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="ex: Versão, configuração de cartões"
            />
          </div>
        </div>
      </div>

      {/* Outras Consolas Aceites */}
      <div className="bg-dark-800 rounded-lg p-6 border border-dark-700">
        <h3 className="text-xl font-semibold text-accent-green mb-4 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Outras Consolas Aceites
        </h3>
        
        {/* Form to add new console */}
        <div className="bg-dark-700 rounded-lg p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Marca</label>
              <select
                value={formData.novaConsola.marca}
                onChange={(e) => handleNovaConsolaChange('marca', e.target.value)}
                className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200"
              >
                <option value="">Selecionar marca</option>
                {consoleBrands.map(brand => (
                  <option key={brand} value={brand}>{brand}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Modelo</label>
              <select
                value={formData.novaConsola.modelo}
                onChange={(e) => handleNovaConsolaChange('modelo', e.target.value)}
                className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200"
                disabled={!formData.novaConsola.marca}
              >
                <option value="">Selecionar modelo</option>
                {formData.novaConsola.marca && getModelsByBrand(formData.novaConsola.marca).map(modelo => (
                  <option key={modelo} value={modelo}>{modelo}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Fornecedor</label>
              <select
                value={formData.novaConsola.supplier}
                onChange={(e) => handleNovaConsolaChange('supplier', e.target.value)}
                className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200"
              >
                <option value="promoter">Fornecido pelo Promotor</option>
                <option value="band">Fornecido pela Banda</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Notas</label>
              <input
                type="text"
                value={formData.novaConsola.observacoes}
                onChange={(e) => handleNovaConsolaChange('observacoes', e.target.value)}
                className="w-full px-3 py-2 bg-dark-600 border border-dark-500 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-green focus:border-transparent transition-all duration-200"
                placeholder="ex: Versão, configuração"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={addOutraConsola}
                disabled={!formData.novaConsola.marca || !formData.novaConsola.modelo}
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
        
        {/* List of added consoles */}
        {formData.outrasConsolas.length > 0 && (
          <div className="space-y-2">
            {formData.outrasConsolas.map((consola, index) => (
              <div key={index} className="flex items-center justify-between bg-dark-700 rounded-lg px-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-200 font-medium">{consola.marca} {consola.modelo}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      consola.supplier === 'promoter' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-green-500/20 text-green-400'
                    }`}>
                      {consola.supplier === 'promoter' ? 'Promotor' : 'Banda'}
                    </span>
                    {consola.observacoes && (
                      <span className="text-gray-400 text-sm">({consola.observacoes})</span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeOutraConsola(index)}
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
  )
}

export default FOH

