console.log('main.jsx starting...')

// Test React import
import React from 'react'
console.log('React imported:', typeof React)

// import './polyfills.js'
import { createRoot } from 'react-dom/client'
console.log('createRoot imported:', typeof createRoot)

// import './index.css'
import AppMinimal from './AppMinimal.jsx'
console.log('AppMinimal imported:', typeof AppMinimal)

console.log('main.jsx is loading...')
console.log('Root element:', document.getElementById('root'))

try {
  const root = createRoot(document.getElementById('root'))
  console.log('Root created successfully')
  root.render(React.createElement(AppMinimal))
  console.log('AppMinimal rendered')
} catch (error) {
  console.error('Error in main.jsx:', error)
}
