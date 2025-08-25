import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { PRO_CONFIG } from '../config/proConfig'
import { backgroundSyncRiders, saveRiderVersion, getRiderVersions, kvGet, kvSet } from '../utils/storage'

const RiderContext = createContext()

// Limites da versão Free
const FREE_LIMITS = PRO_CONFIG.FREE_LIMITS

// Função para carregar dados do localStorage de forma síncrona
const loadInitialRiders = () => {
  try {
    const stored = localStorage.getItem('riderForge_riders')
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('❌ Erro ao carregar riders:', error)
  }
  return []
}

export function RiderProvider({ children }) {
  const [savedRiders, setSavedRiders] = useState(() => loadInitialRiders()) // Carrega imediatamente
  const [isPro, setIsPro] = useState(false) // Começa como Free

  // Sincronizar com localStorage se existir
  useEffect(() => {
    const storedPro = localStorage.getItem('riderForge_isPro')
    if (storedPro) {
      setIsPro(JSON.parse(storedPro))
    }
  }, [])

  // Salvar estado Pro no localStorage
  useEffect(() => {
    localStorage.setItem('riderForge_isPro', JSON.stringify(isPro))
  }, [isPro])

  // Adicionar rider de teste se não existir nenhum (apenas uma vez)
  useEffect(() => {
    if (savedRiders.length === 0) {
      const testRider = {
        id: Date.now().toString() + '_test',
        name: 'Banda de Teste v1 2026',
        data: {
          'dados-gerais': {
            artista: 'Banda de Teste',
            versaoRider: '1',
            anoTour: '2026',
            local: 'Local de Teste',
            data: '2024-01-01'
          }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: {
          artista: 'Banda de Teste',
          data: new Date().toLocaleDateString('pt-PT'),
          equipmentCount: 1,
          cardName: 'Banda de Teste v1 2026'
        }
      }
      setSavedRiders([testRider])
    }
  }, [])

  // Salvar riders no localStorage sempre que mudar
  useEffect(() => {
    try {
      localStorage.setItem('riderForge_riders', JSON.stringify(savedRiders))
    } catch (error) {
      console.error('❌ Erro ao salvar riders:', error)
    }
    // Sincronização em background com IndexedDB (best-effort)
    backgroundSyncRiders(savedRiders)
  }, [savedRiders])

  // Verificar se pode salvar mais riders (versão Free)
  const canSaveMoreRiders = useCallback(() => {
    if (isPro) return true
    return savedRiders.length < FREE_LIMITS.maxRiders
  }, [savedRiders.length, isPro])

  // Calcular tamanho aproximado dos dados
  const calculateStorageSize = useCallback((data) => {
    try {
      const jsonString = JSON.stringify(data || {})
      return new Blob([jsonString]).size / (1024 * 1024) // MB
    } catch (error) {
      return 0
    }
  }, [])

  // Gerar thumbnail do rider
  const generateThumbnail = useCallback((data) => {
    const dadosGerais = data['dados-gerais'] || {}
    const artista = dadosGerais.artista || 'Sem artista'
    const versao = dadosGerais.versaoRider || ''
    const ano = dadosGerais.anoTour || ''
    
    // Criar nome do card: Nome da Banda + Versão + Ano
    let cardName = artista
    if (versao) cardName += ` v${versao}`
    if (ano) cardName += ` ${ano}`
    
    return {
      artista: dadosGerais.artista || 'Sem artista',
      data: new Date().toLocaleDateString('pt-PT'), // Data da última alteração
      equipmentCount: Object.keys(data).length,
      cardName: cardName
    }
  }, [])

  // Verificar se pode salvar pelo tamanho
  const canSaveBySize = useCallback((data) => {
    if (isPro) return true
    try {
      const currentSize = savedRiders.reduce((total, rider) => {
        return total + calculateStorageSize(rider.data || {})
      }, 0)
      const newSize = calculateStorageSize(data || {})
      return (currentSize + newSize) <= FREE_LIMITS.maxStorageMB
    } catch (error) {
      return true // Em caso de erro, permite salvar
    }
  }, [savedRiders, isPro, calculateStorageSize])

  // Salvar um novo rider
  const saveRider = useCallback((riderData, name) => {
    if (!canSaveMoreRiders()) {
      throw new Error(`Limite da versão Free atingido. Máximo ${FREE_LIMITS.maxRiders} riders.`)
    }

    if (!canSaveBySize(riderData)) {
      throw new Error(`Limite de armazenamento da versão Free atingido. Máximo ${FREE_LIMITS.maxStorageMB}MB.`)
    }

    const thumbnail = generateThumbnail(riderData || {})
    const newRider = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      name: name || thumbnail.cardName || `Rider ${savedRiders.length + 1}`,
      data: riderData || {},
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      thumbnail: thumbnail
    }

    setSavedRiders(prev => [...prev, newRider])
    // Guardar versão inicial
    try { saveRiderVersion(newRider.id, newRider.data) } catch (_) {}
    return newRider
  }, [savedRiders, canSaveMoreRiders, canSaveBySize, generateThumbnail])

  // Atualizar um rider existente
  const updateRider = useCallback((id, riderData, name) => {
    setSavedRiders(prev => prev.map(rider => 
      rider.id === id 
        ? {
            ...rider,
            data: riderData,
            name: name || generateThumbnail(riderData).cardName || rider.name,
            updatedAt: new Date().toISOString(),
            thumbnail: generateThumbnail(riderData)
          }
        : rider
    ))
    try { saveRiderVersion(id, riderData) } catch (_) {}
  }, [generateThumbnail])

  // Duplicar um rider
  const duplicateRider = useCallback((id) => {
    const originalRider = savedRiders.find(rider => rider.id === id)
    if (!originalRider) return null

    if (!canSaveMoreRiders()) {
      throw new Error(`Limite da versão Free atingido. Máximo ${FREE_LIMITS.maxRiders} riders.`)
    }

    const duplicatedRider = {
      ...originalRider,
      id: Date.now().toString(),
      name: `${originalRider.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setSavedRiders(prev => [...prev, duplicatedRider])
    try { saveRiderVersion(duplicatedRider.id, duplicatedRider.data) } catch (_) {}
    return duplicatedRider
  }, [savedRiders, canSaveMoreRiders])

  // Apagar um rider
  const deleteRider = useCallback((id) => {
    setSavedRiders(prev => prev.filter(rider => rider.id !== id))
  }, [])

  // Obter um rider por ID
  const getRiderById = useCallback((id) => {
    const rider = savedRiders.find(rider => rider.id === id)
    return rider
  }, [savedRiders])

  // Exportar rider como JSON
  const exportRider = useCallback((id) => {
    const rider = getRiderById(id)
    if (!rider) return null

    const exportData = {
      ...rider,
      exportedAt: new Date().toISOString(),
      version: '1.0'
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${rider.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [getRiderById])

  // Importar rider de JSON
  const importRider = useCallback(async (file) => {
    try {
      let importedData

      // Verificar tipo de arquivo
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        // Processar JSON
        importedData = await new Promise((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => {
            try {
              const data = JSON.parse(e.target.result)
              resolve({
                name: data.name || 'Rider Importado',
                data: data.data || data
              })
            } catch (error) {
              reject(new Error('Formato de ficheiro JSON inválido'))
            }
          }
          reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
          reader.readAsText(file)
        })
      } else {
        throw new Error('Formato de ficheiro não suportado. Use apenas JSON.')
      }

      if (!canSaveMoreRiders()) {
        throw new Error(`Limite da versão Free atingido. Máximo ${FREE_LIMITS.maxRiders} riders.`)
      }

      if (!canSaveBySize(importedData.data)) {
        throw new Error(`Limite de armazenamento da versão Free atingido. Máximo ${FREE_LIMITS.maxStorageMB}MB.`)
      }

      const importedRider = {
        id: Date.now().toString(),
        name: importedData.name || 'Rider Importado',
        data: importedData.data || importedData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: generateThumbnail(importedData.data || importedData)
      }

      setSavedRiders(prev => [...prev, importedRider])
      try { saveRiderVersion(importedRider.id, importedRider.data) } catch (_) {}
      return importedRider
    } catch (error) {
      throw error
    }
  }, [canSaveMoreRiders, canSaveBySize, generateThumbnail])

  // Obter estatísticas
  const getStats = useCallback(() => {
    try {
      const totalSize = savedRiders.reduce((total, rider) => {
        return total + calculateStorageSize(rider.data || {})
      }, 0)

      return {
        totalRiders: savedRiders.length,
        totalSize: totalSize.toFixed(2),
        maxRiders: isPro ? 'Ilimitado' : FREE_LIMITS.maxRiders,
        maxStorage: isPro ? 'Ilimitado' : `${FREE_LIMITS.maxStorageMB}MB`,
        canSaveMore: canSaveMoreRiders()
      }
    } catch (error) {
      return {
        totalRiders: savedRiders.length,
        totalSize: '0.00',
        maxRiders: isPro ? 'Ilimitado' : FREE_LIMITS.maxRiders,
        maxStorage: isPro ? 'Ilimitado' : `${FREE_LIMITS.maxStorageMB}MB`,
        canSaveMore: canSaveMoreRiders()
      }
    }
  }, [savedRiders, isPro, calculateStorageSize, canSaveMoreRiders])

  const value = {
    savedRiders,
    isPro,
    setIsPro,
    saveRider,
    updateRider,
    duplicateRider,
    deleteRider,
    getRiderById,
    exportRider,
    importRider,
    canSaveMoreRiders,
    canSaveBySize,
    getStats,
    FREE_LIMITS
  }

  return (
    <RiderContext.Provider value={value}>
      {children}
    </RiderContext.Provider>
  )
}

export function useRider() {
  const context = useContext(RiderContext)
  if (!context) {
    throw new Error('useRider must be used within a RiderProvider')
  }
  return context
}
