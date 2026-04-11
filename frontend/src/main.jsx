import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { setupStreamLogFiltering } from './lib/streamLogFilter'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router'  
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Setup Stream SDK log filtering for audio-only sessions
setupStreamLogFiltering()

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

const queryClient = new QueryClient()

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key')
}

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
      </ClerkProvider>
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
)