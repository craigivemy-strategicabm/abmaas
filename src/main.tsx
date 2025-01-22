import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ABMTiers from "./abmTiersComponent";
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ABMTiers />
  </StrictMode>,
)
