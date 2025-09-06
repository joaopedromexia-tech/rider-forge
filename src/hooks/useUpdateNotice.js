import { useState, useEffect } from 'react'
import { UPDATE_CONFIG, shouldShowUpdateNotice, markVersionAsSeen, dismissUpdateNotice } from '../config/updateConfig'

export const useUpdateNotice = () => {
  const [shouldShowNotice, setShouldShowNotice] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (shouldShowUpdateNotice()) {
      // Show notice after a short delay
      const timer = setTimeout(() => {
        setShouldShowNotice(true)
        // Mark as seen immediately when shown
        markVersionAsSeen()
      }, UPDATE_CONFIG.showDelay)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const dismissNotice = () => {
    setShouldShowNotice(false)
    setIsDismissed(true)
    dismissUpdateNotice()
  }

  const showNotice = () => {
    setShouldShowNotice(true)
    setIsDismissed(false)
  }

  const resetNotice = () => {
    localStorage.removeItem('riderForge_updateNotice_dismissed')
    localStorage.removeItem('riderForge_lastSeenVersion')
    setShouldShowNotice(false)
    setIsDismissed(false)
  }

  return {
    shouldShowNotice,
    isDismissed,
    dismissNotice,
    showNotice,
    resetNotice
  }
}
