import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { PRO_CONFIG } from '../config/proConfig'
import { backgroundSyncRiders, saveRiderVersion, getRiderVersions, kvGet, kvSet } from '../utils/storage'
import { useAuth } from './AuthContext'
import { database } from '../config/supabase'

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
  const { user, isPro: userIsPro, hasAccount } = useAuth()

  // Sincronizar com localStorage se existir
  useEffect(() => {
    const storedPro = localStorage.getItem('riderForge_isPro')
    if (storedPro) {
      setIsPro(JSON.parse(storedPro))
    }
  }, [])

  // Atualizar estado Pro baseado no utilizador autenticado
  useEffect(() => {
    if (user && hasAccount) {
      setIsPro(userIsPro)
    }
  }, [user, userIsPro, hasAccount])

  // Salvar estado Pro no localStorage
  useEffect(() => {
    localStorage.setItem('riderForge_isPro', JSON.stringify(isPro))
  }, [isPro])

  // Carregar riders da base de dados quando o utilizador estiver autenticado
  useEffect(() => {
    const loadRidersFromDatabase = async () => {
      if (!user || !hasAccount) return

      try {
        const { data, error } = await database.riders.getUserRiders(user.id)
        if (error) throw error
        
        // Converter dados da base de dados para o formato local
        const convertedRiders = (data || []).map(rider => ({
          id: rider.id,
          name: rider.title,
          data: rider.data,
          createdAt: rider.created_at,
          updatedAt: rider.updated_at,
          thumbnail: {
            artista: rider.data?.dadosGerais?.artista || 'Sem artista',
            data: rider.updated_at,
            equipmentCount: Object.keys(rider.data || {}).length,
            cardName: rider.title
          }
        }))
        
        setSavedRiders(convertedRiders)
      } catch (error) {
        console.error('Error loading riders from database:', error)
      }
    }

    loadRidersFromDatabase()
  }, [user, hasAccount])

  // Adicionar rider de teste se não existir nenhum (apenas para utilizadores não autenticados)
  useEffect(() => {
    if (!user && savedRiders.length === 0) {
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
          data: new Date().toISOString(),
          equipmentCount: 1,
          cardName: 'Banda de Teste v1 2026'
        }
      }
      setSavedRiders([testRider])
    }
  }, [user, savedRiders.length])

  // Salvar riders no localStorage sempre que mudar (apenas para utilizadores não autenticados)
  useEffect(() => {
    if (!user) {
      try {
        const ridersJson = JSON.stringify(savedRiders)
        localStorage.setItem('riderForge_riders', ridersJson)
      } catch (error) {
        console.error('❌ Erro ao salvar riders:', error)
      }
      // Sincronização em background com IndexedDB (best-effort)
      backgroundSyncRiders(savedRiders).catch(error => {
        console.warn('Error syncing riders to IndexedDB:', error)
      })
    }
  }, [savedRiders, user])

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
      data: new Date().toISOString(), // Data da última alteração (ISO; format in UI)
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
  const saveRider = useCallback(async (riderData, name) => {
    if (!canSaveMoreRiders()) {
      throw new Error(`Limite da versão Free atingido. Máximo ${FREE_LIMITS.maxRiders} riders.`)
    }

    if (!canSaveBySize(riderData)) {
      throw new Error(`Limite de armazenamento da versão Free atingido. Máximo ${FREE_LIMITS.maxStorageMB}MB.`)
    }

    const thumbnail = generateThumbnail(riderData || {})
    const riderName = name || thumbnail.cardName || `Rider ${savedRiders.length + 1}`

    // Se o utilizador está autenticado, salvar na base de dados
    if (user && hasAccount) {
      try {
        const newRider = {
          title: riderName,
          data: riderData || {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }

        const { data, error } = await database.riders.createRider(newRider, user.id)
        if (error) throw error

        const convertedRider = {
          id: data.id,
          name: data.title,
          data: data.data,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          thumbnail: thumbnail
        }

        setSavedRiders(prev => [...prev, convertedRider])
        // Guardar versão inicial (não bloqueante) - também para utilizadores autenticados
        saveRiderVersion(convertedRider.id, convertedRider.data).catch(error => {
          console.warn('Error saving version for new rider:', error)
        })
        return convertedRider
      } catch (error) {
        console.error('Error saving rider to database:', error)
        throw error
      }
    } else {
      // Salvar localmente para utilizadores não autenticados
      const newRider = {
        id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
        name: riderName,
        data: riderData || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        thumbnail: thumbnail
      }

      setSavedRiders(prev => [...prev, newRider])
      
      // Garantir que o localStorage seja atualizado imediatamente
      try {
        const currentRiders = JSON.parse(localStorage.getItem('riderForge_riders') || '[]')
        const updatedRiders = [...currentRiders, newRider]
        localStorage.setItem('riderForge_riders', JSON.stringify(updatedRiders))
      } catch (error) {
        console.warn('Erro ao atualizar localStorage:', error)
      }
      
      // Guardar versão inicial (não bloqueante)
      saveRiderVersion(newRider.id, newRider.data).catch(error => {
        console.warn('Error saving version for new rider:', error)
      })
      return newRider
    }
  }, [savedRiders, canSaveMoreRiders, canSaveBySize, generateThumbnail, user, hasAccount])

  // Atualizar um rider existente
  const updateRider = useCallback(async (id, riderData, name) => {
    const thumbnail = generateThumbnail(riderData)
    const riderName = name || thumbnail.cardName

    // Se o utilizador está autenticado, atualizar na base de dados
    if (user && hasAccount) {
      try {
        const updates = {
          title: riderName,
          data: riderData,
          updated_at: new Date().toISOString()
        }

        const { data, error } = await database.riders.updateRider(id, updates, user.id)
        if (error) throw error

        const updatedRider = {
          id: data.id,
          name: data.title,
          data: data.data,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          thumbnail: thumbnail
        }

        setSavedRiders(prev => prev.map(rider => 
          rider.id === id ? updatedRider : rider
        ))
        // Salvar versão (não bloqueante) - também para utilizadores autenticados
        saveRiderVersion(data.id, riderData).catch(error => {
          console.warn('Error saving version for updated rider:', error)
        })
      } catch (error) {
        console.error('Error updating rider in database:', error)
        throw error
      }
    } else {
      // Atualizar localmente para utilizadores não autenticados
      const updatedRider = {
        id,
        data: riderData,
        name: riderName,
        updatedAt: new Date().toISOString(),
        thumbnail: thumbnail
      }
      
      setSavedRiders(prev => prev.map(rider => 
        rider.id === id 
          ? {
              ...rider,
              ...updatedRider
            }
          : rider
      ))
      
      // Garantir que o localStorage seja atualizado imediatamente
      try {
        const currentRiders = JSON.parse(localStorage.getItem('riderForge_riders') || '[]')
        const updatedRiders = currentRiders.map(rider => 
          rider.id === id 
            ? {
                ...rider,
                ...updatedRider
              }
            : rider
        )
        localStorage.setItem('riderForge_riders', JSON.stringify(updatedRiders))
      } catch (error) {
        console.warn('Erro ao atualizar localStorage:', error)
      }
      
      // Salvar versão (não bloqueante)
      saveRiderVersion(id, riderData).catch(error => {
        console.warn('Error saving version for updated rider:', error)
      })
    }
  }, [generateThumbnail, user, hasAccount])

  // Duplicar um rider
  const duplicateRider = useCallback(async (id) => {
    const originalRider = savedRiders.find(rider => rider.id === id)
    if (!originalRider) return null

    if (!canSaveMoreRiders()) {
      throw new Error(`Limite da versão Free atingido. Máximo ${FREE_LIMITS.maxRiders} riders.`)
    }

    const duplicatedRider = {
      ...originalRider,
      name: `${originalRider.name} (Cópia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Se o utilizador está autenticado, salvar na base de dados
    if (user && hasAccount) {
      try {
        const newRider = {
          title: duplicatedRider.name,
          data: duplicatedRider.data,
          created_at: duplicatedRider.createdAt,
          updated_at: duplicatedRider.updatedAt
        }

        const { data, error } = await database.riders.createRider(newRider, user.id)
        if (error) throw error

        const convertedRider = {
          id: data.id,
          name: data.title,
          data: data.data,
          createdAt: data.created_at,
          updatedAt: data.updated_at,
          thumbnail: duplicatedRider.thumbnail
        }

        setSavedRiders(prev => [...prev, convertedRider])
        // Guardar versão inicial (não bloqueante) - também para utilizadores autenticados
        saveRiderVersion(convertedRider.id, convertedRider.data).catch(error => {
          console.warn('Error saving version for duplicated rider:', error)
        })
        return convertedRider
      } catch (error) {
        console.error('Error duplicating rider in database:', error)
        throw error
      }
    } else {
      // Duplicar localmente para utilizadores não autenticados
      duplicatedRider.id = Date.now().toString()
      setSavedRiders(prev => [...prev, duplicatedRider])
      // Salvar versão (não bloqueante)
      saveRiderVersion(duplicatedRider.id, duplicatedRider.data).catch(error => {
        console.warn('Error saving version for duplicated rider:', error)
      })
      return duplicatedRider
    }
  }, [savedRiders, canSaveMoreRiders, user, hasAccount])

  // Apagar um rider
  const deleteRider = useCallback(async (id) => {
    // Se o utilizador está autenticado, apagar da base de dados
    if (user && hasAccount) {
      try {
        const { error } = await database.riders.deleteRider(id, user.id)
        if (error) throw error
      } catch (error) {
        console.error('Error deleting rider from database:', error)
        throw error
      }
    }

    setSavedRiders(prev => prev.filter(rider => rider.id !== id))
  }, [user, hasAccount])

  // Obter um rider por ID (incluindo demos temporários)
  const getRiderById = useCallback((id) => {
    // Primeiro procurar nos riders salvos
    const rider = savedRiders.find(rider => rider.id === id)
    if (rider) return rider
    
    // Se não encontrar e o ID indica que é um demo temporário, procurar no localStorage
    if (id.startsWith('demo_temp_')) {
      try {
        const tempDemo = localStorage.getItem('riderForge_temp_demo')
        if (tempDemo) {
          const demoRider = JSON.parse(tempDemo)
          if (demoRider.id === id) {
            return demoRider
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar demo temporário:', error)
      }
    }
    
    // Fallback: tentar carregar do localStorage se não encontrar no estado
    if (!user) {
      try {
        const stored = localStorage.getItem('riderForge_riders')
        if (stored) {
          const storedRiders = JSON.parse(stored)
          const storedRider = storedRiders.find(rider => rider.id === id)
          if (storedRider) {
            return storedRider
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar rider do localStorage:', error)
      }
    }
    
    return null
  }, [savedRiders, user])

  // Função para obter rider com sincronização forçada
  const getRiderByIdWithSync = useCallback((id) => {
    console.log('🔍 getRiderByIdWithSync chamado com ID:', id, 'Tipo:', typeof id)
    
    // Validar ID
    if (!id || id === 'undefined' || id === 'null') {
      console.log('❌ ID inválido:', id)
      return null
    }
    
    // Primeiro tentar encontrar no estado atual
    let rider = savedRiders.find(rider => rider.id === id)
    if (rider) {
      console.log('✅ Rider encontrado no estado:', rider.name, 'ID:', rider.id)
      return rider
    }
    
    console.log('📊 Estado atual tem', savedRiders.length, 'riders')
    console.log('📋 Riders no estado:', savedRiders.map(r => ({ id: r.id, name: r.name })))
    console.log('🔍 Procurando por ID:', id)
    console.log('🔍 Comparando IDs:', savedRiders.map(r => ({ id: r.id, matches: r.id === id })))
    
    // Se não encontrar e não for utilizador autenticado, forçar sincronização
    if (!user) {
      console.log('🔄 Forçando sincronização...')
      try {
        const stored = localStorage.getItem('riderForge_riders')
        if (stored) {
          const storedRiders = JSON.parse(stored)
          console.log('📦 Verificando localStorage:', storedRiders.length, 'riders')
          console.log('📋 Riders no localStorage:', storedRiders.map(r => ({ id: r.id, name: r.name })))
          
          rider = storedRiders.find(rider => rider.id === id)
          if (rider) {
            console.log('💾 Rider encontrado no localStorage:', rider.name, 'ID:', rider.id)
            // Atualizar o estado para futuras consultas
            setSavedRiders(storedRiders)
            return rider
          }
        } else {
          console.log('📭 localStorage vazio')
        }
      } catch (error) {
        console.warn('Erro ao verificar localStorage:', error)
      }
    }
    
    // Verificar demos temporários
    if (id.startsWith('demo_temp_')) {
      try {
        const tempDemo = localStorage.getItem('riderForge_temp_demo')
        if (tempDemo) {
          const demoRider = JSON.parse(tempDemo)
          if (demoRider.id === id) {
            console.log('🎭 Demo rider encontrado:', demoRider.name, 'ID:', demoRider.id)
            return demoRider
          }
        }
      } catch (error) {
        console.warn('Erro ao carregar demo temporário:', error)
      }
    }
    
    console.log('❌ Rider não encontrado em nenhum local para ID:', id)
    return null
  }, [savedRiders, user])

  // Função para forçar sincronização do estado
  const forceSyncState = useCallback(() => {
    if (!user) {
      try {
        const stored = localStorage.getItem('riderForge_riders')
        if (stored) {
          const storedRiders = JSON.parse(stored)
          setSavedRiders(storedRiders)
        }
      } catch (error) {
        console.warn('Erro ao sincronizar estado:', error)
      }
    }
  }, [user])

  // Converter rider demo temporário em permanente
  const saveDemoRiderAsPermanent = useCallback(async (demoId, customName) => {
    const demoRider = getRiderById(demoId)
    if (!demoRider || !demoRider.isDemo) {
      throw new Error('Rider demo não encontrado')
    }

    // Usar a função saveRider normal para guardar permanentemente
    const permanentName = customName || demoRider.name.replace(' (Demo)', '')
    const savedRider = await saveRider(demoRider.data, permanentName)
    
    // Limpar o demo temporário do localStorage
    try {
      localStorage.removeItem('riderForge_temp_demo')
    } catch (error) {
      console.warn('Erro ao limpar demo temporário:', error)
    }
    
    return savedRider
  }, [getRiderById, saveRider])

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
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          const importedData = JSON.parse(e.target.result)
          
          // Validar estrutura básica
          if (!importedData.data || !importedData.name) {
            throw new Error('Formato de arquivo inválido')
          }

          // Salvar o rider importado
          const savedRider = await saveRider(importedData.data, importedData.name)
          resolve(savedRider)
        } catch (error) {
          reject(error)
        }
      }
      
      reader.onerror = () => reject(new Error('Erro ao ler arquivo'))
      reader.readAsText(file)
    })
  }, [saveRider])

  // Obter estatísticas
  const getStats = useCallback(() => {
    const totalSize = savedRiders.reduce((total, rider) => {
      return total + calculateStorageSize(rider.data || {})
    }, 0)

    return {
      totalRiders: savedRiders.length,
      totalSize: totalSize.toFixed(2),
      maxRiders: isPro ? '∞' : FREE_LIMITS.maxRiders,
      maxStorage: isPro ? '∞' : `${FREE_LIMITS.maxStorageMB}MB`
    }
  }, [savedRiders, isPro, calculateStorageSize])

  // Restaurar versão de um rider
  const restoreRiderVersion = useCallback((riderId, versionData) => {
    setSavedRiders(prev => prev.map(rider => 
      rider.id === riderId 
        ? {
            ...rider,
            data: versionData,
            updatedAt: new Date().toISOString(),
            thumbnail: generateThumbnail(versionData)
          }
        : rider
    ))
    // Salvar nova versão após restauração (não bloqueante)
    saveRiderVersion(riderId, versionData).catch(error => {
      console.warn('Error saving version after restore:', error)
    })
  }, [generateThumbnail])

  const value = {
    savedRiders,
    isPro,
    setIsPro,
    saveRider,
    updateRider,
    duplicateRider,
    deleteRider,
    getRiderById,
    getRiderByIdWithSync,
    forceSyncState,
    saveDemoRiderAsPermanent,
    exportRider,
    importRider,
    restoreRiderVersion,
    getStats,
    canSaveMoreRiders,
    canSaveBySize,
    FREE_LIMITS
  }

  return (
    <RiderContext.Provider value={value}>
      {children}
    </RiderContext.Provider>
  )
}

export const useRider = () => {
  const context = useContext(RiderContext)
  if (!context) {
    throw new Error('useRider must be used within a RiderProvider')
  }
  return context
}
