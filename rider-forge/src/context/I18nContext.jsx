import { createContext, useContext, useMemo, useState } from 'react'

const I18nContext = createContext()

const MESSAGES = {
  'pt': {
    appTitle: 'Rider Forge',
  },
  'en': {
    appTitle: 'Rider Forge',
  }
}

export function I18nProvider({ children, defaultLocale = 'en' }) {
  const [locale, setLocale] = useState(defaultLocale)

  const t = useMemo(() => {
    const dict = MESSAGES[locale] || MESSAGES.pt
    return (key) => dict[key] || key
  }, [locale])

  const value = {
    locale,
    setLocale,
    t
  }

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}


