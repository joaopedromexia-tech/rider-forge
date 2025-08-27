import { Helmet } from 'react-helmet-async'
import { useI18n } from '../context/I18nContext'

const SEO = ({ 
  title, 
  description, 
  keywords, 
  image = '/images/capa_demo.png',
  url = 'https://www.riderforge.app',
  type = 'website'
}) => {
  const { t, locale } = useI18n()

  // Meta tags padrão baseadas no idioma
  const defaultMeta = {
    pt: {
      title: 'Rider Forge - Criador de Riders Técnicos Profissionais',
      description: 'Crie riders técnicos profissionais com facilidade e precisão. Ferramenta online para músicos e técnicos de som criarem riders técnicos completos.',
      keywords: 'rider técnico, rider musical, equipamento musical, técnico de som, produção musical, rider forge, rider técnico profissional',
      lang: 'pt-BR'
    },
    en: {
      title: 'Rider Forge - Professional Technical Rider Creator',
      description: 'Create professional technical riders with ease and precision. Online tool for musicians and sound technicians to create complete technical riders.',
      keywords: 'technical rider, musical rider, musical equipment, sound technician, music production, rider forge, professional technical rider',
      lang: 'en-US'
    }
  }

  const currentMeta = defaultMeta[locale] || defaultMeta.pt
  const finalTitle = title || currentMeta.title
  const finalDescription = description || currentMeta.description
  const finalKeywords = keywords || currentMeta.keywords

  return (
    <Helmet>
      {/* Meta tags básicas */}
      <title>{finalTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="keywords" content={finalKeywords} />
      <meta name="author" content="Rider Forge Team" />
      <meta name="robots" content="index, follow" />
      
      {/* Idioma */}
      <html lang={currentMeta.lang} />
      
      {/* Open Graph */}
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={currentMeta.lang} />
      <meta property="og:site_name" content="Rider Forge" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={image} />
      
      {/* Hreflang para SEO internacional */}
      <link rel="alternate" hrefLang="pt-BR" href="https://www.riderforge.app?lang=pt" />
      <link rel="alternate" hrefLang="en-US" href="https://www.riderforge.app?lang=en" />
      <link rel="alternate" hrefLang="x-default" href="https://www.riderforge.app" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Meta tags adicionais para melhor SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#1e90ff" />
      <meta name="msapplication-TileColor" content="#1e90ff" />
      
      {/* Structured Data para Rich Snippets */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Rider Forge",
          "description": finalDescription,
          "url": "https://www.riderforge.app",
          "applicationCategory": "ProductivityApplication",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "EUR"
          },
          "author": {
            "@type": "Organization",
            "name": "Rider Forge Team"
          },
          "inLanguage": currentMeta.lang
        })}
      </script>
    </Helmet>
  )
}

export default SEO
