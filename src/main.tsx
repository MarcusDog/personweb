import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './garden/garden.css'
import './garden/warm.css'
import './garden/studio-upgrade.css'
import App from './garden/GardenApp'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
