/**
 * Processador de PDF usando APIs públicas
 * Alternativa ao PDF.js para casos onde o processamento local falha
 */

/**
 * Extrai texto usando uma API pública de conversão de PDF
 * @param {File} file - Arquivo PDF
 * @returns {Promise<string>} Texto extraído
 */
export const extractTextWithPublicAPI = async (file) => {
  try {
    // Usar uma API pública de conversão de PDF
    const formData = new FormData()
    formData.append('file', file)
    
    // Tentar com uma API pública de conversão
    const response = await fetch('https://api.cloudconvert.com/v2/convert', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer demo', // Token demo para testes
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    })
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }
    
    const result = await response.json()
    return result.text || ''
  } catch (error) {
    console.warn('API pública falhou:', error)
    throw error
  }
}

/**
 * Extrai texto usando conversão manual via ferramentas online
 * @param {File} file - Arquivo PDF
 * @returns {Promise<string>} Texto extraído
 */
export const extractTextWithManualConversion = async (file) => {
  try {
    // Esta função simula o processo de conversão manual
    // Na prática, seria melhor direcionar o usuário para ferramentas online
    
    throw new Error('Conversão manual necessária. Use ferramentas online como Adobe PDF to Text.')
  } catch (error) {
    console.warn('Conversão manual falhou:', error)
    throw error
  }
}

/**
 * Extrai texto usando múltiplas APIs como fallback
 * @param {File} file - Arquivo PDF
 * @returns {Promise<string>} Texto extraído
 */
export const extractTextWithAPIs = async (file) => {
  const apis = [
    { name: 'Public API', func: extractTextWithPublicAPI },
    { name: 'Manual Conversion', func: extractTextWithManualConversion }
  ]
  
  for (const api of apis) {
    try {
      console.log(`Tentando API ${api.name}...`)
      const text = await api.func(file)
      if (text && text.trim()) {
        console.log(`API ${api.name} funcionou!`)
        return text
      }
    } catch (error) {
      console.warn(`API ${api.name} falhou:`, error.message)
      continue
    }
  }
  
  throw new Error('Todas as APIs falharam. Tente com um PDF diferente ou use uma ferramenta de conversão manual.')
}

/**
 * Processa um PDF usando APIs públicas
 * @param {File} file - Arquivo PDF
 * @returns {Promise<Object>} Dados estruturados do rider
 */
export const processPDFWithAPIs = async (file) => {
  try {
    console.log('Processando PDF com APIs públicas...')
    
    // Verificar arquivo
    if (!file || file.type !== 'application/pdf') {
      throw new Error('Arquivo inválido. Por favor, selecione um arquivo PDF válido.')
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB para APIs
      throw new Error('Arquivo muito grande para APIs públicas. Máximo 10MB.')
    }
    
    // Extrair texto usando APIs
    const text = await extractTextWithAPIs(file)
    
    if (!text || !text.trim()) {
      throw new Error('Nenhum texto foi extraído pelas APIs.')
    }
    
    console.log('Texto extraído (primeiros 200 caracteres):', text.substring(0, 200))
    
    // Processar o texto extraído
    const riderData = parseRiderFromText(text)
    
    // Gerar nome
    const dadosGerais = riderData['dados-gerais'] || {}
    const name = dadosGerais.artista || dadosGerais.local || 'Rider Importado via API'
    
    return {
      name,
      data: riderData
    }
  } catch (error) {
    console.error('Erro ao processar PDF com APIs:', error)
    throw error
  }
}

/**
 * Extrai informações de rider de texto
 * @param {string} text - Texto extraído do PDF
 * @returns {Object} Dados estruturados do rider
 */
