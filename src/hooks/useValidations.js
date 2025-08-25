import { useState, useEffect } from 'react'
import { useEquipment } from '../context/EquipmentContext'

export const useValidations = (formData) => {
  const { getFilteredEquipment } = useEquipment()
  const [validations, setValidations] = useState([])

  // Função para adicionar uma validação
  const addValidation = (type, message, severity = 'warning', data = {}) => {
    const validation = {
      id: Date.now() + Math.random(),
      type,
      message,
      severity, // 'warning', 'error', 'info'
      data,
      timestamp: Date.now()
    }
    
    setValidations(prev => {
      // Remove validações duplicadas do mesmo tipo
      const filtered = prev.filter(v => v.type !== type)
      return [...filtered, validation]
    })
  }

  // Função para remover uma validação
  const removeValidation = (type) => {
    setValidations(prev => prev.filter(v => v.type !== type))
  }

  // Função para limpar todas as validações
  const clearValidations = () => {
    setValidations([])
  }

  // Helpers para suportar estrutura atual (rider["input-list"].inputs) e legado (formData.inputs)
  const getInputs = () => {
    const rider = formData || {};
    return rider['input-list']?.inputs || rider.inputs || [];
  };
  const getMonitorMixes = () => {
    const rider = formData || {};
    return rider['monitor-mixes']?.mixes || rider.monitorMixes || [];
  };
  const getSistemasEscuta = () => {
    const rider = formData || {};
    return rider['sistemas-escuta'] || rider.sistemasEscuta || {};
  };
  const getConsolasFOH = () => {
    const rider = formData || {};
    // tentativa de obter consola selecionada em diferentes estruturas
    const consolas = rider['consolas'] || rider.consolas || {};
    const foh = consolas.foh || {};
    return foh.consolaPreferida?.marca && foh.consolaPreferida?.modelo
      ? `${foh.consolaPreferida.marca} — ${foh.consolaPreferida.modelo}`
      : rider.foh?.console;
  };

  // Validação 1: Phantom ligado em microfone dinâmico
  const validatePhantomOnDynamicMic = () => {
    const inputs = getInputs()
    if (!inputs) return

    const microphones = getFilteredEquipment('mic')
    let hasPhantomIssue = false
    
    inputs.forEach(input => {
      if (input.microDi && input.phantom) {
        const mic = microphones.find(m => `${m.marca} — ${m.modelo}` === input.microDi)
        if (mic && mic.phantom === false) {
          hasPhantomIssue = true
          addValidation(
            'phantom_dynamic',
            `Phantom power está ligado no microfone dinâmico ${input.microDi}. Considere desligar para evitar danos.`,
            'warning',
            { inputId: input.id, canal: input.canal }
          )
        }
      }
    })
    
    if (!hasPhantomIssue) {
      removeValidation('phantom_dynamic')
    }
  }

  // Validação 2: Sugerir DI para fontes específicas
  const validateDISuggestion = () => {
    const inputs = getInputs()
    if (!inputs) return

    const diBoxes = getFilteredEquipment('di')
    const sourcesNeedingDI = ['teclado', 'teclados', 'acústica', 'acústicas', 'track', 'tracks', 'playback']
    let hasDISuggestion = false
    
    inputs.forEach(input => {
      if (input.fonte && !input.microDi) {
        const sourceLower = input.fonte.toLowerCase()
        const needsDI = sourcesNeedingDI.some(term => sourceLower.includes(term))
        
        if (needsDI) {
          hasDISuggestion = true
          addValidation(
            'di_suggestion',
            `Considere usar DI para "${input.fonte}". Fontes como teclados, acústicas e tracks geralmente precisam de DI.`,
            'info',
            { inputId: input.id, canal: input.canal, fonte: input.fonte }
          )
        }
      }
    })
    
    if (!hasDISuggestion) {
      removeValidation('di_suggestion')
    }
  }

  // Validação 3: Capacidade da stagebox
  const validateStageboxCapacity = () => {
    const inputs = getInputs()
    if (!inputs) return

    const selectedConsole = getConsolasFOH()
    if (!selectedConsole) return

    const consoles = getFilteredEquipment('console')
    const console = consoles.find(c => `${c.marca} — ${c.modelo}` === selectedConsole)
    
    // Capacidades conhecidas de stageboxes (pode ser expandido)
    const stageboxCapacities = {
      'Midas — Pro Series': 48,
      'Midas — HD96': 96,
      'Yamaha — CL5': 72,
      'Yamaha — DM7': 128,
      'Allen & Heath — dLive': 128,
      'Digico — SD12': 96,
      'Digico — SD7': 96,
      'Digico — SD9': 48,
      'Digico — SD11': 48,
      'Digico — SD8': 48,
      'Digico — SD5': 96,
      'Digico — SD10': 96,
      'Digico — SD7T': 96,
      'Digico — SD5T': 96,
      'Digico — SD10T': 96,
      'Digico — SD12T': 96,
      'Digico — SD9T': 48,
      'Digico — SD11T': 48,
      'Digico — SD8T': 48
    }

    const capacity = stageboxCapacities[selectedConsole]
    if (capacity && inputs.length > capacity) {
      addValidation(
        'stagebox_capacity',
        `Número de inputs (${inputs.length}) excede a capacidade da stagebox ${selectedConsole} (${capacity} inputs).`,
        'error',
        { 
          currentInputs: inputs.length, 
          maxCapacity: capacity, 
          console: selectedConsole 
        }
      )
    } else {
      removeValidation('stagebox_capacity')
    }
  }

  // Validação 4: IEM sem mix atribuído
  const validateIEMWithoutMix = () => {
    const sistemasEscuta = getSistemasEscuta()
    const monitorMixes = getMonitorMixes()

    const iemQuantity = parseInt(sistemasEscuta.iems?.quantidade) || 0
    const iemMixes = monitorMixes.filter(mix => mix.tipo === 'iem')
    
    if (iemQuantity > 0 && iemMixes.length === 0) {
      addValidation(
        'iem_no_mix',
        `${iemQuantity} IEM(s) configurado(s) mas nenhum mix de IEM foi criado. Crie mixes de monitor para os IEMs.`,
        'warning',
        { iemQuantity, iemMixesCount: iemMixes.length }
      )
    } else if (iemQuantity > 0 && iemMixes.length < iemQuantity) {
      addValidation(
        'iem_insufficient_mix',
        `${iemQuantity} IEM(s) configurado(s) mas apenas ${iemMixes.length} mix(es) criado(s). Considere criar mais mixes.`,
        'warning',
        { iemQuantity, iemMixesCount: iemMixes.length }
      )
    } else {
      removeValidation('iem_no_mix')
      removeValidation('iem_insufficient_mix')
    }
  }

  // Validação 5: Canais duplicados na Input List
  const validateDuplicateChannels = () => {
    const inputs = getInputs()
    if (!inputs || inputs.length === 0) return removeValidation('duplicate_channels')
    const seen = new Set()
    const dups = new Set()
    inputs.forEach(i => {
      const c = (i.canal || '').toString().trim()
      if (!c) return
      if (seen.has(c)) dups.add(c)
      else seen.add(c)
    })
    if (dups.size > 0) {
      addValidation(
        'duplicate_channels',
        `Canais duplicados detectados: ${Array.from(dups).join(', ')}`,
        'warning',
        { duplicates: Array.from(dups) }
      )
    } else {
      removeValidation('duplicate_channels')
    }
  }

  // Executar todas as validações
  useEffect(() => {
    validatePhantomOnDynamicMic()
    validateDISuggestion()
    validateStageboxCapacity()
    validateIEMWithoutMix()
    validateDuplicateChannels()
  }, [formData, getFilteredEquipment])

  return {
    validations,
    addValidation,
    removeValidation,
    clearValidations
  }
}
