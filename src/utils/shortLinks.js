// Sistema de links curtos para partilha de riders
const SHORT_LINKS_KEY = 'riderForge_shortLinks'

// Gerar ID único curto
export function generateShortId() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// Salvar rider com link curto
export function saveShortLink(riderData) {
  try {
    const shortId = generateShortId()
    const shortLinks = getShortLinks()
    
    // Adicionar timestamp para limpeza automática
    const linkData = {
      ...riderData,
      shortId,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 dias
    }
    
    shortLinks[shortId] = linkData
    
    // Limpar links expirados
    cleanupExpiredLinks(shortLinks)
    
    // Salvar no localStorage
    localStorage.setItem(SHORT_LINKS_KEY, JSON.stringify(shortLinks))
    
    return shortId
  } catch (error) {
    console.error('Erro ao salvar link curto:', error)
    return null
  }
}

// Obter rider por link curto
export function getRiderByShortId(shortId) {
  try {
    const shortLinks = getShortLinks()
    const linkData = shortLinks[shortId]
    
    if (!linkData) {
      return null
    }
    
    // Verificar se expirou
    if (new Date(linkData.expiresAt) < new Date()) {
      delete shortLinks[shortId]
      localStorage.setItem(SHORT_LINKS_KEY, JSON.stringify(shortLinks))
      return null
    }
    
    return linkData
  } catch (error) {
    console.error('Erro ao obter rider por link curto:', error)
    return null
  }
}

// Obter todos os links curtos
function getShortLinks() {
  try {
    const stored = localStorage.getItem(SHORT_LINKS_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Erro ao obter links curtos:', error)
    return {}
  }
}

// Limpar links expirados
function cleanupExpiredLinks(shortLinks) {
  const now = new Date()
  Object.keys(shortLinks).forEach(shortId => {
    if (new Date(shortLinks[shortId].expiresAt) < now) {
      delete shortLinks[shortId]
    }
  })
}

// Gerar URL curta
export function generateShortUrl(shortId) {
  return `${window.location.origin}/s/${shortId}`
}

// Verificar se uma URL é um link curto
export function isShortLink(pathname) {
  return pathname.startsWith('/s/')
}

// Extrair shortId de uma URL
export function extractShortId(pathname) {
  const match = pathname.match(/^\/s\/([A-Za-z0-9]{8})$/)
  return match ? match[1] : null
}
