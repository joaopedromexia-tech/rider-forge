console.log('main.jsx starting...')

// Test if React is available
try {
  console.log('React available:', typeof React !== 'undefined')
} catch (e) {
  console.log('React not available:', e)
}

// Test if createRoot is available
try {
  console.log('createRoot available:', typeof createRoot !== 'undefined')
} catch (e) {
  console.log('createRoot not available:', e)
}

// import './polyfills.js'
import { createRoot } from 'react-dom/client'
// import './index.css'
import AppTest from './AppTest.jsx'

console.log('main.jsx is loading...')
console.log('Root element:', document.getElementById('root'))

try {
  const root = createRoot(document.getElementById('root'))
  console.log('Root created successfully')
  root.render(<AppTest />)
  console.log('AppTest rendered')
} catch (error) {
  console.error('Error in main.jsx:', error)
}