const parseRiderFromText = (text) => {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0)
  
  const riderData = {
    'dados-gerais': {},
    'pa': {},
    'consolas': {},
    'sistemas-escuta': {},
    'equipamento-auxiliar': {},
    'input-list': {},
    'monitor-mixes': {},
    'observacoes-finais': {}
  }

  let currentSection = null

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase()
    
    // Detectar seções principais
    if (line.includes('dados gerais') || line.includes('informações gerais')) {
      currentSection = 'dados-gerais'
      continue
    } else if (line.includes('pa') || line.includes('sistema de som') || line.includes('sistema principal')) {
      currentSection = 'pa'
      continue
    } else if (line.includes('consola') || line.includes('console') || line.includes('mesa')) {
      currentSection = 'consolas'
      continue
    } else if (line.includes('escuta') || line.includes('monitor') || line.includes('iem')) {
      currentSection = 'sistemas-escuta'
      continue
    } else if (line.includes('equipamento auxiliar') || line.includes('equipamentos auxiliares')) {
      currentSection = 'equipamento-auxiliar'
      continue
    } else if (line.includes('input list') || line.includes('lista de entradas')) {
      currentSection = 'input-list'
      continue
    } else if (line.includes('monitor mixes') || line.includes('misturas de monitor')) {
      currentSection = 'monitor-mixes'
      continue
    } else if (line.includes('observações') || line.includes('notas') || line.includes('comentários')) {
      currentSection = 'observacoes-finais'
      continue
    }

    // Processar dados baseado na seção atual
    if (currentSection === 'dados-gerais') {
      if (line.includes('artista') || line.includes('banda')) {
        const value = extractValue(lines, i)
        if (value) riderData['dados-gerais'].artista = value
      } else if (line.includes('local') || line.includes('venue')) {
        const value = extractValue(lines, i)
        if (value) riderData['dados-gerais'].local = value
      } else if (line.includes('data') || line.includes('date')) {
        const value = extractValue(lines, i)
        if (value) riderData['dados-gerais'].data = value
      } else if (line.includes('hora') || line.includes('time')) {
        const value = extractValue(lines, i)
        if (value) riderData['dados-gerais'].hora = value
      }
    } else if (currentSection === 'pa') {
      if (line.includes('sistema') || line.includes('pa')) {
        const value = extractValue(lines, i)
        if (value) {
          if (!riderData['pa'].sistema) riderData['pa'].sistema = []
          riderData['pa'].sistema.push(value)
        }
      }
    } else if (currentSection === 'consolas') {
      if (line.includes('consola') || line.includes('console')) {
        const value = extractValue(lines, i)
        if (value) {
          if (!riderData['consolas'].consola) riderData['consolas'].consola = []
          riderData['consolas'].consola.push(value)
        }
      }
    } else if (currentSection === 'sistemas-escuta') {
      if (line.includes('escuta') || line.includes('monitor')) {
        const value = extractValue(lines, i)
        if (value) {
          if (!riderData['sistemas-escuta'].sistema) riderData['sistemas-escuta'].sistema = []
          riderData['sistemas-escuta'].sistema.push(value)
        }
      }
    } else if (currentSection === 'equipamento-auxiliar') {
      if (line.includes('equipamento') || line.includes('equip')) {
        const value = extractValue(lines, i)
        if (value) {
          if (!riderData['equipamento-auxiliar'].equipamento) riderData['equipamento-auxiliar'].equipamento = []
          riderData['equipamento-auxiliar'].equipamento.push(value)
        }
      }
    } else if (currentSection === 'observacoes-finais') {
      if (!riderData['observacoes-finais'].observacoes) {
        riderData['observacoes-finais'].observacoes = []
      }
      riderData['observacoes-finais'].observacoes.push(lines[i])
    }
  }

  // Limpar seções vazias
  Object.keys(riderData).forEach(key => {
    if (Object.keys(riderData[key]).length === 0) {
      delete riderData[key]
    }
  })

  return riderData
}

/**
 * Extrai valor após dois pontos ou igual
 */
const extractValue = (lines, index) => {
  const line = lines[index]
  const colonIndex = line.indexOf(':')
  const equalIndex = line.indexOf('=')
  
  if (colonIndex !== -1) {
    return line.substring(colonIndex + 1).trim()
  } else if (equalIndex !== -1) {
    return line.substring(equalIndex + 1).trim()
  }
  
  // Tentar próxima linha se a atual não tem valor
  if (index + 1 < lines.length) {
    const nextLine = lines[index + 1]
    if (nextLine && !nextLine.includes(':') && !nextLine.includes('=')) {
      return nextLine.trim()
    }
  }
  
  return null
}
