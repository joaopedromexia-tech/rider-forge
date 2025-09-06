import React, { createContext, useContext, useState, useCallback } from 'react'
import FeedbackContainer from '../components/FeedbackContainer'

const GlobalFeedbackContext = createContext()

export const useGlobalFeedback = () => {
  const context = useContext(GlobalFeedbackContext)
  if (!context) {
    throw new Error('useGlobalFeedback must be used within a GlobalFeedbackProvider')
  }
  return context
}

export const GlobalFeedbackProvider = ({ children }) => {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random()
    const newToast = { id, message, type, duration }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove após duração
    setTimeout(() => {
      removeToast(id)
    }, duration)
    
    return id
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])

  const showSuccess = useCallback((message, duration) => {
    return showToast(message, 'success', duration)
  }, [showToast])

  const showError = useCallback((message, duration) => {
    return showToast(message, 'error', duration)
  }, [showToast])

  const showWarning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration)
  }, [showToast])

  const showInfo = useCallback((message, duration) => {
    return showToast(message, 'info', duration)
  }, [showToast])

  const clearAllToasts = useCallback(() => {
    setToasts([])
  }, [])

  const value = {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearAllToasts
  }

  return (
    <GlobalFeedbackContext.Provider value={value}>
      {children}
      <FeedbackContainer toasts={toasts} onRemoveToast={removeToast} />
    </GlobalFeedbackContext.Provider>
  )
}
