// Service Worker placeholder (não registado por defeito)
self.addEventListener('install', (event) => {
  // skip waiting para testes locais se registado manualmente
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // limpeza de caches futura
})

self.addEventListener('fetch', (event) => {
  // fallback offline básico poderia ser implementado aqui
})


