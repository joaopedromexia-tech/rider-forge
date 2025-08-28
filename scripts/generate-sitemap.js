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
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`

  routes.forEach(route => {
    sitemap += `  <url>
    <loc>${hostname}${route.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
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
  const sitemapPublicPath = path.join(publicDir, 'sitemap.xml')
  fs.writeFileSync(sitemapPublicPath, sitemap)
  console.log('✅ Sitemap gerado em:', sitemapPublicPath)
  
  // Escrever sitemap diretamente na pasta dist também
  const distDir = path.join(process.cwd(), 'dist')
  if (fs.existsSync(distDir)) {
    const sitemapDistPath = path.join(distDir, 'sitemap.xml')
    fs.writeFileSync(sitemapDistPath, sitemap)
    console.log('✅ Sitemap copiado para:', sitemapDistPath)
  } else {
    console.log('⚠️  Pasta dist não encontrada, será criada durante o build')
  }
}

generateSitemap()
