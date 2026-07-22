import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { initLocalStorage } from './utils/storage';
import './css/theme.css';
import App from './App.jsx';

// Seed database before app renders
initLocalStorage();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
