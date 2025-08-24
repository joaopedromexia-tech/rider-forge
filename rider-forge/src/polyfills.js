// Polyfills for Node.js APIs in browser environment
import { Buffer } from 'buffer'
import process from 'process'

// Make Buffer available globally
window.Buffer = Buffer

// Make process available globally
window.process = process

// Ensure global is available
if (typeof global === 'undefined') {
  window.global = window
}

// Additional polyfills that react-pdf might need
if (typeof window !== 'undefined') {
  // Ensure crypto is available
  if (!window.crypto) {
    window.crypto = window.msCrypto || {}
  }
  
  // TextEncoder and TextDecoder are already available in modern browsers
  // No need to polyfill them
}
