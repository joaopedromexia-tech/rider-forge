console.log('main.jsx starting... - Redeploy triggered - VERSION 2.0')

// Test React import
import React from 'react'
console.log('React imported:', typeof React)

import './polyfills.js'
import { createRoot } from 'react-dom/client'
console.log('createRoot imported:', typeof createRoot)

import './index.css'
import App from './App.jsx'
console.log('App imported:', typeof App)

console.log('main.jsx is loading...')
console.log('Root element:', document.getElementById('root'))

try {
  const root = createRoot(document.getElementById('root'))
  console.log('Root created successfully')
  root.render(React.createElement(App))
  console.log('App rendered')
} catch (error) {
  console.error('Error in main.jsx:', error)
}
