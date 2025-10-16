import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './styles/index.css';

// тут нужно запилить провайдер и роутинг
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
)
