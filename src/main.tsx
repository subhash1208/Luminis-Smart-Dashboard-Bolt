import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
              boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
              borderRadius: '8px',
              padding: '16px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);