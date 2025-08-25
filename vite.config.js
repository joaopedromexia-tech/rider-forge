import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: ['pdfjs-dist', 'buffer', 'process', 'util']
  },
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      buffer: 'buffer',
      process: 'process/browser',
      util: 'util',
    },
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: {
          pdfjs: ['pdfjs-dist']
        }
      }
    },
    assetsInlineLimit: 0,
    cssCodeSplit: true
  },
  assetsInclude: ['**/*.webmanifest']
})
