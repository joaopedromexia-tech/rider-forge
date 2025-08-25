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
