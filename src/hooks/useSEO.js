import { useEffect } from 'react'

/**
 * Hook personalizado para gerenciar SEO dinamicamente
 * Funciona sem React Helmet, usando manipulação direta do DOM
 */
export const useSEO = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  noIndex = false,
  canonical
}) => {
  useEffect(() => {
    console.log('🔍 SEO Hook: Atualizando meta tags para:', { title, description, url })
    
    // Função para atualizar meta tags
    const updateMetaTag = (name, content, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`
      let meta = document.querySelector(selector)
      
      if (!meta) {
        meta = document.createElement('meta')
        if (property) {
          meta.setAttribute('property', name)
        } else {
          meta.setAttribute('name', name)
        }
        document.head.appendChild(meta)
      }
      
      meta.setAttribute('content', content)
    }

    // Função para atualizar título
    const updateTitle = (newTitle) => {
      if (newTitle) {
        document.title = newTitle
      }
    }

    // Função para atualizar canonical
    const updateCanonical = (canonicalUrl) => {
      let canonicalLink = document.querySelector('link[rel="canonical"]')
      
      if (!canonicalLink) {
        canonicalLink = document.createElement('link')
        canonicalLink.setAttribute('rel', 'canonical')
        document.head.appendChild(canonicalLink)
      }
      
      canonicalLink.setAttribute('href', canonicalUrl)
    }

    // Atualizar título
    if (title) {
      console.log('🔍 SEO Hook: Atualizando título para:', title)
      updateTitle(title)
    }

    // Atualizar meta tags básicas
    if (description) {
      updateMetaTag('description', description)
    }

    if (keywords) {
      updateMetaTag('keywords', keywords)
    }

    // Atualizar robots
    if (noIndex) {
      updateMetaTag('robots', 'noindex, nofollow')
    } else {
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }

    // Atualizar Open Graph
    if (title) {
      updateMetaTag('og:title', title, true)
    }
    
    if (description) {
      updateMetaTag('og:description', description, true)
    }
    
    if (image) {
      updateMetaTag('og:image', image, true)
    }
    
    if (url) {
      updateMetaTag('og:url', url, true)
    }
    
    updateMetaTag('og:type', type, true)

    // Atualizar Twitter Cards
    if (title) {
      updateMetaTag('twitter:title', title)
    }
    
    if (description) {
      updateMetaTag('twitter:description', description)
    }
    
    if (image) {
      updateMetaTag('twitter:image', image)
    }

    // Atualizar canonical
    if (canonical) {
      updateCanonical(canonical)
    }

    // Cleanup function - restaurar valores padrão quando o componente desmontar
    return () => {
      // Restaurar título padrão
      document.title = 'Rider Forge - Criador Profissional de Riders Técnicos | Software para Músicos'
      
      // Restaurar meta tags padrão
      updateMetaTag('description', 'Crie riders técnicos profissionais com facilidade. Software completo para músicos, técnicos de som e produtores. Templates profissionais, exportação PDF e colaboração em tempo real.')
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
      
      // Restaurar Open Graph padrão
      updateMetaTag('og:title', 'Rider Forge - Criador Profissional de Riders Técnicos', true)
      updateMetaTag('og:description', 'Crie riders técnicos profissionais com facilidade. Software completo para músicos, técnicos de som e produtores. Templates profissionais, exportação PDF e colaboração em tempo real.', true)
      updateMetaTag('og:url', 'https://www.riderforge.app/', true)
      updateMetaTag('og:type', 'website', true)
      
      // Restaurar Twitter Cards padrão
      updateMetaTag('twitter:title', 'Rider Forge - Criador Profissional de Riders Técnicos')
      updateMetaTag('twitter:description', 'Crie riders técnicos profissionais com facilidade. Software completo para músicos, técnicos de som e produtores.')
      
      // Restaurar canonical padrão
      updateCanonical('https://www.riderforge.app/')
    }
  }, [title, description, keywords, image, url, type, noIndex, canonical])
}

/**
 * Hook para SEO específico de páginas
 */
export const usePageSEO = (pageConfig) => {
  const {
    title,
    description,
    keywords,
    image,
    url,
    type = 'website',
    noIndex = false,
    canonical
  } = pageConfig

  useSEO({
    title: title ? `${title} | Rider Forge` : undefined,
    description,
    keywords,
    image,
    url,
    type,
    noIndex,
    canonical
  })
}

/**
 * Configurações SEO pré-definidas para páginas comuns
 */
export const SEO_CONFIGS = {
  home: {
    title: 'Rider Forge - Criador Profissional de Riders Técnicos',
    description: 'Crie riders técnicos profissionais com facilidade. Software completo para músicos, técnicos de som e produtores. Templates profissionais, exportação PDF e colaboração em tempo real.',
    keywords: 'rider técnico, rider musical, técnico de som, produção musical, equipamento de som, PA system, monitor mixes, input list, rider profissional',
    image: 'https://www.riderforge.app/images/og-image.png',
    url: 'https://www.riderforge.app/',
    type: 'website'
  },
  
  pricing: {
    title: 'Preços e Planos',
    description: 'Compare os planos do Rider Forge. Versão gratuita disponível e planos Pro com recursos avançados para profissionais.',
    keywords: 'preços rider forge, planos, assinatura, versão gratuita, plano pro',
    image: 'https://www.riderforge.app/images/pricing-og.png',
    url: 'https://www.riderforge.app/pricing',
    type: 'website'
  },
  
  dashboard: {
    title: 'Dashboard - Meus Riders',
    description: 'Gerencie todos os seus riders técnicos em um só lugar. Crie, edite e organize seus riders profissionais.',
    keywords: 'dashboard, meus riders, gestão riders, organização',
    image: 'https://www.riderforge.app/images/dashboard-og.png',
    url: 'https://www.riderforge.app/dashboard',
    type: 'website'
  },
  
  support: {
    title: 'Suporte e Ajuda',
    description: 'Precisa de ajuda com o Rider Forge? Encontre tutoriais, FAQ e entre em contato com nossa equipe de suporte.',
    keywords: 'suporte, ajuda, tutorial, faq, contato',
    image: 'https://www.riderforge.app/images/support-og.png',
    url: 'https://www.riderforge.app/support',
    type: 'website'
  },
  
  faq: {
    title: 'Perguntas Frequentes',
    description: 'Respostas para as perguntas mais comuns sobre o Rider Forge. Tudo que você precisa saber sobre o criador de riders técnicos.',
    keywords: 'faq, perguntas frequentes, dúvidas, ajuda',
    image: 'https://www.riderforge.app/images/faq-og.png',
    url: 'https://www.riderforge.app/faq',
    type: 'website'
  },
  
  terms: {
    title: 'Termos de Uso e Privacidade',
    description: 'Termos de uso e política de privacidade do Rider Forge. Saiba como protegemos seus dados e direitos.',
    keywords: 'termos de uso, privacidade, política, direitos',
    image: 'https://www.riderforge.app/images/terms-og.png',
    url: 'https://www.riderforge.app/terms-privacy',
    type: 'website'
  }
}
