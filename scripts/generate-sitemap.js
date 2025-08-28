import fs from 'fs'
import path from 'path'

const hostname = 'https://www.riderforge.app'
const currentDate = new Date().toISOString()

const routes = [
  {
    url: '/',
    changefreq: 'weekly',
    priority: 1.0
  },
  {
    url: '/pricing',
    changefreq: 'monthly',
    priority: 0.8
  },
  {
    url: '/dashboard',
    changefreq: 'weekly',
    priority: 0.7
  },
  {
    url: '/pro-subscription',
    changefreq: 'monthly',
    priority: 0.6
  }
]

function generateSitemap() {
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`

  routes.forEach(route => {
    sitemap += `  <url>
    <loc>${hostname}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
    <xhtml:link rel="alternate" hreflang="pt-BR" href="${hostname}${route.url}?lang=pt" />
    <xhtml:link rel="alternate" hreflang="en-US" href="${hostname}${route.url}?lang=en" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${hostname}${route.url}" />
  </url>
`
  })

  sitemap += `</urlset>`

  // Criar pasta scripts se não existir
  const scriptsDir = path.join(process.cwd(), 'scripts')
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true })
  }

  // Escrever sitemap na pasta public
  const publicDir = path.join(process.cwd(), 'public')
  const sitemapPath = path.join(publicDir, 'sitemap.xml')
  
  fs.writeFileSync(sitemapPath, sitemap)
  console.log('✅ Sitemap gerado com sucesso em:', sitemapPath)
}

generateSitemap()
