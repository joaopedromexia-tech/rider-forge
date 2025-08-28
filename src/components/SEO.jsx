
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

  return null
}

export default SEO
