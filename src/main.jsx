import './polyfills.js'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppSimple from './AppSimple.jsx'

createRoot(document.getElementById('root')).render(
  <AppSimple />
)
