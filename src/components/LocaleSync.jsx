import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useI18n } from '../context/I18nContext'

// Mantém o locale sincronizado com o path (/pt/... ou /en/...)
export default function LocaleSync() {
  const location = useLocation()
  const { locale, setLocale } = useI18n()

  useEffect(() => {
    const path = location.pathname || ''
    let desired = null
    if (path === '/pt' || path.startsWith('/pt/')) desired = 'pt'
    else if (path === '/en' || path.startsWith('/en/')) desired = 'en'

    if (desired && desired !== locale) {
      setLocale(desired)
    }

    // Atualizar atributo lang no HTML para SEO/A11y
    const html = document.documentElement
    if (html && html.lang !== (desired || locale)) {
      html.setAttribute('lang', desired || locale)
    }
  }, [location.pathname, locale, setLocale])

  return null
}

