import { useCallback } from 'react'

/**
 * Hook personalizado para fazer scroll para o topo da página
 * Pode ser usado em qualquer componente que faça navegação
 */
export function useScrollToTop() {
  const scrollToTop = useCallback(() => {
    // Múltiplas abordagens para garantir compatibilidade
    window.scrollTo(0, 0)
    
    // Scroll no documentElement (para maior compatibilidade)
    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
    
    // Scroll no body (fallback)
    if (document.body) {
      document.body.scrollTop = 0
    }
    
    // Scroll no elemento com id "root" se existir
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.scrollTop = 0
    }
    
    // Adicionar um pequeno delay para garantir que funcione em todos os casos
    setTimeout(() => {
      window.scrollTo(0, 0)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
      if (rootElement) {
        rootElement.scrollTop = 0
      }
    }, 100)
  }, [])

  return scrollToTop
}
