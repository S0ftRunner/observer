import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css';
import { MainAppWrapper } from './MainAppWrapper.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <MainAppWrapper />
  </StrictMode>,
)
