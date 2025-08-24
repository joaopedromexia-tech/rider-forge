import { createContext, useContext, useState, useCallback } from 'react'
import { 
  getAllEquipment, 
  getEquipmentByCategory, 
  searchEquipment,
  getBrands 
} from '../data/equipmentLibrary'
import { useRider } from './RiderContext'

const EquipmentContext = createContext()

export function EquipmentProvider({ children }) {
  const { isPro } = useRider()
  const [filters, setFilters] = useState({
    brandFilter: '',
    modelQuery: ''
  })

  // Função para obter equipamentos filtrados
  const getFilteredEquipment = useCallback((category = null) => {
    // Agora retornamos todos os equipamentos (Free + Pro) para todos os usuários
    let equipment = category 
      ? getEquipmentByCategory(category, true) // Sempre incluir Pro
      : getAllEquipment(true) // Sempre incluir Pro

    // Aplicar filtros
    if (filters.brandFilter) {
      equipment = equipment.filter(item => item.marca === filters.brandFilter)
    }

    if (filters.modelQuery) {
      const query = filters.modelQuery.toLowerCase()
      equipment = equipment.filter(item => 
        item.modelo.toLowerCase().includes(query) ||
        item.marca.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return equipment
  }, [filters.brandFilter, filters.modelQuery])

  // Função para obter marcas disponíveis
  const getAvailableBrands = useCallback(() => {
    // Incluir todas as marcas (Free + Pro)
    return getBrands(true)
  }, [])

  // Função para pesquisar equipamentos
  const searchEquipmentByQuery = useCallback((query) => {
    // Incluir todos os equipamentos na pesquisa
    return searchEquipment(query, true)
  }, [])

  // Função para atualizar filtros
  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }, [])

  // Função para limpar filtros
  const clearFilters = useCallback(() => {
    setFilters({
      brandFilter: '',
      modelQuery: ''
    })
  }, [])

  const value = {
    isPro,
    filters,
    getFilteredEquipment,
    getAvailableBrands,
    searchEquipmentByQuery,
    updateFilters,
    clearFilters
  }

  return (
    <EquipmentContext.Provider value={value}>
      {children}
    </EquipmentContext.Provider>
  )
}

export function useEquipment() {
  const context = useContext(EquipmentContext)
  if (!context) {
    throw new Error('useEquipment must be used within an EquipmentProvider')
  }
  return context
}
