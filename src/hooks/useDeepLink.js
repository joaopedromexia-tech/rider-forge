import { useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

/**
 * Hook para melhorar deep-linking e sincronização de URL
 * Permite navegação programática com histórico limpo
 */
export function useDeepLink() {
  const navigate = useNavigate()
  const location = useLocation()

  // Navegar para uma rota específica
  const navigateTo = useCallback((path, options = {}) => {
    const { replace = false, state = null } = options
    
    if (replace) {
      navigate(path, { replace: true, state })
    } else {
      navigate(path, { state })
    }
  }, [navigate])

  // Navegar para um rider específico
  const navigateToRider = useCallback((riderId, tab = null) => {
    if (tab) {
      navigateTo(`/riders/${riderId}/${tab}`)
    } else {
      navigateTo(`/riders/${riderId}`)
    }
  }, [navigateTo])

  // Navegar para um novo rider
  const navigateToNewRider = useCallback((tab = 'dados-gerais') => {
    navigateTo(`/riders/new/${tab}`)
  }, [navigateTo])

  // Navegar para PDF de um rider
  const navigateToRiderPDF = useCallback((riderId) => {
    navigateTo(`/riders/${riderId}/pdf`)
  }, [navigateTo])

  // Verificar se estamos em uma rota específica
  const isCurrentRoute = useCallback((path) => {
    return location.pathname === path
  }, [location.pathname])

  // Verificar se estamos em um rider específico
  const isCurrentRider = useCallback((riderId) => {
    return location.pathname.startsWith(`/riders/${riderId}`)
  }, [location.pathname])

  // Obter parâmetros da URL atual
  const getCurrentParams = useCallback(() => {
    const pathSegments = location.pathname.split('/').filter(Boolean)
    return {
      riders: pathSegments[0] === 'riders',
      riderId: pathSegments[1] === 'new' ? 'new' : pathSegments[1],
      tab: pathSegments[2],
      isNew: pathSegments[1] === 'new',
      isPDF: pathSegments[2] === 'pdf'
    }
  }, [location.pathname])

  return {
    navigateTo,
    navigateToRider,
    navigateToNewRider,
    navigateToRiderPDF,
    isCurrentRoute,
    isCurrentRider,
    getCurrentParams,
    currentPath: location.pathname
  }
}
