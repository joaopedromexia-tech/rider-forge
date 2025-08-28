import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Componente que automaticamente faz scroll para o topo da página
 * sempre que a rota muda
 */
function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Fazer scroll para o topo quando a rota muda
    // Usar scroll instantâneo para evitar delays visuais
    window.scrollTo(0, 0)
    
    // Também tentar fazer scroll no elemento html e body para maior compatibilidade
    if (document.documentElement) {
      document.documentElement.scrollTop = 0
    }
    if (document.body) {
      document.body.scrollTop = 0
    }
    
    // Scroll no elemento com id "root" se existir
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.scrollTop = 0
    }
    
    // Adicionar um pequeno delay para garantir que funcione em todos os casos
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, 0)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0
      }
      if (document.body) {
        document.body.scrollTop = 0
      }
    }, 100)
    
    return () => clearTimeout(timeoutId)
    
    // Alternativa: usar scroll behavior smooth para uma transição mais suave
    // window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return null // Este componente não renderiza nada
}

export default ScrollToTop
