# Guia do Sitemap Automático

## ✅ Sitemap Configurado com Sucesso!

O sitemap do RiderForge agora é **gerado automaticamente** e atualiza-se sempre que fizer um build.

## Como Funciona

### 1. **Geração Automática**
- O sitemap é gerado automaticamente durante o build
- A data de última modificação é sempre atualizada para a data atual
- Não há mais necessidade de editar manualmente o arquivo XML

### 2. **Comandos Disponíveis**

```bash
# Build normal (sem atualizar sitemap)
npm run build

# Build com geração automática do sitemap
npm run build:sitemap

# Apenas gerar o sitemap (sem fazer build)
node scripts/generate-sitemap.js
```

### 3. **Páginas Incluídas**

O sitemap inclui automaticamente:
- **/** - Página principal (prioridade: 1.0, atualização: semanal)
- **/pricing** - Página de preços (prioridade: 0.8, atualização: mensal)
- **/dashboard** - Dashboard (prioridade: 0.7, atualização: semanal)
- **/pro-subscription** - Subscrição Pro (prioridade: 0.6, atualização: mensal)

### 4. **Funcionalidades**

- ✅ **Data automática**: Sempre atualizada para a data atual
- ✅ **Suporte multilíngue**: Inclui links para PT-BR e EN-US
- ✅ **Prioridades otimizadas**: Cada página tem prioridade específica
- ✅ **Frequência de atualização**: Configurada por página
- ✅ **Sem duplicatas**: Cada URL aparece apenas uma vez

### 5. **Adicionar Novas Páginas**

Para adicionar uma nova página ao sitemap, edite o arquivo `scripts/generate-sitemap.js`:

```javascript
const routes = [
  // ... páginas existentes ...
  {
    url: '/nova-pagina',
    changefreq: 'weekly', // ou 'monthly', 'yearly'
    priority: 0.5 // entre 0.0 e 1.0
  }
]
```

### 6. **Deploy**

Quando fizer deploy:
1. Use `npm run build:sitemap` para gerar o build com sitemap atualizado
2. O sitemap será automaticamente incluído na pasta `dist/`
3. O Vercel irá servir o sitemap em `https://www.riderforge.app/sitemap.xml`

## Benefícios

- 🚀 **Automatização**: Não precisa mais editar manualmente
- 📅 **Sempre atualizado**: Data de modificação sempre correta
- 🔍 **SEO otimizado**: Prioridades e frequências configuradas
- 🌍 **Multilíngue**: Suporte para PT-BR e EN-US
- ⚡ **Rápido**: Geração em segundos durante o build

## Arquivos Modificados

- ✅ `scripts/generate-sitemap.js` - Script de geração
- ✅ `package.json` - Novo comando `build:sitemap`
- ✅ `public/sitemap.xml` - Gerado automaticamente
- ✅ `vite.config.js` - Removido plugin desnecessário

O sitemap agora atualiza-se **automaticamente** sempre que fizer um build! 🎉
