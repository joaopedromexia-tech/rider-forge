import { createContext, useContext, useMemo, useState } from 'react'
import pt from '../locales/pt.json'
import en from '../locales/en.json'

const I18nContext = createContext()

const MESSAGES = { pt, en }

export function I18nProvider({ children, defaultLocale = 'en' }) {
  const [locale, setLocale] = useState(() => {
    try {
      return localStorage.getItem('riderForge_locale') || defaultLocale
    } catch {
      return defaultLocale
    }
  })

  const t = useMemo(() => {
    const dict = MESSAGES[locale] || MESSAGES.en
    return (key, params) => {
      let str = dict[key] ?? key
      if (params && typeof params === 'object') {
        Object.entries(params).forEach(([k, v]) => {
          str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
        })
      }
      return str
    }
  }, [locale])

  const value = {
    locale,
    setLocale: (l) => {
      console.log('🔍 I18nContext: Setting locale to:', l, 'Current:', locale)
      try { localStorage.setItem('riderForge_locale', l) } catch {}
      setLocale(l)
    },
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


