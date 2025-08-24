import { useState, useCallback } from 'react'

export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState)
  const [loadingText, setLoadingText] = useState('')

  const startLoading = useCallback((text = 'Carregando...') => {
    setIsLoading(true)
    setLoadingText(text)
  }, [])

  const stopLoading = useCallback(() => {
    setIsLoading(false)
    setLoadingText('')
  }, [])

  const withLoading = useCallback(async (asyncFunction, loadingMessage = 'Processando...') => {
    try {
      startLoading(loadingMessage)
      const result = await asyncFunction()
      return result
    } finally {
      stopLoading()
    }
  }, [startLoading, stopLoading])

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading
  }
}

