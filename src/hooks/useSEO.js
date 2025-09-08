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
  canonical,
  alternates
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

    // Função para atualizar alternates (hreflang)
    const updateAlternates = (altList) => {
      // Remover alternates previamente gerados por este hook
      document.querySelectorAll('link[rel="alternate"][data-generated="seo-hook"]').forEach((el) => el.parentNode.removeChild(el))
      if (!Array.isArray(altList)) return
      altList.forEach((alt) => {
        if (!alt?.href || !alt?.hreflang) return
        const link = document.createElement('link')
        link.setAttribute('rel', 'alternate')
        link.setAttribute('hreflang', alt.hreflang)
        link.setAttribute('href', alt.href)
        link.setAttribute('data-generated', 'seo-hook')
        document.head.appendChild(link)
      })
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

    // Atualizar alternates hreflang
    if (alternates) {
      updateAlternates(alternates)
    }

    // Cleanup function - restaurar valores padrão quando o componente desmontar
    return () => {
      // Restaurar título padrão (EN para consistência com index.html)
      document.title = 'Rider Forge - Professional Technical Rider Creator | Software for Musicians'
      
      // Restaurar meta tags padrão
      updateMetaTag('description', 'Create professional technical riders with ease. Complete software for musicians, sound technicians and producers. Professional templates, PDF export and real-time collaboration.')
      updateMetaTag('robots', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
      
      // Restaurar Open Graph padrão
      updateMetaTag('og:title', 'Rider Forge - Professional Technical Rider Creator', true)
      updateMetaTag('og:description', 'Create professional technical riders with ease. Complete software for musicians, sound technicians and producers. Professional templates, PDF export and real-time collaboration.', true)
      updateMetaTag('og:url', 'https://www.riderforge.app/', true)
      updateMetaTag('og:type', 'website', true)
      
      // Restaurar Twitter Cards padrão
      updateMetaTag('twitter:title', 'Rider Forge - Professional Technical Rider Creator')
      updateMetaTag('twitter:description', 'Create professional technical riders with ease. Complete software for musicians, sound technicians and producers.')
      
      // Restaurar canonical padrão
      updateCanonical('https://www.riderforge.app/')
    }
  }, [title, description, keywords, image, url, type, noIndex, canonical, JSON.stringify(alternates)])
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
    canonical,
    alternates
  } = pageConfig

  useSEO({
    title: title ? `${title} | Rider Forge` : undefined,
    description,
    keywords,
    image,
    url,
    type,
    noIndex,
    canonical: canonical || url,
    alternates
  })
}

/**
 * Configurações SEO pré-definidas para páginas comuns
 */
export const SEO_CONFIGS = {
  home: {
    title: 'RiderForge - Professional Technical Rider & Stage Plot Creator',
    description: 'Create professional technical riders and stage plots for concerts and events. Free online tool for audio engineers, bands, and music professionals. Technical rider template generator.',
    keywords: 'technical rider, stage plot, audio equipment list, music rider template, live sound equipment, concert rider, band rider, technical rider template, stage plot generator, audio rider creator, music equipment checklist, live music rider, sound engineer tools, concert equipment list, band stage plot, musician rider template, free technical rider template, professional stage plot software, audio equipment management, sound check list, live audio production',
    image: 'https://www.riderforge.app/images/og-image.png',
    url: 'https://www.riderforge.app/',
    type: 'website'
  },
  
  pricing: {
    title: 'Pricing & Plans - Technical Rider Software',
    description: 'Compare Free and Pro plans for RiderForge. Free technical rider templates available. Pro plan with unlimited riders, premium equipment library, and advanced features.',
    keywords: 'technical rider software pricing, free technical rider template, pro audio software plans, stage plot software pricing, audio equipment software subscription, music production tools pricing, sound engineer software plans, professional rider creator pricing',
    image: 'https://www.riderforge.app/images/pricing-og.png',
    url: 'https://www.riderforge.app/pricing',
    type: 'website'
  },
  
  dashboard: {
    title: 'Dashboard - Manage Technical Riders',
    description: 'Manage all your technical riders in one place. Create, edit, export and organize professional riders with ease. Access your rider library and templates.',
    keywords: 'technical rider dashboard, manage riders, rider management software, audio equipment management, stage plot management, music rider organization, sound engineer dashboard, professional rider tools',
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
