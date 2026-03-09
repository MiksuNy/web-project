import { createRoot } from 'react-dom/client'
import './global.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./context/AuthContext"

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>,
)
