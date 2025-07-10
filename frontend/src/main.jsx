import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './App.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GoogleOAuthProvider } from '@react-oauth/google'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <AuthProvider>
      <StrictMode>
        <App />
      </StrictMode>
    </AuthProvider>
  </GoogleOAuthProvider>
)
