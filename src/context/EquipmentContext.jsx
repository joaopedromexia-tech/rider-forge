import { createContext, useContext, useState, useCallback } from 'react'
import { 
  getAllEquipment, 
  getEquipmentByCategory, 
  searchEquipment,
  getBrands 
} from '../data/equipmentLibrary'
import { useAuth } from './AuthContext'

const EquipmentContext = createContext()

export function EquipmentProvider({ children }) {
  const { isPro } = useAuth()
  const [filters, setFilters] = useState({
    brandFilter: '',
    modelQuery: ''
  })

  // Função para obter equipamentos filtrados
  const getFilteredEquipment = useCallback((category = null) => {
    // Filtrar equipamentos baseado no status Pro do usuário
    let equipment = category 
      ? getEquipmentByCategory(category, isPro) // Incluir Pro apenas se usuário for Pro
      : getAllEquipment(isPro) // Incluir Pro apenas se usuário for Pro

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
  }, [filters.brandFilter, filters.modelQuery, isPro])

  // Função para obter marcas disponíveis
  const getAvailableBrands = useCallback(() => {
    // Incluir marcas baseado no status Pro do usuário
    return getBrands(isPro)
  }, [isPro])

  // Função para pesquisar equipamentos
  const searchEquipmentByQuery = useCallback((query) => {
    // Incluir equipamentos baseado no status Pro do usuário
    return searchEquipment(query, isPro)
  }, [isPro])

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
