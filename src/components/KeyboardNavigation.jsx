import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useScrollToTop } from '../hooks/useScrollToTop'

/**
 * Componente para melhorar navegação por teclado
 * Permite navegação rápida com atalhos de teclado
 */
function KeyboardNavigation() {
  const navigate = useNavigate()
  const scrollToTop = useScrollToTop()

  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ignorar se estiver em um input, textarea ou select
      if (event.target.tagName === 'INPUT' || 
          event.target.tagName === 'TEXTAREA' || 
          event.target.tagName === 'SELECT' ||
          event.target.contentEditable === 'true') {
        return
      }

      // Ctrl/Cmd + K - Navegar para home
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        scrollToTop()
        navigate('/')
      }

      // Ctrl/Cmd + R - Navegar para riders
      if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
        event.preventDefault()
        scrollToTop()
        navigate('/riders')
      }

      // Ctrl/Cmd + N - Novo rider
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault()
        scrollToTop()
        navigate('/riders/new/dados-gerais')
      }

      // Ctrl/Cmd + P - Pricing
      if ((event.ctrlKey || event.metaKey) && event.key === 'p') {
        event.preventDefault()
        scrollToTop()
        navigate('/pricing')
      }

      // Ctrl/Cmd + H - Help/FAQ
      if ((event.ctrlKey || event.metaKey) && event.key === 'h') {
        event.preventDefault()
        scrollToTop()
        navigate('/faq')
      }

      // Escape - Voltar atrás
      if (event.key === 'Escape') {
        event.preventDefault()
        scrollToTop()
        navigate(-1)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [navigate])

  return null
}

export default KeyboardNavigation
