#!/usr/bin/env node

/**
 * Script para gerar sitemap.xml automaticamente
 * Baseado nas rotas da aplicação React
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Configurações
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const BASE_URL = 'https://www.riderforge.app'
const OUTPUT_FILE = path.join(__dirname, '../public/sitemap.xml')
const LAST_MOD = new Date().toISOString()

// Rotas da aplicação com suas configurações SEO
const routes = [
  {
    path: '/',
    priority: '1.0',
    changefreq: 'weekly',
    title: 'Rider Forge - Professional Technical Rider Creator',
    description: 'Home page (EN)'
  },
  {
    path: '/pt',
    priority: '0.9',
    changefreq: 'weekly',
    title: 'Rider Forge - Criador Profissional de Riders Técnicos',
    description: 'Página inicial (PT)'
  },
  {
    path: '/pricing',
    priority: '0.9',
    changefreq: 'monthly',
    title: 'Preços e Planos',
    description: 'Página de preços e planos do Rider Forge'
  },
  // Dashboard removido do sitemap (área de usuário)
  {
    path: '/pro-subscription',
    priority: '0.7',
    changefreq: 'monthly',
    title: 'Assinatura Pro',
    description: 'Página de assinatura Pro'
  },
  {
    path: '/support',
    priority: '0.6',
    changefreq: 'monthly',
    title: 'Suporte e Ajuda',
    description: 'Página de suporte'
  },
  {
    path: '/technical-rider',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'What is a Technical Rider?',
    description: 'Landing page EN'
  },
  {
    path: '/pt/rider-tecnico',
    priority: '0.8',
    changefreq: 'monthly',
    title: 'O que é um Rider Técnico?',
    description: 'Landing page PT'
  },
  {
    path: '/faq',
    priority: '0.6',
    changefreq: 'monthly',
    title: 'Perguntas Frequentes',
    description: 'FAQ do Rider Forge'
  },
  {
    path: '/terms-privacy',
    priority: '0.4',
    changefreq: 'yearly',
    title: 'Termos de Uso e Privacidade',
    description: 'Termos e política de privacidade'
  }
]

// Função para gerar o XML do sitemap
function generateSitemapXML() {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`

  const xmlFooter = `
</urlset>`

  const urlEntries = routes.map(route => {
    const fullUrl = `${BASE_URL}${route.path}`
    return `  
  <!-- ${route.description} -->
  <url>
    <loc>${fullUrl}</loc>
    <lastmod>${LAST_MOD}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  }).join('\n')

  return xmlHeader + urlEntries + xmlFooter
}

// Função principal
function main() {
  try {
    console.log('🔄 Gerando sitemap.xml...')
    
    const sitemapXML = generateSitemapXML()
    
    // Criar diretório se não existir
    const outputDir = path.dirname(OUTPUT_FILE)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }
    
    // Escrever arquivo
    fs.writeFileSync(OUTPUT_FILE, sitemapXML, 'utf8')
    
    console.log('✅ Sitemap gerado com sucesso!')
    console.log(`📁 Localização: ${OUTPUT_FILE}`)
    console.log(`🔗 URLs incluídas: ${routes.length}`)
    console.log(`📅 Última modificação: ${LAST_MOD}`)
    
    // Mostrar estatísticas
    console.log('\n📊 Estatísticas:')
    routes.forEach(route => {
      console.log(`  • ${route.path} (prioridade: ${route.priority}, frequência: ${route.changefreq})`)
    })
    
  } catch (error) {
    console.error('❌ Erro ao gerar sitemap:', error.message)
    process.exit(1)
  }
}

// Executar se chamado diretamente
main()
