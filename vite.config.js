import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

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
  preview: {
    port: 5173
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
          // Vendor chunks - separar bibliotecas pesadas
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'pdf-vendor': ['pdfjs-dist', '@react-pdf/renderer', 'jspdf', 'html2canvas'],
          'stripe-vendor': ['@stripe/stripe-js', 'stripe'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'analytics-vendor': ['@vercel/analytics', '@vercel/speed-insights'],
          'utils-vendor': ['buffer', 'process', 'util']
        }
      }
    },
    assetsInlineLimit: 0,
    cssCodeSplit: true,
    chunkSizeWarningLimit: 1000
  },
  assetsInclude: ['**/*.webmanifest'],
  publicDir: 'public'
})
