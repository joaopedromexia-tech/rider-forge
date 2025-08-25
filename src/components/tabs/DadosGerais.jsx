import { useState, useEffect } from 'react'
import StagePlotEditor from '../StagePlotEditor'

function DadosGerais({ data, onChange }) {


  const [formData, setFormData] = useState({
    artista: '',
    versaoRider: '',
    anoTour: '',
    roadManager: {
      nome: '',
      telefone: '',
      email: ''
    },
    foh: {
      nome: '',
      telefone: '',
      email: ''
    },
    mon: {
      nome: '',
      telefone: '',
      email: ''
    },
    // Novos campos para imagens
    imagemCapa: null,
    stagePlot: null
  })

  // Estados para feedback de drag-and-drop
  const [isDraggingCapa, setIsDraggingCapa] = useState(false)
  const [isDraggingStagePlot, setIsDraggingStagePlot] = useState(false)
  const [showStagePlotEditor, setShowStagePlotEditor] = useState(false)

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

  const handleContactChange = (contactType, field, value) => {
    const newData = {
      ...formData,
      [contactType]: {
        ...formData[contactType],
        [field]: value
      }
    }
    setFormData(newData)
    onChange(newData)
  }

  // Função para validar tipo de arquivo
  const validateImageFile = (file) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Apenas ficheiros PNG e JPG são permitidos.' }
    }

    if (file.size > maxSize) {
      return { valid: false, error: 'O ficheiro deve ter menos de 5MB.' }
    }

    return { valid: true }
  }

  // Função para converter imagem para base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Handler para upload de imagem de capa
  const handleCapaUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      event.target.value = ''
      return
    }

    try {
      const base64 = await convertToBase64(file)

      const newData = {
        ...formData,
        imagemCapa: {
          data: base64,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }
      setFormData(newData)
      onChange(newData)
    } catch (error) {

      alert('Erro ao processar a imagem. Tente novamente.')
      event.target.value = ''
    }
  }

  // Handler para drop de imagem de capa (drag-and-drop)
  const handleCapaDrop = async (event) => {
    event.preventDefault()
    setIsDraggingCapa(false)
    const file = event.dataTransfer?.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    try {
      const base64 = await convertToBase64(file)
      const newData = {
        ...formData,
        imagemCapa: {
          data: base64,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }
      setFormData(newData)
      onChange(newData)
    } catch (error) {
      alert('Erro ao processar a imagem. Tente novamente.')
    }
  }

  // Handler para upload de stage plot
  const handleStagePlotUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      event.target.value = ''
      return
    }

    try {
      const base64 = await convertToBase64(file)

      const newData = {
        ...formData,
        stagePlot: {
          data: base64,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }
      setFormData(newData)
      onChange(newData)
    } catch (error) {

      alert('Erro ao processar a imagem. Tente novamente.')
      event.target.value = ''
    }
  }

  // Handler para drop de stage plot (drag-and-drop)
  const handleStagePlotDrop = async (event) => {
    event.preventDefault()
    setIsDraggingStagePlot(false)
    const file = event.dataTransfer?.files?.[0]
    if (!file) return

    const validation = validateImageFile(file)
    if (!validation.valid) {
      alert(validation.error)
      return
    }

    try {
      const base64 = await convertToBase64(file)
      const newData = {
        ...formData,
        stagePlot: {
          data: base64,
          name: file.name,
          type: file.type,
          size: file.size
        }
      }
      setFormData(newData)
      onChange(newData)
    } catch (error) {
      alert('Erro ao processar a imagem. Tente novamente.')
    }
  }

  // Função para remover imagem
  const removeImage = (type) => {
    const newData = {
      ...formData,
      [type]: null
    }
    setFormData(newData)
    onChange(newData)
  }

  // Função para formatar tamanho do arquivo
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Validação em tempo real
  const getValidationStatus = () => {
    const requiredFields = {
      artista: formData.artista.trim(),
      versaoRider: formData.versaoRider.trim(),
      anoTour: formData.anoTour.trim()
    }
    
    const completedRequired = Object.values(requiredFields).filter(field => field.length > 0).length
    const totalRequired = Object.keys(requiredFields).length
    
    const optionalFields = {
      roadManager: Object.values(formData.roadManager).some(val => val.trim().length > 0),
      foh: Object.values(formData.foh).some(val => val.trim().length > 0),
      mon: Object.values(formData.mon).some(val => val.trim().length > 0)
    }
    
    const completedOptional = Object.values(optionalFields).filter(Boolean).length
    const totalOptional = Object.keys(optionalFields).length
    
    return {
      required: { completed: completedRequired, total: totalRequired },
      optional: { completed: completedOptional, total: totalOptional },
      progress: Math.round(((completedRequired + completedOptional) / (totalRequired + totalOptional)) * 100)
    }
  }

  const validationStatus = getValidationStatus()

  // Função para validar campo obrigatório
  const isFieldValid = (fieldName) => {
    const field = formData[fieldName]
    return field && field.trim().length > 0
  }

  // Função para validar contacto
  const isContactValid = (contactType) => {
    const contact = formData[contactType]
    return Object.values(contact).some(val => val.trim().length > 0)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Dados Gerais</h2>
        <p className="text-gray-400">Informações básicas do evento e contactos principais</p>
      </div>

      {/* Progresso e Validação */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-blue-400 font-semibold">Progresso do Preenchimento</h4>
              <span className="text-blue-400 font-bold">{validationStatus.progress}%</span>
            </div>
            
            {/* Barra de Progresso */}
            <div className="w-full bg-dark-700 rounded-full h-2 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${validationStatus.progress}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>Campos Obrigatórios:</strong> {validationStatus.required.completed}/{validationStatus.required.total}
                </p>
                <div className="flex gap-1">
                  {['artista', 'versaoRider', 'anoTour'].map(field => (
                    <div
                      key={field}
                      className={`w-3 h-3 rounded-full ${isFieldValid(field) ? 'bg-green-500' : 'bg-red-500'}`}
                      title={`${field}: ${isFieldValid(field) ? 'Preenchido' : 'Pendente'}`}
                    ></div>
                  ))}
                </div>
              </div>
              
              <div>
                <p className="text-gray-300 mb-1">
                  <strong>Contactos:</strong> {validationStatus.optional.completed}/{validationStatus.optional.total}
                </p>
                <div className="flex gap-1">
                  {['roadManager', 'foh', 'mon'].map(contact => (
                    <div
                      key={contact}
                      className={`w-3 h-3 rounded-full ${isContactValid(contact) ? 'bg-green-500' : 'bg-yellow-500'}`}
                      title={`${contact}: ${isContactValid(contact) ? 'Preenchido' : 'Vazio'}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Informações Básicas */}
      <div className="bg-dark-800/50 rounded-lg p-6 border border-dark-700/50">
        <h3 className="text-xl font-semibold text-accent-blue mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Informações Básicas
          <span className="text-red-400 text-sm">*</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Artista/Banda *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.artista}
                onChange={(e) => handleChange('artista', e.target.value)}
                className={`w-full px-4 py-3 bg-dark-700 border rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200 ${
                  formData.artista.trim() ? 'border-green-500/50' : 'border-red-500/50'
                }`}
                placeholder="Nome do artista ou banda"
              />
              {formData.artista.trim() && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Versão do Rider *
            </label>
            <input
              type="text"
              value={formData.versaoRider}
              onChange={(e) => handleChange('versaoRider', e.target.value)}
              className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Ex: 1.0, 2.1, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Ano da Tour *
            </label>
            <input
              type="number"
              value={formData.anoTour}
              onChange={(e) => handleChange('anoTour', e.target.value)}
              className="w-full px-4 py-3 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
              placeholder="Ex: 2024"
              min="2000"
              max="2030"
            />
          </div>
        </div>
      </div>

      {/* Upload de Imagens */}
      <div className="bg-dark-800/50 rounded-lg p-6 border border-dark-700/50">
        <h3 className="text-xl font-semibold text-accent-green mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Imagens
          <span className="text-gray-400 text-sm">(Opcional)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Imagem de Capa */}
          <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-700/30">
            <h4 className="text-lg font-medium text-accent-blue mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Imagem de Capa
            </h4>
            
            {formData.imagemCapa ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={formData.imagemCapa.data}
                    alt="Capa do rider"
                    className="w-full h-48 object-cover rounded-lg border border-dark-600"
                  />
                  <button
                    onClick={() => removeImage('imagemCapa')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                    title="Remover imagem"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  <p><strong>Nome:</strong> {formData.imagemCapa.name}</p>
                  <p><strong>Tamanho:</strong> {formatFileSize(formData.imagemCapa.size)}</p>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDraggingCapa ? 'border-accent-blue bg-dark-700/50' : 'border-dark-600 hover:border-accent-blue'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingCapa(true) }}
                onDragLeave={() => setIsDraggingCapa(false)}
                onDrop={handleCapaDrop}
              >
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleCapaUpload}
                  className="hidden"
                  id="capa-upload"
                />
                <label htmlFor="capa-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-300 font-medium">Carregar Imagem de Capa</p>
                  <p className="text-gray-500 text-sm mt-1">PNG ou JPG, máximo 5MB</p>
                </label>
              </div>
            )}
          </div>

          {/* Stage Plot */}
          <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-700/30">
            <h4 className="text-lg font-medium text-accent-green mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Stage Plot
            </h4>
            
            {formData.stagePlot ? (
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={formData.stagePlot.data}
                    alt="Stage plot"
                    className="w-full h-48 object-cover rounded-lg border border-dark-600"
                  />
                  <button
                    onClick={() => setShowStagePlotEditor(true)}
                    className="absolute top-2 left-2 bg-dark-700 hover:bg-dark-600 text-gray-200 rounded-full p-2 transition-colors duration-200"
                    title="Editar stage plot"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4h2M4 20h16M4 8h16M4 12h16M4 16h7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => removeImage('stagePlot')}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 transition-colors duration-200"
                    title="Remover imagem"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="text-sm text-gray-400">
                  <p><strong>Nome:</strong> {formData.stagePlot.name}</p>
                  <p><strong>Tamanho:</strong> {formatFileSize(formData.stagePlot.size)}</p>
                </div>
              </div>
            ) : (
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 ${isDraggingStagePlot ? 'border-accent-green bg-dark-700/50' : 'border-dark-600 hover:border-accent-green'}`}
                onDragOver={(e) => { e.preventDefault(); setIsDraggingStagePlot(true) }}
                onDragLeave={() => setIsDraggingStagePlot(false)}
                onDrop={handleStagePlotDrop}
              >
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleStagePlotUpload}
                  className="hidden"
                  id="stage-plot-upload"
                />
                <label htmlFor="stage-plot-upload" className="cursor-pointer">
                  <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p className="text-gray-300 font-medium">Carregar Stage Plot</p>
                  <p className="text-gray-500 text-sm mt-1">PNG ou JPG, máximo 5MB</p>
                </label>
                <div className="mt-3">
                  <button
                    type="button"
                    disabled
                    className="px-4 py-2 bg-gray-500 text-gray-300 rounded-lg cursor-not-allowed opacity-50"
                    title="Funcionalidade temporariamente indisponível"
                  >
                    Criar com Editor (em breve)
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {showStagePlotEditor && (
        <StagePlotEditor
          initialLayout={formData.stagePlot?.layout || null}
          onClose={() => setShowStagePlotEditor(false)}
          onSave={({ png, layout }) => {
            const newData = {
              ...formData,
              stagePlot: png ? { data: png, name: 'stageplot.png', type: 'image/png', size: png.length, layout } : formData.stagePlot
            }
            setFormData(newData)
            onChange(newData)
            setShowStagePlotEditor(false)
          }}
        />
      )}

      {/* Contactos */}
      <div className="bg-dark-800/50 rounded-lg p-6 border border-dark-700/50">
        <h3 className="text-xl font-semibold text-purple-400 mb-6 flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Contactos
          <span className="text-gray-400 text-sm">(Recomendado)</span>
        </h3>

        {/* Road Manager */}
        <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-700/30 mb-4">
          <h4 className="text-lg font-medium text-accent-blue mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Road Manager
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                              <input
                  type="text"
                  value={formData.roadManager.nome}
                  onChange={(e) => handleContactChange('roadManager', 'nome', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="Nome completo"
                />
            </div>
                          <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.roadManager.telefone}
                  onChange={(e) => handleContactChange('roadManager', 'telefone', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="+351 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.roadManager.email}
                  onChange={(e) => handleContactChange('roadManager', 'email', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="email@exemplo.com"
                />
            </div>
          </div>
        </div>

        {/* FOH */}
        <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-700/30 mb-4">
          <h4 className="text-lg font-medium text-accent-green mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            FOH (Front of House)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.foh.nome}
                  onChange={(e) => handleContactChange('foh', 'nome', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.foh.telefone}
                  onChange={(e) => handleContactChange('foh', 'telefone', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="+351 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.foh.email}
                  onChange={(e) => handleContactChange('foh', 'email', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="email@exemplo.com"
                />
            </div>
          </div>
        </div>

        {/* MON */}
        <div className="bg-dark-800/30 rounded-lg p-4 border border-dark-700/30">
          <h4 className="text-lg font-medium text-purple-400 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            MON (Monitor)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
                <input
                  type="text"
                  value={formData.mon.nome}
                  onChange={(e) => handleContactChange('mon', 'nome', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="Nome completo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
                <input
                  type="tel"
                  value={formData.mon.telefone}
                  onChange={(e) => handleContactChange('mon', 'telefone', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="+351 123 456 789"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.mon.email}
                  onChange={(e) => handleContactChange('mon', 'email', e.target.value)}
                  className="w-full px-3 py-2 bg-dark-700/50 border border-dark-600/50 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-accent-blue focus:border-transparent transition-all duration-200"
                  placeholder="email@exemplo.com"
                />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DadosGerais
