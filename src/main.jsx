console.log('main.jsx starting...')

// import './polyfills.js'
import { createRoot } from 'react-dom/client'
// import './index.css'
import AppMinimal from './AppMinimal.jsx'

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
