import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useRider } from './RiderContext'

const StagePlotContext = createContext()

export function StagePlotProvider({ children }) {
  const { savedRiders, isPro } = useRider()
  const [stagePlots, setStagePlots] = useState({}) // riderId -> stageplot data

  // Load stage plots from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('riderForge_stagePlots')
      if (stored) {
        setStagePlots(JSON.parse(stored))
      }
    } catch (error) {
      console.error('❌ Erro ao carregar stage plots:', error)
    }
  }, [])

  // Save stage plots to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem('riderForge_stagePlots', JSON.stringify(stagePlots))
    } catch (error) {
      console.error('❌ Erro ao salvar stage plots:', error)
    }
  }, [stagePlots])

  // Check if user can save a stage plot for a rider
  const canSaveStageplot = useCallback((riderId) => {
    // Check if rider exists
    const rider = savedRiders.find(r => r.id === riderId)
    if (!rider) return false

    // Free users: can only save stage plots for their riders (max 2 riders)
    // Pro users: unlimited riders, so unlimited stage plots
    if (!isPro) {
      // Free users are already limited to 2 riders, so they can have max 2 stage plots
      return savedRiders.length <= 2
    }

    return true // Pro users have no limits
  }, [savedRiders, isPro])

  // Get stage plot for a specific rider
  const getStageplotByRiderId = useCallback((riderId) => {
    return stagePlots[riderId] || null
  }, [stagePlots])

  // Save stage plot for a rider
  const saveStageplot = useCallback((riderId, stageplotData) => {
    if (!canSaveStageplot(riderId)) {
      throw new Error('Não é possível salvar mais stage plots na versão Free. Máximo 2 riders.')
    }

    const rider = savedRiders.find(r => r.id === riderId)
    if (!rider) {
      throw new Error('Rider não encontrado.')
    }

    const newStageplot = {
      id: Date.now().toString() + '_' + Math.random().toString(36).substr(2, 9),
      riderId: riderId,
      title: stageplotData.layout?.bandName || rider.name || 'Stage Plot',
      layout: stageplotData.layout || {},
      png: stageplotData.png || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    setStagePlots(prev => ({
      ...prev,
      [riderId]: newStageplot
    }))

    return newStageplot
  }, [savedRiders, canSaveStageplot])

  // Update existing stage plot
  const updateStageplot = useCallback((riderId, stageplotData) => {
    const existingStageplot = stagePlots[riderId]
    if (!existingStageplot) {
      // If no existing stage plot, create new one
      return saveStageplot(riderId, stageplotData)
    }

    const updatedStageplot = {
      ...existingStageplot,
      title: stageplotData.layout?.bandName || existingStageplot.title,
      layout: stageplotData.layout || existingStageplot.layout,
      png: stageplotData.png || existingStageplot.png,
      updatedAt: new Date().toISOString()
    }

    setStagePlots(prev => ({
      ...prev,
      [riderId]: updatedStageplot
    }))

    return updatedStageplot
  }, [stagePlots, saveStageplot])

  // Delete stage plot for a rider
  const deleteStageplot = useCallback((riderId) => {
    setStagePlots(prev => {
      const newStagePlots = { ...prev }
      delete newStagePlots[riderId]
      return newStagePlots
    })
  }, [])

  // Get all stage plots for current user
  const getAllStageplots = useCallback(() => {
    return Object.values(stagePlots).filter(sp => 
      savedRiders.some(rider => rider.id === sp.riderId)
    )
  }, [stagePlots, savedRiders])

  // Clean up stage plots for riders that no longer exist
  useEffect(() => {
    const riderIds = savedRiders.map(r => r.id)
    setStagePlots(prev => {
      const cleaned = {}
      Object.keys(prev).forEach(riderId => {
        if (riderIds.includes(riderId)) {
          cleaned[riderId] = prev[riderId]
        }
      })
      return cleaned
    })
  }, [savedRiders])

  const value = {
    stagePlots,
    canSaveStageplot,
    getStageplotByRiderId,
    saveStageplot,
    updateStageplot,
    deleteStageplot,
    getAllStageplots,
    isPro
  }

  return (
    <StagePlotContext.Provider value={value}>
      {children}
    </StagePlotContext.Provider>
  )
}

export function useStageplot() {
  const context = useContext(StagePlotContext)
  if (!context) {
    throw new Error('useStageplot must be used within a StagePlotProvider')
  }
  return context
}
